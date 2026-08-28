"""Declarative, fail-closed focused-capture profiles.

Focused capture augments the ordinary novelty-filtered stream.  It does not
replace it and it does not promote runtime observations into accepted static
claims.  A profile resolves frozen ROM functions through exact persistent
placements, then installs native opcode-gated entry/return triggers for those
live ranges.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import sqlite3
from typing import Any, Mapping

from .addressing import RDRAM_SIZE
from .identities import read_normalized_rom


CUTSCENE_STUDIO_PROFILE_ID = "cutscene-studio-v1"
FOCUSED_PROFILE_VERSION = 1
SIGNATURE_BYTE_COUNT = 32


@dataclass(frozen=True)
class PointerSnapshotSpec:
    register: str
    size: int
    label: str

    def __post_init__(self) -> None:
        if self.register not in {"a0", "a1", "a2", "a3"}:
            raise ValueError(f"unsupported focused pointer register: {self.register}")
        if not 1 <= self.size <= 4096:
            raise ValueError("focused pointer snapshots must contain 1..4096 bytes")
        if not self.label or any(character.isspace() for character in self.label):
            raise ValueError("focused pointer labels must be nonempty tokens")

    def to_dict(self) -> dict[str, Any]:
        return {"register": self.register, "size": self.size, "label": self.label}


@dataclass(frozen=True)
class FocusedTarget:
    target_id: str
    label: str
    z64_start: int
    sample_mode: str
    pointers: tuple[PointerSnapshotSpec, ...]
    stack_words: int = 32

    def __post_init__(self) -> None:
        if not self.target_id or any(character.isspace() for character in self.target_id):
            raise ValueError("focused target IDs must be nonempty tokens")
        if self.sample_mode not in {"all", "first-per-frame"}:
            raise ValueError("focused sample mode must be all or first-per-frame")
        if self.z64_start < 0 or self.z64_start & 3:
            raise ValueError("focused target ROM starts must be aligned and nonnegative")
        if not 0 <= self.stack_words <= 128:
            raise ValueError("focused stack capture must contain 0..128 words")


@dataclass(frozen=True)
class ResolvedFocusedWatch:
    watch_id: str
    profile_id: str
    profile_version: int
    target_id: str
    label: str
    function_id: int
    structural_name: str
    z64_start: int
    z64_end_exclusive: int
    live_start: int
    live_end_exclusive: int
    physical_start: int
    entry_opcode: int
    signature_bytes: bytes
    sample_mode: str
    pointers: tuple[PointerSnapshotSpec, ...]
    stack_words: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "watchId": self.watch_id,
            "profileId": self.profile_id,
            "profileVersion": self.profile_version,
            "targetId": self.target_id,
            "label": self.label,
            "functionId": self.function_id,
            "structuralName": self.structural_name,
            "z64Start": self.z64_start,
            "z64EndExclusive": self.z64_end_exclusive,
            "liveStart": self.live_start,
            "liveEndExclusive": self.live_end_exclusive,
            "physicalStart": self.physical_start,
            "entryOpcode": self.entry_opcode,
            "signatureBytesEncoding": "hex-uppercase",
            "signatureBytesHex": self.signature_bytes.hex().upper(),
            "sampleMode": self.sample_mode,
            "pointerSnapshots": [item.to_dict() for item in self.pointers],
            "stackWords": self.stack_words,
        }


@dataclass(frozen=True)
class ResolvedFocusedProfile:
    profile_id: str
    profile_version: int
    description: str
    watches: tuple[ResolvedFocusedWatch, ...]

    def to_dict(self) -> dict[str, Any]:
        return {
            "schema": "ob64-total-resolver-focused-profile.v1",
            "profileId": self.profile_id,
            "profileVersion": self.profile_version,
            "description": self.description,
            "triggerCount": len(self.watches),
            "targets": [item.to_dict() for item in self.watches],
            "capturePolicy": {
                "entry": "native exact-opcode gate followed by exact ROM-signature equality",
                "return": "native exact jr-ra gate inside the signature-confirmed function range",
                "hotTargets": "at most one sampled invocation per VI frame",
                "pointerEvidence": "bounded exact event-time bytes for valid lower-4-MiB KSEG pointers",
                "returnPhase": "before the jr-ra delay slot executes",
            },
        }


def _pointer(register: str, size: int, label: str) -> PointerSnapshotSpec:
    return PointerSnapshotSpec(register, size, label)


# These names describe why a target is useful to the profile, not accepted game
# semantics.  Stable machine identity remains the z64 function start.
_CUTSCENE_TARGETS = (
    FocusedTarget(
        "environment-loader-a", "Environment loader A", 0x00067320, "all",
        (_pointer("a0", 512, "arg0-structure"), _pointer("a1", 256, "arg1-context")),
    ),
    FocusedTarget(
        "environment-loader-b", "Environment loader B", 0x00067B48, "all",
        (_pointer("a0", 512, "arg0-structure"), _pointer("a1", 256, "arg1-context")),
    ),
    FocusedTarget(
        "huff-entry", "HUFF entry", 0x00069328, "all",
        (
            _pointer("a0", 256, "arg0-input"),
            _pointer("a1", 256, "arg1-output"),
            _pointer("a2", 128, "arg2-context"),
        ),
    ),
    FocusedTarget(
        "huff-completion", "HUFF completion", 0x0006947C, "all",
        (_pointer("a0", 256, "arg0-context"), _pointer("a1", 256, "arg1-context")),
    ),
    FocusedTarget(
        "stage-builder", "Stage builder", 0x001FB32C, "all",
        (_pointer("a0", 1024, "arg0-stage"), _pointer("a1", 256, "arg1-context")),
    ),
    FocusedTarget(
        "director-parser", "Director parser", 0x00284288, "all",
        (_pointer("a0", 512, "arg0-director"), _pointer("a1", 256, "arg1-stream")),
    ),
    FocusedTarget(
        "body-pose-resolver", "Body pose resolver", 0x00207658, "first-per-frame",
        (_pointer("a0", 512, "arg0-actor"), _pointer("a1", 256, "arg1-pose")),
    ),
    FocusedTarget(
        "alternate-pose-decoder", "Alternate pose decoder", 0x00204F34,
        "first-per-frame",
        (_pointer("a0", 512, "arg0-actor"), _pointer("a1", 256, "arg1-pose")),
    ),
    FocusedTarget(
        "actor-pose-updater", "Actor pose updater", 0x0029E218, "first-per-frame",
        (_pointer("a0", 512, "arg0-actor"), _pointer("a1", 256, "arg1-context")),
    ),
    FocusedTarget(
        "actor-pose-initializer", "Actor pose initializer", 0x002A9364,
        "first-per-frame",
        (_pointer("a0", 512, "arg0-actor"), _pointer("a1", 256, "arg1-context")),
    ),
    FocusedTarget(
        "sprite-matrix-builder", "Sprite/actor matrix builder", 0x002A9AD0,
        "first-per-frame",
        (_pointer("a0", 128, "arg0-context"), _pointer("a2", 0x170, "arg2-record")),
    ),
)


def supported_focused_profiles() -> tuple[str, ...]:
    return (CUTSCENE_STUDIO_PROFILE_ID,)


def _meta(connection: sqlite3.Connection) -> dict[str, str]:
    return {
        str(row[0]): str(row[1])
        for row in connection.execute("SELECT key,value FROM knowledge_meta")
    }


def resolve_focused_profile(
    connection: sqlite3.Connection,
    profile_id: str = CUTSCENE_STUDIO_PROFILE_ID,
) -> ResolvedFocusedProfile:
    """Resolve every profile target through exact retained placements.

    Missing functions, missing placements, partial placement ranges, or ROM
    mismatches fail closed.  A focused capture must never silently watch a
    guessed live address.
    """

    if profile_id != CUTSCENE_STUDIO_PROFILE_ID:
        raise ValueError(f"unsupported focused capture profile: {profile_id}")
    metadata = _meta(connection)
    schema_version = int(metadata.get("schemaVersion", "0"))
    if schema_version < 4:
        raise ValueError(
            "Focused Capture requires knowledge schema 4 or later; a database-building agent "
            "must run `knowledge migrate-schema5` and select the verified copy"
        )
    rom_path = Path(metadata.get("romPath", ""))
    rom = read_normalized_rom(rom_path)
    resolved: list[ResolvedFocusedWatch] = []
    for target in _CUTSCENE_TARGETS:
        function = connection.execute(
            "SELECT * FROM static_function WHERE z64_start=?",
            (target.z64_start,),
        ).fetchone()
        if function is None:
            raise ValueError(
                f"focused target {target.target_id} has no exact static function at "
                f"0x{target.z64_start:08X}"
            )
        z64_end = int(function["z64_end_exclusive"])
        signature_size = min(SIGNATURE_BYTE_COUNT, z64_end - target.z64_start)
        signature_size -= signature_size & 3
        signature = rom[target.z64_start : target.z64_start + signature_size]
        if len(signature) < 4:
            raise ValueError(f"focused target {target.target_id} has no complete entry opcode")
        placements: dict[tuple[int, int], Mapping[str, Any]] = {}
        for placement in connection.execute(
            "SELECT * FROM function_placement_fact WHERE function_id=? "
            "ORDER BY destination_physical_start,function_placement_id",
            (int(function["function_id"]),),
        ):
            source_start = int(placement["source_z64_start"])
            source_end = int(placement["source_z64_end_exclusive"])
            if not source_start <= target.z64_start < z64_end <= source_end:
                continue
            physical_start = int(placement["destination_physical_start"]) + (
                target.z64_start - source_start
            )
            physical_end = physical_start + (z64_end - target.z64_start)
            if not 0 <= physical_start < physical_end <= RDRAM_SIZE:
                continue
            placements.setdefault((physical_start, physical_end), placement)
        if not placements:
            raise ValueError(
                f"focused target {target.target_id} has no exact retained 4 MiB placement"
            )
        for placement_ordinal, (physical_start, physical_end) in enumerate(
            sorted(placements), 1
        ):
            live_start = 0x80000000 + physical_start
            resolved.append(
                ResolvedFocusedWatch(
                    watch_id=f"focused-{target.target_id}-{placement_ordinal}",
                    profile_id=profile_id,
                    profile_version=FOCUSED_PROFILE_VERSION,
                    target_id=target.target_id,
                    label=target.label,
                    function_id=int(function["function_id"]),
                    structural_name=str(function["structural_name"]),
                    z64_start=target.z64_start,
                    z64_end_exclusive=z64_end,
                    live_start=live_start,
                    live_end_exclusive=0x80000000 + physical_end,
                    physical_start=physical_start,
                    entry_opcode=int.from_bytes(signature[:4], "big"),
                    signature_bytes=signature,
                    sample_mode=target.sample_mode,
                    pointers=target.pointers,
                    stack_words=target.stack_words,
                )
            )
    if not resolved:
        raise ValueError("focused capture profile resolved no exact live targets")
    return ResolvedFocusedProfile(
        profile_id,
        FOCUSED_PROFILE_VERSION,
        (
            "Cutscene state capture around exact environment, Director, HUFF, pose, and "
            "matrix owners; routine changes are detected automatically"
        ),
        tuple(resolved),
    )
