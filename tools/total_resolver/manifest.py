"""Deterministic logical identity and closed-session manifest generation."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable

from .capture_db import canonical_json
from .inventory import sha256_file
from .schema import capture_schema_path, normalized_schema_path, utc_now


EXCLUDED_TABLES = {"sqlite_sequence", "recorder_control"}
EXCLUDED_COLUMNS = {"session": {"manifest_sha256"}}


def _table_names(connection: sqlite3.Connection) -> list[str]:
    return [
        str(row[0])
        for row in connection.execute(
            "SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name"
        )
        if str(row[0]) not in EXCLUDED_TABLES
    ]


def _table_columns(connection: sqlite3.Connection, table: str) -> tuple[list[str], list[str]]:
    info = connection.execute(f'PRAGMA table_info("{table}")').fetchall()
    excluded = EXCLUDED_COLUMNS.get(table, set())
    columns = [str(row[1]) for row in info if str(row[1]) not in excluded]
    primary = [
        str(row[1])
        for row in sorted(info, key=lambda item: int(item[5]) if int(item[5]) else 9999)
        if int(row[5]) and str(row[1]) not in excluded
    ]
    return columns, primary


def logical_database_identity(connection: sqlite3.Connection) -> dict[str, Any]:
    tables: dict[str, Any] = {}
    root = hashlib.sha256()
    for table in _table_names(connection):
        columns, primary = _table_columns(connection, table)
        quoted_columns = ",".join(f'"{name}"' for name in columns)
        order = ",".join(f'"{name}"' for name in primary) if primary else "rowid"
        cursor = connection.execute(
            f'SELECT {quoted_columns} FROM "{table}" ORDER BY {order}'
        )
        digest = hashlib.sha256()
        rows = 0
        for row in cursor:
            encoded = canonical_json(list(row)).encode("utf-8")
            digest.update(str(len(encoded)).encode("ascii"))
            digest.update(b":")
            digest.update(encoded)
            rows += 1
        table_hash = digest.hexdigest().upper()
        tables[table] = {"columns": columns, "rows": rows, "sha256": table_hash}
        root.update(table.encode("utf-8"))
        root.update(b"\0")
        root.update(str(rows).encode("ascii"))
        root.update(b"\0")
        root.update(table_hash.encode("ascii"))
        root.update(b"\0")
    return {
        "schema": "ob64-total-resolver-logical-capture.v1",
        "sha256": root.hexdigest().upper(),
        "tables": tables,
    }


def _session_dict(connection: sqlite3.Connection) -> dict[str, Any]:
    row = connection.execute("SELECT * FROM session").fetchone()
    if row is None:
        raise ValueError("session row is missing")
    value = {key: row[key] for key in row.keys() if key != "manifest_sha256"}
    value["static_sources_json"] = json.loads(value["static_sources_json"])
    return value


def build_manifest_core(connection: sqlite3.Connection, repository_root: Path) -> dict[str, Any]:
    return {
        "schema": "ob64-total-resolver-session-manifest.v1",
        "session": _session_dict(connection),
        "logicalCapture": logical_database_identity(connection),
        "trackedContracts": {
            "captureSqlSha256": sha256_file(capture_schema_path()),
            "normalizedSchemaSha256": sha256_file(normalized_schema_path()),
            "sourceFreezeSha256": sha256_file(
                repository_root / "config" / "total-resolver" / "sources.json"
            ),
        },
    }


def manifest_core_sha256(core: dict[str, Any]) -> str:
    return hashlib.sha256(canonical_json(core).encode("utf-8")).hexdigest().upper()


def finalize_manifest(
    connection: sqlite3.Connection,
    session_dir: Path,
    repository_root: Path,
) -> dict[str, Any]:
    core = build_manifest_core(connection, repository_root)
    core_hash = manifest_core_sha256(core)
    connection.execute("UPDATE session SET manifest_sha256=?", (core_hash,))
    connection.commit()
    connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")

    database_path = session_dir / "capture.sqlite"
    envelope: dict[str, Any] = {
        "manifestCore": core,
        "manifestCoreSha256": core_hash,
        "captureDatabaseFileSha256": sha256_file(database_path),
        "writtenUtc": utc_now(),
    }
    mirror = session_dir / "events.ndjson"
    if mirror.is_file():
        envelope["eventMirrorSha256"] = sha256_file(mirror)
    target = session_dir / "manifest.json"
    target.write_text(json.dumps(envelope, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    envelope["manifestFileSha256"] = sha256_file(target)
    return envelope
