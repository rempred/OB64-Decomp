from __future__ import annotations

import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from typing import Any

from tools.total_resolver.capture_db import CaptureStore, SessionMetadata, load_event_payload
from tools.total_resolver.contracts import CaptureMode, InterventionPolicy
from tools.total_resolver.identities import rom_identity_from_file
from tools.total_resolver.manifest import finalize_manifest
from tools.total_resolver.pj64_client import MemoryBlock, MemoryFingerprint, MemoryFingerprintBatch
from tools.total_resolver.protocol import BRIDGE_PROTOCOL_VERSION, BridgeHandshake, BridgeProtocolError
from tools.total_resolver.recorder import (
    Pj64CaptureRecorder,
    RecorderClock,
    RecorderSettings,
    SafetyRangeSpec,
    WatchSpec,
    verify_observation_preflight,
)
from tools.total_resolver.replay import write_timeline
from tools.total_resolver.verify import verify_session


REPOSITORY_ROOT = Path(__file__).resolve().parents[3]


class FakeClock(RecorderClock):
    def __init__(self) -> None:
        self.now_ns = 1_000_000_000

    def monotonic_ns(self) -> int:
        self.now_ns += 1_000
        return self.now_ns

    def utc_now(self) -> str:
        return "2026-08-17T00:00:00.000Z"

    def sleep(self, seconds: float) -> None:
        self.now_ns += int(seconds * 1_000_000_000)


class FakeClient:
    def __init__(self, rom_path: Path) -> None:
        identity = rom_identity_from_file(rom_path)
        self.handshake_result: BridgeHandshake | None = None
        self.epoch = "EPOCH-RECORDER"
        self.rom_path = rom_path
        self.identity = identity
        self.commands: list[str] = []
        self.frame = 100
        self.poll = 0
        self.dma_enabled = False
        self.capture_enabled = False
        self.event_batches: list[dict[str, Any]] = []
        self.memory_blocks: dict[tuple[int, int], bytes] = {}

    def connect(self) -> FakeClient:
        self.commands.append("connect")
        self.handshake_result = BridgeHandshake(
            BRIDGE_PROTOCOL_VERSION, 64640, "interpreter", None, self.epoch
        )
        return self

    def status(self) -> dict[str, Any]:
        self.commands.append("status")
        return {
            "watches": [],
            "queued": 0,
            "dropped": 0,
            "droppedRanges": [],
            "bridgeEpoch": self.epoch,
            "queueModel": "unified",
            "nextEventSequence": getattr(self, "next_event_sequence", 1),
            "dma": {"enabled": self.dma_enabled, "queueModel": "unified"},
            "capture": {
                "enabled": self.capture_enabled,
                "trace": {
                    "enabled": self.capture_enabled,
                    "callbackId": 77 if self.capture_enabled else None,
                    "callbackIds": [77, 78] if self.capture_enabled else [],
                },
                "controllerInput": {"enabled": self.capture_enabled},
            },
            "input": {
                "mask": "0x00000000",
                "stickActive": False,
                "samples": 0,
            },
            "frameCount": self.frame,
            "debugPaused": False,
            "emuState": {"systemPaused": False},
        }

    def health(self) -> dict[str, Any]:
        self.commands.append("health")
        return {
            "core": "interpreter",
            "bridgeEpoch": self.epoch,
            "queueModel": "unified",
            "nextEventSequence": 1,
            "rom": {
                "filePath": str(self.rom_path),
                "fileName": self.rom_path.name,
                "crc1": "0x" + self.identity["crc1"],
                "crc2": "0x" + self.identity["crc2"],
            },
        }

    def execution(self) -> dict[str, Any]:
        self.commands.append("execution")
        return {"state": "running-or-system-paused"}

    @staticmethod
    def _empty() -> dict[str, Any]:
        return {
            "count": 0,
            "remaining": 0,
            "dropped": 0,
            "droppedRanges": [],
            "bridgeEpoch": "EPOCH-RECORDER",
            "queueModel": "unified",
            "nextEventSequence": 1,
            "events": [],
        }

    def drain_events(self, maximum: int | None = None) -> dict[str, Any]:
        self.commands.append("drain")
        self.poll += 1
        self.frame += 1
        if self.event_batches:
            value = self.event_batches.pop(0)
            self.next_event_sequence = value["nextEventSequence"]
            return value
        value = self._empty()
        value["nextEventSequence"] = getattr(self, "next_event_sequence", 1)
        return value

    def dma_start(self, *_args: Any, **_kwargs: Any) -> dict[str, Any]:
        self.commands.append("dma on")
        self.dma_enabled = True
        return {"dma": {"enabled": True}}

    def dma_set_rom_range(self, *_args: Any, **_kwargs: Any) -> dict[str, Any]:
        self.commands.append("dma cart")
        return {"dma": {"enabled": True}}

    def dma_stop(self) -> dict[str, Any]:
        self.commands.append("dma off")
        self.dma_enabled = False
        return {"dma": {"enabled": False}}

    def capture_start(self) -> dict[str, Any]:
        self.commands.append("capture on")
        self.capture_enabled = True
        return {
            "capture": {
                "enabled": True,
                "trace": {"enabled": True, "callbackId": 77, "callbackIds": [77, 78]},
                "controllerInput": {"enabled": True},
            }
        }

    def capture_stop(self) -> dict[str, Any]:
        self.commands.append("capture off")
        self.capture_enabled = False
        return {
            "capture": {
                "enabled": False,
                "trace": {"enabled": False, "callbackId": None, "callbackIds": []},
                "controllerInput": {"enabled": False},
            }
        }

    def install_watch(self, *_args: Any, **_kwargs: Any) -> dict[str, Any]:
        self.commands.append("watch")
        return {"id": 1}

    def remove_watch(self, bridge_watch_id: int) -> dict[str, Any]:
        self.commands.append("unwatch")
        return {"id": bridge_watch_id}

    @staticmethod
    def _fnv1a32(data: bytes) -> str:
        value = 0x811C9DC5
        for byte in data:
            value ^= byte
            value = (value * 0x01000193) & 0xFFFFFFFF
        return f"0X{value:08X}"

    def memory_fingerprints(
        self, specs: tuple[tuple[int, int], ...]
    ) -> MemoryFingerprintBatch:
        self.commands.append("hashmem")
        ranges = []
        for address, size in specs:
            data = self.memory_blocks.setdefault(
                (address, size), bytes((index & 0xFF) for index in range(size))
            )
            ranges.append(MemoryFingerprint(address, size, "fnv1a32", self._fnv1a32(data)))
        return MemoryFingerprintBatch(
            self.epoch,
            getattr(self, "next_event_sequence", 1),
            self.frame,
            tuple(ranges),
        )

    def read_block(self, address: int, size: int) -> MemoryBlock:
        self.commands.append("readblock")
        data = self.memory_blocks[(address, size)]
        return MemoryBlock(
            self.epoch,
            getattr(self, "next_event_sequence", 1),
            self.frame,
            address,
            data,
            "fnv1a32",
            self._fnv1a32(data),
        )


def make_rom(path: Path) -> dict[str, Any]:
    payload = bytearray(0x1000)
    payload[:4] = b"\x80\x37\x12\x40"
    payload[0x10:0x14] = bytes.fromhex("12345678")
    payload[0x14:0x18] = bytes.fromhex("9ABCDEF0")
    payload[0x20:0x34] = b"OB64 RECORDER TEST".ljust(20, b" ")
    payload[0x3E] = 0x45
    payload[0x3F] = 0
    path.write_bytes(payload)
    return rom_identity_from_file(path)


def metadata(identity: dict[str, Any]) -> SessionMetadata:
    return SessionMetadata(
        session_id="S-RECORDER",
        started_utc="2026-08-17T00:00:00.000Z",
        tool_version="0.1.0",
        tool_git_commit=None,
        decomp_git_commit="A" * 40,
        decomp_dirty=True,
        project64_branch="ob64-core",
        project64_git_commit="B" * 40,
        bridge_version=BRIDGE_PROTOCOL_VERSION,
        bridge_port=64640,
        bridge_epoch="EPOCH-RECORDER",
        bridge_next_sequence_start=1,
        cpu_core="interpreter",
        rom_crc1=identity["crc1"],
        rom_crc2=identity["crc2"],
        rom_country=identity["country"],
        rom_version=identity["version"],
        rom_normalized_sha256=identity["normalizedSha256"],
        static_sources={"fixture": True},
        capture_mode=CaptureMode.MANUAL_PLAY,
        intervention_policy=InterventionPolicy.OBSERVATION_ONLY,
    )


class RecorderTests(unittest.TestCase):
    def test_preflight_rejects_non_pristine_or_wrong_rom(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            identity = make_rom(root / "test.z64")
            client = FakeClient(root / "test.z64")
            result = verify_observation_preflight(client, identity["normalizedSha256"])
            self.assertEqual(result.rom_identity["normalizedSha256"], identity["normalizedSha256"])

            class DirtyClient(FakeClient):
                def status(self) -> dict[str, Any]:
                    value = super().status()
                    value["watches"] = [{"id": 99}]
                    return value

            with self.assertRaisesRegex(BridgeProtocolError, "no existing watches"):
                verify_observation_preflight(
                    DirtyClient(root / "test.z64"), identity["normalizedSha256"]
                )
            with self.assertRaisesRegex(BridgeProtocolError, "SHA-256 mismatch"):
                verify_observation_preflight(client, "F" * 64)

    def test_simulated_three_minute_observation_session_is_replayable(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            identity = make_rom(root / "test.z64")
            client = FakeClient(root / "test.z64")
            client.event_batches.extend(
                [
                    {
                        "queueModel": "unified",
                        "bridgeEpoch": "EPOCH-RECORDER",
                        "nextEventSequence": 7,
                        "count": 6,
                        "remaining": 0,
                        "dropped": 0,
                        "droppedRanges": [],
                        "events": [
                            {
                                "kind": "exec",
                                "frameCount": 100,
                                "pc": "0x80001000",
                                "bridgeEpoch": "EPOCH-RECORDER",
                                "bridgeSequence": 1,
                                "bridgeStream": "watch",
                            },
                            {
                                "kind": "write",
                                "frameCount": 100,
                                "address": "0x80002000",
                                "bridgeEpoch": "EPOCH-RECORDER",
                                "bridgeSequence": 2,
                                "bridgeStream": "watch",
                            },
                            {
                                "kind": "dma-start",
                                "sourceDomain": "cartridge-rom",
                                "frameCount": 100,
                                "phys": "0x1000",
                                "romoff": "0x2000",
                                "requestedLength": 2,
                                "bridgeEpoch": "EPOCH-RECORDER",
                                "bridgeSequence": 3,
                                "bridgeStream": "dma",
                                "capturePhase": "pre-transfer-callback",
                            },
                            {
                                "kind": "dma-complete",
                                "sourceDomain": "cartridge-rom",
                                "frameCount": 100,
                                "phys": "0x1000",
                                "romoff": "0x2000",
                                "len": "0x2",
                                "requestedLength": 2,
                                "transferSpanLength": 2,
                                "dmaStartSequence": 3,
                                "pairingStatus": "matched",
                                "bridgeEpoch": "EPOCH-RECORDER",
                                "bridgeSequence": 4,
                                "bridgeStream": "dma",
                                "capturePhase": "post-transfer-callback",
                                "destinationByteLength": 2,
                                "destinationBytesEncoding": "hex-uppercase",
                                "destinationBytesHex": "AABB",
                            },
                            {
                                "kind": "dma-start",
                                "sourceDomain": "cartridge-rom",
                                "frameCount": 100,
                                "phys": "0x1080",
                                "romoff": "0x2080",
                                "requestedLength": 2,
                                "bridgeEpoch": "EPOCH-RECORDER",
                                "bridgeSequence": 5,
                                "bridgeStream": "dma",
                                "capturePhase": "pre-transfer-callback",
                            },
                            {
                                "kind": "dma-complete",
                                "sourceDomain": "cartridge-rom",
                                "frameCount": 100,
                                "phys": "0x1080",
                                "romoff": "0x2080",
                                "len": "0x2",
                                "requestedLength": 2,
                                "transferSpanLength": 2,
                                "dmaStartSequence": 5,
                                "pairingStatus": "matched",
                                "bridgeEpoch": "EPOCH-RECORDER",
                                "bridgeSequence": 6,
                                "bridgeStream": "dma",
                                "capturePhase": "post-transfer-callback",
                                "destinationByteLength": 2,
                                "destinationBytesEncoding": "hex-uppercase",
                                "destinationBytesHex": "CCDD",
                            },
                        ],
                    }
                ]
            )
            session_dir = root / "session"
            store = CaptureStore.create(session_dir / "capture.sqlite", metadata(identity))
            clock = FakeClock()
            recorder = Pj64CaptureRecorder(
                client,
                store,
                RecorderSettings(
                    identity["normalizedSha256"],
                    poll_interval_seconds=0.3,
                    frame_sample_interval_seconds=10.0,
                    health_interval_seconds=30.0,
                ),
                clock=clock,
            )
            recorder.start()
            self.assertEqual(recorder.run(maximum_polls=600), 600)
            recorder.stop_instrumentation()
            recorder.drain_to_empty()
            recorder.append_terminal_event("closed")
            store.close_session("closed")
            store.checkpoint()
            finalize_manifest(store.connection, session_dir, REPOSITORY_ROOT)
            write_timeline(store.connection, session_dir / "timeline.json")
            store.close_connection()

            result = verify_session(session_dir, REPOSITORY_ROOT)
            self.assertTrue(result.ok, result.to_dict())
            forbidden = {"pause", "resume", "poke", "input", "loadstate", "savestate", "clear"}
            self.assertFalse(forbidden.intersection(client.commands))

    def test_dropped_event_is_visible_and_breaks_continuity(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            identity = make_rom(root / "test.z64")
            client = FakeClient(root / "test.z64")
            client.event_batches.append(
                {
                    "queueModel": "unified",
                    "bridgeEpoch": "EPOCH-RECORDER",
                    "nextEventSequence": 3,
                    "count": 0,
                    "remaining": 0,
                    "dropped": 2,
                    "droppedRanges": [
                        {"firstSequence": 1, "lastSequence": 2, "count": 2}
                    ],
                    "events": [],
                }
            )
            session_dir = root / "session"
            store = CaptureStore.create(session_dir / "capture.sqlite", metadata(identity))
            recorder = Pj64CaptureRecorder(
                client,
                store,
                RecorderSettings(identity["normalizedSha256"]),
                clock=FakeClock(),
            )
            recorder.start()
            result = recorder.poll_once()
            self.assertEqual(result.dropped_total, 2)
            row = store.connection.execute(
                "SELECT continuity_status FROM session"
            ).fetchone()
            self.assertEqual(row[0], "broken")
            loss = store.connection.execute(
                "SELECT COUNT(*) FROM event_sequence WHERE ingestion_status='loss-marker'"
            ).fetchone()[0]
            self.assertEqual(loss, 1)
            ranges = store.connection.execute(
                "SELECT first_bridge_sequence, last_bridge_sequence FROM bridge_loss_range"
            ).fetchall()
            self.assertEqual([tuple(row) for row in ranges], [(1, 2)])
            store.close_connection()

    def test_safety_range_uses_fingerprint_then_captures_exact_changed_bytes(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            identity = make_rom(root / "test.z64")
            client = FakeClient(root / "test.z64")
            address = 0x80190000
            client.memory_blocks[(address, 4)] = b"ABCD"
            store = CaptureStore.create(root / "session" / "capture.sqlite", metadata(identity))
            recorder = Pj64CaptureRecorder(
                client,
                store,
                RecorderSettings(
                    identity["normalizedSha256"],
                    safety_ranges=(
                        SafetyRangeSpec(
                            range_id="overlay-pool-test",
                            live_address=address,
                            size=4,
                            label="fixture",
                            expected_class="mixed",
                            reason="fixture change detector",
                            definition_source="fixture",
                        ),
                    ),
                ),
                clock=FakeClock(),
            )
            recorder.start()
            recorder.poll_once(force_samples=True)
            client.memory_blocks[(address, 4)] = b"WXYZ"
            recorder.poll_once(force_samples=True)

            rows = store.connection.execute(
                """
                SELECT raw_payload_json, event_time_content_sha256,
                       event_time_content_size, event_time_content_phase
                FROM event_sequence
                WHERE bridge_event_type='range-snapshot'
                ORDER BY sequence_id
                """
            ).fetchall()
            self.assertEqual(len(rows), 2)
            compact_payloads = [json.loads(row[0]) for row in rows]
            payloads = [load_event_payload(store.connection, row[0]) for row in rows]
            self.assertEqual([item["sampleReason"] for item in payloads], ["initial", "fingerprint-changed"])
            self.assertEqual([item["bytesHex"] for item in payloads], ["41424344", "5758595A"])
            self.assertTrue(all("bytesHex" not in item for item in compact_payloads))
            self.assertEqual(
                payloads[1]["contentSha256"], hashlib.sha256(b"WXYZ").hexdigest().upper()
            )
            self.assertEqual(rows[1][1], hashlib.sha256(b"WXYZ").hexdigest().upper())
            self.assertEqual(rows[1][2], 4)
            self.assertEqual(rows[1][3], "host-polled-range-snapshot")
            self.assertEqual(
                store.connection.execute("SELECT COUNT(*) FROM content_blob").fetchone()[0], 2
            )
            self.assertEqual(client.commands.count("hashmem"), 2)
            self.assertEqual(client.commands.count("readblock"), 2)
            store.close_connection()

    def test_epoch_change_and_unexplained_global_gap_fail_closed(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            identity = make_rom(root / "test.z64")

            gap_client = FakeClient(root / "test.z64")
            gap_client.event_batches.append(
                {
                    "queueModel": "unified",
                    "bridgeEpoch": "EPOCH-RECORDER",
                    "nextEventSequence": 3,
                    "count": 1,
                    "remaining": 0,
                    "dropped": 0,
                    "droppedRanges": [],
                    "events": [
                        {
                            "kind": "exec",
                            "bridgeEpoch": "EPOCH-RECORDER",
                            "bridgeSequence": 2,
                            "bridgeStream": "watch",
                        }
                    ],
                }
            )
            gap_store = CaptureStore.create(root / "gap" / "capture.sqlite", metadata(identity))
            gap_recorder = Pj64CaptureRecorder(
                gap_client,
                gap_store,
                RecorderSettings(identity["normalizedSha256"]),
                clock=FakeClock(),
            )
            gap_recorder.start()
            with self.assertRaisesRegex(BridgeProtocolError, "unexplained bridge sequence gap"):
                gap_recorder.poll_once()
            gap_store.close_connection()

            epoch_client = FakeClient(root / "test.z64")
            epoch_client.event_batches.append(
                {
                    "queueModel": "unified",
                    "bridgeEpoch": "RELOADED-EPOCH",
                    "nextEventSequence": 1,
                    "count": 0,
                    "remaining": 0,
                    "dropped": 0,
                    "droppedRanges": [],
                    "events": [],
                }
            )
            epoch_store = CaptureStore.create(
                root / "epoch" / "capture.sqlite", metadata(identity)
            )
            epoch_recorder = Pj64CaptureRecorder(
                epoch_client,
                epoch_store,
                RecorderSettings(identity["normalizedSha256"]),
                clock=FakeClock(),
            )
            epoch_recorder.start()
            with self.assertRaisesRegex(BridgeProtocolError, "epoch changed"):
                epoch_recorder.poll_once()
            epoch_store.close_connection()

    def test_shutdown_removes_only_owned_watch_ids(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            identity = make_rom(root / "test.z64")
            client = FakeClient(root / "test.z64")
            store = CaptureStore.create(root / "session" / "capture.sqlite", metadata(identity))
            recorder = Pj64CaptureRecorder(
                client,
                store,
                RecorderSettings(
                    identity["normalizedSha256"],
                    watches=(
                        WatchSpec(
                            watch_id="entry",
                            kind="exec",
                            address=0x80001000,
                            size=4,
                            address_space="live-kseg",
                            label="entry",
                            reason="fixture",
                            definition_source="fixture",
                        ),
                    ),
                ),
                clock=FakeClock(),
            )
            recorder.start()
            recorder.stop_instrumentation()
            self.assertIn("unwatch", client.commands)
            self.assertNotIn("clear", client.commands)
            store.close_connection()

    def test_partial_startup_failure_removes_capture_and_dma_hooks(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            identity = make_rom(root / "test.z64")

            class FailedWatchClient(FakeClient):
                def install_watch(self, *_args: Any, **_kwargs: Any) -> dict[str, Any]:
                    self.commands.append("watch")
                    raise RuntimeError("fixture watch failure")

            client = FailedWatchClient(root / "test.z64")
            store = CaptureStore.create(root / "session" / "capture.sqlite", metadata(identity))
            recorder = Pj64CaptureRecorder(
                client,
                store,
                RecorderSettings(
                    identity["normalizedSha256"],
                    watches=(
                        WatchSpec(
                            watch_id="fails",
                            kind="exec",
                            address=0x80001000,
                            size=4,
                            address_space="live-kseg",
                            label="failure fixture",
                            reason="prove startup rollback",
                            definition_source="fixture",
                        ),
                    ),
                ),
                clock=FakeClock(),
            )
            with self.assertRaisesRegex(RuntimeError, "fixture watch failure"):
                recorder.start()
            self.assertFalse(recorder.started)
            self.assertFalse(client.capture_enabled)
            self.assertFalse(client.dma_enabled)
            self.assertIn("capture off", client.commands)
            self.assertIn("dma off", client.commands)
            store.close_connection()


if __name__ == "__main__":
    unittest.main()
