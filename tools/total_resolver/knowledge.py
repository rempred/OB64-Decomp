"""Persistent structural knowledge and exact novelty frontier for Total Resolver."""

from __future__ import annotations

from dataclasses import dataclass, field
import json
import os
from pathlib import Path
import sqlite3
import struct
from typing import Any, Callable, Mapping, Sequence
import uuid
import zlib

from .addressing import RDRAM_SIZE
from .capture_db import canonical_json
from .identities import read_normalized_rom, rom_identity_from_file
from .inventory import load_inventory, repository_root, sha256_file
from .protocol import BRIDGE_PROTOCOL_VERSION, FRONTIER_FORMAT_VERSION
from .schema import utc_now
from .static_model import StaticModel


KNOWLEDGE_SCHEMA = "ob64-total-resolver-knowledge.v3"
KNOWLEDGE_SCHEMA_VERSION = 3
LEGACY_KNOWLEDGE_SCHEMAS = {
    2: "ob64-total-resolver-knowledge.v2",
}
SUPPORTED_KNOWLEDGE_SCHEMAS = {
    **LEGACY_KNOWLEDGE_SCHEMAS,
    KNOWLEDGE_SCHEMA_VERSION: KNOWLEDGE_SCHEMA,
}

# Live capture is intentionally exact-version only, but a deterministic knowledge
# rebuild must remain able to replay every protocol already admitted to the
# persistent ledger. Protocol 0.7.x predates the accepted ordering/evidence
# contract and is deliberately excluded.
HISTORICAL_INGEST_PROTOCOL_VERSIONS = (
    "0.8.0",
    "0.9.0",
    "0.10.0",
    "0.11.0",
    "0.12.0",
)
SUPPORTED_INGEST_PROTOCOL_VERSIONS = (
    *HISTORICAL_INGEST_PROTOCOL_VERSIONS,
    BRIDGE_PROTOCOL_VERSION,
)

MATERIALIZATION_TABLES = {
    "overlay-atlas": (
        "atlas_destination_materialized",
        (
            "destination_physical_start",
            "destination_physical_end_exclusive",
            "placement_count",
            "distinct_content_count",
            "occurrence_count",
            "session_count",
        ),
    ),
    "runtime-provenance": (
        "runtime_function_materialized",
        (
            "function_id",
            "instruction_count",
            "incoming_edge_count",
            "outgoing_edge_count",
            "incoming_call_count",
            "outgoing_call_count",
            "execution_session_count",
        ),
    ),
    "total-resolver": (
        "resolver_function_materialized",
        (
            "function_id",
            "placement_count",
            "instruction_count",
            "exact_edge_count",
            "call_relationship_count",
            "coverage_class",
        ),
    ),
}


def knowledge_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "knowledge.sql"


def knowledge_v3_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "knowledge_v3.sql"


def knowledge_activity_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "knowledge_activity_v3.sql"


def _research_root() -> Path:
    configured = os.environ.get("OB64_RESEARCH_ROOT")
    return Path(configured).resolve() if configured else repository_root().parent.resolve()


def default_static_database() -> Path:
    return (
        _research_root()
        / "wiki"
        / "sol-decomp-static-db-r3-20260710"
        / "db"
        / "ob64-static.sqlite"
    )


def default_resource_database() -> Path:
    return (
        _research_root()
        / "wiki"
        / "rom-resource-load-chain-atlas-static-20260711"
        / "db"
        / "resource-load-chains.sqlite"
    )


def default_knowledge_database() -> Path:
    # Schema 3 is built beside schema 2. Selection changes only after replay,
    # exact fact comparison, and context verification succeed.
    return (
        repository_root()
        / "build"
        / "total-resolver"
        / "knowledge"
        / "total-resolver-v3.sqlite"
    ).resolve()


def knowledge_selection_path() -> Path:
    return default_knowledge_database().parent / "selected.json"


def select_knowledge_database(path: Path) -> dict[str, Any]:
    selected = path.resolve()
    connection = open_knowledge_database(selected, read_only=True)
    connection.close()
    target = knowledge_selection_path()
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + ".tmp")
    temporary.write_text(
        json.dumps(
            {
                "schema": "ob64-total-resolver-knowledge-selection.v2",
                "knowledgeDatabase": str(selected),
            },
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )
    temporary.replace(target)
    return {"result": "PASS", "knowledgeDatabase": str(selected), "selected": True}


def selected_knowledge_database() -> Path | None:
    selection = knowledge_selection_path()
    if selection.is_file():
        try:
            value = json.loads(selection.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ValueError(f"invalid Total Resolver knowledge selection: {selection}") from exc
        selected = value.get("knowledgeDatabase") if isinstance(value, Mapping) else None
        if not isinstance(selected, str) or not selected:
            raise ValueError(f"invalid Total Resolver knowledge selection: {selection}")
        path = Path(selected).resolve()
        if not path.is_file():
            raise FileNotFoundError(f"selected Total Resolver knowledge database is missing: {path}")
        return path
    default = default_knowledge_database()
    return default if default.is_file() else None


def _parse_u32(value: Any, field_name: str) -> int:
    if isinstance(value, bool):
        raise ValueError(f"{field_name} must be an unsigned 32-bit integer")
    if isinstance(value, int):
        result = value
    elif isinstance(value, str):
        try:
            result = int(value, 0)
        except ValueError as exc:
            raise ValueError(f"{field_name} must be an unsigned 32-bit integer") from exc
    else:
        raise ValueError(f"{field_name} must be an unsigned 32-bit integer")
    if not 0 <= result <= 0xFFFFFFFF:
        raise ValueError(f"{field_name} must be an unsigned 32-bit integer")
    return result


def _frontier_identity(
    database_id: str,
    revision: int,
    pages: int,
    instructions: int,
    edges: int,
) -> str:
    """Return an opaque revision token, not a content digest."""

    return f"K2:{database_id}:{revision}:{pages}:{instructions}:{edges}"


@dataclass(frozen=True)
class CodePageObservation:
    """Legacy page/generation context; exact bytes are not structural identity."""

    local_content_id: int
    physical_page_start: int
    native_generation: int
    exact_bytes: bytes
    first_bridge_sequence: int
    last_bridge_sequence: int
    observation_count: int = 1


@dataclass(frozen=True)
class InstructionObservation:
    physical_address: int
    opcode_u32: int
    bridge_sequence: int
    native_generation: int | None = None
    function_id: int | None = None
    z64_offset: int | None = None
    mapping_status: str = "unresolved"
    frame: int | None = None
    observation_kind: str = "native-exact-coverage"


@dataclass(frozen=True)
class EdgeObservation:
    source_physical_address: int
    source_opcode_u32: int
    destination_physical_address: int
    destination_opcode_u32: int
    bridge_sequence: int
    source_generation: int | None = None
    destination_generation: int | None = None
    edge_kind: str = "native-exact-instruction-transition"
    source_function_id: int | None = None
    source_z64_offset: int | None = None
    destination_function_id: int | None = None
    destination_z64_offset: int | None = None
    frame: int | None = None
    observation_kind: str = "native-exact-instruction-transition"


@dataclass(frozen=True)
class DmaPlacementObservation:
    source_domain: str
    source_start: int
    source_end_exclusive: int
    destination_physical_start: int
    destination_physical_end_exclusive: int
    matched_length: int
    exact_bytes: bytes
    region_class: str
    mapping_method: str
    evidence_grade: str
    first_bridge_sequence: int
    last_bridge_sequence: int
    first_frame: int | None = None
    last_frame: int | None = None
    occurrence_count: int = 1
    lifetime_context_count: int = 1


@dataclass(frozen=True)
class FunctionPlacementObservation:
    function_id: int
    source_z64_start: int
    source_z64_end_exclusive: int
    destination_physical_start: int
    destination_physical_end_exclusive: int
    mapping_method: str
    first_sequence: int
    last_sequence: int
    occurrence_count: int = 1


@dataclass(frozen=True)
class ControllerTransitionObservation:
    bridge_sequence: int
    frame: int | None
    end_bridge_sequence_exclusive: int | None
    end_frame_exclusive: int | None
    controller: int
    state_u32: int
    buttons_u32: int
    stick_x: int
    stick_y: int
    injected_by_bridge: bool
    capture_phase: str


@dataclass(frozen=True)
class UnresolvedKnowledgeObservation:
    local_unresolved_id: str
    kind: str
    sequence: int | None
    frame: int | None
    payload: Mapping[str, Any]


@dataclass(frozen=True)
class RegionLifetimeObservation:
    region_instance_id: str
    destination_physical_start: int
    destination_physical_end_exclusive: int
    source_kind: str
    source_identity: str | None
    source_z64_start: int | None
    source_z64_end_exclusive: int | None
    first_sequence: int
    end_sequence_exclusive: int | None
    first_frame: int | None
    last_observed_frame: int | None
    last_observed_sequence: int | None
    closure_reason: str | None
    region_class: str
    evidence_grade: str
    loader_event_id: str | None
    parent_region_instance_id: str | None


@dataclass(frozen=True)
class SampledPcObservation:
    sample_id: str
    sequence: int
    bridge_sequence: int | None
    frame: int | None
    live_pc: int
    physical_pc: int | None
    opcode_u32: int | None
    region_instance_id: str | None
    function_id: int | None
    z64_offset: int | None
    mapping_status: str
    payload: Mapping[str, Any]


@dataclass(frozen=True)
class SemanticMarkerObservation:
    marker_id: int
    marker_type: str
    marker_source: str
    confidence: str
    label: str
    note: str | None
    start_sequence: int | None
    end_sequence: int | None
    start_frame: int | None
    end_frame: int | None
    created_utc: str


@dataclass(frozen=True)
class KnownActivityObservation:
    frontier_identity: str
    frontier_format_version: int
    bridge_sequence: int
    instruction_max_ordinal: int
    instruction_hit_count: int
    instruction_hit_bitmap: bytes
    edge_max_ordinal: int
    edge_hit_count: int
    edge_hit_bitmap: bytes
    dma_max_ordinal: int
    dma_hit_count: int
    dma_hit_bitmap: bytes
    capture_phase: str = "session-stop-native-hit-bitmap"


@dataclass(frozen=True)
class MarkerExecutionContextRecord:
    local_order: int
    side: str
    frame: int | None
    live_pc: int
    physical_address: int | None
    opcode_u32: int
    previous_valid: bool
    previous_live_pc: int
    previous_physical_address: int | None
    previous_opcode_u32: int


@dataclass(frozen=True)
class MarkerContextWindowObservation:
    marker_id: int
    status: str
    completion_bridge_sequence: int
    requested_before_count: int
    requested_after_count: int
    retained_before_count: int
    retained_after_count: int
    limitation_text: str
    records: tuple[MarkerExecutionContextRecord, ...] = ()


@dataclass(frozen=True)
class SessionDelta:
    session_id: str
    capture_identity: str
    raw_manifest_reference: str | None
    capture_schema_version: int
    protocol_version: str
    frontier_identity_at_start: str
    rom_normalized_sha256: str
    bridge_epoch: str
    bridge_sequence_start: int
    bridge_sequence_end: int
    source_capture_path: str
    source_product_path: str
    source_product_reference: str | None
    code_pages: tuple[CodePageObservation, ...] = ()
    instructions: tuple[InstructionObservation, ...] = ()
    edges: tuple[EdgeObservation, ...] = ()
    dma_placements: tuple[DmaPlacementObservation, ...] = ()
    function_placements: tuple[FunctionPlacementObservation, ...] = ()
    controller_transitions: tuple[ControllerTransitionObservation, ...] = ()
    unresolved: tuple[UnresolvedKnowledgeObservation, ...] = ()
    contextual_counts: Mapping[str, int] = field(default_factory=dict)
    regions: tuple[RegionLifetimeObservation, ...] = ()
    sampled_pcs: tuple[SampledPcObservation, ...] = ()
    semantic_markers: tuple[SemanticMarkerObservation, ...] = ()
    context_limitations: tuple[str, ...] = ()
    known_activity: KnownActivityObservation | None = None
    marker_context_windows: tuple[MarkerContextWindowObservation, ...] = ()


@dataclass(frozen=True)
class FrontierPage:
    physical_page_start: int
    instruction_bitmap: bytes


@dataclass(frozen=True)
class FrontierInstruction:
    fact_ordinal: int
    physical_page_start: int
    slot: int
    opcode_u32: int


@dataclass(frozen=True)
class FrontierEdge:
    fact_ordinal: int
    source_physical_page_start: int
    source_slot: int
    source_opcode_u32: int
    destination_physical_page_start: int
    destination_slot: int
    destination_opcode_u32: int


@dataclass(frozen=True)
class FrontierDma:
    fact_ordinal: int
    source_start: int
    source_end_exclusive: int
    destination_physical_start: int
    destination_physical_end_exclusive: int
    matched_length: int
    exact_bytes: bytes


@dataclass(frozen=True)
class NoveltyFrontier:
    identity: str
    rom_normalized_sha256: str
    ledger_ordinal: int
    pages: tuple[FrontierPage, ...]
    instructions: tuple[FrontierInstruction, ...]
    edges: tuple[FrontierEdge, ...]
    dma: tuple[FrontierDma, ...]
    format_version: int = FRONTIER_FORMAT_VERSION

    @property
    def instruction_count(self) -> int:
        return len(self.instructions)

    def summary(self) -> dict[str, Any]:
        return {
            "schema": "ob64-total-resolver-novelty-frontier.v4",
            "formatVersion": self.format_version,
            "frontierIdentity": self.identity,
            "romNormalizedSha256": self.rom_normalized_sha256,
            "ledgerOrdinal": self.ledger_ordinal,
            "physicalPageCount": len(self.pages),
            "instructionCount": len(self.instructions),
            "edgeCount": len(self.edges),
            "dmaCount": len(self.dma),
            "instructionIdentity": "physical-address-plus-exact-opcode",
        }


def empty_novelty_frontier(rom_normalized_sha256: str) -> NoveltyFrontier:
    normalized = rom_normalized_sha256.upper()
    if len(normalized) != 64 or any(character not in "0123456789ABCDEF" for character in normalized):
        raise ValueError("empty frontier ROM identity must be SHA-256")
    return NoveltyFrontier(
        _frontier_identity("UNSELECTED", 0, 0, 0, 0),
        normalized,
        0,
        (),
        (),
        (),
        (),
    )


def _connect(path: Path, *, read_only: bool = False) -> sqlite3.Connection:
    resolved = path.resolve()
    if read_only:
        connection = sqlite3.connect(f"file:{resolved.as_posix()}?mode=ro", uri=True)
    else:
        connection = sqlite3.connect(resolved)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    connection.execute("PRAGMA busy_timeout = 10000")
    if not read_only:
        connection.execute("PRAGMA journal_mode = WAL")
        connection.execute("PRAGMA synchronous = FULL")
    return connection


def _require_knowledge_schema(connection: sqlite3.Connection) -> dict[str, str]:
    version = int(connection.execute("PRAGMA user_version").fetchone()[0])
    expected_schema = SUPPORTED_KNOWLEDGE_SCHEMAS.get(version)
    if expected_schema is None:
        raise ValueError(
            f"unsupported Total Resolver knowledge schema v{version}; "
            f"supported versions are {sorted(SUPPORTED_KNOWLEDGE_SCHEMAS)}"
        )
    meta = {
        str(row[0]): str(row[1])
        for row in connection.execute("SELECT key,value FROM knowledge_meta")
    }
    if meta.get("schema") != expected_schema:
        raise ValueError("not a Total Resolver persistent knowledge database")
    if int(meta.get("schemaVersion", "-1")) != version:
        raise ValueError("knowledge schema metadata disagrees with PRAGMA user_version")
    if (
        meta.get("dynamicReviewState") != "live-unreviewed"
        or meta.get("dynamicEvidenceBoundary")
        != "machine-facts-do-not-promote-accepted-structure"
        or meta.get("captureAuthority") != "observation-only"
    ):
        raise ValueError("knowledge database lacks its evidence and mutation boundaries")
    if not meta.get("databaseId"):
        raise ValueError("knowledge database lacks its opaque database ID")
    return meta


def open_knowledge_database(path: Path, *, read_only: bool = False) -> sqlite3.Connection:
    if not path.resolve().is_file():
        raise FileNotFoundError(path.resolve())
    connection = _connect(path, read_only=read_only)
    try:
        _require_knowledge_schema(connection)
        if read_only:
            connection.execute("PRAGMA query_only = ON")
    except Exception:
        connection.close()
        raise
    return connection


def create_knowledge_database(
    path: Path,
    *,
    rom_path: Path,
    static_database: Path | None = None,
    resource_database: Path | None = None,
    _database_id: str | None = None,
) -> dict[str, Any]:
    """Create a structural database beside historical products; never overwrite."""

    destination = path.resolve()
    if destination.exists():
        raise FileExistsError(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    rom = rom_identity_from_file(rom_path.resolve())
    expected = str(load_inventory()["target"]["normalizedRomSha256"])
    if rom["normalizedSha256"] != expected:
        raise ValueError("knowledge database ROM is not the frozen US Rev 0 target")
    static_path = (static_database or default_static_database()).resolve()
    resource_path = (resource_database or default_resource_database()).resolve()
    static = StaticModel(static_path, resource_path)
    database_id = (_database_id or str(uuid.uuid4())).upper()
    if any(character.isspace() for character in database_id):
        raise ValueError("knowledge database ID must not contain whitespace")

    connection = _connect(destination)
    try:
        connection.executescript(knowledge_schema_path().read_text(encoding="utf-8"))
        connection.executescript(knowledge_v3_schema_path().read_text(encoding="utf-8"))
        connection.executescript(knowledge_activity_schema_path().read_text(encoding="utf-8"))
        meta = {
            "schema": KNOWLEDGE_SCHEMA,
            "schemaVersion": str(KNOWLEDGE_SCHEMA_VERSION),
            "frontierFormatVersion": str(FRONTIER_FORMAT_VERSION),
            "activeBridgeProtocolVersion": BRIDGE_PROTOCOL_VERSION,
            "databaseId": database_id,
            "dynamicReviewState": "live-unreviewed",
            "dynamicEvidenceBoundary": "machine-facts-do-not-promote-accepted-structure",
            "captureAuthority": "observation-only",
            "instructionIdentity": "physical-address-plus-exact-opcode",
            "edgeIdentity": "exact-source-instruction-plus-exact-destination-instruction-plus-kind",
            "pageGenerationRole": "context-only",
            "contentEquality": "fast-bucket-then-exact-bytes",
            "romNormalizedSha256": expected,
            "romPath": str(rom_path.resolve()),
            "staticDatabasePath": str(static_path),
            "resourceDatabasePath": str(resource_path),
            "createdUtc": utc_now(),
        }
        connection.executemany(
            "INSERT INTO knowledge_meta(key,value) VALUES(?,?)", sorted(meta.items())
        )
        now = utc_now()
        source_rows = (
            (
                "target-rom",
                "rom",
                "normalized-sha256",
                expected,
                str(rom_path.resolve()),
                "accepted-source",
                "Exact normalized ROM bytes are static input, not runtime execution evidence.",
                now,
            ),
            (
                "static-db-r3",
                "static",
                "file-sha256",
                sha256_file(static_path),
                str(static_path),
                "accepted-source",
                "Static identity and boundaries do not prove runtime execution.",
                now,
            ),
            (
                "resource-chain-static",
                "resource",
                "file-sha256",
                sha256_file(resource_path),
                str(resource_path),
                "accepted-source",
                "Static resource ancestry does not prove runtime reachability.",
                now,
            ),
        )
        connection.executemany(
            "INSERT INTO source_registry VALUES(?,?,?,?,?,?,?,?)", source_rows
        )
        connection.executemany(
            "INSERT INTO selected_source VALUES(?,?,?)",
            (("rom", "target-rom", now), ("static", "static-db-r3", now),
             ("resource", "resource-chain-static", now)),
        )
        connection.executemany(
            """
            INSERT INTO static_function(
                function_id, structural_name, display_name,
                z64_start, z64_end_exclusive, confidence
            ) VALUES(?,?,?,?,?,?)
            """,
            (
                (
                    item.function_id,
                    item.structural_name,
                    item.display_name,
                    item.rom_start,
                    item.rom_end_exclusive,
                    item.confidence,
                )
                for item in static.functions
            ),
        )
        connection.executemany(
            "INSERT INTO runtime_function_materialized VALUES(?,?,?,?,?,?,?)",
            ((item.function_id, 0, 0, 0, 0, 0, 0) for item in static.functions),
        )
        connection.executemany(
            "INSERT INTO resolver_function_materialized VALUES(?,?,?,?,?,?)",
            ((item.function_id, 0, 0, 0, 0, "never-observed") for item in static.functions),
        )
        empty_frontier = _frontier_identity(database_id, 0, 0, 0, 0)
        connection.execute(
            "INSERT INTO frontier_state VALUES(1,?,?,?,?,?,?,?,?)",
            (FRONTIER_FORMAT_VERSION, empty_frontier, 0, 0, 0, 0, 0, now),
        )
        for name, (table, _columns) in MATERIALIZATION_TABLES.items():
            count = int(connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
            connection.execute(
                "INSERT INTO materialization_state VALUES(?,?,?,?)",
                (name, 0, count, now),
            )
        connection.commit()
    except Exception:
        connection.close()
        if destination.exists():
            destination.unlink()
        raise
    finally:
        if connection:
            connection.close()
    return knowledge_status(destination)


def migrate_frontier_database(source: Path, destination: Path) -> dict[str, Any]:
    """Copy a supported database and install the protocol-4 frontier/context supplement."""

    origin = source.resolve()
    target = destination.resolve()
    if origin == target:
        raise ValueError("frontier migration must build a new database beside the source")
    if target.exists():
        raise FileExistsError(f"frontier migration destination already exists: {target}")
    source_connection = open_knowledge_database(origin, read_only=True)
    try:
        _require_knowledge_schema(source_connection)
        state = source_connection.execute(
            "SELECT format_version FROM frontier_state WHERE singleton=1"
        ).fetchone()
        if state is None or int(state[0]) not in {2, 3, FRONTIER_FORMAT_VERSION}:
            raise ValueError("source database has no migratable novelty frontier")
        target.parent.mkdir(parents=True, exist_ok=True)
        target_connection = sqlite3.connect(target)
        try:
            source_connection.backup(target_connection)
            target_connection.executescript(
                knowledge_activity_schema_path().read_text(encoding="utf-8")
            )
            target_connection.execute("BEGIN IMMEDIATE")
            target_connection.execute(
                "UPDATE frontier_state SET format_version=?,generated_utc=? WHERE singleton=1",
                (FRONTIER_FORMAT_VERSION, utc_now()),
            )
            target_connection.executemany(
                """
                INSERT INTO knowledge_meta(key,value) VALUES(?,?)
                ON CONFLICT(key) DO UPDATE SET value=excluded.value
                """,
                (
                    ("frontierFormatVersion", str(FRONTIER_FORMAT_VERSION)),
                    ("activeBridgeProtocolVersion", BRIDGE_PROTOCOL_VERSION),
                ),
            )
            target_connection.commit()
        finally:
            target_connection.close()
    except Exception:
        if target.exists():
            target.unlink()
        raise
    finally:
        source_connection.close()

    verification = verify_knowledge_database(target)
    if verification["result"] != "PASS":
        target.unlink()
        raise ValueError("migrated frontier database failed independent verification")
    status = knowledge_status(target)
    return {
        "schema": "ob64-total-resolver-frontier-migration.v1",
        "source": str(origin),
        "database": str(target),
        "fromFrontierFormatVersion": int(state[0]),
        "toFrontierFormatVersion": FRONTIER_FORMAT_VERSION,
        "factMutation": "none",
        "metadataMutation": "frontier format and active bridge protocol",
        "schemaMutation": "additive known-activity and marker-context tables",
        "status": status,
        "verification": verification,
    }


def build_frontier(connection: sqlite3.Connection) -> NoveltyFrontier:
    meta = _require_knowledge_schema(connection)
    state = connection.execute("SELECT * FROM frontier_state WHERE singleton=1").fetchone()
    if state is None or int(state["format_version"]) != FRONTIER_FORMAT_VERSION:
        raise ValueError("knowledge database has no supported novelty frontier")
    pages = tuple(
        FrontierPage(int(row[0]), bytes(row[1]))
        for row in connection.execute(
            "SELECT physical_page_start,instruction_bitmap "
            "FROM frontier_page_bitmap ORDER BY physical_page_start"
        )
    )
    instructions = tuple(
        FrontierInstruction(
            int(row[0]),
            int(row[1]) & ~0xFFF,
            (int(row[1]) & 0xFFF) // 4,
            int(row[2]),
        )
        for row in connection.execute(
            "SELECT instruction_id,physical_address,opcode_u32 FROM instruction_fact "
            "ORDER BY instruction_id"
        )
    )
    edges = tuple(
        FrontierEdge(
            int(row[0]),
            int(row[1]) & ~0xFFF,
            (int(row[1]) & 0xFFF) // 4,
            int(row[2]),
            int(row[3]) & ~0xFFF,
            (int(row[3]) & 0xFFF) // 4,
            int(row[4]),
        )
        for row in connection.execute(
            """
            SELECT e.edge_id,si.physical_address,si.opcode_u32,
                   di.physical_address,di.opcode_u32
            FROM edge_fact e
            JOIN instruction_fact si ON si.instruction_id=e.source_instruction_id
            JOIN instruction_fact di ON di.instruction_id=e.destination_instruction_id
            WHERE e.edge_kind='native-exact-instruction-transition'
            ORDER BY e.edge_id
            """
        )
    )
    dma = tuple(
        FrontierDma(
            int(row[0]),
            int(row[1]),
            int(row[2]),
            int(row[3]),
            int(row[4]),
            int(row[5]),
            bytes(row[6]),
        )
        for row in connection.execute(
            """
            SELECT MIN(p.dma_placement_id),p.source_start,p.source_end_exclusive,
                   p.destination_physical_start,p.destination_physical_end_exclusive,
                   p.matched_length,c.content_bytes
            FROM dma_placement p
            JOIN exact_content c ON c.content_id=p.content_id
            WHERE p.source_domain='cartridge-rom'
              AND p.matched_length=c.byte_size
            GROUP BY p.source_start,p.source_end_exclusive,
                     p.destination_physical_start,p.destination_physical_end_exclusive,
                     p.matched_length,c.content_bytes
            ORDER BY MIN(p.dma_placement_id)
            """
        )
    )
    frontier = NoveltyFrontier(
        str(state["frontier_identity"]),
        meta["romNormalizedSha256"],
        int(state["ledger_ordinal"]),
        pages,
        instructions,
        edges,
        dma,
    )
    expected = (
        int(state["physical_page_count"]),
        int(state["instruction_count"]),
        int(state["edge_count"]),
    )
    if (len(pages), len(instructions), len(edges)) != expected:
        raise ValueError("frontier exact structures disagree with the checkpoint counts")
    return frontier


def native_frontier_cache_path(frontier: NoveltyFrontier) -> Path:
    safe_identity = "".join(
        character if character.isalnum() or character in "-_" else "_"
        for character in frontier.identity
    )
    return (
        repository_root()
        / "build"
        / "total-resolver"
        / "native-frontiers"
        / f"{safe_identity}.trf"
    ).resolve()


def write_native_frontier(frontier: NoveltyFrontier, destination: Path) -> Path:
    """Write the exact, little-endian frontier consumed synchronously by Project64."""

    if frontier.format_version != FRONTIER_FORMAT_VERSION:
        raise ValueError("cannot write an incompatible native novelty frontier")
    identity = frontier.identity.encode("utf-8")
    rom_sha256 = frontier.rom_normalized_sha256.encode("ascii")
    if not identity or len(identity) > 192 or len(rom_sha256) != 64:
        raise ValueError("native novelty frontier identity is invalid")
    target = destination.resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + f".tmp-{os.getpid()}")
    try:
        with temporary.open("wb") as output:
            output.write(b"OB64TRF4")
            output.write(
                struct.pack(
                    "<IIIIQQQ",
                    FRONTIER_FORMAT_VERSION,
                    RDRAM_SIZE,
                    len(identity),
                    len(rom_sha256),
                    len(frontier.instructions),
                    len(frontier.edges),
                    len(frontier.dma),
                )
            )
            output.write(identity)
            output.write(rom_sha256)
            for item in frontier.instructions:
                physical = int(item.physical_page_start) + int(item.slot) * 4
                if (
                    not 0 < int(item.fact_ordinal) <= 0xFFFFFFFF
                    or not 0 <= physical < RDRAM_SIZE
                    or physical & 3
                ):
                    raise ValueError("frontier instruction is outside 4 MiB RDRAM")
                output.write(
                    struct.pack(
                        "<III", int(item.fact_ordinal), physical, int(item.opcode_u32)
                    )
                )
            for edge in frontier.edges:
                source = int(edge.source_physical_page_start) + int(edge.source_slot) * 4
                destination_address = (
                    int(edge.destination_physical_page_start) + int(edge.destination_slot) * 4
                )
                output.write(
                    struct.pack(
                        "<IIIII",
                        int(edge.fact_ordinal),
                        source,
                        int(edge.source_opcode_u32),
                        destination_address,
                        int(edge.destination_opcode_u32),
                    )
                )
            for item in frontier.dma:
                content = bytes(item.exact_bytes)
                if (
                    item.destination_physical_end_exclusive > RDRAM_SIZE
                    or not 0 < int(item.fact_ordinal) <= 0xFFFFFFFF
                    or len(content)
                    != item.destination_physical_end_exclusive
                    - item.destination_physical_start
                    or len(content) != item.source_end_exclusive - item.source_start
                    or not 0 <= item.matched_length <= len(content)
                ):
                    raise ValueError("frontier DMA fact is not exact 4 MiB-compatible data")
                output.write(
                    struct.pack(
                        "<IIIIIII",
                        int(item.fact_ordinal),
                        item.source_start,
                        item.source_end_exclusive,
                        item.destination_physical_start,
                        item.destination_physical_end_exclusive,
                        item.matched_length,
                        len(content),
                    )
                )
                output.write(content)
            output.flush()
            os.fsync(output.fileno())
        temporary.replace(target)
    finally:
        if temporary.exists():
            temporary.unlink()
    return target


def knowledge_status(path: Path) -> dict[str, Any]:
    connection = open_knowledge_database(path, read_only=True)
    try:
        meta = _require_knowledge_schema(connection)
        schema_version = int(meta["schemaVersion"])
        frontier = build_frontier(connection)
        mapped_instructions = int(
            connection.execute(
                "SELECT COUNT(*) FROM instruction_fact WHERE z64_offset IS NOT NULL"
            ).fetchone()[0]
        )
        counts = {
            "sessions": int(connection.execute("SELECT COUNT(*) FROM ingestion_ledger").fetchone()[0]),
            "executablePhysicalPages": len(frontier.pages),
            "pageGenerationWitnesses": int(
                connection.execute("SELECT COUNT(*) FROM page_generation_witness").fetchone()[0]
            ),
            "instructions": len(frontier.instructions),
            "mappedInstructions": mapped_instructions,
            "unmappedInstructions": len(frontier.instructions) - mapped_instructions,
            "ambiguousInstructions": int(
                connection.execute(
                    "SELECT COUNT(*) FROM instruction_fact WHERE mapping_status='ambiguous'"
                ).fetchone()[0]
            ),
            "edges": len(frontier.edges),
            "calls": int(connection.execute("SELECT COUNT(*) FROM call_fact").fetchone()[0]),
            "exactDmaContents": int(connection.execute("SELECT COUNT(*) FROM exact_content").fetchone()[0]),
            "dmaPlacements": int(connection.execute("SELECT COUNT(*) FROM dma_placement").fetchone()[0]),
            "functionPlacements": int(
                connection.execute("SELECT COUNT(*) FROM function_placement_fact").fetchone()[0]
            ),
            "controllerTransitions": int(
                connection.execute("SELECT COUNT(*) FROM controller_transition").fetchone()[0]
            ),
            "unresolved": int(
                connection.execute("SELECT COUNT(*) FROM unresolved_observation").fetchone()[0]
            ),
        }
        if schema_version >= 3:
            counts.update(
                {
                    "instructionContextWitnesses": int(
                        connection.execute(
                            "SELECT COUNT(*) FROM instruction_context_witness"
                        ).fetchone()[0]
                    ),
                    "edgeContextWitnesses": int(
                        connection.execute(
                            "SELECT COUNT(*) FROM edge_context_witness"
                        ).fetchone()[0]
                    ),
                    "regionLifetimes": int(
                        connection.execute(
                            "SELECT COUNT(*) FROM region_lifetime_context"
                        ).fetchone()[0]
                    ),
                    "sampledPcs": int(
                        connection.execute("SELECT COUNT(*) FROM sampled_pc_context").fetchone()[0]
                    ),
                    "semanticMarkers": int(
                        connection.execute(
                            "SELECT COUNT(*) FROM semantic_marker_context"
                        ).fetchone()[0]
                    ),
                    "mappingCandidates": int(
                        connection.execute(
                            "SELECT COUNT(*) FROM instruction_mapping_candidate"
                        ).fetchone()[0]
                    ),
                }
            )
            if _table_exists(connection, "known_activity_summary"):
                counts["knownActivitySessions"] = int(
                    connection.execute(
                        "SELECT COUNT(*) FROM known_activity_summary"
                    ).fetchone()[0]
                )
            if _table_exists(connection, "marker_context_window"):
                counts["markerContextWindows"] = int(
                    connection.execute(
                        "SELECT COUNT(*) FROM marker_context_window"
                    ).fetchone()[0]
                )
                counts["markerContextRecords"] = int(
                    connection.execute(
                        "SELECT COUNT(*) FROM marker_execution_context_record"
                    ).fetchone()[0]
                )
        return {
            "schema": meta["schema"],
            "schemaVersion": schema_version,
            "database": str(path.resolve()),
            "databaseId": meta["databaseId"],
            "romNormalizedSha256": meta["romNormalizedSha256"],
            "activeBridgeProtocolVersion": meta["activeBridgeProtocolVersion"],
            "supportedIngestProtocolVersions": list(SUPPORTED_INGEST_PROTOCOL_VERSIONS),
            "dynamicReviewState": meta["dynamicReviewState"],
            "captureAuthority": meta["captureAuthority"],
            "frontier": frontier.summary(),
            "counts": counts,
        }
    finally:
        connection.close()


def _validate_physical_instruction(address: int, opcode: int, label: str) -> None:
    if address & 3 or not 0 <= address <= 0x3FFFFC:
        raise ValueError(f"{label} has an invalid physical instruction address")
    if not 0 <= opcode <= 0xFFFFFFFF:
        raise ValueError(f"{label} has an invalid opcode")


def _validate_instruction_mapping(
    rom: bytes,
    opcode_u32: int,
    function_id: int | None,
    z64_offset: int | None,
    label: str,
) -> None:
    if function_id is None and z64_offset is None:
        return
    if z64_offset is None:
        raise ValueError(f"{label} names a function without an exact ROM offset")
    expected = rom[z64_offset : z64_offset + 4]
    if len(expected) != 4 or expected != opcode_u32.to_bytes(4, "big"):
        raise ValueError(f"{label} opcode does not equal all four bytes at its ROM offset")


def _validate_delta(delta: SessionDelta, meta: Mapping[str, str], rom: bytes) -> None:
    if not delta.session_id or any(character.isspace() for character in delta.session_id):
        raise ValueError("knowledge delta session ID is invalid")
    if not delta.capture_identity:
        raise ValueError("knowledge delta capture reference is missing")
    if delta.rom_normalized_sha256 != meta["romNormalizedSha256"]:
        raise ValueError("session ROM identity differs from the knowledge database")
    if meta.get("activeBridgeProtocolVersion") != BRIDGE_PROTOCOL_VERSION:
        raise ValueError(
            "knowledge database bridge metadata is not current; "
            "a database-building agent must run `knowledge migrate-frontier` "
            "to build and select a verified copy"
        )
    if delta.protocol_version not in SUPPORTED_INGEST_PROTOCOL_VERSIONS:
        raise ValueError(f"unsupported session bridge protocol {delta.protocol_version!r}")
    if delta.bridge_sequence_start < 1 or delta.bridge_sequence_end < delta.bridge_sequence_start:
        raise ValueError("knowledge delta bridge sequence range is invalid")
    if not delta.bridge_epoch:
        raise ValueError("knowledge delta bridge epoch is missing")
    for page in delta.code_pages:
        if page.local_content_id < 1:
            raise ValueError("legacy local code-page content IDs must be positive")
        if page.physical_page_start & 0xFFF or not 0 <= page.physical_page_start <= 0x3FF000:
            raise ValueError("code page has an invalid physical placement")
        if len(page.exact_bytes) != 0x1000:
            raise ValueError("legacy code page context must contain exactly 4 KiB")
        if page.native_generation < 0:
            raise ValueError("code page generation must be nonnegative")
    for item in delta.instructions:
        _validate_physical_instruction(item.physical_address, item.opcode_u32, "instruction")
        _validate_instruction_mapping(
            rom,
            item.opcode_u32,
            item.function_id,
            item.z64_offset,
            "instruction mapping",
        )
        if item.native_generation is not None and item.native_generation < 0:
            raise ValueError("instruction generation must be nonnegative")
    for edge in delta.edges:
        _validate_physical_instruction(
            edge.source_physical_address, edge.source_opcode_u32, "edge source"
        )
        _validate_instruction_mapping(
            rom,
            edge.source_opcode_u32,
            edge.source_function_id,
            edge.source_z64_offset,
            "edge source mapping",
        )
        _validate_instruction_mapping(
            rom,
            edge.destination_opcode_u32,
            edge.destination_function_id,
            edge.destination_z64_offset,
            "edge destination mapping",
        )
        _validate_physical_instruction(
            edge.destination_physical_address,
            edge.destination_opcode_u32,
            "edge destination",
        )
        if edge.source_generation is not None and edge.source_generation < 0:
            raise ValueError("edge source generation must be nonnegative")
        if edge.destination_generation is not None and edge.destination_generation < 0:
            raise ValueError("edge destination generation must be nonnegative")
    for dma in delta.dma_placements:
        if dma.source_end_exclusive <= dma.source_start:
            raise ValueError("DMA source range is empty")
        if not (
            0 <= dma.destination_physical_start
            < dma.destination_physical_end_exclusive
            <= RDRAM_SIZE
        ):
            raise ValueError("DMA destination is outside vanilla OB64's 4 MiB RDRAM")
        if len(dma.exact_bytes) != (
            dma.destination_physical_end_exclusive - dma.destination_physical_start
        ):
            raise ValueError("DMA exact bytes do not cover the destination range")
        if not 0 <= dma.matched_length <= len(dma.exact_bytes):
            raise ValueError("DMA matched length is invalid")
    for transition in delta.controller_transitions:
        if transition.controller != 0:
            raise ValueError("persistent controller context currently supports P1 only")
        if not -128 <= transition.stick_x <= 127 or not -128 <= transition.stick_y <= 127:
            raise ValueError("controller stick context is outside signed-byte range")
    for region in delta.regions:
        if not (
            0 <= region.destination_physical_start
            < region.destination_physical_end_exclusive
            <= RDRAM_SIZE
        ):
            raise ValueError("region lifetime is outside vanilla OB64's 4 MiB RDRAM")
        if region.first_sequence < 1 or (
            region.end_sequence_exclusive is not None
            and region.end_sequence_exclusive <= region.first_sequence
        ):
            raise ValueError("region lifetime sequence range is invalid")
    for sample in delta.sampled_pcs:
        if sample.sequence < 1:
            raise ValueError("sampled PC sequence is invalid")
        if sample.physical_pc is not None:
            _validate_physical_instruction(
                sample.physical_pc,
                sample.opcode_u32 if sample.opcode_u32 is not None else 0,
                "sampled PC",
            )
    activity = delta.known_activity
    if delta.protocol_version == BRIDGE_PROTOCOL_VERSION and activity is None:
        raise ValueError("current-protocol session omitted its stop-time known-activity summary")
    if activity is not None:
        if (
            activity.frontier_identity != delta.frontier_identity_at_start
            or activity.frontier_format_version != FRONTIER_FORMAT_VERSION
            or not delta.bridge_sequence_start
            <= activity.bridge_sequence
            < delta.bridge_sequence_end
            or activity.capture_phase != "session-stop-native-hit-bitmap"
        ):
            raise ValueError("known activity summary disagrees with the session frontier/order")
        for label, maximum, count, bitmap in (
            (
                "instruction",
                activity.instruction_max_ordinal,
                activity.instruction_hit_count,
                activity.instruction_hit_bitmap,
            ),
            ("edge", activity.edge_max_ordinal, activity.edge_hit_count, activity.edge_hit_bitmap),
            ("DMA", activity.dma_max_ordinal, activity.dma_hit_count, activity.dma_hit_bitmap),
        ):
            if (
                maximum < 0
                or count < 0
                or count > maximum
                or len(bitmap) != (maximum + 7) // 8
                or sum(byte.bit_count() for byte in bitmap) != count
                or (
                    maximum & 7
                    and bitmap
                    and bitmap[-1] & ~((1 << (maximum & 7)) - 1)
                )
            ):
                raise ValueError(f"known activity {label} bitmap is inconsistent")
    marker_ids = {marker.marker_id for marker in delta.semantic_markers}
    seen_marker_windows: set[int] = set()
    for window in delta.marker_context_windows:
        if (
            window.marker_id not in marker_ids
            or window.marker_id in seen_marker_windows
            or window.status not in {"complete", "incomplete"}
            or not delta.bridge_sequence_start
            <= window.completion_bridge_sequence
            < delta.bridge_sequence_end
            or not 0 <= window.requested_before_count <= 4096
            or not 1 <= window.requested_after_count <= 4096
            or not 0 <= window.retained_before_count <= window.requested_before_count
            or not 0 <= window.retained_after_count <= window.requested_after_count
            or window.retained_before_count + window.retained_after_count
            != len(window.records)
            or (window.status == "complete" and window.retained_after_count == 0)
            or (window.status == "incomplete" and bool(window.records))
        ):
            raise ValueError("marker execution context window is inconsistent")
        seen_marker_windows.add(window.marker_id)
        orders = [record.local_order for record in window.records]
        if orders and orders != list(range(orders[0], orders[0] + len(orders))):
            raise ValueError("marker execution context local order is discontinuous")
        for index, record in enumerate(window.records):
            if (
                record.side
                != ("before" if index < window.retained_before_count else "after")
                or record.local_order < 1
                or (record.frame is not None and record.frame < 0)
                or not 0 <= record.live_pc <= 0xFFFFFFFF
                or not 0 <= record.previous_live_pc <= 0xFFFFFFFF
                or not 0 <= record.previous_opcode_u32 <= 0xFFFFFFFF
            ):
                raise ValueError("marker execution context record metadata is invalid")
            _validate_physical_instruction(
                record.physical_address if record.physical_address is not None else 0,
                record.opcode_u32,
                "marker execution context",
            )
            if record.previous_physical_address is not None:
                _validate_physical_instruction(
                    record.previous_physical_address,
                    record.previous_opcode_u32,
                    "marker predecessor context",
                )


def _fast_fingerprint(content: bytes) -> int:
    return zlib.crc32(content) & 0xFFFFFFFF


def _intern_exact_content(
    connection: sqlite3.Connection,
    content: bytes,
    *,
    session_id: str,
    fingerprint_function: Callable[[bytes], int],
) -> tuple[int, bool]:
    fingerprint = int(fingerprint_function(content)) & 0xFFFFFFFF
    rows = connection.execute(
        "SELECT content_id,content_bytes FROM exact_content "
        "WHERE fast_fingerprint=? AND byte_size=? ORDER BY content_id",
        (fingerprint, len(content)),
    ).fetchall()
    for row in rows:
        if bytes(row[1]) == content:
            return int(row[0]), False
    cursor = connection.execute(
        "INSERT INTO exact_content("
        "fast_fingerprint,byte_size,content_bytes,first_session_id"
        ") VALUES(?,?,?,?)",
        (fingerprint, len(content), content, session_id),
    )
    assert cursor.lastrowid is not None
    return int(cursor.lastrowid), True


def _merge_mapping(
    connection: sqlite3.Connection,
    instruction_id: int,
    *,
    function_id: int | None,
    z64_offset: int | None,
    mapping_status: str,
) -> set[int]:
    row = connection.execute(
        "SELECT function_id,z64_offset,mapping_status FROM instruction_fact "
        "WHERE instruction_id=?",
        (instruction_id,),
    ).fetchone()
    assert row is not None
    existing_function = None if row[0] is None else int(row[0])
    existing_z64 = None if row[1] is None else int(row[1])
    existing_status = str(row[2])
    affected = {value for value in (existing_function, function_id) if value is not None}
    conflict = bool(
        (existing_function is not None and function_id is not None and existing_function != function_id)
        or (existing_z64 is not None and z64_offset is not None and existing_z64 != z64_offset)
    )
    if conflict:
        connection.execute(
            "UPDATE instruction_fact SET function_id=NULL,z64_offset=NULL,"
            "mapping_status='ambiguous' WHERE instruction_id=?",
            (instruction_id,),
        )
    elif (
        existing_status != "ambiguous"
        and existing_function is None
        and function_id is not None
    ):
        connection.execute(
            "UPDATE instruction_fact SET function_id=?,z64_offset=?,mapping_status=? "
            "WHERE instruction_id=?",
            (function_id, z64_offset, mapping_status, instruction_id),
        )
    return affected


def _ensure_instruction(
    connection: sqlite3.Connection,
    *,
    physical_address: int,
    opcode_u32: int,
    function_id: int | None,
    z64_offset: int | None,
    mapping_status: str,
    session_id: str,
    bridge_sequence: int,
) -> tuple[int, bool, set[int]]:
    opcode_bytes = opcode_u32.to_bytes(4, "big")
    row = connection.execute(
        "SELECT instruction_id FROM instruction_fact "
        "WHERE physical_address=? AND opcode_bytes=?",
        (physical_address, opcode_bytes),
    ).fetchone()
    new_fact = row is None
    if row is None:
        cursor = connection.execute(
            """
            INSERT INTO instruction_fact(
                physical_address,opcode_u32,opcode_bytes,function_id,z64_offset,
                mapping_status,first_session_id,observation_count,discovery_session_count
            ) VALUES(?,?,?,?,?,?,?,1,1)
            """,
            (
                physical_address,
                opcode_u32,
                opcode_bytes,
                function_id,
                z64_offset,
                mapping_status,
                session_id,
            ),
        )
        assert cursor.lastrowid is not None
        instruction_id = int(cursor.lastrowid)
        affected = {function_id} if function_id is not None else set()
    else:
        instruction_id = int(row[0])
        affected = _merge_mapping(
            connection,
            instruction_id,
            function_id=function_id,
            z64_offset=z64_offset,
            mapping_status=mapping_status,
        )
        session_seen = connection.execute(
            "SELECT 1 FROM instruction_session WHERE instruction_id=? AND session_id=?",
            (instruction_id, session_id),
        ).fetchone() is not None
        connection.execute(
            "UPDATE instruction_fact SET observation_count=observation_count+1,"
            "discovery_session_count=discovery_session_count+? WHERE instruction_id=?",
            (int(not session_seen), instruction_id),
        )
    connection.execute(
        """
        INSERT INTO instruction_session(
            instruction_id,session_id,first_bridge_sequence,last_bridge_sequence,
            observation_count
        ) VALUES(?,?,?,?,1)
        ON CONFLICT(instruction_id,session_id) DO UPDATE SET
            first_bridge_sequence=MIN(first_bridge_sequence,excluded.first_bridge_sequence),
            last_bridge_sequence=MAX(last_bridge_sequence,excluded.last_bridge_sequence),
            observation_count=observation_count+1
        """,
        (instruction_id, session_id, bridge_sequence, bridge_sequence),
    )
    if new_fact:
        page = physical_address & ~0xFFF
        slot = (physical_address & 0xFFF) // 4
        row = connection.execute(
            "SELECT instruction_bitmap FROM frontier_page_bitmap "
            "WHERE physical_page_start=?",
            (page,),
        ).fetchone()
        bitmap = bytearray(128 if row is None else bytes(row[0]))
        bitmap[slot >> 3] |= 1 << (slot & 7)
        connection.execute(
            "INSERT INTO frontier_page_bitmap VALUES(?,?) "
            "ON CONFLICT(physical_page_start) DO UPDATE SET "
            "instruction_bitmap=excluded.instruction_bitmap",
            (page, bytes(bitmap)),
        )
    return instruction_id, new_fact, affected


def _record_instruction_generation(
    connection: sqlite3.Connection,
    *,
    instruction_id: int,
    delta: SessionDelta,
    generation: int | None,
    sequence: int,
) -> None:
    if generation is None:
        return
    connection.execute(
        """
        INSERT INTO instruction_generation_witness(
            instruction_id,session_id,bridge_epoch,native_generation,
            first_bridge_sequence,last_bridge_sequence,observation_count
        ) VALUES(?,?,?,?,?,?,1)
        ON CONFLICT(instruction_id,session_id,bridge_epoch,native_generation)
        DO UPDATE SET
            first_bridge_sequence=MIN(first_bridge_sequence,excluded.first_bridge_sequence),
            last_bridge_sequence=MAX(last_bridge_sequence,excluded.last_bridge_sequence),
            observation_count=observation_count+1
        """,
        (
            instruction_id,
            delta.session_id,
            delta.bridge_epoch,
            generation,
            sequence,
            sequence,
        ),
    )


def _call_kind(opcode: int) -> str | None:
    primary = (opcode >> 26) & 0x3F
    if primary == 3:
        return "jal-direct"
    if primary == 0 and (opcode & 0x3F) == 9:
        return "jalr-register"
    if primary == 1 and ((opcode >> 16) & 0x1F) in {0x10, 0x11}:
        return "branch-and-link"
    return None


def _refresh_destination(
    connection: sqlite3.Connection, destination_start: int, destination_end: int
) -> None:
    row = connection.execute(
        """
        SELECT COUNT(*),COUNT(DISTINCT content_id),COALESCE(SUM(observation_count),0)
        FROM dma_placement
        WHERE destination_physical_start=? AND destination_physical_end_exclusive=?
        """,
        (destination_start, destination_end),
    ).fetchone()
    sessions = int(
        connection.execute(
            """
            SELECT COUNT(DISTINCT w.session_id)
            FROM dma_session_witness w
            JOIN dma_placement p ON p.dma_placement_id=w.dma_placement_id
            WHERE p.destination_physical_start=?
              AND p.destination_physical_end_exclusive=?
            """,
            (destination_start, destination_end),
        ).fetchone()[0]
    )
    connection.execute(
        """
        INSERT INTO atlas_destination_materialized VALUES(?,?,?,?,?,?)
        ON CONFLICT(destination_physical_start,destination_physical_end_exclusive)
        DO UPDATE SET placement_count=excluded.placement_count,
                      distinct_content_count=excluded.distinct_content_count,
                      occurrence_count=excluded.occurrence_count,
                      session_count=excluded.session_count
        """,
        (destination_start, destination_end, int(row[0]), int(row[1]), int(row[2]), sessions),
    )


def _refresh_function(connection: sqlite3.Connection, function_id: int) -> None:
    if connection.execute(
        "SELECT 1 FROM static_function WHERE function_id=?", (function_id,)
    ).fetchone() is None:
        raise ValueError(f"materialization references unknown static function {function_id}")
    instruction_count = int(
        connection.execute(
            "SELECT COUNT(*) FROM instruction_fact WHERE function_id=?", (function_id,)
        ).fetchone()[0]
    )
    incoming = int(
        connection.execute(
            """
            SELECT COUNT(*) FROM edge_fact e
            JOIN instruction_fact i ON i.instruction_id=e.destination_instruction_id
            WHERE i.function_id=?
            """,
            (function_id,),
        ).fetchone()[0]
    )
    outgoing = int(
        connection.execute(
            """
            SELECT COUNT(*) FROM edge_fact e
            JOIN instruction_fact i ON i.instruction_id=e.source_instruction_id
            WHERE i.function_id=?
            """,
            (function_id,),
        ).fetchone()[0]
    )
    call_in = int(
        connection.execute(
            "SELECT COUNT(*) FROM call_fact WHERE callee_function_id=?", (function_id,)
        ).fetchone()[0]
    )
    call_out = int(
        connection.execute(
            "SELECT COUNT(*) FROM call_fact WHERE caller_function_id=?", (function_id,)
        ).fetchone()[0]
    )
    sessions = int(
        connection.execute(
            """
            SELECT COUNT(DISTINCT s.session_id)
            FROM instruction_session s
            JOIN instruction_fact i ON i.instruction_id=s.instruction_id
            WHERE i.function_id=?
            """,
            (function_id,),
        ).fetchone()[0]
    )
    placements = int(
        connection.execute(
            "SELECT COUNT(*) FROM function_placement_fact WHERE function_id=?", (function_id,)
        ).fetchone()[0]
    )
    coverage = (
        "placed-and-executed"
        if placements and instruction_count
        else "placed-not-executed"
        if placements
        else "executed-unplaced"
        if instruction_count
        else "never-observed"
    )
    connection.execute(
        "UPDATE runtime_function_materialized SET instruction_count=?,"
        "incoming_edge_count=?,outgoing_edge_count=?,incoming_call_count=?,"
        "outgoing_call_count=?,execution_session_count=? WHERE function_id=?",
        (instruction_count, incoming, outgoing, call_in, call_out, sessions, function_id),
    )
    connection.execute(
        "UPDATE resolver_function_materialized SET placement_count=?,"
        "instruction_count=?,exact_edge_count=?,call_relationship_count=?,"
        "coverage_class=? WHERE function_id=?",
        (
            placements,
            instruction_count,
            incoming + outgoing,
            call_in + call_out,
            coverage,
            function_id,
        ),
    )


def _table_exists(connection: sqlite3.Connection, name: str) -> bool:
    return connection.execute(
        "SELECT 1 FROM sqlite_schema WHERE type='table' AND name=?", (name,)
    ).fetchone() is not None


def _set_activity_ordinals(bitmap: bytes) -> set[int]:
    return {
        byte_index * 8 + bit_index + 1
        for byte_index, byte in enumerate(bitmap)
        for bit_index in range(8)
        if byte & (1 << bit_index)
    }


def _validate_activity_fact_ordinals(
    connection: sqlite3.Connection,
    activity: KnownActivityObservation,
) -> None:
    current = connection.execute(
        "SELECT frontier_identity FROM frontier_state WHERE singleton=1"
    ).fetchone()
    exact_current_frontier = (
        current is not None and str(current[0]) == activity.frontier_identity
    )
    specifications = (
        (
            "instruction",
            "SELECT instruction_id FROM instruction_fact ORDER BY instruction_id",
            activity.instruction_max_ordinal,
            activity.instruction_hit_bitmap,
        ),
        (
            "edge",
            "SELECT edge_id FROM edge_fact "
            "WHERE edge_kind='native-exact-instruction-transition' ORDER BY edge_id",
            activity.edge_max_ordinal,
            activity.edge_hit_bitmap,
        ),
        (
            "DMA",
            "SELECT MIN(p.dma_placement_id) FROM dma_placement p "
            "JOIN exact_content c ON c.content_id=p.content_id "
            "WHERE p.source_domain='cartridge-rom' AND p.matched_length=c.byte_size "
            "GROUP BY p.source_start,p.source_end_exclusive,"
            "p.destination_physical_start,p.destination_physical_end_exclusive,"
            "p.matched_length,c.content_bytes ORDER BY MIN(p.dma_placement_id)",
            activity.dma_max_ordinal,
            activity.dma_hit_bitmap,
        ),
    )
    for label, query, maximum, bitmap in specifications:
        available = {int(row[0]) for row in connection.execute(query)}
        expected_maximum = max(available, default=0)
        if maximum > expected_maximum or (
            exact_current_frontier and maximum != expected_maximum
        ):
            raise ValueError(f"known activity {label} ordinal extent is not its frontier")
        missing = _set_activity_ordinals(bitmap).difference(available)
        if missing:
            raise ValueError(
                f"known activity {label} names unknown fact ordinal {min(missing)}"
            )


def _payload_integer(payload: Mapping[str, Any], *names: str) -> int | None:
    for name in names:
        value = payload.get(name)
        if isinstance(value, bool) or value is None:
            continue
        try:
            return _parse_u32(value, name)
        except ValueError:
            continue
    return None


def _typed_unresolved_row(
    session_id: str, value: UnresolvedKnowledgeObservation
) -> tuple[Any, ...]:
    payload = value.payload
    live = _payload_integer(payload, "pc", "liveAddress", "livePc")
    physical = _payload_integer(
        payload, "physicalPc", "physicalAddress", "physical_address"
    )
    if physical is None and live is not None and 0x80000000 <= live < 0xC0000000:
        physical = live & 0x1FFFFFFF
        if physical >= RDRAM_SIZE:
            physical = None
    function = payload.get("function")
    function_id = (
        _payload_integer(function, "functionId")
        if isinstance(function, Mapping)
        else _payload_integer(payload, "functionId")
    )
    next_evidence = payload.get("nextEvidence")
    return (
        session_id,
        value.local_unresolved_id,
        value.kind,
        value.sequence,
        value.frame,
        live,
        physical,
        _payload_integer(payload, "opcode", "opcodeU32", "opcode_u32"),
        _payload_integer(payload, "sourcePhysicalAddress", "sourcePhysicalPc"),
        _payload_integer(
            payload, "destinationPhysicalAddress", "destinationPhysicalPc"
        ),
        _payload_integer(payload, "pageGeneration", "nativeGeneration"),
        function_id,
        _payload_integer(payload, "romOffset", "z64Offset"),
        payload.get("regionInstanceId")
        if isinstance(payload.get("regionInstanceId"), str)
        else None,
        str(next_evidence) if isinstance(next_evidence, str) else None,
    )


def _queue_candidate_range(
    connection: sqlite3.Connection,
    *,
    physical_start: int,
    physical_end_exclusive: int,
    reason: str,
    ledger_ordinal: int,
) -> None:
    if not _table_exists(connection, "candidate_recalculation_queue"):
        return
    start = max(0, physical_start & ~3)
    end = min(RDRAM_SIZE, (physical_end_exclusive + 3) & ~3)
    if end <= start:
        return
    connection.execute(
        "INSERT OR IGNORE INTO candidate_recalculation_queue("
        "physical_start,physical_end_exclusive,reason,queued_ledger_ordinal,status"
        ") VALUES(?,?,?,?,'queued')",
        (start, end, reason, ledger_ordinal),
    )


def _candidate_rows_for_instruction(
    connection: sqlite3.Connection,
    *,
    instruction: sqlite3.Row,
    rom: bytes,
    ledger_ordinal: int,
    placements: Sequence[sqlite3.Row] | None = None,
    regions_by_delta: Mapping[int, Sequence[sqlite3.Row]] | None = None,
    placement_sessions: Mapping[int, Sequence[sqlite3.Row]] | None = None,
) -> tuple[list[tuple[Any, ...]], set[int]]:
    instruction_id = int(instruction["instruction_id"])
    physical = int(instruction["physical_address"])
    opcode_bytes = bytes(instruction["opcode_bytes"])
    output: list[tuple[Any, ...]] = []
    promoted_functions: set[int] = set()
    if placements is None:
        placements = list(
            connection.execute(
                "SELECT * FROM function_placement_fact "
                "WHERE destination_physical_start<=? "
                "AND destination_physical_end_exclusive>? "
                "ORDER BY function_placement_id",
                (physical, physical),
            )
        )
    live_keys: set[tuple[int, int]] = set()
    live_rows: list[tuple[int, int, sqlite3.Row, sqlite3.Row]] = []
    exact_placements: list[tuple[sqlite3.Row, int]] = []
    for placement in placements:
        if not (
            int(placement["destination_physical_start"])
            <= physical
            < int(placement["destination_physical_end_exclusive"])
        ):
            continue
        z64 = int(placement["source_z64_start"]) + physical - int(
            placement["destination_physical_start"]
        )
        if rom[z64 : z64 + 4] != opcode_bytes:
            continue
        exact_placements.append((placement, z64))
        matching_regions = (
            [
                region
                for region in regions_by_delta.get(z64 - physical, ())
                if int(region["destination_physical_start"]) <= physical
                < int(region["destination_physical_end_exclusive"])
                and region["source_z64_start"] is not None
                and int(region["source_z64_start"])
                + physical
                - int(region["destination_physical_start"])
                == z64
            ]
            if regions_by_delta is not None
            else list(
                connection.execute(
                    "SELECT * FROM region_lifetime_context "
                    "WHERE destination_physical_start<=? "
                    "AND destination_physical_end_exclusive>? "
                    "AND source_z64_start IS NOT NULL "
                    "AND source_z64_start + (? - destination_physical_start)=? "
                    "ORDER BY session_id,first_sequence,region_instance_id",
                    (physical, physical, physical, z64),
                )
            )
        )
        for region in matching_regions:
            live_keys.add((int(placement["function_id"]), z64))
            live_rows.append(
                (int(placement["function_id"]), z64, placement, region)
            )

    ambiguous_live = len(live_keys) > 1
    for function_id, z64, placement, region in live_rows:
        output.append(
            (
                instruction_id,
                function_id,
                z64,
                int(placement["function_placement_id"]),
                str(region["session_id"]),
                str(region["region_instance_id"]),
                "ambiguous-conflicting-mapping"
                if ambiguous_live
                else "uniquely-resolved-live-mapping",
                "contemporaneous-region-lifetime-plus-exact-opcode",
                1,
                int(region["first_sequence"]),
                region["end_sequence_exclusive"],
                "multiple contemporaneous exact placements"
                if ambiguous_live
                else None,
                "Distinguish competing region generations at this event."
                if ambiguous_live
                else "none",
                ledger_ordinal,
            )
        )

    for placement, z64 in exact_placements:
        placement_id = int(placement["function_placement_id"])
        sessions = (
            list(placement_sessions.get(placement_id, ()))
            if placement_sessions is not None
            else list(
                connection.execute(
                    "SELECT * FROM function_placement_session "
                    "WHERE function_placement_id=? ORDER BY session_id",
                    (placement_id,),
                )
            )
        )
        for witness in sessions:
            output.append(
                (
                    instruction_id,
                    int(placement["function_id"]),
                    z64,
                    placement_id,
                    str(witness["session_id"]),
                    None,
                    "contemporaneous-placement-candidate",
                    "same-session-placement-plus-exact-opcode",
                    1,
                    int(witness["first_sequence"]),
                    int(witness["last_sequence"]) + 1,
                    None,
                    "A same-session placement lacks an interval covering the exact event.",
                    ledger_ordinal,
                )
            )
        output.append(
            (
                instruction_id,
                int(placement["function_id"]),
                z64,
                placement_id,
                None,
                None,
                "byte-confirmed-global-candidate",
                "global-placement-plus-exact-opcode",
                1,
                None,
                None,
                None,
                "A cross-session placement is not contemporaneous with this execution.",
                ledger_ordinal,
            )
        )

    # Candidate states are deliberately separate from the exact fact row.
    # A database-building review step may later accept a uniquely resolved
    # candidate; ordinary ingestion never rewrites prior mapping evidence.
    return output, promoted_functions


def _process_candidate_queue(
    connection: sqlite3.Connection,
    *,
    rom: bytes,
    ledger_ordinal: int,
) -> tuple[int, set[int]]:
    if not _table_exists(connection, "candidate_recalculation_queue"):
        return 0, set()
    total = 0
    affected_functions: set[int] = set()
    queues = list(
        connection.execute(
            "SELECT * FROM candidate_recalculation_queue WHERE status='queued' "
            "ORDER BY physical_start,physical_end_exclusive,queue_id"
        )
    )
    merged_ranges: list[list[int]] = []
    for queued in queues:
        start = int(queued["physical_start"])
        end = int(queued["physical_end_exclusive"])
        if merged_ranges and start <= merged_ranges[-1][1]:
            merged_ranges[-1][1] = max(merged_ranges[-1][1], end)
        else:
            merged_ranges.append([start, end])
    placement_by_page: dict[int, list[sqlite3.Row]] = {}
    for placement in connection.execute(
        "SELECT * FROM function_placement_fact ORDER BY function_placement_id"
    ):
        first_page = int(placement["destination_physical_start"]) >> 12
        last_page = (int(placement["destination_physical_end_exclusive"]) - 1) >> 12
        for page in range(first_page, last_page + 1):
            placement_by_page.setdefault(page, []).append(placement)
    regions_by_delta: dict[int, list[sqlite3.Row]] = {}
    for region in connection.execute(
        "SELECT * FROM region_lifetime_context WHERE source_z64_start IS NOT NULL "
        "ORDER BY session_id,first_sequence,region_instance_id"
    ):
        delta = int(region["source_z64_start"]) - int(
            region["destination_physical_start"]
        )
        regions_by_delta.setdefault(delta, []).append(region)
    placement_sessions: dict[int, list[sqlite3.Row]] = {}
    for witness in connection.execute(
        "SELECT * FROM function_placement_session "
        "ORDER BY function_placement_id,session_id"
    ):
        placement_sessions.setdefault(
            int(witness["function_placement_id"]), []
        ).append(witness)

    seen_instructions: set[int] = set()
    for start, end in merged_ranges:
        instructions = list(
            connection.execute(
                "SELECT * FROM instruction_fact WHERE physical_address>=? "
                "AND physical_address<? AND (function_id IS NULL OR mapping_status='ambiguous') "
                "ORDER BY instruction_id",
                (start, end),
            )
        )
        for instruction in instructions:
            instruction_id = int(instruction["instruction_id"])
            if instruction_id in seen_instructions:
                continue
            seen_instructions.add(instruction_id)
            connection.execute(
                "DELETE FROM instruction_mapping_candidate WHERE instruction_id=?",
                (instruction_id,),
            )
            rows, promoted = _candidate_rows_for_instruction(
                connection,
                instruction=instruction,
                rom=rom,
                ledger_ordinal=ledger_ordinal,
                placements=placement_by_page.get(
                    int(instruction["physical_address"]) >> 12, ()
                ),
                regions_by_delta=regions_by_delta,
                placement_sessions=placement_sessions,
            )
            if rows:
                connection.executemany(
                    "INSERT OR IGNORE INTO instruction_mapping_candidate("
                    "instruction_id,function_id,z64_offset,function_placement_id,"
                    "evidence_session_id,region_instance_id,candidate_state,evidence_kind,"
                    "exact_bytes_confirmed,first_sequence,last_sequence_exclusive,"
                    "contradiction_text,missing_evidence,recalculated_ledger_ordinal"
                    ") VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    rows,
                )
            total += len(rows)
            affected_functions.update(promoted)
    connection.execute(
        "UPDATE candidate_recalculation_queue SET status='processed',"
        "processed_candidate_count=? WHERE status='queued'",
        (total,),
    )
    return total, affected_functions


def _ledger_conflicts(row: sqlite3.Row, delta: SessionDelta) -> bool:
    expected = (
        delta.capture_identity,
        delta.capture_schema_version,
        delta.protocol_version,
        delta.frontier_identity_at_start,
        delta.rom_normalized_sha256,
        delta.bridge_epoch,
        delta.bridge_sequence_start,
        delta.bridge_sequence_end,
    )
    actual = (
        str(row["capture_reference"]),
        int(row["capture_schema_version"]),
        str(row["protocol_version"]),
        str(row["frontier_identity_at_start"]),
        str(row["rom_normalized_sha256"]),
        str(row["bridge_epoch"]),
        int(row["bridge_sequence_start"]),
        int(row["bridge_sequence_end"]),
    )
    return actual != expected


def ingest_delta(
    path: Path,
    delta: SessionDelta,
    *,
    fingerprint_function: Callable[[bytes], int] = _fast_fingerprint,
    _test_fail_after_stage: str | None = None,
) -> dict[str, Any]:
    """Atomically merge one validated structural delta."""

    connection = open_knowledge_database(path)
    try:
        meta = _require_knowledge_schema(connection)
        schema_version = int(meta["schemaVersion"])
        has_context_schema = schema_version >= 3
        has_activity_schema = _table_exists(connection, "known_activity_summary")
        rom = read_normalized_rom(Path(meta["romPath"]))
        _validate_delta(delta, meta, rom)
        if delta.known_activity is not None:
            if not has_activity_schema:
                raise ValueError("knowledge database lacks the known-activity schema")
            _validate_activity_fact_ordinals(connection, delta.known_activity)
        if delta.marker_context_windows and not _table_exists(
            connection, "marker_context_window"
        ):
            raise ValueError("knowledge database lacks the marker-context schema")
        existing = connection.execute(
            "SELECT * FROM ingestion_ledger WHERE session_id=?", (delta.session_id,)
        ).fetchone()
        if existing is not None:
            if _ledger_conflicts(existing, delta):
                raise ValueError("session ID conflicts with already ingested exact metadata")
            return {
                "result": "PASS",
                "action": "no-op",
                "sessionId": delta.session_id,
                "captureIdentity": delta.capture_identity,
                "knowledge": knowledge_status(path),
            }

        new_counts = {
            "executablePhysicalPages": 0,
            "instructions": 0,
            "edges": 0,
            "calls": 0,
            "dmaPlacements": 0,
            "functionPlacements": 0,
            "mappingCandidates": 0,
        }
        affected_destinations: set[tuple[int, int]] = set()
        affected_functions: set[int] = set()
        connection.execute("BEGIN IMMEDIATE")
        try:
            next_ordinal = int(
                connection.execute(
                    "SELECT COALESCE(MAX(ledger_ordinal),0)+1 FROM ingestion_ledger"
                ).fetchone()[0]
            )
            page_context: dict[tuple[int, int], list[tuple[int, int, int]]] = {}
            for page in delta.code_pages:
                page_context.setdefault(
                    (page.physical_page_start, page.native_generation), []
                ).append(
                    (
                        page.first_bridge_sequence,
                        page.last_bridge_sequence,
                        page.observation_count,
                    )
                )
            for item in delta.instructions:
                if item.native_generation is not None:
                    page_context.setdefault(
                        (item.physical_address & ~0xFFF, item.native_generation), []
                    ).append((item.bridge_sequence, item.bridge_sequence, 1))
            for edge in delta.edges:
                if edge.source_generation is not None:
                    page_context.setdefault(
                        (
                            edge.source_physical_address & ~0xFFF,
                            edge.source_generation,
                        ),
                        [],
                    ).append((edge.bridge_sequence, edge.bridge_sequence, 1))
                if edge.destination_generation is not None:
                    page_context.setdefault(
                        (
                            edge.destination_physical_address & ~0xFFF,
                            edge.destination_generation,
                        ),
                        [],
                    ).append((edge.bridge_sequence, edge.bridge_sequence, 1))
            for (physical_page, generation), values in page_context.items():
                connection.execute(
                    """
                    INSERT INTO page_generation_witness(
                        session_id,bridge_epoch,physical_page_start,native_generation,
                        first_bridge_sequence,last_bridge_sequence,observation_count
                    ) VALUES(?,?,?,?,?,?,?)
                    ON CONFLICT(session_id,bridge_epoch,physical_page_start,native_generation)
                    DO UPDATE SET
                        first_bridge_sequence=MIN(first_bridge_sequence,excluded.first_bridge_sequence),
                        last_bridge_sequence=MAX(last_bridge_sequence,excluded.last_bridge_sequence),
                        observation_count=observation_count+excluded.observation_count
                    """,
                    (
                        delta.session_id,
                        delta.bridge_epoch,
                        physical_page,
                        generation,
                        min(value[0] for value in values),
                        max(value[1] for value in values),
                        sum(value[2] for value in values),
                    ),
                )

            initial_pages = int(
                connection.execute("SELECT COUNT(*) FROM frontier_page_bitmap").fetchone()[0]
            )
            instruction_cache: dict[tuple[int, int], int] = {}
            generation_seen: set[tuple[int, int | None, int]] = set()

            def ensure_observation(
                *,
                physical_address: int,
                opcode_u32: int,
                function_id: int | None,
                z64_offset: int | None,
                mapping_status: str,
                bridge_sequence: int,
                generation: int | None,
            ) -> int:
                key = (physical_address, opcode_u32)
                cached = instruction_cache.get(key)
                if cached is None:
                    instruction_id, new_fact, affected = _ensure_instruction(
                        connection,
                        physical_address=physical_address,
                        opcode_u32=opcode_u32,
                        function_id=function_id,
                        z64_offset=z64_offset,
                        mapping_status=mapping_status,
                        session_id=delta.session_id,
                        bridge_sequence=bridge_sequence,
                    )
                    instruction_cache[key] = instruction_id
                    affected_functions.update(affected)
                    if new_fact:
                        new_counts["instructions"] += 1
                else:
                    instruction_id = cached
                    affected_functions.update(
                        _merge_mapping(
                            connection,
                            instruction_id,
                            function_id=function_id,
                            z64_offset=z64_offset,
                            mapping_status=mapping_status,
                        )
                    )
                witness_key = (instruction_id, generation, bridge_sequence)
                if witness_key not in generation_seen:
                    _record_instruction_generation(
                        connection,
                        instruction_id=instruction_id,
                        delta=delta,
                        generation=generation,
                        sequence=bridge_sequence,
                    )
                    generation_seen.add(witness_key)
                return instruction_id

            for item in delta.instructions:
                instruction_id = ensure_observation(
                    physical_address=item.physical_address,
                    opcode_u32=item.opcode_u32,
                    function_id=item.function_id,
                    z64_offset=item.z64_offset,
                    mapping_status=item.mapping_status,
                    bridge_sequence=item.bridge_sequence,
                    generation=item.native_generation,
                )
                if has_context_schema:
                    connection.execute(
                        "INSERT INTO instruction_context_witness("
                        "instruction_id,session_id,bridge_sequence,frame,"
                        "native_generation,observation_kind) VALUES(?,?,?,?,?,?) "
                        "ON CONFLICT(instruction_id,session_id,bridge_sequence) DO UPDATE SET "
                        "frame=COALESCE(frame,excluded.frame),"
                        "native_generation=COALESCE(native_generation,excluded.native_generation),"
                        "observation_kind=excluded.observation_kind",
                        (
                            instruction_id,
                            delta.session_id,
                            item.bridge_sequence,
                            item.frame,
                            item.native_generation,
                            item.observation_kind,
                        ),
                    )
                _queue_candidate_range(
                    connection,
                    physical_start=item.physical_address & ~0xFFF,
                    physical_end_exclusive=(item.physical_address & ~0xFFF) + 0x1000,
                    reason="instruction-page-observation",
                    ledger_ordinal=next_ordinal,
                )

            edge_cache: set[tuple[int, int, str]] = set()
            for edge in delta.edges:
                source_id = ensure_observation(
                    physical_address=edge.source_physical_address,
                    opcode_u32=edge.source_opcode_u32,
                    function_id=edge.source_function_id,
                    z64_offset=edge.source_z64_offset,
                    mapping_status=(
                        "contextual-edge-source"
                        if edge.source_function_id is not None
                        else "unresolved"
                    ),
                    bridge_sequence=edge.bridge_sequence,
                    generation=edge.source_generation,
                )
                destination_id = ensure_observation(
                    physical_address=edge.destination_physical_address,
                    opcode_u32=edge.destination_opcode_u32,
                    function_id=edge.destination_function_id,
                    z64_offset=edge.destination_z64_offset,
                    mapping_status=(
                        "contextual-edge-destination"
                        if edge.destination_function_id is not None
                        else "unresolved"
                    ),
                    bridge_sequence=edge.bridge_sequence,
                    generation=edge.destination_generation,
                )
                edge_key = (source_id, destination_id, edge.edge_kind)
                if edge_key in edge_cache:
                    continue
                edge_cache.add(edge_key)
                row = connection.execute(
                    "SELECT edge_id FROM edge_fact WHERE source_instruction_id=? "
                    "AND destination_instruction_id=? AND edge_kind=?",
                    edge_key,
                ).fetchone()
                if row is None:
                    cursor = connection.execute(
                        """
                        INSERT INTO edge_fact(
                            source_instruction_id,destination_instruction_id,edge_kind,
                            first_session_id,observation_count,discovery_session_count
                        ) VALUES(?,?,?,?,1,1)
                        """,
                        (source_id, destination_id, edge.edge_kind, delta.session_id),
                    )
                    assert cursor.lastrowid is not None
                    edge_id = int(cursor.lastrowid)
                    new_counts["edges"] += 1
                else:
                    edge_id = int(row[0])
                    session_seen = connection.execute(
                        "SELECT 1 FROM edge_session WHERE edge_id=? AND session_id=?",
                        (edge_id, delta.session_id),
                    ).fetchone() is not None
                    connection.execute(
                        "UPDATE edge_fact SET observation_count=observation_count+1,"
                        "discovery_session_count=discovery_session_count+? WHERE edge_id=?",
                        (int(not session_seen), edge_id),
                    )
                connection.execute(
                    """
                    INSERT INTO edge_session(
                        edge_id,session_id,first_bridge_sequence,last_bridge_sequence,
                        observation_count
                    ) VALUES(?,?,?,?,1)
                    ON CONFLICT(edge_id,session_id) DO UPDATE SET
                        first_bridge_sequence=MIN(first_bridge_sequence,excluded.first_bridge_sequence),
                        last_bridge_sequence=MAX(last_bridge_sequence,excluded.last_bridge_sequence),
                        observation_count=observation_count+1
                    """,
                    (edge_id, delta.session_id, edge.bridge_sequence, edge.bridge_sequence),
                )
                if edge.source_generation is not None and edge.destination_generation is not None:
                    connection.execute(
                        """
                        INSERT INTO edge_generation_witness(
                            edge_id,session_id,bridge_epoch,source_generation,
                            destination_generation,first_bridge_sequence,
                            last_bridge_sequence,observation_count
                        ) VALUES(?,?,?,?,?,?,?,1)
                        ON CONFLICT(
                            edge_id,session_id,bridge_epoch,source_generation,
                            destination_generation
                        ) DO UPDATE SET
                            first_bridge_sequence=MIN(first_bridge_sequence,excluded.first_bridge_sequence),
                            last_bridge_sequence=MAX(last_bridge_sequence,excluded.last_bridge_sequence),
                            observation_count=observation_count+1
                        """,
                        (
                            edge_id,
                            delta.session_id,
                            delta.bridge_epoch,
                            edge.source_generation,
                            edge.destination_generation,
                            edge.bridge_sequence,
                            edge.bridge_sequence,
                        ),
                    )
                if has_context_schema:
                    connection.execute(
                        "INSERT INTO edge_context_witness("
                        "edge_id,session_id,bridge_sequence,frame,source_generation,"
                        "destination_generation,observation_kind) VALUES(?,?,?,?,?,?,?) "
                        "ON CONFLICT(edge_id,session_id,bridge_sequence) DO UPDATE SET "
                        "frame=COALESCE(frame,excluded.frame),"
                        "source_generation=COALESCE(source_generation,excluded.source_generation),"
                        "destination_generation=COALESCE(destination_generation,excluded.destination_generation),"
                        "observation_kind=excluded.observation_kind",
                        (
                            edge_id,
                            delta.session_id,
                            edge.bridge_sequence,
                            edge.frame,
                            edge.source_generation,
                            edge.destination_generation,
                            edge.observation_kind,
                        ),
                    )
                source_row = connection.execute(
                    "SELECT function_id,opcode_u32 FROM instruction_fact "
                    "WHERE instruction_id=?",
                    (source_id,),
                ).fetchone()
                destination_row = connection.execute(
                    "SELECT function_id FROM instruction_fact WHERE instruction_id=?",
                    (destination_id,),
                ).fetchone()
                assert source_row is not None and destination_row is not None
                call_kind = _call_kind(int(source_row[1]))
                if call_kind is not None and source_row[0] is not None and destination_row[0] is not None:
                    inserted = connection.execute(
                        "INSERT OR IGNORE INTO call_fact VALUES(?,?,?,?,?)",
                        (
                            edge_id,
                            int(source_row[0]),
                            int(destination_row[0]),
                            call_kind,
                            delta.session_id,
                        ),
                    ).rowcount
                    new_counts["calls"] += int(inserted > 0)
                    affected_functions.update((int(source_row[0]), int(destination_row[0])))

            new_counts["executablePhysicalPages"] = (
                int(connection.execute("SELECT COUNT(*) FROM frontier_page_bitmap").fetchone()[0])
                - initial_pages
            )

            for dma in delta.dma_placements:
                content_id, _new_content = _intern_exact_content(
                    connection,
                    dma.exact_bytes,
                    session_id=delta.session_id,
                    fingerprint_function=fingerprint_function,
                )
                key = (
                    dma.source_domain,
                    dma.source_start,
                    dma.source_end_exclusive,
                    dma.destination_physical_start,
                    dma.destination_physical_end_exclusive,
                    dma.matched_length,
                    content_id,
                    dma.region_class,
                    dma.mapping_method,
                )
                row = connection.execute(
                    """
                    SELECT dma_placement_id FROM dma_placement
                    WHERE source_domain=? AND source_start=? AND source_end_exclusive=?
                      AND destination_physical_start=?
                      AND destination_physical_end_exclusive=?
                      AND matched_length=? AND content_id=? AND region_class=?
                      AND mapping_method=?
                    """,
                    key,
                ).fetchone()
                if row is None:
                    cursor = connection.execute(
                        """
                        INSERT INTO dma_placement(
                            source_domain,source_start,source_end_exclusive,
                            destination_physical_start,destination_physical_end_exclusive,
                            matched_length,content_id,region_class,mapping_method,
                            evidence_grade,first_session_id,observation_count,session_count
                        ) VALUES(?,?,?,?,?,?,?,?,?,?,?, ?,1)
                        """,
                        (*key, dma.evidence_grade, delta.session_id, dma.occurrence_count),
                    )
                    assert cursor.lastrowid is not None
                    placement_id = int(cursor.lastrowid)
                    new_counts["dmaPlacements"] += 1
                else:
                    placement_id = int(row[0])
                    session_seen = connection.execute(
                        "SELECT 1 FROM dma_session_witness "
                        "WHERE dma_placement_id=? AND session_id=?",
                        (placement_id, delta.session_id),
                    ).fetchone() is not None
                    connection.execute(
                        "UPDATE dma_placement SET observation_count=observation_count+?,"
                        "session_count=session_count+? WHERE dma_placement_id=?",
                        (dma.occurrence_count, int(not session_seen), placement_id),
                    )
                connection.execute(
                    """
                    INSERT INTO dma_session_witness(
                        dma_placement_id,session_id,bridge_epoch,first_bridge_sequence,
                        last_bridge_sequence,first_frame,last_frame,occurrence_count,
                        lifetime_context_count
                    ) VALUES(?,?,?,?,?,?,?,?,?)
                    ON CONFLICT(dma_placement_id,session_id) DO UPDATE SET
                        first_bridge_sequence=MIN(first_bridge_sequence,excluded.first_bridge_sequence),
                        last_bridge_sequence=MAX(last_bridge_sequence,excluded.last_bridge_sequence),
                        first_frame=COALESCE(MIN(first_frame,excluded.first_frame),first_frame,excluded.first_frame),
                        last_frame=COALESCE(MAX(last_frame,excluded.last_frame),last_frame,excluded.last_frame),
                        occurrence_count=occurrence_count+excluded.occurrence_count,
                        lifetime_context_count=lifetime_context_count+excluded.lifetime_context_count
                    """,
                    (
                        placement_id,
                        delta.session_id,
                        delta.bridge_epoch,
                        dma.first_bridge_sequence,
                        dma.last_bridge_sequence,
                        dma.first_frame,
                        dma.last_frame,
                        dma.occurrence_count,
                        dma.lifetime_context_count,
                    ),
                )
                affected_destinations.add(
                    (dma.destination_physical_start, dma.destination_physical_end_exclusive)
                )

            for placement in delta.function_placements:
                key = (
                    placement.function_id,
                    placement.source_z64_start,
                    placement.source_z64_end_exclusive,
                    placement.destination_physical_start,
                    placement.destination_physical_end_exclusive,
                    placement.mapping_method,
                )
                row = connection.execute(
                    """
                    SELECT function_placement_id FROM function_placement_fact
                    WHERE function_id=? AND source_z64_start=?
                      AND source_z64_end_exclusive=?
                      AND destination_physical_start=?
                      AND destination_physical_end_exclusive=?
                      AND mapping_method=?
                    """,
                    key,
                ).fetchone()
                if row is None:
                    cursor = connection.execute(
                        """
                        INSERT INTO function_placement_fact(
                            function_id,source_z64_start,source_z64_end_exclusive,
                            destination_physical_start,destination_physical_end_exclusive,
                            mapping_method,first_session_id,observation_count,session_count
                        ) VALUES(?,?,?,?,?,?,?, ?,1)
                        """,
                        (*key, delta.session_id, placement.occurrence_count),
                    )
                    assert cursor.lastrowid is not None
                    placement_id = int(cursor.lastrowid)
                    new_counts["functionPlacements"] += 1
                else:
                    placement_id = int(row[0])
                    session_seen = connection.execute(
                        "SELECT 1 FROM function_placement_session "
                        "WHERE function_placement_id=? AND session_id=?",
                        (placement_id, delta.session_id),
                    ).fetchone() is not None
                    connection.execute(
                        "UPDATE function_placement_fact SET "
                        "observation_count=observation_count+?,session_count=session_count+? "
                        "WHERE function_placement_id=?",
                        (placement.occurrence_count, int(not session_seen), placement_id),
                    )
                connection.execute(
                    """
                    INSERT INTO function_placement_session(
                        function_placement_id,session_id,first_sequence,last_sequence,
                        occurrence_count
                    ) VALUES(?,?,?,?,?)
                    ON CONFLICT(function_placement_id,session_id) DO UPDATE SET
                        first_sequence=MIN(first_sequence,excluded.first_sequence),
                        last_sequence=MAX(last_sequence,excluded.last_sequence),
                        occurrence_count=occurrence_count+excluded.occurrence_count
                    """,
                    (
                        placement_id,
                        delta.session_id,
                        placement.first_sequence,
                        placement.last_sequence,
                        placement.occurrence_count,
                    ),
                )
                affected_functions.add(placement.function_id)
                _queue_candidate_range(
                    connection,
                    physical_start=placement.destination_physical_start,
                    physical_end_exclusive=placement.destination_physical_end_exclusive,
                    reason="function-placement",
                    ledger_ordinal=next_ordinal,
                )

            if has_context_schema:
                connection.executemany(
                    "INSERT INTO region_lifetime_context VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (
                        (
                            delta.session_id,
                            value.region_instance_id,
                            value.destination_physical_start,
                            value.destination_physical_end_exclusive,
                            value.source_kind,
                            value.source_identity,
                            value.source_z64_start,
                            value.source_z64_end_exclusive,
                            value.first_sequence,
                            value.end_sequence_exclusive,
                            value.first_frame,
                            value.last_observed_frame,
                            value.last_observed_sequence,
                            value.closure_reason,
                            value.region_class,
                            value.evidence_grade,
                            value.loader_event_id,
                            value.parent_region_instance_id,
                        )
                        for value in delta.regions
                    ),
                )
                for value in delta.regions:
                    _queue_candidate_range(
                        connection,
                        physical_start=value.destination_physical_start,
                        physical_end_exclusive=value.destination_physical_end_exclusive,
                        reason="region-lifetime",
                        ledger_ordinal=next_ordinal,
                    )
                connection.executemany(
                    "INSERT INTO sampled_pc_context VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (
                        (
                            delta.session_id,
                            value.sample_id,
                            value.sequence,
                            value.bridge_sequence,
                            value.frame,
                            value.live_pc,
                            value.physical_pc,
                            value.opcode_u32,
                            value.region_instance_id,
                            value.function_id,
                            value.z64_offset,
                            value.mapping_status,
                            canonical_json(value.payload),
                        )
                        for value in delta.sampled_pcs
                    ),
                )
                connection.executemany(
                    "INSERT INTO semantic_marker_context VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
                    (
                        (
                            delta.session_id,
                            value.marker_id,
                            value.marker_type,
                            value.marker_source,
                            value.confidence,
                            value.label,
                            value.note,
                            value.start_sequence,
                            value.end_sequence,
                            value.start_frame,
                            value.end_frame,
                            value.created_utc,
                        )
                        for value in delta.semantic_markers
                    ),
                )
                for window in delta.marker_context_windows:
                    connection.execute(
                        "INSERT INTO marker_context_window VALUES(?,?,?,?,?,?,?,?,?)",
                        (
                            delta.session_id,
                            window.marker_id,
                            window.status,
                            window.completion_bridge_sequence,
                            window.requested_before_count,
                            window.requested_after_count,
                            window.retained_before_count,
                            window.retained_after_count,
                            window.limitation_text,
                        ),
                    )
                    connection.executemany(
                        "INSERT INTO marker_execution_context_record "
                        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
                        (
                            (
                                delta.session_id,
                                window.marker_id,
                                record.local_order,
                                record.side,
                                record.frame,
                                record.live_pc,
                                record.physical_address,
                                record.opcode_u32,
                                int(record.previous_valid),
                                record.previous_live_pc,
                                record.previous_physical_address,
                                record.previous_opcode_u32,
                            )
                            for record in window.records
                        ),
                    )

            connection.executemany(
                """
                INSERT INTO controller_transition VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    (
                        delta.session_id,
                        value.bridge_sequence,
                        value.frame,
                        value.end_bridge_sequence_exclusive,
                        value.end_frame_exclusive,
                        value.controller,
                        value.state_u32,
                        value.buttons_u32,
                        value.stick_x,
                        value.stick_y,
                        int(value.injected_by_bridge),
                        value.capture_phase,
                    )
                    for value in delta.controller_transitions
                ),
            )
            connection.executemany(
                "INSERT INTO unresolved_observation VALUES(?,?,?,?,?,?)",
                (
                    (
                        delta.session_id,
                        value.local_unresolved_id,
                        value.kind,
                        value.sequence,
                        value.frame,
                        canonical_json(value.payload),
                    )
                    for value in delta.unresolved
                ),
            )
            if has_context_schema:
                connection.executemany(
                    "INSERT INTO unresolved_index VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (
                        _typed_unresolved_row(delta.session_id, value)
                        for value in delta.unresolved
                    ),
                )

                candidate_count, candidate_functions = _process_candidate_queue(
                    connection,
                    rom=rom,
                    ledger_ordinal=next_ordinal,
                )
                new_counts["mappingCandidates"] = candidate_count
                affected_functions.update(candidate_functions)
                frames = [
                    frame
                    for frame in (
                        *(item.frame for item in delta.instructions),
                        *(item.frame for item in delta.edges),
                        *(item.frame for item in delta.sampled_pcs),
                        *(item.first_frame for item in delta.regions),
                        *(item.last_observed_frame for item in delta.regions),
                    )
                    if frame is not None
                ]
                limitations = delta.context_limitations or (
                    "Historical known execution suppressed by the persistent frontier cannot "
                    "be recreated; only emitted events and saved samples are retained.",
                )
                connection.execute(
                    "INSERT INTO session_catalog VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (
                        delta.session_id,
                        delta.capture_identity,
                        delta.protocol_version,
                        delta.bridge_epoch,
                        delta.bridge_sequence_start,
                        delta.bridge_sequence_end,
                        min(frames) if frames else None,
                        max(frames) if frames else None,
                        len(delta.instructions),
                        len(delta.edges),
                        len(delta.sampled_pcs),
                        len(delta.semantic_markers),
                        len(delta.regions),
                        "emitted-events-and-saved-samples",
                        " ".join(limitations),
                    ),
                )
                if delta.known_activity is not None:
                    activity = delta.known_activity
                    connection.execute(
                        "INSERT INTO known_activity_summary VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        (
                            delta.session_id,
                            activity.frontier_identity,
                            activity.frontier_format_version,
                            activity.instruction_max_ordinal,
                            activity.instruction_hit_count,
                            activity.instruction_hit_bitmap,
                            activity.edge_max_ordinal,
                            activity.edge_hit_count,
                            activity.edge_hit_bitmap,
                            activity.dma_max_ordinal,
                            activity.dma_hit_count,
                            activity.dma_hit_bitmap,
                            activity.bridge_sequence,
                            activity.capture_phase,
                        ),
                    )

            if _test_fail_after_stage == "facts":
                raise RuntimeError("injected knowledge-ingestion failure after facts")

            for destination in affected_destinations:
                _refresh_destination(connection, *destination)
            for function_id in affected_functions:
                _refresh_function(connection, function_id)

            page_count = int(
                connection.execute("SELECT COUNT(*) FROM frontier_page_bitmap").fetchone()[0]
            )
            instruction_count = int(
                connection.execute("SELECT COUNT(*) FROM instruction_fact").fetchone()[0]
            )
            edge_count = int(
                connection.execute(
                    "SELECT COUNT(*) FROM edge_fact "
                    "WHERE edge_kind='native-exact-instruction-transition'"
                ).fetchone()[0]
            )
            frontier_id = _frontier_identity(
                meta["databaseId"],
                next_ordinal,
                page_count,
                instruction_count,
                edge_count,
            )
            now = utc_now()
            connection.execute(
                """
                UPDATE frontier_state SET format_version=?,frontier_identity=?,database_revision=?,
                    ledger_ordinal=?,physical_page_count=?,instruction_count=?,
                    edge_count=?,generated_utc=? WHERE singleton=1
                """,
                (
                    FRONTIER_FORMAT_VERSION,
                    frontier_id,
                    next_ordinal,
                    next_ordinal,
                    page_count,
                    instruction_count,
                    edge_count,
                    now,
                ),
            )
            delta_summary = {
                "schema": "ob64-total-resolver-session-delta-summary.v2",
                "newFacts": new_counts,
                "observed": {
                    "pageGenerationContexts": len(delta.code_pages),
                    "instructions": len(delta.instructions),
                    "edges": len(delta.edges),
                    "dmaPlacements": len(delta.dma_placements),
                    "functionPlacements": len(delta.function_placements),
                    "controllerTransitions": len(delta.controller_transitions),
                    "unresolved": len(delta.unresolved),
                    "regionLifetimes": len(delta.regions),
                    "sampledPcs": len(delta.sampled_pcs),
                    "semanticMarkers": len(delta.semantic_markers),
                    "knownActivitySummaries": int(delta.known_activity is not None),
                    "knownInstructionHits": (
                        delta.known_activity.instruction_hit_count
                        if delta.known_activity is not None
                        else 0
                    ),
                    "knownEdgeHits": (
                        delta.known_activity.edge_hit_count
                        if delta.known_activity is not None
                        else 0
                    ),
                    "knownDmaHits": (
                        delta.known_activity.dma_hit_count
                        if delta.known_activity is not None
                        else 0
                    ),
                    "markerContextWindows": len(delta.marker_context_windows),
                    "markerContextRecords": sum(
                        len(window.records) for window in delta.marker_context_windows
                    ),
                    **dict(sorted(delta.contextual_counts.items())),
                },
                "frontierAfter": frontier_id,
            }
            for name, (table, _columns) in MATERIALIZATION_TABLES.items():
                row_count = int(
                    connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
                )
                connection.execute(
                    "UPDATE materialization_state SET last_ledger_ordinal=?,"
                    "row_count=?,updated_utc=? WHERE materialization=?",
                    (next_ordinal, row_count, now, name),
                )

            if _test_fail_after_stage == "materialization":
                raise RuntimeError("injected knowledge-ingestion failure after materialization")

            # The successful ledger row is the final write in the transaction.
            connection.execute(
                """
                INSERT INTO ingestion_ledger(
                    ledger_ordinal,session_id,capture_reference,raw_manifest_reference,
                    capture_schema_version,protocol_version,frontier_format_version,
                    frontier_identity_at_start,rom_normalized_sha256,bridge_epoch,
                    bridge_sequence_start,bridge_sequence_end,source_capture_path,
                    source_product_path,source_product_reference,status,ingested_utc,
                    delta_summary_json
                ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    next_ordinal,
                    delta.session_id,
                    delta.capture_identity,
                    delta.raw_manifest_reference,
                    delta.capture_schema_version,
                    delta.protocol_version,
                    FRONTIER_FORMAT_VERSION,
                    delta.frontier_identity_at_start,
                    delta.rom_normalized_sha256,
                    delta.bridge_epoch,
                    delta.bridge_sequence_start,
                    delta.bridge_sequence_end,
                    delta.source_capture_path,
                    delta.source_product_path,
                    delta.source_product_reference,
                    "ingested",
                    now,
                    canonical_json(delta_summary),
                ),
            )
            connection.commit()
        except Exception:
            connection.rollback()
            raise
    finally:
        connection.close()
    return {
        "result": "PASS",
        "action": "ingested",
        "sessionId": delta.session_id,
        "captureIdentity": delta.capture_identity,
        "delta": delta_summary,
        "knowledge": knowledge_status(path),
    }


def _expected_materializations(
    connection: sqlite3.Connection,
) -> dict[str, list[tuple[Any, ...]]]:
    overlay = [
        tuple(row)
        for row in connection.execute(
            """
            WITH session_counts AS (
                SELECT p.destination_physical_start AS start,
                       p.destination_physical_end_exclusive AS end,
                       COUNT(DISTINCT w.session_id) AS sessions
                FROM dma_placement p
                JOIN dma_session_witness w ON w.dma_placement_id=p.dma_placement_id
                GROUP BY start,end
            )
            SELECT p.destination_physical_start,p.destination_physical_end_exclusive,
                   COUNT(*),COUNT(DISTINCT p.content_id),SUM(p.observation_count),
                   COALESCE(s.sessions,0)
            FROM dma_placement p
            LEFT JOIN session_counts s
              ON s.start=p.destination_physical_start
             AND s.end=p.destination_physical_end_exclusive
            GROUP BY p.destination_physical_start,p.destination_physical_end_exclusive
            ORDER BY p.destination_physical_start,p.destination_physical_end_exclusive
            """
        )
    ]
    runtime = [
        tuple(row)
        for row in connection.execute(
            """
            WITH
            instruction_counts AS (
                SELECT function_id,COUNT(*) AS count FROM instruction_fact
                WHERE function_id IS NOT NULL GROUP BY function_id
            ),
            incoming_edges AS (
                SELECT i.function_id,COUNT(*) AS count FROM edge_fact e
                JOIN instruction_fact i ON i.instruction_id=e.destination_instruction_id
                WHERE i.function_id IS NOT NULL GROUP BY i.function_id
            ),
            outgoing_edges AS (
                SELECT i.function_id,COUNT(*) AS count FROM edge_fact e
                JOIN instruction_fact i ON i.instruction_id=e.source_instruction_id
                WHERE i.function_id IS NOT NULL GROUP BY i.function_id
            ),
            incoming_calls AS (
                SELECT callee_function_id AS function_id,COUNT(*) AS count
                FROM call_fact GROUP BY callee_function_id
            ),
            outgoing_calls AS (
                SELECT caller_function_id AS function_id,COUNT(*) AS count
                FROM call_fact GROUP BY caller_function_id
            ),
            execution_sessions AS (
                SELECT i.function_id,COUNT(DISTINCT s.session_id) AS count
                FROM instruction_session s
                JOIN instruction_fact i ON i.instruction_id=s.instruction_id
                WHERE i.function_id IS NOT NULL GROUP BY i.function_id
            )
            SELECT f.function_id,
                   COALESCE(ic.count,0),COALESCE(ie.count,0),COALESCE(oe.count,0),
                   COALESCE(cic.count,0),COALESCE(coc.count,0),COALESCE(es.count,0)
            FROM static_function f
            LEFT JOIN instruction_counts ic ON ic.function_id=f.function_id
            LEFT JOIN incoming_edges ie ON ie.function_id=f.function_id
            LEFT JOIN outgoing_edges oe ON oe.function_id=f.function_id
            LEFT JOIN incoming_calls cic ON cic.function_id=f.function_id
            LEFT JOIN outgoing_calls coc ON coc.function_id=f.function_id
            LEFT JOIN execution_sessions es ON es.function_id=f.function_id
            ORDER BY f.function_id
            """
        )
    ]
    placements = {
        int(row[0]): int(row[1])
        for row in connection.execute(
            "SELECT function_id,COUNT(*) FROM function_placement_fact GROUP BY function_id"
        )
    }
    resolver: list[tuple[Any, ...]] = []
    for row in runtime:
        function_id = int(row[0])
        placement_count = placements.get(function_id, 0)
        instruction_count = int(row[1])
        edge_count = int(row[2]) + int(row[3])
        call_count = int(row[4]) + int(row[5])
        coverage = (
            "placed-and-executed"
            if placement_count and instruction_count
            else "placed-not-executed"
            if placement_count
            else "executed-unplaced"
            if instruction_count
            else "never-observed"
        )
        resolver.append(
            (
                function_id,
                placement_count,
                instruction_count,
                edge_count,
                call_count,
                coverage,
            )
        )
    return {
        "overlay-atlas": overlay,
        "runtime-provenance": runtime,
        "total-resolver": resolver,
    }


_NONCANONICAL_EQUIVALENCE_COLUMNS = {
    # A rebuild regenerates derived products under a new output path and records
    # the current frontier format. These fields are bookkeeping/diagnostics, not
    # the stable session identity or canonical machine facts. Stable ledger
    # fields (session/capture identity, protocol, ROM, epoch, sequence range,
    # and starting frontier) remain in the exact comparison.
    "ingestion_ledger": {
        "raw_manifest_reference",
        "frontier_format_version",
        "source_capture_path",
        "source_product_path",
        "source_product_reference",
        "ingested_utc",
        "delta_summary_json",
    },
    "materialization_state": {"updated_utc"},
    "frontier_state": {"generated_utc"},
    "source_registry": {"registered_utc"},
    "selected_source": {"selected_utc"},
}


def _table_projection(
    connection: sqlite3.Connection, table: str
) -> tuple[str, tuple[str, ...]]:
    excluded = _NONCANONICAL_EQUIVALENCE_COLUMNS.get(table, set())
    columns = tuple(
        str(row[1])
        for row in connection.execute(f"PRAGMA table_info({table})")
        if str(row[1]) not in excluded
    )
    return (
        f"SELECT {','.join(columns)} FROM {table} ORDER BY {','.join(columns)}",
        columns,
    )


def compare_knowledge_databases(left: Path, right: Path) -> dict[str, Any]:
    """Compare canonical rows directly; no digest is an equality oracle."""

    left_connection = open_knowledge_database(left, read_only=True)
    right_connection = open_knowledge_database(right, read_only=True)
    mismatches: list[str] = []
    counts: dict[str, int] = {}
    try:
        tables = [
            str(row[0])
            for row in left_connection.execute(
                "SELECT name FROM sqlite_schema WHERE type='table' "
                "AND name NOT LIKE 'sqlite_%' ORDER BY name"
            )
        ]
        right_tables = [
            str(row[0])
            for row in right_connection.execute(
                "SELECT name FROM sqlite_schema WHERE type='table' "
                "AND name NOT LIKE 'sqlite_%' ORDER BY name"
            )
        ]
        if tables != right_tables:
            mismatches.append("table-set")
        for table in tables:
            if table not in right_tables:
                continue
            if table == "knowledge_meta":
                excluded_meta = {"createdUtc"}
                left_rows = [
                    tuple(row)
                    for row in left_connection.execute(
                        "SELECT key,value FROM knowledge_meta ORDER BY key"
                    )
                    if str(row[0]) not in excluded_meta
                ]
                right_rows = [
                    tuple(row)
                    for row in right_connection.execute(
                        "SELECT key,value FROM knowledge_meta ORDER BY key"
                    )
                    if str(row[0]) not in excluded_meta
                ]
            else:
                query, columns = _table_projection(left_connection, table)
                right_query, right_columns = _table_projection(right_connection, table)
                if columns != right_columns:
                    mismatches.append(f"{table}:columns")
                    continue
                left_rows = [tuple(row) for row in left_connection.execute(query)]
                right_rows = [tuple(row) for row in right_connection.execute(right_query)]
            counts[table] = len(left_rows)
            if left_rows != right_rows:
                mismatches.append(table)
    finally:
        left_connection.close()
        right_connection.close()
    return {
        "schema": "ob64-total-resolver-exact-database-equivalence.v1",
        "equivalent": not mismatches,
        "mismatchedTables": mismatches,
        "tableRowCounts": counts,
    }


SCHEMA2_CANONICAL_TABLES = (
    "static_function",
    "ingestion_ledger",
    "exact_content",
    "page_generation_witness",
    "instruction_fact",
    "instruction_session",
    "instruction_generation_witness",
    "frontier_page_bitmap",
    "edge_fact",
    "edge_session",
    "edge_generation_witness",
    "call_fact",
    "dma_placement",
    "dma_session_witness",
    "function_placement_fact",
    "function_placement_session",
    "controller_transition",
    "unresolved_observation",
    "atlas_destination_materialized",
    "runtime_function_materialized",
    "resolver_function_materialized",
    "materialization_state",
    "frontier_state",
)


def compare_canonical_machine_facts(left: Path, right: Path) -> dict[str, Any]:
    """Compare the schema-2 canonical foundation across schema versions."""

    left_connection = open_knowledge_database(left, read_only=True)
    right_connection = open_knowledge_database(right, read_only=True)
    mismatches: list[str] = []
    counts: dict[str, int] = {}
    try:
        for table in SCHEMA2_CANONICAL_TABLES:
            if table == "frontier_state":
                # Wire-format and generation time are migration bookkeeping. The
                # identity, ledger ordinal, ROM, and exact fact counts are the
                # cross-schema preservation claim.
                columns = (
                    "singleton",
                    "frontier_identity",
                    "database_revision",
                    "ledger_ordinal",
                    "physical_page_count",
                    "instruction_count",
                    "edge_count",
                )
                projection = ",".join(columns)
                left_query = f"SELECT {projection} FROM frontier_state ORDER BY singleton"
                right_query = left_query
                left_columns = right_columns = columns
            else:
                left_query, left_columns = _table_projection(left_connection, table)
                right_query, right_columns = _table_projection(right_connection, table)
            if left_columns != right_columns:
                mismatches.append(f"{table}:columns")
                continue
            left_rows = [tuple(row) for row in left_connection.execute(left_query)]
            right_rows = [tuple(row) for row in right_connection.execute(right_query)]
            counts[table] = len(left_rows)
            if left_rows != right_rows:
                mismatches.append(table)
        ignored_meta = {
            "schema",
            "schemaVersion",
            "createdUtc",
            "activeBridgeProtocolVersion",
            "frontierFormatVersion",
        }
        left_meta = {
            str(row[0]): str(row[1])
            for row in left_connection.execute("SELECT key,value FROM knowledge_meta")
            if str(row[0]) not in ignored_meta
        }
        right_meta = {
            str(row[0]): str(row[1])
            for row in right_connection.execute("SELECT key,value FROM knowledge_meta")
            if str(row[0]) not in ignored_meta
        }
        for key, value in left_meta.items():
            if right_meta.get(key) != value:
                mismatches.append(f"knowledge_meta:{key}")
    finally:
        left_connection.close()
        right_connection.close()
    return {
        "schema": "ob64-total-resolver-canonical-fact-equivalence.v1",
        "equivalent": not mismatches,
        "mismatchedTables": mismatches,
        "tableRowCounts": counts,
        "contextTablesCompared": False,
    }


def knowledge_logical_identity(path: Path) -> dict[str, Any]:
    """Compatibility summary. It intentionally contains no logical hash."""

    connection = open_knowledge_database(path, read_only=True)
    try:
        counts = {
            str(row[0]): int(
                connection.execute(f"SELECT COUNT(*) FROM {str(row[0])}").fetchone()[0]
            )
            for row in connection.execute(
                "SELECT name FROM sqlite_schema WHERE type='table' "
                "AND name NOT LIKE 'sqlite_%' ORDER BY name"
            )
        }
        return {
            "schema": "ob64-total-resolver-knowledge-logical-summary.v2",
            "database": str(path.resolve()),
            "comparisonMethod": "direct-exact-row-comparison",
            "tableRowCounts": counts,
        }
    finally:
        connection.close()


def verify_knowledge_database(path: Path) -> dict[str, Any]:
    """Verify exact keys, checkpoints, and derived rows without hash proof."""

    checks: list[dict[str, Any]] = []

    def check(name: str, passed: bool, detail: str) -> None:
        checks.append({"name": name, "status": "PASS" if passed else "FAIL", "detail": detail})

    connection = open_knowledge_database(path, read_only=True)
    try:
        meta = _require_knowledge_schema(connection)
        check(
            "evidence-and-mutation-boundary",
            meta.get("dynamicReviewState") == "live-unreviewed"
            and meta.get("captureAuthority") == "observation-only",
            f"{meta.get('dynamicReviewState')}/{meta.get('captureAuthority')}",
        )
        check(
            "active-bridge-protocol",
            meta.get("activeBridgeProtocolVersion") == BRIDGE_PROTOCOL_VERSION,
            f"database {meta.get('activeBridgeProtocolVersion')}; "
            f"required {BRIDGE_PROTOCOL_VERSION}",
        )
        ledger_protocols = {
            str(row[0])
            for row in connection.execute(
                "SELECT DISTINCT protocol_version FROM ingestion_ledger"
            )
        }
        unsupported_ledger_protocols = sorted(
            ledger_protocols.difference(SUPPORTED_INGEST_PROTOCOL_VERSIONS)
        )
        accepted_ledger_protocols = [
            version
            for version in SUPPORTED_INGEST_PROTOCOL_VERSIONS
            if version in ledger_protocols
        ]
        check(
            "ledger-protocol-compatibility",
            not unsupported_ledger_protocols,
            (
                "accepted " + ", ".join(accepted_ledger_protocols)
                if not unsupported_ledger_protocols
                else "unsupported " + ", ".join(unsupported_ledger_protocols)
            ),
        )
        health = str(connection.execute("PRAGMA quick_check").fetchone()[0])
        check("sqlite-health", health == "ok", health)
        foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
        check("foreign-keys", not foreign_keys, f"{len(foreign_keys)} violation(s)")

        opcode_errors = sum(
            bytes(row[1]) != int(row[0]).to_bytes(4, "big")
            for row in connection.execute(
                "SELECT opcode_u32,opcode_bytes FROM instruction_fact"
            )
        )
        check("instruction-exact-opcodes", opcode_errors == 0, f"{opcode_errors} mismatch(es)")

        rom: bytes | None = None
        try:
            rom = read_normalized_rom(Path(meta["romPath"]))
        except (OSError, ValueError) as exc:
            check("instruction-rom-mappings", False, f"ROM unavailable: {exc}")
        else:
            mapping_byte_errors = 0
            mapping_range_errors = 0
            mapped_rows = connection.execute(
                """
                SELECT i.opcode_bytes,i.z64_offset,i.function_id,
                       f.z64_start,f.z64_end_exclusive
                FROM instruction_fact i
                LEFT JOIN static_function f ON f.function_id=i.function_id
                WHERE i.z64_offset IS NOT NULL OR i.function_id IS NOT NULL
                """
            ).fetchall()
            for row in mapped_rows:
                z64_offset = None if row[1] is None else int(row[1])
                if (
                    z64_offset is None
                    or rom[z64_offset : z64_offset + 4] != bytes(row[0])
                ):
                    mapping_byte_errors += 1
                if row[2] is not None and (
                    row[3] is None
                    or row[4] is None
                    or z64_offset is None
                    or not int(row[3]) <= z64_offset < int(row[4])
                ):
                    mapping_range_errors += 1
            check(
                "instruction-rom-mappings",
                mapping_byte_errors == 0 and mapping_range_errors == 0,
                f"{len(mapped_rows)} mapped row(s); "
                f"{mapping_byte_errors} opcode mismatch(es); "
                f"{mapping_range_errors} function-range mismatch(es)",
            )

        bitmap_expected: dict[int, bytearray] = {}
        for row in connection.execute("SELECT physical_address FROM instruction_fact"):
            address = int(row[0])
            page = address & ~0xFFF
            bitmap = bitmap_expected.setdefault(page, bytearray(128))
            slot = (address & 0xFFF) // 4
            bitmap[slot >> 3] |= 1 << (slot & 7)
        bitmap_actual = {
            int(row[0]): bytes(row[1])
            for row in connection.execute(
                "SELECT physical_page_start,instruction_bitmap FROM frontier_page_bitmap"
            )
        }
        check(
            "frontier-page-bitmaps",
            bitmap_actual == {key: bytes(value) for key, value in bitmap_expected.items()},
            f"{len(bitmap_actual)} physical page(s)",
        )

        state = connection.execute("SELECT * FROM frontier_state WHERE singleton=1").fetchone()
        assert state is not None
        pages = len(bitmap_actual)
        instructions = int(
            connection.execute("SELECT COUNT(*) FROM instruction_fact").fetchone()[0]
        )
        edges = int(
            connection.execute(
                "SELECT COUNT(*) FROM edge_fact "
                "WHERE edge_kind='native-exact-instruction-transition'"
            ).fetchone()[0]
        )
        maximum_ordinal = int(
            connection.execute(
                "SELECT COALESCE(MAX(ledger_ordinal),0) FROM ingestion_ledger"
            ).fetchone()[0]
        )
        expected_frontier = _frontier_identity(
            meta["databaseId"], maximum_ordinal, pages, instructions, edges
        )
        frontier_ok = (
            int(state["format_version"]) == FRONTIER_FORMAT_VERSION
            and str(state["frontier_identity"]) == expected_frontier
            and int(state["database_revision"]) == maximum_ordinal
            and int(state["ledger_ordinal"]) == maximum_ordinal
            and (
                int(state["physical_page_count"]),
                int(state["instruction_count"]),
                int(state["edge_count"]),
            )
            == (pages, instructions, edges)
        )
        check("frontier-checkpoint", frontier_ok, expected_frontier)

        expected = _expected_materializations(connection)
        for name, expected_rows in expected.items():
            table, columns = MATERIALIZATION_TABLES[name]
            actual_rows = [
                tuple(row)
                for row in connection.execute(
                    f"SELECT {','.join(columns)} FROM {table} "
                    f"ORDER BY {','.join(columns)}"
                )
            ]
            check(
                f"materialization-{name}",
                actual_rows == expected_rows,
                f"{len(actual_rows)} exact row(s)",
            )
            materialized_state = connection.execute(
                "SELECT last_ledger_ordinal,row_count FROM materialization_state "
                "WHERE materialization=?",
                (name,),
            ).fetchone()
            checkpoint_ok = (
                materialized_state is not None
                and int(materialized_state[0]) == maximum_ordinal
                and int(materialized_state[1]) == len(actual_rows)
            )
            check(
                f"materialization-{name}-checkpoint",
                checkpoint_ok,
                f"ledger {maximum_ordinal}; rows {len(actual_rows)}",
            )
        if int(meta["schemaVersion"]) >= 3:
            ledger_count = int(
                connection.execute("SELECT COUNT(*) FROM ingestion_ledger").fetchone()[0]
            )
            catalog_count = int(
                connection.execute("SELECT COUNT(*) FROM session_catalog").fetchone()[0]
            )
            catalog_disagreements = int(
                connection.execute(
                    "SELECT COUNT(*) FROM session_catalog c JOIN ingestion_ledger l "
                    "ON l.session_id=c.session_id WHERE "
                    "c.capture_reference<>l.capture_reference OR "
                    "c.protocol_version<>l.protocol_version OR c.bridge_epoch<>l.bridge_epoch OR "
                    "c.bridge_sequence_start<>l.bridge_sequence_start OR "
                    "c.bridge_sequence_end<>l.bridge_sequence_end"
                ).fetchone()[0]
            )
            check(
                "context-session-catalog",
                catalog_count == ledger_count and catalog_disagreements == 0,
                f"{catalog_count}/{ledger_count} rows; {catalog_disagreements} disagreement(s)",
            )
            unresolved_count = int(
                connection.execute("SELECT COUNT(*) FROM unresolved_observation").fetchone()[0]
            )
            unresolved_index_count = int(
                connection.execute("SELECT COUNT(*) FROM unresolved_index").fetchone()[0]
            )
            check(
                "typed-unresolved-index",
                unresolved_count == unresolved_index_count,
                f"{unresolved_index_count}/{unresolved_count} indexed row(s)",
            )
            queued = int(
                connection.execute(
                    "SELECT COUNT(*) FROM candidate_recalculation_queue WHERE status='queued'"
                ).fetchone()[0]
            )
            check(
                "candidate-recalculation-checkpoint",
                queued == 0,
                f"{queued} queued range(s)",
            )
            candidate_byte_errors = 0
            if rom is not None:
                for row in connection.execute(
                    "SELECT i.opcode_bytes,c.z64_offset FROM instruction_mapping_candidate c "
                    "JOIN instruction_fact i ON i.instruction_id=c.instruction_id"
                ):
                    offset = int(row[1])
                    candidate_byte_errors += int(
                        rom[offset : offset + 4] != bytes(row[0])
                    )
            check(
                "candidate-exact-bytes",
                rom is not None and candidate_byte_errors == 0,
                f"{candidate_byte_errors} mismatch(es)",
            )
            bad_live_candidates = int(
                connection.execute(
                    "SELECT COUNT(*) FROM instruction_mapping_candidate "
                    "WHERE candidate_state='uniquely-resolved-live-mapping' "
                    "AND region_instance_id IS NULL"
                ).fetchone()[0]
            )
            check(
                "candidate-promotion-boundary",
                bad_live_candidates == 0,
                f"{bad_live_candidates} context-free live mapping(s)",
            )
            if _table_exists(connection, "known_activity_summary"):
                activity_rows = list(
                    connection.execute(
                        "SELECT a.*,l.frontier_identity_at_start,l.protocol_version,"
                        "l.bridge_sequence_start,l.bridge_sequence_end "
                        "FROM known_activity_summary a JOIN ingestion_ledger l "
                        "ON l.session_id=a.session_id ORDER BY a.session_id"
                    )
                )
                current_ledger_count = int(
                    connection.execute(
                        "SELECT COUNT(*) FROM ingestion_ledger WHERE protocol_version=?",
                        (BRIDGE_PROTOCOL_VERSION,),
                    ).fetchone()[0]
                )
                activity_errors = 0
                for row in activity_rows:
                    observation = KnownActivityObservation(
                        str(row["frontier_identity"]),
                        int(row["frontier_format_version"]),
                        int(row["bridge_sequence"]),
                        int(row["instruction_max_ordinal"]),
                        int(row["instruction_hit_count"]),
                        bytes(row["instruction_hit_bitmap"]),
                        int(row["edge_max_ordinal"]),
                        int(row["edge_hit_count"]),
                        bytes(row["edge_hit_bitmap"]),
                        int(row["dma_max_ordinal"]),
                        int(row["dma_hit_count"]),
                        bytes(row["dma_hit_bitmap"]),
                        str(row["capture_phase"]),
                    )
                    if (
                        observation.frontier_identity
                        != str(row["frontier_identity_at_start"])
                        or not int(row["bridge_sequence_start"])
                        <= observation.bridge_sequence
                        < int(row["bridge_sequence_end"])
                    ):
                        activity_errors += 1
                    try:
                        _validate_activity_fact_ordinals(connection, observation)
                    except ValueError:
                        activity_errors += 1
                check(
                    "known-activity-summaries",
                    activity_errors == 0
                    and len(activity_rows) == current_ledger_count,
                    f"{len(activity_rows)} summary row(s); "
                    f"{current_ledger_count} current-protocol session(s); "
                    f"{activity_errors} invalid row(s)",
                )
            if _table_exists(connection, "marker_context_window"):
                marker_context_errors = 0
                windows = list(
                    connection.execute(
                        "SELECT w.*,m.marker_id AS known_marker FROM marker_context_window w "
                        "LEFT JOIN semantic_marker_context m ON m.session_id=w.session_id "
                        "AND m.marker_id=w.marker_id ORDER BY w.session_id,w.marker_id"
                    )
                )
                for window in windows:
                    records = list(
                        connection.execute(
                            "SELECT local_order,side FROM marker_execution_context_record "
                            "WHERE session_id=? AND marker_id=? ORDER BY local_order",
                            (window["session_id"], window["marker_id"]),
                        )
                    )
                    before = int(window["retained_before_count"])
                    after = int(window["retained_after_count"])
                    orders = [int(record[0]) for record in records]
                    if (
                        window["known_marker"] is None
                        or len(records) != before + after
                        or (
                            orders
                            and orders != list(range(orders[0], orders[0] + len(orders)))
                        )
                        or any(
                            str(record[1])
                            != ("before" if index < before else "after")
                            for index, record in enumerate(records)
                        )
                        or (str(window["status"]) == "incomplete" and records)
                    ):
                        marker_context_errors += 1
                check(
                    "marker-execution-context",
                    marker_context_errors == 0,
                    f"{len(windows)} window(s); {marker_context_errors} invalid window(s)",
                )
    finally:
        connection.close()
    return {
        "result": "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL",
        "database": str(path.resolve()),
        "checks": checks,
        "logicalSummary": knowledge_logical_identity(path),
    }
