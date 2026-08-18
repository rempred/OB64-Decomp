from __future__ import annotations

from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.capture_db import (
    CaptureStore,
    RawEventInput,
    SessionMetadata,
)
from tools.total_resolver.contracts import CaptureMode, InterventionPolicy
from tools.total_resolver.manifest import finalize_manifest
from tools.total_resolver.replay import build_timeline, write_timeline
from tools.total_resolver.schema import open_capture_database
from tools.total_resolver.verify import verify_session


REPOSITORY_ROOT = Path(__file__).resolve().parents[3]


def metadata(session_id: str = "S1") -> SessionMetadata:
    return SessionMetadata(
        session_id=session_id,
        started_utc="2026-08-17T00:00:00.000Z",
        tool_version="0.1.0",
        tool_git_commit=None,
        decomp_git_commit="A" * 40,
        decomp_dirty=True,
        project64_branch="ob64-core",
        project64_git_commit="B" * 40,
        bridge_version="0.7.2",
        bridge_port=64640,
        bridge_epoch="EPOCH-S1",
        bridge_next_sequence_start=1,
        cpu_core="interpreter",
        rom_crc1="12345678",
        rom_crc2="9ABCDEF0",
        rom_country="0x45",
        rom_version=0,
        rom_normalized_sha256="C" * 64,
        static_sources={"schema": "fixture", "sha256": "D" * 64},
        capture_mode=CaptureMode.MANUAL_PLAY,
        intervention_policy=InterventionPolicy.OBSERVATION_ONLY,
    )


def raw_event(
    *,
    stream: str,
    stream_sequence: int,
    batch_index: int,
    host_ns: int,
    kind: str,
    frame: int = 10,
    dropped: int = 0,
    status: str = "accepted",
) -> RawEventInput:
    return RawEventInput(
        frame_number=frame,
        host_monotonic_ns=host_ns,
        observed_utc="2026-08-17T00:00:00.100Z",
        bridge_stream=stream,
        bridge_epoch="EPOCH-S1",
        bridge_event_sequence=None if stream == "recorder" else stream_sequence,
        recorder_batch_id=1,
        recorder_batch_index=batch_index,
        bridge_event_type=kind,
        payload={
            "kind": kind,
            "frameCount": frame,
            **(
                {}
                if stream == "recorder"
                else {
                    "bridgeEpoch": "EPOCH-S1",
                    "bridgeSequence": stream_sequence,
                    "bridgeStream": stream,
                }
            ),
        },
        ingestion_status=status,
        bridge_queue_remaining=0,
        bridge_dropped_total=dropped,
    )


def create_closed_session(root: Path, *, event_loss: bool = False) -> Path:
    session_dir = root / "S1"
    store = CaptureStore.create(session_dir / "capture.sqlite", metadata())
    events = [
        raw_event(stream="watch", stream_sequence=1, batch_index=0, host_ns=100, kind="exec"),
        raw_event(stream="dma", stream_sequence=2, batch_index=1, host_ns=101, kind="dma"),
    ]
    if event_loss:
        events.append(
            raw_event(
                stream="recorder",
                stream_sequence=1,
                batch_index=2,
                host_ns=102,
                kind="event-loss",
                dropped=1,
                status="loss-marker",
            )
        )
    store.append_event_batch(events)
    if event_loss:
        store.record_bridge_loss_range(
            bridge_epoch="EPOCH-S1", first_sequence=3, last_sequence=3
        )
    store.record_frame_sample(
        frame_number=10,
        host_monotonic_ns=103,
        execution_state="running-or-system-paused",
        system_paused=False,
        debug_paused=False,
        frame_hash=None,
        configuration_sha256=None,
        queue_depth=0,
        dropped_total=1 if event_loss else 0,
    )
    store.record_health(
        frame_number=10,
        host_monotonic_ns=104,
        queue_depth=0,
        queue_high_water=2,
        dropped_total=1 if event_loss else 0,
        drain_interval_ms=10.0,
        longest_drain_stall_ms=10.0,
        frame_poll_latency_ms=1.0,
        cpu_core="interpreter",
        bridge_reconnects=0,
        watch_failures=0,
        recorder_exceptions=0,
        continuity_status="broken" if event_loss else "continuous",
    )
    store.add_marker("World Map", marker_type="stable-state", frame_number=10)
    if event_loss:
        store.set_continuity_broken("synthetic loss")
    store.set_bridge_next_sequence_end(4 if event_loss else 3)
    store.close_session("closed")
    finalize_manifest(store.connection, session_dir, REPOSITORY_ROOT)
    write_timeline(store.connection, session_dir / "timeline.json")
    store.close_connection()
    return session_dir


class CaptureLifecycleTests(unittest.TestCase):
    def test_closed_session_verifies_and_replays_deterministically(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            session_dir = create_closed_session(Path(raw))
            result = verify_session(session_dir, REPOSITORY_ROOT)
            self.assertTrue(result.ok, result.to_dict())

            connection = open_capture_database(session_dir / "capture.sqlite", read_only=True)
            try:
                first = build_timeline(connection)
                second = build_timeline(connection)
            finally:
                connection.close()
            self.assertEqual(first, second)
            self.assertEqual(first["timeline"]["eventCount"], 2)
            self.assertEqual(
                [event["bridgeStream"] for event in first["timeline"]["events"]],
                ["watch", "dma"],
            )

    def test_closed_store_rejects_application_writes(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            session_dir = create_closed_session(Path(raw))
            store = CaptureStore.open(session_dir / "capture.sqlite", mirror_events=False)
            try:
                with self.assertRaisesRegex(RuntimeError, "immutable after closure"):
                    store.add_marker("Too late", marker_type="note", frame_number=11)
            finally:
                store.close_connection()

    def test_visible_loss_marker_supports_broken_continuity(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            session_dir = create_closed_session(Path(raw), event_loss=True)
            result = verify_session(session_dir, REPOSITORY_ROOT)
            self.assertTrue(result.ok, result.to_dict())

    def test_post_close_payload_mutation_is_detected(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            session_dir = create_closed_session(Path(raw))
            connection = sqlite3.connect(session_dir / "capture.sqlite")
            try:
                connection.execute(
                    "UPDATE event_sequence SET raw_payload_json='{}' WHERE sequence_id=1"
                )
                connection.commit()
            finally:
                connection.close()
            result = verify_session(session_dir, REPOSITORY_ROOT)
            self.assertFalse(result.ok)
            failed = {check["name"] for check in result.checks if check["status"] == "FAIL"}
            self.assertIn("event-payload-hashes", failed)
            self.assertIn("session-manifest", failed)


if __name__ == "__main__":
    unittest.main()
