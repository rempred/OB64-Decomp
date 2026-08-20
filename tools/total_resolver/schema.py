"""Capture-schema creation and structural verification."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
import sqlite3


CAPTURE_SCHEMA_NAME = "ob64-total-resolver-capture"
CAPTURE_SCHEMA_VERSION = 4
SUPPORTED_CAPTURE_SCHEMA_VERSIONS = frozenset({2, 3, 4})


def capture_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "capture.sql"


def normalized_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "normalized.schema.json"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def create_capture_database(path: Path) -> sqlite3.Connection:
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        raise FileExistsError(f"capture database already exists: {path}")
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    try:
        connection.executescript(capture_schema_path().read_text(encoding="utf-8"))
        connection.execute(
            "INSERT INTO schema_info(schema_name, schema_version, created_utc) VALUES(?,?,?)",
            (CAPTURE_SCHEMA_NAME, CAPTURE_SCHEMA_VERSION, utc_now()),
        )
        connection.execute(
            "INSERT INTO recorder_control(singleton, requested_action, updated_utc) VALUES(1,'none',?)",
            (utc_now(),),
        )
        connection.commit()
        connection.execute("PRAGMA journal_mode = WAL")
        connection.execute("PRAGMA synchronous = FULL")
        connection.execute("PRAGMA foreign_keys = ON")
    except Exception:
        connection.close()
        raise
    return connection


def open_capture_database(path: Path, *, read_only: bool = False) -> sqlite3.Connection:
    if read_only:
        connection = sqlite3.connect(f"file:{path.resolve().as_posix()}?mode=ro", uri=True)
    else:
        connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def verify_capture_schema(connection: sqlite3.Connection) -> list[str]:
    errors: list[str] = []
    user_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
    if user_version not in SUPPORTED_CAPTURE_SCHEMA_VERSIONS:
        supported = ", ".join(str(value) for value in sorted(SUPPORTED_CAPTURE_SCHEMA_VERSIONS))
        errors.append(f"user_version is {user_version}, supported versions are {supported}")
    row = connection.execute(
        "SELECT schema_name, schema_version FROM schema_info"
    ).fetchone()
    if row is None:
        errors.append("schema_info row is missing")
    elif (
        row["schema_name"] != CAPTURE_SCHEMA_NAME
        or row["schema_version"] != user_version
        or row["schema_version"] not in SUPPORTED_CAPTURE_SCHEMA_VERSIONS
    ):
        errors.append("schema_info identity mismatch")
    integrity = connection.execute("PRAGMA integrity_check").fetchall()
    if [row[0] for row in integrity] != ["ok"]:
        errors.append("SQLite integrity_check failed")
    foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
    if foreign_keys:
        errors.append(f"foreign_key_check returned {len(foreign_keys)} row(s)")
    return errors
