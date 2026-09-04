"""Transactional SQLite store for the matching workbench.

The Node front end sends one JSON request on stdin and receives one JSON result
on stdout. Keeping SQLite here avoids adding a production Node dependency and
uses only Python's standard library.
"""

from __future__ import annotations

import argparse
import base64
import json
import sqlite3
import sys
from pathlib import Path
from typing import Any


def _json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def _decode_blob(value: str | None) -> bytes | None:
    return None if value is None else base64.b64decode(value, validate=True)


def _row_dict(row: sqlite3.Row | None) -> dict[str, Any] | None:
    if row is None:
        return None
    result = dict(row)
    for key, value in list(result.items()):
        if isinstance(value, bytes):
            result[key] = base64.b64encode(value).decode("ascii")
        elif key.endswith("_json") and isinstance(value, str):
            result[key[:-5]] = json.loads(value)
            del result[key]
    return result


def _require_keys(record: dict[str, Any], names: tuple[str, ...]) -> None:
    missing = [name for name in names if name not in record]
    if missing:
        raise ValueError(f"record is missing required keys: {', '.join(missing)}")


def _insert_exact(
    connection: sqlite3.Connection,
    table: str,
    primary_key: str,
    record: dict[str, Any],
) -> dict[str, Any]:
    columns = tuple(record)
    placeholders = ",".join("?" for _ in columns)
    connection.execute(
        f"INSERT OR IGNORE INTO {table} ({','.join(columns)}) VALUES ({placeholders})",
        tuple(record[column] for column in columns),
    )
    row = connection.execute(
        f"SELECT * FROM {table} WHERE {primary_key}=?", (record[primary_key],)
    ).fetchone()
    if row is None:
        raise RuntimeError(f"{table} insert did not create or find a row")
    for column, expected in record.items():
        if row[column] != expected:
            raise ValueError(
                f"conflicting {table} identity {record[primary_key]} at {column}"
            )
    return _row_dict(row) or {}


def _upsert_targets(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    records = request.get("records")
    if not isinstance(records, list):
        raise ValueError("target records must be a list")
    inserted = 0
    for source in records:
        _require_keys(
            source,
            ("targetId", "modelId", "symbol", "metadata", "expectedBytes", "observedAt"),
        )
        existing = connection.execute(
            "SELECT target_id,model_id,symbol,metadata_json,expected_bytes FROM target_snapshot WHERE target_id=?",
            (source["targetId"],),
        ).fetchone()
        encoded = {
            "target_id": source["targetId"],
            "model_id": source["modelId"],
            "symbol": source["symbol"],
            "metadata_json": _json(source["metadata"]),
            "expected_bytes": _decode_blob(source["expectedBytes"]),
            "created_at": source["observedAt"],
            "last_seen_at": source["observedAt"],
        }
        if existing is None:
            connection.execute(
                "INSERT INTO target_snapshot(target_id,model_id,symbol,metadata_json,expected_bytes,created_at,last_seen_at) VALUES (?,?,?,?,?,?,?)",
                tuple(encoded.values()),
            )
            inserted += 1
        else:
            for column in ("model_id", "symbol", "metadata_json", "expected_bytes"):
                if existing[column] != encoded[column]:
                    raise ValueError(f"conflicting target identity {source['targetId']} at {column}")
            connection.execute(
                "UPDATE target_snapshot SET last_seen_at=? WHERE target_id=?",
                (source["observedAt"], source["targetId"]),
            )
    return {"seen": len(records), "inserted": inserted}


def _sync_targets(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    _require_keys(request, ("modelId", "modelManifest", "targetCount", "records"))
    model_id = request["modelId"]
    expected_count = int(request["targetCount"])
    manifest_json = _json(request["modelManifest"])
    metadata_key = f"targetModel:{model_id}"
    current = connection.execute(
        "SELECT value FROM metadata WHERE key=?", (metadata_key,)
    ).fetchone()
    actual_count = connection.execute(
        "SELECT COUNT(*) FROM target_snapshot WHERE model_id=?", (model_id,)
    ).fetchone()[0]
    if current is not None and current["value"] != manifest_json:
        raise ValueError(f"conflicting exact target model identity {model_id}")
    if current is not None and actual_count == expected_count and not request.get("force", False):
        return {"seen": expected_count, "inserted": 0, "skipped": True, "verifiedBy": "exact-model-manifest-and-count"}
    result = _upsert_targets(connection, request)
    final_count = connection.execute(
        "SELECT COUNT(*) FROM target_snapshot WHERE model_id=?", (model_id,)
    ).fetchone()[0]
    if final_count != expected_count:
        raise ValueError(f"target model row-count conflict for {model_id}: {final_count} != {expected_count}")
    connection.execute(
        "INSERT OR IGNORE INTO metadata(key,value) VALUES (?,?)",
        (metadata_key, manifest_json),
    )
    return {**result, "skipped": False, "verifiedBy": "exact-target-rows"}


def _put_candidate(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    source = request["record"]
    _require_keys(
        source,
        ("candidateId", "observationId", "targetId", "sourceSha256", "sourceText", "origin", "metadata", "createdAt"),
    )
    record = {
        "candidate_id": source["candidateId"],
        "target_id": source["targetId"],
        "source_sha256": source["sourceSha256"],
        "source_text": source["sourceText"],
        "origin": source["origin"],
        "variant": source.get("variant"),
        "parent_candidate_id": source.get("parentCandidateId"),
        "metadata_json": _json(source["metadata"]),
        "created_at": source["createdAt"],
    }
    existing = connection.execute(
        "SELECT * FROM candidate WHERE candidate_id=?", (source["candidateId"],)
    ).fetchone()
    if existing is not None:
        for column in ("target_id", "source_sha256", "source_text"):
            if existing[column] != record[column]:
                raise ValueError(
                    f"conflicting candidate identity {source['candidateId']} at {column}"
                )
        candidate = _row_dict(existing) or {}
    else:
        candidate = _insert_exact(connection, "candidate", "candidate_id", record)
    observation_record = {
        "observation_id": source["observationId"],
        "candidate_id": source["candidateId"],
        "origin": source["origin"],
        "variant": source.get("variant"),
        "parent_candidate_id": source.get("parentCandidateId"),
        "metadata_json": _json(source["metadata"]),
        "created_at": source["createdAt"],
    }
    observation = connection.execute(
        "SELECT * FROM candidate_observation WHERE observation_id=?",
        (source["observationId"],),
    ).fetchone()
    if observation is not None:
        for column, expected in observation_record.items():
            if column != "created_at" and observation[column] != expected:
                raise ValueError(
                    f"conflicting candidate observation identity {source['observationId']} at {column}"
                )
        observation_result = _row_dict(observation) or {}
    else:
        observation_result = _insert_exact(
            connection, "candidate_observation", "observation_id", observation_record
        )
    return {"candidate": candidate, "observation": observation_result}


def _put_compile(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    source = request["record"]
    _require_keys(
        source,
        ("runId", "candidateId", "cacheKey", "status", "artifactDir", "durationMs", "tool", "createdAt"),
    )
    cached = connection.execute(
        "SELECT * FROM compile_run WHERE cache_key=?", (source["cacheKey"],)
    ).fetchone()
    if cached is not None:
        expected_tool = _json(source["tool"])
        if cached["candidate_id"] != source["candidateId"] or cached["tool_json"] != expected_tool:
            raise ValueError(f"conflicting compile cache identity {source['cacheKey']}")
        if cached["status"] == "compiled":
            return {"cached": True, "run": _row_dict(cached)}
        # Keep the failed attempt but release the stable cache key so a repaired
        # environment can create the successful reusable result.
        archived_key = f"{source['cacheKey']}:failed:{cached['run_id']}"
        connection.execute(
            "UPDATE compile_run SET cache_key=? WHERE run_id=?",
            (archived_key, cached["run_id"]),
        )
    record = {
        "run_id": source["runId"],
        "candidate_id": source["candidateId"],
        "cache_key": source["cacheKey"],
        "status": source["status"],
        "source_class": source.get("sourceClass"),
        "object_text": _decode_blob(source.get("objectText")),
        "relocations_json": None if source.get("relocations") is None else _json(source["relocations"]),
        "artifact_dir": source["artifactDir"],
        "stdout": source.get("stdout", ""),
        "stderr": source.get("stderr", ""),
        "duration_ms": int(source["durationMs"]),
        "tool_json": _json(source["tool"]),
        "created_at": source["createdAt"],
    }
    return {"cached": False, "run": _insert_exact(connection, "compile_run", "run_id", record)}


def _put_comparison(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    source = request["record"]
    _require_keys(
        source,
        ("comparisonId", "runId", "primaryClass", "exactBytes", "relocationMaskedExact", "score", "details", "createdAt"),
    )
    record = {
        "comparison_id": source["comparisonId"],
        "run_id": source["runId"],
        "primary_class": source["primaryClass"],
        "exact_bytes": int(bool(source["exactBytes"])),
        "relocation_masked_exact": int(bool(source["relocationMaskedExact"])),
        "score": float(source["score"]),
        "details_json": _json(source["details"]),
        "created_at": source["createdAt"],
    }
    return _insert_exact(connection, "comparison", "comparison_id", record)


def _replace_comparison(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    source = request["record"]
    _require_keys(
        source,
        ("comparisonId", "runId", "primaryClass", "exactBytes", "relocationMaskedExact", "score", "details", "createdAt"),
    )
    run = connection.execute(
        "SELECT status FROM compile_run WHERE run_id=?", (source["runId"],)
    ).fetchone()
    if run is None or run["status"] != "compiled":
        raise ValueError(f"comparison replacement requires one compiled run: {source['runId']}")
    collision = connection.execute(
        "SELECT run_id FROM comparison WHERE comparison_id=?", (source["comparisonId"],)
    ).fetchone()
    if collision is not None and collision["run_id"] != source["runId"]:
        raise ValueError(f"conflicting comparison identity {source['comparisonId']}")
    record = {
        "comparison_id": source["comparisonId"],
        "run_id": source["runId"],
        "primary_class": source["primaryClass"],
        "exact_bytes": int(bool(source["exactBytes"])),
        "relocation_masked_exact": int(bool(source["relocationMaskedExact"])),
        "score": float(source["score"]),
        "details_json": _json(source["details"]),
        "created_at": source["createdAt"],
    }
    existing = connection.execute(
        "SELECT comparison_id FROM comparison WHERE run_id=?", (source["runId"],)
    ).fetchone()
    if existing is None:
        return _insert_exact(connection, "comparison", "comparison_id", record)
    connection.execute(
        """UPDATE comparison
              SET comparison_id=?,primary_class=?,exact_bytes=?,relocation_masked_exact=?,score=?,details_json=?,created_at=?
            WHERE run_id=?""",
        (
            record["comparison_id"], record["primary_class"], record["exact_bytes"],
            record["relocation_masked_exact"], record["score"], record["details_json"],
            record["created_at"], record["run_id"],
        ),
    )
    return _row_dict(connection.execute(
        "SELECT * FROM comparison WHERE run_id=?", (source["runId"],)
    ).fetchone()) or {}


def _put_compile_result(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    compile_result = _put_compile(connection, {"record": request["compile"]})
    run_id = compile_result["run"]["run_id"]
    if compile_result["cached"]:
        comparison = connection.execute(
            "SELECT * FROM comparison WHERE run_id=?", (run_id,)
        ).fetchone()
        if compile_result["run"]["status"] == "compiled" and comparison is None:
            raise ValueError(f"compiled cache entry is missing its comparison: {run_id}")
        return {"cached": True, "run": compile_result["run"], "comparison": _row_dict(comparison)}
    comparison_source = request.get("comparison")
    comparison = None
    if comparison_source is not None:
        comparison = _put_comparison(connection, {"record": comparison_source})
    if compile_result["run"]["status"] == "compiled" and comparison is None:
        raise ValueError(f"compiled result is missing its comparison: {run_id}")
    return {"cached": False, "run": compile_result["run"], "comparison": comparison}


def _put_context(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    source = request["record"]
    _require_keys(source, ("contextId", "targetId", "modelId", "context", "createdAt"))
    current = connection.execute(
        "SELECT * FROM context_snapshot WHERE target_id=? AND model_id=?",
        (source["targetId"], source["modelId"]),
    ).fetchone()
    if current is not None:
        encoded_context = _json(source["context"])
        if current["context_id"] == source["contextId"]:
            if current["context_json"] != encoded_context:
                raise ValueError(f"conflicting context identity {source['contextId']}")
            return _row_dict(current) or {}
        connection.execute("DELETE FROM context_snapshot WHERE context_id=?", (current["context_id"],))
    record = {
        "context_id": source["contextId"],
        "target_id": source["targetId"],
        "model_id": source["modelId"],
        "context_json": _json(source["context"]),
        "created_at": source["createdAt"],
    }
    return _insert_exact(connection, "context_snapshot", "context_id", record)


def _replace_families(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    model_id = request["modelId"]
    groups = request.get("groups")
    if not isinstance(groups, list):
        raise ValueError("family groups must be a list")
    old = [
        row[0]
        for row in connection.execute("SELECT group_id FROM family_group WHERE model_id=?", (model_id,))
    ]
    for group_id in old:
        connection.execute("DELETE FROM family_group WHERE group_id=?", (group_id,))
    members = 0
    for group in groups:
        _require_keys(group, ("groupId", "tier", "representation", "metadata", "members"))
        connection.execute(
            "INSERT INTO family_group(group_id,model_id,tier,representation,member_count,metadata_json) VALUES (?,?,?,?,?,?)",
            (
                group["groupId"],
                model_id,
                group["tier"],
                group["representation"],
                len(group["members"]),
                _json(group["metadata"]),
            ),
        )
        for ordinal, target_id in enumerate(group["members"]):
            connection.execute(
                "INSERT INTO family_member(group_id,target_id,ordinal) VALUES (?,?,?)",
                (group["groupId"], target_id, ordinal),
            )
            members += 1
    return {"groups": len(groups), "members": members}


def _put_sweep(connection: sqlite3.Connection, request: dict[str, Any]) -> dict[str, Any]:
    source = request["record"]
    _require_keys(source, ("sweepId", "modelId", "selector", "status", "summary", "startedAt"))
    selector_json = _json(source["selector"])
    existing = connection.execute("SELECT * FROM sweep_run WHERE sweep_id=?", (source["sweepId"],)).fetchone()
    if existing is not None and (existing["model_id"] != source["modelId"] or existing["selector_json"] != selector_json):
        raise ValueError(f"conflicting sweep identity {source['sweepId']}")
    connection.execute(
        """INSERT INTO sweep_run(sweep_id,model_id,selector_json,status,summary_json,started_at,finished_at)
           VALUES (?,?,?,?,?,?,?)
           ON CONFLICT(sweep_id) DO UPDATE SET status=excluded.status,
             summary_json=excluded.summary_json,started_at=excluded.started_at,
             finished_at=excluded.finished_at""",
        (
            source["sweepId"], source["modelId"], selector_json,
            source["status"], _json(source["summary"]), source["startedAt"],
            source.get("finishedAt"),
        ),
    )
    return _row_dict(connection.execute("SELECT * FROM sweep_run WHERE sweep_id=?", (source["sweepId"],)).fetchone()) or {}


def _query(connection: sqlite3.Connection, request: dict[str, Any]) -> Any:
    name = request["name"]
    args = request.get("args", {})
    limit = min(max(int(args.get("limit", 20)), 1), 200)
    comparison_algorithm_id = args.get("comparisonAlgorithmId")
    if comparison_algorithm_id is not None and (
        not isinstance(comparison_algorithm_id, str) or not comparison_algorithm_id
    ):
        raise ValueError("comparisonAlgorithmId must be a nonempty string")
    diagnostic_current_fingerprint = args.get("diagnosticCurrentFingerprint")
    if diagnostic_current_fingerprint is not None and (
        not isinstance(diagnostic_current_fingerprint, str) or not diagnostic_current_fingerprint
    ):
        raise ValueError("diagnosticCurrentFingerprint must be a nonempty string")
    diagnostic_environment_id = args.get("diagnosticEnvironmentId")
    if diagnostic_environment_id is not None and (
        not isinstance(diagnostic_environment_id, str) or not diagnostic_environment_id
    ):
        raise ValueError("diagnosticEnvironmentId must be a nonempty string")
    if (
        comparison_algorithm_id is not None
        and diagnostic_current_fingerprint is not None
        and diagnostic_environment_id is not None
    ):
        comparison_provenance_clause = (
            " AND json_extract(p.details_json,'$.comparisonAlgorithmId')=?"
            " AND json_extract(p.details_json,'$.diagnosticCurrentFingerprint')=?"
            " AND (COALESCE(json_extract(p.details_json,'$.diagnosticEnvironmentConsulted'),0)=0"
            " OR json_extract(p.details_json,'$.diagnosticEnvironmentId')=?)"
        )
        comparison_provenance_params = (
            comparison_algorithm_id, diagnostic_current_fingerprint, diagnostic_environment_id
        )
    else:
        # Score-bearing comparisons are current only when the caller supplies
        # both implementation and verified-CURRENT provenance. Runs and source
        # history remain visible, but unscoped comparison scores stay stale.
        comparison_provenance_clause = " AND 0"
        comparison_provenance_params = ()
    sweep_current_expression = "(json_extract(selector_json,'$.compile')=0"
    sweep_current_params: tuple[Any, ...] = ()
    if (
        comparison_algorithm_id is not None
        and diagnostic_current_fingerprint is not None
        and diagnostic_environment_id is not None
    ):
        sweep_current_expression += (
            " OR (json_extract(selector_json,'$.generationContract.comparison.algorithmId')=?"
            " AND json_extract(selector_json,'$.generationContract.comparison.currentFingerprint')=?"
            " AND json_extract(selector_json,'$.generationContract.comparison.environmentId')=?))"
        )
        sweep_current_params = (
            comparison_algorithm_id, diagnostic_current_fingerprint, diagnostic_environment_id
        )
    else:
        sweep_current_expression += ")"
    if name == "status":
        model_id = args.get("modelId")
        where = " WHERE model_id=?" if model_id else ""
        params = (model_id,) if model_id else ()
        targets = connection.execute(f"SELECT COUNT(*) FROM target_snapshot{where}", params).fetchone()[0]
        candidates = connection.execute(
            "SELECT COUNT(*) FROM candidate c JOIN target_snapshot t ON t.target_id=c.target_id" + where,
            params,
        ).fetchone()[0]
        compilations = connection.execute(
            "SELECT COUNT(*) FROM compile_run r JOIN candidate c ON c.candidate_id=r.candidate_id JOIN target_snapshot t ON t.target_id=c.target_id" + where,
            params,
        ).fetchone()[0]
        comparisons = connection.execute(
            "SELECT COUNT(*) FROM comparison p JOIN compile_run r ON r.run_id=p.run_id JOIN candidate c ON c.candidate_id=r.candidate_id JOIN target_snapshot t ON t.target_id=c.target_id" + where,
            params,
        ).fetchone()[0]
        return {"targets": targets, "candidates": candidates, "compilations": compilations, "comparisons": comparisons}
    if name in ("history", "best"):
        order = (
            "CASE WHEN json_extract(p.details_json,'$.diagnosticExactBytes')=1 "
            "AND p.primary_class='exact-bytes' THEN 1 ELSE 0 END DESC,"
            "p.score DESC,p.exact_bytes DESC,p.relocation_masked_exact DESC,r.created_at DESC"
            if name == "best" else "r.created_at DESC"
        )
        model_clause = "t.model_id=? AND" if name == "best" else ""
        details_column = ",p.details_json" if args.get("includeDetails", False) else ""
        params = (
            (args["modelId"], *comparison_provenance_params, args["modelId"], args["symbol"], limit)
            if name == "best"
            else (args["modelId"], *comparison_provenance_params, args["symbol"], limit)
        )
        rows = connection.execute(
            f"""SELECT t.symbol,t.target_id,t.model_id,
                       CASE WHEN t.model_id=? THEN 0 ELSE 1 END AS is_stale,
                       c.candidate_id,c.origin,c.variant,c.source_sha256,
                       r.run_id,r.status,r.source_class,r.duration_ms,r.artifact_dir,r.created_at,
                       p.primary_class,p.exact_bytes,p.relocation_masked_exact,p.score,
                       CASE WHEN stored_p.run_id IS NOT NULL AND p.run_id IS NULL THEN 1 ELSE 0 END AS comparison_stale{details_column}
                  FROM target_snapshot t
                  JOIN candidate c ON c.target_id=t.target_id
                  LEFT JOIN compile_run r ON r.candidate_id=c.candidate_id
                  LEFT JOIN comparison stored_p ON stored_p.run_id=r.run_id
                  LEFT JOIN comparison p ON p.run_id=r.run_id
                    AND json_extract(p.details_json,'$.comparisonContract')=1
                    {comparison_provenance_clause}
                 WHERE {model_clause} t.symbol=? COLLATE NOCASE
                 ORDER BY is_stale,{order} LIMIT ?""",
            params,
        ).fetchall()
        return [_row_dict(row) for row in rows]
    if name == "candidate":
        row = connection.execute("SELECT * FROM candidate WHERE candidate_id=?", (args["candidateId"],)).fetchone()
        return _row_dict(row)
    if name == "compile_by_cache":
        row = connection.execute("SELECT * FROM compile_run WHERE cache_key=?", (args["cacheKey"],)).fetchone()
        return _row_dict(row)
    if name == "comparison_for_run":
        row = connection.execute("SELECT * FROM comparison WHERE run_id=?", (args["runId"],)).fetchone()
        return _row_dict(row)
    if name == "candidate_runs":
        rows = connection.execute(
            f"""SELECT r.*,p.primary_class,p.exact_bytes,p.relocation_masked_exact,p.score,p.details_json,
                       CASE WHEN stored_p.run_id IS NOT NULL AND p.run_id IS NULL THEN 1 ELSE 0 END AS comparison_stale
                 FROM compile_run r
                 LEFT JOIN comparison stored_p ON stored_p.run_id=r.run_id
                 LEFT JOIN comparison p ON p.run_id=r.run_id
                   AND json_extract(p.details_json,'$.comparisonContract')=1
                   {comparison_provenance_clause}
                WHERE r.candidate_id=? ORDER BY r.created_at DESC LIMIT ?""",
            (*comparison_provenance_params, args["candidateId"], limit),
        ).fetchall()
        return [_row_dict(row) for row in rows]
    if name == "candidate_observations":
        rows = connection.execute(
            "SELECT * FROM candidate_observation WHERE candidate_id=? ORDER BY created_at DESC LIMIT ?",
            (args["candidateId"], limit),
        ).fetchall()
        return [_row_dict(row) for row in rows]
    if name == "families_for_target":
        rows = connection.execute(
            """SELECT g.group_id,g.model_id,g.tier,g.member_count,g.metadata_json,m.ordinal
                FROM family_member m JOIN family_group g ON g.group_id=m.group_id
                WHERE m.target_id=? ORDER BY CASE g.tier WHEN 'exact' THEN 0 WHEN 'relocation-normalized' THEN 1
                WHEN 'register-normalized' THEN 2 ELSE 3 END,g.member_count DESC LIMIT ?""",
            (args["targetId"], limit),
        ).fetchall()
        result = []
        include_members = bool(args.get("includeMembers", False))
        member_limit = min(max(int(args.get("memberLimit", 5)), 1), 200)
        for row in rows:
            item = _row_dict(row) or {}
            metadata = item.get("metadata")
            if isinstance(metadata, dict) and isinstance(metadata.get("symbols"), list):
                symbols = metadata.pop("symbols")
                metadata["symbolSamples"] = symbols[:member_limit]
                metadata["symbolsOmitted"] = max(0, len(symbols) - member_limit)
            item["members"] = [
                dict(member)
                for member in connection.execute(
                    """SELECT t.symbol,t.target_id,m.ordinal FROM family_member m
                        JOIN target_snapshot t ON t.target_id=m.target_id WHERE m.group_id=? ORDER BY m.ordinal LIMIT ?""",
                    (row["group_id"], 200 if include_members else member_limit),
                )
            ]
            item["members_omitted"] = max(0, int(row["member_count"]) - len(item["members"]))
            result.append(item)
        return result
    if name == "family_list":
        params: list[Any] = [args["modelId"]]
        tier_clause = ""
        if args.get("tier"):
            tier_clause = " AND tier=?"
            params.append(args["tier"])
        params.append(limit)
        rows = connection.execute(
            f"SELECT group_id,model_id,tier,member_count,metadata_json FROM family_group WHERE model_id=?{tier_clause} ORDER BY member_count DESC,tier,group_id LIMIT ?",
            tuple(params),
        ).fetchall()
        result = []
        member_limit = 200 if args.get("includeMembers", False) else min(max(int(args.get("memberLimit", 5)), 1), 200)
        for row in rows:
            item = _row_dict(row) or {}
            metadata = item.get("metadata")
            if isinstance(metadata, dict) and isinstance(metadata.get("symbols"), list):
                symbols = metadata.pop("symbols")
                metadata["symbolSamples"] = symbols[:member_limit]
                metadata["symbolsOmitted"] = max(0, len(symbols) - member_limit)
            result.append(item)
        return result
    if name == "family_summaries":
        rows = connection.execute(
            """SELECT m.target_id,g.group_id,g.tier,g.member_count,g.metadata_json
                 FROM family_member m JOIN family_group g ON g.group_id=m.group_id
                WHERE g.model_id=?
                ORDER BY m.target_id,CASE g.tier WHEN 'exact' THEN 0 WHEN 'relocation-normalized' THEN 1
                  WHEN 'register-normalized' THEN 2 ELSE 3 END,g.member_count DESC""",
            (args["modelId"],),
        ).fetchall()
        return [_row_dict(row) for row in rows]
    if name == "context":
        row = connection.execute(
            "SELECT * FROM context_snapshot WHERE target_id=? AND model_id=?",
            (args["targetId"], args["modelId"]),
        ).fetchone()
        return _row_dict(row)
    if name == "compilation_summaries":
        rows = connection.execute(
            f"""SELECT t.target_id,t.symbol,c.candidate_id,c.origin,c.variant,r.run_id,r.status,r.duration_ms,r.created_at,
                       CASE WHEN r.relocations_json IS NULL THEN NULL ELSE json_array_length(r.relocations_json) END AS relocation_count,
                       p.primary_class,p.exact_bytes,p.relocation_masked_exact,p.score,
                       CASE WHEN stored_p.run_id IS NOT NULL AND p.run_id IS NULL THEN 1 ELSE 0 END AS comparison_stale
                  FROM target_snapshot t
                  LEFT JOIN candidate c ON c.target_id=t.target_id
                  LEFT JOIN compile_run r ON r.candidate_id=c.candidate_id
                  LEFT JOIN comparison stored_p ON stored_p.run_id=r.run_id
                  LEFT JOIN comparison p ON p.run_id=r.run_id
                    AND json_extract(p.details_json,'$.comparisonContract')=1
                    {comparison_provenance_clause}
                 WHERE t.model_id=? ORDER BY t.symbol,r.created_at DESC""",
            (*comparison_provenance_params, args["modelId"]),
        ).fetchall()
        return [_row_dict(row) for row in rows]
    if name == "sweeps":
        rows = connection.execute(
            f"""SELECT sweep_id,model_id,selector_json,status,
                       CASE WHEN {sweep_current_expression} THEN summary_json ELSE NULL END AS summary_json,
                       started_at,finished_at,
                       CASE WHEN {sweep_current_expression} THEN 0 ELSE 1 END AS comparison_stale
                  FROM sweep_run WHERE model_id=? ORDER BY started_at DESC LIMIT ?""",
            (*sweep_current_params, *sweep_current_params, args["modelId"], limit),
        ).fetchall()
        result = []
        include_targets = bool(args.get("includeTargets", False))
        target_limit = min(max(int(args.get("targetLimit", 5)), 0), 200)
        for row in rows:
            item = _row_dict(row) or {}
            if "summary_json" in item:
                item["summary"] = None
                del item["summary_json"]
            summary = item.get("summary")
            if isinstance(summary, dict) and isinstance(summary.get("targets"), list) and not include_targets:
                targets = summary.pop("targets")
                summary["targetSamples"] = targets[:target_limit]
                summary["targetsOmitted"] = max(0, len(targets) - target_limit)
            result.append(item)
        return result
    if name == "sweep_by_id":
        row = connection.execute(
            f"""SELECT sweep_id,model_id,selector_json,status,
                       CASE WHEN {sweep_current_expression} THEN summary_json ELSE NULL END AS summary_json,
                       started_at,finished_at,
                       CASE WHEN {sweep_current_expression} THEN 0 ELSE 1 END AS comparison_stale
                  FROM sweep_run WHERE sweep_id=?""",
            (*sweep_current_params, *sweep_current_params, args["sweepId"]),
        ).fetchone()
        result = _row_dict(row)
        if result is not None and "summary_json" in result:
            result["summary"] = None
            del result["summary_json"]
        return result
    raise ValueError(f"unknown query: {name}")


def dispatch(connection: sqlite3.Connection, request: dict[str, Any]) -> Any:
    action = request.get("action")
    if action == "init":
        return {"schemaVersion": int(connection.execute("SELECT value FROM metadata WHERE key='schemaVersion'").fetchone()[0])}
    if action == "upsert_targets":
        return _upsert_targets(connection, request)
    if action == "sync_targets":
        return _sync_targets(connection, request)
    if action == "put_candidate":
        return _put_candidate(connection, request)
    if action == "put_compile":
        return _put_compile(connection, request)
    if action == "put_comparison":
        return _put_comparison(connection, request)
    if action == "replace_comparison":
        return _replace_comparison(connection, request)
    if action == "put_compile_result":
        return _put_compile_result(connection, request)
    if action == "put_context":
        return _put_context(connection, request)
    if action == "replace_families":
        return _replace_families(connection, request)
    if action == "put_sweep":
        return _put_sweep(connection, request)
    if action == "query":
        return _query(connection, request)
    raise ValueError(f"unknown action: {action}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--database", required=True)
    parser.add_argument("--schema", required=True)
    args = parser.parse_args()
    database = Path(args.database).resolve()
    schema = Path(args.schema).resolve()
    database.parent.mkdir(parents=True, exist_ok=True)
    request = json.load(sys.stdin)
    connection = sqlite3.connect(database, timeout=30.0)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    connection.execute("PRAGMA busy_timeout=30000")
    try:
        version_row = connection.execute(
            "SELECT value FROM metadata WHERE key='schemaVersion'"
        ).fetchone()
        version = version_row[0] if version_row is not None else None
    except sqlite3.OperationalError:
        version = None
    if request.get("action") == "init" or version != "2":
        connection.executescript(schema.read_text(encoding="utf-8"))
        version = connection.execute(
            "SELECT value FROM metadata WHERE key='schemaVersion'"
        ).fetchone()[0]
    if version != "2":
        raise RuntimeError(f"matching workbench schema drift: {version}")
    if request.get("action") == "init":
        # A sweep coordinator initializes the store before starting workers.
        # WAL keeps their read-heavy cache/provenance traffic concurrent while
        # SQLite continues to serialize the short transactional writes.
        connection.execute("PRAGMA journal_mode=WAL")
    try:
        with connection:
            result = dispatch(connection, request)
    finally:
        connection.close()
    json.dump({"ok": True, "result": result}, sys.stdout, sort_keys=True)
    sys.stdout.write("\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:  # fail closed at the process boundary
        json.dump({"ok": False, "error": str(error)}, sys.stdout)
        sys.stdout.write("\n")
        raise SystemExit(1)
