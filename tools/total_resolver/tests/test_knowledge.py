from __future__ import annotations

from dataclasses import replace
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

from tools.total_resolver.identities import rom_identity_from_file
from tools.total_resolver.knowledge import (
    CodePageObservation,
    ControllerTransitionObservation,
    DmaPlacementObservation,
    EdgeObservation,
    FunctionPlacementObservation,
    InstructionObservation,
    SessionDelta,
    SUPPORTED_INGEST_PROTOCOL_VERSIONS,
    UnresolvedKnowledgeObservation,
    compare_knowledge_databases,
    create_knowledge_database,
    empty_novelty_frontier,
    ingest_delta,
    knowledge_status,
    migrate_frontier_database,
    open_knowledge_database,
    verify_knowledge_database,
)
from tools.total_resolver.protocol import BRIDGE_PROTOCOL_VERSION
from tools.total_resolver.knowledge_ingest import _evidence_grade as ingest_evidence_grade


def _make_rom(path: Path) -> str:
    payload = bytearray(0x1000)
    payload[:4] = b"\x80\x37\x12\x40"
    payload[0x10:0x14] = bytes.fromhex("12345678")
    payload[0x14:0x18] = bytes.fromhex("9ABCDEF0")
    payload[0x20:0x34] = b"KNOWLEDGE TEST".ljust(20, b" ")
    payload[0x3E] = 0x45
    payload[0x100:0x104] = bytes.fromhex("0C000050")
    payload[0x140:0x144] = bytes.fromhex("00000000")
    payload[0x144:0x148] = bytes.fromhex("24420001")
    path.write_bytes(payload)
    return str(rom_identity_from_file(path)["normalizedSha256"])


def _make_static(path: Path) -> None:
    connection = sqlite3.connect(path)
    try:
        connection.executescript(
            """
            CREATE TABLE logical_function(
                function_id INTEGER PRIMARY KEY,
                structural_name TEXT,
                display_name TEXT,
                rom_start INTEGER,
                rom_end_exclusive INTEGER,
                confidence TEXT
            );
            CREATE TABLE source_part(
                part_id INTEGER PRIMARY KEY,
                rom_start INTEGER,
                rom_end_exclusive INTEGER
            );
            CREATE TABLE part_classification(part_id INTEGER, class TEXT);
            CREATE TABLE word(rom_address INTEGER, nominal_linear_vram INTEGER);
            CREATE TABLE instruction(rom_address INTEGER, function_id INTEGER);
            INSERT INTO logical_function VALUES
                (1,'func_00000100','func_00000100',256,320,'accepted-structural'),
                (2,'func_00000140','func_00000140',320,384,'accepted-structural');
            """
        )
        connection.commit()
    finally:
        connection.close()


def _make_resource(path: Path) -> None:
    connection = sqlite3.connect(path)
    try:
        connection.executescript(
            """
            CREATE TABLE container(
                container_id TEXT, payload_z64_start INTEGER,
                payload_z64_end_exclusive INTEGER, z64_start INTEGER,
                z64_end_exclusive INTEGER, disposition TEXT,
                evidence_grade TEXT, resource_id TEXT
            );
            CREATE TABLE catalog_entry(
                catalog_id TEXT, z64_start INTEGER, z64_end_exclusive INTEGER,
                disposition TEXT, evidence_grade TEXT, filename TEXT
            );
            CREATE TABLE chain_stage(
                stage_id TEXT, z64_start INTEGER, z64_end_exclusive INTEGER,
                disposition TEXT, evidence_grade TEXT, descriptor TEXT
            );
            CREATE TABLE table_binding(
                binding_id TEXT, z64_start INTEGER, z64_end_exclusive INTEGER,
                disposition TEXT, evidence_grade TEXT, logical_key TEXT
            );
            """
        )
        connection.commit()
    finally:
        connection.close()


def _page(*opcodes: int, salt: int = 0) -> bytes:
    data = bytearray([salt] * 0x1000)
    for index, opcode in enumerate(opcodes):
        data[index * 4 : index * 4 + 4] = opcode.to_bytes(4, "big")
    return bytes(data)


class KnowledgeTests(unittest.TestCase):
    def test_frontier_v2_migration_builds_verified_copy_without_fact_changes(self) -> None:
        source = self.make_knowledge("frontier-v2.sqlite")
        connection = open_knowledge_database(source)
        try:
            connection.execute("UPDATE frontier_state SET format_version=2")
            connection.execute(
                "UPDATE knowledge_meta SET value='0.11.0' "
                "WHERE key='activeBridgeProtocolVersion'"
            )
            connection.commit()
        finally:
            connection.close()
        destination = self.root / "frontier-v3.sqlite"

        result = migrate_frontier_database(source, destination)

        self.assertEqual(result["fromFrontierFormatVersion"], 2)
        self.assertEqual(result["toFrontierFormatVersion"], 3)
        self.assertEqual(result["factMutation"], "none")
        self.assertEqual(result["verification"]["result"], "PASS")
        source_connection = sqlite3.connect(source)
        destination_connection = sqlite3.connect(destination)
        try:
            self.assertEqual(
                destination_connection.execute(
                    "SELECT value FROM knowledge_meta WHERE key='frontierFormatVersion'"
                ).fetchone()[0],
                "3",
            )
            self.assertEqual(
                destination_connection.execute(
                    "SELECT value FROM knowledge_meta "
                    "WHERE key='activeBridgeProtocolVersion'"
                ).fetchone()[0],
                BRIDGE_PROTOCOL_VERSION,
            )
            for table in ("instruction_fact", "edge_fact", "dma_placement"):
                self.assertEqual(
                    source_connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0],
                    destination_connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0],
                )
        finally:
            source_connection.close()
            destination_connection.close()

    def test_exact_dma_bytes_not_legacy_digest_decide_evidence_grade(self) -> None:
        self.assertEqual(
            ingest_evidence_grade(
                {
                    "pairingStatus": "matched",
                    "contentBytesValid": True,
                    "legacyContentHashMatches": False,
                    "romMatch": "exact-span",
                }
            ),
            "verified",
        )

    def setUp(self) -> None:
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.rom = self.root / "test.z64"
        self.rom_sha256 = _make_rom(self.rom)
        self.static = self.root / "static.sqlite"
        self.resource = self.root / "resource.sqlite"
        _make_static(self.static)
        _make_resource(self.resource)

    def tearDown(self) -> None:
        self.temporary.cleanup()

    def make_knowledge(self, name: str) -> Path:
        destination = self.root / name
        inventory = {"target": {"normalizedRomSha256": self.rom_sha256}}
        with patch("tools.total_resolver.knowledge.load_inventory", return_value=inventory):
            create_knowledge_database(
                destination,
                rom_path=self.rom,
                static_database=self.static,
                resource_database=self.resource,
                _database_id="TEST-DATABASE",
            )
        return destination

    def delta(
        self,
        session_id: str,
        *,
        controller_state: int = 0x80000000,
        page_generations: int = 1,
        second_placement: bool = False,
        changed_opcode: bool = False,
    ) -> SessionDelta:
        first_page = _page(0x0C000050, 0x00000000)
        pages = [
            CodePageObservation(
                index + 1,
                0x1000,
                index + 1,
                first_page
                if index == 0
                else _page(0x0C000050, 0x00000000, salt=(index & 0xFF)),
                index + 1,
                index + 1,
            )
            for index in range(page_generations)
        ]
        instructions = [
            InstructionObservation(
                0x1000, 0x0C000050, 20, page_generations, 1, 0x100, "exact-test"
            ),
            InstructionObservation(
                0x1004, 0x00000000, 21, page_generations, 2, 0x140, "exact-test"
            ),
        ]
        edges = [
            EdgeObservation(
                0x1000,
                0x0C000050,
                0x1004,
                0x00000000,
                22,
                page_generations,
                page_generations,
                source_function_id=1,
                source_z64_offset=0x100,
                destination_function_id=2,
                destination_z64_offset=0x140,
            )
        ]
        if second_placement:
            instructions.append(
                InstructionObservation(
                    0x2000, 0x0C000050, 23, 1, 1, 0x100, "exact-test"
                )
            )
        if changed_opcode:
            instructions.append(
                InstructionObservation(
                    0x1000, 0x0C000051, 24, page_generations + 1, None, None, "unresolved"
                )
            )
        return SessionDelta(
            session_id=session_id,
            capture_identity=f"capture:{session_id}",
            raw_manifest_reference=None,
            capture_schema_version=3,
            protocol_version=BRIDGE_PROTOCOL_VERSION,
            frontier_identity_at_start=empty_novelty_frontier(self.rom_sha256).identity,
            rom_normalized_sha256=self.rom_sha256,
            bridge_epoch="EPOCH-" + session_id,
            bridge_sequence_start=1,
            bridge_sequence_end=64,
            source_capture_path=str(self.root / session_id / "capture.sqlite"),
            source_product_path=str(self.root / session_id / "product"),
            source_product_reference=None,
            code_pages=tuple(pages),
            instructions=tuple(instructions),
            edges=tuple(edges),
            dma_placements=(
                DmaPlacementObservation(
                    "cartridge-rom",
                    0x100,
                    0x104,
                    0x3000,
                    0x3004,
                    4,
                    b"DATA",
                    "executable",
                    "exact-test",
                    "supported",
                    25,
                    26,
                    100,
                    100,
                ),
            ),
            function_placements=(
                FunctionPlacementObservation(
                    1, 0x100, 0x140, 0x1000, 0x1040, "exact-test", 25, 26
                ),
            ),
            controller_transitions=(
                ControllerTransitionObservation(
                    27,
                    100,
                    28,
                    101,
                    0,
                    controller_state,
                    controller_state & 0xFFFF0000,
                    0,
                    0,
                    False,
                    "post-controller-read-and-bridge-injection",
                ),
            ),
        )

    def test_page_churn_is_context_not_structural_identity(self) -> None:
        database = self.make_knowledge("page-churn.sqlite")
        first = self.delta("S1", page_generations=40)
        result = ingest_delta(database, first)
        self.assertEqual(result["delta"]["newFacts"]["instructions"], 2)
        self.assertEqual(result["delta"]["newFacts"]["edges"], 1)
        self.assertEqual(result["delta"]["newFacts"]["executablePhysicalPages"], 1)

        second = replace(
            self.delta("S2", page_generations=30),
            frontier_identity_at_start=result["delta"]["frontierAfter"],
        )
        repeated = ingest_delta(database, second)
        self.assertEqual(repeated["delta"]["newFacts"]["instructions"], 0)
        self.assertEqual(repeated["delta"]["newFacts"]["edges"], 0)
        status = knowledge_status(database)
        self.assertEqual(status["counts"]["instructions"], 2)
        self.assertEqual(status["counts"]["mappedInstructions"], 2)
        self.assertEqual(status["counts"]["unmappedInstructions"], 0)
        self.assertEqual(status["counts"]["edges"], 1)
        self.assertEqual(status["counts"]["executablePhysicalPages"], 1)
        self.assertEqual(status["counts"]["pageGenerationWitnesses"], 70)

    def test_accepted_historical_protocols_replay_and_0_7_fails_closed(self) -> None:
        self.assertEqual(
            SUPPORTED_INGEST_PROTOCOL_VERSIONS,
            ("0.8.0", "0.9.0", "0.10.0", "0.11.0", BRIDGE_PROTOCOL_VERSION),
        )
        for version in SUPPORTED_INGEST_PROTOCOL_VERSIONS:
            with self.subTest(version=version):
                database = self.make_knowledge(f"protocol-{version}.sqlite")
                result = ingest_delta(
                    database,
                    replace(self.delta("S1"), protocol_version=version),
                )
                self.assertEqual(result["action"], "ingested")

        database = self.make_knowledge("protocol-0.7.2.sqlite")
        with self.assertRaisesRegex(ValueError, "unsupported session bridge protocol"):
            ingest_delta(
                database,
                replace(self.delta("S1"), protocol_version="0.7.2"),
            )

    def test_stale_database_protocol_metadata_fails_closed(self) -> None:
        database = self.make_knowledge("stale-protocol.sqlite")
        connection = open_knowledge_database(database)
        try:
            connection.execute(
                "UPDATE knowledge_meta SET value='0.11.0' "
                "WHERE key='activeBridgeProtocolVersion'"
            )
            connection.commit()
        finally:
            connection.close()

        verification = verify_knowledge_database(database)
        protocol_check = next(
            item
            for item in verification["checks"]
            if item["name"] == "active-bridge-protocol"
        )
        self.assertEqual(verification["result"], "FAIL")
        self.assertEqual(protocol_check["status"], "FAIL")
        with self.assertRaisesRegex(ValueError, "bridge metadata is not current"):
            ingest_delta(database, self.delta("S1"))

    def test_exact_structural_keys_retain_tail_caller_relocation_and_changed_opcode(self) -> None:
        database = self.make_knowledge("structural.sqlite")
        first = ingest_delta(database, self.delta("S1"))
        tail = replace(
            self.delta("S2", second_placement=True, changed_opcode=True),
            frontier_identity_at_start=first["delta"]["frontierAfter"],
            instructions=(
                *self.delta("S2", second_placement=True, changed_opcode=True).instructions,
                InstructionObservation(
                    0x1008, 0x24420001, 30, 2, 2, 0x144, "exact-test"
                ),
            ),
            edges=(
                *self.delta("S2").edges,
                EdgeObservation(
                    0x1004,
                    0x00000000,
                    0x1008,
                    0x24420001,
                    31,
                    1,
                    2,
                    source_function_id=2,
                    source_z64_offset=0x140,
                    destination_function_id=2,
                    destination_z64_offset=0x144,
                ),
                EdgeObservation(
                    0x2000,
                    0x0C000050,
                    0x1004,
                    0x00000000,
                    32,
                    1,
                    1,
                    source_function_id=1,
                    source_z64_offset=0x100,
                    destination_function_id=2,
                    destination_z64_offset=0x140,
                ),
            ),
        )
        result = ingest_delta(database, tail)
        self.assertEqual(result["delta"]["newFacts"]["instructions"], 3)
        self.assertEqual(result["delta"]["newFacts"]["edges"], 2)
        connection = open_knowledge_database(database, read_only=True)
        try:
            keys = {
                (int(row[0]), int(row[1]))
                for row in connection.execute(
                    "SELECT physical_address,opcode_u32 FROM instruction_fact"
                )
            }
            self.assertIn((0x1000, 0x0C000050), keys)
            self.assertIn((0x1000, 0x0C000051), keys)
            self.assertIn((0x2000, 0x0C000050), keys)
            self.assertIn((0x1008, 0x24420001), keys)
        finally:
            connection.close()

    def test_idempotence_controller_context_and_conflict_fail_closed(self) -> None:
        database = self.make_knowledge("idempotent.sqlite")
        first = self.delta("S1")
        result = ingest_delta(database, first)
        self.assertEqual(ingest_delta(database, first)["action"], "no-op")
        with self.assertRaisesRegex(ValueError, "conflicts"):
            ingest_delta(database, replace(first, bridge_epoch="DIFFERENT"))
        second = replace(
            self.delta("S2"),
            frontier_identity_at_start=result["delta"]["frontierAfter"],
        )
        ingest_delta(database, second)
        status = knowledge_status(database)
        self.assertEqual(status["counts"]["sessions"], 2)
        self.assertEqual(status["counts"]["controllerTransitions"], 2)
        self.assertEqual(verify_knowledge_database(database)["result"], "PASS")

    def test_forced_fast_fingerprint_collision_cannot_merge_exact_dma_bytes(self) -> None:
        database = self.make_knowledge("collision.sqlite")
        first = self.delta("COLLISION")
        second_dma = replace(
            first.dma_placements[0],
            source_start=0x200,
            source_end_exclusive=0x204,
            destination_physical_start=0x3010,
            destination_physical_end_exclusive=0x3014,
            exact_bytes=b"MORE",
        )
        ingest_delta(
            database,
            replace(first, dma_placements=(first.dma_placements[0], second_dma)),
            fingerprint_function=lambda _data: 7,
        )
        connection = open_knowledge_database(database, read_only=True)
        try:
            bucket = connection.execute(
                "SELECT COUNT(*),COUNT(DISTINCT content_bytes) FROM exact_content "
                "WHERE fast_fingerprint=7"
            ).fetchone()
            self.assertEqual(tuple(bucket), (2, 2))
        finally:
            connection.close()

    def test_opcode_mismatched_rom_mapping_fails_before_ingestion(self) -> None:
        database = self.make_knowledge("mapping-fail-closed.sqlite")
        invalid = replace(
            self.delta("S1"),
            instructions=(
                InstructionObservation(
                    0x1000,
                    0xDEADBEEF,
                    20,
                    1,
                    1,
                    0x100,
                    "accepted-static-nominal-vram",
                ),
            ),
            edges=(),
        )
        with self.assertRaisesRegex(ValueError, "does not equal all four bytes"):
            ingest_delta(database, invalid)
        self.assertEqual(knowledge_status(database)["counts"]["sessions"], 0)

    def test_verifier_rejects_a_tampered_rom_mapping(self) -> None:
        database = self.make_knowledge("mapping-verifier.sqlite")
        ingest_delta(database, self.delta("S1"))
        connection = open_knowledge_database(database)
        try:
            connection.execute(
                "UPDATE instruction_fact SET z64_offset=260 WHERE physical_address=4096"
            )
            connection.commit()
        finally:
            connection.close()
        result = verify_knowledge_database(database)
        check = next(
            item for item in result["checks"] if item["name"] == "instruction-rom-mappings"
        )
        self.assertEqual(result["result"], "FAIL")
        self.assertEqual(check["status"], "FAIL")

    def test_ambiguous_fact_is_retained_as_unresolved_context(self) -> None:
        database = self.make_knowledge("unresolved.sqlite")
        delta = replace(
            self.delta("AMBIGUOUS"),
            instructions=(),
            edges=(),
            unresolved=(
                UnresolvedKnowledgeObservation(
                    "ambiguous:1",
                    "exact-execution-placement-or-generation-unresolved",
                    20,
                    100,
                    {"pc": "0x80001000", "opcode": "0x00000000"},
                ),
            ),
        )
        ingest_delta(database, delta)
        status = knowledge_status(database)
        self.assertEqual(status["counts"]["instructions"], 0)
        self.assertEqual(status["counts"]["unresolved"], 1)

    def test_interrupted_transaction_cannot_partially_change_knowledge(self) -> None:
        database = self.make_knowledge("rollback.sqlite")
        before = knowledge_status(database)
        with self.assertRaisesRegex(RuntimeError, "injected"):
            ingest_delta(
                database,
                self.delta("FAIL"),
                _test_fail_after_stage="facts",
            )
        after = knowledge_status(database)
        self.assertEqual(after["counts"], before["counts"])
        self.assertEqual(after["frontier"], before["frontier"])

    def test_incremental_materialization_equals_exact_clean_replay(self) -> None:
        incremental = self.make_knowledge("incremental.sqlite")
        rebuilt = self.make_knowledge("rebuilt.sqlite")
        first = self.delta("S1", second_placement=True)
        first_result = ingest_delta(incremental, first)
        second = replace(
            self.delta("S2", changed_opcode=True),
            frontier_identity_at_start=first_result["delta"]["frontierAfter"],
        )
        ingest_delta(incremental, second)
        rebuilt_first = ingest_delta(rebuilt, first)
        ingest_delta(
            rebuilt,
            replace(
                second,
                frontier_identity_at_start=rebuilt_first["delta"]["frontierAfter"],
            ),
        )
        self.assertEqual(verify_knowledge_database(incremental)["result"], "PASS")
        self.assertEqual(verify_knowledge_database(rebuilt)["result"], "PASS")
        equivalence = compare_knowledge_databases(incremental, rebuilt)
        self.assertTrue(equivalence["equivalent"], equivalence)

    def test_rebuild_equivalence_ignores_only_noncanonical_ledger_bookkeeping(self) -> None:
        source = self.make_knowledge("equivalence-source.sqlite")
        rebuilt = self.make_knowledge("equivalence-rebuilt.sqlite")
        ingest_delta(source, self.delta("S1"))
        ingest_delta(rebuilt, self.delta("S1"))

        connection = open_knowledge_database(rebuilt)
        try:
            connection.execute(
                """
                UPDATE ingestion_ledger SET
                    raw_manifest_reference='diagnostic-only',
                    frontier_format_version=2,
                    source_capture_path='different-capture-path',
                    source_product_path='different-product-path',
                    source_product_reference='regenerated-diagnostic-reference',
                    ingested_utc='different-time',
                    delta_summary_json='{}'
                """
            )
            connection.commit()
        finally:
            connection.close()
        self.assertTrue(compare_knowledge_databases(source, rebuilt)["equivalent"])

        connection = open_knowledge_database(rebuilt)
        try:
            connection.execute(
                "UPDATE ingestion_ledger SET bridge_epoch='DIFFERENT-STABLE-IDENTITY'"
            )
            connection.commit()
        finally:
            connection.close()
        equivalence = compare_knowledge_databases(source, rebuilt)
        self.assertFalse(equivalence["equivalent"])
        self.assertIn("ingestion_ledger", equivalence["mismatchedTables"])


if __name__ == "__main__":
    unittest.main()
