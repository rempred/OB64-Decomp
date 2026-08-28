from __future__ import annotations

import hashlib
from pathlib import Path
import tempfile
import unittest

from tools.total_resolver.inventory import (
    HISTORICAL_DYNAMIC_ADAPTERS,
    framed_file_set_sha256,
    load_inventory,
    resolve_active_project64_binary,
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
        self.assertEqual(inventory["project64"]["activeBridge"]["protocolVersion"], "0.17.0")
        self.assertEqual(inventory["project64"]["activeBridge"]["frontierFormatVersion"], 6)
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
        native = inventory["project64"]["activeNativeRuntime"]
        self.assertEqual(native["bridgePort"], 64656)
        self.assertEqual(
            native["bridgeScriptPath"],
            "Bin/Win32/Release_totalresolver_64656/Scripts/000_ob64_pj64_bridge.js",
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

    def test_active_project64_binary_is_resolved_and_authenticated(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            binary = root / "Bin" / "Project64-TR.exe"
            binary.parent.mkdir()
            binary.write_bytes(b"authenticated Project64 fixture")
            expected = hashlib.sha256(binary.read_bytes()).hexdigest().upper()
            bridge = root / "Bin" / "Scripts" / "000_ob64_pj64_bridge.js"
            bridge.parent.mkdir()
            bridge.write_text("var PORT = 64656;\n", encoding="utf-8")
            bridge_expected = hashlib.sha256(bridge.read_bytes()).hexdigest().upper()
            inventory = {
                "project64": {
                    "activeNativeRuntime": {
                        "binaryPath": "Bin/Project64-TR.exe",
                        "binarySha256": expected,
                        "bridgeScriptPath": "Bin/Scripts/000_ob64_pj64_bridge.js",
                        "bridgeScriptSha256": bridge_expected,
                        "bridgePort": 64656,
                    }
                }
            }
            active = resolve_active_project64_binary(
                project64_root=root,
                inventory=inventory,
            )
            self.assertEqual(active.path, binary.resolve())
            self.assertEqual(active.sha256, expected)
            self.assertEqual(active.bridge_path, bridge.resolve())
            self.assertEqual(active.bridge_sha256, bridge_expected)
            self.assertEqual(active.bridge_port, 64656)

    def test_active_project64_bridge_port_drift_fails_closed(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            binary = root / "Project64-TR.exe"
            binary.write_bytes(b"authenticated Project64 fixture")
            bridge = root / "000_ob64_pj64_bridge.js"
            bridge.write_text("var PORT = 64640;\n", encoding="utf-8")
            inventory = {
                "project64": {
                    "activeNativeRuntime": {
                        "binaryPath": binary.name,
                        "binarySha256": hashlib.sha256(binary.read_bytes())
                        .hexdigest()
                        .upper(),
                        "bridgeScriptPath": bridge.name,
                        "bridgeScriptSha256": hashlib.sha256(bridge.read_bytes())
                        .hexdigest()
                        .upper(),
                        "bridgePort": 64656,
                    }
                }
            }
            with self.assertRaisesRegex(RuntimeError, "bridge port disagrees"):
                resolve_active_project64_binary(
                    project64_root=root,
                    inventory=inventory,
                )

    def test_active_project64_binary_hash_drift_fails_closed(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            binary = root / "Project64-TR.exe"
            binary.write_bytes(b"unexpected build")
            inventory = {
                "project64": {
                    "activeNativeRuntime": {
                        "binaryPath": "Project64-TR.exe",
                        "binarySha256": "0" * 64,
                    }
                }
            }
            with self.assertRaisesRegex(RuntimeError, "failed SHA-256 authentication"):
                resolve_active_project64_binary(
                    project64_root=root,
                    inventory=inventory,
                )


if __name__ == "__main__":
    unittest.main()
