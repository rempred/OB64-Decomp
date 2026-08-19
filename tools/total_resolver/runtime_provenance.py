"""Runtime Provenance 2.0 generation without turning residency into execution."""

from __future__ import annotations

from collections import defaultdict
import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping, Sequence

from .capture_db import canonical_json
from .derive_transition import default_static_database, _write_json, _write_ndjson
from .inventory import repository_root
from .overlay_atlas import (
    SessionProduct,
    _read_ndjson,
    load_session_product,
    verify_overlay_atlas,
)
from .static_model import StaticModel


RUNTIME_SCHEMA = "ob64-runtime-provenance-2.v1"
RUNTIME_SCHEMA_VERSION = 1
LOGICAL_TABLES = (
    "source_session",
    "execution_observation",
    "memory_access",
    "observed_edge",
    "runtime_unresolved",
    "runtime_conflict",
    "static_function_runtime_coverage",
)


def runtime_products_root(explicit: Path | None = None) -> Path:
    return (
        explicit
        or repository_root()
        / "build"
        / "total-resolver"
        / "products"
        / "runtime-provenance-2"
    ).resolve()


def runtime_schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "runtime_provenance.sql"


def _optional_rows(product: SessionProduct, name: str) -> tuple[Mapping[str, Any], ...]:
    files = product.summary.get("files")
    relative = files.get(name) if isinstance(files, Mapping) else None
    if not isinstance(relative, str):
        return ()
    return _read_ndjson(product.root / relative)


def _stable_id(prefix: str, value: Mapping[str, Any]) -> str:
    digest = hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest().upper()
    return f"{prefix}:{digest}"


def _logical_hash(connection: sqlite3.Connection) -> str:
    digest = hashlib.sha256()
    for table in LOGICAL_TABLES:
        columns = [str(row[1]) for row in connection.execute(f"PRAGMA table_info({table})")]
        order = ", ".join(columns)
        rows = connection.execute(f"SELECT * FROM {table} ORDER BY {order}").fetchall()
        payload = canonical_json(
            {"table": table, "columns": columns, "rows": [list(row) for row in rows]}
        ).encode("utf-8")
        digest.update(len(payload).to_bytes(8, "big"))
        digest.update(payload)
    return digest.hexdigest().upper()


def _integer_or_none(value: Any) -> int | None:
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        try:
            return int(value, 0)
        except ValueError:
            return None
    return None


def _insert_all(
    connection: sqlite3.Connection,
    table: str,
    columns: Sequence[str],
    rows: Iterable[Sequence[Any]],
) -> None:
    connection.executemany(
        f"INSERT INTO {table}({','.join(columns)}) VALUES({','.join('?' for _ in columns)})",
        rows,
    )


def _atlas_context(path: Path) -> tuple[dict[str, str], dict[tuple[str, str], dict[str, Any]]]:
    verification = verify_overlay_atlas(path)
    if verification["result"] != "PASS":
        raise ValueError("Overlay Atlas 2.0 input does not verify")
    database = path.resolve() / "overlay-atlas.sqlite"
    connection = sqlite3.connect(f"file:{database.as_posix()}?mode=ro", uri=True)
    connection.row_factory = sqlite3.Row
    try:
        sessions = {
            str(row[0]): str(row[1])
            for row in connection.execute(
                "SELECT session_id, session_product_summary_sha256 FROM source_session"
            )
        }
        regions = {
            (str(row["session_id"]), str(row["local_region_instance_id"])): dict(row)
            for row in connection.execute("SELECT * FROM region_instance")
        }
    finally:
        connection.close()
    return sessions, regions


def _valid_region_context(
    region: Mapping[str, Any] | None,
    *,
    sequence: int,
    physical_pc: int,
) -> bool:
    return bool(
        region is not None
        and int(region["destination_physical_start"]) <= physical_pc
        < int(region["destination_physical_end_exclusive"])
        and int(region["first_sequence"]) <= sequence
        and (
            region["end_sequence_exclusive"] is None
            or sequence < int(region["end_sequence_exclusive"])
        )
    )


def build_runtime_provenance(
    session_product_paths: Sequence[Path],
    *,
    overlay_atlas: Path,
    output_directory: Path | None = None,
    static_database: Path | None = None,
) -> dict[str, Any]:
    if not session_product_paths:
        raise ValueError("at least one session product is required")
    products = sorted(
        (load_session_product(path) for path in session_product_paths),
        key=lambda item: item.session_id,
    )
    if len({item.session_id for item in products}) != len(products):
        raise ValueError("Runtime Provenance inputs contain duplicate session IDs")
    atlas_sessions, atlas_regions = _atlas_context(overlay_atlas)
    missing = [item.session_id for item in products if item.session_id not in atlas_sessions]
    if missing:
        raise ValueError(
            "Runtime Provenance session is absent from Overlay Atlas 2.0: " + ", ".join(missing)
        )
    stale = [
        item.session_id
        for item in products
        if atlas_sessions[item.session_id] != item.summary_sha256
    ]
    if stale:
        raise ValueError(
            "Runtime Provenance session product identity differs from Overlay Atlas 2.0: "
            + ", ".join(stale)
        )
    static = StaticModel(static_database or default_static_database())

    executions: list[dict[str, Any]] = []
    accesses: list[dict[str, Any]] = []
    edges: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    conflicts: list[dict[str, Any]] = []

    for product in products:
        execution_values = _optional_rows(product, "executionObservations")
        native_function_candidates: defaultdict[
            tuple[int, int], set[tuple[int, str]]
        ] = defaultdict(set)
        for value in execution_values:
            if (
                value.get("observationKind") != "native-exact-coverage"
                or value.get("codePageContentResolved") is not True
            ):
                continue
            content_id = value.get("codePageContentId")
            function = value.get("function")
            if not isinstance(content_id, int) or isinstance(content_id, bool):
                continue
            if not isinstance(function, Mapping):
                continue
            sequence = int(value["sequence"])
            physical_pc = int(value["physicalPc"])
            local_region = value.get("regionInstanceId")
            region = (
                atlas_regions.get((product.session_id, str(local_region)))
                if local_region is not None
                else None
            )
            contextual_mapping = bool(
                _valid_region_context(
                    region, sequence=sequence, physical_pc=physical_pc
                )
                or value.get("mappingMethod") == "accepted-static-nominal-vram"
            )
            if contextual_mapping:
                native_function_candidates[(content_id, int(value["pc"]))].add(
                    (int(function["functionId"]), str(function["structuralName"]))
                )

        for ordinal, value in enumerate(execution_values, 1):
            local_id = str(value.get("executionObservationId") or f"execution:{ordinal:08d}")
            sequence = int(value["sequence"])
            physical_pc = int(value["physicalPc"])
            local_region = value.get("regionInstanceId")
            region = (
                atlas_regions.get((product.session_id, str(local_region)))
                if local_region is not None
                else None
            )
            region_valid = _valid_region_context(
                region, sequence=sequence, physical_pc=physical_pc
            )
            if region is not None and not region_valid:
                conflict = {
                    "conflictKind": "execution-region-lifetime-or-range-mismatch",
                    "sessionId": product.session_id,
                    "sequence": sequence,
                    "livePc": int(value["pc"]),
                    "localRegionInstanceId": local_region,
                }
                conflicts.append(
                    {
                        "conflictId": _stable_id("runtime-conflict", conflict),
                        **conflict,
                    }
                )
                region = None
            function = value.get("function")
            function_id = (
                int(function["functionId"]) if isinstance(function, Mapping) else None
            )
            structural_name = (
                str(function["structuralName"]) if isinstance(function, Mapping) else None
            )
            claim = str(value.get("executionClaim") or "sampled-only")
            mapping_method = value.get("mappingMethod")
            contextual_mapping = bool(
                (region_valid and function_id is not None)
                or (
                    mapping_method == "accepted-static-nominal-vram"
                    and function_id is not None
                )
            )
            if claim == "observed":
                evidence_grade = "verified" if contextual_mapping and region_valid else (
                    "supported" if contextual_mapping else "unresolved"
                )
            else:
                evidence_grade = "candidate"
            mapping_status = (
                "contextual-region"
                if region_valid
                else "static-nominal"
                if mapping_method == "accepted-static-nominal-vram" and function_id is not None
                else "outside-dynamic-scope"
                if value.get("status") == "outside-dynamic-safety-scope"
                else "unresolved"
            )
            runtime_id = f"{product.session_id}:{local_id}"
            record = {
                "runtimeExecutionId": runtime_id,
                "sessionId": product.session_id,
                "localExecutionId": local_id,
                "sequence": sequence,
                "bridgeSequence": value.get("bridgeSequence"),
                "frame": value.get("frame"),
                "livePc": int(value["pc"]),
                "physicalPc": physical_pc,
                "observationKind": str(value["observationKind"]),
                "executionClaim": claim,
                "atlasRegionInstanceId": (
                    str(region["atlas_region_instance_id"]) if region_valid else None
                ),
                "z64Offset": value.get("romOffset"),
                "functionId": function_id,
                "structuralName": structural_name,
                "mappingMethod": mapping_method,
                "mappingStatus": mapping_status,
                "evidenceGrade": evidence_grade,
                "registerSnapshotJson": (
                    canonical_json(value["registerSnapshot"])
                    if isinstance(value.get("registerSnapshot"), Mapping)
                    else None
                ),
                "returnAddress": _integer_or_none(value.get("returnAddress")),
                "reviewState": "generated-unreviewed",
            }
            executions.append(record)
            if claim == "observed" and not contextual_mapping:
                unresolved_record = {
                    "unresolvedId": f"unresolved-execution:{runtime_id}",
                    "kind": "observed-execution-without-contextual-static-mapping",
                    "sequence": sequence,
                    "frame": value.get("frame"),
                    "pc": int(value["pc"]),
                    "nextEvidence": "capture or repair the contemporaneous placement for this exact watch hit",
                }
                unresolved.append(
                    {
                        "runtimeUnresolvedId": f"{product.session_id}:{unresolved_record['unresolvedId']}",
                        "sessionId": product.session_id,
                        "localUnresolvedId": unresolved_record["unresolvedId"],
                        "kind": unresolved_record["kind"],
                        "sequence": sequence,
                        "frame": value.get("frame"),
                        "payloadJson": canonical_json(unresolved_record),
                    }
                )

            previous = value.get("previous")
            if (
                claim == "observed"
                and value.get("observationKind") == "native-exact-coverage"
                and value.get("newEdge") is True
                and value.get("codePageContentResolved") is True
                and isinstance(previous, Mapping)
                and previous.get("exactContentResolved") is True
            ):
                try:
                    caller_pc = int(str(previous["pc"]), 0)
                    previous_content_id = int(previous["codePageContentId"])
                except (KeyError, TypeError, ValueError):
                    pass
                else:
                    candidates = native_function_candidates.get(
                        (previous_content_id, caller_pc), set()
                    )
                    caller_mapping = next(iter(candidates)) if len(candidates) == 1 else None
                    edge_key = {
                        "schema": "ob64-runtime-observed-edge-key.v1",
                        "sessionId": product.session_id,
                        "executionSequence": sequence,
                        "callerLivePc": caller_pc,
                        "calleeLivePc": int(value["pc"]),
                        "sourceCodePageContentId": previous_content_id,
                        "destinationCodePageContentId": value.get("codePageContentId"),
                    }
                    edges.append(
                        {
                            "observedEdgeId": _stable_id("observed-edge", edge_key),
                            "sessionId": product.session_id,
                            "executionSequence": sequence,
                            "callerLivePc": caller_pc,
                            "calleeLivePc": int(value["pc"]),
                            "callerFunctionId": (
                                caller_mapping[0] if caller_mapping is not None else None
                            ),
                            "callerStructuralName": (
                                caller_mapping[1] if caller_mapping is not None else None
                            ),
                            "calleeFunctionId": function_id if contextual_mapping else None,
                            "calleeStructuralName": (
                                structural_name if contextual_mapping else None
                            ),
                            "edgeKind": "native-exact-instruction-transition",
                            "evidenceGrade": "verified",
                            "reviewState": "generated-unreviewed",
                        }
                    )

            return_address = record["returnAddress"]
            if claim == "observed" and return_address is not None and function_id is not None:
                caller_pc = (return_address - 8) & 0xFFFFFFFF
                caller = static.resolve_nominal_pc(caller_pc)
                if caller is not None:
                    edge_key = {
                        "schema": "ob64-runtime-observed-edge-key.v1",
                        "sessionId": product.session_id,
                        "executionSequence": sequence,
                        "callerLivePc": caller_pc,
                        "calleeLivePc": int(value["pc"]),
                    }
                    edges.append(
                        {
                            "observedEdgeId": _stable_id("observed-edge", edge_key),
                            "sessionId": product.session_id,
                            "executionSequence": sequence,
                            "callerLivePc": caller_pc,
                            "calleeLivePc": int(value["pc"]),
                            "callerFunctionId": caller.function_id,
                            "callerStructuralName": caller.structural_name,
                            "calleeFunctionId": function_id,
                            "calleeStructuralName": structural_name,
                            "edgeKind": "return-address-derived-entry-watch",
                            "evidenceGrade": "supported",
                            "reviewState": "generated-unreviewed",
                        }
                    )

        for ordinal, value in enumerate(_optional_rows(product, "memoryAccesses"), 1):
            local_id = str(value.get("memoryAccessId") or f"memory-access:{ordinal:08d}")
            sequence = int(value["sequence"])
            physical_pc = int(value["accessorPhysicalPc"])
            local_region = value.get("regionInstanceId")
            region = (
                atlas_regions.get((product.session_id, str(local_region)))
                if local_region is not None
                else None
            )
            region_valid = _valid_region_context(
                region, sequence=sequence, physical_pc=physical_pc
            )
            function = value.get("function")
            accesses.append(
                {
                    "runtimeMemoryAccessId": f"{product.session_id}:{local_id}",
                    "sessionId": product.session_id,
                    "localMemoryAccessId": local_id,
                    "sequence": sequence,
                    "bridgeSequence": int(value["bridgeSequence"]),
                    "frame": value.get("frame"),
                    "accessKind": str(value["accessKind"]),
                    "widthBits": value.get("widthBits"),
                    "effectiveAddress": int(value["effectiveAddress"]),
                    "valueText": value.get("value"),
                    "valueHighText": value.get("valueHigh"),
                    "accessorLivePc": int(value["accessorPc"]),
                    "accessorPhysicalPc": physical_pc,
                    "atlasRegionInstanceId": (
                        str(region["atlas_region_instance_id"]) if region_valid else None
                    ),
                    "z64Instruction": value.get("romOffset"),
                    "functionId": (
                        int(function["functionId"]) if isinstance(function, Mapping) else None
                    ),
                    "structuralName": (
                        str(function["structuralName"])
                        if isinstance(function, Mapping)
                        else None
                    ),
                    "mappingMethod": value.get("mappingMethod"),
                    "reviewState": "generated-unreviewed",
                }
            )

        for value in product.unresolved:
            if str(value.get("kind")) not in {"resident-unmapped", "unknown-region"}:
                continue
            local_id = str(value.get("unresolvedId"))
            runtime_id = f"{product.session_id}:{local_id}"
            if any(item["runtimeUnresolvedId"] == runtime_id for item in unresolved):
                continue
            unresolved.append(
                {
                    "runtimeUnresolvedId": runtime_id,
                    "sessionId": product.session_id,
                    "localUnresolvedId": local_id,
                    "kind": str(value["kind"]),
                    "sequence": value.get("sequence"),
                    "frame": value.get("frame"),
                    "payloadJson": canonical_json(value),
                }
            )

    exact_by_function: dict[int, int] = defaultdict(int)
    sampled_by_function: dict[int, int] = defaultdict(int)
    memory_by_function: dict[int, int] = defaultdict(int)
    for value in executions:
        if value["functionId"] is None:
            continue
        if value["executionClaim"] == "observed":
            if value["evidenceGrade"] in {"verified", "supported"}:
                exact_by_function[int(value["functionId"])] += 1
        else:
            sampled_by_function[int(value["functionId"])] += 1
    for value in accesses:
        if value["functionId"] is not None:
            memory_by_function[int(value["functionId"])] += 1

    destination = runtime_products_root(output_directory)
    destination.mkdir(parents=True, exist_ok=True)
    database = destination / "runtime-provenance.sqlite"
    temporary = database.with_name(database.name + ".tmp")
    if temporary.exists():
        temporary.unlink()
    connection = sqlite3.connect(temporary)
    try:
        connection.executescript(runtime_schema_path().read_text(encoding="utf-8"))
        _insert_all(
            connection,
            "source_session",
            (
                "session_id",
                "session_product_summary_sha256",
                "overlay_source_present",
                "continuity_status",
                "working_evidence_quality",
            ),
            (
                (
                    item.session_id,
                    item.summary_sha256,
                    1,
                    item.summary["rawSession"]["continuityStatus"],
                    item.summary["workingEvidenceQuality"],
                )
                for item in products
            ),
        )
        _insert_all(
            connection,
            "execution_observation",
            (
                "runtime_execution_id",
                "session_id",
                "local_execution_id",
                "sequence",
                "bridge_sequence",
                "frame",
                "live_pc",
                "physical_pc",
                "observation_kind",
                "execution_claim",
                "atlas_region_instance_id",
                "z64_offset",
                "function_id",
                "structural_name",
                "mapping_method",
                "mapping_status",
                "evidence_grade",
                "register_snapshot_json",
                "return_address",
                "review_state",
            ),
            (
                (
                    item["runtimeExecutionId"],
                    item["sessionId"],
                    item["localExecutionId"],
                    item["sequence"],
                    item["bridgeSequence"],
                    item["frame"],
                    item["livePc"],
                    item["physicalPc"],
                    item["observationKind"],
                    item["executionClaim"],
                    item["atlasRegionInstanceId"],
                    item["z64Offset"],
                    item["functionId"],
                    item["structuralName"],
                    item["mappingMethod"],
                    item["mappingStatus"],
                    item["evidenceGrade"],
                    item["registerSnapshotJson"],
                    item["returnAddress"],
                    item["reviewState"],
                )
                for item in sorted(executions, key=lambda value: value["runtimeExecutionId"])
            ),
        )
        _insert_all(
            connection,
            "memory_access",
            (
                "runtime_memory_access_id",
                "session_id",
                "local_memory_access_id",
                "sequence",
                "bridge_sequence",
                "frame",
                "access_kind",
                "width_bits",
                "effective_address",
                "value_text",
                "value_high_text",
                "accessor_live_pc",
                "accessor_physical_pc",
                "atlas_region_instance_id",
                "z64_instruction",
                "function_id",
                "structural_name",
                "mapping_method",
                "review_state",
            ),
            (
                (
                    item["runtimeMemoryAccessId"],
                    item["sessionId"],
                    item["localMemoryAccessId"],
                    item["sequence"],
                    item["bridgeSequence"],
                    item["frame"],
                    item["accessKind"],
                    item["widthBits"],
                    item["effectiveAddress"],
                    item["valueText"],
                    item["valueHighText"],
                    item["accessorLivePc"],
                    item["accessorPhysicalPc"],
                    item["atlasRegionInstanceId"],
                    item["z64Instruction"],
                    item["functionId"],
                    item["structuralName"],
                    item["mappingMethod"],
                    item["reviewState"],
                )
                for item in sorted(accesses, key=lambda value: value["runtimeMemoryAccessId"])
            ),
        )
        _insert_all(
            connection,
            "observed_edge",
            (
                "observed_edge_id",
                "session_id",
                "execution_sequence",
                "caller_live_pc",
                "callee_live_pc",
                "caller_function_id",
                "caller_structural_name",
                "callee_function_id",
                "callee_structural_name",
                "edge_kind",
                "evidence_grade",
                "review_state",
            ),
            (
                (
                    item["observedEdgeId"],
                    item["sessionId"],
                    item["executionSequence"],
                    item["callerLivePc"],
                    item["calleeLivePc"],
                    item["callerFunctionId"],
                    item["callerStructuralName"],
                    item["calleeFunctionId"],
                    item["calleeStructuralName"],
                    item["edgeKind"],
                    item["evidenceGrade"],
                    item["reviewState"],
                )
                for item in sorted(edges, key=lambda value: value["observedEdgeId"])
            ),
        )
        _insert_all(
            connection,
            "runtime_unresolved",
            (
                "runtime_unresolved_id",
                "session_id",
                "local_unresolved_id",
                "kind",
                "sequence",
                "frame",
                "payload_json",
            ),
            (
                (
                    item["runtimeUnresolvedId"],
                    item["sessionId"],
                    item["localUnresolvedId"],
                    item["kind"],
                    item["sequence"],
                    item["frame"],
                    item["payloadJson"],
                )
                for item in sorted(
                    unresolved, key=lambda value: value["runtimeUnresolvedId"]
                )
            ),
        )
        _insert_all(
            connection,
            "runtime_conflict",
            ("conflict_id", "conflict_kind", "live_pc", "session_id", "detail_json"),
            (
                (
                    item["conflictId"],
                    item["conflictKind"],
                    item.get("livePc"),
                    item.get("sessionId"),
                    canonical_json(item),
                )
                for item in sorted(conflicts, key=lambda value: value["conflictId"])
            ),
        )
        _insert_all(
            connection,
            "static_function_runtime_coverage",
            (
                "function_id",
                "structural_name",
                "exact_execution_observation_count",
                "sampled_pc_count",
                "memory_access_count",
                "observed_executed",
            ),
            (
                (
                    function.function_id,
                    function.structural_name,
                    exact_by_function[function.function_id],
                    sampled_by_function[function.function_id],
                    memory_by_function[function.function_id],
                    int(exact_by_function[function.function_id] > 0),
                )
                for function in static.functions
            ),
        )
        logical_sha256 = _logical_hash(connection)
        connection.executemany(
            "INSERT INTO meta(key,value) VALUES(?,?)",
            (
                ("schema", RUNTIME_SCHEMA),
                ("schemaVersion", str(RUNTIME_SCHEMA_VERSION)),
                ("logicalSha256", logical_sha256),
            ),
        )
        connection.commit()
        connection.execute("VACUUM")
    finally:
        connection.close()
    temporary.replace(database)

    observed_functions = sum(value > 0 for value in exact_by_function.values())
    sampled_functions = sum(value > 0 for value in sampled_by_function.values())
    summary = {
        "schema": RUNTIME_SCHEMA,
        "schemaVersion": RUNTIME_SCHEMA_VERSION,
        "logicalSha256": logical_sha256,
        "sourceSessions": [
            {"sessionId": item.session_id, "summarySha256": item.summary_sha256}
            for item in products
        ],
        "overlayAtlas": {
            "path": str(overlay_atlas.resolve()),
            "logicalSha256": verify_overlay_atlas(overlay_atlas)["logicalSha256"],
        },
        "counts": {
            "sourceSessions": len(products),
            "executionObservations": len(executions),
            "exactExecutionObservations": sum(
                item["executionClaim"] == "observed" for item in executions
            ),
            "exactExecutionWatchHits": sum(
                item["observationKind"] == "exact-watch-hit" for item in executions
            ),
            "nativeExecutionCoverage": sum(
                item["observationKind"] == "native-exact-coverage"
                for item in executions
            ),
            "sampledPcContexts": sum(
                item["executionClaim"] == "sampled-only" for item in executions
            ),
            "observedExecutedFunctions": observed_functions,
            "sampledFunctions": sampled_functions,
            "memoryAccesses": len(accesses),
            "observedEdges": len(edges),
            "unresolvedRuntimeObservations": len(unresolved),
            "runtimeConflicts": len(conflicts),
            "staticFunctions": len(static.functions),
        },
        "files": {
            "database": "runtime-provenance.sqlite",
            "execution": "execution-observations.ndjson",
            "memory": "memory-accesses.ndjson",
            "edges": "observed-edges.ndjson",
            "unresolved": "unresolved.ndjson",
            "coverage": "coverage.json",
        },
        "reviewState": "generated-unreviewed",
        "claimLimit": (
            "only exact watch hits and native exact coverage count as observed execution; sampled PCs remain context and residency never creates execution"
        ),
    }
    coverage = {
        "schema": "ob64-runtime-provenance-2-coverage.v1",
        "staticFunctionCount": len(static.functions),
        "observedExecutedFunctionCount": observed_functions,
        "sampledFunctionCount": sampled_functions,
        "unobservedExecutionFunctionCount": len(static.functions) - observed_functions,
        "observedExecutionPercent": (
            0.0 if not static.functions else observed_functions * 100.0 / len(static.functions)
        ),
    }
    _write_ndjson(destination / "execution-observations.ndjson", executions)
    _write_ndjson(destination / "memory-accesses.ndjson", accesses)
    _write_ndjson(destination / "observed-edges.ndjson", edges)
    _write_ndjson(destination / "unresolved.ndjson", unresolved)
    _write_json(destination / "coverage.json", coverage)
    _write_json(destination / "summary.json", summary)
    verification = verify_runtime_provenance(destination)
    return {
        "result": "PASS" if verification["result"] == "PASS" else "FAIL",
        "productDirectory": str(destination),
        "database": str(database),
        "logicalSha256": logical_sha256,
        "counts": summary["counts"],
        "verification": verification,
    }


def verify_runtime_provenance(path: Path) -> dict[str, Any]:
    root = path.resolve()
    database = root / "runtime-provenance.sqlite"
    connection = sqlite3.connect(f"file:{database.as_posix()}?mode=ro", uri=True)
    try:
        connection.execute("PRAGMA foreign_keys = ON")
        integrity = [row[0] for row in connection.execute("PRAGMA integrity_check")]
        foreign_keys = connection.execute("PRAGMA foreign_key_check").fetchall()
        meta = dict(connection.execute("SELECT key,value FROM meta"))
        logical = _logical_hash(connection)
        schema_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
        claims_without_mapping = int(
            connection.execute(
                """
                SELECT COUNT(*) FROM execution_observation
                WHERE execution_claim='observed'
                  AND evidence_grade IN ('verified', 'supported')
                  AND mapping_status='unresolved'
                """
            ).fetchone()[0]
        )
        counts = {
            table: int(connection.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0])
            for table in LOGICAL_TABLES
        }
    finally:
        connection.close()
    checks = {
        "integrity": integrity == ["ok"],
        "foreignKeys": not foreign_keys,
        "schema": meta.get("schema") == RUNTIME_SCHEMA,
        "schemaVersion": schema_version == RUNTIME_SCHEMA_VERSION,
        "logicalHash": meta.get("logicalSha256") == logical,
        "observedExecutionContext": claims_without_mapping == 0,
    }
    return {
        "result": "PASS" if all(checks.values()) else "FAIL",
        "checks": checks,
        "logicalSha256": logical,
        "counts": counts,
    }
