from __future__ import annotations

import json
from contextlib import closing
from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.resolver import (
    RESOLVER_SCHEMA,
    RESOLVER_SCHEMA_VERSION,
    _logical_hash,
    _verify_database,
    coverage_report,
    resolver_schema_path,
)
from tools.total_resolver.resolver_query import explain, resolve_live_address
from tools.total_resolver.resolver_sources import (
    ResolverSourcePaths,
    SourceIdentity,
    validate_resolver_sources,
)


def fixture_identities() -> tuple[SourceIdentity, ...]:
    values = (
        ("static-db-r3", "static-db-r3", ("static",), "accepted-source"),
        ("resource-chain-static", "resource-chain-static", ("resource",), "accepted-source"),
        ("structure-field-static", "structure-field-static", ("field", "static"), "accepted-source"),
        ("overlay-atlas-2", "overlay-atlas-2", ("placement",), "generated-unreviewed"),
        ("runtime-provenance-2", "runtime-provenance-2", ("runtime",), "generated-unreviewed"),
    )
    return tuple(
        SourceIdentity(
            source_id,
            adapter_id,
            "fixture",
            lanes,
            "fixture-sha256",
            f"{index:064X}",
            review,
            "fixture boundary",
        )
        for index, (source_id, adapter_id, lanes, review) in enumerate(values, 1)
    )


def make_resolver_product(root: Path, *, reverse: bool = False) -> tuple[Path, tuple[SourceIdentity, ...]]:
    root.mkdir(parents=True)
    database = root / "resolver-r3.sqlite"
    identities = fixture_identities()
    connection = sqlite3.connect(database)
    connection.row_factory = sqlite3.Row
    try:
        connection.executescript(resolver_schema_path().read_text(encoding="utf-8"))
        ordered_identities = list(identities)
        if reverse:
            ordered_identities.reverse()
        connection.executemany(
            "INSERT INTO source_registry VALUES(?,?,?,?,?,?,?,?,?)",
            [value.registry_row() for value in ordered_identities],
        )
        connection.execute(
            "INSERT INTO session VALUES(?,?,?,?,?,?,?,?)",
            ("S", "A" * 64, "B" * 64, "0.7.2", "closed", "continuous", "supported-working-evidence", "generated-unreviewed"),
        )
        functions = [
            (1, "func_00000100", "first", 0x100, 0x110, None, None, "fixture", "high", None),
            (2, "func_00000200", "second", 0x200, 0x210, None, None, "fixture", "high", None),
        ]
        if reverse:
            functions.reverse()
        connection.executemany("INSERT INTO static_function VALUES(?,?,?,?,?,?,?,?,?,?)", functions)
        connection.execute(
            "INSERT INTO resource_family VALUES(?,?,?,?,?,?,?)",
            ("family:test", "test", "fixture", "fixture", "accepted", "Supported", "fixture"),
        )
        connection.execute(
            "INSERT INTO resource VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                "resource:test",
                "family:test",
                "test-key",
                "fixture",
                None,
                None,
                "test resource",
                "accepted",
                "Supported",
                "fixture",
                "fixture",
                "fixture",
            ),
        )
        connection.execute(
            "INSERT INTO field_family VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (1, "family:object", "object", "fixture", "lineage", "fixture", "supported", "review-pending", "fixture", None, "different lineage", 0, 1),
        )
        connection.execute(
            "INSERT INTO field_candidate VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (1, 1, 0x84, "family:object+0x84", "object +0x84", None, "[]", "[]", "unknown", "not-observed", 0, "candidate", "review-pending", "lineage plus offset", "different lineage", None),
        )
        placements = [
            ("p1", "code-slab", 0x100, 0x110, 0x2000, 0x2010, "1" * 64, 16, 0x1F00, "executable", "verified", "fixture", 0, 1),
            ("p2", "code-slab", 0x200, 0x210, 0x2000, 0x2010, "2" * 64, 16, 0x1E00, "executable", "verified", "fixture", 0, 1),
        ]
        if reverse:
            placements.reverse()
        connection.executemany("INSERT INTO placement VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", placements)
        connection.executemany(
            "INSERT INTO function_placement VALUES(?,?,?,?,?,?,?,?,?,?)",
            (
                ("fp1", "p1", 1, 0x100, 0x110, 0x2000, 0x2010, "high", "fixture", 1),
                ("fp2", "p2", 2, 0x200, 0x210, 0x2000, 0x2010, "high", "fixture", 1),
            ),
        )
        connection.executemany(
            "INSERT INTO function_placement_witness VALUES(?,?,?,?,?,?,?)",
            (
                ("fp1", "S", "local1", 1, 1, 1, 1),
                ("fp2", "S", "local2", 10, 10, 2, 2),
            ),
        )
        connection.executemany(
            "INSERT INTO region_instance VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                ("r1", "S", "r1", "p1", 0x2000, 0x2010, "1" * 64, 1, 10, 1, 1, "replaced", "executable", "verified", "z64-rom", "z64:100-110", 1),
                ("r2", "S", "r2", "p2", 0x2000, 0x2010, "2" * 64, 10, None, 2, None, None, "executable", "verified", "z64-rom", "z64:200-210", 0),
            ),
        )
        connection.execute(
            "INSERT INTO runtime_execution VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            ("sample", "S", 5, 5, 1, 0x80002004, 0x2004, "sampled-pc-context", "sampled-only", "r1", 0x104, 1, "fixture", "contextual-region", "candidate", None, "generated-unreviewed"),
        )
        connection.executemany(
            "INSERT INTO function_coverage VALUES(?,?,?,?,?,?,?)",
            (
                (1, 1, 1, 0, 1, 0, "observed-placed-not-executed"),
                (2, 1, 1, 0, 0, 0, "observed-placed-not-executed"),
            ),
        )
        logical = _logical_hash(connection)
        connection.executemany(
            "INSERT INTO meta VALUES(?,?)",
            (("schema", RESOLVER_SCHEMA), ("schemaVersion", str(RESOLVER_SCHEMA_VERSION)), ("logicalSha256", logical)),
        )
        connection.commit()
        coverage = coverage_report(connection)
    finally:
        connection.close()
    (root / "summary.json").write_text(
        json.dumps({"schema": RESOLVER_SCHEMA, "logicalSha256": logical}, sort_keys=True),
        encoding="utf-8",
    )
    (root / "coverage.json").write_text(json.dumps(coverage, sort_keys=True), encoding="utf-8")
    return database, identities


class ResolverTests(unittest.TestCase):
    def test_context_free_reuse_fails_closed_and_sequence_selects_one_mapping(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            database, _ = make_resolver_product(Path(raw) / "product")
            connection = sqlite3.connect(database)
            connection.row_factory = sqlite3.Row
            try:
                no_context = resolve_live_address(connection, 0x80002004)
                first = resolve_live_address(connection, 0x80002004, session_id="S", sequence=5)
                second = resolve_live_address(connection, 0x80002004, session_id="S", sequence=15)
            finally:
                connection.close()
            self.assertEqual(no_context["status"], "ambiguous")
            self.assertEqual({row["functionId"] for row in no_context["candidates"]}, {1, 2})
            self.assertEqual(first["status"], "resolved")
            self.assertEqual(first["candidates"][0]["functionId"], 1)
            self.assertEqual(second["status"], "resolved")
            self.assertEqual(second["candidates"][0]["functionId"], 2)

    def test_static_compatibility_queries_and_lane_separation(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            database, _ = make_resolver_product(Path(raw) / "product")
            connection = sqlite3.connect(database)
            connection.row_factory = sqlite3.Row
            try:
                by_name, _ = explain(connection, "func_00000100", limit=5)
                by_id, _ = explain(connection, "id:1", limit=5)
                by_rom, _ = explain(connection, "rom:0x104", limit=5)
                field, _ = explain(connection, "field-offset:0x84", lane="field", limit=5)
                resource, _ = explain(connection, "resource:test", lane="resource", limit=5)
            finally:
                connection.close()
            self.assertEqual(by_name["functions"][0]["functionId"], 1)
            self.assertEqual(by_id["functions"][0]["functionId"], 1)
            self.assertEqual(by_rom["functions"][0]["functionId"], 1)
            self.assertEqual(field["fieldLane"]["directMatches"][0]["field_id"], 1)
            self.assertEqual(resource["resourceLane"]["matches"][0]["resource_id"], "resource:test")
            self.assertEqual(len(by_name["executions"]["exact"]), 0)
            self.assertEqual(len(by_name["executions"]["sampledContext"]), 1)

    def test_logical_build_is_order_independent_and_verifier_detects_mutation(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            first_db, identities = make_resolver_product(root / "first")
            second_db, _ = make_resolver_product(root / "second", reverse=True)
            with closing(sqlite3.connect(first_db)) as first, closing(
                sqlite3.connect(second_db)
            ) as second:
                self.assertEqual(_logical_hash(first), _logical_hash(second))
            self.assertEqual(_verify_database(root / "first", identities=identities)["result"], "PASS")
            with closing(sqlite3.connect(first_db)) as connection:
                connection.execute(
                    "UPDATE placement SET destination_physical_start=destination_physical_start+4 "
                    "WHERE placement_id='p1'"
                )
                connection.commit()
            self.assertEqual(_verify_database(root / "first", identities=identities)["result"], "FAIL")

    def test_stale_static_identity_fails_before_other_sources_are_opened(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static = root / "static.sqlite"
            static.write_bytes(b"not-the-frozen-static-db")
            paths = ResolverSourcePaths(static, root / "missing-resource", root / "missing-field", root / "missing-atlas", root / "missing-runtime")
            with self.assertRaisesRegex(ValueError, "static-db-r3 identity mismatch"):
                validate_resolver_sources(
                    paths,
                    expected_identities={"static-db-r3": "0" * 64},
                )


if __name__ == "__main__":
    unittest.main()
