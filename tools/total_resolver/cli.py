"""Canonical command surface for Total Resolver R3."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sqlite3
import sys
from typing import Any, Sequence

from .derive_transition import derive_transition
from .benchmark import run_persistent_delta_benchmark
from .derive_session import derive_session
from .inventory import Check, verify_inventory
from .knowledge import (
    create_knowledge_database,
    default_knowledge_database,
    knowledge_status,
    migrate_frontier_database,
    select_knowledge_database,
    selected_knowledge_database,
    verify_knowledge_database,
)
from .knowledge_ingest import (
    import_valid_sessions,
    ingest_session,
    rebuild_knowledge_database,
)
from .overlay_atlas import build_overlay_atlas, verify_overlay_atlas
from .pj64_client import DEFAULT_HOST, DEFAULT_PORT, Pj64Client, Pj64Error
from .protocol import BridgeProtocolError
from .runtime_provenance import build_runtime_provenance, verify_runtime_provenance
from .resolver import (
    build_total_resolver,
    coverage_report,
    verify_total_resolver,
)
from .resolver_query import explain, unresolved_report
from .resolver_context import (
    DEFAULT_QUERY_LIMIT,
    ResolverContext,
    coverage_selected,
    explain_selected,
    legacy_manifest,
    open_explicit_legacy_resolver,
    search_selected,
    unresolved_selected,
)
from .resolver_sources import (
    QuerySourcePaths,
    ResolverSourcePaths,
    default_query_source_paths,
    default_source_paths,
)
from .live_resolver import (
    build_bridge_context_bundle,
    build_event_bundle,
    derive_live_snapshot,
    explain_current_address,
    replay_live_bundle,
    resolve_snapshot_address,
)
from .sessions import (
    SessionConnection,
    active_session_id,
    add_session_annotation,
    create_session,
    record_session_ingestion,
    recover_session,
    request_session_stop,
    session_deduplication_report,
    session_status,
    sessions_root,
    verify_named_session,
)


def _print(value: Any) -> None:
    print(json.dumps(value, indent=2, sort_keys=True))


def _add_connection_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--host", default=DEFAULT_HOST)
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--timeout", type=float, default=5.0)


def _add_sessions_root(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--root", type=Path, help="override build/total-resolver/sessions")


def _add_resolver_source_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--static-db", type=Path)
    parser.add_argument("--resource-db", type=Path)
    parser.add_argument("--field-product", type=Path)
    parser.add_argument("--overlay-atlas", type=Path)
    parser.add_argument("--runtime-provenance", type=Path)


def _add_query_source_arguments(
    parser: argparse.ArgumentParser, *, allow_legacy: bool = True
) -> None:
    dynamic = parser.add_mutually_exclusive_group()
    dynamic.add_argument(
        "--knowledge-db",
        type=Path,
        help="persistent knowledge database (defaults to the selected database)",
    )
    if allow_legacy:
        dynamic.add_argument(
            "--legacy-resolver",
            type=Path,
            help="explicitly inspect a historical generated Resolver database",
        )
    parser.add_argument("--static-db", type=Path)
    parser.add_argument("--resource-db", type=Path)
    parser.add_argument("--field-product", type=Path)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="OB64 Total Resolver R3")
    commands = parser.add_subparsers(dest="command", required=True)

    doctor = commands.add_parser("doctor", help="verify the frozen Phase 0 boundary")
    doctor.add_argument("--research-root", type=Path)
    doctor.add_argument("--project64-root", type=Path)
    doctor.add_argument("--connect", action="store_true", help="also validate a live bridge")
    _add_connection_arguments(doctor)

    pj64 = commands.add_parser("pj64", help="query the configured Project64 bridge")
    pj64_commands = pj64.add_subparsers(dest="pj64_command", required=True)
    for name in ("health", "status"):
        child = pj64_commands.add_parser(name)
        _add_connection_arguments(child)

    session = commands.add_parser("session", help="manage observation-only capture sessions")
    session_commands = session.add_subparsers(dest="session_command", required=True)

    start = session_commands.add_parser("start", help="start a new pristine capture session")
    _add_connection_arguments(start)
    _add_sessions_root(start)
    start.add_argument("--foreground", action="store_true", help="run the worker in this process")
    start.add_argument(
        "--before-rom",
        action="store_true",
        help="arm capture while Project64 has no ROM or RDRAM, then wait for manual ROM load",
    )
    start.add_argument(
        "--knowledge",
        type=Path,
        help="persistent knowledge database (defaults to the selected database)",
    )

    knowledge = commands.add_parser(
        "knowledge", help="manage persistent cross-session Total Resolver knowledge"
    )
    knowledge_commands = knowledge.add_subparsers(dest="knowledge_command", required=True)
    knowledge_init = knowledge_commands.add_parser("init", help="initialize and select a database")
    knowledge_init.add_argument("--db", type=Path)
    knowledge_init.add_argument("--rom", type=Path, required=True)
    knowledge_init.add_argument("--static-db", type=Path)
    knowledge_init.add_argument("--resource-db", type=Path)
    knowledge_init.add_argument("--no-select", action="store_true")
    knowledge_select = knowledge_commands.add_parser("select", help="select an initialized database")
    knowledge_select.add_argument("db", type=Path)
    knowledge_migrate_frontier = knowledge_commands.add_parser(
        "migrate-frontier",
        help="copy a knowledge database to protocol frontier format 4 and verify it",
    )
    knowledge_migrate_frontier.add_argument("--db", type=Path)
    knowledge_migrate_frontier.add_argument("--output", type=Path, required=True)
    knowledge_migrate_frontier.add_argument("--select", action="store_true")
    knowledge_migrate_schema3 = knowledge_commands.add_parser(
        "migrate-schema3",
        help="replay a verified ledger into a new schema-3 database beside the source",
    )
    knowledge_migrate_schema3.add_argument("--db", type=Path)
    knowledge_migrate_schema3.add_argument("--output", type=Path, required=True)
    knowledge_migrate_schema3.add_argument("--select", action="store_true")
    for name, help_text in (
        ("status", "report persistent coverage and the current frontier"),
        ("verify", "verify facts, frontier, and incremental materializations"),
    ):
        child = knowledge_commands.add_parser(name, help=help_text)
        child.add_argument("--db", type=Path)
    knowledge_ingest = knowledge_commands.add_parser(
        "ingest", help="verify and retry ingestion of one closed staging session"
    )
    knowledge_ingest.add_argument("session_id")
    knowledge_ingest.add_argument("--db", type=Path)
    knowledge_ingest.add_argument("--sessions-root", type=Path)
    knowledge_import = knowledge_commands.add_parser(
        "import", help="migrate valid historical sessions without overwriting their products"
    )
    knowledge_import.add_argument("--db", type=Path)
    knowledge_import.add_argument("--sessions-root", type=Path)
    knowledge_import.add_argument("--continue-on-error", action="store_true")
    knowledge_rebuild = knowledge_commands.add_parser(
        "rebuild", help="replay the declared ledger into a new verification database"
    )
    knowledge_rebuild.add_argument("--db", type=Path)
    knowledge_rebuild.add_argument("--output", type=Path, required=True)
    knowledge_benchmark = knowledge_commands.add_parser(
        "benchmark", help="measure repeated-delta volume and the native-filter boundary"
    )
    knowledge_benchmark.add_argument("--output", type=Path)

    status = session_commands.add_parser("status", help="show current session state")
    status.add_argument("session_id", nargs="?")
    _add_sessions_root(status)

    for name, help_text in (
        ("label", "label a stable visible state"),
        ("mark", "mark a transition or action boundary"),
        ("note", "attach a contextual note"),
    ):
        child = session_commands.add_parser(name, help=help_text)
        child.add_argument("text")
        child.add_argument("--session-id")
        child.add_argument("--context-before", type=int, default=256)
        child.add_argument("--context-after", type=int, default=256)
        _add_connection_arguments(child)
        _add_sessions_root(child)

    stop = session_commands.add_parser("stop", help="cleanly stop and verify a capture")
    stop.add_argument("session_id", nargs="?")
    stop.add_argument("--wait", type=float, default=120.0)
    _add_sessions_root(stop)

    verify = session_commands.add_parser("verify", help="independently verify a closed session")
    verify.add_argument("session_id")
    _add_sessions_root(verify)

    dedupe = session_commands.add_parser(
        "dedupe",
        help="report automatic exact-content deduplication without deleting occurrences",
    )
    dedupe.add_argument("session_id")
    _add_sessions_root(dedupe)

    recover = session_commands.add_parser(
        "recover", help="close a dead open worker as an explicit interruption"
    )
    recover.add_argument("session_id", nargs="?")
    _add_connection_arguments(recover)
    _add_sessions_root(recover)

    derive = commands.add_parser("derive", help="build deterministic products from raw sessions")
    derive_commands = derive.add_subparsers(dest="derive_command", required=True)
    transition = derive_commands.add_parser(
        "transition", help="derive one marked ROM-DMA/placement transition"
    )
    transition.add_argument("session_id")
    transition.add_argument("--from-marker", type=int, required=True)
    transition.add_argument("--to-marker", type=int, required=True)
    transition.add_argument("--rom", type=Path, required=True)
    transition.add_argument("--static-db", type=Path)
    transition.add_argument("--resource-db", type=Path)
    transition.add_argument("--output", type=Path)
    _add_sessions_root(transition)
    whole_session = derive_commands.add_parser(
        "session", help="derive whole-session loader, range-change, and execution facts"
    )
    whole_session.add_argument("session_id")
    whole_session.add_argument("--rom", type=Path, required=True)
    whole_session.add_argument("--static-db", type=Path)
    whole_session.add_argument("--resource-db", type=Path)
    whole_session.add_argument("--output", type=Path)
    _add_sessions_root(whole_session)

    atlas = commands.add_parser("atlas", help="build or verify Overlay Atlas 2.0")
    atlas_commands = atlas.add_subparsers(dest="atlas_command", required=True)
    atlas_build = atlas_commands.add_parser("build", help="build from whole-session products")
    atlas_build.add_argument(
        "--session-product", type=Path, action="append", required=True
    )
    atlas_build.add_argument("--static-db", type=Path)
    atlas_build.add_argument("--output", type=Path)
    atlas_verify = atlas_commands.add_parser("verify", help="verify an Overlay Atlas 2.0 product")
    atlas_verify.add_argument("product", type=Path)

    runtime = commands.add_parser("runtime", help="build or verify Runtime Provenance 2.0")
    runtime_commands = runtime.add_subparsers(dest="runtime_command", required=True)
    runtime_build = runtime_commands.add_parser(
        "build", help="build from whole-session products and Overlay Atlas 2.0"
    )
    runtime_build.add_argument(
        "--session-product", type=Path, action="append", required=True
    )
    runtime_build.add_argument("--overlay-atlas", type=Path, required=True)
    runtime_build.add_argument("--static-db", type=Path)
    runtime_build.add_argument("--output", type=Path)
    runtime_verify = runtime_commands.add_parser(
        "verify", help="verify a Runtime Provenance 2.0 product"
    )
    runtime_verify.add_argument("product", type=Path)

    resolver = commands.add_parser("resolver", help="build or verify Total Resolver R3")
    resolver_commands = resolver.add_subparsers(dest="resolver_command", required=True)
    resolver_build = resolver_commands.add_parser(
        "build", help="build the normalized multi-lane resolver"
    )
    _add_resolver_source_arguments(resolver_build)
    resolver_build.add_argument("--output", type=Path)
    resolver_verify = resolver_commands.add_parser(
        "verify", help="verify a normalized resolver product and all selected sources"
    )
    resolver_verify.add_argument("product", type=Path)
    _add_resolver_source_arguments(resolver_verify)

    explain_command = commands.add_parser(
        "explain", help="query selected persistent knowledge across evidence lanes"
    )
    explain_command.add_argument("identifier")
    _add_query_source_arguments(explain_command)
    explain_command.add_argument("--session", dest="resolver_session")
    explain_command.add_argument("--sequence", type=int)
    explain_command.add_argument("--frame", type=int)
    explain_command.add_argument(
        "--lane",
        choices=("static", "dynamic", "placement", "runtime", "field", "resource"),
    )
    explain_command.add_argument(
        "--relationship",
        choices=("all", "placements", "callers", "callees", "executions"),
        default="all",
    )
    explain_command.add_argument(
        "--include",
        action="append",
        default=[],
        help="detailed section to include (repeatable or comma-separated)",
    )
    explain_command.add_argument("--limit", type=int, default=DEFAULT_QUERY_LIMIT)
    explain_command.add_argument("--cursor", type=int, default=0)
    explain_command.add_argument(
        "--current",
        action="store_true",
        help="resolve at the latest active raw-capture boundary using the live bridge epoch",
    )
    explain_command.add_argument("--sessions-root", type=Path)
    explain_command.add_argument("--rom", type=Path)
    _add_connection_arguments(explain_command)

    coverage_command = commands.add_parser(
        "coverage", help="report selected persistent knowledge coverage"
    )
    _add_query_source_arguments(coverage_command)

    unresolved_command = commands.add_parser(
        "unresolved", help="show selected persistent unresolved work queues"
    )
    _add_query_source_arguments(unresolved_command)
    unresolved_command.add_argument(
        "--lane",
        choices=("dynamic", "static", "placement", "runtime", "field", "resource"),
    )
    unresolved_command.add_argument("--kind")
    unresolved_command.add_argument("--session")
    unresolved_command.add_argument("--limit", type=int, default=DEFAULT_QUERY_LIMIT)
    unresolved_command.add_argument("--cursor", type=int, default=0)

    search_command = commands.add_parser(
        "search", help="bounded read-only search over selected persistent knowledge"
    )
    _add_query_source_arguments(search_command, allow_legacy=False)
    search_command.add_argument("--text")
    search_command.add_argument("--function")
    search_command.add_argument("--rom")
    search_command.add_argument("--live")
    search_command.add_argument("--physical")
    search_command.add_argument("--opcode")
    search_command.add_argument("--bytes", dest="exact_bytes")
    search_command.add_argument("--session")
    search_command.add_argument("--frame-start", type=int)
    search_command.add_argument("--frame-end", type=int)
    search_command.add_argument("--sequence-start", type=int)
    search_command.add_argument("--sequence-end", type=int)
    search_command.add_argument("--edge-from")
    search_command.add_argument("--edge-to")
    search_command.add_argument("--mapping-status")
    search_command.add_argument("--unresolved-kind")
    search_command.add_argument("--marker-text")
    search_command.add_argument("--marker-type")
    search_command.add_argument("--controller", action="store_true")
    search_command.add_argument("--buttons")
    search_command.add_argument("--limit", type=int, default=DEFAULT_QUERY_LIMIT)
    search_command.add_argument("--cursor", type=int, default=0)

    live = commands.add_parser("live", help="read-only live enrichment and evidence bundles")
    live_commands = live.add_subparsers(dest="live_command", required=True)
    live_bundle = live_commands.add_parser(
        "bundle", help="preserve one raw event first, then add resolver enrichment"
    )
    live_bundle.add_argument("session_id")
    live_bundle.add_argument("--sequence", type=int, required=True)
    live_bundle.add_argument("--sessions-root", type=Path)
    live_bundle.add_argument("--rom", type=Path)
    live_bundle.add_argument("--resolver-db", type=Path)
    live_bundle.add_argument("--static-db", type=Path)
    live_bundle.add_argument("--resource-db", type=Path)
    live_bundle.add_argument("--output", type=Path)
    live_replay = live_commands.add_parser(
        "replay", help="reproduce a saved event bundle entirely offline"
    )
    live_replay.add_argument("bundle", type=Path)
    live_replay.add_argument("--sessions-root", type=Path)
    live_replay.add_argument("--rom", type=Path)
    live_replay.add_argument("--resolver-db", type=Path)
    live_replay.add_argument("--static-db", type=Path)
    live_replay.add_argument("--resource-db", type=Path)
    live_crash = live_commands.add_parser(
        "crash", help="save raw bridge exception/status first, then resolve it"
    )
    live_crash.add_argument("--session-id")
    live_crash.add_argument("--sessions-root", type=Path)
    live_crash.add_argument("--rom", type=Path)
    live_crash.add_argument("--resolver-db", type=Path)
    live_crash.add_argument("--static-db", type=Path)
    live_crash.add_argument("--resource-db", type=Path)
    live_crash.add_argument("--output", type=Path)
    _add_connection_arguments(live_crash)
    live_current = live_commands.add_parser(
        "current", help="resolve an address at the latest active capture boundary"
    )
    live_current.add_argument("address")
    live_current.add_argument("--session-id")
    live_current.add_argument("--sessions-root", type=Path)
    live_current.add_argument("--rom", type=Path)
    live_current.add_argument("--resolver-db", type=Path)
    live_current.add_argument("--static-db", type=Path)
    live_current.add_argument("--resource-db", type=Path)
    _add_connection_arguments(live_current)
    return parser


def _live_check(args: argparse.Namespace) -> tuple[Check, dict[str, Any] | None]:
    try:
        with Pj64Client(args.host, args.port, args.timeout) as client:
            assert client.handshake_result is not None
            handshake = client.handshake_result.to_dict()
    except (OSError, Pj64Error, BridgeProtocolError, ValueError) as exc:
        return Check("project64-live-bridge", "FAIL", str(exc)), None
    return Check("project64-live-bridge", "PASS", handshake["version"]), handshake


def _doctor(args: argparse.Namespace) -> int:
    checks = verify_inventory(
        research_root=args.research_root,
        project64_root=args.project64_root,
    )
    live: dict[str, Any] | None = None
    if args.connect:
        live_check, live = _live_check(args)
        checks.append(live_check)
    payload = {
        "result": "PASS" if all(check.status != "FAIL" for check in checks) else "FAIL",
        "checks": [check.to_dict() for check in checks],
        "liveBridge": live,
    }
    _print(payload)
    return 0 if payload["result"] == "PASS" else 1


def _pj64(args: argparse.Namespace) -> int:
    try:
        with Pj64Client(args.host, args.port, args.timeout) as client:
            assert client.handshake_result is not None
            response = client.health() if args.pj64_command == "health" else client.status()
            payload = {
                "handshake": client.handshake_result.to_dict(),
                "response": response,
            }
    except (OSError, Pj64Error, BridgeProtocolError, ValueError) as exc:
        print(f"Total Resolver Project64 request failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0


def _connection(args: argparse.Namespace) -> SessionConnection:
    return SessionConnection(args.host, args.port, args.timeout)


def _session(args: argparse.Namespace) -> int:
    try:
        if args.session_command == "start":
            payload = create_session(
                root=args.root,
                connection=_connection(args),
                foreground=args.foreground,
                knowledge_database=args.knowledge,
                before_rom=args.before_rom,
            )
        elif args.session_command == "status":
            payload = session_status(args.session_id, root=args.root)
        elif args.session_command in {"label", "mark", "note"}:
            marker_types = {
                "label": "stable-state",
                "mark": "visible-action",
                "note": "note",
            }
            payload = add_session_annotation(
                args.text,
                marker_type=marker_types[args.session_command],
                session_id=args.session_id,
                root=args.root,
                connection=_connection(args),
                context_before=args.context_before,
                context_after=args.context_after,
            )
        elif args.session_command == "stop":
            payload = request_session_stop(
                args.session_id,
                root=args.root,
                wait_seconds=args.wait,
            )
        elif args.session_command == "verify":
            result = verify_named_session(args.session_id, root=args.root)
            payload = result.to_dict()
            _print(payload)
            return 0 if result.ok else 1
        elif args.session_command == "dedupe":
            payload = session_deduplication_report(args.session_id, root=args.root)
        elif args.session_command == "recover":
            root = sessions_root(args.root)
            session_id = args.session_id or active_session_id(root)
            if session_id is None:
                raise RuntimeError("there is no active Total Resolver session")
            payload = recover_session(
                session_id,
                root=root,
                connection=_connection(args),
            )
        else:
            raise AssertionError(f"unhandled session command: {args.session_command}")
    except (OSError, sqlite3.Error, Pj64Error, BridgeProtocolError, ValueError, RuntimeError) as exc:
        print(f"Total Resolver session command failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    if args.session_command == "stop" and payload.get("closureStatus") == "open":
        return 3
    return 0


def _selected_knowledge(explicit: Path | None) -> Path:
    if explicit is not None:
        return explicit.resolve()
    selected = selected_knowledge_database()
    if selected is None:
        raise RuntimeError(
            "no persistent knowledge database is selected; run `knowledge init` or pass --db"
        )
    return selected


def _knowledge(args: argparse.Namespace) -> int:
    try:
        if args.knowledge_command == "init":
            database = (args.db or default_knowledge_database()).resolve()
            payload = create_knowledge_database(
                database,
                rom_path=args.rom,
                static_database=args.static_db,
                resource_database=args.resource_db,
            )
            if not args.no_select:
                select_knowledge_database(database)
                payload["selected"] = True
        elif args.knowledge_command == "select":
            payload = select_knowledge_database(args.db)
        elif args.knowledge_command == "migrate-frontier":
            payload = migrate_frontier_database(
                _selected_knowledge(args.db), args.output
            )
            if args.select:
                payload["selection"] = select_knowledge_database(args.output)
        elif args.knowledge_command == "migrate-schema3":
            payload = rebuild_knowledge_database(
                _selected_knowledge(args.db), args.output
            )
            payload["migration"] = "schema-3-ledger-replay"
            if args.select:
                payload["selection"] = select_knowledge_database(args.output)
        elif args.knowledge_command == "status":
            payload = knowledge_status(_selected_knowledge(args.db))
        elif args.knowledge_command == "verify":
            payload = verify_knowledge_database(_selected_knowledge(args.db))
            _print(payload)
            return 0 if payload["result"] == "PASS" else 1
        elif args.knowledge_command == "ingest":
            session_directory = sessions_root(args.sessions_root) / args.session_id
            payload = ingest_session(
                _selected_knowledge(args.db), session_directory
            )
            record_session_ingestion(
                args.session_id, payload, root=args.sessions_root
            )
        elif args.knowledge_command == "import":
            payload = import_valid_sessions(
                _selected_knowledge(args.db),
                sessions_root(args.sessions_root),
                strict=not args.continue_on_error,
            )
        elif args.knowledge_command == "rebuild":
            payload = rebuild_knowledge_database(
                _selected_knowledge(args.db), args.output
            )
        elif args.knowledge_command == "benchmark":
            payload = run_persistent_delta_benchmark(args.output)
        else:
            raise AssertionError(f"unhandled knowledge command: {args.knowledge_command}")
    except (OSError, sqlite3.Error, ValueError, RuntimeError) as exc:
        print(f"Total Resolver knowledge command failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0 if payload.get("result", "PASS") == "PASS" else 1


def _derive(args: argparse.Namespace) -> int:
    try:
        if args.derive_command == "transition":
            payload = derive_transition(
                args.session_id,
                from_marker_id=args.from_marker,
                to_marker_id=args.to_marker,
                rom_path=args.rom,
                sessions_directory=args.root,
                output_directory=args.output,
                static_database=args.static_db,
                resource_database=args.resource_db,
            )
        elif args.derive_command == "session":
            payload = derive_session(
                args.session_id,
                rom_path=args.rom,
                sessions_directory=args.root,
                output_directory=args.output,
                static_database=args.static_db,
                resource_database=args.resource_db,
            )
        else:
            raise AssertionError(f"unhandled derive command: {args.derive_command}")
    except (OSError, sqlite3.Error, ValueError, RuntimeError) as exc:
        print(f"Total Resolver derivation failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0 if payload.get("result") == "PASS" else 1


def _atlas(args: argparse.Namespace) -> int:
    try:
        if args.atlas_command == "build":
            payload = build_overlay_atlas(
                args.session_product,
                output_directory=args.output,
                static_database=args.static_db,
            )
        elif args.atlas_command == "verify":
            payload = verify_overlay_atlas(args.product)
        else:
            raise AssertionError(f"unhandled atlas command: {args.atlas_command}")
    except (OSError, sqlite3.Error, ValueError, RuntimeError) as exc:
        print(f"Total Resolver Overlay Atlas command failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0 if payload.get("result") == "PASS" else 1


def _runtime(args: argparse.Namespace) -> int:
    try:
        if args.runtime_command == "build":
            payload = build_runtime_provenance(
                args.session_product,
                overlay_atlas=args.overlay_atlas,
                output_directory=args.output,
                static_database=args.static_db,
            )
        elif args.runtime_command == "verify":
            payload = verify_runtime_provenance(args.product)
        else:
            raise AssertionError(f"unhandled runtime command: {args.runtime_command}")
    except (OSError, sqlite3.Error, ValueError, RuntimeError) as exc:
        print(f"Total Resolver Runtime Provenance command failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0 if payload.get("result") == "PASS" else 1


def _resolver_source_paths(args: argparse.Namespace) -> ResolverSourcePaths:
    defaults = default_source_paths()
    return ResolverSourcePaths(
        static_database=args.static_db or defaults.static_database,
        resource_database=args.resource_db or defaults.resource_database,
        field_product=args.field_product or defaults.field_product,
        overlay_atlas=args.overlay_atlas or defaults.overlay_atlas,
        runtime_provenance=args.runtime_provenance or defaults.runtime_provenance,
    )


def _resolver(args: argparse.Namespace) -> int:
    try:
        if args.resolver_command == "build":
            payload = build_total_resolver(
                source_paths=_resolver_source_paths(args),
                output_directory=args.output,
            )
        elif args.resolver_command == "verify":
            payload = verify_total_resolver(
                args.product,
                source_paths=_resolver_source_paths(args),
            )
        else:
            raise AssertionError(f"unhandled resolver command: {args.resolver_command}")
    except (OSError, sqlite3.Error, ValueError, RuntimeError) as exc:
        print(f"Total Resolver R3 command failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0 if payload.get("result") == "PASS" else 1


def _query_source_paths(args: argparse.Namespace) -> QuerySourcePaths:
    defaults = default_query_source_paths()
    return QuerySourcePaths(
        static_database=args.static_db or defaults.static_database,
        resource_database=args.resource_db or defaults.resource_database,
        field_product=args.field_product or defaults.field_product,
    )


def _open_query_context(args: argparse.Namespace) -> ResolverContext:
    paths = _query_source_paths(args)
    return ResolverContext.open(
        args.knowledge_db,
        static_database=paths.static_database,
        resource_database=paths.resource_database,
        field_product=paths.field_product,
    )


def _query_includes(args: argparse.Namespace) -> list[str]:
    includes = [
        part.strip()
        for value in args.include
        for part in value.split(",")
        if part.strip()
    ]
    relationship = args.relationship
    if relationship != "all":
        includes.append(
            "placements"
            if relationship == "placements"
            else "calls"
            if relationship in {"callers", "callees"}
            else "instructions"
        )
    if args.lane == "field":
        includes.append("fields")
    elif args.lane == "resource":
        includes.append("resources")
    return includes


def _explain(args: argparse.Namespace) -> int:
    try:
        if args.current:
            if args.legacy_resolver is not None:
                raise ValueError("--current cannot use a historical generated Resolver")
            lower = args.identifier.casefold()
            if not lower.startswith("live:"):
                raise ValueError("--current currently requires a live:0x... identifier")
            live_address = int(args.identifier.split(":", 1)[1], 0)
            root = sessions_root(args.sessions_root)
            session_id = args.resolver_session or active_session_id(root)
            if session_id is None:
                raise ValueError("--current requires an active raw capture session")
            with Pj64Client(args.host, args.port, args.timeout) as client:
                bridge_status = client.status()
            snapshot = derive_live_snapshot(
                session_id,
                sessions_directory=root,
                rom_path=args.rom,
                static_database=args.static_db,
                resource_database=args.resource_db,
            )
            if bridge_status.get("bridgeEpoch") != snapshot.session["bridge_epoch"]:
                raise ValueError("live bridge epoch differs from the active capture session")
            mapping = resolve_snapshot_address(snapshot, live_address)
            mapped_function = mapping.get("function")
            query_identifier = (
                str(mapped_function["structuralName"])
                if isinstance(mapped_function, dict)
                else args.identifier
            )
            with _open_query_context(args) as context:
                knowledge_payload, query_status = explain_selected(
                    context,
                    query_identifier,
                    session_id=session_id,
                    sequence=bridge_status.get("nextEventSequence"),
                    frame=bridge_status.get("frameCount"),
                    includes=_query_includes(args),
                    limit=args.limit,
                    cursor=args.cursor,
                )
            payload = {
                "schema": "ob64-total-resolver-current-selected-knowledge.v1",
                "reviewState": "live-unreviewed",
                "liveAddress": live_address,
                "bridgeContext": bridge_status,
                "captureContext": snapshot.context_dict(),
                "mapping": mapping,
                "knowledgeQuery": knowledge_payload,
                "sourceManifest": knowledge_payload["sourceManifest"],
            }
            _print(payload)
            return query_status if str(mapping["status"]).startswith("resolved") else 2
        if args.legacy_resolver is not None:
            connection = open_explicit_legacy_resolver(args.legacy_resolver)
            try:
                payload, status = explain(
                    connection,
                    args.identifier,
                    session_id=args.resolver_session,
                    sequence=args.sequence,
                    frame=args.frame,
                    lane=args.lane if args.lane != "dynamic" else None,
                    relationship=args.relationship,
                    limit=args.limit,
                )
                payload["sourceManifest"] = legacy_manifest(
                    args.legacy_resolver, connection
                )
            finally:
                connection.close()
        else:
            with _open_query_context(args) as context:
                payload, status = explain_selected(
                    context,
                    args.identifier,
                    session_id=args.resolver_session,
                    sequence=args.sequence,
                    frame=args.frame,
                    includes=_query_includes(args),
                    limit=args.limit,
                    cursor=args.cursor,
                )
    except (OSError, sqlite3.Error, ValueError) as exc:
        print(f"Total Resolver query failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return status


def _coverage(args: argparse.Namespace) -> int:
    try:
        if args.legacy_resolver is not None:
            connection = open_explicit_legacy_resolver(args.legacy_resolver)
            try:
                payload = coverage_report(connection)
                payload["sourceManifest"] = legacy_manifest(
                    args.legacy_resolver, connection
                )
            finally:
                connection.close()
        else:
            with _open_query_context(args) as context:
                payload = coverage_selected(context)
    except (OSError, sqlite3.Error, ValueError) as exc:
        print(f"Total Resolver coverage failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0


def _parse_live_address(value: str) -> int:
    lower = value.casefold()
    return int(value.split(":", 1)[1], 0) if lower.startswith("live:") else int(value, 0)


def _live(args: argparse.Namespace) -> int:
    try:
        if args.live_command == "bundle":
            payload = build_event_bundle(
                args.session_id,
                sequence_id=args.sequence,
                sessions_directory=args.sessions_root,
                rom_path=args.rom,
                resolver_database=args.resolver_db,
                output_directory=args.output,
                static_database=args.static_db,
                resource_database=args.resource_db,
            )
        elif args.live_command == "replay":
            payload = replay_live_bundle(
                args.bundle,
                sessions_directory=args.sessions_root,
                rom_path=args.rom,
                resolver_database=args.resolver_db,
                static_database=args.static_db,
                resource_database=args.resource_db,
            )
        elif args.live_command == "crash":
            with Pj64Client(args.host, args.port, args.timeout) as client:
                payload = build_bridge_context_bundle(
                    client=client,
                    bundle_kind="crash-context",
                    session_id=args.session_id,
                    sessions_directory=args.sessions_root,
                    rom_path=args.rom,
                    resolver_database=args.resolver_db,
                    output_directory=args.output,
                    static_database=args.static_db,
                    resource_database=args.resource_db,
                )
        elif args.live_command == "current":
            with Pj64Client(args.host, args.port, args.timeout) as client:
                payload = explain_current_address(
                    _parse_live_address(args.address),
                    client=client,
                    session_id=args.session_id,
                    sessions_directory=args.sessions_root,
                    rom_path=args.rom,
                    resolver_database=args.resolver_db,
                    static_database=args.static_db,
                    resource_database=args.resource_db,
                )
        else:
            raise AssertionError(f"unhandled live command: {args.live_command}")
    except (OSError, sqlite3.Error, Pj64Error, BridgeProtocolError, ValueError) as exc:
        print(f"Total Resolver live enrichment failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0 if payload.get("result", "PASS") == "PASS" else 1


def _unresolved(args: argparse.Namespace) -> int:
    try:
        if args.legacy_resolver is not None:
            if args.kind is not None or args.session is not None or args.cursor:
                raise ValueError(
                    "legacy unresolved queries do not support kind, session, or cursor filters"
                )
            connection = open_explicit_legacy_resolver(args.legacy_resolver)
            try:
                legacy_lane = args.lane
                if legacy_lane == "dynamic":
                    legacy_lane = "runtime"
                payload = unresolved_report(
                    connection, lane=legacy_lane, limit=args.limit
                )
                payload["sourceManifest"] = legacy_manifest(
                    args.legacy_resolver, connection
                )
            finally:
                connection.close()
        else:
            with _open_query_context(args) as context:
                payload = unresolved_selected(
                    context,
                    lane=args.lane,
                    kind=args.kind,
                    session_id=args.session,
                    limit=args.limit,
                    cursor=args.cursor,
                )
    except (OSError, sqlite3.Error, ValueError) as exc:
        print(f"Total Resolver unresolved query failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0


def _search(args: argparse.Namespace) -> int:
    try:
        with _open_query_context(args) as context:
            payload = search_selected(
                context,
                text=args.text,
                function=args.function,
                rom=args.rom,
                live=args.live,
                physical=args.physical,
                opcode=args.opcode,
                exact_bytes=args.exact_bytes,
                session_id=args.session,
                frame_start=args.frame_start,
                frame_end=args.frame_end,
                sequence_start=args.sequence_start,
                sequence_end=args.sequence_end,
                edge_from=args.edge_from,
                edge_to=args.edge_to,
                mapping_status=args.mapping_status,
                unresolved_kind=args.unresolved_kind,
                marker_text=args.marker_text,
                marker_type=args.marker_type,
                controller=args.controller,
                buttons=args.buttons,
                limit=args.limit,
                cursor=args.cursor,
            )
    except (OSError, sqlite3.Error, ValueError) as exc:
        print(f"Total Resolver search failed: {exc}", file=sys.stderr)
        return 2
    _print(payload)
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.command == "doctor":
        return _doctor(args)
    if args.command == "pj64":
        return _pj64(args)
    if args.command == "session":
        return _session(args)
    if args.command == "knowledge":
        return _knowledge(args)
    if args.command == "derive":
        return _derive(args)
    if args.command == "atlas":
        return _atlas(args)
    if args.command == "runtime":
        return _runtime(args)
    if args.command == "resolver":
        return _resolver(args)
    if args.command == "explain":
        return _explain(args)
    if args.command == "coverage":
        return _coverage(args)
    if args.command == "unresolved":
        return _unresolved(args)
    if args.command == "search":
        return _search(args)
    if args.command == "live":
        return _live(args)
    raise AssertionError(f"unhandled command: {args.command}")
