from __future__ import annotations

import hashlib
from pathlib import Path
import tempfile
import unittest
import zipfile

from tools.total_resolver.identities import rom_identity_from_file, state_identity_from_file


def synthetic_z64() -> bytes:
    data = bytearray(0x40)
    data[0:4] = b"\x80\x37\x12\x40"
    data[0x10:0x18] = bytes.fromhex("123456789ABCDEF0")
    data[0x20:0x34] = b"TOTAL RESOLVER TEST ".ljust(20, b" ")
    data[0x3E] = 0x45
    data[0x3F] = 0
    return bytes(data)


def to_v64(data: bytes) -> bytes:
    output = bytearray(data)
    for offset in range(0, len(output), 2):
        output[offset], output[offset + 1] = output[offset + 1], output[offset]
    return bytes(output)


def to_n64(data: bytes) -> bytes:
    output = bytearray(data)
    for offset in range(0, len(output), 4):
        output[offset : offset + 4] = reversed(output[offset : offset + 4])
    return bytes(output)


class IdentityTests(unittest.TestCase):
    def test_all_rom_byte_orders_share_one_normalized_identity(self) -> None:
        z64 = synthetic_z64()
        expected_hash = hashlib.sha256(z64).hexdigest().upper()
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            paths = {
                "z64": (root / "test.z64", z64),
                "v64": (root / "test.v64", to_v64(z64)),
                "n64": (root / "test.n64", to_n64(z64)),
            }
            identities = []
            for expected_order, (path, data) in paths.items():
                path.write_bytes(data)
                identity = rom_identity_from_file(path)
                self.assertEqual(identity["byteOrder"], expected_order)
                self.assertEqual(identity["normalizedSha256"], expected_hash)
                identities.append(identity["crc"])
            self.assertEqual(identities, ["12345678/9ABCDEF0"] * 3)

    def test_project64_state_identity_is_read_without_loading(self) -> None:
        z64 = synthetic_z64()
        payload = b"STATEHDR" + to_n64(z64) + b"payload"
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            state = root / "test.pj"
            state.write_bytes(payload)
            identity = state_identity_from_file(state)
            self.assertEqual(identity["crc"], "12345678/9ABCDEF0")
            self.assertNotIn("zipEntry", identity)

            archive_path = root / "test.pj.zip"
            with zipfile.ZipFile(archive_path, "w") as archive:
                archive.writestr("nested/test.pj", payload)
            archived = state_identity_from_file(archive_path)
            self.assertEqual(archived["crc"], identity["crc"])
            self.assertEqual(archived["zipEntry"], "nested/test.pj")


if __name__ == "__main__":
    unittest.main()
