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
from .inventory import load_inventory, repository_root
from .protocol import BRIDGE_PROTOCOL_VERSION, FRONTIER_FORMAT_VERSION
from .schema import utc_now
from .static_model import StaticModel


KNOWLEDGE_SCHEMA = "ob64-total-resolver-knowledge.v2"
KNOWLEDGE_SCHEMA_VERSION = 2

# Live capture is intentionally exact-version only, but a deterministic knowledge
# rebuild must remain able to replay every protocol already admitted to the
# persistent ledger. Protocol 0.7.x predates the accepted ordering/evidence
# contract and is deliberately excluded.
HISTORICAL_INGEST_PROTOCOL_VERSIONS = (
    "0.8.0",
    "0.9.0",
    "0.10.0",
    "0.11.0",
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
    # Schema v2 is built beside the historical v1 product. Selection changes
    # only after migration and verification succeed.
    return (
        repository_root()
        / "build"
        / "total-resolver"
        / "knowledge"
        / "total-resolver-v2.sqlite"
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


@dataclass(frozen=True)
class FrontierPage:
    physical_page_start: int
    instruction_bitmap: bytes


@dataclass(frozen=True)
class FrontierInstruction:
    physical_page_start: int
    slot: int
    opcode_u32: int


@dataclass(frozen=True)
class FrontierEdge:
    source_physical_page_start: int
    source_slot: int
    source_opcode_u32: int
    destination_physical_page_start: int
    destination_slot: int
    destination_opcode_u32: int


@dataclass(frozen=True)
class FrontierDma:
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
            "schema": "ob64-total-resolver-novelty-frontier.v3",
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
    if version != KNOWLEDGE_SCHEMA_VERSION:
        raise ValueError(
            f"unsupported Total Resolver knowledge schema v{version}; "
            f"required v{KNOWLEDGE_SCHEMA_VERSION}"
        )
    meta = {
        str(row[0]): str(row[1])
        for row in connection.execute("SELECT key,value FROM knowledge_meta")
    }
    if meta.get("schema") != KNOWLEDGE_SCHEMA:
        raise ValueError("not a Total Resolver persistent knowledge database")
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
        now = utc_now()
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
    """Copy a schema-2 database and upgrade only its frontier wire-format checkpoint."""

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
        if state is None or int(state[0]) not in {2, FRONTIER_FORMAT_VERSION}:
            raise ValueError("source database has no migratable novelty frontier")
        target.parent.mkdir(parents=True, exist_ok=True)
        target_connection = sqlite3.connect(target)
        try:
            source_connection.backup(target_connection)
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
        "metadataMutation": "frontier format and active bridge protocol only",
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
            int(row[0]) & ~0xFFF,
            (int(row[0]) & 0xFFF) // 4,
            int(row[1]),
        )
        for row in connection.execute(
            "SELECT physical_address,opcode_u32 FROM instruction_fact "
            "ORDER BY physical_address,opcode_bytes"
        )
    )
    edges = tuple(
        FrontierEdge(
            int(row[0]) & ~0xFFF,
            (int(row[0]) & 0xFFF) // 4,
            int(row[1]),
            int(row[2]) & ~0xFFF,
            (int(row[2]) & 0xFFF) // 4,
            int(row[3]),
        )
        for row in connection.execute(
            """
            SELECT si.physical_address,si.opcode_u32,
                   di.physical_address,di.opcode_u32
            FROM edge_fact e
            JOIN instruction_fact si ON si.instruction_id=e.source_instruction_id
            JOIN instruction_fact di ON di.instruction_id=e.destination_instruction_id
            WHERE e.edge_kind='native-exact-instruction-transition'
            ORDER BY si.physical_address,si.opcode_bytes,
                     di.physical_address,di.opcode_bytes
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
            bytes(row[5]),
        )
        for row in connection.execute(
            """
            SELECT DISTINCT p.source_start,p.source_end_exclusive,
                   p.destination_physical_start,p.destination_physical_end_exclusive,
                   p.matched_length,c.content_bytes
            FROM dma_placement p
            JOIN exact_content c ON c.content_id=p.content_id
            WHERE p.source_domain='cartridge-rom'
              AND p.matched_length=c.byte_size
            ORDER BY p.source_start,p.source_end_exclusive,
                     p.destination_physical_start,p.destination_physical_end_exclusive,
                     p.matched_length,c.content_bytes
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
            output.write(b"OB64TRF3")
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
                if not 0 <= physical < RDRAM_SIZE or physical & 3:
                    raise ValueError("frontier instruction is outside 4 MiB RDRAM")
                output.write(struct.pack("<II", physical, int(item.opcode_u32)))
            for edge in frontier.edges:
                source = int(edge.source_physical_page_start) + int(edge.source_slot) * 4
                destination_address = (
                    int(edge.destination_physical_page_start) + int(edge.destination_slot) * 4
                )
                output.write(
                    struct.pack(
                        "<IIII",
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
                    or len(content)
                    != item.destination_physical_end_exclusive
                    - item.destination_physical_start
                    or len(content) != item.source_end_exclusive - item.source_start
                    or not 0 <= item.matched_length <= len(content)
                ):
                    raise ValueError("frontier DMA fact is not exact 4 MiB-compatible data")
                output.write(
                    struct.pack(
                        "<IIIIII",
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
        return {
            "schema": KNOWLEDGE_SCHEMA,
            "schemaVersion": KNOWLEDGE_SCHEMA_VERSION,
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
    if address & 3 or not 0 <= address <= 0x7FFFFC:
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
        if page.physical_page_start & 0xFFF or not 0 <= page.physical_page_start <= 0x7FF000:
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
        rom = read_normalized_rom(Path(meta["romPath"]))
        _validate_delta(delta, meta, rom)
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
                ensure_observation(
                    physical_address=item.physical_address,
                    opcode_u32=item.opcode_u32,
                    function_id=item.function_id,
                    z64_offset=item.z64_offset,
                    mapping_status=item.mapping_status,
                    bridge_sequence=item.bridge_sequence,
                    generation=item.native_generation,
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
    finally:
        connection.close()
    return {
        "result": "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL",
        "database": str(path.resolve()),
        "checks": checks,
        "logicalSummary": knowledge_logical_identity(path),
    }
