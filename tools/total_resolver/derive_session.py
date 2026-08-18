"""Whole-session loader, safety-range, and sampled-execution derivation."""

from __future__ import annotations

from collections import defaultdict
import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping

from .addressing import physical_from_live
from .capture_db import canonical_json
from .derive_transition import (
    _bursts,
    _derive_code_slabs,
    _derive_regions,
    _derive_transactions,
    _read_payload,
    _write_json,
    _write_ndjson,
    default_resource_database,
    default_static_database,
)
from .identities import read_normalized_rom, rom_identity_from_file
from .inventory import load_inventory, repository_root
from .schema import open_capture_database
from .sessions import sessions_root
from .static_model import StaticModel


SESSION_PRODUCT_SCHEMA = "ob64-total-resolver-session-derivation.v1"
RANGE_CHANGE_SCHEMA = "ob64-total-resolver-range-change.v1"
EXECUTION_SCHEMA = "ob64-total-resolver-execution-observation.v1"
CONTROLLER_INPUT_SCHEMA = "ob64-total-resolver-controller-input.v1"
UNRESOLVED_SCHEMA = "ob64-total-resolver-unresolved-observation.v1"


def session_products_root(explicit: Path | None = None) -> Path:
    return (
        explicit
        or repository_root() / "build" / "total-resolver" / "products" / "sessions"
    ).resolve()


def _runs(offsets: Iterable[int], base: int) -> list[dict[str, int]]:
    ordered = sorted(set(offsets))
    if not ordered:
        return []
    output: list[dict[str, int]] = []
    first = previous = ordered[0]
    for offset in ordered[1:]:
        if offset != previous + 1:
            output.append(
                {
                    "physicalStart": base + first,
                    "physicalEndExclusive": base + previous + 1,
                    "byteCount": previous - first + 1,
                }
            )
            first = offset
        previous = offset
    output.append(
        {
            "physicalStart": base + first,
            "physicalEndExclusive": base + previous + 1,
            "byteCount": previous - first + 1,
        }
    )
    return output


def _safety_range_analysis(
    connection: sqlite3.Connection,
    transactions: list[Any],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT sequence_id, frame_number, raw_payload_json
        FROM event_sequence
        WHERE bridge_event_type='range-snapshot'
        ORDER BY sequence_id
        """
    ).fetchall()
    by_range: dict[str, tuple[sqlite3.Row, dict[str, Any], bytes]] = {}
    changes: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    malformed = 0
    races = 0

    for row in rows:
        payload = _read_payload(row, connection)
        range_id = payload.get("rangeId")
        encoded = payload.get("bytesHex")
        if not isinstance(range_id, str) or not isinstance(encoded, str):
            malformed += 1
            continue
        try:
            data = bytes.fromhex(encoded)
            live_start = int(payload["liveAddress"])
            physical_start = int(payload["physicalAddress"])
            current_next = int(payload["bridgeNextSequenceAtSnapshot"])
        except (ValueError, TypeError, KeyError):
            malformed += 1
            continue
        if (
            len(data) != payload.get("size")
            or hashlib.sha256(data).hexdigest().upper() != payload.get("contentSha256")
        ):
            malformed += 1
            continue
        race = payload.get("changedBetweenProbeAndSnapshot") is True
        races += int(race)
        previous = by_range.get(range_id)
        record: dict[str, Any] = {
            "schema": RANGE_CHANGE_SCHEMA,
            "rangeChangeId": f"range-change:{int(row['sequence_id']):08d}",
            "rangeId": range_id,
            "snapshotSequence": int(row["sequence_id"]),
            "frame": row["frame_number"],
            "liveStart": live_start,
            "physicalStart": physical_start,
            "byteSize": len(data),
            "contentSha256": payload["contentSha256"],
            "sampleReason": payload.get("sampleReason"),
            "hostPolled": True,
            "probeSnapshotRace": race,
            "reviewState": "generated-unreviewed",
        }
        if previous is None:
            record.update(
                {
                    "status": "baseline",
                    "changedByteCount": 0,
                    "loaderExplainedChangedByteCount": 0,
                    "unresolvedChangedByteCount": 0,
                    "changedRuns": [],
                    "unresolvedRuns": [],
                    "candidateRomDmaTransactionIds": [],
                }
            )
        else:
            previous_row, previous_payload, previous_data = previous
            previous_next = int(previous_payload["bridgeNextSequenceAtSnapshot"])
            if len(previous_data) != len(data):
                malformed += 1
                by_range[range_id] = (row, payload, data)
                continue
            modeled = bytearray(previous_data)
            candidates: list[str] = []
            for transaction in transactions:
                transaction_record = transaction.record
                bridge_sequence = int(transaction_record["completionBridgeSequence"])
                if not previous_next <= bridge_sequence < current_next:
                    continue
                destination = int(transaction_record["destinationPhysicalStart"])
                destination_end = destination + len(transaction.data)
                overlap_start = max(physical_start, destination)
                overlap_end = min(physical_start + len(data), destination_end)
                if overlap_start >= overlap_end:
                    continue
                source_offset = overlap_start - destination
                target_offset = overlap_start - physical_start
                modeled[target_offset : target_offset + overlap_end - overlap_start] = (
                    transaction.data[source_offset : source_offset + overlap_end - overlap_start]
                )
                candidates.append(str(transaction_record["transactionId"]))
            changed_offsets = [
                index for index, (before, after) in enumerate(zip(previous_data, data))
                if before != after
            ]
            unresolved_offsets = [
                index for index in changed_offsets if modeled[index] != data[index]
            ]
            explained_count = len(changed_offsets) - len(unresolved_offsets)
            status = (
                "no-net-change"
                if not changed_offsets
                else "loader-explained"
                if not unresolved_offsets
                else "partially-explained"
                if explained_count
                else "unresolved"
            )
            record.update(
                {
                    "previousSnapshotSequence": int(previous_row["sequence_id"]),
                    "status": status,
                    "changedByteCount": len(changed_offsets),
                    "loaderExplainedChangedByteCount": explained_count,
                    "unresolvedChangedByteCount": len(unresolved_offsets),
                    "changedRuns": _runs(changed_offsets, physical_start),
                    "unresolvedRuns": _runs(unresolved_offsets, physical_start),
                    "candidateRomDmaTransactionIds": candidates,
                    "bridgeSequenceWindow": {
                        "firstInclusive": previous_next,
                        "lastExclusive": current_next,
                    },
                }
            )
            if unresolved_offsets:
                unresolved.append(
                    {
                        "schema": UNRESOLVED_SCHEMA,
                        "unresolvedId": f"unresolved-range:{int(row['sequence_id']):08d}",
                        "kind": "range-change-not-reproduced-by-captured-rom-dma",
                        "sequence": int(row["sequence_id"]),
                        "frame": row["frame_number"],
                        "rangeId": range_id,
                        "unresolvedByteCount": len(unresolved_offsets),
                        "physicalRuns": _runs(unresolved_offsets, physical_start),
                        "nextEvidence": (
                            "inspect CPU/decompressor writes in this bounded range and sequence window"
                        ),
                        "reviewState": "generated-unreviewed",
                    }
                )
        changes.append(record)
        by_range[range_id] = (row, payload, data)

    diagnostics = {
        "snapshotCount": len(rows),
        "acceptedSnapshotCount": len(changes),
        "rangeCount": len(by_range),
        "malformedSnapshotCount": malformed,
        "probeSnapshotRaceCount": races,
        "changeCount": sum(item["status"] != "baseline" for item in changes),
        "unresolvedChangeCount": len(unresolved),
        "status": "not-captured" if not rows else "captured",
    }
    return changes, unresolved, diagnostics


def _active_region_for_pc(
    regions: list[dict[str, Any]], sequence: int, physical_pc: int
) -> dict[str, Any] | None:
    matches = [
        item
        for item in regions
        if int(item["destinationPhysicalStart"]) <= physical_pc
        < int(item["destinationPhysicalEndExclusive"])
        and int(item["firstSequence"]) <= sequence
        and (
            item["endSequenceExclusive"] is None
            or sequence < int(item["endSequenceExclusive"])
        )
    ]
    if len(matches) != 1:
        return None
    return matches[0]


def _execution_analysis(
    connection: sqlite3.Connection,
    regions: list[dict[str, Any]],
    transactions: list[Any],
    static: StaticModel,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    trace_pages: dict[int, dict[str, Any]] = {}
    for page_row in connection.execute(
        """
        SELECT sequence_id, raw_payload_json, event_time_content_sha256,
               event_time_content_size
        FROM event_sequence
        WHERE bridge_stream='trace' AND bridge_event_type='trace-page'
        ORDER BY sequence_id
        """
    ):
        page_payload = _read_payload(page_row, connection)
        content_id = page_payload.get("codePageContentId")
        if isinstance(content_id, int) and not isinstance(content_id, bool):
            trace_pages[content_id] = {
                "sequence": int(page_row["sequence_id"]),
                "physicalAddress": page_payload.get("physicalAddress"),
                "contentSha256": page_row["event_time_content_sha256"],
                "byteSize": page_row["event_time_content_size"],
            }
    rows = connection.execute(
        """
        SELECT sequence_id, frame_number, bridge_stream, bridge_event_sequence,
               bridge_event_type, raw_payload_json
        FROM event_sequence
        WHERE bridge_event_type IN ('exec', 'exec-coverage', 'pc-sample')
        ORDER BY sequence_id
        """
    ).fetchall()
    transaction_by_id = {
        str(item.record["transactionId"]): item for item in transactions
    }
    observations: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    exact_count = 0
    native_coverage_count = 0
    exact_watch_count = 0
    sampled_count = 0

    for row in rows:
        payload = _read_payload(row, connection)
        encoded_pc = payload.get("pc")
        try:
            pc = int(str(encoded_pc), 0)
            physical_pc = physical_from_live(pc)
        except (TypeError, ValueError):
            continue
        exact = (
            (row["bridge_event_type"] == "exec" and row["bridge_stream"] == "watch")
            or (
                row["bridge_event_type"] == "exec-coverage"
                and row["bridge_stream"] == "trace"
            )
        )
        exact_count += int(exact)
        native_coverage_count += int(row["bridge_event_type"] == "exec-coverage")
        exact_watch_count += int(row["bridge_event_type"] == "exec")
        sampled_count += int(not exact)
        sequence = int(row["sequence_id"])
        code_page_content_id = payload.get("codePageContentId")
        trace_page = (
            trace_pages.get(code_page_content_id)
            if isinstance(code_page_content_id, int) and not isinstance(code_page_content_id, bool)
            else None
        )
        trace_content_resolved = (
            row["bridge_event_type"] != "exec-coverage"
            or (trace_page is not None and int(trace_page["sequence"]) < sequence)
        )
        region = _active_region_for_pc(regions, sequence, physical_pc)
        nominal_function = static.resolve_nominal_pc(pc) if region is None else None
        transaction = (
            transaction_by_id.get(str(region["sourceLoaderEventId"]))
            if region is not None and region.get("sourceLoaderEventId") is not None
            else None
        )
        rom_offset: int | None = None
        function = None
        if transaction is not None:
            destination = int(transaction.record["destinationPhysicalStart"])
            candidate = int(transaction.record["sourceZ64Start"]) + physical_pc - destination
            if (
                destination <= physical_pc < int(transaction.record["destinationMatchedEndExclusive"])
                and int(transaction.record["sourceZ64Start"])
                <= candidate
                < int(transaction.record["sourceMatchedEndExclusive"])
            ):
                rom_offset = candidate
                function = static.function_containing(candidate)
        if function is None and nominal_function is not None:
            function = nominal_function
        safety_range_ids = payload.get("safetyRangeIds")
        inside_dynamic_safety_scope = bool(
            isinstance(safety_range_ids, list) and safety_range_ids
        )
        status = (
            "resolved-function"
            if function is not None
            else "resolved-rom"
            if rom_offset is not None
            else "resident-unmapped"
            if region is not None
            else "outside-dynamic-safety-scope"
            if not exact and not inside_dynamic_safety_scope
            else "unknown-region"
        )
        observation = {
            "schema": EXECUTION_SCHEMA,
            "executionObservationId": f"execution:{sequence:08d}",
            "sequence": sequence,
            "bridgeSequence": row["bridge_event_sequence"],
            "frame": row["frame_number"],
            "pc": pc,
            "physicalPc": physical_pc,
            "observationKind": (
                "native-exact-coverage"
                if row["bridge_event_type"] == "exec-coverage"
                else "exact-watch-hit"
                if exact
                else "sampled-pc-context"
            ),
            "executionClaim": "observed" if exact else "sampled-only",
            "opcode": payload.get("opcode"),
            "codePageContentId": code_page_content_id,
            "codePageContent": trace_page,
            "codePageContentResolved": trace_content_resolved,
            "newInstruction": payload.get("newInstruction"),
            "newEdge": payload.get("newEdge"),
            "previous": payload.get("previous"),
            "regionInstanceId": region["regionInstanceId"] if region else None,
            "romOffset": rom_offset,
            "function": function.to_dict() if function else None,
            "mappingMethod": (
                "contemporaneous-rom-dma-region"
                if rom_offset is not None
                else "accepted-static-nominal-vram"
                if nominal_function is not None
                else None
            ),
            "status": status,
            "reviewState": "generated-unreviewed",
            "registerSnapshot": payload.get("regs") if exact else None,
            "returnAddress": (
                payload.get("regs", {}).get("ra")
                if exact and isinstance(payload.get("regs"), Mapping)
                else None
            ),
        }
        observations.append(observation)
        if row["bridge_event_type"] == "exec-coverage" and not trace_content_resolved:
            unresolved.append(
                {
                    "schema": UNRESOLVED_SCHEMA,
                    "unresolvedId": f"unresolved-trace-content:{sequence:08d}",
                    "kind": "trace-page-content-missing",
                    "sequence": sequence,
                    "frame": row["frame_number"],
                    "pc": pc,
                    "codePageContentId": code_page_content_id,
                    "nextEvidence": "retain the earlier trace-page event or recapture this placement without queue loss",
                    "reviewState": "generated-unreviewed",
                }
            )
        if status in {"resident-unmapped", "unknown-region"}:
            unresolved.append(
                {
                    "schema": UNRESOLVED_SCHEMA,
                    "unresolvedId": f"unresolved-pc:{sequence:08d}",
                    "kind": status,
                    "sequence": sequence,
                    "frame": row["frame_number"],
                    "pc": pc,
                    "observationKind": observation["observationKind"],
                    "nextEvidence": (
                        "capture the loader/write that established this page, then resolve through its contemporaneous region"
                    ),
                    "reviewState": "generated-unreviewed",
                }
            )
    diagnostics = {
        "observationCount": len(observations),
        "exactExecutionCount": exact_count,
        "exactWatchHitCount": exact_watch_count,
        "nativeCoverageCount": native_coverage_count,
        "resolvedTraceContentCount": sum(
            item["observationKind"] == "native-exact-coverage"
            and item["codePageContentResolved"]
            for item in observations
        ),
        "sampledPcCount": sampled_count,
        "resolvedFunctionCount": sum(item["status"] == "resolved-function" for item in observations),
        "resolvedRomCount": sum(item["romOffset"] is not None for item in observations),
        "unresolvedPcCount": len(unresolved),
    }
    return observations, unresolved, diagnostics


def _controller_input_analysis(
    connection: sqlite3.Connection,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT sequence_id, frame_number, bridge_event_sequence, raw_payload_json
        FROM event_sequence
        WHERE bridge_stream='input' AND bridge_event_type='controller-input'
        ORDER BY sequence_id
        """
    ).fetchall()
    observations: list[dict[str, Any]] = []
    for index, row in enumerate(rows):
        payload = _read_payload(row, connection)
        next_row = rows[index + 1] if index + 1 < len(rows) else None
        observations.append(
            {
                "schema": CONTROLLER_INPUT_SCHEMA,
                "controllerInputId": f"controller-input:{int(row['sequence_id']):08d}",
                "sequence": int(row["sequence_id"]),
                "bridgeSequence": int(row["bridge_event_sequence"]),
                "frame": row["frame_number"],
                "endSequenceExclusive": int(next_row["sequence_id"]) if next_row else None,
                "endBridgeSequenceExclusive": (
                    int(next_row["bridge_event_sequence"]) if next_row else None
                ),
                "endFrameExclusive": next_row["frame_number"] if next_row else None,
                "controller": payload.get("controller"),
                "state": payload.get("state"),
                "buttons": payload.get("buttons"),
                "stickX": payload.get("stickX"),
                "stickY": payload.get("stickY"),
                "injectedByBridge": payload.get("injectedByBridge"),
                "inputSource": payload.get("inputSource"),
                "capturePhase": payload.get("capturePhase"),
                "timingRole": "transition-bounded-run",
                "reviewState": "generated-unreviewed",
            }
        )
    diagnostics = {
        "transitionCount": len(observations),
        "physicalOrEffectiveState": "effective-game-input",
        "controllerScope": "P1",
        "consecutiveDuplicatePolicy": "coalesced-until-next-transition",
        "injectedTransitionCount": sum(
            item["injectedByBridge"] is True for item in observations
        ),
    }
    return observations, diagnostics


def _memory_analysis(
    connection: sqlite3.Connection,
    regions: list[dict[str, Any]],
    transactions: list[Any],
    static: StaticModel,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT sequence_id, frame_number, bridge_event_sequence,
               bridge_event_type, raw_payload_json
        FROM event_sequence
        WHERE bridge_stream='watch' AND bridge_event_type IN ('read', 'write')
        ORDER BY sequence_id
        """
    ).fetchall()
    transaction_by_id = {
        str(item.record["transactionId"]): item for item in transactions
    }
    widths = {
        "u8": 8,
        "s8": 8,
        "u16": 16,
        "s16": 16,
        "u32": 32,
        "s32": 32,
        "u64": 64,
        "s64": 64,
    }
    accesses: list[dict[str, Any]] = []
    for row in rows:
        payload = _read_payload(row, connection)
        try:
            pc = int(str(payload.get("pc")), 0)
            physical_pc = physical_from_live(pc)
            address = int(str(payload.get("address")), 0)
        except (TypeError, ValueError):
            continue
        sequence = int(row["sequence_id"])
        region = _active_region_for_pc(regions, sequence, physical_pc)
        transaction = (
            transaction_by_id.get(str(region["sourceLoaderEventId"]))
            if region is not None and region.get("sourceLoaderEventId") is not None
            else None
        )
        rom_offset: int | None = None
        function = None
        mapping_method: str | None = None
        if transaction is not None:
            destination = int(transaction.record["destinationPhysicalStart"])
            candidate = int(transaction.record["sourceZ64Start"]) + physical_pc - destination
            if (
                destination <= physical_pc < int(transaction.record["destinationMatchedEndExclusive"])
                and int(transaction.record["sourceZ64Start"])
                <= candidate
                < int(transaction.record["sourceMatchedEndExclusive"])
            ):
                rom_offset = candidate
                function = static.function_containing(candidate)
                mapping_method = "contemporaneous-rom-dma-region"
        if function is None and region is None:
            function = static.resolve_nominal_pc(pc)
            if function is not None:
                mapping_method = "accepted-static-nominal-vram"
        value_type = payload.get("valueType")
        accesses.append(
            {
                "schema": "ob64-total-resolver-memory-access.v1",
                "memoryAccessId": f"memory-access:{sequence:08d}",
                "sequence": sequence,
                "bridgeSequence": int(row["bridge_event_sequence"]),
                "frame": row["frame_number"],
                "accessKind": str(row["bridge_event_type"]),
                "effectiveAddress": address,
                "value": payload.get("value"),
                "valueHigh": payload.get("valueHi"),
                "valueType": value_type,
                "widthBits": widths.get(str(value_type).lower()),
                "accessorPc": pc,
                "accessorPhysicalPc": physical_pc,
                "regionInstanceId": region["regionInstanceId"] if region else None,
                "romOffset": rom_offset,
                "function": function.to_dict() if function else None,
                "mappingMethod": mapping_method,
                "registerSnapshot": payload.get("regs"),
                "reviewState": "generated-unreviewed",
            }
        )
    diagnostics = {
        "memoryAccessCount": len(accesses),
        "readCount": sum(item["accessKind"] == "read" for item in accesses),
        "writeCount": sum(item["accessKind"] == "write" for item in accesses),
        "resolvedAccessorFunctionCount": sum(item["function"] is not None for item in accesses),
    }
    return accesses, diagnostics


def derive_session(
    session_id: str,
    *,
    rom_path: Path,
    sessions_directory: Path | None = None,
    output_directory: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    """Derive all presently supported loader and bounded-change facts for a session."""

    session_dir = sessions_root(sessions_directory) / session_id
    database = session_dir / "capture.sqlite"
    if not database.is_file():
        raise FileNotFoundError(database)
    expected_identity = str(load_inventory()["target"]["normalizedRomSha256"])
    identity = rom_identity_from_file(rom_path)
    if identity["normalizedSha256"] != expected_identity:
        raise ValueError("session derivation ROM does not match the frozen US Rev 0 target")
    rom = read_normalized_rom(rom_path)
    static = StaticModel(
        static_database or default_static_database(),
        resource_database or default_resource_database(),
    )

    connection = open_capture_database(database, read_only=True)
    connection.execute("PRAGMA query_only = ON")
    try:
        session = connection.execute("SELECT * FROM session").fetchone()
        if session is None or str(session["session_id"]) != session_id:
            raise ValueError("capture database session identity mismatch")
        if session["rom_normalized_sha256"] != expected_identity:
            raise ValueError("capture session ROM identity is not the frozen target")
        terminal = int(
            connection.execute("SELECT COALESCE(MAX(sequence_id), 0) FROM event_sequence").fetchone()[0]
        )
        transactions, pairing = _derive_transactions(
            connection, session_id, terminal, rom, static
        )
        regions, configuration, region_issues = _derive_regions(
            session_id, transactions, 0, terminal
        )
        range_changes, range_unresolved, safety = _safety_range_analysis(
            connection, transactions
        )
        executions, execution_unresolved, execution = _execution_analysis(
            connection, regions, transactions, static
        )
        memory_accesses, memory = _memory_analysis(
            connection, regions, transactions, static
        )
        controller_inputs, controller_input = _controller_input_analysis(connection)
        loss_ranges = int(
            connection.execute("SELECT COUNT(*) FROM bridge_loss_range").fetchone()[0]
        )
    finally:
        connection.close()

    slabs, placements = _derive_code_slabs(transactions, static)
    bursts = _bursts(transactions)
    unresolved = range_unresolved + execution_unresolved + [
        {
            "schema": UNRESOLVED_SCHEMA,
            "unresolvedId": f"region-issue:{index:04d}",
            "kind": item.get("kind", "region-issue"),
            "nativeIssue": item,
            "nextEvidence": "inspect the bounded loader destination issue",
            "reviewState": "generated-unreviewed",
        }
        for index, item in enumerate(region_issues, 1)
    ]
    quality = "useful-with-visible-gaps"
    if pairing["romPairIssueCount"] or loss_ranges:
        quality = "incomplete-working-evidence"
    elif not unresolved and safety["status"] == "captured":
        quality = "supported-working-evidence"
    caveats = [
        "Bridge sequence orders emulator-created watch, DMA, trace, and input events; frame and host sampling remain context.",
        "Range fingerprints are cheap change signals. Exact bytes are retained only for initial/changed samples.",
        "Range polling can miss changes that revert between samples; unresolved changes remain explicit.",
        "Native exact coverage proves observed instructions/edges; sampled PCs remain context only.",
        "Controller rows are effective P1 input transitions. A run lasts until the next transition; repeated identical polls are coalesced.",
        "This generated product is intended to accelerate decompilation and remains unreviewed.",
    ]
    summary: dict[str, Any] = {
        "schema": SESSION_PRODUCT_SCHEMA,
        "sessionId": session_id,
        "rawSession": {
            "closureStatus": session["closure_status"],
            "continuityStatus": session["continuity_status"],
            "bridgeVersion": session["bridge_version"],
            "bridgeEpoch": session["bridge_epoch"],
            "manifestSha256": session["manifest_sha256"],
            "terminalSequence": terminal,
        },
        "rom": {
            "normalizedSha256": identity["normalizedSha256"],
            "size": identity["size"],
        },
        "workingEvidenceQuality": quality,
        "counts": {
            "romDmaTransactions": len(transactions),
            "capturedDestinationBytes": sum(len(item.data) for item in transactions),
            "codeSlabs": len(slabs),
            "functionPlacements": len(placements),
            "regionInstances": len(regions),
            "timelineBursts": len(bursts),
            "rangeSnapshots": safety["acceptedSnapshotCount"],
            "rangeChanges": safety["changeCount"],
            "unresolvedRangeChanges": safety["unresolvedChangeCount"],
            "executionObservations": execution["observationCount"],
            "exactExecutionWatchHits": execution["exactWatchHitCount"],
            "nativeExecutionCoverage": execution["nativeCoverageCount"],
            "sampledPcs": execution["sampledPcCount"],
            "unresolvedPcs": execution["unresolvedPcCount"],
            "unresolvedObservations": len(unresolved),
            "memoryAccesses": memory["memoryAccessCount"],
            "controllerInputTransitions": controller_input["transitionCount"],
            "bridgeLossRanges": loss_ranges,
        },
        "pairingDiagnostics": pairing,
        "safetyRangeDiagnostics": safety,
        "executionDiagnostics": execution,
        "memoryDiagnostics": memory,
        "controllerInputDiagnostics": controller_input,
        "regionIssueCount": len(region_issues),
        "endpointConfiguration": configuration,
        "caveats": caveats,
        "files": {
            "transactions": "transactions.ndjson",
            "regions": "regions.ndjson",
            "codeSlabs": "code-slabs.ndjson",
            "functionPlacements": "function-placements.ndjson",
            "rangeChanges": "range-changes.ndjson",
            "executionObservations": "execution-observations.ndjson",
            "memoryAccesses": "memory-accesses.ndjson",
            "controllerInput": "controller-input.ndjson",
            "unresolved": "unresolved.ndjson",
        },
    }
    destination = (
        output_directory.resolve()
        if output_directory is not None
        else session_products_root() / session_id
    )
    _write_ndjson(destination / "transactions.ndjson", (item.record for item in transactions))
    _write_ndjson(destination / "regions.ndjson", regions)
    _write_ndjson(destination / "code-slabs.ndjson", slabs)
    _write_ndjson(destination / "function-placements.ndjson", placements)
    _write_ndjson(destination / "range-changes.ndjson", range_changes)
    _write_ndjson(destination / "execution-observations.ndjson", executions)
    _write_ndjson(destination / "memory-accesses.ndjson", memory_accesses)
    _write_ndjson(destination / "controller-input.ndjson", controller_inputs)
    _write_ndjson(destination / "unresolved.ndjson", unresolved)
    _write_json(destination / "summary.json", summary)
    return {
        "result": "PASS" if quality != "incomplete-working-evidence" else "PARTIAL",
        "sessionId": session_id,
        "productDirectory": str(destination),
        "summaryPath": str(destination / "summary.json"),
        "workingEvidenceQuality": quality,
        "counts": summary["counts"],
        "caveats": caveats,
    }
