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
             summary_json=excluded.summary_json,finished_at=excluded.finished_at""",
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
        order = "p.exact_bytes DESC,p.relocation_masked_exact DESC,p.score DESC,r.created_at DESC" if name == "best" else "r.created_at DESC"
        model_clause = "t.model_id=? AND" if name == "best" else ""
        details_column = ",p.details_json" if args.get("includeDetails", False) else ""
        params = (
            (args["modelId"], args["modelId"], args["symbol"], limit)
            if name == "best"
            else (args["modelId"], args["symbol"], limit)
        )
        rows = connection.execute(
            f"""SELECT t.symbol,t.target_id,t.model_id,
                       CASE WHEN t.model_id=? THEN 0 ELSE 1 END AS is_stale,
                       c.candidate_id,c.origin,c.variant,c.source_sha256,
                       r.run_id,r.status,r.source_class,r.duration_ms,r.artifact_dir,r.created_at,
                       p.primary_class,p.exact_bytes,p.relocation_masked_exact,p.score{details_column}
                  FROM target_snapshot t
                  JOIN candidate c ON c.target_id=t.target_id
                  LEFT JOIN compile_run r ON r.candidate_id=c.candidate_id
                  LEFT JOIN comparison p ON p.run_id=r.run_id
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
            """SELECT r.*,p.primary_class,p.exact_bytes,p.relocation_masked_exact,p.score,p.details_json
                 FROM compile_run r LEFT JOIN comparison p ON p.run_id=r.run_id
                WHERE r.candidate_id=? ORDER BY r.created_at DESC LIMIT ?""",
            (args["candidateId"], limit),
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
            """SELECT t.target_id,t.symbol,c.candidate_id,c.origin,c.variant,r.status,r.duration_ms,r.created_at,
                       CASE WHEN r.relocations_json IS NULL THEN NULL ELSE json_array_length(r.relocations_json) END AS relocation_count,
                       p.primary_class,p.exact_bytes,p.relocation_masked_exact,p.score
                  FROM target_snapshot t
                  LEFT JOIN candidate c ON c.target_id=t.target_id
                  LEFT JOIN compile_run r ON r.candidate_id=c.candidate_id
                  LEFT JOIN comparison p ON p.run_id=r.run_id
                 WHERE t.model_id=? ORDER BY t.symbol,r.created_at DESC""",
            (args["modelId"],),
        ).fetchall()
        return [_row_dict(row) for row in rows]
    if name == "sweeps":
        rows = connection.execute(
            "SELECT * FROM sweep_run WHERE model_id=? ORDER BY started_at DESC LIMIT ?",
            (args["modelId"], limit),
        ).fetchall()
        result = []
        include_targets = bool(args.get("includeTargets", False))
        target_limit = min(max(int(args.get("targetLimit", 5)), 0), 200)
        for row in rows:
            item = _row_dict(row) or {}
            summary = item.get("summary")
            if isinstance(summary, dict) and isinstance(summary.get("targets"), list) and not include_targets:
                targets = summary.pop("targets")
                summary["targetSamples"] = targets[:target_limit]
                summary["targetsOmitted"] = max(0, len(targets) - target_limit)
            result.append(item)
        return result
    if name == "sweep_by_id":
        row = connection.execute(
            "SELECT * FROM sweep_run WHERE sweep_id=?", (args["sweepId"],)
        ).fetchone()
        return _row_dict(row)
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
    connection = sqlite3.connect(database)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    connection.execute("PRAGMA busy_timeout=30000")
    connection.executescript(schema.read_text(encoding="utf-8"))
    version = connection.execute("SELECT value FROM metadata WHERE key='schemaVersion'").fetchone()[0]
    if version != "2":
        raise RuntimeError(f"matching workbench schema drift: {version}")
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
