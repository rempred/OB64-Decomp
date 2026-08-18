"""Read-only current-session enrichment and reproducible evidence bundles."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
from typing import Any, Mapping

from .addressing import physical_from_live
from .capture_db import canonical_json
from .derive_session import (
    _active_region_for_pc,
    _execution_analysis,
    _memory_analysis,
)
from .derive_transition import (
    DerivedTransaction,
    _derive_regions,
    _derive_transactions,
    _read_payload,
    _write_json,
    default_resource_database,
    default_static_database,
)
from .identities import read_normalized_rom, rom_identity_from_file
from .inventory import load_inventory, repository_root, sha256_file
from .pj64_client import Pj64Client
from .resolver import resolver_products_root
from .resolver_query import explain, open_resolver
from .schema import open_capture_database
from .sessions import active_session_id, sessions_root
from .static_model import StaticModel


LIVE_BUNDLE_SCHEMA = "ob64-total-resolver-live-bundle.v1"


def default_rom_path() -> Path:
    path = (
        repository_root().parent
        / "Ogre Battle 64 - Person of Lordly Caliber (U) [!].v64"
    ).resolve()
    if not path.is_file():
        raise FileNotFoundError(
            "the exact Rev 0 ROM was not found at the configured research-workspace path"
        )
    return path


def default_resolver_database() -> Path:
    return resolver_products_root() / "resolver-r3.sqlite"


def live_bundles_root(explicit: Path | None = None) -> Path:
    return (
        explicit
        or repository_root() / "build" / "total-resolver" / "bundles"
    ).resolve()


@dataclass(frozen=True)
class LiveSnapshot:
    session_id: str
    terminal_sequence: int
    session: Mapping[str, Any]
    transactions: tuple[DerivedTransaction, ...]
    regions: tuple[Mapping[str, Any], ...]
    executions: tuple[Mapping[str, Any], ...]
    memory_accesses: tuple[Mapping[str, Any], ...]
    pairing_diagnostics: Mapping[str, Any]
    region_issues: tuple[Mapping[str, Any], ...]
    bridge_loss_ranges: int
    static: StaticModel

    def context_dict(self) -> dict[str, Any]:
        return {
            "sessionId": self.session_id,
            "terminalSequence": self.terminal_sequence,
            "bridgeEpoch": self.session["bridge_epoch"],
            "bridgeVersion": self.session["bridge_version"],
            "closureStatus": self.session["closure_status"],
            "continuityStatus": self.session["continuity_status"],
            "bridgeLossRanges": self.bridge_loss_ranges,
            "romDmaTransactions": len(self.transactions),
            "regionInstances": len(self.regions),
            "pairingDiagnostics": dict(self.pairing_diagnostics),
            "regionIssues": list(self.region_issues),
            "reviewState": "live-unreviewed",
        }


def derive_live_snapshot(
    session_id: str,
    *,
    terminal_sequence: int | None = None,
    sessions_directory: Path | None = None,
    rom_path: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> LiveSnapshot:
    database = sessions_root(sessions_directory) / session_id / "capture.sqlite"
    if not database.is_file():
        raise FileNotFoundError(database)
    rom_source = rom_path or default_rom_path()
    identity = rom_identity_from_file(rom_source)
    expected = str(load_inventory()["target"]["normalizedRomSha256"])
    if identity["normalizedSha256"] != expected:
        raise ValueError("live enrichment ROM does not match the frozen US Rev 0 target")
    rom = read_normalized_rom(rom_source)
    static = StaticModel(
        static_database or default_static_database(),
        resource_database or default_resource_database(),
    )
    connection = open_capture_database(database, read_only=True)
    connection.execute("PRAGMA query_only=ON")
    try:
        row = connection.execute("SELECT * FROM session").fetchone()
        if row is None or str(row["session_id"]) != session_id:
            raise ValueError("capture database session identity mismatch")
        if row["rom_normalized_sha256"] != expected:
            raise ValueError("capture session ROM identity is not the frozen target")
        maximum = int(
            connection.execute(
                "SELECT COALESCE(MAX(sequence_id),0) FROM event_sequence"
            ).fetchone()[0]
        )
        terminal = maximum if terminal_sequence is None else terminal_sequence
        if terminal <= 0 or terminal > maximum:
            raise ValueError(
                f"live enrichment terminal sequence {terminal} is outside captured range 1..{maximum}"
            )
        transactions, pairing = _derive_transactions(
            connection, session_id, terminal, rom, static
        )
        regions, _, region_issues = _derive_regions(
            session_id, transactions, 0, terminal
        )
        executions, _, _ = _execution_analysis(
            connection, regions, transactions, static
        )
        memory, _ = _memory_analysis(connection, regions, transactions, static)
        loss_ranges = int(
            connection.execute(
                "SELECT COUNT(*) FROM bridge_loss_range WHERE "
                "first_observed_after_sequence IS NULL OR first_observed_after_sequence<=?",
                (terminal,),
            ).fetchone()[0]
        )
        session = {key: row[key] for key in row.keys()}
    finally:
        connection.close()
    return LiveSnapshot(
        session_id,
        terminal,
        session,
        tuple(transactions),
        tuple(regions),
        tuple(executions),
        tuple(memory),
        pairing,
        tuple(region_issues),
        loss_ranges,
        static,
    )


def _transaction_for_region(
    snapshot: LiveSnapshot, region: Mapping[str, Any] | None
) -> DerivedTransaction | None:
    if region is None:
        return None
    loader = region.get("sourceLoaderEventId")
    return next(
        (
            item
            for item in snapshot.transactions
            if item.record.get("transactionId") == loader
        ),
        None,
    )


def resolve_snapshot_address(
    snapshot: LiveSnapshot,
    live_address: int,
    *,
    sequence: int | None = None,
) -> dict[str, Any]:
    physical = physical_from_live(live_address)
    at_sequence = snapshot.terminal_sequence if sequence is None else sequence
    if at_sequence <= 0 or at_sequence > snapshot.terminal_sequence:
        raise ValueError("live resolution sequence exceeds the saved snapshot boundary")
    region = _active_region_for_pc(list(snapshot.regions), at_sequence, physical)
    transaction = _transaction_for_region(snapshot, region)
    z64: int | None = None
    function = None
    mapping_method: str | None = None
    evidence_grade = "unresolved"
    if transaction is not None:
        destination = int(transaction.record["destinationPhysicalStart"])
        candidate = int(transaction.record["sourceZ64Start"]) + physical - destination
        if (
            destination <= physical < int(transaction.record["destinationMatchedEndExclusive"])
            and int(transaction.record["sourceZ64Start"])
            <= candidate
            < int(transaction.record["sourceMatchedEndExclusive"])
        ):
            z64 = candidate
            function = snapshot.static.function_containing(candidate)
            mapping_method = "contemporaneous-rom-dma-region"
            evidence_grade = str(transaction.record["evidenceGrade"])
    if region is None:
        function = snapshot.static.resolve_nominal_pc(live_address)
        if function is not None:
            static_connection = snapshot.static._connect(snapshot.static.static_database)
            try:
                matches = static_connection.execute(
                    "SELECT w.rom_address FROM word w JOIN instruction i "
                    "ON i.rom_address=w.rom_address WHERE w.nominal_linear_vram=? "
                    "AND i.function_id=?",
                    (live_address, function.function_id),
                ).fetchall()
            finally:
                static_connection.close()
            z64 = int(matches[0][0]) if len(matches) == 1 else None
            mapping_method = "accepted-static-nominal-vram"
            evidence_grade = "supported"
    status = (
        "resolved-function"
        if function is not None
        else "resolved-rom"
        if z64 is not None
        else "resident-unmapped"
        if region is not None
        else "unknown-region"
    )
    return {
        "status": status,
        "liveAddress": live_address,
        "physicalAddress": physical,
        "sequence": at_sequence,
        "regionInstanceId": region.get("regionInstanceId") if region else None,
        "sourceLoaderEventId": region.get("sourceLoaderEventId") if region else None,
        "z64Offset": z64,
        "function": function.to_dict() if function is not None else None,
        "mappingMethod": mapping_method,
        "evidenceGrade": evidence_grade,
        "reviewState": "live-unreviewed",
        "claimLimit": "Current-session mapping is working evidence; residency is not execution.",
    }


def _raw_event(
    session_id: str,
    *,
    sequence_id: int,
    sessions_directory: Path | None,
) -> dict[str, Any]:
    database = sessions_root(sessions_directory) / session_id / "capture.sqlite"
    connection = open_capture_database(database, read_only=True)
    connection.execute("PRAGMA query_only=ON")
    try:
        row = connection.execute(
            "SELECT * FROM event_sequence WHERE session_id=? AND sequence_id=?",
            (session_id, sequence_id),
        ).fetchone()
        if row is None:
            raise ValueError(f"capture event {sequence_id} does not exist in session {session_id}")
        payload = _read_payload(row, connection)
        actual = hashlib.sha256(canonical_json(payload).encode("utf-8")).hexdigest().upper()
        if actual != row["raw_payload_sha256"]:
            raise ValueError("raw event payload identity does not verify")
        return {
            "schema": "ob64-total-resolver-live-raw-event.v1",
            "sessionId": session_id,
            "sequenceId": int(row["sequence_id"]),
            "frame": row["frame_number"],
            "bridgeStream": row["bridge_stream"],
            "bridgeEpoch": row["bridge_epoch"],
            "bridgeSequence": row["bridge_event_sequence"],
            "eventType": row["bridge_event_type"],
            "ingestionStatus": row["ingestion_status"],
            "rawPayloadSha256": row["raw_payload_sha256"],
            "eventTimeContentSha256": row["event_time_content_sha256"],
            "eventTimeContentSize": row["event_time_content_size"],
            "payload": payload,
            "reviewState": "live-unreviewed",
        }
    finally:
        connection.close()


def _resolver_identity(connection: sqlite3.Connection) -> str:
    row = connection.execute(
        "SELECT value FROM meta WHERE key='logicalSha256'"
    ).fetchone()
    if row is None:
        raise ValueError("resolver omits its logical identity")
    return str(row[0])


def _enrich_raw_event(
    snapshot: LiveSnapshot,
    raw: Mapping[str, Any],
    resolver_database: Path,
) -> dict[str, Any]:
    sequence = int(raw["sequenceId"])
    event_type = str(raw["eventType"])
    observation = next(
        (value for value in snapshot.executions if int(value["sequence"]) == sequence),
        None,
    )
    memory = next(
        (value for value in snapshot.memory_accesses if int(value["sequence"]) == sequence),
        None,
    )
    transaction = next(
        (
            item.record
            for item in snapshot.transactions
            if int(item.completion_sequence) == sequence
        ),
        None,
    )
    mapping: dict[str, Any] | None = None
    if observation is not None:
        mapping = {
            "status": observation["status"],
            "liveAddress": observation["pc"],
            "physicalAddress": observation["physicalPc"],
            "sequence": sequence,
            "regionInstanceId": observation["regionInstanceId"],
            "z64Offset": observation["romOffset"],
            "function": observation["function"],
            "mappingMethod": observation["mappingMethod"],
            "executionClaim": observation["executionClaim"],
            "observationKind": observation["observationKind"],
            "reviewState": "live-unreviewed",
        }
    elif memory is not None:
        mapping = {
            "status": "resolved-function" if memory["function"] else "unresolved-accessor",
            "liveAddress": memory["accessorPc"],
            "physicalAddress": memory["accessorPhysicalPc"],
            "sequence": sequence,
            "regionInstanceId": memory["regionInstanceId"],
            "z64Offset": memory["romOffset"],
            "function": memory["function"],
            "mappingMethod": memory["mappingMethod"],
            "memoryAccess": memory,
            "reviewState": "live-unreviewed",
        }
    elif transaction is not None:
        mapping = {
            "status": "resolved-rom-dma",
            "transaction": dict(transaction),
            "reviewState": "live-unreviewed",
            "claimLimit": "A completed ROM DMA establishes bytes and placement, not execution.",
        }
    elif event_type in {"exec", "exec-coverage", "read", "write", "pc-sample"}:
        payload = raw["payload"]
        encoded_pc = payload.get("pc") if isinstance(payload, Mapping) else None
        if encoded_pc is not None:
            mapping = resolve_snapshot_address(
                snapshot, int(str(encoded_pc), 0), sequence=sequence
            )

    resolver = open_resolver(resolver_database)
    try:
        identity = _resolver_identity(resolver)
        context = None
        instruction_context = None
        function = mapping.get("function") if isinstance(mapping, Mapping) else None
        if isinstance(function, Mapping):
            context, _ = explain(
                resolver,
                str(function["structuralName"]),
                relationship="all",
                limit=50,
            )
        z64 = mapping.get("z64Offset") if isinstance(mapping, Mapping) else None
        if isinstance(z64, int):
            instruction_context, _ = explain(
                resolver, f"z64:0x{z64:X}", relationship="all", limit=50
            )
    finally:
        resolver.close()
    return {
        "schema": "ob64-total-resolver-live-enrichment.v1",
        "reviewState": "live-unreviewed",
        "rawReference": {
            "sessionId": raw["sessionId"],
            "sequenceId": raw["sequenceId"],
            "rawPayloadSha256": raw["rawPayloadSha256"],
        },
        "snapshot": snapshot.context_dict(),
        "mapping": mapping,
        "resolverIdentity": identity,
        "resolverFunctionContext": context,
        "resolverInstructionContext": instruction_context,
        "claimLimit": (
            "Enrichment accelerates navigation. It does not promote live-unreviewed "
            "observations or turn sampled PCs/residency into execution."
        ),
    }


def build_event_bundle(
    session_id: str,
    *,
    sequence_id: int,
    sessions_directory: Path | None = None,
    rom_path: Path | None = None,
    resolver_database: Path | None = None,
    output_directory: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    raw = _raw_event(
        session_id, sequence_id=sequence_id, sessions_directory=sessions_directory
    )
    destination = live_bundles_root(output_directory) / (
        f"{session_id}-event-{sequence_id:08d}"
    )
    destination.mkdir(parents=True, exist_ok=True)
    raw_path = destination / "raw-event.json"
    derived_path = destination / "derived.json"
    manifest_path = destination / "manifest.json"
    # The raw layer is durable before any resolver/ROM/static work begins.
    _write_json(raw_path, raw)
    try:
        snapshot = derive_live_snapshot(
            session_id,
            terminal_sequence=sequence_id,
            sessions_directory=sessions_directory,
            rom_path=rom_path,
            static_database=static_database,
            resource_database=resource_database,
        )
        enriched = _enrich_raw_event(
            snapshot, raw, resolver_database or default_resolver_database()
        )
        _write_json(derived_path, enriched)
        result = "PASS"
        error = None
    except Exception as exc:  # raw-first isolation is the contract here
        result = "PARTIAL"
        error = f"{type(exc).__name__}: {exc}"
    manifest: dict[str, Any] = {
        "schema": LIVE_BUNDLE_SCHEMA,
        "bundleKind": "raw-event-enrichment",
        "result": result,
        "reviewState": "live-unreviewed",
        "sessionId": session_id,
        "terminalSequence": sequence_id,
        "rawEvent": "raw-event.json",
        "rawEventSha256": sha256_file(raw_path),
        "derived": "derived.json" if derived_path.is_file() else None,
        "derivedSha256": sha256_file(derived_path) if derived_path.is_file() else None,
        "error": error,
        "reproduction": (
            "re-run live replay against the same raw capture, ROM, static sources, "
            "and resolver logical identity"
        ),
    }
    _write_json(manifest_path, manifest)
    return {
        "result": result,
        "bundleDirectory": str(destination),
        "rawPreserved": True,
        "manifest": manifest,
    }


def replay_event_bundle(
    bundle: Path,
    *,
    sessions_directory: Path | None = None,
    rom_path: Path | None = None,
    resolver_database: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    source = bundle.resolve()
    manifest = json.loads((source / "manifest.json").read_text(encoding="utf-8"))
    raw = json.loads((source / "raw-event.json").read_text(encoding="utf-8"))
    if sha256_file(source / "raw-event.json") != manifest["rawEventSha256"]:
        raise ValueError("live bundle raw-event identity does not verify")
    with tempfile.TemporaryDirectory() as temporary:
        rebuilt = build_event_bundle(
            str(raw["sessionId"]),
            sequence_id=int(raw["sequenceId"]),
            sessions_directory=sessions_directory,
            rom_path=rom_path,
            resolver_database=resolver_database,
            output_directory=Path(temporary),
            static_database=static_database,
            resource_database=resource_database,
        )
        rebuilt_root = Path(rebuilt["bundleDirectory"])
        actual_raw = sha256_file(rebuilt_root / "raw-event.json")
        actual_derived = (
            sha256_file(rebuilt_root / "derived.json")
            if (rebuilt_root / "derived.json").is_file()
            else None
        )
    checks = {
        "rawEvent": actual_raw == manifest["rawEventSha256"],
        "derived": actual_derived == manifest.get("derivedSha256"),
        "result": rebuilt["result"] == manifest["result"],
    }
    return {
        "result": "PASS" if all(checks.values()) else "FAIL",
        "checks": checks,
        "expectedDerivedSha256": manifest.get("derivedSha256"),
        "actualDerivedSha256": actual_derived,
    }


def _capture_boundary(
    session_id: str, sessions_directory: Path | None
) -> dict[str, Any]:
    database = sessions_root(sessions_directory) / session_id / "capture.sqlite"
    connection = open_capture_database(database, read_only=True)
    connection.execute("PRAGMA query_only=ON")
    try:
        row = connection.execute("SELECT * FROM session").fetchone()
        if row is None or row["session_id"] != session_id:
            raise ValueError("capture database session identity mismatch")
        terminal = int(
            connection.execute(
                "SELECT COALESCE(MAX(sequence_id),0) FROM event_sequence"
            ).fetchone()[0]
        )
        latest_bridge = connection.execute(
            "SELECT bridge_event_sequence FROM event_sequence "
            "WHERE bridge_event_sequence IS NOT NULL ORDER BY sequence_id DESC LIMIT 1"
        ).fetchone()
        return {
            "sessionId": session_id,
            "terminalSequence": terminal,
            "latestCapturedBridgeSequence": (
                None if latest_bridge is None else int(latest_bridge[0])
            ),
            "bridgeEpoch": row["bridge_epoch"],
            "continuityStatus": row["continuity_status"],
            "closureStatus": row["closure_status"],
            "romNormalizedSha256": row["rom_normalized_sha256"],
        }
    finally:
        connection.close()


def _find_pc(value: Any) -> int | None:
    if isinstance(value, Mapping):
        for key in ("pc", "exceptionPc", "address"):
            candidate = value.get(key)
            if isinstance(candidate, int) and not isinstance(candidate, bool):
                if 0x80000000 <= candidate < 0xC0000000:
                    return candidate
            if isinstance(candidate, str):
                try:
                    parsed = int(candidate, 0)
                except ValueError:
                    pass
                else:
                    if 0x80000000 <= parsed < 0xC0000000:
                        return parsed
        for nested in value.values():
            found = _find_pc(nested)
            if found is not None:
                return found
    elif isinstance(value, list):
        for nested in value:
            found = _find_pc(nested)
            if found is not None:
                return found
    return None


def _enrich_bridge_context(
    raw: Mapping[str, Any],
    *,
    sessions_directory: Path | None,
    rom_path: Path | None,
    resolver_database: Path | None,
    static_database: Path | None,
    resource_database: Path | None,
) -> dict[str, Any]:
    capture = raw["captureBoundary"]
    snapshot = derive_live_snapshot(
        str(capture["sessionId"]),
        terminal_sequence=int(capture["terminalSequence"]),
        sessions_directory=sessions_directory,
        rom_path=rom_path,
        static_database=static_database,
        resource_database=resource_database,
    )
    bridge = raw["bridge"]
    if bridge.get("status", {}).get("bridgeEpoch") != snapshot.session["bridge_epoch"]:
        raise ValueError("saved bridge epoch differs from the raw capture session")
    pc = _find_pc(bridge.get("exception")) or _find_pc(bridge.get("status"))
    mapping = resolve_snapshot_address(snapshot, pc) if pc is not None else None
    resolver = open_resolver(resolver_database or default_resolver_database())
    try:
        identity = _resolver_identity(resolver)
        context = None
        function = mapping.get("function") if isinstance(mapping, Mapping) else None
        if isinstance(function, Mapping):
            context, _ = explain(
                resolver, str(function["structuralName"]), relationship="all", limit=100
            )
    finally:
        resolver.close()
    return {
        "schema": "ob64-total-resolver-bridge-context-enrichment.v1",
        "reviewState": "live-unreviewed",
        "bundleKind": raw["bundleKind"],
        "snapshot": snapshot.context_dict(),
        "selectedPc": pc,
        "mapping": mapping,
        "resolverIdentity": identity,
        "resolverContext": context,
        "claimLimit": (
            "The saved exception/status object is raw context. Mapping uses the latest saved "
            "capture boundary and does not itself prove execution or causality."
        ),
    }


def build_bridge_context_bundle(
    *,
    client: Pj64Client,
    bundle_kind: str = "crash-context",
    session_id: str | None = None,
    sessions_directory: Path | None = None,
    rom_path: Path | None = None,
    resolver_database: Path | None = None,
    output_directory: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    if bundle_kind not in {"crash-context", "evidence-context"}:
        raise ValueError(f"unsupported bridge bundle kind: {bundle_kind}")
    root = sessions_root(sessions_directory)
    selected = session_id or active_session_id(root)
    if selected is None:
        raise ValueError("a bridge context bundle requires an active raw capture session")
    status = client.status()
    exception = client.exception() if bundle_kind == "crash-context" else None
    capture = _capture_boundary(selected, root)
    next_sequence = status.get("nextEventSequence")
    suffix = str(next_sequence) if isinstance(next_sequence, int) else "unknown"
    destination = live_bundles_root(output_directory) / (
        f"{selected}-{bundle_kind}-{suffix}"
    )
    destination.mkdir(parents=True, exist_ok=True)
    raw_path = destination / "raw-bridge-context.json"
    derived_path = destination / "derived.json"
    raw = {
        "schema": "ob64-total-resolver-raw-bridge-context.v1",
        "bundleKind": bundle_kind,
        "reviewState": "live-unreviewed",
        "captureBoundary": capture,
        "bridge": {"status": status, "exception": exception},
        "claimLimit": "Frame, status PC, and exception state are saved context until resolved.",
    }
    # As with event bundles, the source context lands before resolver work begins.
    _write_json(raw_path, raw)
    try:
        derived = _enrich_bridge_context(
            raw,
            sessions_directory=root,
            rom_path=rom_path,
            resolver_database=resolver_database,
            static_database=static_database,
            resource_database=resource_database,
        )
        _write_json(derived_path, derived)
        result = "PASS"
        error = None
    except Exception as exc:
        result = "PARTIAL"
        error = f"{type(exc).__name__}: {exc}"
    manifest = {
        "schema": LIVE_BUNDLE_SCHEMA,
        "bundleKind": bundle_kind,
        "result": result,
        "reviewState": "live-unreviewed",
        "sessionId": selected,
        "terminalSequence": capture["terminalSequence"],
        "rawBridgeContext": "raw-bridge-context.json",
        "rawBridgeContextSha256": sha256_file(raw_path),
        "derived": "derived.json" if derived_path.is_file() else None,
        "derivedSha256": sha256_file(derived_path) if derived_path.is_file() else None,
        "error": error,
    }
    _write_json(destination / "manifest.json", manifest)
    return {
        "result": result,
        "bundleDirectory": str(destination),
        "rawPreserved": True,
        "manifest": manifest,
    }


def replay_bridge_context_bundle(
    bundle: Path,
    *,
    sessions_directory: Path | None = None,
    rom_path: Path | None = None,
    resolver_database: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    source = bundle.resolve()
    manifest = json.loads((source / "manifest.json").read_text(encoding="utf-8"))
    raw_path = source / "raw-bridge-context.json"
    raw = json.loads(raw_path.read_text(encoding="utf-8"))
    if sha256_file(raw_path) != manifest["rawBridgeContextSha256"]:
        raise ValueError("bridge bundle raw-context identity does not verify")
    try:
        derived = _enrich_bridge_context(
            raw,
            sessions_directory=sessions_directory,
            rom_path=rom_path,
            resolver_database=resolver_database,
            static_database=static_database,
            resource_database=resource_database,
        )
        with tempfile.TemporaryDirectory() as temporary:
            derived_path = Path(temporary) / "derived.json"
            _write_json(derived_path, derived)
            actual = sha256_file(derived_path)
        result = "PASS"
    except Exception as exc:
        actual = None
        result = "PARTIAL"
        error = f"{type(exc).__name__}: {exc}"
    else:
        error = None
    checks = {
        "derived": actual == manifest.get("derivedSha256"),
        "result": result == manifest["result"],
    }
    return {
        "result": "PASS" if all(checks.values()) else "FAIL",
        "checks": checks,
        "expectedDerivedSha256": manifest.get("derivedSha256"),
        "actualDerivedSha256": actual,
        "error": error,
    }


def replay_live_bundle(
    bundle: Path,
    **kwargs: Any,
) -> dict[str, Any]:
    manifest = json.loads((bundle.resolve() / "manifest.json").read_text(encoding="utf-8"))
    if manifest.get("bundleKind") == "raw-event-enrichment":
        return replay_event_bundle(bundle, **kwargs)
    if manifest.get("bundleKind") in {"crash-context", "evidence-context"}:
        return replay_bridge_context_bundle(bundle, **kwargs)
    raise ValueError(f"unsupported live bundle kind: {manifest.get('bundleKind')!r}")


def explain_current_address(
    live_address: int,
    *,
    client: Pj64Client,
    session_id: str | None = None,
    sessions_directory: Path | None = None,
    rom_path: Path | None = None,
    resolver_database: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    root = sessions_root(sessions_directory)
    selected = session_id or active_session_id(root)
    if selected is None:
        raise ValueError("--current requires an active raw capture session")
    status = client.status()
    snapshot = derive_live_snapshot(
        selected,
        sessions_directory=root,
        rom_path=rom_path,
        static_database=static_database,
        resource_database=resource_database,
    )
    if status.get("bridgeEpoch") != snapshot.session["bridge_epoch"]:
        raise ValueError("live bridge epoch differs from the active capture session")
    mapping = resolve_snapshot_address(snapshot, live_address)
    resolver = open_resolver(resolver_database or default_resolver_database())
    try:
        context = None
        function = mapping.get("function")
        if isinstance(function, Mapping):
            context, _ = explain(
                resolver, str(function["structuralName"]), relationship="all", limit=100
            )
        identity = _resolver_identity(resolver)
    finally:
        resolver.close()
    return {
        "schema": "ob64-total-resolver-current-enrichment.v1",
        "reviewState": "live-unreviewed",
        "liveAddress": live_address,
        "bridgeContext": {
            "bridgeEpoch": status.get("bridgeEpoch"),
            "bridgeNextSequence": status.get("nextEventSequence"),
            "frame": status.get("frameCount"),
            "queueDepth": status.get("queueDepth"),
            "frameIsContextOnly": True,
        },
        "captureContext": snapshot.context_dict(),
        "mapping": mapping,
        "resolverIdentity": identity,
        "resolverContext": context,
        "claimLimit": (
            "The address is resolved at the latest recorder boundary, which may trail the "
            "bridge status sample; use an exact saved watch event for execution evidence."
        ),
    }
