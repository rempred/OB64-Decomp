from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.derive_session import (
    _controller_input_analysis,
    _execution_analysis,
    _safety_range_analysis,
)
from tools.total_resolver.derive_transition import _derive_regions, _derive_transactions
from tools.total_resolver.static_model import StaticModel
from tools.total_resolver.tests.test_derive_transition import (
    create_resource_database,
    create_static_database,
    insert_pair,
)


def insert_snapshot(
    connection: sqlite3.Connection,
    *,
    sequence: int,
    data: bytes,
    next_bridge_sequence: int,
    reason: str,
) -> None:
    payload = {
        "kind": "range-snapshot",
        "rangeId": "overlay-pool-test",
        "liveAddress": 0x80190000,
        "physicalAddress": 0x00190000,
        "size": len(data),
        "sampleReason": reason,
        "bridgeNextSequenceAtSnapshot": next_bridge_sequence,
        "changedBetweenProbeAndSnapshot": False,
        "contentSha256": hashlib.sha256(data).hexdigest().upper(),
        "bytesEncoding": "hex-uppercase",
        "bytesHex": data.hex().upper(),
    }
    connection.execute(
        "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
        (sequence, 10, None, "recorder", "range-snapshot", json.dumps(payload), None, None),
    )


class SessionDerivationTests(unittest.TestCase):
    def test_native_coverage_and_controller_transitions_remain_distinct(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static_path = root / "static.sqlite"
            resource_path = root / "resource.sqlite"
            create_static_database(static_path)
            create_resource_database(resource_path)
            static = StaticModel(static_path, resource_path)
            connection = sqlite3.connect(":memory:")
            connection.row_factory = sqlite3.Row
            connection.execute(
                """
                CREATE TABLE event_sequence(
                  sequence_id INTEGER PRIMARY KEY, frame_number INTEGER,
                  bridge_event_sequence INTEGER, bridge_stream TEXT,
                  bridge_event_type TEXT,
                  raw_payload_json TEXT, event_time_content_sha256 TEXT,
                  event_time_content_size INTEGER
                )
                """
            )
            coverage = {
                "kind": "exec-coverage",
                "pc": "0x80100000",
                "opcode": "0x27BDFFE0",
                "codePageContentId": 3,
                "newInstruction": True,
                "newEdge": True,
                "previous": {"pc": "0x800FFFFC", "exactContentResolved": True},
            }
            neutral = {
                "kind": "controller-input",
                "controller": 0,
                "state": "0x00000000",
                "buttons": "0x00000000",
                "stickX": 0,
                "stickY": 0,
                "inputSource": "effective-pif-response",
                "capturePhase": "post-controller-read-and-bridge-injection",
            }
            pressed = dict(neutral, state="0x80000000", buttons="0x80000000")
            connection.executemany(
                "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
                (
                    (1, 20, 1, "trace", "exec-coverage", json.dumps(coverage), None, None),
                    (2, 20, 2, "input", "controller-input", json.dumps(neutral), None, None),
                    (3, 21, 3, "input", "controller-input", json.dumps(pressed), None, None),
                ),
            )
            executions, _, diagnostics = _execution_analysis(
                connection, [], [], static
            )
            inputs, input_diagnostics = _controller_input_analysis(connection)
            connection.close()

            self.assertEqual(diagnostics["nativeCoverageCount"], 1)
            self.assertEqual(executions[0]["observationKind"], "native-exact-coverage")
            self.assertEqual(executions[0]["executionClaim"], "observed")
            self.assertEqual(input_diagnostics["transitionCount"], 2)
            self.assertEqual(inputs[0]["endSequenceExclusive"], 3)
            self.assertEqual(inputs[1]["state"], "0x80000000")

    def test_dma_explained_change_and_contextual_pc_resolution_remain_distinct(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static_path = root / "static.sqlite"
            resource_path = root / "resource.sqlite"
            create_static_database(static_path)
            create_resource_database(resource_path)
            static = StaticModel(static_path, resource_path)
            rom = bytes(index & 0xFF for index in range(1024))
            connection = sqlite3.connect(":memory:")
            connection.row_factory = sqlite3.Row
            connection.execute(
                """
                CREATE TABLE event_sequence(
                  sequence_id INTEGER PRIMARY KEY, frame_number INTEGER,
                  bridge_event_sequence INTEGER, bridge_stream TEXT,
                  bridge_event_type TEXT,
                  raw_payload_json TEXT, event_time_content_sha256 TEXT,
                  event_time_content_size INTEGER
                )
                """
            )
            insert_snapshot(
                connection,
                sequence=1,
                data=b"AAAA",
                next_bridge_sequence=1,
                reason="initial",
            )
            insert_pair(
                connection,
                first_sequence=2,
                source=256,
                destination=0x00190000,
                data=rom[256:260],
            )
            # insert_pair uses bridge sequence values equal to the event IDs;
            # the post-DMA snapshot therefore sees events below next=4.
            insert_snapshot(
                connection,
                sequence=4,
                data=rom[256:260],
                next_bridge_sequence=4,
                reason="fingerprint-changed",
            )
            pc_payload = {
                "kind": "pc-sample",
                "pc": "0x80190002",
                "sampleKind": "periodic-frame-context",
            }
            connection.execute(
                "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
                (5, 11, None, "recorder", "pc-sample", json.dumps(pc_payload), None, None),
            )
            insert_snapshot(
                connection,
                sequence=6,
                data=b"\xFF" + rom[257:260],
                next_bridge_sequence=4,
                reason="fingerprint-changed",
            )
            connection.commit()

            transactions, diagnostics = _derive_transactions(
                connection, "S", 6, rom, static
            )
            self.assertEqual(diagnostics["romPairIssueCount"], 0)
            regions, _, _ = _derive_regions("S", transactions, 0, 6)
            changes, unresolved_changes, safety = _safety_range_analysis(
                connection, transactions
            )
            executions, unresolved_pcs, execution = _execution_analysis(
                connection, regions, transactions, static
            )
            connection.close()

            self.assertEqual([item["status"] for item in changes], [
                "baseline",
                "loader-explained",
                "unresolved",
            ])
            self.assertEqual(safety["unresolvedChangeCount"], 1)
            self.assertEqual(unresolved_changes[0]["unresolvedByteCount"], 1)
            self.assertEqual(execution["sampledPcCount"], 1)
            self.assertEqual(executions[0]["executionClaim"], "sampled-only")
            self.assertEqual(executions[0]["romOffset"], 258)
            self.assertEqual(
                executions[0]["function"]["structuralName"], "crosses_dma_chunks"
            )
            self.assertEqual(unresolved_pcs, [])


if __name__ == "__main__":
    unittest.main()
