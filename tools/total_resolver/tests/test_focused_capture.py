from __future__ import annotations

from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.focused_capture import (
    CUTSCENE_STUDIO_PROFILE_ID,
    resolve_focused_profile,
)


TARGET_STARTS = (
    0x00067320,
    0x00067B48,
    0x00069328,
    0x0006947C,
    0x001FB32C,
    0x00284288,
    0x00207658,
    0x00204F34,
    0x0029E218,
    0x002A9364,
    0x002A9AD0,
)


class FocusedCaptureProfileTests(unittest.TestCase):
    def test_profile_resolves_only_exact_4mib_placements_and_rom_signatures(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            rom = root / "test.z64"
            payload = bytearray(max(TARGET_STARTS) + 0x100)
            payload[:4] = bytes.fromhex("80371240")
            for index, start in enumerate(TARGET_STARTS, 1):
                payload[start : start + 4] = (0x24020000 + index).to_bytes(4, "big")
            rom.write_bytes(payload)

            connection = sqlite3.connect(":memory:")
            connection.row_factory = sqlite3.Row
            connection.executescript(
                """
                CREATE TABLE knowledge_meta(key TEXT PRIMARY KEY, value TEXT);
                CREATE TABLE static_function(
                    function_id INTEGER PRIMARY KEY,
                    structural_name TEXT NOT NULL,
                    z64_start INTEGER NOT NULL,
                    z64_end_exclusive INTEGER NOT NULL
                );
                CREATE TABLE function_placement_fact(
                    function_placement_id INTEGER PRIMARY KEY,
                    function_id INTEGER NOT NULL,
                    source_z64_start INTEGER NOT NULL,
                    source_z64_end_exclusive INTEGER NOT NULL,
                    destination_physical_start INTEGER NOT NULL,
                    destination_physical_end_exclusive INTEGER NOT NULL
                );
                """
            )
            connection.executemany(
                "INSERT INTO knowledge_meta VALUES(?,?)",
                (("schemaVersion", "4"), ("romPath", str(rom))),
            )
            for index, start in enumerate(TARGET_STARTS, 1):
                physical = 0x1000 + index * 0x100
                connection.execute(
                    "INSERT INTO static_function VALUES(?,?,?,?)",
                    (index, f"func_{start:08x}", start, start + 0x40),
                )
                connection.execute(
                    "INSERT INTO function_placement_fact VALUES(?,?,?,?,?,?)",
                    (index, index, start, start + 0x40, physical, physical + 0x40),
                )

            profile = resolve_focused_profile(connection)
            self.assertEqual(profile.profile_id, CUTSCENE_STUDIO_PROFILE_ID)
            self.assertEqual(len(profile.watches), len(TARGET_STARTS))
            for watch in profile.watches:
                self.assertEqual(watch.live_start - 0x80000000, watch.physical_start)
                self.assertEqual(
                    watch.signature_bytes,
                    bytes(payload[watch.z64_start : watch.z64_start + 32]),
                )
                self.assertEqual(
                    watch.entry_opcode,
                    int.from_bytes(watch.signature_bytes[:4], "big"),
                )

            connection.execute(
                "UPDATE knowledge_meta SET value='3' WHERE key='schemaVersion'"
            )
            with self.assertRaisesRegex(ValueError, "schema 4"):
                resolve_focused_profile(connection)
            connection.close()


if __name__ == "__main__":
    unittest.main()
