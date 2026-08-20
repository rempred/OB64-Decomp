"""Read-only query surface for Total Resolver R3."""

from __future__ import annotations

import re
from pathlib import Path
import sqlite3
from typing import Any, Iterable

from .addressing import physical_from_live
from .resolver_sources import open_readonly


RELATIONSHIPS = frozenset(("all", "placements", "callers", "callees", "executions"))
LANES = frozenset(("static", "placement", "runtime", "field", "resource"))


def open_resolver(path: Path) -> sqlite3.Connection:
    return open_readonly(path.resolve())


def _row_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {key: row[key] for key in row.keys()}


def _hex(value: int | None) -> str | None:
    return None if value is None else f"0x{value:08X}"


def _function_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "functionId": int(row["function_id"]),
        "structuralName": str(row["structural_name"]),
        "displayName": str(row["display_name"]),
        "z64Start": int(row["z64_start"]),
        "z64EndExclusive": int(row["z64_end_exclusive"]),
        "z64Range": f"{_hex(row['z64_start'])}..{_hex(row['z64_end_exclusive'])}",
        "nominalLiveStart": row["nominal_live_start"],
        "nominalLiveEndExclusive": row["nominal_live_end_exclusive"],
        "confidence": str(row["confidence"]),
        "evidenceLane": "static",
        "evidenceBoundary": "Static identity and boundaries do not prove runtime execution.",
    }


def _functions_by_ids(
    connection: sqlite3.Connection, function_ids: Iterable[int]
) -> list[dict[str, Any]]:
    ids = sorted(set(function_ids))
    if not ids:
        return []
    marks = ",".join("?" for _ in ids)
    return [
        _function_dict(row)
        for row in connection.execute(
            f"SELECT * FROM static_function WHERE function_id IN ({marks}) "
            "ORDER BY function_id",
            ids,
        )
    ]


def _live_candidates_without_context(
    connection: sqlite3.Connection, physical: int
) -> list[dict[str, Any]]:
    candidates: dict[tuple[int, int], dict[str, Any]] = {}
    for row in connection.execute(
        "SELECT fp.*,f.structural_name,f.display_name,p.evidence_grade,p.placement_id "
        "FROM function_placement fp "
        "JOIN static_function f ON f.function_id=fp.function_id "
        "JOIN placement p ON p.placement_id=fp.slab_placement_id "
        "WHERE fp.destination_physical_start<=? "
        "AND fp.destination_physical_end_exclusive>? "
        "ORDER BY fp.function_placement_id",
        (physical, physical),
    ):
        z64 = int(row["source_z64_start"]) + physical - int(
            row["destination_physical_start"]
        )
        key = (int(row["function_id"]), z64)
        candidates[key] = {
            "functionId": int(row["function_id"]),
            "structuralName": str(row["structural_name"]),
            "z64Offset": z64,
            "functionPlacementId": str(row["function_placement_id"]),
            "placementId": str(row["placement_id"]),
            "mappingBasis": "observed-function-placement-without-residency-context",
            "evidenceGrade": str(row["evidence_grade"]),
        }
    live = 0x80000000 + physical
    for row in connection.execute(
        "SELECT * FROM static_function WHERE nominal_live_start<=? "
        "AND nominal_live_end_exclusive>? ORDER BY function_id",
        (live, live),
    ):
        z64 = int(row["z64_start"]) + live - int(row["nominal_live_start"])
        key = (int(row["function_id"]), z64)
        candidates.setdefault(
            key,
            {
                "functionId": int(row["function_id"]),
                "structuralName": str(row["structural_name"]),
                "z64Offset": z64,
                "functionPlacementId": None,
                "placementId": None,
                "mappingBasis": "static-nominal-vram-address-candidate",
                "evidenceGrade": "candidate",
            },
        )
    return [candidates[key] for key in sorted(candidates)]


def _active_regions(
    connection: sqlite3.Connection,
    physical: int,
    *,
    session_id: str,
    sequence: int | None,
    frame: int | None,
) -> list[sqlite3.Row]:
    clauses = [
        "session_id=?",
        "destination_physical_start<=?",
        "destination_physical_end_exclusive>?",
    ]
    values: list[Any] = [session_id, physical, physical]
    if sequence is not None:
        clauses.extend(
            ("first_sequence<=?", "(end_sequence_exclusive IS NULL OR end_sequence_exclusive>?)")
        )
        values.extend((sequence, sequence))
    elif frame is not None:
        clauses.extend(
            ("first_frame IS NOT NULL", "first_frame<=?", "(last_observed_frame IS NULL OR last_observed_frame>=?)")
        )
        values.extend((frame, frame))
    else:
        return []
    return list(
        connection.execute(
            "SELECT * FROM region_instance WHERE " + " AND ".join(clauses) + " ORDER BY region_instance_id",
            values,
        )
    )


def _contextual_live_candidates(
    connection: sqlite3.Connection,
    physical: int,
    *,
    session_id: str,
    sequence: int | None,
    frame: int | None,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    regions = _active_regions(
        connection,
        physical,
        session_id=session_id,
        sequence=sequence,
        frame=frame,
    )
    region_output = [
        {
            "regionInstanceId": str(row["region_instance_id"]),
            "placementId": row["placement_id"],
            "destinationPhysicalStart": int(row["destination_physical_start"]),
            "destinationPhysicalEndExclusive": int(row["destination_physical_end_exclusive"]),
            "firstSequence": int(row["first_sequence"]),
            "endSequenceExclusive": row["end_sequence_exclusive"],
            "firstFrame": row["first_frame"],
            "lastObservedFrame": row["last_observed_frame"],
            "evidenceGrade": str(row["evidence_grade"]),
        }
        for row in regions
    ]
    candidates: dict[tuple[int, int, str], dict[str, Any]] = {}
    for region in regions:
        placement_id = region["placement_id"]
        if placement_id is None:
            continue
        for row in connection.execute(
            "SELECT fp.*,f.structural_name,p.evidence_grade FROM function_placement fp "
            "JOIN static_function f ON f.function_id=fp.function_id "
            "JOIN placement p ON p.placement_id=fp.slab_placement_id "
            "WHERE fp.destination_physical_start<=? "
            "AND fp.destination_physical_end_exclusive>? "
            "AND EXISTS (SELECT 1 FROM function_placement_witness w "
            "WHERE w.function_placement_id=fp.function_placement_id AND w.session_id=?) "
            "AND (fp.slab_placement_id=? OR EXISTS (SELECT 1 FROM slab_member sm "
            "WHERE sm.slab_placement_id=fp.slab_placement_id "
            "AND sm.member_placement_id=?)) ORDER BY fp.function_placement_id",
            (physical, physical, session_id, placement_id, placement_id),
        ):
            z64 = int(row["source_z64_start"]) + physical - int(
                row["destination_physical_start"]
            )
            key = (int(row["function_id"]), z64, str(region["region_instance_id"]))
            candidates[key] = {
                "functionId": int(row["function_id"]),
                "structuralName": str(row["structural_name"]),
                "z64Offset": z64,
                "functionPlacementId": str(row["function_placement_id"]),
                "placementId": str(placement_id),
                "regionInstanceId": str(region["region_instance_id"]),
                "mappingBasis": "contemporaneous-region-and-observed-function-placement",
                "evidenceGrade": str(row["evidence_grade"]),
            }

        placement = connection.execute(
            "SELECT * FROM placement WHERE placement_id=?", (placement_id,)
        ).fetchone()
        if placement is None or placement["evidence_grade"] not in {"verified", "supported"}:
            continue
        z64 = int(placement["source_z64_start"]) + physical - int(
            placement["destination_physical_start"]
        )
        function = connection.execute(
            "SELECT * FROM static_function WHERE z64_start<=? AND z64_end_exclusive>?",
            (z64, z64),
        ).fetchall()
        if len(function) == 1:
            value = function[0]
            key = (int(value["function_id"]), z64, str(region["region_instance_id"]))
            candidates.setdefault(
                key,
                {
                    "functionId": int(value["function_id"]),
                    "structuralName": str(value["structural_name"]),
                    "z64Offset": z64,
                    "functionPlacementId": None,
                    "placementId": str(placement_id),
                    "regionInstanceId": str(region["region_instance_id"]),
                    "mappingBasis": "contemporaneous-region-direct-rom-dma-delta",
                    "evidenceGrade": str(placement["evidence_grade"]),
                },
            )
    return [candidates[key] for key in sorted(candidates)], region_output


def resolve_live_address(
    connection: sqlite3.Connection,
    live_address: int,
    *,
    session_id: str | None = None,
    sequence: int | None = None,
    frame: int | None = None,
) -> dict[str, Any]:
    physical = physical_from_live(live_address)
    context_requested = session_id is not None or sequence is not None or frame is not None
    if context_requested and session_id is None:
        raise ValueError("live sequence/frame context requires --session")
    if session_id is not None and sequence is None and frame is None:
        raise ValueError("contextual live resolution requires --sequence or --frame")
    if session_id is None:
        candidates = _live_candidates_without_context(connection, physical)
        regions: list[dict[str, Any]] = []
    else:
        candidates, regions = _contextual_live_candidates(
            connection,
            physical,
            session_id=session_id,
            sequence=sequence,
            frame=frame,
        )
    distinct = {(value["functionId"], value["z64Offset"]) for value in candidates}
    if len(distinct) == 1:
        status = "resolved"
        uncertainty = {
            "status": "bounded",
            "reason": (
                "unique supported mapping in the supplied residency context"
                if session_id is not None
                else "only one known static/placement mapping currently overlaps this address"
            ),
        }
    elif len(distinct) > 1:
        status = "ambiguous"
        uncertainty = {
            "status": "unresolved",
            "reason": "the live address has multiple supported ROM/function mappings",
            "nextEvidence": (
                "supply --session with --sequence or --frame"
                if session_id is None
                else "use exact sequence context or capture a missing region boundary"
            ),
        }
    else:
        status = "unsupported"
        uncertainty = {
            "status": "unresolved",
            "reason": "no supported static mapping exists in the selected context",
            "nextEvidence": "capture the contemporaneous load/region or inspect unresolved observations",
        }
    return {
        "status": status,
        "liveAddress": live_address,
        "physicalAddress": physical,
        "sessionId": session_id,
        "sequence": sequence,
        "frame": frame,
        "candidates": candidates,
        "activeRegions": regions,
        "uncertainty": uncertainty,
    }


def _function_placements(
    connection: sqlite3.Connection, function_ids: list[int], limit: int
) -> list[dict[str, Any]]:
    if not function_ids:
        return []
    marks = ",".join("?" for _ in function_ids)
    rows = connection.execute(
        f"SELECT fp.*,p.evidence_grade,p.transient_only,p.content_sha256 "
        "FROM function_placement fp JOIN placement p "
        "ON p.placement_id=fp.slab_placement_id "
        f"WHERE fp.function_id IN ({marks}) ORDER BY fp.function_placement_id LIMIT ?",
        [*function_ids, limit],
    )
    result = []
    for row in rows:
        sessions = [
            {
                "sessionId": value["session_id"],
                "firstSequence": value["first_sequence"],
                "lastSequence": value["last_sequence"],
                "firstFrame": value["first_frame"],
                "lastFrame": value["last_frame"],
            }
            for value in connection.execute(
                "SELECT * FROM function_placement_witness "
                "WHERE function_placement_id=? ORDER BY session_id,local_placement_id",
                (row["function_placement_id"],),
            )
        ]
        result.append(
            {
                "functionPlacementId": row["function_placement_id"],
                "functionId": row["function_id"],
                "slabPlacementId": row["slab_placement_id"],
                "sourceZ64Start": row["source_z64_start"],
                "sourceZ64EndExclusive": row["source_z64_end_exclusive"],
                "destinationPhysicalStart": row["destination_physical_start"],
                "destinationPhysicalEndExclusive": row["destination_physical_end_exclusive"],
                "destinationLiveStart": 0x80000000 + int(row["destination_physical_start"]),
                "destinationLiveEndExclusive": 0x80000000
                + int(row["destination_physical_end_exclusive"]),
                "evidenceGrade": row["evidence_grade"],
                "mappingMethod": row["mapping_method"],
                "transientOnly": bool(row["transient_only"]),
                "sessions": sessions,
                "evidenceLane": "placement",
                "claimLimit": "Residency/placement is not execution.",
            }
        )
    return result


def _function_executions(
    connection: sqlite3.Connection, function_ids: list[int], limit: int
) -> dict[str, Any]:
    if not function_ids:
        return {"exact": [], "sampledContext": []}
    marks = ",".join("?" for _ in function_ids)
    values: dict[str, list[dict[str, Any]]] = {"exact": [], "sampledContext": []}
    rows = connection.execute(
        f"SELECT * FROM runtime_execution WHERE function_id IN ({marks}) "
        "ORDER BY session_id,sequence,runtime_execution_id LIMIT ?",
        [*function_ids, limit],
    )
    for row in rows:
        target = "exact" if row["execution_claim"] == "observed" else "sampledContext"
        values[target].append(
            {
                "runtimeExecutionId": row["runtime_execution_id"],
                "sessionId": row["session_id"],
                "sequence": row["sequence"],
                "frame": row["frame"],
                "livePc": row["live_pc"],
                "z64Offset": row["z64_offset"],
                "regionInstanceId": row["region_instance_id"],
                "mappingStatus": row["mapping_status"],
                "evidenceGrade": row["evidence_grade"],
                "reviewState": row["review_state"],
                "claim": row["execution_claim"],
            }
        )
    return values


def _function_relationships(
    connection: sqlite3.Connection,
    function_ids: list[int],
    relationship: str,
    limit: int,
) -> dict[str, Any]:
    if not function_ids:
        return {"callers": [], "callees": [], "observedEdges": []}
    marks = ",".join("?" for _ in function_ids)
    callers: list[dict[str, Any]] = []
    callees: list[dict[str, Any]] = []
    if relationship in {"all", "callers"}:
        callers = [
            _row_dict(row)
            for row in connection.execute(
                f"SELECT c.call_id,c.instruction_z64,c.caller_function_id,"
                "caller.structural_name AS caller_name,cc.callee_function_id,"
                "callee.structural_name AS callee_name,cc.method,cc.confidence "
                "FROM static_call_candidate cc JOIN static_call c ON c.call_id=cc.call_id "
                "LEFT JOIN static_function caller ON caller.function_id=c.caller_function_id "
                "LEFT JOIN static_function callee ON callee.function_id=cc.callee_function_id "
                f"WHERE cc.callee_function_id IN ({marks}) ORDER BY c.call_id LIMIT ?",
                [*function_ids, limit],
            )
        ]
    if relationship in {"all", "callees"}:
        callees = [
            _row_dict(row)
            for row in connection.execute(
                f"SELECT c.call_id,c.instruction_z64,c.caller_function_id,"
                "caller.structural_name AS caller_name,cc.callee_function_id,"
                "callee.structural_name AS callee_name,cc.method,cc.confidence "
                "FROM static_call c LEFT JOIN static_call_candidate cc ON cc.call_id=c.call_id "
                "LEFT JOIN static_function caller ON caller.function_id=c.caller_function_id "
                "LEFT JOIN static_function callee ON callee.function_id=cc.callee_function_id "
                f"WHERE c.caller_function_id IN ({marks}) ORDER BY c.call_id LIMIT ?",
                [*function_ids, limit],
            )
        ]
    observed = [
        _row_dict(row)
        for row in connection.execute(
            f"SELECT * FROM runtime_edge WHERE caller_function_id IN ({marks}) "
            f"OR callee_function_id IN ({marks}) ORDER BY observed_edge_id LIMIT ?",
            [*function_ids, *function_ids, limit],
        )
    ]
    return {"callers": callers, "callees": callees, "observedEdges": observed}


def _function_fields(
    connection: sqlite3.Connection, function_ids: list[int], limit: int
) -> dict[str, Any]:
    if not function_ids:
        return {"staticAccessCount": 0, "fields": [], "unassignedAccessCount": 0}
    marks = ",".join("?" for _ in function_ids)
    total = int(
        connection.execute(
            f"SELECT COUNT(*) FROM field_access WHERE function_id IN ({marks})", function_ids
        ).fetchone()[0]
    )
    unassigned = int(
        connection.execute(
            f"SELECT COUNT(*) FROM field_access WHERE function_id IN ({marks}) "
            "AND field_id IS NULL",
            function_ids,
        ).fetchone()[0]
    )
    rows = connection.execute(
        f"SELECT fc.field_id,fc.field_key,fc.field_label,fc.semantic_label,"
        "fc.displacement_signed,ff.family_id,ff.family_key,ff.label AS family_label,"
        "fc.evidence_grade,COUNT(*) AS access_count "
        "FROM field_access fa JOIN field_candidate fc ON fc.field_id=fa.field_id "
        "JOIN field_family ff ON ff.family_id=fc.family_id "
        f"WHERE fa.function_id IN ({marks}) GROUP BY fc.field_id "
        "ORDER BY access_count DESC,fc.field_id LIMIT ?",
        [*function_ids, limit],
    )
    return {
        "staticAccessCount": total,
        "unassignedAccessCount": unassigned,
        "fields": [_row_dict(row) for row in rows],
        "evidenceLane": "field",
        "claimLimit": "Static field grouping is not runtime access evidence.",
    }


def _function_resources(
    connection: sqlite3.Connection, functions: list[dict[str, Any]], limit: int
) -> list[dict[str, Any]]:
    result: dict[str, dict[str, Any]] = {}
    for function in functions:
        rows = connection.execute(
            "SELECT DISTINCT r.resource_id,r.logical_key,r.label,r.disposition,"
            "r.evidence_grade,c.chain_id,l.loader_id,l.structural_name AS loader_name,"
            "cs.callsite_id,cs.instruction_z64 FROM resource_callsite cs "
            "JOIN resource_loader l ON l.loader_id=cs.loader_id "
            "JOIN resource_chain c ON c.loader_id=l.loader_id "
            "JOIN resource r ON r.resource_id=c.resource_id "
            "WHERE lower(cs.caller_name)=lower(?) OR "
            "(cs.caller_z64>=? AND cs.caller_z64<?) "
            "ORDER BY r.resource_id,c.chain_id LIMIT ?",
            (
                function["structuralName"],
                function["z64Start"],
                function["z64EndExclusive"],
                limit,
            ),
        )
        for row in rows:
            key = str(row["resource_id"]) + ":" + str(row["chain_id"])
            result[key] = _row_dict(row)
    return [result[key] for key in sorted(result)[:limit]]


def _query_fields(
    connection: sqlite3.Connection,
    *,
    identifier: str | None = None,
    displacement: int | None = None,
    z64: int | None = None,
    limit: int,
) -> list[dict[str, Any]]:
    if displacement is not None:
        query = (
            "SELECT fc.*,ff.family_key,ff.label AS family_label,ff.lineage_basis,"
            "ff.scope AS family_scope FROM field_candidate fc JOIN field_family ff "
            "ON ff.family_id=fc.family_id WHERE fc.displacement_signed=? "
            "ORDER BY fc.evidence_grade DESC,fc.field_id LIMIT ?"
        )
        values: list[Any] = [displacement, limit]
    elif z64 is not None:
        query = (
            "SELECT fc.*,ff.family_key,ff.label AS family_label,ff.lineage_basis,"
            "ff.scope AS family_scope FROM field_access fa LEFT JOIN field_candidate fc "
            "ON fc.field_id=fa.field_id LEFT JOIN field_family ff ON ff.family_id=fa.family_id "
            "WHERE fa.instruction_z64=? ORDER BY fc.field_id LIMIT ?"
        )
        values = [z64, limit]
    else:
        assert identifier is not None
        value = identifier.casefold()
        numeric = None
        if value.startswith("field:"):
            try:
                numeric = int(identifier.split(":", 1)[1], 0)
            except ValueError:
                numeric = None
        query = (
            "SELECT DISTINCT fc.*,ff.family_key,ff.label AS family_label,ff.lineage_basis,"
            "ff.scope AS family_scope FROM field_candidate fc JOIN field_family ff "
            "ON ff.family_id=fc.family_id LEFT JOIN field_alias fa ON fa.field_id=fc.field_id "
            "WHERE lower(fc.field_key)=? OR lower(COALESCE(fc.semantic_label,''))=? "
            "OR lower(COALESCE(fa.alias_label,''))=? OR fc.field_id=? "
            "ORDER BY fc.field_id LIMIT ?"
        )
        values = [value, value, value, numeric, limit]
    return [_row_dict(row) for row in connection.execute(query, values)]


def _query_resources(
    connection: sqlite3.Connection,
    *,
    identifier: str | None = None,
    z64: int | None = None,
    limit: int,
) -> list[dict[str, Any]]:
    if z64 is not None:
        rows = connection.execute(
            "SELECT DISTINCT r.*,rr.entity_kind,rr.entity_id,rr.role,rr.z64_start,"
            "rr.z64_end_exclusive FROM resource_range rr LEFT JOIN resource r "
            "ON r.resource_id=rr.resource_id WHERE rr.z64_start<=? "
            "AND rr.z64_end_exclusive>? ORDER BY r.resource_id,rr.range_id LIMIT ?",
            (z64, z64, limit),
        )
    else:
        assert identifier is not None
        raw_value = identifier.casefold()
        stripped_value = (
            identifier.split(":", 1)[1].casefold()
            if raw_value.startswith("resource:")
            else raw_value
        )
        rows = connection.execute(
            "SELECT DISTINCT r.*,NULL AS entity_kind,NULL AS entity_id,NULL AS role,"
            "NULL AS z64_start,NULL AS z64_end_exclusive FROM resource r "
            "LEFT JOIN resource_alias a ON a.resource_id=r.resource_id "
            "WHERE lower(r.resource_id) IN (?,?) OR lower(r.logical_key) IN (?,?) "
            "OR lower(COALESCE(r.label,'')) IN (?,?) "
            "OR lower(COALESCE(a.alias_value,'')) IN (?,?) "
            "OR lower(COALESCE(a.alias_id,'')) IN (?,?) ORDER BY r.resource_id LIMIT ?",
            (
                raw_value,
                stripped_value,
                raw_value,
                stripped_value,
                raw_value,
                stripped_value,
                raw_value,
                stripped_value,
                raw_value,
                stripped_value,
                limit,
            ),
        )
    return [_row_dict(row) for row in rows]


def explain(
    connection: sqlite3.Connection,
    identifier: str,
    *,
    session_id: str | None = None,
    sequence: int | None = None,
    frame: int | None = None,
    lane: str | None = None,
    relationship: str = "all",
    limit: int = 100,
) -> tuple[dict[str, Any], int]:
    if limit <= 0:
        raise ValueError("limit must be positive")
    if lane is not None and lane not in LANES:
        raise ValueError(f"unsupported evidence lane: {lane}")
    if relationship not in RELATIONSHIPS:
        raise ValueError(f"unsupported relationship view: {relationship}")
    value = identifier.strip()
    lower = value.casefold()
    function_ids: list[int] = []
    live_resolution: dict[str, Any] | None = None
    fields: list[dict[str, Any]] = []
    resources: list[dict[str, Any]] = []
    identifier_kind = "identifier"

    if lower.startswith("live:") or lower.startswith("ram:") or lower.startswith("physical:"):
        prefix, number_text = value.split(":", 1)
        number = int(number_text, 0)
        live = 0x80000000 + number if prefix.casefold() in {"ram", "physical"} else number
        identifier_kind = "live-kseg-address"
        live_resolution = resolve_live_address(
            connection,
            live,
            session_id=session_id,
            sequence=sequence,
            frame=frame,
        )
        function_ids = sorted({int(row["functionId"]) for row in live_resolution["candidates"]})
    elif lower.startswith("field-offset:"):
        identifier_kind = "structure-field-offset"
        displacement = int(value.split(":", 1)[1], 0)
        if lane in {None, "field"}:
            fields = _query_fields(connection, displacement=displacement, limit=limit)
    elif lower.startswith(("rom:", "z64:")) or lower.startswith("0x") or re.fullmatch(
        r"[0-9a-fA-F]{4,8}", value
    ):
        identifier_kind = "z64-rom-offset"
        number = int(value.split(":", 1)[1], 0) if ":" in value else int(value, 0 if lower.startswith("0x") else 16)
        function_ids = [
            int(row[0])
            for row in connection.execute(
                "SELECT function_id FROM static_function WHERE z64_start<=? "
                "AND z64_end_exclusive>? ORDER BY function_id",
                (number, number),
            )
        ]
        if lane in {None, "field"}:
            fields = _query_fields(connection, z64=number, limit=limit)
        if lane in {None, "resource"}:
            resources = _query_resources(connection, z64=number, limit=limit)
    elif lower.startswith("id:"):
        identifier_kind = "function-id"
        function_ids = [int(value.split(":", 1)[1], 0)]
    else:
        function_rows = connection.execute(
            "SELECT function_id FROM static_function WHERE lower(structural_name)=? "
            "OR lower(display_name)=? ORDER BY function_id",
            (lower, lower),
        ).fetchall()
        function_ids = [int(row[0]) for row in function_rows]
        if lane in {None, "field"}:
            fields = _query_fields(connection, identifier=value, limit=limit)
        if lane in {None, "resource"}:
            resources = _query_resources(connection, identifier=value, limit=limit)

    functions = _functions_by_ids(connection, function_ids) if lane in {None, "static", "placement", "runtime", "field", "resource"} else []
    placements = (
        _function_placements(connection, function_ids, limit)
        if lane in {None, "placement"} and relationship in {"all", "placements"}
        else []
    )
    executions = (
        _function_executions(connection, function_ids, limit)
        if lane in {None, "runtime"} and relationship in {"all", "executions"}
        else {"exact": [], "sampledContext": []}
    )
    relationships = (
        _function_relationships(connection, function_ids, relationship, limit)
        if lane in {None, "static", "runtime"}
        else {"callers": [], "callees": [], "observedEdges": []}
    )
    function_fields = (
        _function_fields(connection, function_ids, limit)
        if function_ids and lane in {None, "field"}
        else {"staticAccessCount": 0, "fields": [], "unassignedAccessCount": 0}
    )
    function_resources = (
        _function_resources(connection, functions, limit)
        if functions and lane in {None, "resource"}
        else []
    )
    if function_resources:
        existing = {(row.get("resource_id"), row.get("chain_id")) for row in resources}
        resources.extend(
            row
            for row in function_resources
            if (row.get("resource_id"), row.get("chain_id")) not in existing
        )

    any_result = bool(functions or fields or resources)
    if live_resolution is not None:
        resolution_status = live_resolution["status"]
    else:
        resolution_status = "resolved" if any_result else "unsupported"
    coverage = []
    if function_ids:
        marks = ",".join("?" for _ in function_ids)
        coverage = [
            _row_dict(row)
            for row in connection.execute(
                f"SELECT c.*,f.structural_name FROM function_coverage c "
                f"JOIN static_function f ON f.function_id=c.function_id "
                f"WHERE c.function_id IN ({marks}) ORDER BY c.function_id",
                function_ids,
            )
        ]
    payload = {
        "query": {
            "identifier": identifier,
            "identifierKind": identifier_kind,
            "sessionId": session_id,
            "sequence": sequence,
            "frame": frame,
            "lane": lane,
            "relationship": relationship,
            "limit": limit,
        },
        "resolutionStatus": resolution_status,
        "liveResolution": live_resolution,
        "functions": functions,
        "placements": placements,
        "executions": executions,
        "relationships": relationships,
        "fieldLane": {"directMatches": fields, "functionContext": function_fields},
        "resourceLane": {"matches": resources},
        "coverage": coverage,
        "evidenceBoundary": (
            "Lanes are reported separately. Placement is not execution, sampled PCs are "
            "context only, and equal field offsets do not establish one structure identity."
        ),
    }
    return payload, 0 if resolution_status == "resolved" else 2


def unresolved_report(
    connection: sqlite3.Connection,
    *,
    lane: str | None = None,
    limit: int = 100,
) -> dict[str, Any]:
    if limit <= 0:
        raise ValueError("limit must be positive")
    tables = {
        "static": ("static_unresolved", "unresolved_id"),
        "resource": ("resource_unresolved", "unresolved_id"),
        "field": ("field_unresolved", "unresolved_id"),
        "placement": ("placement_unresolved", "unresolved_id"),
        "runtime": ("runtime_unresolved", "unresolved_id"),
    }
    selected = {lane: tables[lane]} if lane else tables
    output: dict[str, Any] = {}
    for name, (table, key) in selected.items():
        count = int(connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
        rows = [
            _row_dict(row)
            for row in connection.execute(
                f"SELECT * FROM {table} ORDER BY {key} LIMIT ?", (limit,)
            )
        ]
        output[name] = {"count": count, "sample": rows, "sampleTruncated": count > len(rows)}
    return {
        "schema": "ob64-total-resolver-r3-unresolved-report.v1",
        "lanes": output,
        "note": "Unresolved rows are work queues, not failures or claims that no mapping exists.",
    }
