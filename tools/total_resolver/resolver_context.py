"""Read-only agent query surface over selected persistent Total Resolver knowledge.

The selected knowledge database is the only dynamic authority on this path.
Frozen static, resource, and field databases remain separate evidence lanes.
Historical generated Resolver products are opened only through the explicit
legacy helpers at the bottom of this module.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping, Sequence

from .addressing import physical_from_live
from .capture_db import load_event_payload
from .identities import read_normalized_rom
from .knowledge import open_knowledge_database, selected_knowledge_database
from .resolver import RESOLVER_SCHEMA
from .resolver_query import open_resolver
from .resolver_sources import (
    QuerySourcePaths,
    SourceIdentity,
    default_query_source_paths,
    open_readonly,
    validate_query_sources,
)
from .schema import open_capture_database


QUERY_SCHEMA = "ob64-total-resolver-agent-query.v1"
SOURCE_MANIFEST_SCHEMA = "ob64-total-resolver-query-source-manifest.v1"
MAX_QUERY_LIMIT = 100
DEFAULT_QUERY_LIMIT = 10
DEFAULT_PREVIEW_LIMIT = 3

INCLUDE_SECTIONS = frozenset(
    {
        "placements",
        "instructions",
        "edges",
        "calls",
        "sessions",
        "candidates",
        "unresolved",
        "fields",
        "resources",
        "controller",
        "markers",
        "samples",
        "all",
    }
)


def _row_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {key: row[key] for key in row.keys()}


def _table_exists(connection: sqlite3.Connection, table: str) -> bool:
    return (
        connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?", (table,)
        ).fetchone()
        is not None
    )


def _column_exists(connection: sqlite3.Connection, table: str, column: str) -> bool:
    return any(str(row[1]) == column for row in connection.execute(f"PRAGMA table_info({table})"))


def _bounded_limit(limit: int) -> int:
    if limit < 1 or limit > MAX_QUERY_LIMIT:
        raise ValueError(f"query limit must be between 1 and {MAX_QUERY_LIMIT}")
    return limit


def _normalize_includes(includes: Iterable[str] | None) -> frozenset[str]:
    values = frozenset(value.strip().casefold() for value in (includes or ()) if value.strip())
    unknown = values - INCLUDE_SECTIONS
    if unknown:
        raise ValueError(f"unsupported query include section: {sorted(unknown)[0]}")
    return INCLUDE_SECTIONS - {"all"} if "all" in values else values


def _parse_u32(value: int | str | None, label: str) -> int | None:
    if value is None:
        return None
    if isinstance(value, bool):
        raise ValueError(f"{label} must be an unsigned 32-bit integer")
    try:
        parsed = value if isinstance(value, int) else int(value, 0)
    except ValueError as exc:
        raise ValueError(f"{label} must be an unsigned 32-bit integer") from exc
    if not 0 <= parsed <= 0xFFFFFFFF:
        raise ValueError(f"{label} must be an unsigned 32-bit integer")
    return parsed


def _hex(value: int | None) -> str | None:
    return None if value is None else f"0x{value:08X}"


def _extract_mapping_payload(payload: Mapping[str, Any]) -> tuple[int | None, int | None]:
    physical: int | None = None
    opcode: int | None = None
    for key in ("physicalPc", "physicalAddress", "physical_address"):
        value = payload.get(key)
        if isinstance(value, int) and not isinstance(value, bool):
            physical = value
            break
        if isinstance(value, str):
            try:
                physical = int(value, 0)
            except ValueError:
                pass
            else:
                break
    for key in ("opcode", "opcodeU32", "opcode_u32"):
        value = payload.get(key)
        if isinstance(value, int) and not isinstance(value, bool):
            opcode = value
            break
        if isinstance(value, str):
            try:
                opcode = int(value, 0)
            except ValueError:
                pass
            else:
                break
    return physical, opcode


@dataclass
class ResolverContext:
    knowledge_path: Path
    knowledge: sqlite3.Connection
    static_path: Path
    static: sqlite3.Connection
    resource_path: Path
    resource: sqlite3.Connection
    field_product: Path
    field: sqlite3.Connection
    source_identities: tuple[SourceIdentity, ...]
    manifest: dict[str, Any]
    knowledge_meta: dict[str, str]
    _rom: bytes | None = None

    @classmethod
    def open(
        cls,
        knowledge_database: Path | None = None,
        *,
        static_database: Path | None = None,
        resource_database: Path | None = None,
        field_product: Path | None = None,
        expected_source_identities: Mapping[str, str] | None = None,
    ) -> "ResolverContext":
        selected = selected_knowledge_database()
        database = (knowledge_database or selected)
        if database is None:
            raise RuntimeError(
                "no persistent knowledge database is selected; a querying agent must not initialize one"
            )
        knowledge_path = Path(database).resolve()
        knowledge = open_knowledge_database(knowledge_path, read_only=True)
        static = resource = field = None
        try:
            meta = {
                str(row[0]): str(row[1])
                for row in knowledge.execute("SELECT key,value FROM knowledge_meta")
            }
            defaults = default_query_source_paths()
            source_paths = QuerySourcePaths(
                (static_database or Path(meta.get("staticDatabasePath", defaults.static_database))).resolve(),
                (resource_database or Path(meta.get("resourceDatabasePath", defaults.resource_database))).resolve(),
                (field_product or Path(meta.get("fieldProductPath", defaults.field_product))).resolve(),
            )
            identities = validate_query_sources(
                source_paths, expected_identities=expected_source_identities
            )
            static = open_readonly(source_paths.static_database)
            resource = open_readonly(source_paths.resource_database)
            field = open_readonly(source_paths.field_database)
            cls._validate_static_crosswalk(knowledge, static)

            frontier = knowledge.execute(
                "SELECT * FROM frontier_state WHERE singleton=1"
            ).fetchone()
            session_count = int(
                knowledge.execute("SELECT COUNT(*) FROM ingestion_ledger").fetchone()[0]
            )
            selected_path = selected.resolve() if selected is not None else None
            manifest = {
                "schema": SOURCE_MANIFEST_SCHEMA,
                "mode": "selected-knowledge",
                "freshness": "current",
                "historicalDynamicProductsUsed": False,
                "dynamic": {
                    "path": str(knowledge_path),
                    "selected": selected_path == knowledge_path,
                    "databaseId": meta["databaseId"],
                    "schema": meta["schema"],
                    "schemaVersion": int(meta["schemaVersion"]),
                    "reviewState": meta["dynamicReviewState"],
                    "evidenceBoundary": meta["dynamicEvidenceBoundary"],
                    "sessionCount": session_count,
                    "frontierIdentity": None if frontier is None else str(frontier["frontier_identity"]),
                    "ledgerOrdinal": 0 if frontier is None else int(frontier["ledger_ordinal"]),
                },
                "frozen": [
                    {
                        **identity.to_dict(),
                        "path": str(
                            source_paths.static_database
                            if identity.source_id == "static-db-r3"
                            else source_paths.resource_database
                            if identity.source_id == "resource-chain-static"
                            else source_paths.field_database
                        ),
                        "freshness": "identity-verified",
                    }
                    for identity in identities
                ],
            }
            return cls(
                knowledge_path,
                knowledge,
                source_paths.static_database,
                static,
                source_paths.resource_database,
                resource,
                source_paths.field_product,
                field,
                identities,
                manifest,
                meta,
            )
        except Exception:
            knowledge.close()
            for connection in (static, resource, field):
                if connection is not None:
                    connection.close()
            raise

    @staticmethod
    def _validate_static_crosswalk(
        knowledge: sqlite3.Connection, static: sqlite3.Connection
    ) -> None:
        dynamic_rows = [
            tuple(row)
            for row in knowledge.execute(
                "SELECT function_id,structural_name,display_name,z64_start,z64_end_exclusive "
                "FROM static_function ORDER BY function_id"
            )
        ]
        static_rows = [
            tuple(row)
            for row in static.execute(
                "SELECT function_id,structural_name,display_name,rom_start,rom_end_exclusive "
                "FROM logical_function ORDER BY function_id"
            )
        ]
        if dynamic_rows != static_rows:
            raise ValueError(
                "selected knowledge static-function snapshot disagrees with frozen static-db-r3"
            )

    @property
    def rom(self) -> bytes:
        if self._rom is None:
            self._rom = read_normalized_rom(Path(self.knowledge_meta["romPath"]))
        return self._rom

    @property
    def schema_version(self) -> int:
        return int(self.knowledge_meta["schemaVersion"])

    def close(self) -> None:
        self.field.close()
        self.resource.close()
        self.static.close()
        self.knowledge.close()

    def __enter__(self) -> "ResolverContext":
        return self

    def __exit__(self, *_args: object) -> None:
        self.close()


def _function_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "functionId": int(row["function_id"]),
        "structuralName": str(row["structural_name"]),
        "displayName": str(row["display_name"]),
        "z64Start": int(row["z64_start"]),
        "z64EndExclusive": int(row["z64_end_exclusive"]),
        "z64Range": f"{_hex(int(row['z64_start']))}..{_hex(int(row['z64_end_exclusive']))}",
        "confidence": str(row["confidence"]),
        "evidenceLane": "static",
    }


def _function_matches(
    context: ResolverContext, identifier: str, *, limit: int
) -> tuple[str, list[sqlite3.Row]]:
    value = identifier.strip()
    lower = value.casefold()
    if lower.startswith("id:"):
        return "function-id", list(
            context.knowledge.execute(
                "SELECT * FROM static_function WHERE function_id=?",
                (int(value.split(":", 1)[1], 0),),
            )
        )
    if lower.startswith(("rom:", "z64:")):
        z64 = int(value.split(":", 1)[1], 0)
        return "z64-rom-offset", list(
            context.knowledge.execute(
                "SELECT * FROM static_function WHERE z64_start<=? AND z64_end_exclusive>? "
                "ORDER BY function_id LIMIT ?",
                (z64, z64, limit),
            )
        )
    exact = list(
        context.knowledge.execute(
            "SELECT * FROM static_function WHERE lower(structural_name)=? "
            "OR lower(display_name)=? ORDER BY function_id LIMIT ?",
            (lower, lower, limit),
        )
    )
    if exact:
        return "function-name", exact
    escaped = lower.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    partial = list(
        context.knowledge.execute(
            "SELECT * FROM static_function WHERE lower(structural_name) LIKE ? ESCAPE '\\' "
            "OR lower(display_name) LIKE ? ESCAPE '\\' ORDER BY function_id LIMIT ?",
            (f"%{escaped}%", f"%{escaped}%", limit),
        )
    )
    return "function-partial-name", partial


def _instruction_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "instructionId": int(row["instruction_id"]),
        "physicalAddress": int(row["physical_address"]),
        "physicalAddressHex": _hex(int(row["physical_address"])),
        "liveAddress": 0x80000000 + int(row["physical_address"]),
        "liveAddressHex": _hex(0x80000000 + int(row["physical_address"])),
        "opcode": int(row["opcode_u32"]),
        "opcodeHex": _hex(int(row["opcode_u32"])),
        "functionId": row["function_id"],
        "z64Offset": row["z64_offset"],
        "mappingStatus": str(row["mapping_status"]),
        "observationCount": int(row["observation_count"]),
        "sessionCount": int(row["discovery_session_count"]),
        "evidenceLane": "runtime",
        "reviewState": "live-unreviewed",
    }


def _candidate_mappings(
    context: ResolverContext,
    instruction: sqlite3.Row,
    *,
    session_id: str | None = None,
    sequence: int | None = None,
    limit: int = DEFAULT_QUERY_LIMIT,
) -> list[dict[str, Any]]:
    physical = int(instruction["physical_address"])
    opcode_bytes = bytes(instruction["opcode_bytes"])
    if _table_exists(context.knowledge, "instruction_mapping_candidate"):
        clauses = ["c.instruction_id=?"]
        values: list[Any] = [int(instruction["instruction_id"])]
        if session_id is not None:
            clauses.append("(c.evidence_session_id IS NULL OR c.evidence_session_id=?)")
            values.append(session_id)
        if sequence is not None:
            clauses.append(
                "(c.first_sequence IS NULL OR "
                "(c.first_sequence<=? AND "
                "(c.last_sequence_exclusive IS NULL OR c.last_sequence_exclusive>?)))"
            )
            values.extend((sequence, sequence))
        rows = context.knowledge.execute(
            "SELECT c.*,f.structural_name,f.display_name "
            "FROM instruction_mapping_candidate c JOIN static_function f "
            "ON f.function_id=c.function_id WHERE "
            + " AND ".join(clauses)
            + " ORDER BY CASE c.candidate_state "
            "WHEN 'uniquely-resolved-live-mapping' THEN 0 "
            "WHEN 'ambiguous-conflicting-mapping' THEN 1 "
            "WHEN 'contemporaneous-placement-candidate' THEN 2 ELSE 3 END,"
            "c.candidate_id LIMIT ?",
            [*values, limit],
        )
        return [
            {
                "candidateId": int(row["candidate_id"]),
                "functionId": int(row["function_id"]),
                "structuralName": str(row["structural_name"]),
                "displayName": str(row["display_name"]),
                "z64Offset": int(row["z64_offset"]),
                "z64OffsetHex": _hex(int(row["z64_offset"])),
                "functionPlacementId": row["function_placement_id"],
                "evidenceSessionId": row["evidence_session_id"],
                "regionInstanceId": row["region_instance_id"],
                "basis": str(row["evidence_kind"]),
                "exactOpcodeMatch": bool(row["exact_bytes_confirmed"]),
                "sameSession": row["evidence_session_id"] is not None,
                "contemporaneous": row["region_instance_id"] is not None,
                "candidateState": str(row["candidate_state"]),
                "contradiction": row["contradiction_text"],
                "missingEvidence": str(row["missing_evidence"]),
                "firstSequence": row["first_sequence"],
                "lastSequenceExclusive": row["last_sequence_exclusive"],
            }
            for row in rows
        ]
    candidates: list[dict[str, Any]] = []
    rows = context.knowledge.execute(
        "SELECT fp.*,f.structural_name,f.display_name FROM function_placement_fact fp "
        "JOIN static_function f ON f.function_id=fp.function_id "
        "WHERE fp.destination_physical_start<=? "
        "AND fp.destination_physical_end_exclusive>? "
        "ORDER BY fp.function_placement_id",
        (physical, physical),
    )
    for row in rows:
        z64 = int(row["source_z64_start"]) + physical - int(
            row["destination_physical_start"]
        )
        if context.rom[z64 : z64 + 4] != opcode_bytes:
            continue
        witness = None
        if session_id is not None:
            witness = context.knowledge.execute(
                "SELECT * FROM function_placement_session "
                "WHERE function_placement_id=? AND session_id=?",
                (row["function_placement_id"], session_id),
            ).fetchone()
        contemporaneous = False
        region_id = None
        if (
            session_id is not None
            and sequence is not None
            and _table_exists(context.knowledge, "region_lifetime_context")
        ):
            region = context.knowledge.execute(
                "SELECT region_instance_id FROM region_lifetime_context "
                "WHERE session_id=? AND destination_physical_start<=? "
                "AND destination_physical_end_exclusive>? AND first_sequence<=? "
                "AND (end_sequence_exclusive IS NULL OR end_sequence_exclusive>?) "
                "AND source_z64_start IS NOT NULL "
                "AND source_z64_start + (? - destination_physical_start)=? LIMIT 1",
                (session_id, physical, physical, sequence, sequence, physical, z64),
            ).fetchone()
            contemporaneous = region is not None
            region_id = None if region is None else str(region[0])
        basis = (
            "contemporaneous-region-lifetime-plus-exact-opcode"
            if contemporaneous
            else "same-session-function-placement-plus-exact-opcode"
            if witness is not None
            else "global-function-placement-plus-exact-opcode"
        )
        candidates.append(
            {
                "functionId": int(row["function_id"]),
                "structuralName": str(row["structural_name"]),
                "displayName": str(row["display_name"]),
                "z64Offset": z64,
                "z64OffsetHex": _hex(z64),
                "functionPlacementId": int(row["function_placement_id"]),
                "regionInstanceId": region_id,
                "basis": basis,
                "exactOpcodeMatch": True,
                "sameSession": witness is not None,
                "contemporaneous": contemporaneous,
                "candidateState": (
                    "uniquely-resolved-live-candidate"
                    if contemporaneous
                    else "contemporaneous-placement-candidate"
                    if witness is not None
                    else "byte-confirmed-global-candidate"
                ),
                "claimLimit": (
                    "A global or same-session placement is not a live mapping without a "
                    "residency interval covering this exact observation."
                ),
            }
        )
        if len(candidates) >= limit:
            break
    if len(candidates) > 1 and not any(item["contemporaneous"] for item in candidates):
        for item in candidates:
            item["candidateState"] = "ambiguous-conflicting-candidate"
    return candidates


def _adjacent_edges(
    context: ResolverContext, instruction_id: int, *, limit: int
) -> list[dict[str, Any]]:
    rows = context.knowledge.execute(
        "SELECT e.edge_id,e.edge_kind,e.source_instruction_id,e.destination_instruction_id,"
        "other.instruction_id AS adjacent_instruction_id,other.physical_address,"
        "other.opcode_u32,other.function_id,other.z64_offset,other.mapping_status,"
        "CASE WHEN e.source_instruction_id=? THEN 'outgoing' ELSE 'incoming' END AS direction "
        "FROM edge_fact e JOIN instruction_fact other ON other.instruction_id="
        "CASE WHEN e.source_instruction_id=? THEN e.destination_instruction_id "
        "ELSE e.source_instruction_id END "
        "WHERE e.source_instruction_id=? OR e.destination_instruction_id=? "
        "ORDER BY e.edge_id LIMIT ?",
        (instruction_id, instruction_id, instruction_id, instruction_id, limit),
    )
    return [
        {
            "edgeId": int(row["edge_id"]),
            "direction": str(row["direction"]),
            "edgeKind": str(row["edge_kind"]),
            "adjacentInstructionId": int(row["adjacent_instruction_id"]),
            "adjacentPhysicalAddress": int(row["physical_address"]),
            "adjacentPhysicalAddressHex": _hex(int(row["physical_address"])),
            "adjacentOpcodeHex": _hex(int(row["opcode_u32"])),
            "adjacentFunctionId": row["function_id"],
            "adjacentZ64Offset": row["z64_offset"],
            "adjacentMappingStatus": str(row["mapping_status"]),
        }
        for row in rows
    ]


def _mapping_diagnostic(
    context: ResolverContext,
    instruction: sqlite3.Row,
    *,
    session_id: str | None,
    sequence: int | None,
    limit: int,
) -> dict[str, Any]:
    candidates = _candidate_mappings(
        context,
        instruction,
        session_id=session_id,
        sequence=sequence,
        limit=limit,
    )
    adjacent = _adjacent_edges(context, int(instruction["instruction_id"]), limit=limit)
    mapped_adjacent = [row for row in adjacent if row["adjacentFunctionId"] is not None]
    if instruction["function_id"] is not None:
        next_evidence = "No mapping evidence is required; the stored mapping is exact-byte verified."
    elif any(item["contemporaneous"] for item in candidates) and len(candidates) == 1:
        next_evidence = (
            "Re-run the deterministic candidate reconciler; one exact contemporaneous candidate exists."
        )
    elif len(candidates) == 1:
        next_evidence = (
            "Capture or recover a session residency interval covering this sequence and generation."
        )
    elif len(candidates) > 1:
        next_evidence = (
            "Use session sequence and generation context to distinguish the competing exact placements."
        )
    else:
        next_evidence = (
            "Capture an exact placement or DMA/census residency mapping for this physical address."
        )
    return {
        "exactFact": _instruction_dict(instruction),
        "candidates": candidates,
        "candidateCount": len(candidates),
        "adjacentMappedEdges": mapped_adjacent,
        "adjacentEdgeCount": len(adjacent),
        "missingEvidence": next_evidence,
        "uncertainty": (
            "Exact opcode equality rejects mismatches but does not make a cross-session "
            "placement contemporaneous."
        ),
    }


def _function_dynamic_summary(
    context: ResolverContext, function_id: int
) -> dict[str, Any]:
    row = context.knowledge.execute(
        "SELECT r.*,p.instruction_count AS runtime_instruction_count,"
        "p.incoming_edge_count,p.outgoing_edge_count,p.incoming_call_count,"
        "p.outgoing_call_count,p.execution_session_count "
        "FROM resolver_function_materialized r "
        "JOIN runtime_function_materialized p ON p.function_id=r.function_id "
        "WHERE r.function_id=?",
        (function_id,),
    ).fetchone()
    if row is None:
        raise ValueError(f"selected knowledge lacks function materialization {function_id}")
    return {
        "coverageClass": str(row["coverage_class"]),
        "placementCount": int(row["placement_count"]),
        "instructionCount": int(row["instruction_count"]),
        "exactEdgeCount": int(row["exact_edge_count"]),
        "callRelationshipCount": int(row["call_relationship_count"]),
        "incomingEdgeCount": int(row["incoming_edge_count"]),
        "outgoingEdgeCount": int(row["outgoing_edge_count"]),
        "incomingCallCount": int(row["incoming_call_count"]),
        "outgoingCallCount": int(row["outgoing_call_count"]),
        "executionSessionCount": int(row["execution_session_count"]),
    }


def _function_placements(
    context: ResolverContext, function_ids: Sequence[int], *, limit: int, offset: int
) -> list[dict[str, Any]]:
    if not function_ids:
        return []
    marks = ",".join("?" for _ in function_ids)
    rows = context.knowledge.execute(
        f"SELECT fp.*,f.structural_name FROM function_placement_fact fp "
        f"JOIN static_function f ON f.function_id=fp.function_id "
        f"WHERE fp.function_id IN ({marks}) ORDER BY fp.function_placement_id LIMIT ? OFFSET ?",
        [*function_ids, limit, offset],
    )
    return [
        {
            "functionPlacementId": int(row["function_placement_id"]),
            "functionId": int(row["function_id"]),
            "structuralName": str(row["structural_name"]),
            "sourceZ64Start": int(row["source_z64_start"]),
            "sourceZ64EndExclusive": int(row["source_z64_end_exclusive"]),
            "destinationPhysicalStart": int(row["destination_physical_start"]),
            "destinationPhysicalEndExclusive": int(row["destination_physical_end_exclusive"]),
            "mappingMethod": str(row["mapping_method"]),
            "observationCount": int(row["observation_count"]),
            "sessionCount": int(row["session_count"]),
            "claimLimit": "Placement or residence is not execution.",
        }
        for row in rows
    ]


def _function_instructions(
    context: ResolverContext, function_ids: Sequence[int], *, limit: int, offset: int
) -> list[dict[str, Any]]:
    if not function_ids:
        return []
    marks = ",".join("?" for _ in function_ids)
    return [
        _instruction_dict(row)
        for row in context.knowledge.execute(
            f"SELECT * FROM instruction_fact WHERE function_id IN ({marks}) "
            "ORDER BY function_id,z64_offset,physical_address,instruction_id LIMIT ? OFFSET ?",
            [*function_ids, limit, offset],
        )
    ]


def _bitmap_ordinals(bitmap: bytes) -> list[int]:
    return [
        byte_index * 8 + bit_index + 1
        for byte_index, byte in enumerate(bitmap)
        for bit_index in range(8)
        if byte & (1 << bit_index)
    ]


def _bitmap_contains(bitmap: bytes, ordinal: int) -> bool:
    if ordinal < 1:
        return False
    index = ordinal - 1
    return index // 8 < len(bitmap) and bool(bitmap[index // 8] & (1 << (index & 7)))


def _known_activity(
    context: ResolverContext,
    session_id: str,
    *,
    function_ids: Sequence[int] = (),
    limit: int = DEFAULT_PREVIEW_LIMIT,
) -> dict[str, Any] | None:
    if not _table_exists(context.knowledge, "known_activity_summary"):
        return None
    row = context.knowledge.execute(
        "SELECT * FROM known_activity_summary WHERE session_id=?", (session_id,)
    ).fetchone()
    if row is None:
        return None
    instruction_bitmap = bytes(row["instruction_hit_bitmap"])
    edge_bitmap = bytes(row["edge_hit_bitmap"])
    dma_bitmap = bytes(row["dma_hit_bitmap"])
    matching_instruction_ids: list[int]
    if function_ids:
        marks = ",".join("?" for _ in function_ids)
        matching_instruction_ids = [
            int(item[0])
            for item in context.knowledge.execute(
                f"SELECT instruction_id FROM instruction_fact WHERE function_id IN ({marks}) "
                "ORDER BY instruction_id",
                list(function_ids),
            )
            if _bitmap_contains(instruction_bitmap, int(item[0]))
        ]
    else:
        matching_instruction_ids = _bitmap_ordinals(instruction_bitmap)
    representative_instructions: list[dict[str, Any]] = []
    for instruction_id in matching_instruction_ids[:limit]:
        instruction = context.knowledge.execute(
            "SELECT * FROM instruction_fact WHERE instruction_id=?", (instruction_id,)
        ).fetchone()
        if instruction is not None:
            representative_instructions.append(_instruction_dict(instruction))
    matching_edge_ids = _bitmap_ordinals(edge_bitmap)
    if function_ids and matching_edge_ids:
        marks = ",".join("?" for _ in function_ids)
        relevant_edges = {
            int(edge[0])
            for edge in context.knowledge.execute(
                "SELECT e.edge_id FROM edge_fact e "
                "JOIN instruction_fact src ON src.instruction_id=e.source_instruction_id "
                "JOIN instruction_fact dst ON dst.instruction_id=e.destination_instruction_id "
                f"WHERE src.function_id IN ({marks}) OR dst.function_id IN ({marks})",
                [*function_ids, *function_ids],
            )
        }
        matching_edge_ids = [
            edge_id for edge_id in matching_edge_ids if edge_id in relevant_edges
        ]
    return {
        "sessionId": session_id,
        "frontierIdentity": str(row["frontier_identity"]),
        "bridgeSequence": int(row["bridge_sequence"]),
        "instructionHitCount": int(row["instruction_hit_count"]),
        "edgeHitCount": int(row["edge_hit_count"]),
        "dmaHitCount": int(row["dma_hit_count"]),
        "matchingInstructionHitCount": len(matching_instruction_ids),
        "matchingEdgeHitCount": len(matching_edge_ids),
        "representativeInstructions": representative_instructions,
        "claim": "session-membership-only",
        "claimLimit": (
            "A set bit proves this already-known exact fact occurred during the session; "
            "it does not provide its frame, bridge sequence, occurrence count, or local order."
        ),
    }


def _function_sessions(
    context: ResolverContext, function_ids: Sequence[int], *, limit: int, offset: int
) -> list[dict[str, Any]]:
    if not function_ids:
        return []
    marks = ",".join("?" for _ in function_ids)
    rows = list(context.knowledge.execute(
        f"SELECT s.session_id,MIN(s.first_bridge_sequence) AS first_bridge_sequence,"
        "MAX(s.last_bridge_sequence) AS last_bridge_sequence,"
        "SUM(s.observation_count) AS observation_count,"
        "COUNT(DISTINCT i.instruction_id) AS instruction_count "
        "FROM instruction_session s JOIN instruction_fact i ON i.instruction_id=s.instruction_id "
        f"WHERE i.function_id IN ({marks}) GROUP BY s.session_id "
        "ORDER BY s.session_id",
        list(function_ids),
    ))
    sessions: dict[str, dict[str, Any]] = {
        str(row["session_id"]): {
            "sessionId": str(row["session_id"]),
            "firstBridgeSequence": int(row["first_bridge_sequence"]),
            "lastBridgeSequence": int(row["last_bridge_sequence"]),
            "observationCount": int(row["observation_count"]),
            "instructionCount": int(row["instruction_count"]),
            "contextLimit": (
                "For historical novelty-filtered sessions this proves emitted structural "
                "observations, not every known execution occurrence."
            ),
        }
        for row in rows
    }
    if _table_exists(context.knowledge, "known_activity_summary"):
        instruction_ids = [
            int(row[0])
            for row in context.knowledge.execute(
                f"SELECT instruction_id FROM instruction_fact WHERE function_id IN ({marks})",
                list(function_ids),
            )
        ]
        for activity in context.knowledge.execute(
            "SELECT session_id,instruction_hit_bitmap FROM known_activity_summary "
            "ORDER BY session_id"
        ):
            bitmap = bytes(activity["instruction_hit_bitmap"])
            hit_count = sum(
                _bitmap_contains(bitmap, instruction_id)
                for instruction_id in instruction_ids
            )
            if not hit_count:
                continue
            session = sessions.setdefault(
                str(activity["session_id"]),
                {
                    "sessionId": str(activity["session_id"]),
                    "firstBridgeSequence": None,
                    "lastBridgeSequence": None,
                    "observationCount": 0,
                    "instructionCount": 0,
                    "contextLimit": "No event-level witness was emitted for these known facts.",
                },
            )
            session["knownActivityInstructionCount"] = hit_count
            session["membershipEvidence"] = "stop-time-native-hit-bitmap"
    ordered = [sessions[key] for key in sorted(sessions)]
    return ordered[offset : offset + limit]


def _function_static_calls(
    context: ResolverContext, function_ids: Sequence[int], *, limit: int, offset: int
) -> dict[str, list[dict[str, Any]]]:
    if not function_ids:
        return {"callers": [], "callees": []}
    marks = ",".join("?" for _ in function_ids)
    callers = [
        _row_dict(row)
        for row in context.static.execute(
            "SELECT d.call_id,d.instruction_rom,d.function_id AS caller_function_id,"
            "c.candidate_function_id AS callee_function_id,c.candidate_rom,"
            "c.method,c.confidence FROM direct_call d JOIN candidate_callee c "
            "ON c.instruction_rom=d.instruction_rom "
            f"WHERE c.candidate_function_id IN ({marks}) ORDER BY d.call_id LIMIT ? OFFSET ?",
            [*function_ids, limit, offset],
        )
    ]
    callees = [
        _row_dict(row)
        for row in context.static.execute(
            "SELECT d.call_id,d.instruction_rom,d.function_id AS caller_function_id,"
            "c.candidate_function_id AS callee_function_id,c.candidate_rom,"
            "c.method,c.confidence FROM direct_call d LEFT JOIN candidate_callee c "
            "ON c.instruction_rom=d.instruction_rom "
            f"WHERE d.function_id IN ({marks}) ORDER BY d.call_id LIMIT ? OFFSET ?",
            [*function_ids, limit, offset],
        )
    ]
    return {"callers": callers, "callees": callees}


def _function_fields(
    context: ResolverContext, function_ids: Sequence[int], *, limit: int, offset: int
) -> dict[str, Any]:
    if not function_ids:
        return {"count": 0, "rows": []}
    marks = ",".join("?" for _ in function_ids)
    count = int(
        context.field.execute(
            f"SELECT COUNT(*) FROM access_site WHERE function_id IN ({marks})", function_ids
        ).fetchone()[0]
    )
    rows = context.field.execute(
        "SELECT fc.field_id,fc.field_key,fc.field_label,fc.semantic_label,"
        "fc.displacement_signed,of.family_id,of.family_key,of.label AS family_label,"
        "fc.evidence_grade,COUNT(*) AS access_count FROM access_site a "
        "JOIN field_access fa ON fa.access_id=a.access_id "
        "JOIN field_candidate fc ON fc.field_id=fa.field_id "
        "JOIN object_family of ON of.family_id=fc.family_id "
        f"WHERE a.function_id IN ({marks}) GROUP BY fc.field_id "
        "ORDER BY access_count DESC,fc.field_id LIMIT ? OFFSET ?",
        [*function_ids, limit, offset],
    )
    return {
        "count": count,
        "rows": [_row_dict(row) for row in rows],
        "claimLimit": "Static field grouping is not runtime access evidence.",
    }


def _function_resources(
    context: ResolverContext, functions: Sequence[Mapping[str, Any]], *, limit: int, offset: int
) -> dict[str, Any]:
    results: dict[str, dict[str, Any]] = {}
    for function in functions:
        rows = context.resource.execute(
            "SELECT DISTINCT r.resource_id,r.logical_key,r.label,r.disposition,"
            "r.evidence_grade,c.chain_id,l.loader_id,l.structural_name AS loader_name,"
            "cs.callsite_id,cs.callsite_rom AS instruction_z64 FROM callsite cs "
            "JOIN loader l ON l.loader_id=cs.loader_id "
            "JOIN chain c ON c.loader_id=l.loader_id "
            "JOIN resource r ON r.resource_id=c.resource_id "
            "WHERE lower(cs.caller_name)=lower(?) OR "
            "(cs.caller_rom>=? AND cs.caller_rom<?) "
            "ORDER BY r.resource_id,c.chain_id LIMIT ?",
            (
                function["structuralName"],
                function["z64Start"],
                function["z64EndExclusive"],
                limit + offset,
            ),
        )
        for row in rows:
            results[f"{row['resource_id']}:{row['chain_id']}"] = _row_dict(row)
    ordered = [results[key] for key in sorted(results)]
    return {
        "count": len(ordered),
        "rows": ordered[offset : offset + limit],
        "claimLimit": "Static resource ancestry is not runtime reachability.",
    }


def explain_selected(
    context: ResolverContext,
    identifier: str,
    *,
    session_id: str | None = None,
    sequence: int | None = None,
    frame: int | None = None,
    includes: Iterable[str] | None = None,
    limit: int = DEFAULT_QUERY_LIMIT,
    cursor: int = 0,
) -> tuple[dict[str, Any], int]:
    limit = _bounded_limit(limit)
    if cursor < 0:
        raise ValueError("query cursor must be nonnegative")
    include = _normalize_includes(includes)
    value = identifier.strip()
    lower = value.casefold()
    identifier_kind: str
    function_rows: list[sqlite3.Row] = []
    address_instructions: list[sqlite3.Row] = []

    if lower.startswith(("live:", "ram:", "physical:")):
        prefix, raw = value.split(":", 1)
        number = int(raw, 0)
        physical = number if prefix.casefold() in {"ram", "physical"} else physical_from_live(number)
        identifier_kind = "live-or-physical-address"
        address_instructions = list(
            context.knowledge.execute(
                "SELECT * FROM instruction_fact WHERE physical_address=? "
                "ORDER BY instruction_id LIMIT ?",
                (physical, limit),
            )
        )
        function_ids = sorted(
            {int(row["function_id"]) for row in address_instructions if row["function_id"] is not None}
        )
        if function_ids:
            marks = ",".join("?" for _ in function_ids)
            function_rows = list(
                context.knowledge.execute(
                    f"SELECT * FROM static_function WHERE function_id IN ({marks}) ORDER BY function_id",
                    function_ids,
                )
            )
    else:
        identifier_kind, function_rows = _function_matches(context, value, limit=limit)

    functions = [_function_dict(row) for row in function_rows]
    function_ids = [int(row["function_id"]) for row in function_rows]
    summaries = {
        str(function_id): _function_dynamic_summary(context, function_id)
        for function_id in function_ids
    }
    preview_limit = min(DEFAULT_PREVIEW_LIMIT, limit)
    placements = _function_placements(
        context,
        function_ids,
        limit=limit if "placements" in include else preview_limit,
        offset=cursor if "placements" in include else 0,
    )
    instructions = (
        [_instruction_dict(row) for row in address_instructions]
        if address_instructions
        else _function_instructions(
            context,
            function_ids,
            limit=limit if "instructions" in include else preview_limit,
            offset=cursor if "instructions" in include else 0,
        )
    )
    sessions = _function_sessions(
        context,
        function_ids,
        limit=limit if "sessions" in include else preview_limit,
        offset=cursor if "sessions" in include else 0,
    )
    candidates = []
    if address_instructions or "candidates" in include or "unresolved" in include:
        candidate_rows = address_instructions or list(
            context.knowledge.execute(
                "SELECT * FROM instruction_fact WHERE function_id IS NULL "
                "ORDER BY instruction_id LIMIT ? OFFSET ?",
                (limit, cursor),
            )
        )
        candidates = [
            _mapping_diagnostic(
                context,
                row,
                session_id=session_id,
                sequence=sequence,
                limit=limit,
            )
            for row in candidate_rows
        ]
    calls = (
        _function_static_calls(context, function_ids, limit=limit, offset=cursor)
        if "calls" in include
        else {
            "callers": [],
            "callees": [],
            "detailAvailable": bool(function_ids),
        }
    )
    fields = (
        _function_fields(context, function_ids, limit=limit, offset=cursor)
        if "fields" in include
        else {"detailAvailable": bool(function_ids)}
    )
    resources = (
        _function_resources(context, functions, limit=limit, offset=cursor)
        if "resources" in include
        else {"detailAvailable": bool(function_ids)}
    )
    any_result = bool(functions or address_instructions or candidates)
    payload = {
        "schema": QUERY_SCHEMA,
        "query": {
            "identifier": identifier,
            "identifierKind": identifier_kind,
            "sessionId": session_id,
            "sequence": sequence,
            "frame": frame,
            "include": sorted(include),
            "limit": limit,
            "cursor": cursor,
        },
        "resolutionStatus": "resolved" if any_result else "unsupported",
        "sourceManifest": context.manifest,
        "functions": functions,
        "dynamicSummary": summaries,
        "previews": {
            "placements": placements,
            "instructions": instructions,
            "sessions": sessions,
        },
        "mappingDiagnostics": candidates,
        "staticCalls": calls,
        "fieldLane": fields,
        "resourceLane": resources,
        "pagination": {
            "cursor": cursor,
            "nextCursor": cursor + limit,
            "bounded": True,
            "maximumLimit": MAX_QUERY_LIMIT,
        },
        "evidenceBoundary": (
            "Exact machine facts, mapping candidates, session context, and static semantic "
            "evidence remain separate. Live-unreviewed facts do not promote accepted structure."
        ),
        "historicalContextLimit": (
            "Before activity summaries, known instructions suppressed by the novelty frontier "
            "cannot be reconstructed as complete per-session execution streams."
        ),
    }
    return payload, 0 if any_result else 2


def coverage_selected(context: ResolverContext) -> dict[str, Any]:
    classes = {
        str(row[0]): int(row[1])
        for row in context.knowledge.execute(
            "SELECT coverage_class,COUNT(*) FROM resolver_function_materialized "
            "GROUP BY coverage_class ORDER BY coverage_class"
        )
    }
    counts = {
        "functions": int(context.knowledge.execute("SELECT COUNT(*) FROM static_function").fetchone()[0]),
        "instructions": int(context.knowledge.execute("SELECT COUNT(*) FROM instruction_fact").fetchone()[0]),
        "mappedInstructions": int(
            context.knowledge.execute(
                "SELECT COUNT(*) FROM instruction_fact WHERE function_id IS NOT NULL"
            ).fetchone()[0]
        ),
        "edges": int(context.knowledge.execute("SELECT COUNT(*) FROM edge_fact").fetchone()[0]),
        "calls": int(context.knowledge.execute("SELECT COUNT(*) FROM call_fact").fetchone()[0]),
        "dmaPlacements": int(context.knowledge.execute("SELECT COUNT(*) FROM dma_placement").fetchone()[0]),
        "functionPlacements": int(
            context.knowledge.execute("SELECT COUNT(*) FROM function_placement_fact").fetchone()[0]
        ),
        "sessions": int(context.knowledge.execute("SELECT COUNT(*) FROM ingestion_ledger").fetchone()[0]),
        "unresolved": int(
            context.knowledge.execute("SELECT COUNT(*) FROM unresolved_observation").fetchone()[0]
        ),
    }
    if _table_exists(context.knowledge, "known_activity_summary"):
        activity = context.knowledge.execute(
            "SELECT COUNT(*),COALESCE(SUM(instruction_hit_count),0),"
            "COALESCE(SUM(edge_hit_count),0),COALESCE(SUM(dma_hit_count),0) "
            "FROM known_activity_summary"
        ).fetchone()
        assert activity is not None
        counts.update(
            {
                "knownActivitySessions": int(activity[0]),
                "knownInstructionSessionHits": int(activity[1]),
                "knownEdgeSessionHits": int(activity[2]),
                "knownDmaSessionHits": int(activity[3]),
            }
        )
    return {
        "schema": "ob64-total-resolver-selected-coverage.v1",
        "sourceManifest": context.manifest,
        "counts": counts,
        "functionCoverageClasses": classes,
        "placedAndExecutedPercent": (
            100.0 * classes.get("placed-and-executed", 0) / counts["functions"]
            if counts["functions"]
            else 0.0
        ),
        "completenessBoundary": (
            "Coverage describes accepted captured sessions only. Unplayed paths and historically "
            "suppressed known occurrences remain outside this count."
        ),
    }


def _unresolved_row_diagnostic(
    context: ResolverContext, row: sqlite3.Row, *, limit: int
) -> dict[str, Any]:
    payload = json.loads(str(row["payload_json"]))
    physical, opcode = _extract_mapping_payload(payload)
    diagnostic = None
    if physical is not None and opcode is not None:
        instruction = context.knowledge.execute(
            "SELECT * FROM instruction_fact WHERE physical_address=? AND opcode_bytes=?",
            (physical, int(opcode).to_bytes(4, "big")),
        ).fetchone()
        if instruction is not None:
            diagnostic = _mapping_diagnostic(
                context,
                instruction,
                session_id=str(row["session_id"]),
                sequence=row["sequence"],
                limit=limit,
            )
    return {
        "sessionId": str(row["session_id"]),
        "unresolvedId": str(row["local_unresolved_id"]),
        "kind": str(row["kind"]),
        "sequence": row["sequence"],
        "frame": row["frame"],
        "physicalAddress": physical,
        "physicalAddressHex": _hex(physical),
        "opcode": opcode,
        "opcodeHex": _hex(opcode),
        "payload": payload,
        "mappingDiagnostic": diagnostic,
    }


def unresolved_selected(
    context: ResolverContext,
    *,
    lane: str | None = None,
    kind: str | None = None,
    session_id: str | None = None,
    limit: int = DEFAULT_QUERY_LIMIT,
    cursor: int = 0,
) -> dict[str, Any]:
    limit = _bounded_limit(limit)
    if cursor < 0:
        raise ValueError("query cursor must be nonnegative")
    dynamic_enabled = lane in {None, "dynamic", "placement", "runtime"}
    clauses: list[str] = []
    values: list[Any] = []
    if kind is not None:
        clauses.append("kind=?")
        values.append(kind)
    if session_id is not None:
        clauses.append("session_id=?")
        values.append(session_id)
    where = " WHERE " + " AND ".join(clauses) if clauses else ""
    dynamic_count = (
        int(
            context.knowledge.execute(
                "SELECT COUNT(*) FROM unresolved_observation" + where, values
            ).fetchone()[0]
        )
        if dynamic_enabled
        else 0
    )
    rows = (
        list(
            context.knowledge.execute(
                "SELECT * FROM unresolved_observation"
                + where
                + " ORDER BY session_id,local_unresolved_id LIMIT ? OFFSET ?",
                [*values, limit, cursor],
            )
        )
        if dynamic_enabled
        else []
    )
    kind_counts = {
        str(row[0]): int(row[1])
        for row in context.knowledge.execute(
            "SELECT kind,COUNT(*) FROM unresolved_observation GROUP BY kind ORDER BY COUNT(*) DESC,kind"
        )
    }
    static_count = int(context.static.execute("SELECT COUNT(*) FROM unresolved_target").fetchone()[0])
    resource_count = int(context.resource.execute("SELECT COUNT(*) FROM unresolved").fetchone()[0])
    field_count = int(context.field.execute("SELECT COUNT(*) FROM unresolved_evidence").fetchone()[0])
    return {
        "schema": "ob64-total-resolver-selected-unresolved.v1",
        "sourceManifest": context.manifest,
        "filters": {"lane": lane, "kind": kind, "sessionId": session_id},
        "counts": {
            "dynamic": dynamic_count,
            "static": static_count if lane in {None, "static"} else 0,
            "resource": resource_count if lane in {None, "resource"} else 0,
            "field": field_count if lane in {None, "field"} else 0,
        },
        "dynamicKinds": kind_counts,
        "dynamicRows": [_unresolved_row_diagnostic(context, row, limit=limit) for row in rows],
        "pagination": {
            "cursor": cursor,
            "nextCursor": cursor + limit,
            "truncated": dynamic_count > cursor + len(rows),
        },
        "note": (
            "Unresolved rows are searchable work items. Candidate mappings remain separate from "
            "accepted instruction mappings."
        ),
    }


def _raw_session_context(
    context: ResolverContext,
    *,
    session_id: str,
    frame_start: int | None,
    frame_end: int | None,
    sequence_start: int | None,
    sequence_end: int | None,
    opcode: int | None,
    marker_text: str | None,
    marker_type: str | None,
    limit: int,
    cursor: int,
) -> dict[str, Any]:
    ledger = context.knowledge.execute(
        "SELECT source_capture_path FROM ingestion_ledger WHERE session_id=?", (session_id,)
    ).fetchone()
    if ledger is None:
        return {"available": False, "reason": "session is not in the ingestion ledger"}
    capture_path = Path(str(ledger[0])).resolve()
    if not capture_path.is_file():
        return {"available": False, "reason": "raw capture path is unavailable"}
    capture = open_capture_database(capture_path, read_only=True)
    capture.execute("PRAGMA query_only=ON")
    try:
        clauses = ["session_id=?"]
        values: list[Any] = [session_id]
        if frame_start is not None:
            clauses.append("frame_number>=?")
            values.append(frame_start)
        if frame_end is not None:
            clauses.append("frame_number<=?")
            values.append(frame_end)
        if sequence_start is not None:
            clauses.append("COALESCE(bridge_event_sequence,sequence_id)>=?")
            values.append(sequence_start)
        if sequence_end is not None:
            clauses.append("COALESCE(bridge_event_sequence,sequence_id)<=?")
            values.append(sequence_end)
        rows: list[dict[str, Any]] = []
        scan_limit = min(5000, max(limit * 50, limit + cursor))
        for row in capture.execute(
            "SELECT sequence_id,frame_number,bridge_stream,bridge_event_sequence,"
            "bridge_event_type,raw_payload_json FROM event_sequence WHERE "
            + " AND ".join(clauses)
            + " ORDER BY sequence_id LIMIT ?",
            [*values, scan_limit],
        ):
            payload = load_event_payload(capture, str(row["raw_payload_json"]))
            _physical, payload_opcode = _extract_mapping_payload(payload)
            if opcode is not None and payload_opcode != opcode:
                continue
            rows.append(
                {
                    "sequence": int(row["sequence_id"]),
                    "bridgeSequence": row["bridge_event_sequence"],
                    "frame": row["frame_number"],
                    "stream": str(row["bridge_stream"]),
                    "eventType": str(row["bridge_event_type"]),
                    "payload": payload,
                }
            )
        marker_clauses = ["session_id=?"]
        marker_values: list[Any] = [session_id]
        if marker_text is not None:
            marker_clauses.append("lower(label) LIKE ?")
            marker_values.append(f"%{marker_text.casefold()}%")
        if marker_type is not None:
            marker_clauses.append("marker_type=?")
            marker_values.append(marker_type)
        markers = [
            _row_dict(row)
            for row in capture.execute(
                "SELECT * FROM semantic_marker WHERE "
                + " AND ".join(marker_clauses)
                + " ORDER BY marker_id LIMIT ? OFFSET ?",
                [*marker_values, limit, cursor],
            )
        ]
        return {
            "available": True,
            "capturePath": str(capture_path),
            "events": rows[cursor : cursor + limit],
            "markers": markers,
            "claimLimit": (
                "Raw historical rows contain emitted novelty and samples, not instructions that "
                "the native frontier suppressed as already known."
            ),
        }
    finally:
        capture.close()


def _marker_with_context(
    context: ResolverContext, row: sqlite3.Row, *, limit: int
) -> dict[str, Any]:
    result = _row_dict(row)
    if not _table_exists(context.knowledge, "marker_context_window"):
        return result
    window = context.knowledge.execute(
        "SELECT * FROM marker_context_window WHERE session_id=? AND marker_id=?",
        (row["session_id"], row["marker_id"]),
    ).fetchone()
    if window is None:
        result["executionContext"] = None
        return result
    records = [
        _row_dict(record)
        for record in context.knowledge.execute(
            "SELECT * FROM marker_execution_context_record "
            "WHERE session_id=? AND marker_id=? ORDER BY local_order LIMIT ?",
            (row["session_id"], row["marker_id"], limit),
        )
    ]
    result["executionContext"] = {
        **_row_dict(window),
        "records": records,
        "recordsTruncated": len(records)
        < int(window["retained_before_count"]) + int(window["retained_after_count"]),
    }
    return result


def search_selected(
    context: ResolverContext,
    *,
    text: str | None = None,
    function: str | None = None,
    rom: int | str | None = None,
    live: int | str | None = None,
    physical: int | str | None = None,
    opcode: int | str | None = None,
    exact_bytes: str | None = None,
    session_id: str | None = None,
    frame_start: int | None = None,
    frame_end: int | None = None,
    sequence_start: int | None = None,
    sequence_end: int | None = None,
    edge_from: int | str | None = None,
    edge_to: int | str | None = None,
    mapping_status: str | None = None,
    unresolved_kind: str | None = None,
    marker_text: str | None = None,
    marker_type: str | None = None,
    controller: bool = False,
    buttons: int | str | None = None,
    limit: int = DEFAULT_QUERY_LIMIT,
    cursor: int = 0,
) -> dict[str, Any]:
    limit = _bounded_limit(limit)
    if cursor < 0:
        raise ValueError("query cursor must be nonnegative")
    parsed_rom = _parse_u32(rom, "ROM offset")
    parsed_physical = _parse_u32(physical, "physical address")
    parsed_live = _parse_u32(live, "live address")
    if parsed_live is not None:
        parsed_physical = physical_from_live(parsed_live)
    parsed_opcode = _parse_u32(opcode, "opcode")
    if exact_bytes is not None:
        normalized = exact_bytes.removeprefix("0x").removeprefix("0X")
        if len(normalized) != 8:
            raise ValueError("exact instruction bytes must contain four bytes")
        try:
            byte_opcode = int(normalized, 16)
        except ValueError as exc:
            raise ValueError("exact instruction bytes must be hexadecimal") from exc
        if parsed_opcode is not None and parsed_opcode != byte_opcode:
            raise ValueError("--opcode and --bytes disagree")
        parsed_opcode = byte_opcode
    parsed_edge_from = _parse_u32(edge_from, "edge source")
    parsed_edge_to = _parse_u32(edge_to, "edge destination")
    parsed_buttons = _parse_u32(buttons, "controller buttons")
    if not any(
        value is not None and value is not False
        for value in (
            text,
            function,
            parsed_rom,
            parsed_physical,
            parsed_opcode,
            session_id,
            frame_start,
            frame_end,
            sequence_start,
            sequence_end,
            parsed_edge_from,
            parsed_edge_to,
            mapping_status,
            unresolved_kind,
            marker_text,
            marker_type,
            controller,
            parsed_buttons,
        )
    ):
        raise ValueError("search requires at least one bounded filter")

    function_query = function or text
    function_rows: list[sqlite3.Row] = []
    if function_query:
        _, function_rows = _function_matches(context, function_query, limit=limit)
    functions = [_function_dict(row) for row in function_rows]

    instruction_clauses: list[str] = []
    instruction_values: list[Any] = []
    has_context_witnesses = _table_exists(
        context.knowledge, "instruction_context_witness"
    )
    needs_event_context = any(
        value is not None
        for value in (
            session_id,
            frame_start,
            frame_end,
            sequence_start,
            sequence_end,
        )
    )
    join_session = needs_event_context
    if parsed_physical is not None:
        instruction_clauses.append("i.physical_address=?")
        instruction_values.append(parsed_physical)
    if parsed_opcode is not None:
        instruction_clauses.append("i.opcode_u32=?")
        instruction_values.append(parsed_opcode)
    if parsed_rom is not None:
        instruction_clauses.append("i.z64_offset=?")
        instruction_values.append(parsed_rom)
    if mapping_status is not None:
        instruction_clauses.append("i.mapping_status=?")
        instruction_values.append(mapping_status)
    if function_rows:
        marks = ",".join("?" for _ in function_rows)
        instruction_clauses.append(f"i.function_id IN ({marks})")
        instruction_values.extend(int(row["function_id"]) for row in function_rows)
    witness_alias = "w" if has_context_witnesses else "s"
    if session_id is not None:
        instruction_clauses.append(f"{witness_alias}.session_id=?")
        instruction_values.append(session_id)
    if sequence_start is not None:
        instruction_clauses.append(
            "w.bridge_sequence>=?"
            if has_context_witnesses
            else "s.last_bridge_sequence>=?"
        )
        instruction_values.append(sequence_start)
    if sequence_end is not None:
        instruction_clauses.append(
            "w.bridge_sequence<=?"
            if has_context_witnesses
            else "s.first_bridge_sequence<=?"
        )
        instruction_values.append(sequence_end)
    if frame_start is not None and has_context_witnesses:
        instruction_clauses.append("w.frame>=?")
        instruction_values.append(frame_start)
    if frame_end is not None and has_context_witnesses:
        instruction_clauses.append("w.frame<=?")
        instruction_values.append(frame_end)
    if (frame_start is not None or frame_end is not None) and not has_context_witnesses:
        instruction_clauses.append("0")
    instructions: list[sqlite3.Row] = []
    if instruction_clauses:
        join = (
            " JOIN instruction_context_witness w ON w.instruction_id=i.instruction_id"
            if join_session and has_context_witnesses
            else " JOIN instruction_session s ON s.instruction_id=i.instruction_id"
            if join_session
            else ""
        )
        instructions = list(
            context.knowledge.execute(
                "SELECT DISTINCT i.* FROM instruction_fact i"
                + join
                + " WHERE "
                + " AND ".join(instruction_clauses)
                + " ORDER BY i.instruction_id LIMIT ? OFFSET ?",
                [*instruction_values, limit, cursor],
            )
        )

    edge_clauses: list[str] = []
    edge_values: list[Any] = []
    if parsed_edge_from is not None:
        edge_clauses.append("src.physical_address=?")
        edge_values.append(parsed_edge_from)
    if parsed_edge_to is not None:
        edge_clauses.append("dst.physical_address=?")
        edge_values.append(parsed_edge_to)
    if parsed_opcode is not None and (parsed_edge_from is not None or parsed_edge_to is not None):
        edge_clauses.append("(src.opcode_u32=? OR dst.opcode_u32=?)")
        edge_values.extend((parsed_opcode, parsed_opcode))
    has_edge_context = _table_exists(context.knowledge, "edge_context_witness")
    if session_id is not None and has_edge_context:
        edge_clauses.append("ew.session_id=?")
        edge_values.append(session_id)
    if frame_start is not None and has_edge_context:
        edge_clauses.append("ew.frame>=?")
        edge_values.append(frame_start)
    if frame_end is not None and has_edge_context:
        edge_clauses.append("ew.frame<=?")
        edge_values.append(frame_end)
    if sequence_start is not None and has_edge_context:
        edge_clauses.append("ew.bridge_sequence>=?")
        edge_values.append(sequence_start)
    if sequence_end is not None and has_edge_context:
        edge_clauses.append("ew.bridge_sequence<=?")
        edge_values.append(sequence_end)
    edges = []
    if edge_clauses:
        context_select = (
            "ew.session_id AS context_session_id,"
            "ew.bridge_sequence AS context_bridge_sequence,ew.frame AS context_frame "
            if has_edge_context
            else "NULL AS context_session_id,NULL AS context_bridge_sequence,"
            "NULL AS context_frame "
        )
        context_join = (
            "JOIN edge_context_witness ew ON ew.edge_id=e.edge_id "
            if has_edge_context
            else ""
        )
        edge_query = (
            "SELECT e.*,src.physical_address AS source_physical,"
            "src.opcode_u32 AS source_opcode,src.function_id AS source_function,"
            "dst.physical_address AS destination_physical,"
            "dst.opcode_u32 AS destination_opcode,dst.function_id AS destination_function,"
            + context_select
            + "FROM edge_fact e JOIN instruction_fact src "
            "ON src.instruction_id=e.source_instruction_id JOIN instruction_fact dst "
            "ON dst.instruction_id=e.destination_instruction_id "
            + context_join
            + "WHERE "
            + " AND ".join(edge_clauses)
            + " ORDER BY e.edge_id LIMIT ? OFFSET ?"
        )
        edges = [
            {
                "edgeId": int(row["edge_id"]),
                "edgeKind": str(row["edge_kind"]),
                "sourceInstructionId": int(row["source_instruction_id"]),
                "sourcePhysicalAddress": int(row["source_physical"]),
                "sourceOpcodeHex": _hex(int(row["source_opcode"])),
                "sourceFunctionId": row["source_function"],
                "destinationInstructionId": int(row["destination_instruction_id"]),
                "destinationPhysicalAddress": int(row["destination_physical"]),
                "destinationOpcodeHex": _hex(int(row["destination_opcode"])),
                "destinationFunctionId": row["destination_function"],
                "sessionId": row["context_session_id"],
                "bridgeSequence": row["context_bridge_sequence"],
                "frame": row["context_frame"],
            }
            for row in context.knowledge.execute(
                edge_query,
                [*edge_values, limit, cursor],
            )
        ]

    unresolved_clauses: list[str] = []
    unresolved_values: list[Any] = []
    has_unresolved_index = _table_exists(context.knowledge, "unresolved_index")
    unresolved_alias = "x" if has_unresolved_index else "u"
    if unresolved_kind is not None:
        unresolved_clauses.append(f"{unresolved_alias}.kind=?")
        unresolved_values.append(unresolved_kind)
    if session_id is not None:
        unresolved_clauses.append(f"{unresolved_alias}.session_id=?")
        unresolved_values.append(session_id)
    if frame_start is not None:
        unresolved_clauses.append(f"{unresolved_alias}.frame>=?")
        unresolved_values.append(frame_start)
    if frame_end is not None:
        unresolved_clauses.append(f"{unresolved_alias}.frame<=?")
        unresolved_values.append(frame_end)
    if sequence_start is not None:
        unresolved_clauses.append(f"{unresolved_alias}.sequence>=?")
        unresolved_values.append(sequence_start)
    if sequence_end is not None:
        unresolved_clauses.append(f"{unresolved_alias}.sequence<=?")
        unresolved_values.append(sequence_end)
    if parsed_physical is not None and has_unresolved_index:
        unresolved_clauses.append("x.physical_address=?")
        unresolved_values.append(parsed_physical)
    if parsed_opcode is not None and has_unresolved_index:
        unresolved_clauses.append("x.opcode_u32=?")
        unresolved_values.append(parsed_opcode)
    unresolved_rows = []
    if unresolved_clauses:
        unresolved_rows = [
            _unresolved_row_diagnostic(context, row, limit=limit)
            for row in context.knowledge.execute(
                (
                    "SELECT u.* FROM unresolved_observation u "
                    "JOIN unresolved_index x ON x.session_id=u.session_id "
                    "AND x.local_unresolved_id=u.local_unresolved_id WHERE "
                    if has_unresolved_index
                    else "SELECT u.* FROM unresolved_observation u WHERE "
                )
                + " AND ".join(unresolved_clauses)
                + " ORDER BY u.session_id,u.local_unresolved_id LIMIT ? OFFSET ?",
                [*unresolved_values, limit, cursor],
            )
        ]

    controllers = []
    if controller or parsed_buttons is not None:
        clauses = []
        values = []
        if session_id is not None:
            clauses.append("session_id=?")
            values.append(session_id)
        if sequence_start is not None:
            clauses.append("bridge_sequence>=?")
            values.append(sequence_start)
        if sequence_end is not None:
            clauses.append("bridge_sequence<=?")
            values.append(sequence_end)
        if frame_start is not None:
            clauses.append("frame>=?")
            values.append(frame_start)
        if frame_end is not None:
            clauses.append("frame<=?")
            values.append(frame_end)
        if parsed_buttons is not None:
            clauses.append("buttons_u32=?")
            values.append(parsed_buttons)
        where = " WHERE " + " AND ".join(clauses) if clauses else ""
        controllers = [
            _row_dict(row)
            for row in context.knowledge.execute(
                "SELECT * FROM controller_transition"
                + where
                + " ORDER BY session_id,bridge_sequence LIMIT ? OFFSET ?",
                [*values, limit, cursor],
            )
        ]

    markers = []
    if _table_exists(context.knowledge, "semantic_marker_context") and (
        marker_text is not None or marker_type is not None or session_id is not None
    ):
        clauses = []
        values = []
        if session_id is not None:
            clauses.append("session_id=?")
            values.append(session_id)
        if marker_text is not None:
            clauses.append("lower(label || ' ' || COALESCE(note,'')) LIKE ?")
            values.append(f"%{marker_text.casefold()}%")
        if marker_type is not None:
            clauses.append("marker_type=?")
            values.append(marker_type)
        marker_where = " WHERE " + " AND ".join(clauses) if clauses else ""
        markers = [
            _marker_with_context(context, row, limit=limit)
            for row in context.knowledge.execute(
                "SELECT * FROM semantic_marker_context"
                + marker_where
                + " ORDER BY session_id,marker_id LIMIT ? OFFSET ?",
                [*values, limit, cursor],
            )
        ]

    marker_execution_context = []
    if _table_exists(context.knowledge, "marker_execution_context_record") and any(
        value is not None
        for value in (
            session_id,
            frame_start,
            frame_end,
            parsed_physical,
            parsed_opcode,
            marker_text,
            marker_type,
        )
    ):
        clauses = []
        values = []
        if session_id is not None:
            clauses.append("r.session_id=?")
            values.append(session_id)
        if frame_start is not None:
            clauses.append("r.frame>=?")
            values.append(frame_start)
        if frame_end is not None:
            clauses.append("r.frame<=?")
            values.append(frame_end)
        if parsed_physical is not None:
            clauses.append("r.physical_address=?")
            values.append(parsed_physical)
        if parsed_opcode is not None:
            clauses.append("r.opcode_u32=?")
            values.append(parsed_opcode)
        if marker_text is not None:
            clauses.append("lower(m.label || ' ' || COALESCE(m.note,'')) LIKE ?")
            values.append(f"%{marker_text.casefold()}%")
        if marker_type is not None:
            clauses.append("m.marker_type=?")
            values.append(marker_type)
        marker_execution_context = [
            _row_dict(row)
            for row in context.knowledge.execute(
                "SELECT r.*,m.marker_type,m.label FROM marker_execution_context_record r "
                "JOIN semantic_marker_context m ON m.session_id=r.session_id "
                "AND m.marker_id=r.marker_id WHERE "
                + " AND ".join(clauses)
                + " ORDER BY r.session_id,r.marker_id,r.local_order LIMIT ? OFFSET ?",
                [*values, limit, cursor],
            )
        ]

    samples = []
    if _table_exists(context.knowledge, "sampled_pc_context") and needs_event_context:
        clauses = []
        values = []
        if session_id is not None:
            clauses.append("session_id=?")
            values.append(session_id)
        if frame_start is not None:
            clauses.append("frame>=?")
            values.append(frame_start)
        if frame_end is not None:
            clauses.append("frame<=?")
            values.append(frame_end)
        if sequence_start is not None:
            clauses.append("sequence>=?")
            values.append(sequence_start)
        if sequence_end is not None:
            clauses.append("sequence<=?")
            values.append(sequence_end)
        if parsed_physical is not None:
            clauses.append("physical_pc=?")
            values.append(parsed_physical)
        if parsed_opcode is not None:
            clauses.append("opcode_u32=?")
            values.append(parsed_opcode)
        sample_where = " WHERE " + " AND ".join(clauses) if clauses else ""
        samples = [
            _row_dict(row)
            for row in context.knowledge.execute(
                "SELECT session_id,sample_id,sequence,bridge_sequence,frame,live_pc,"
                "physical_pc,opcode_u32,region_instance_id,function_id,z64_offset,"
                "mapping_status FROM sampled_pc_context"
                + sample_where
                + " ORDER BY session_id,sequence,sample_id LIMIT ? OFFSET ?",
                [*values, limit, cursor],
            )
        ]

    raw_context = None
    persistent_context_available = _table_exists(
        context.knowledge, "session_catalog"
    )
    known_activity = (
        _known_activity(
            context,
            session_id,
            function_ids=[int(row["function_id"]) for row in function_rows],
            limit=min(limit, DEFAULT_PREVIEW_LIMIT),
        )
        if session_id is not None
        else None
    )
    if not persistent_context_available and session_id is not None and any(
        value is not None
        for value in (
            frame_start,
            frame_end,
            sequence_start,
            sequence_end,
            marker_text,
            marker_type,
        )
    ):
        raw_context = _raw_session_context(
            context,
            session_id=session_id,
            frame_start=frame_start,
            frame_end=frame_end,
            sequence_start=sequence_start,
            sequence_end=sequence_end,
            opcode=parsed_opcode,
            marker_text=marker_text,
            marker_type=marker_type,
            limit=limit,
            cursor=cursor,
        )

    diagnostics = [
        _mapping_diagnostic(
            context,
            row,
            session_id=session_id,
            sequence=sequence_start,
            limit=limit,
        )
        for row in instructions
        if row["function_id"] is None or mapping_status in {"unresolved", "ambiguous"}
    ]
    return {
        "schema": "ob64-total-resolver-search.v1",
        "sourceManifest": context.manifest,
        "filters": {
            "text": text,
            "function": function,
            "rom": parsed_rom,
            "physical": parsed_physical,
            "opcode": parsed_opcode,
            "sessionId": session_id,
            "frameStart": frame_start,
            "frameEnd": frame_end,
            "sequenceStart": sequence_start,
            "sequenceEnd": sequence_end,
            "edgeFrom": parsed_edge_from,
            "edgeTo": parsed_edge_to,
            "mappingStatus": mapping_status,
            "unresolvedKind": unresolved_kind,
            "markerText": marker_text,
            "markerType": marker_type,
            "controller": controller,
            "buttons": parsed_buttons,
        },
        "counts": {
            "functions": len(functions),
            "instructions": len(instructions),
            "edges": len(edges),
            "unresolved": len(unresolved_rows),
            "controllerTransitions": len(controllers),
            "markers": len(markers),
            "sampledPcs": len(samples),
            "markerExecutionContextRecords": len(marker_execution_context),
            "rawEvents": (
                len(raw_context.get("events", []))
                if isinstance(raw_context, Mapping)
                else 0
            ),
            "knownActivityMatchingInstructions": (
                int(known_activity["matchingInstructionHitCount"])
                if known_activity is not None
                else 0
            ),
        },
        "functions": functions,
        "instructions": [_instruction_dict(row) for row in instructions],
        "edges": edges,
        "unresolved": unresolved_rows,
        "mappingDiagnostics": diagnostics,
        "controllerTransitions": controllers,
        "markers": markers,
        "sampledPcs": samples,
        "markerExecutionContext": marker_execution_context,
        "rawSessionContext": raw_context,
        "knownActivity": known_activity,
        "pagination": {
            "cursor": cursor,
            "nextCursor": cursor + limit,
            "limit": limit,
            "bounded": True,
        },
        "evidenceBoundary": (
            "Search exposes candidates and context without promoting them to accepted mappings."
        ),
    }


def open_explicit_legacy_resolver(path: Path) -> sqlite3.Connection:
    connection = open_resolver(path.resolve())
    try:
        try:
            meta = {
                str(row[0]): str(row[1])
                for row in connection.execute("SELECT key,value FROM meta")
            }
        except sqlite3.Error as exc:
            raise ValueError(
                "--legacy-resolver requires a generated Resolver database, not persistent knowledge"
            ) from exc
        if meta.get("schema") != RESOLVER_SCHEMA:
            raise ValueError(
                "--legacy-resolver requires a generated Resolver v1 database, not persistent knowledge"
            )
        return connection
    except Exception:
        connection.close()
        raise


def legacy_manifest(path: Path, connection: sqlite3.Connection) -> dict[str, Any]:
    sources = [
        {
            "sourceId": str(row["source_id"]),
            "snapshotId": str(row["snapshot_id"]),
            "reviewState": str(row["review_state"]),
        }
        for row in connection.execute("SELECT * FROM source_registry ORDER BY source_id")
    ]
    return {
        "schema": SOURCE_MANIFEST_SCHEMA,
        "mode": "legacy-resolver-explicit",
        "freshness": "historical-explicit",
        "historicalDynamicProductsUsed": True,
        "path": str(path.resolve()),
        "sources": sources,
        "warning": (
            "This generated Resolver is historical and is not the selected persistent dynamic authority."
        ),
    }
