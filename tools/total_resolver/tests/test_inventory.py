from __future__ import annotations

import hashlib
from pathlib import Path
import tempfile
import unittest

from tools.total_resolver.inventory import (
    HISTORICAL_DYNAMIC_ADAPTERS,
    framed_file_set_sha256,
    load_inventory,
    sha256_file,
)


class InventoryTests(unittest.TestCase):
    def test_frozen_inventory_has_all_sources_and_clean_lane_boundary(self) -> None:
        inventory = load_inventory()
        snapshots = {entry["adapterId"]: entry for entry in inventory["sourceSnapshots"]}
        for adapter in HISTORICAL_DYNAMIC_ADAPTERS:
            self.assertEqual(snapshots[adapter]["cleanR3Role"], "historical-reference-only")
        self.assertEqual(inventory["project64"]["bridgeReference"]["version"], "0.6.8")
        self.assertEqual(
            inventory["project64"]["bridgeReference"]["role"], "historical-reference"
        )
        self.assertEqual(inventory["legacyResolver"]["role"], "historical-reference")
        self.assertEqual(inventory["project64"]["activeBridge"]["protocolVersion"], "0.13.0")
        self.assertEqual(inventory["project64"]["activeBridge"]["frontierFormatVersion"], 4)
        self.assertEqual(inventory["project64"]["activeBridge"]["queueModel"], "unified")
        native_sources = set(
            inventory["project64"]["activeNativeRuntime"]["sourceFiles"]
        )
        self.assertIn(
            "Source/Project64/UserInterface/Debugger/ExactExecNovelty.h",
            native_sources,
        )
        self.assertIn(
            "Source/Project64/UserInterface/Debugger/ScriptInstance.h",
            native_sources,
        )
        self.assertFalse(inventory["decompStaticSource"]["dirtyAtFreeze"])

    def test_file_hash_is_binary_and_deterministic(self) -> None:
        payload = b"total-resolver\x00fixture\r\n"
        with tempfile.TemporaryDirectory() as raw:
            path = Path(raw) / "fixture.bin"
            path.write_bytes(payload)
            self.assertEqual(sha256_file(path), hashlib.sha256(payload).hexdigest().upper())

    def test_framed_file_set_identity_includes_names_and_bytes(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            (root / "a.bin").write_bytes(b"ab")
            (root / "b.bin").write_bytes(b"c")
            first = framed_file_set_sha256(root, ["b.bin", "a.bin"])
            second = framed_file_set_sha256(root, ["a.bin", "b.bin"])
            self.assertEqual(first, second)
            (root / "b.bin").write_bytes(b"d")
            self.assertNotEqual(first, framed_file_set_sha256(root, ["a.bin", "b.bin"]))


if __name__ == "__main__":
    unittest.main()
