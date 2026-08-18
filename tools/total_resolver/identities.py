"""ROM and Project64 savestate identity helpers."""

from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any, BinaryIO, Iterator
import zipfile


Z64_MAGIC = b"\x80\x37\x12\x40"
V64_MAGIC = b"\x37\x80\x40\x12"
N64_MAGIC = b"\x40\x12\x37\x80"


def _transform_chunk(data: bytes, byte_order: str) -> bytes:
    if byte_order == "z64":
        return data
    if byte_order == "v64":
        if len(data) % 2:
            raise ValueError("v64 input length must be divisible by two")
        output = bytearray(data)
        for offset in range(0, len(output), 2):
            output[offset], output[offset + 1] = output[offset + 1], output[offset]
        return bytes(output)
    if byte_order == "n64":
        if len(data) % 4:
            raise ValueError("n64 input length must be divisible by four")
        output = bytearray(data)
        for offset in range(0, len(output), 4):
            output[offset : offset + 4] = reversed(output[offset : offset + 4])
        return bytes(output)
    raise ValueError(f"unsupported ROM byte order: {byte_order}")


def detect_rom_byte_order(magic: bytes) -> str:
    if magic == Z64_MAGIC:
        return "z64"
    if magic == V64_MAGIC:
        return "v64"
    if magic == N64_MAGIC:
        return "n64"
    raise ValueError(f"unknown N64 ROM magic: {magic.hex().upper()}")


def _normalized_chunks(stream: BinaryIO, byte_order: str) -> Iterator[bytes]:
    while True:
        chunk = stream.read(1024 * 1024)
        if not chunk:
            return
        yield _transform_chunk(chunk, byte_order)


def _identity_from_z64_header(header: bytes) -> dict[str, Any]:
    if len(header) < 0x40:
        raise ValueError("ROM header is shorter than 0x40 bytes")
    if header[:4] != Z64_MAGIC:
        raise ValueError("identity header is not normalized z64")
    crc1 = header[0x10:0x14].hex().upper()
    crc2 = header[0x14:0x18].hex().upper()
    return {
        "crc1": crc1,
        "crc2": crc2,
        "crc": f"{crc1}/{crc2}",
        "country": f"0x{header[0x3E]:02X}",
        "version": int(header[0x3F]),
        "name": header[0x20:0x34].decode("ascii", errors="replace").rstrip(" \0"),
    }


def rom_identity_from_file(path: str | Path) -> dict[str, Any]:
    """Return header identity plus the normalized-z64 SHA-256."""

    source = Path(path)
    digest = hashlib.sha256()
    total = 0
    with source.open("rb") as stream:
        magic = stream.read(4)
        byte_order = detect_rom_byte_order(magic)
        stream.seek(0)
        header_raw = stream.read(0x40)
        header = _transform_chunk(header_raw, byte_order)
        stream.seek(0)
        for chunk in _normalized_chunks(stream, byte_order):
            digest.update(chunk)
            total += len(chunk)
    identity = _identity_from_z64_header(header)
    identity.update(
        {
            "path": str(source),
            "byteOrder": byte_order,
            "size": total,
            "normalizedSha256": digest.hexdigest().upper(),
        }
    )
    return identity


def read_normalized_rom(path: str | Path) -> bytes:
    """Read an N64 ROM as canonical big-endian z64 bytes."""

    source = Path(path)
    with source.open("rb") as stream:
        byte_order = detect_rom_byte_order(stream.read(4))
        stream.seek(0)
        return b"".join(_normalized_chunks(stream, byte_order))


def _state_payload(path: Path) -> tuple[bytes, str | None]:
    if path.suffix.lower() != ".zip":
        return path.read_bytes(), None
    with zipfile.ZipFile(path, "r") as archive:
        entries = sorted(name for name in archive.namelist() if name.lower().endswith(".pj"))
        if not entries:
            raise ValueError(f"savestate archive has no .pj payload: {path}")
        return archive.read(entries[0]), entries[0]


def state_identity_from_file(path: str | Path) -> dict[str, Any]:
    """Read the ROM identity stored in a Project64 state without loading it."""

    source = Path(path)
    payload, entry = _state_payload(source)
    if len(payload) < 0x48:
        raise ValueError(f"savestate payload is shorter than 0x48 bytes: {source}")
    # Project64 stores the header at +0x08 in n64/little-endian word order.
    header = _transform_chunk(payload[0x08:0x48], "n64")
    identity = _identity_from_z64_header(header)
    identity.update(
        {
            "path": str(source),
            "payloadSize": len(payload),
            "payloadSha256": hashlib.sha256(payload).hexdigest().upper(),
        }
    )
    if entry is not None:
        identity["zipEntry"] = entry
    return identity
