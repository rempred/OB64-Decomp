from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.derive_transition import (
    _derive_code_slabs,
    _derive_transactions,
    _is_rom_dma,
)
from tools.total_resolver.static_model import StaticModel


def create_static_database(path: Path) -> None:
    connection = sqlite3.connect(path)
    try:
        connection.executescript(
            """
            CREATE TABLE logical_function(
              function_id INTEGER PRIMARY KEY, structural_name TEXT, display_name TEXT,
              rom_start INTEGER, rom_end_exclusive INTEGER, confidence TEXT
            );
            CREATE TABLE source_part(
              part_id INTEGER PRIMARY KEY, rom_start INTEGER, rom_end_exclusive INTEGER
            );
            CREATE TABLE part_classification(part_id INTEGER PRIMARY KEY, class TEXT);
            CREATE TABLE word(
              rom_address INTEGER PRIMARY KEY, part_id INTEGER, nominal_linear_vram INTEGER
            );
            CREATE TABLE instruction(rom_address INTEGER PRIMARY KEY, function_id INTEGER);
            INSERT INTO logical_function VALUES
              (1, 'loader', 'loader', 16, 32, 'high'),
              (2, 'crosses_dma_chunks', 'crosses_dma_chunks', 258, 262, 'high');
            INSERT INTO source_part VALUES (1, 16, 32), (2, 256, 264), (3, 512, 516);
            INSERT INTO part_classification VALUES (1, 'code'), (2, 'code'), (3, 'data');
            INSERT INTO word VALUES (16, 1, 2147487744);
            INSERT INTO instruction VALUES (16, 1);
            """
        )
        connection.commit()
    finally:
        connection.close()


def create_resource_database(path: Path) -> None:
    connection = sqlite3.connect(path)
    try:
        connection.executescript(
            """
            CREATE TABLE container(
              container_id TEXT, payload_z64_start INTEGER, z64_start INTEGER,
              payload_z64_end_exclusive INTEGER, z64_end_exclusive INTEGER,
              disposition TEXT, evidence_grade TEXT, resource_id TEXT
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
            INSERT INTO catalog_entry VALUES('fixture-resource', 512, 516, 'accepted', 'Supported', 'fixture.bin');
            """
        )
        connection.commit()
    finally:
        connection.close()


def insert_pair(
    connection: sqlite3.Connection,
    *,
    first_sequence: int,
    source: int,
    destination: int,
    data: bytes,
    frame: int = 10,
) -> None:
    common = {
        "sourceDomain": "cartridge-rom",
        "frameCount": frame,
        "pc": "0x80001000",
        "phys": f"0x{destination:08X}",
        "romoff": f"0x{source:08X}",
        "requestedLength": len(data),
    }
    start = {
        **common,
        "kind": "dma-start",
        "capturePhase": "pre-transfer-callback",
        "bridgeSequence": first_sequence,
        "bridgeStream": "dma",
        "bridgeEpoch": "E",
    }
    complete = {
        **common,
        "kind": "dma-complete",
        "capturePhase": "post-transfer-callback",
        "bridgeSequence": first_sequence + 1,
        "bridgeStream": "dma",
        "bridgeEpoch": "E",
        "dmaStartSequence": first_sequence,
        "pairingStatus": "matched",
        "transferSpanLength": len(data),
        "destinationByteLength": len(data),
        "destinationBytesEncoding": "hex-uppercase",
        "destinationBytesHex": data.hex().upper(),
    }
    connection.execute(
        "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
        (
            first_sequence,
            frame,
            first_sequence,
            "dma",
            "dma-start",
            json.dumps(start, sort_keys=True),
            None,
            None,
        ),
    )
    connection.execute(
        "INSERT INTO event_sequence VALUES(?,?,?,?,?,?,?,?)",
        (
            first_sequence + 1,
            frame,
            first_sequence + 1,
            "dma",
            "dma-complete",
            json.dumps(complete, sort_keys=True),
            hashlib.sha256(data).hexdigest().upper(),
            len(data),
        ),
    )


class TransitionDerivationTests(unittest.TestCase):
    def test_cartridge_domain_scope_excludes_sram(self) -> None:
        self.assertTrue(_is_rom_dma({"cart": "0xB0001000"}))
        self.assertFalse(_is_rom_dma({"cart": "0xA8000000"}))

    def test_contiguous_code_chunks_map_a_function_crossing_the_chunk_boundary(self) -> None:
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
            insert_pair(
                connection,
                first_sequence=1,
                source=256,
                destination=0x2000,
                data=rom[256:260],
            )
            connection.execute(
                "UPDATE event_sequence SET event_time_content_sha256=? WHERE sequence_id=2",
                ("0" * 64,),
            )
            # An unrelated data transaction can interleave without destroying
            # the source/destination-contiguous code slab.
            insert_pair(
                connection,
                first_sequence=3,
                source=512,
                destination=0x3000,
                data=rom[512:516],
            )
            insert_pair(
                connection,
                first_sequence=5,
                source=260,
                destination=0x2004,
                data=rom[260:264],
            )
            connection.commit()
            transactions, diagnostics = _derive_transactions(
                connection, "S", 6, rom, static
            )
            connection.close()

            self.assertEqual(diagnostics["romPairIssueCount"], 0)
            self.assertEqual(len(transactions), 3)
            self.assertTrue(transactions[0].record["contentBytesValid"])
            self.assertFalse(transactions[0].record["legacyContentHashMatches"])
            self.assertEqual(transactions[0].evidence_grade.value, "verified")
            self.assertEqual(
                transactions[1].record["resourceMatches"][0]["entityId"],
                "fixture-resource",
            )
            slabs, placements = _derive_code_slabs(transactions, static)
            self.assertEqual(len(slabs), 1)
            self.assertEqual(slabs[0]["sourceZ64Start"], 256)
            self.assertEqual(slabs[0]["sourceZ64EndExclusive"], 264)
            self.assertEqual(slabs[0]["transactionCount"], 2)
            self.assertEqual(len(placements), 1)
            self.assertEqual(placements[0]["function"]["structuralName"], "crosses_dma_chunks")
            self.assertEqual(placements[0]["destinationLiveStart"], 0x80002002)


if __name__ == "__main__":
    unittest.main()
