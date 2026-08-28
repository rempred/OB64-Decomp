from __future__ import annotations

from dataclasses import replace
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch

from tools.total_resolver.identities import rom_identity_from_file
from tools.total_resolver.knowledge import (
    CallObservation,
    CodePageObservation,
    ControllerTransitionObservation,
    DmaPlacementObservation,
    EdgeObservation,
    FocusedExecutionObservation,
    FocusedPointerSnapshotObservation,
    FunctionPlacementObservation,
    InstructionObservation,
    KnownActivityObservation,
    MarkerContextWindowObservation,
    MarkerExecutionContextRecord,
    RegionLifetimeObservation,
    SampledPcObservation,
    SemanticMarkerObservation,
    SessionDelta,
    SUPPORTED_INGEST_PROTOCOL_VERSIONS,
    UnresolvedKnowledgeObservation,
    compare_canonical_machine_facts,
    compare_knowledge_databases,
    build_frontier,
    create_knowledge_database,
    empty_novelty_frontier,
    ingest_delta,
    knowledge_status,
    migrate_frontier_database,
    open_knowledge_database,
    verify_knowledge_database,
    write_native_frontier,
)
from tools.total_resolver.resolver_context import (
    ResolverContext,
    explain_selected,
    open_explicit_legacy_resolver,
    search_selected,
)
from tools.total_resolver.protocol import BRIDGE_PROTOCOL_VERSION, FRONTIER_FORMAT_VERSION
from tools.total_resolver.protocol import (
    ACTIVITY_PROTOCOL_VERSIONS,
    ATOMIC_CALL_PROTOCOL_VERSIONS,
)
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
            CREATE TABLE direct_call(
                call_id INTEGER PRIMARY KEY,
                instruction_rom INTEGER,
                function_id INTEGER
            );
            CREATE TABLE candidate_callee(
                instruction_rom INTEGER,
                candidate_function_id INTEGER,
                candidate_rom INTEGER,
                method TEXT,
                confidence TEXT
            );
            INSERT INTO logical_function VALUES
                (1,'func_00000100','func_00000100',256,320,'accepted-structural'),
                (2,'func_00000140','func_00000140',320,384,'accepted-structural');
            INSERT INTO direct_call VALUES(1,256,1);
            INSERT INTO candidate_callee VALUES(
                256,2,320,'decoded-direct-target','accepted-structural'
            );
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
        destination = self.root / "frontier-v6.sqlite"

        result = migrate_frontier_database(source, destination)

        self.assertEqual(result["fromFrontierFormatVersion"], 2)
        self.assertEqual(result["toFrontierFormatVersion"], FRONTIER_FORMAT_VERSION)
        self.assertEqual(result["factMutation"], "none")
        self.assertEqual(result["verification"]["result"], "PASS")
        self.assertTrue(compare_canonical_machine_facts(source, destination)["equivalent"])
        source_connection = sqlite3.connect(source)
        destination_connection = sqlite3.connect(destination)
        try:
            self.assertEqual(
                destination_connection.execute(
                    "SELECT value FROM knowledge_meta WHERE key='frontierFormatVersion'"
                ).fetchone()[0],
                str(FRONTIER_FORMAT_VERSION),
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
            protocol_version="0.12.0",
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

    def test_static_data_dma_factors_resources_destinations_and_rotating_pairs(self) -> None:
        database = self.make_knowledge("factorized-data-dma.sqlite")

        def dma(
            destination: int,
            region_class: str,
            sequence: int = 30,
            matched_length: int = 4,
        ) -> DmaPlacementObservation:
            return DmaPlacementObservation(
                "cartridge-rom",
                0x200,
                0x204,
                destination,
                destination + 4,
                matched_length,
                b"RING",
                region_class,
                "exact-test",
                "verified",
                sequence,
                sequence + 1,
                100,
                100,
            )

        first = replace(
            self.delta("DMA-FACTOR-1"),
            dma_placements=(
                dma(0x3000, "data", 30),
                dma(0x3004, "data", 32),
                dma(0x4000, "executable", 34),
                dma(0x4004, "executable", 36),
                dma(0x4008, "executable", 38, matched_length=2),
            ),
        )
        first_result = ingest_delta(database, first)
        self.assertEqual(first_result["delta"]["newFacts"]["dmaDataResources"], 1)
        self.assertEqual(first_result["delta"]["newFacts"]["dmaDataDestinations"], 2)
        self.assertEqual(first_result["delta"]["newFacts"]["dmaPlacements"], 3)

        second = replace(
            self.delta("DMA-FACTOR-2"),
            frontier_identity_at_start=first_result["delta"]["frontierAfter"],
            dma_placements=(dma(0x3004, "data", 30), dma(0x3008, "data", 32)),
        )
        second_result = ingest_delta(database, second)
        self.assertEqual(second_result["delta"]["newFacts"]["dmaDataResources"], 0)
        self.assertEqual(second_result["delta"]["newFacts"]["dmaDataDestinations"], 1)
        self.assertEqual(second_result["delta"]["newFacts"]["dmaPlacements"], 0)

        connection = open_knowledge_database(database, read_only=True)
        try:
            frontier = build_frontier(connection)
            self.assertEqual(
                sorted(item.match_kind for item in frontier.dma),
                [
                    "data-destination",
                    "data-destination",
                    "data-destination",
                    "data-resource",
                    "exact-placement",
                    "exact-placement",
                    "exact-placement",
                ],
            )
            partial = next(
                item
                for item in frontier.dma
                if item.destination_physical_start == 0x4008
            )
            self.assertEqual(partial.matched_length, 4)
            self.assertEqual(partial.exact_bytes, b"RING")
            self.assertEqual(
                connection.execute(
                    "SELECT matched_length FROM dma_placement "
                    "WHERE destination_physical_start=0x4008"
                ).fetchone()[0],
                2,
            )
            self.assertEqual(
                tuple(
                    connection.execute(
                        "SELECT observation_count,session_count "
                        "FROM dma_resource_fact"
                    ).fetchone()
                ),
                (4, 2),
            )
            self.assertEqual(
                connection.execute(
                    "SELECT COUNT(*) FROM dma_data_destination_fact"
                ).fetchone()[0],
                3,
            )
            self.assertEqual(
                connection.execute("SELECT COUNT(*) FROM dma_placement").fetchone()[0],
                3,
            )
            self.assertEqual(
                connection.execute("SELECT COUNT(*) FROM dma_frontier_fact").fetchone()[0],
                7,
            )
        finally:
            connection.close()
        frontier_path = write_native_frontier(frontier, self.root / "factorized.trf")
        self.assertEqual(frontier_path.read_bytes()[:8], b"OB64TRF6")
        self.assertEqual(verify_knowledge_database(database)["result"], "PASS")

    def test_frontier_migration_adds_missing_exact_partial_rom_dma(self) -> None:
        source = self.make_knowledge("partial-dma-frontier-source.sqlite")
        partial = DmaPlacementObservation(
            "cartridge-rom",
            0x200,
            0x204,
            0x5000,
            0x5004,
            2,
            b"FULL",
            "unknown",
            "exact-test",
            "supported",
            30,
            31,
            100,
            100,
        )
        ingest_delta(
            source,
            replace(self.delta("PARTIAL-DMA"), dma_placements=(partial,)),
        )
        connection = open_knowledge_database(source)
        try:
            placement_id = int(
                connection.execute(
                    "SELECT dma_placement_id FROM dma_placement "
                    "WHERE destination_physical_start=0x5000"
                ).fetchone()[0]
            )
            connection.execute(
                "DELETE FROM dma_frontier_fact WHERE dma_placement_id=?",
                (placement_id,),
            )
            connection.commit()
        finally:
            connection.close()

        destination = self.root / "partial-dma-frontier-migrated.sqlite"
        result = migrate_frontier_database(source, destination)

        self.assertEqual(result["exactDmaFrontierFactsAdded"], 1)
        self.assertEqual(result["verification"]["result"], "PASS")
        self.assertTrue(result["status"]["frontier"]["frontierIdentity"].startswith("K3:"))
        connection = open_knowledge_database(destination, read_only=True)
        try:
            item = next(
                value
                for value in build_frontier(connection).dma
                if value.destination_physical_start == 0x5000
            )
            self.assertEqual(item.match_kind, "exact-placement")
            self.assertEqual(item.matched_length, 4)
            self.assertEqual(item.exact_bytes, b"FULL")
        finally:
            connection.close()

    def test_focused_state_is_atomic_exact_and_immediately_queryable(self) -> None:
        database = self.make_knowledge("focused.sqlite")
        base = self.delta("FOCUSED")
        activity = KnownActivityObservation(
            frontier_identity=base.frontier_identity_at_start,
            frontier_format_version=FRONTIER_FORMAT_VERSION,
            bridge_sequence=60,
            instruction_max_ordinal=0,
            instruction_hit_count=0,
            instruction_hit_bitmap=b"",
            edge_max_ordinal=0,
            edge_hit_count=0,
            edge_hit_bitmap=b"",
            call_max_ordinal=0,
            call_hit_count=0,
            call_hit_bitmap=b"",
            dma_max_ordinal=0,
            dma_hit_count=0,
            dma_hit_bitmap=b"",
        )
        profile = {
            "schema": "ob64-total-resolver-focused-profile.v1",
            "profileId": "cutscene-studio-v1",
            "profileVersion": 1,
            "description": "test profile",
            "triggerCount": 2,
            "targets": [
                {
                    "watchId": "focused-stage-builder-1",
                    "profileId": "cutscene-studio-v1",
                    "profileVersion": 1,
                    "targetId": "stage-builder",
                    "functionId": 1,
                    "z64Start": 0x100,
                    "liveStart": 0x80001000,
                    "liveEndExclusive": 0x80001040,
                    "entryOpcode": 0x0C000050,
                    "signatureBytesEncoding": "hex-uppercase",
                    "signatureBytesHex": "0C000050",
                    "sampleMode": "all",
                    "pointerSnapshots": [
                        {"register": "a0", "size": 4, "label": "arg0-stage"}
                    ],
                    "stackWords": 0,
                },
                {
                    "watchId": "focused-stage-builder-2",
                    "profileId": "cutscene-studio-v1",
                    "profileVersion": 1,
                    "targetId": "stage-builder",
                    "functionId": 1,
                    "z64Start": 0x100,
                    "liveStart": 0x80002000,
                    "liveEndExclusive": 0x80002040,
                    "entryOpcode": 0x0C000050,
                    "signatureBytesEncoding": "hex-uppercase",
                    "signatureBytesHex": "0C000050",
                    "sampleMode": "all",
                    "pointerSnapshots": [
                        {"register": "a0", "size": 4, "label": "arg0-stage"}
                    ],
                    "stackWords": 0,
                },
            ],
            "capturePolicy": {},
        }
        focused = FocusedExecutionObservation(
            bridge_sequence=40,
            frame=200,
            profile_id="cutscene-studio-v1",
            profile_version=1,
            target_id="stage-builder",
            trigger_role="entry",
            invocation_id="cutscene-studio-v1:stage-builder:1",
            function_id=1,
            z64_start=0x100,
            live_pc=0x80001000,
            physical_pc=0x1000,
            opcode_u32=0x0C000050,
            target_live_start=0x80001000,
            target_live_end_exclusive=0x80001040,
            sample_mode="all",
            entry_return_address=0x80001100,
            target_signature_bytes=bytes.fromhex("0C000050"),
            registers={"a0": "0x80002000", "sp": "0x80003000"},
            stack={"base": "0x80003000", "words": []},
            pointer_issues=(),
            capture_phase="focused-function-entry",
            pointers=(
                FocusedPointerSnapshotObservation(
                    "a0",
                    "entry",
                    "arg0-stage",
                    0x80002000,
                    0x2000,
                    b"STAG",
                    "synchronous-focused-callback",
                ),
            ),
        )
        delta = replace(
            base,
            protocol_version=BRIDGE_PROTOCOL_VERSION,
            known_activity=activity,
            focused_profile=profile,
            focused_executions=(focused,),
        )
        result = ingest_delta(database, delta)
        self.assertEqual(result["delta"]["newFacts"]["focusedExecutionWitnesses"], 1)
        self.assertEqual(result["delta"]["newFacts"]["focusedPointerSnapshots"], 1)
        connection = open_knowledge_database(database, read_only=True)
        try:
            self.assertEqual(
                tuple(
                    connection.execute(
                        "SELECT configured_watch_count,entry_witness_count "
                        "FROM focused_capture_session"
                    ).fetchone()
                ),
                (2, 1),
            )
            self.assertEqual(
                bytes(
                    connection.execute(
                        "SELECT c.content_bytes FROM focused_pointer_snapshot p "
                        "JOIN exact_content c ON c.content_id=p.content_id"
                    ).fetchone()[0]
                ),
                b"STAG",
            )
        finally:
            connection.close()

        field_product = self.root / "focused-field-product"
        field_database = field_product / "db" / "structure-field-access.sqlite"
        field_database.parent.mkdir(parents=True)
        sqlite3.connect(field_database).close()
        with patch(
            "tools.total_resolver.resolver_context.validate_query_sources",
            return_value=(),
        ):
            with ResolverContext.open(
                database,
                static_database=self.static,
                resource_database=self.resource,
                field_product=field_product,
            ) as context:
                explained, status = explain_selected(
                    context, "func_00000100", includes=("focused",)
                )
                self.assertEqual(status, 0)
                focused_rows = explained["previews"]["focusedContext"]
                self.assertEqual(focused_rows["count"], 1)
                self.assertEqual(
                    focused_rows["rows"][0]["pointerSnapshots"][0]["bytesHex"],
                    "53544147",
                )
                searched = search_selected(
                    context,
                    focused_profile="cutscene-studio-v1",
                    focused_target="stage-builder",
                )
                self.assertEqual(searched["counts"]["focusedExecutionWitnesses"], 1)

        self.assertEqual(verify_knowledge_database(database)["result"], "PASS")
        tampered = open_knowledge_database(database)
        try:
            tampered.execute(
                "UPDATE focused_capture_session SET configuration_json="
                "replace(configuration_json,'cutscene-studio-v1','tampered-profile')"
            )
            tampered.commit()
        finally:
            tampered.close()
        tampered_verification = verify_knowledge_database(database)
        self.assertEqual(tampered_verification["result"], "FAIL")
        self.assertEqual(
            next(
                item
                for item in tampered_verification["checks"]
                if item["name"] == "focused-capture-context"
            )["status"],
            "FAIL",
        )

        invalid_database = self.make_knowledge("focused-invalid.sqlite")
        invalid = replace(
            delta,
            session_id="FOCUSED-BAD",
            capture_identity="capture:FOCUSED-BAD",
            bridge_epoch="EPOCH-FOCUSED-BAD",
            focused_executions=(
                replace(
                    focused,
                    pointer_issues=({"register": "a0", "reason": "invalid"},),
                ),
            ),
        )
        with self.assertRaisesRegex(ValueError, "pointer results"):
            ingest_delta(invalid_database, invalid)
        invalid_connection = open_knowledge_database(invalid_database, read_only=True)
        try:
            self.assertEqual(
                invalid_connection.execute("SELECT COUNT(*) FROM ingestion_ledger").fetchone()[0],
                0,
            )
            self.assertEqual(
                invalid_connection.execute(
                    "SELECT COUNT(*) FROM focused_execution_witness"
                ).fetchone()[0],
                0,
            )
        finally:
            invalid_connection.close()

    def test_accepted_historical_protocols_replay_and_0_7_fails_closed(self) -> None:
        self.assertEqual(
            SUPPORTED_INGEST_PROTOCOL_VERSIONS,
            (
                "0.8.0",
                "0.9.0",
                "0.10.0",
                "0.11.0",
                "0.12.0",
                "0.13.0",
                "0.14.0",
                "0.15.0",
                "0.16.0",
                BRIDGE_PROTOCOL_VERSION,
            ),
        )
        for version in SUPPORTED_INGEST_PROTOCOL_VERSIONS:
            with self.subTest(version=version):
                database = self.make_knowledge(f"protocol-{version}.sqlite")
                delta = replace(self.delta("S1"), protocol_version=version)
                if version in ACTIVITY_PROTOCOL_VERSIONS:
                    delta = replace(
                        delta,
                        known_activity=KnownActivityObservation(
                            frontier_identity=delta.frontier_identity_at_start,
                            frontier_format_version=(
                                FRONTIER_FORMAT_VERSION
                                if version == BRIDGE_PROTOCOL_VERSION
                                else 5
                            ),
                            bridge_sequence=60,
                            instruction_max_ordinal=0,
                            instruction_hit_count=0,
                            instruction_hit_bitmap=b"",
                            edge_max_ordinal=0,
                            edge_hit_count=0,
                            edge_hit_bitmap=b"",
                            call_max_ordinal=0,
                            call_hit_count=0,
                            call_hit_bitmap=b"",
                            dma_max_ordinal=0,
                            dma_hit_count=0,
                            dma_hit_bitmap=b"",
                        ),
                    )
                result = ingest_delta(database, delta)
                self.assertEqual(result["action"], "ingested")
                connection = open_knowledge_database(database, read_only=True)
                try:
                    compatibility_calls = int(
                        connection.execute("SELECT COUNT(*) FROM call_fact").fetchone()[0]
                    )
                finally:
                    connection.close()
                self.assertEqual(
                    compatibility_calls,
                    0 if version in ATOMIC_CALL_PROTOCOL_VERSIONS else 1,
                )

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

    def test_schema3_retains_context_and_selected_queries_are_immediate_read_only(self) -> None:
        database = self.make_knowledge("context.sqlite")
        base = self.delta("CONTEXT")
        unresolved_instruction = InstructionObservation(
            0x2000,
            0x0C000050,
            40,
            3,
            None,
            None,
            "unresolved",
            200,
        )
        delta = replace(
            base,
            instructions=(
                *(replace(item, frame=190 + index) for index, item in enumerate(base.instructions)),
                unresolved_instruction,
            ),
            edges=tuple(replace(item, frame=195) for item in base.edges),
            function_placements=(
                *base.function_placements,
                FunctionPlacementObservation(
                    1, 0x100, 0x140, 0x2000, 0x2040, "exact-test", 30, 50
                ),
            ),
            regions=(
                RegionLifetimeObservation(
                    "region:context",
                    0x2000,
                    0x2040,
                    "z64-rom",
                    "z64:00000100-00000140",
                    0x100,
                    0x140,
                    30,
                    50,
                    190,
                    210,
                    49,
                    "replaced",
                    "executable",
                    "verified",
                    "transaction:1",
                    None,
                ),
            ),
            sampled_pcs=(
                SampledPcObservation(
                    "sample:1",
                    41,
                    None,
                    201,
                    0x80002000,
                    0x2000,
                    0x0C000050,
                    "region:context",
                    None,
                    None,
                    "resident-unmapped",
                    {"pc": "0x80002000", "opcode": "0x0C000050"},
                ),
            ),
            semantic_markers=(
                SemanticMarkerObservation(
                    1,
                    "visible-action",
                    "human",
                    "certain",
                    "Block menu opened",
                    "fixture marker",
                    39,
                    42,
                    199,
                    202,
                    "2026-08-20T00:00:00Z",
                ),
            ),
            marker_context_windows=(
                MarkerContextWindowObservation(
                    1,
                    "complete",
                    43,
                    1,
                    1,
                    1,
                    1,
                    "native local order and frames are context only",
                    (
                        MarkerExecutionContextRecord(
                            100, "before", 199, 0x80002000, 0x2000,
                            0x0C000050, False, 0, None, 0
                        ),
                        MarkerExecutionContextRecord(
                            101, "after", 200, 0x80002004, 0x2004,
                            0, True, 0x80002000, 0x2000, 0x0C000050
                        ),
                    ),
                ),
            ),
            unresolved=(
                UnresolvedKnowledgeObservation(
                    "unresolved:context",
                    "exact-execution-placement-or-generation-unresolved",
                    40,
                    200,
                    {
                        "physicalPc": "0x2000",
                        "opcode": "0x0C000050",
                        "nextEvidence": "retain exact residency context",
                    },
                ),
            ),
            semantic_name="Hugo Report - People",
            semantic_notes="Renamed and discharged a character",
            semantic_context_created_utc="2026-08-27T20:00:00Z",
        )
        ingest_delta(database, delta)
        rebuilt = self.make_knowledge("context-rebuilt.sqlite")
        ingest_delta(rebuilt, delta)
        context_equivalence = compare_knowledge_databases(database, rebuilt)
        self.assertTrue(context_equivalence["equivalent"], context_equivalence)
        connection = open_knowledge_database(database, read_only=True)
        try:
            self.assertEqual(
                connection.execute("SELECT COUNT(*) FROM session_catalog").fetchone()[0], 1
            )
            self.assertEqual(
                connection.execute("SELECT COUNT(*) FROM sampled_pc_context").fetchone()[0], 1
            )
            states = {
                str(row[0])
                for row in connection.execute(
                    "SELECT candidate_state FROM instruction_mapping_candidate c "
                    "JOIN instruction_fact i ON i.instruction_id=c.instruction_id "
                    "WHERE i.physical_address=0x2000"
                )
            }
            self.assertIn("uniquely-resolved-live-mapping", states)
            self.assertIsNone(
                connection.execute(
                    "SELECT function_id FROM instruction_fact "
                    "WHERE physical_address=0x2000 AND opcode_u32=0x0C000050"
                ).fetchone()[0]
            )
        finally:
            connection.close()

        field_product = self.root / "field-product"
        field_database = field_product / "db" / "structure-field-access.sqlite"
        field_database.parent.mkdir(parents=True)
        sqlite3.connect(field_database).close()
        with patch(
            "tools.total_resolver.resolver_context.validate_query_sources",
            return_value=(),
        ):
            with ResolverContext.open(
                database,
                static_database=self.static,
                resource_database=self.resource,
                field_product=field_product,
            ) as context:
                explained, status = explain_selected(context, "func_00000100")
                self.assertEqual(status, 0)
                self.assertEqual(explained["sourceManifest"]["mode"], "selected-knowledge")
                self.assertEqual(
                    explained["schema"], "ob64-total-resolver-agent-query.v2"
                )
                call_graph = explained["callGraph"]
                self.assertEqual(
                    call_graph["static"]["callees"]["functions"][0]["structuralName"],
                    "func_00000140",
                )
                self.assertEqual(
                    call_graph["runtime"]["callees"]["callsiteFactCount"], 1
                )
                self.assertEqual(
                    call_graph["runtime"]["callees"]["unresolvedCallsiteCount"], 1
                )
                reverse, reverse_status = explain_selected(
                    context,
                    "func_00000140",
                    relationship="callers",
                    includes=("calls",),
                    limit=1,
                )
                self.assertEqual(reverse_status, 0)
                self.assertFalse(reverse["callGraph"]["runtime"]["callees"]["included"])
                self.assertEqual(
                    reverse["callGraph"]["static"]["callers"]["functions"][0][
                        "structuralName"
                    ],
                    "func_00000100",
                )
                placements_only, placements_status = explain_selected(
                    context,
                    "func_00000100",
                    relationship="placements",
                )
                self.assertEqual(placements_status, 0)
                self.assertFalse(
                    placements_only["callGraph"]["static"]["callers"]["included"]
                )
                self.assertFalse(
                    placements_only["callGraph"]["runtime"]["callees"]["included"]
                )
                searched = search_selected(
                    context,
                    physical="0x2000",
                    opcode="0x0C000050",
                    session_id="CONTEXT",
                    frame_start=190,
                    frame_end=210,
                    marker_text="Block",
                    limit=5,
                )
                self.assertEqual(searched["counts"]["instructions"], 1)
                self.assertEqual(searched["counts"]["markers"], 1)
                self.assertEqual(
                    searched["counts"]["markerExecutionContextRecords"], 1
                )
                self.assertEqual(
                    searched["markers"][0]["executionContext"]["retained_after_count"],
                    1,
                )
                self.assertTrue(searched["mappingDiagnostics"])
                self.assertTrue(searched["pagination"]["bounded"])
                self.assertEqual(searched["counts"]["sessions"], 1)
                self.assertEqual(
                    searched["sessions"][0]["semanticName"],
                    "Hugo Report - People",
                )
                self.assertLessEqual(
                    max(
                        len(searched[key])
                        for key in (
                            "sessions",
                            "functions",
                            "instructions",
                            "edges",
                            "unresolved",
                            "controllerTransitions",
                            "markers",
                            "sampledPcs",
                            "markerExecutionContext",
                        )
                    ),
                    5,
                )

                by_bytes_and_sequence = search_selected(
                    context,
                    exact_bytes="0C000050",
                    session_id="CONTEXT",
                    sequence_start=20,
                    sequence_end=43,
                )
                self.assertGreaterEqual(
                    by_bytes_and_sequence["counts"]["instructions"], 1
                )
                by_edge = search_selected(
                    context,
                    edge_from="0x1000",
                    edge_to="0x1004",
                    session_id="CONTEXT",
                    frame_start=190,
                    frame_end=200,
                )
                self.assertEqual(by_edge["counts"]["edges"], 1)
                by_unresolved = search_selected(
                    context,
                    unresolved_kind=(
                        "exact-execution-placement-or-generation-unresolved"
                    ),
                    session_id="CONTEXT",
                    sequence_start=40,
                    sequence_end=40,
                )
                self.assertEqual(by_unresolved["counts"]["unresolved"], 1)
                by_controller = search_selected(
                    context,
                    session_id="CONTEXT",
                    sequence_start=27,
                    sequence_end=27,
                    controller=True,
                    buttons="0x80000000",
                )
                self.assertEqual(
                    by_controller["counts"]["controllerTransitions"], 1
                )
                by_function = search_selected(context, function="000001")
                self.assertEqual(by_function["counts"]["functions"], 2)
                self.assertEqual(by_function["counts"]["sessions"], 0)

                by_session_name = search_selected(
                    context, session_keyword="hugo people"
                )
                self.assertEqual(by_session_name["counts"]["sessions"], 1)
                self.assertEqual(
                    by_session_name["sessions"][0]["sessionId"], "CONTEXT"
                )
                self.assertEqual(
                    by_session_name["sessions"][0]["semanticNotes"],
                    "Renamed and discharged a character",
                )
                by_session_notes = search_selected(
                    context, session_keyword="DISCHARGED"
                )
                self.assertEqual(by_session_notes["counts"]["sessions"], 1)

                explained_sessions = explained["previews"]["sessions"]
                self.assertEqual(
                    explained_sessions[0]["semanticName"],
                    "Hugo Report - People",
                )

                index_plans = {
                    "instruction_opcode_idx": context.knowledge.execute(
                        "EXPLAIN QUERY PLAN SELECT instruction_id FROM instruction_fact "
                        "WHERE opcode_u32=?",
                        (0x0C000050,),
                    ).fetchall(),
                    "instruction_session_sequence_idx": context.knowledge.execute(
                        "EXPLAIN QUERY PLAN SELECT instruction_id FROM "
                        "instruction_context_witness WHERE session_id=? "
                        "AND bridge_sequence BETWEEN ? AND ?",
                        ("CONTEXT", 20, 43),
                    ).fetchall(),
                    "edge_session_frame_idx": context.knowledge.execute(
                        "EXPLAIN QUERY PLAN SELECT edge_id FROM edge_context_witness "
                        "WHERE session_id=? AND frame BETWEEN ? AND ?",
                        ("CONTEXT", 190, 200),
                    ).fetchall(),
                    "unresolved_kind_idx": context.knowledge.execute(
                        "EXPLAIN QUERY PLAN SELECT local_unresolved_id FROM "
                        "unresolved_index WHERE kind=? AND session_id=?",
                        (
                            "exact-execution-placement-or-generation-unresolved",
                            "CONTEXT",
                        ),
                    ).fetchall(),
                    "marker_context_opcode_idx": context.knowledge.execute(
                        "EXPLAIN QUERY PLAN SELECT marker_id FROM "
                        "marker_execution_context_record WHERE opcode_u32=?",
                        (0x0C000050,),
                    ).fetchall(),
                }
                for expected_index, plan in index_plans.items():
                    self.assertIn(
                        expected_index,
                        " ".join(str(column) for row in plan for column in row),
                    )
                with self.assertRaises(sqlite3.OperationalError):
                    context.knowledge.execute(
                        "INSERT INTO knowledge_meta VALUES('forbidden','write')"
                    )

        with patch(
            "tools.total_resolver.resolver_context.selected_knowledge_database",
            return_value=database,
        ), patch(
            "tools.total_resolver.resolver_context.validate_query_sources",
            return_value=(),
        ):
            with ResolverContext.open(
                static_database=self.static,
                resource_database=self.resource,
                field_product=field_product,
            ) as selected_context:
                self.assertTrue(selected_context.manifest["dynamic"]["selected"])
                self.assertEqual(
                    selected_context.manifest["dynamic"]["sessionCount"], 1
                )

        stale_resolver = self.root / "stale-generated-resolver.sqlite"
        stale_connection = sqlite3.connect(stale_resolver)
        try:
            stale_connection.executescript(
                "CREATE TABLE meta(key TEXT PRIMARY KEY,value TEXT);"
                "INSERT INTO meta VALUES('schema','ob64-total-resolver-r3.v1');"
            )
            stale_connection.commit()
        finally:
            stale_connection.close()
        with patch(
            "tools.total_resolver.resolver_context.selected_knowledge_database",
            return_value=stale_resolver,
        ):
            with self.assertRaisesRegex(
                ValueError, "unsupported Total Resolver knowledge schema"
            ):
                ResolverContext.open(
                    static_database=self.static,
                    resource_database=self.resource,
                    field_product=field_product,
                )

        with self.assertRaisesRegex(ValueError, "not persistent knowledge"):
            open_explicit_legacy_resolver(database)

    def test_function_call_graph_pairs_callsite_delay_slot_and_transfer(self) -> None:
        database = self.make_knowledge("function-call-graph.sqlite")
        base = self.delta("CALL-GRAPH")
        delta = replace(
            base,
            protocol_version=BRIDGE_PROTOCOL_VERSION,
            known_activity=KnownActivityObservation(
                frontier_identity=base.frontier_identity_at_start,
                frontier_format_version=FRONTIER_FORMAT_VERSION,
                bridge_sequence=60,
                instruction_max_ordinal=0,
                instruction_hit_count=0,
                instruction_hit_bitmap=b"",
                edge_max_ordinal=0,
                edge_hit_count=0,
                edge_hit_bitmap=b"",
                call_max_ordinal=0,
                call_hit_count=0,
                call_hit_bitmap=b"",
                dma_max_ordinal=0,
                dma_hit_count=0,
                dma_hit_bitmap=b"",
            ),
            instructions=(
                InstructionObservation(
                    0x1000, 0x0C000050, 20, 1, 1, 0x100, "exact-test", 194
                ),
                InstructionObservation(
                    0x1004, 0x00000000, 22, 1, 1, 0x104, "exact-test", 195
                ),
                InstructionObservation(
                    0x0140, 0x00000000, 23, 1, 2, 0x140, "exact-test", 195
                ),
            ),
            edges=(
                EdgeObservation(
                    0x1000,
                    0x0C000050,
                    0x1004,
                    0x00000000,
                    22,
                    1,
                    1,
                    source_function_id=1,
                    source_z64_offset=0x100,
                    destination_function_id=1,
                    destination_z64_offset=0x104,
                    frame=195,
                ),
                EdgeObservation(
                    0x1004,
                    0x00000000,
                    0x0140,
                    0x00000000,
                    23,
                    1,
                    1,
                    source_function_id=1,
                    source_z64_offset=0x104,
                    destination_function_id=2,
                    destination_z64_offset=0x140,
                    frame=195,
                ),
            ),
            calls=(
                CallObservation(
                    0x1000,
                    0x0C000050,
                    0x1004,
                    0x00000000,
                    0x0140,
                    0x00000000,
                    "jal-direct",
                    23,
                    1,
                    1,
                    1,
                    195,
                ),
            ),
            function_placements=(
                FunctionPlacementObservation(
                    1, 0x100, 0x140, 0x1000, 0x1040, "exact-test", 20, 23
                ),
                FunctionPlacementObservation(
                    2, 0x140, 0x180, 0x0140, 0x0180, "exact-test", 20, 23
                ),
            ),
        )
        first_ingestion = ingest_delta(database, delta)
        repeated = replace(
            self.delta("CALL-GRAPH-REPEAT"),
            protocol_version=BRIDGE_PROTOCOL_VERSION,
            frontier_identity_at_start=first_ingestion["delta"]["frontierAfter"],
            code_pages=(),
            instructions=(),
            edges=(),
            calls=(),
            dma_placements=(),
            function_placements=(),
            known_activity=KnownActivityObservation(
                frontier_identity=first_ingestion["delta"]["frontierAfter"],
                frontier_format_version=FRONTIER_FORMAT_VERSION,
                bridge_sequence=60,
                instruction_max_ordinal=3,
                instruction_hit_count=0,
                instruction_hit_bitmap=b"\x00",
                edge_max_ordinal=2,
                edge_hit_count=0,
                edge_hit_bitmap=b"\x00",
                call_max_ordinal=1,
                call_hit_count=1,
                call_hit_bitmap=b"\x01",
                dma_max_ordinal=1,
                dma_hit_count=0,
                dma_hit_bitmap=b"\x00",
            ),
        )
        ingest_delta(database, repeated)

        connection = open_knowledge_database(database, read_only=True)
        try:
            persisted = connection.execute(
                "SELECT callsite_instruction_id,delay_instruction_id,"
                "target_instruction_id,call_kind FROM call_relationship_fact"
            ).fetchone()
            self.assertIsNotNone(persisted)
            self.assertEqual(str(persisted[3]), "jal-direct")
        finally:
            connection.close()

        field_product = self.root / "call-graph-field-product"
        field_database = field_product / "db" / "structure-field-access.sqlite"
        field_database.parent.mkdir(parents=True)
        sqlite3.connect(field_database).close()
        with patch(
            "tools.total_resolver.resolver_context.validate_query_sources",
            return_value=(),
        ):
            with ResolverContext.open(
                database,
                static_database=self.static,
                resource_database=self.resource,
                field_product=field_product,
            ) as context:
                explained, status = explain_selected(context, "func_00000100")
                self.assertEqual(status, 0)
                runtime_callees = explained["callGraph"]["runtime"]["callees"]
                self.assertEqual(runtime_callees["functionCount"], 1)
                self.assertEqual(
                    runtime_callees["functions"][0]["structuralName"],
                    "func_00000140",
                )
                self.assertEqual(runtime_callees["callsiteFactCount"], 1)
                self.assertEqual(runtime_callees["unresolvedCallsiteCount"], 0)
                known_call_sessions = runtime_callees["knownActivity"]["sessions"]
                self.assertEqual(known_call_sessions[0]["sessionId"], "CALL-GRAPH-REPEAT")
                self.assertEqual(
                    known_call_sessions[0]["evidence"],
                    "stop-time-native-call-hit-bitmap",
                )
                call = runtime_callees["calls"][0]
                self.assertNotEqual(call["callsiteEdgeId"], call["transferEdgeId"])
                self.assertEqual(
                    call["callsiteInstruction"]["physicalAddress"], 0x1000
                )
                self.assertEqual(
                    call["delaySlotInstruction"]["physicalAddress"], 0x1004
                )
                self.assertEqual(
                    call["destinationInstruction"]["physicalAddress"], 0x0140
                )
                witness = runtime_callees["frameSequenceWitnesses"][0]
                self.assertEqual(witness["sessionId"], "CALL-GRAPH")
                self.assertEqual(witness["callsiteSequence"], 23)
                self.assertEqual(witness["transferSequence"], 23)
                self.assertEqual(witness["callsiteFrame"], 195)
                self.assertEqual(witness["transferFrame"], 195)

                reverse, reverse_status = explain_selected(
                    context,
                    "func_00000140",
                    relationship="callers",
                    includes=("calls",),
                    limit=1,
                )
                self.assertEqual(reverse_status, 0)
                runtime_callers = reverse["callGraph"]["runtime"]["callers"]
                self.assertEqual(runtime_callers["functionCount"], 1)
                self.assertEqual(
                    runtime_callers["functions"][0]["structuralName"],
                    "func_00000100",
                )
                self.assertIsNone(runtime_callers["unresolvedCallsiteCount"])
                self.assertFalse(
                    reverse["callGraph"]["runtime"]["callees"]["included"]
                )

    def test_known_activity_bitmaps_restore_compact_session_membership(self) -> None:
        database = self.make_knowledge("known-activity.sqlite")
        first = ingest_delta(database, self.delta("ACTIVITY-1"))
        repeated = replace(
            self.delta("ACTIVITY-2"),
            protocol_version=BRIDGE_PROTOCOL_VERSION,
            frontier_identity_at_start=first["delta"]["frontierAfter"],
            code_pages=(),
            instructions=(),
            edges=(),
            dma_placements=(),
            function_placements=(),
            known_activity=KnownActivityObservation(
                frontier_identity=first["delta"]["frontierAfter"],
                frontier_format_version=FRONTIER_FORMAT_VERSION,
                bridge_sequence=60,
                instruction_max_ordinal=2,
                instruction_hit_count=2,
                instruction_hit_bitmap=b"\x03",
                edge_max_ordinal=1,
                edge_hit_count=1,
                edge_hit_bitmap=b"\x01",
                call_max_ordinal=0,
                call_hit_count=0,
                call_hit_bitmap=b"",
                dma_max_ordinal=1,
                dma_hit_count=1,
                dma_hit_bitmap=b"\x01",
            ),
        )
        result = ingest_delta(database, repeated)
        self.assertEqual(result["delta"]["newFacts"]["instructions"], 0)
        self.assertEqual(result["delta"]["newFacts"]["edges"], 0)
        self.assertEqual(result["delta"]["observed"]["knownInstructionHits"], 2)

        field_product = self.root / "activity-field-product"
        field_database = field_product / "db" / "structure-field-access.sqlite"
        field_database.parent.mkdir(parents=True)
        sqlite3.connect(field_database).close()
        with patch(
            "tools.total_resolver.resolver_context.validate_query_sources",
            return_value=(),
        ):
            with ResolverContext.open(
                database,
                static_database=self.static,
                resource_database=self.resource,
                field_product=field_product,
            ) as context:
                explained, status = explain_selected(
                    context, "func_00000100", includes=("sessions",)
                )
                self.assertEqual(status, 0)
                sessions = {
                    row["sessionId"]: row for row in explained["previews"]["sessions"]
                }
                self.assertEqual(
                    sessions["ACTIVITY-2"]["knownActivityInstructionCount"], 1
                )
                searched = search_selected(
                    context,
                    function="func_00000100",
                    session_id="ACTIVITY-2",
                )
                self.assertEqual(
                    searched["knownActivity"]["matchingInstructionHitCount"], 1
                )
                self.assertEqual(
                    searched["knownActivity"]["claim"], "session-membership-only"
                )

        invalid = replace(
            repeated,
            session_id="ACTIVITY-3",
            capture_identity="capture:ACTIVITY-3",
            bridge_epoch="EPOCH-ACTIVITY-3",
            known_activity=replace(
                repeated.known_activity,
                instruction_max_ordinal=3,
                instruction_hit_count=1,
                instruction_hit_bitmap=b"\x04",
            ),
        )
        with self.assertRaisesRegex(ValueError, "ordinal extent"):
            ingest_delta(database, invalid)

    def test_historical_consecutive_edges_rebuild_exact_call_relationship(self) -> None:
        database = self.make_knowledge("historical-call-rebuild.sqlite")
        base = self.delta("HISTORICAL-CALL")
        delta = replace(
            base,
            instructions=(
                InstructionObservation(
                    0x1000, 0x0C000050, 20, 1, 1, 0x100, "exact-test", 194
                ),
                InstructionObservation(
                    0x1004, 0, 22, 1, 1, 0x104, "exact-test", 195
                ),
                InstructionObservation(
                    0x0140, 0, 23, 1, 2, 0x140, "exact-test", 195
                ),
            ),
            edges=(
                EdgeObservation(
                    0x1000, 0x0C000050, 0x1004, 0, 22, 1, 1,
                    source_function_id=1, source_z64_offset=0x100,
                    destination_function_id=1, destination_z64_offset=0x104,
                    frame=195,
                ),
                EdgeObservation(
                    0x1004, 0, 0x0140, 0, 23, 1, 1,
                    source_function_id=1, source_z64_offset=0x104,
                    destination_function_id=2, destination_z64_offset=0x140,
                    frame=195,
                ),
            ),
            calls=(),
        )
        ingest_delta(database, delta)
        connection = open_knowledge_database(database, read_only=True)
        try:
            relationship = connection.execute(
                "SELECT call_kind,observation_count FROM call_relationship_fact"
            ).fetchone()
            witness = connection.execute(
                "SELECT observation_kind FROM call_relationship_context_witness"
            ).fetchone()
            generation = connection.execute(
                "SELECT g.first_bridge_sequence,g.last_bridge_sequence,g.observation_count "
                "FROM instruction_generation_witness g "
                "JOIN instruction_fact i ON i.instruction_id=g.instruction_id "
                "WHERE i.physical_address=0x1000 AND i.opcode_u32=0x0C000050"
            ).fetchone()
        finally:
            connection.close()
        self.assertEqual(tuple(relationship), ("jal-direct", 1))
        self.assertEqual(
            str(witness[0]), "historical-consecutive-edge-reconstruction"
        )
        self.assertEqual(tuple(generation), (20, 22, 2))

    def test_call_aware_migration_matches_clean_historical_replay(self) -> None:
        source = self.make_knowledge("historical-call-format4.sqlite")
        expected = self.make_knowledge("historical-call-clean.sqlite")
        base = self.delta("HISTORICAL-MIGRATION")
        delta = replace(
            base,
            instructions=(
                InstructionObservation(
                    0x1000, 0x0C000050, 20, 1, 1, 0x100, "exact-test", 194
                ),
                InstructionObservation(
                    0x1004, 0, 22, 1, 1, 0x104, "exact-test", 195
                ),
                InstructionObservation(
                    0x0140, 0, 23, 1, 2, 0x140, "exact-test", 195
                ),
            ),
            edges=(
                EdgeObservation(
                    0x1000, 0x0C000050, 0x1004, 0, 22, 1, 1,
                    source_function_id=1, source_z64_offset=0x100,
                    destination_function_id=1, destination_z64_offset=0x104,
                    frame=195,
                ),
                EdgeObservation(
                    0x1004, 0, 0x0140, 0, 23, 1, 1,
                    source_function_id=1, source_z64_offset=0x104,
                    destination_function_id=2, destination_z64_offset=0x140,
                    frame=195,
                ),
            ),
            calls=(),
        )
        ingest_delta(source, delta)
        ingest_delta(expected, delta)

        connection = sqlite3.connect(source)
        try:
            connection.execute("PRAGMA foreign_keys=OFF")
            for table in (
                "call_relationship_context_witness",
                "call_relationship_session",
                "call_relationship_fact",
                "session_semantic_context",
            ):
                connection.execute(f"DROP TABLE {table}")
            connection.execute("DELETE FROM knowledge_meta WHERE key='callIdentity'")
            connection.execute("UPDATE frontier_state SET format_version=4")
            connection.execute(
                "UPDATE knowledge_meta SET value='4' WHERE key='frontierFormatVersion'"
            )
            connection.execute(
                "UPDATE knowledge_meta SET value='0.13.0' "
                "WHERE key='activeBridgeProtocolVersion'"
            )
            connection.commit()
        finally:
            connection.close()

        migrated = self.root / "historical-call-migrated.sqlite"
        result = migrate_frontier_database(source, migrated)
        self.assertEqual(result["historicalCallRelationshipsSeeded"], 1)
        equivalence = compare_knowledge_databases(migrated, expected)
        self.assertTrue(equivalence["equivalent"], equivalence)

    def test_ambiguous_candidates_never_auto_promote(self) -> None:
        database = self.make_knowledge("ambiguous-candidates.sqlite")
        base = self.delta("CANDIDATES")
        delta = replace(
            base,
            instructions=(
                InstructionObservation(0x3000, 0, 40, 1, None, None, "unresolved", 100),
            ),
            edges=(),
            function_placements=(
                FunctionPlacementObservation(
                    1, 0x100, 0x140, 0x2FFC, 0x303C, "candidate-a", 30, 60
                ),
                FunctionPlacementObservation(
                    2, 0x140, 0x180, 0x3000, 0x3040, "candidate-b", 30, 60
                ),
            ),
            regions=(
                RegionLifetimeObservation(
                    "region:a", 0x2FFC, 0x303C, "z64-rom",
                    "z64:00000100-00000140", 0x100, 0x140, 30, 60,
                    90, 110, 59, "replaced", "executable", "verified", None, None
                ),
                RegionLifetimeObservation(
                    "region:b", 0x3000, 0x3040, "z64-rom",
                    "z64:00000140-00000180", 0x140, 0x180, 30, 60,
                    90, 110, 59, "replaced", "executable", "verified", None, None
                ),
            ),
        )
        ingest_delta(database, delta)
        connection = open_knowledge_database(database, read_only=True)
        try:
            row = connection.execute(
                "SELECT function_id,z64_offset,mapping_status FROM instruction_fact "
                "WHERE physical_address=0x3000 AND opcode_u32=0"
            ).fetchone()
            self.assertEqual(tuple(row), (None, None, "unresolved"))
            states = {
                str(item[0])
                for item in connection.execute(
                    "SELECT candidate_state FROM instruction_mapping_candidate c "
                    "JOIN instruction_fact i ON i.instruction_id=c.instruction_id "
                    "WHERE i.physical_address=0x3000"
                )
            }
            self.assertIn("ambiguous-conflicting-mapping", states)
        finally:
            connection.close()

    def test_new_placement_reconsiders_an_old_unresolved_instruction(self) -> None:
        database = self.make_knowledge("candidate-reconsideration.sqlite")
        first_delta = replace(
            self.delta("CANDIDATE-BEFORE"),
            instructions=(
                InstructionObservation(
                    0x2000,
                    0x0C000050,
                    20,
                    1,
                    None,
                    None,
                    "unresolved",
                    100,
                ),
            ),
            edges=(),
            function_placements=(),
        )
        first = ingest_delta(database, first_delta)
        connection = open_knowledge_database(database, read_only=True)
        try:
            self.assertEqual(
                connection.execute(
                    "SELECT COUNT(*) FROM instruction_mapping_candidate"
                ).fetchone()[0],
                0,
            )
        finally:
            connection.close()

        placement_delta = replace(
            self.delta("CANDIDATE-AFTER"),
            frontier_identity_at_start=first["delta"]["frontierAfter"],
            code_pages=(),
            instructions=(),
            edges=(),
            dma_placements=(),
            controller_transitions=(),
            function_placements=(
                FunctionPlacementObservation(
                    1,
                    0x100,
                    0x140,
                    0x2000,
                    0x2040,
                    "later-placement",
                    30,
                    50,
                ),
            ),
        )
        ingest_delta(database, placement_delta)
        connection = open_knowledge_database(database, read_only=True)
        try:
            candidate = connection.execute(
                "SELECT c.candidate_state,c.evidence_kind,c.exact_bytes_confirmed "
                "FROM instruction_mapping_candidate c JOIN instruction_fact i "
                "ON i.instruction_id=c.instruction_id "
                "WHERE i.physical_address=0x2000 AND i.opcode_u32=0x0C000050"
            ).fetchone()
            self.assertEqual(
                tuple(candidate),
                (
                    "byte-confirmed-global-candidate",
                    "global-placement-plus-exact-opcode",
                    1,
                ),
            )
            self.assertEqual(
                connection.execute(
                    "SELECT status FROM candidate_recalculation_queue "
                    "WHERE reason='function-placement'"
                ).fetchone()[0],
                "processed",
            )
        finally:
            connection.close()


if __name__ == "__main__":
    unittest.main()
