from __future__ import annotations

from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.focused_capture import (
    CUTSCENE_STUDIO_PROFILE_ID,
    CUTSCENE_STUDIO_V1_PROFILE_ID,
    CUTSCENE_STUDIO_V2_PROFILE_ID,
    DIALOGUE_DRAW_SIGNATURE,
    DIALOGUE_PRESENTATION_PROFILE_ID,
    DIALOGUE_RELEASE_SIGNATURE,
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
    def test_dialogue_presentation_uses_only_exact_draw_and_release_owners(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            rom = root / "test.z64"
            payload = bytearray(0x000E6700)
            payload[:4] = bytes.fromhex("80371240")
            targets = (
                (1, 0x000E65DC, 0x44, DIALOGUE_DRAW_SIGNATURE,
                 (0x001561DC, 0x0019985C)),
                (2, 0x000E6620, 0x30, DIALOGUE_RELEASE_SIGNATURE,
                 (0x00156220, 0x001998A0)),
            )
            for _, start, _, signature, _ in targets:
                payload[start : start + len(signature)] = signature
            rom.write_bytes(payload)

            connection = sqlite3.connect(":memory:")
            connection.row_factory = sqlite3.Row
            connection.executescript("""
                CREATE TABLE knowledge_meta(key TEXT PRIMARY KEY, value TEXT);
                CREATE TABLE static_function(function_id INTEGER PRIMARY KEY,
                    structural_name TEXT, z64_start INTEGER, z64_end_exclusive INTEGER);
                CREATE TABLE function_placement_fact(function_placement_id INTEGER PRIMARY KEY,
                    function_id INTEGER, source_z64_start INTEGER,
                    source_z64_end_exclusive INTEGER, destination_physical_start INTEGER,
                    destination_physical_end_exclusive INTEGER);
            """)
            connection.executemany("INSERT INTO knowledge_meta VALUES(?,?)",
                                   (("schemaVersion", "5"), ("romPath", str(rom))))
            for function_id, start, size, _, placements in targets:
                connection.execute("INSERT INTO static_function VALUES(?,?,?,?)",
                                   (function_id, f"func_{start:08x}", start, start + size))
                for ordinal, physical in enumerate(placements, 1):
                    connection.execute("INSERT INTO function_placement_fact VALUES(?,?,?,?,?,?)",
                                       (function_id * 10 + ordinal, function_id,
                                        start, start + size, physical, physical + size))

            profile = resolve_focused_profile(connection, DIALOGUE_PRESENTATION_PROFILE_ID)
            self.assertEqual(profile.profile_version, 1)
            self.assertEqual(len(profile.watches), 4)
            self.assertEqual({watch.target_id for watch in profile.watches},
                             {"dialogue-draw-callback", "dialogue-release-callback"})
            self.assertEqual({watch.z64_start for watch in profile.watches},
                             {0x000E65DC, 0x000E6620})
            self.assertEqual(profile.instruction_watches(), ())
            self.assertTrue(all(watch.sample_mode == "all" and
                                watch.stack_words == 0 and not watch.pointers
                                for watch in profile.watches))
            self.assertEqual({watch.live_start for watch in profile.watches},
                             {0x801561DC, 0x8019985C, 0x80156220, 0x801998A0})

            payload[0x000E6624] ^= 1
            rom.write_bytes(payload)
            with self.assertRaisesRegex(ValueError, "signature"):
                resolve_focused_profile(connection, DIALOGUE_PRESENTATION_PROFILE_ID)
            connection.close()

    def test_profile_resolves_only_exact_4mib_placements_and_rom_signatures(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            rom = root / "test.z64"
            payload = bytearray(max(TARGET_STARTS) + 0x100)
            payload[:4] = bytes.fromhex("80371240")
            for index, start in enumerate(TARGET_STARTS, 1):
                payload[start : start + 4] = (0x24020000 + index).to_bytes(4, "big")
            dialogue_targets = (
                (0x000E65DC, 0x44, DIALOGUE_DRAW_SIGNATURE,
                 (0x001561DC, 0x0019985C)),
                (0x000E6620, 0x30, DIALOGUE_RELEASE_SIGNATURE,
                 (0x00156220, 0x001998A0)),
            )
            for start, _, signature, _ in dialogue_targets:
                payload[start : start + len(signature)] = signature
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
            for index, (start, size, _, placements) in enumerate(
                dialogue_targets, len(TARGET_STARTS) + 1,
            ):
                connection.execute(
                    "INSERT INTO static_function VALUES(?,?,?,?)",
                    (index, f"func_{start:08x}", start, start + size),
                )
                for ordinal, physical in enumerate(placements, 1):
                    connection.execute(
                        "INSERT INTO function_placement_fact VALUES(?,?,?,?,?,?)",
                        (index * 10 + ordinal, index, start, start + size,
                         physical, physical + size),
                    )

            profile = resolve_focused_profile(connection)
            self.assertEqual(profile.profile_id, CUTSCENE_STUDIO_PROFILE_ID)
            self.assertEqual(profile.profile_version, 3)
            self.assertEqual(len(profile.watches), len(TARGET_STARTS) + 4)
            self.assertEqual({watch.target_id for watch in profile.watches[-4:]},
                             {"dialogue-draw-callback", "dialogue-release-callback"})
            self.assertTrue(all(watch.profile_version == 3 and watch.sample_mode == "all"
                                and watch.stack_words == 0 and not watch.pointers
                                for watch in profile.watches[-4:]))
            prior = resolve_focused_profile(connection, CUTSCENE_STUDIO_V2_PROFILE_ID)
            self.assertEqual(prior.profile_version, 2)
            self.assertEqual(len(prior.watches), len(profile.watches))
            legacy = resolve_focused_profile(connection, CUTSCENE_STUDIO_V1_PROFILE_ID)
            self.assertEqual(legacy.profile_version, 1)
            self.assertEqual(len(legacy.watches), len(TARGET_STARTS))
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

            payload[0x000E6624] ^= 1
            rom.write_bytes(payload)
            with self.assertRaisesRegex(ValueError, "signature"):
                resolve_focused_profile(connection)
            with self.assertRaisesRegex(ValueError, "signature"):
                resolve_focused_profile(connection, CUTSCENE_STUDIO_V2_PROFILE_ID)
            self.assertEqual(len(resolve_focused_profile(
                connection, CUTSCENE_STUDIO_V1_PROFILE_ID,
            ).watches), len(TARGET_STARTS))

            connection.execute(
                "UPDATE knowledge_meta SET value='3' WHERE key='schemaVersion'"
            )
            with self.assertRaisesRegex(ValueError, "schema 4"):
                resolve_focused_profile(connection)
            connection.close()


if __name__ == "__main__":
    unittest.main()
