from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.derive_session import (
    _ActiveRegionIndex,
    _active_region_for_pc,
    _baseline_census,
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
    declared_digest: str | None = None,
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
        "contentSha256": declared_digest or hashlib.sha256(data).hexdigest().upper(),
        "bytesEncoding": "hex-uppercase",
        "bytesHex": data.hex().upper(),
    }
    connection.execute(
        "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
        (sequence, 10, None, "recorder", "range-snapshot", json.dumps(payload), None, None),
    )


class SessionDerivationTests(unittest.TestCase):
    def test_atomic_four_mib_baseline_finds_resident_code_without_execution_claim(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            static_path = Path(raw) / "static.sqlite"
            create_static_database(static_path)
            static = StaticModel(static_path)
            rom = bytearray(1024)
            loader_bytes = bytes(range(1, 17))
            rom[16:32] = loader_bytes
            rom[258:262] = b"\xA1\xA2\xA3\xA4"
            physical = 0x00070C00
            rdram = bytearray(0x00400000)
            rdram[physical : physical + len(loader_bytes)] = loader_bytes
            payload = {
                "kind": "baseline-snapshot",
                "capturePhase": "pre-execution-native-rdram-snapshot",
                "ordering": "native-copy-before-first-captured-instruction",
                "rdramSize": 0x00400000,
                "rdramByteLength": 0x00400000,
                "rdramBytesEncoding": "hex-uppercase",
                "rdramBytesHex": rdram.hex().upper(),
            }
            connection = sqlite3.connect(":memory:")
            connection.row_factory = sqlite3.Row
            connection.execute(
                """
                CREATE TABLE event_sequence(
                  sequence_id INTEGER PRIMARY KEY, frame_number INTEGER,
                  bridge_event_sequence INTEGER, bridge_stream TEXT,
                  bridge_event_type TEXT, raw_payload_json TEXT,
                  event_time_content_sha256 TEXT, event_time_content_size INTEGER
                )
                """
            )
            connection.execute(
                "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
                (1, 10, 1, "trace", "baseline-snapshot", json.dumps(payload), None, None),
            )

            placements, diagnostics = _baseline_census(
                connection, "BASELINE", static, bytes(rom)
            )
            connection.close()

            loader = next(item for item in placements if item["function"]["structuralName"] == "loader")
            self.assertEqual(loader["destinationPhysicalStart"], physical)
            self.assertEqual(
                loader["mappingMethod"], "atomic-baseline-rdram-exact-function-bytes"
            )
            self.assertFalse(loader["executionClaim"])
            self.assertEqual(diagnostics["rdramBytes"], 0x00400000)

    def test_safety_range_analysis_reads_irrelevant_dma_metadata_once(self) -> None:
        class CountingTransaction:
            def __init__(self, sequence: int) -> None:
                self._record = {
                    "completionBridgeSequence": sequence,
                    "destinationPhysicalStart": 0x00190000,
                    "transactionId": f"dma:{sequence}",
                }
                self.record_reads = 0
                self.data = b"Z"

            @property
            def record(self) -> dict[str, object]:
                self.record_reads += 1
                return self._record

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
        for sequence, next_bridge_sequence in enumerate((1, 2, 3, 4), 1):
            insert_snapshot(
                connection,
                sequence=sequence,
                data=b"A",
                next_bridge_sequence=next_bridge_sequence,
                reason="performance-regression",
            )
        transactions = [CountingTransaction(sequence) for sequence in range(100, 2100)]

        changes, unresolved, diagnostics = _safety_range_analysis(
            connection, transactions
        )
        connection.close()

        self.assertEqual(len(changes), 4)
        self.assertEqual(unresolved, [])
        self.assertEqual(diagnostics["changeCount"], 3)
        self.assertTrue(all(item.record_reads == 1 for item in transactions))

    def test_bulk_nominal_pc_index_matches_lazy_resolution(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static_path = root / "static.sqlite"
            create_static_database(static_path)

            lazy = StaticModel(static_path)
            expected = lazy.resolve_nominal_pc(0x80001000)
            self.assertIsNotNone(expected)
            self.assertEqual(lazy.resolve_nominal_rom_offset(0x80001000), 16)
            self.assertEqual(lazy.resolve_nominal_mapping(0x80001000), (expected, 16))
            self.assertIsNone(lazy.resolve_nominal_pc(0x81234560))
            self.assertIsNone(lazy.resolve_nominal_rom_offset(0x81234560))
            self.assertIsNone(lazy.resolve_nominal_mapping(0x81234560))

            bulk = StaticModel(static_path)
            bulk.preload_nominal_pc_index()
            self.assertEqual(bulk.resolve_nominal_pc(0x80001000), expected)
            self.assertEqual(bulk.resolve_nominal_rom_offset(0x80001000), 16)
            self.assertEqual(bulk.resolve_nominal_mapping(0x80001000), (expected, 16))
            self.assertIsNone(bulk.resolve_nominal_pc(0x81234560))
            self.assertIsNone(bulk.resolve_nominal_rom_offset(0x81234560))

    def test_bulk_nominal_pc_index_rejects_ambiguous_crosswalk(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            static_path = Path(raw) / "static.sqlite"
            create_static_database(static_path)
            connection = sqlite3.connect(static_path)
            connection.execute("INSERT INTO word VALUES(17, 1, 2147487744)")
            connection.execute("INSERT INTO instruction VALUES(17, 2)")
            connection.commit()
            connection.close()

            lazy = StaticModel(static_path)
            self.assertIsNone(lazy.resolve_nominal_pc(0x80001000))
            self.assertIsNone(lazy.resolve_nominal_rom_offset(0x80001000))
            self.assertIsNone(lazy.resolve_nominal_mapping(0x80001000))

            bulk = StaticModel(static_path)
            bulk.preload_nominal_pc_index()
            self.assertIsNone(bulk.resolve_nominal_pc(0x80001000))
            self.assertIsNone(bulk.resolve_nominal_rom_offset(0x80001000))
            self.assertIsNone(bulk.resolve_nominal_mapping(0x80001000))

    def test_active_region_index_matches_exact_lookup_across_lifetimes(self) -> None:
        regions = [
            {
                "regionInstanceId": "A",
                "destinationPhysicalStart": 0x1000,
                "destinationPhysicalEndExclusive": 0x1800,
                "firstSequence": 1,
                "endSequenceExclusive": 5,
            },
            {
                "regionInstanceId": "B",
                "destinationPhysicalStart": 0x1000,
                "destinationPhysicalEndExclusive": 0x1800,
                "firstSequence": 5,
                "endSequenceExclusive": None,
            },
            {
                "regionInstanceId": "overlap",
                "destinationPhysicalStart": 0x1700,
                "destinationPhysicalEndExclusive": 0x2100,
                "firstSequence": 3,
                "endSequenceExclusive": 4,
            },
            {
                "regionInstanceId": "other-page",
                "destinationPhysicalStart": 0x9000,
                "destinationPhysicalEndExclusive": 0xA000,
                "firstSequence": 2,
                "endSequenceExclusive": 8,
            },
        ]
        index = _ActiveRegionIndex(regions)
        for sequence, physical_pc in (
            (0, 0x1000),
            (1, 0x1000),
            (2, 0x9004),
            (3, 0x1750),
            (3, 0x1F00),
            (4, 0x1750),
            (5, 0x1000),
            (8, 0x9004),
        ):
            self.assertEqual(
                index.resolve(sequence, physical_pc),
                _active_region_for_pc(regions, sequence, physical_pc),
            )

        with self.assertRaisesRegex(ValueError, "nondecreasing"):
            index.resolve(7, 0x1000)

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
                "pc": "0x80001000",
                "opcode": "0x27BDFFE0",
                "codePageContentId": 3,
                "newInstruction": True,
                "newEdge": True,
                "previous": {"pc": "0x80000FFC", "exactContentResolved": True},
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
            rom = bytearray(1024)
            rom[16:20] = bytes.fromhex("27BDFFE0")
            executions, _, diagnostics = _execution_analysis(
                connection, [], [], static, bytes(rom)
            )
            inputs, input_diagnostics = _controller_input_analysis(connection)
            connection.close()

            self.assertEqual(diagnostics["nativeCoverageCount"], 1)
            self.assertEqual(executions[0]["observationKind"], "native-exact-coverage")
            self.assertEqual(executions[0]["executionClaim"], "observed")
            self.assertEqual(executions[0]["romOffset"], 16)
            self.assertEqual(
                executions[0]["mappingMethod"], "accepted-static-nominal-vram"
            )
            self.assertEqual(
                executions[0]["mappingVerification"]["status"], "exact-opcode-match"
            )
            self.assertEqual(diagnostics["opcodeConfirmedMappingCount"], 1)
            self.assertEqual(input_diagnostics["transitionCount"], 2)
            self.assertEqual(inputs[0]["endSequenceExclusive"], 3)
            self.assertEqual(inputs[1]["state"], "0x80000000")

    def test_nominal_mapping_rejects_opcode_mismatch_but_retains_candidate(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static_path = root / "static.sqlite"
            create_static_database(static_path)
            static = StaticModel(static_path)
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
                "pc": "0x80001000",
                "physicalAddress": "0x00001000",
                "opcode": "0xDEADBEEF",
                "exactInstructionResolved": True,
                "newInstruction": True,
                "newEdge": False,
            }
            connection.executemany(
                "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
                (
                    (1, 20, 1, "trace", "exec-coverage", json.dumps(coverage), None, None),
                    (2, 21, 2, "trace", "exec-coverage", json.dumps(coverage), None, None),
                ),
            )
            rom = bytearray(1024)
            rom[16:20] = bytes.fromhex("27BDFFE0")

            executions, unresolved, diagnostics = _execution_analysis(
                connection, [], [], static, bytes(rom)
            )
            connection.close()

            observation = executions[0]
            self.assertIsNone(observation["function"])
            self.assertIsNone(observation["romOffset"])
            self.assertIsNone(observation["mappingMethod"])
            self.assertEqual(
                observation["mappingVerification"],
                {
                    "status": "opcode-mismatch",
                    "romOffset": 16,
                    "capturedOpcode": "0xDEADBEEF",
                    "romOpcode": "0x27BDFFE0",
                    "equalityBasis": "all-four-opcode-bytes",
                },
            )
            self.assertEqual(
                observation["mappingCandidate"]["mappingMethod"],
                "static-nominal-vram-address-candidate",
            )
            self.assertEqual(unresolved[-1]["kind"], "nominal-vram-opcode-mismatch")
            self.assertEqual(unresolved[-1]["occurrenceCount"], 2)
            self.assertEqual(unresolved[-1]["firstSequence"], 1)
            self.assertEqual(unresolved[-1]["lastSequence"], 2)
            self.assertEqual(diagnostics["opcodeMismatchMappingCount"], 2)

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
                declared_digest="0" * 64,
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
                connection, regions, transactions, static, rom
            )
            connection.close()

            self.assertEqual([item["status"] for item in changes], [
                "baseline",
                "loader-explained",
                "unresolved",
            ])
            self.assertEqual(safety["unresolvedChangeCount"], 1)
            self.assertEqual(safety["acceptedSnapshotCount"], 3)
            self.assertFalse(changes[0]["legacyContentHashMatches"])
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
