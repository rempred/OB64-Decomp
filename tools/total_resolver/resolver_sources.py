"""Fail-closed source adapters for the compact Total Resolver R3 index."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any, Mapping

from .inventory import load_inventory, repository_root, sha256_file
from .overlay_atlas import verify_overlay_atlas
from .runtime_provenance import verify_runtime_provenance


ADAPTER_VERSION = "1.0.0"


@dataclass(frozen=True)
class ResolverSourcePaths:
    static_database: Path
    resource_database: Path
    field_product: Path
    overlay_atlas: Path
    runtime_provenance: Path

    @property
    def field_database(self) -> Path:
        return self.field_product / "db" / "structure-field-access.sqlite"


@dataclass(frozen=True)
class SourceIdentity:
    source_id: str
    adapter_id: str
    snapshot_id: str
    evidence_lanes: tuple[str, ...]
    identity_kind: str
    identity_sha256: str
    review_state: str
    evidence_boundary: str

    def registry_row(self) -> tuple[str, ...]:
        return (
            self.source_id,
            self.adapter_id,
            ADAPTER_VERSION,
            self.snapshot_id,
            json.dumps(self.evidence_lanes, separators=(",", ":")),
            self.identity_kind,
            self.identity_sha256,
            self.review_state,
            self.evidence_boundary,
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "sourceId": self.source_id,
            "adapterId": self.adapter_id,
            "adapterVersion": ADAPTER_VERSION,
            "snapshotId": self.snapshot_id,
            "evidenceLanes": list(self.evidence_lanes),
            "identityKind": self.identity_kind,
            "identitySha256": self.identity_sha256,
            "reviewState": self.review_state,
            "evidenceBoundary": self.evidence_boundary,
        }


def default_source_paths() -> ResolverSourcePaths:
    decomp = repository_root()
    research = decomp.parent
    products = decomp / "build" / "total-resolver" / "products"
    return ResolverSourcePaths(
        static_database=research
        / "wiki"
        / "sol-decomp-static-db-r3-20260710"
        / "db"
        / "ob64-static.sqlite",
        resource_database=research
        / "wiki"
        / "rom-resource-load-chain-atlas-static-20260711"
        / "db"
        / "resource-load-chains.sqlite",
        field_product=research
        / "wiki"
        / "mips-structure-field-access-atlas-static-20260711",
        overlay_atlas=products / "overlay-atlas-2",
        runtime_provenance=products / "runtime-provenance-2",
    )


def open_readonly(path: Path, *, immutable: bool = True) -> sqlite3.Connection:
    resolved = path.resolve()
    if not resolved.is_file():
        raise FileNotFoundError(resolved)
    suffix = "?mode=ro&immutable=1" if immutable else "?mode=ro"
    connection = sqlite3.connect(resolved.as_uri() + suffix, uri=True)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only=ON")
    if connection.execute("PRAGMA quick_check").fetchone()[0] != "ok":
        connection.close()
        raise ValueError(f"SQLite quick_check failed: {resolved}")
    return connection


def resource_logical_sha256(path: Path) -> str:
    """Reproduce the accepted resource atlas's declared logical DB identity."""

    connection = open_readonly(path)
    try:
        tables = [
            str(row[0])
            for row in connection.execute(
                "SELECT name FROM sqlite_master "
                "WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
            )
        ]
        table_hashes: dict[str, str] = {}
        for table in tables:
            columns = [str(row[1]) for row in connection.execute(f"PRAGMA table_info({table})")]
            rows = connection.execute(
                f"SELECT {','.join(columns)} FROM {table} ORDER BY rowid"
            ).fetchall()
            payload = json.dumps(
                {"columns": columns, "rows": [list(row) for row in rows]},
                sort_keys=True,
                separators=(",", ":"),
                default=str,
            ).encode("utf-8")
            table_hashes[table] = hashlib.sha256(payload).hexdigest().upper()
        return hashlib.sha256(
            json.dumps(
                table_hashes, sort_keys=True, separators=(",", ":")
            ).encode("utf-8")
        ).hexdigest().upper()
    finally:
        connection.close()


def field_product_logical_sha256(root: Path) -> str:
    """Reproduce the accepted field atlas's framed logical file-set identity."""

    product = root.resolve()
    paths = list((product / "exports").glob("*.jsonl"))
    paths.extend(
        (
            product / "schema" / "structure-field-access.sql",
            product / "fixtures" / "golden-controls.json",
            product / "fixtures" / "negative-controls.json",
        )
    )
    missing = [path for path in paths if not path.is_file()]
    if missing:
        raise FileNotFoundError(missing[0])
    digest = hashlib.sha256()
    for path in sorted(paths, key=lambda value: value.relative_to(product).as_posix()):
        digest.update(path.relative_to(product).as_posix().encode("utf-8"))
        digest.update(b"\0")
        with path.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                digest.update(chunk)
        digest.update(b"\0")
    return digest.hexdigest().upper()


def _expected_identities(
    override: Mapping[str, str] | None,
) -> tuple[dict[str, str], dict[str, Mapping[str, Any]]]:
    config = load_inventory()
    entries = {
        str(value["adapterId"]): value for value in config["sourceSnapshots"]
    }
    expected = {
        adapter: str(value["identitySha256"]).upper()
        for adapter, value in entries.items()
    }
    if override is not None:
        expected.update({key: value.upper() for key, value in override.items()})
    return expected, entries


def _dynamic_session_identities(path: Path, table: str) -> dict[str, str]:
    database = path.resolve() / table
    connection = open_readonly(database)
    try:
        return {
            str(row[0]): str(row[1])
            for row in connection.execute(
                "SELECT session_id,session_product_summary_sha256 FROM source_session"
            )
        }
    finally:
        connection.close()


def validate_resolver_sources(
    paths: ResolverSourcePaths,
    *,
    expected_identities: Mapping[str, str] | None = None,
) -> tuple[SourceIdentity, ...]:
    """Validate every selected source before any resolver output is written."""

    expected, frozen = _expected_identities(expected_identities)
    actual_static = sha256_file(paths.static_database)
    if actual_static != expected["static-db-r3"]:
        raise ValueError(
            "static-db-r3 identity mismatch: "
            f"expected {expected['static-db-r3']}, got {actual_static}"
        )
    actual_resource = resource_logical_sha256(paths.resource_database)
    if actual_resource != expected["resource-chain-static"]:
        raise ValueError(
            "resource-chain-static identity mismatch: "
            f"expected {expected['resource-chain-static']}, got {actual_resource}"
        )
    actual_field = field_product_logical_sha256(paths.field_product)
    if actual_field != expected["structure-field-static"]:
        raise ValueError(
            "structure-field-static identity mismatch: "
            f"expected {expected['structure-field-static']}, got {actual_field}"
        )

    atlas = verify_overlay_atlas(paths.overlay_atlas)
    if atlas.get("result") != "PASS":
        raise ValueError("Overlay Atlas 2.0 source failed verification")
    runtime = verify_runtime_provenance(paths.runtime_provenance)
    if runtime.get("result") != "PASS":
        raise ValueError("Runtime Provenance 2.0 source failed verification")

    runtime_summary = json.loads(
        (paths.runtime_provenance / "summary.json").read_text(encoding="utf-8")
    )
    declared_atlas = runtime_summary.get("overlayAtlas", {}).get("logicalSha256")
    if declared_atlas != atlas["logicalSha256"]:
        raise ValueError(
            "Runtime Provenance 2.0 was built against a different Overlay Atlas 2.0"
        )
    atlas_sessions = _dynamic_session_identities(
        paths.overlay_atlas, "overlay-atlas.sqlite"
    )
    runtime_sessions = _dynamic_session_identities(
        paths.runtime_provenance, "runtime-provenance.sqlite"
    )
    if atlas_sessions != runtime_sessions:
        raise ValueError("dynamic source session identities disagree")

    static_entry = frozen["static-db-r3"]
    resource_entry = frozen["resource-chain-static"]
    field_entry = frozen["structure-field-static"]
    return (
        SourceIdentity(
            "static-db-r3",
            "static-db-r3",
            str(static_entry["snapshotId"]),
            tuple(static_entry["evidenceLanes"]),
            str(static_entry["identityKind"]),
            actual_static,
            "accepted-source",
            "Byte-exact static function and call structure; static mapping does not prove execution.",
        ),
        SourceIdentity(
            "resource-chain-static",
            "resource-chain-static",
            str(resource_entry["snapshotId"]),
            tuple(resource_entry["evidenceLanes"]),
            str(resource_entry["identityKind"]),
            actual_resource,
            "accepted-source",
            "Static resource ancestry with candidate and unresolved links preserved; not runtime reachability.",
        ),
        SourceIdentity(
            "structure-field-static",
            "structure-field-static",
            str(field_entry["snapshotId"]),
            tuple(field_entry["evidenceLanes"]),
            str(field_entry["identityKind"]),
            actual_field,
            "accepted-source",
            "Static field grouping and pointer-lineage evidence; equal offsets do not imply one field.",
        ),
        SourceIdentity(
            "overlay-atlas-2",
            "overlay-atlas-2",
            "generated:" + str(atlas["logicalSha256"])[:16],
            ("placement",),
            "sqlite-logical-sha256",
            str(atlas["logicalSha256"]),
            "generated-unreviewed",
            "Observed placement and lifetime evidence; residency is not execution.",
        ),
        SourceIdentity(
            "runtime-provenance-2",
            "runtime-provenance-2",
            "generated:" + str(runtime["logicalSha256"])[:16],
            ("runtime",),
            "sqlite-logical-sha256",
            str(runtime["logicalSha256"]),
            "generated-unreviewed",
            "Exact watch evidence is execution; sampled PCs are context only.",
        ),
    )
