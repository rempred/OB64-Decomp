from __future__ import annotations

from pathlib import Path
import json
import tempfile
import unittest
from unittest.mock import patch
from typing import Any

from tools.total_resolver.capture_db import CaptureStore, SessionMetadata
from tools.total_resolver.contracts import CaptureMode, InterventionPolicy
from tools.total_resolver.sessions import (
    SessionConnection,
    add_session_annotation,
    record_session_ingestion,
    recover_session,
    request_session_stop,
    session_status,
    set_session_semantic_context,
    _worker_startup_wait_seconds,
)
from tools.total_resolver.verify import verify_session


REPOSITORY_ROOT = Path(__file__).resolve().parents[3]


def metadata(session_id: str) -> SessionMetadata:
    return SessionMetadata(
        session_id=session_id,
        started_utc="2026-08-17T00:00:00.000Z",
        tool_version="0.2.0",
        tool_git_commit=None,
        decomp_git_commit="A" * 40,
        decomp_dirty=True,
        project64_branch="ob64-core",
        project64_git_commit="B" * 40,
        bridge_version="0.7.2",
        bridge_port=64640,
        bridge_epoch="EPOCH-RECOVERY",
        bridge_next_sequence_start=1,
        cpu_core="interpreter",
        rom_crc1="12345678",
        rom_crc2="9ABCDEF0",
        rom_country="0x45",
        rom_version=0,
        rom_normalized_sha256="C" * 64,
        static_sources={"fixture": True},
        capture_mode=CaptureMode.MANUAL_PLAY,
        intervention_policy=InterventionPolicy.OBSERVATION_ONLY,
    )


class OfflineClient:
    def __init__(self, *_args: Any) -> None:
        pass

    def connect(self) -> None:
        raise OSError("synthetic bridge outage")

    def close(self) -> None:
        pass


class RecoverableClient:
    def __init__(self, *_args: Any) -> None:
        self.drained = False
        self.removed: list[int] = []
        self.dma_stopped = False

    def connect(self) -> None:
        pass

    def close(self) -> None:
        pass

    def status(self) -> dict[str, Any]:
        return {"bridgeEpoch": "EPOCH-RECOVERY"}

    def remove_watch(self, watch_id: int) -> dict[str, Any]:
        self.removed.append(watch_id)
        return {"id": watch_id}

    def dma_stop(self) -> dict[str, Any]:
        self.dma_stopped = True
        return {"dma": {"enabled": False}}

    def drain_events(self, _maximum: int) -> dict[str, Any]:
        if self.drained:
            return {
                "queueModel": "unified",
                "bridgeEpoch": "EPOCH-RECOVERY",
                "nextEventSequence": 4,
                "count": 0,
                "remaining": 0,
                "dropped": 0,
                "droppedRanges": [],
                "events": [],
            }
        self.drained = True
        return {
            "queueModel": "unified",
            "bridgeEpoch": "EPOCH-RECOVERY",
            "nextEventSequence": 4,
            "count": 1,
            "remaining": 0,
            "dropped": 0,
            "droppedRanges": [],
            "events": [
                {
                    "kind": "exec",
                    "frameCount": 77,
                    "pc": "0x80001000",
                    "bridgeEpoch": "EPOCH-RECOVERY",
                    "bridgeSequence": 3,
                    "bridgeStream": "watch",
                }
            ],
        }


class SessionLifecycleTests(unittest.TestCase):
    def test_worker_startup_wait_scales_with_persistent_frontier_transport(self) -> None:
        empty = _worker_startup_wait_seconds(
            SessionConnection(timeout=5.0),
            frontier_page_count=0,
            frontier_instruction_count=0,
            frontier_edge_count=0,
        )
        migrated = _worker_startup_wait_seconds(
            SessionConnection(timeout=5.0),
            frontier_page_count=4,
            frontier_instruction_count=278425,
            frontier_edge_count=278425,
        )
        self.assertEqual(empty, 30.0)
        self.assertGreater(migrated, 30.0)
        self.assertLess(migrated, 60.0)

    def _open_session(self, root: Path, session_id: str) -> CaptureStore:
        location = root / session_id
        return CaptureStore.create(location / "capture.sqlite", metadata(session_id))

    def test_offline_recovery_closes_interrupted_and_verifies(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            store = self._open_session(root, "S-OFFLINE")
            store.close_connection()

            recovered = recover_session(
                "S-OFFLINE",
                root=root,
                connection=SessionConnection(),
                refuse_live_worker=False,
                client_factory=OfflineClient,
            )
            self.assertEqual(recovered["closureStatus"], "interrupted")
            self.assertEqual(recovered["continuityStatus"], "broken")
            result = verify_session(root / "S-OFFLINE", REPOSITORY_ROOT)
            self.assertTrue(result.ok, result.to_dict())

    def test_recovery_salvages_queue_and_marks_unpersisted_sequence_gap(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            store = self._open_session(root, "S-GAP")
            store.record_watch(
                watch_id="native-pi-dma",
                bridge_watch_id=None,
                watch_kind="dma",
                address_space="physical-rdram",
                address_start=0,
                address_end_exclusive=0x00400000,
                label="DMA",
                reason="fixture",
                definition_source="fixture",
                interpreter_required=False,
                interpreter_verified=True,
                ownership_scope="recorder-owned",
            )
            store.record_watch(
                watch_id="exec-fixture",
                bridge_watch_id=42,
                watch_kind="exec",
                address_space="live-kseg",
                address_start=0x80001000,
                address_end_exclusive=0x80001004,
                label="exec",
                reason="fixture",
                definition_source="fixture",
                interpreter_required=True,
                interpreter_verified=True,
                ownership_scope="recorder-owned",
            )
            store.close_connection()

            recovered = recover_session(
                "S-GAP",
                root=root,
                refuse_live_worker=False,
                client_factory=RecoverableClient,
            )
            self.assertEqual(recovered["bridgeNextSequenceEnd"], 4)
            self.assertEqual(recovered["machineEventCount"], 1)
            self.assertEqual(recovered["droppedSequenceCount"], 2)

            connection = CaptureStore.open(root / "S-GAP" / "capture.sqlite", mirror_events=False)
            try:
                ranges = connection.connection.execute(
                    """
                    SELECT first_bridge_sequence, last_bridge_sequence, source
                    FROM bridge_loss_range
                    """
                ).fetchall()
                removed = connection.connection.execute(
                    "SELECT COUNT(*) FROM watch_definition WHERE removed_sequence IS NOT NULL"
                ).fetchone()[0]
            finally:
                connection.close_connection()
            self.assertEqual([tuple(row) for row in ranges], [(1, 2, "recorder-recovery-gap")])
            self.assertEqual(removed, 2)
            result = verify_session(root / "S-GAP", REPOSITORY_ROOT)
            self.assertTrue(result.ok, result.to_dict())

    def test_status_reports_open_session_without_mutating_it(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            store = self._open_session(root, "S-STATUS")
            store.close_connection()
            status = session_status("S-STATUS", root=root)
            self.assertEqual(status["closureStatus"], "open")
            self.assertEqual(status["eventCount"], 0)

    def test_stop_waits_for_closed_worker_finalization(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            store = self._open_session(root, "S-STOP")
            store.close_connection()
            finalizing = {"closureStatus": "closed", "workerAlive": True}
            finalized = {"closureStatus": "closed", "workerAlive": False}
            with (
                patch(
                    "tools.total_resolver.sessions.session_status",
                    side_effect=[finalizing, finalized],
                ) as status_mock,
                patch("tools.total_resolver.sessions.time.sleep"),
            ):
                result = request_session_stop("S-STOP", root=root, wait_seconds=1.0)
            self.assertEqual(result, finalized)
            self.assertEqual(status_mock.call_count, 2)

    def test_explicit_ingestion_retry_reconciles_closed_worker_status(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            store = self._open_session(root, "S-INGEST")
            store.set_bridge_next_sequence_end(1)
            store.close_session("closed")
            store.close_connection()
            ingestion = {
                "result": "PASS",
                "action": "ingested",
                "sessionId": "S-INGEST",
                "knowledge": {
                    "database": str(root / "knowledge.sqlite"),
                    "frontier": {"frontierIdentity": "K2:fixture"},
                },
            }

            status = record_session_ingestion(
                "S-INGEST", ingestion, root=root
            )

            self.assertEqual(status["workerState"], "closed")
            self.assertEqual(status["ingestion"], ingestion)
            self.assertEqual(
                status["frontier"]["frontierIdentity"], "K2:fixture"
            )

    def test_post_stop_semantic_name_is_retry_safe_and_does_not_mutate_capture(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            store = self._open_session(root, "S-NAME")
            store.set_bridge_next_sequence_end(1)
            store.close_session("closed")
            store.close_connection()
            session = root / "S-NAME"
            (session / "verification.json").write_text(
                json.dumps({"result": "PASS"}) + "\n", encoding="utf-8"
            )
            capture = session / "capture.sqlite"
            before = capture.read_bytes()

            created = set_session_semantic_context(
                "S-NAME", "Neutral encounter and persuasion", notes="successful Talk", root=root
            )
            repeated = set_session_semantic_context(
                "S-NAME", "Neutral encounter and persuasion", notes="successful Talk", root=root
            )

            self.assertEqual(created["action"], "created")
            self.assertEqual(repeated["action"], "no-op")
            self.assertEqual(capture.read_bytes(), before)
            self.assertEqual(
                session_status("S-NAME", root=root)["semanticContext"]["semanticName"],
                "Neutral encounter and persuasion",
            )
            with self.assertRaisesRegex(RuntimeError, "already named"):
                set_session_semantic_context("S-NAME", "Different name", root=root)

    def test_visible_action_annotation_matches_closed_schema(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            store = self._open_session(root, "S-MARK")
            store.close_connection()
            result = add_session_annotation(
                "Entering Army menu",
                marker_type="visible-action",
                session_id="S-MARK",
                root=root,
            )
            self.assertEqual(result["markerType"], "visible-action")
            reopened = CaptureStore.open(root / "S-MARK" / "capture.sqlite", mirror_events=False)
            try:
                marker_type = reopened.connection.execute(
                    "SELECT marker_type FROM semantic_marker"
                ).fetchone()[0]
            finally:
                reopened.close_connection()
            self.assertEqual(marker_type, "visible-action")


if __name__ == "__main__":
    unittest.main()
