"""Machine configuration identity, deliberately independent of human labels."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from typing import Iterable

from .addressing import RDRAM_SIZE
from .contracts import RegionClass


@dataclass(frozen=True)
class ConfigurationRegion:
    region_class: RegionClass
    physical_start: int
    physical_end_exclusive: int
    content_sha256: str
    source_kind: str = "unknown"
    source_identity: str | None = None
    loader_identity: str | None = None

    def __post_init__(self) -> None:
        if not 0 <= self.physical_start < self.physical_end_exclusive <= RDRAM_SIZE:
            raise ValueError("configuration region must be inside vanilla OB64's 4 MiB RDRAM")
        if len(self.content_sha256) != 64:
            raise ValueError("configuration content identity must be SHA-256")

    def canonical(self) -> dict[str, int | str | None]:
        return {
            "class": self.region_class.value,
            "physicalStart": self.physical_start,
            "physicalEndExclusive": self.physical_end_exclusive,
            "contentSha256": self.content_sha256.upper(),
            "sourceKind": self.source_kind,
            "sourceIdentity": self.source_identity,
            "loaderIdentity": self.loader_identity,
        }


def machine_configuration_identity(
    regions: Iterable[ConfigurationRegion],
    *,
    kind: str = "combined",
) -> tuple[str, str]:
    if kind not in {"code", "resource", "combined"}:
        raise ValueError(f"unsupported configuration kind: {kind}")
    selected: list[ConfigurationRegion] = []
    for region in regions:
        if kind == "code" and region.region_class not in {RegionClass.EXECUTABLE, RegionClass.MIXED}:
            continue
        if kind == "resource" and region.region_class not in {RegionClass.DATA, RegionClass.MIXED}:
            continue
        selected.append(region)
    canonical_rows = [region.canonical() for region in selected]
    canonical_rows.sort(
        key=lambda row: (
            row["class"],
            row["physicalStart"],
            row["physicalEndExclusive"],
            row["contentSha256"],
            row["sourceKind"],
            row["sourceIdentity"] or "",
            row["loaderIdentity"] or "",
        )
    )
    payload = {"schema": "ob64-machine-configuration.v1", "kind": kind, "regions": canonical_rows}
    canonical_json = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(canonical_json.encode("utf-8")).hexdigest().upper(), canonical_json
