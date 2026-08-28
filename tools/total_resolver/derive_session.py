"""Whole-session loader, safety-range, and sampled-execution derivation."""

from __future__ import annotations

from bisect import bisect_left
from collections import defaultdict
import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping

from .addressing import RDRAM_SIZE, physical_from_live
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
MAPPING_POLICY = "exact-observed-opcode-confirmed-v2"


def _u32(value: Any) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        parsed = value
    elif isinstance(value, str):
        try:
            parsed = int(value, 0)
        except ValueError:
            return None
    else:
        return None
    return parsed if 0 <= parsed <= 0xFFFFFFFF else None


def _captured_instruction_opcode(
    payload: Mapping[str, Any],
    pc: int,
    trace_page_bytes: bytes | None,
) -> int | None:
    explicit = _u32(payload.get("opcode"))
    if explicit is not None:
        return explicit
    if trace_page_bytes is None:
        return None
    offset = pc & 0xFFF
    encoded = trace_page_bytes[offset : offset + 4]
    return int.from_bytes(encoded, "big") if len(encoded) == 4 else None


def _opcode_mapping_verification(
    rom: bytes,
    rom_offset: int,
    captured_opcode: int | None,
) -> dict[str, Any]:
    expected_bytes = rom[rom_offset : rom_offset + 4]
    expected_opcode = (
        int.from_bytes(expected_bytes, "big") if len(expected_bytes) == 4 else None
    )
    if expected_opcode is None:
        status = "rom-offset-out-of-range"
    elif captured_opcode is None:
        status = "captured-opcode-unavailable"
    elif captured_opcode == expected_opcode:
        status = "exact-opcode-match"
    else:
        status = "opcode-mismatch"
    return {
        "status": status,
        "romOffset": rom_offset,
        "capturedOpcode": (
            f"0x{captured_opcode:08X}" if captured_opcode is not None else None
        ),
        "romOpcode": (
            f"0x{expected_opcode:08X}" if expected_opcode is not None else None
        ),
        "equalityBasis": "all-four-opcode-bytes",
    }


def session_products_root(explicit: Path | None = None) -> Path:
    return (
        explicit
        or repository_root() / "build" / "total-resolver" / "products" / "sessions"
    ).resolve()


def _baseline_census(
    connection: sqlite3.Connection,
    session_id: str,
    static: StaticModel,
    rom: bytes,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    rows = connection.execute(
        """
        SELECT sequence_id,frame_number,bridge_event_sequence,raw_payload_json
        FROM event_sequence
        WHERE bridge_stream='trace' AND bridge_event_type='baseline-snapshot'
        ORDER BY sequence_id
        """
    ).fetchall()
    if len(rows) != 1:
        return [], {
            "status": "missing" if not rows else "invalid-multiple-snapshots",
            "snapshotCount": len(rows),
            "rdramBytes": 0,
            "placementCount": 0,
            "ambiguousStaticContentGroups": 0,
            "ambiguousShortMatches": 0,
        }
    row = rows[0]
    payload = _read_payload(row, connection)
    encoded = payload.get("rdramBytesHex")
    if (
        payload.get("capturePhase") != "pre-execution-native-rdram-snapshot"
        or payload.get("ordering") != "native-copy-before-first-captured-instruction"
        or payload.get("rdramSize") != RDRAM_SIZE
        or payload.get("rdramByteLength") != RDRAM_SIZE
        or payload.get("rdramBytesEncoding") != "hex-uppercase"
        or not isinstance(encoded, str)
    ):
        raise ValueError("baseline snapshot lacks its exact 4 MiB capture contract")
    try:
        rdram = bytes.fromhex(encoded)
    except ValueError as exc:
        raise ValueError("baseline snapshot bytes are not canonical hexadecimal") from exc
    if len(rdram) != RDRAM_SIZE:
        raise ValueError("baseline snapshot is not exactly 4 MiB")

    content_groups: defaultdict[bytes, list[Any]] = defaultdict(list)
    for function in static.functions:
        content = rom[function.rom_start : function.rom_end_exclusive]
        if len(content) == function.rom_end_exclusive - function.rom_start and content:
            content_groups[content].append(function)
    unique_functions = [group[0] for group in content_groups.values() if len(group) == 1]
    ambiguous_groups = sum(len(group) > 1 for group in content_groups.values())

    anchors: defaultdict[tuple[int, bytes], list[tuple[Any, bytes]]] = defaultdict(list)
    for function in unique_functions:
        content = rom[function.rom_start : function.rom_end_exclusive]
        anchor_length = min(16, len(content))
        anchors[(anchor_length, content[:anchor_length])].append((function, content))

    matches: defaultdict[int, set[int]] = defaultdict(set)
    function_by_id = {function.function_id: function for function in unique_functions}
    for anchor_length in sorted({key[0] for key in anchors}):
        for physical in range(0, RDRAM_SIZE - anchor_length + 1, 4):
            candidates = anchors.get((anchor_length, rdram[physical : physical + anchor_length]))
            if not candidates:
                continue
            for function, content in candidates:
                if physical + len(content) <= RDRAM_SIZE and rdram[
                    physical : physical + len(content)
                ] == content:
                    matches[function.function_id].add(physical)

    placements: list[dict[str, Any]] = []
    ambiguous_short = 0
    for function_id, physical_matches in sorted(matches.items()):
        function = function_by_id[function_id]
        size = function.rom_end_exclusive - function.rom_start
        if size < 16 and len(physical_matches) != 1:
            ambiguous_short += 1
            continue
        for physical in sorted(physical_matches):
            placements.append(
                {
                    "schema": "ob64-total-resolver-function-placement.v1",
                    "placementId": (
                        f"baseline:{int(row['sequence_id']):08d}:"
                        f"function:{function.structural_name}:physical:{physical:06X}"
                    ),
                    "codeSlabId": None,
                    "sessionId": session_id,
                    "firstCompletionSequence": int(row["sequence_id"]),
                    "lastCompletionSequence": int(row["sequence_id"]),
                    "firstFrame": row["frame_number"],
                    "lastFrame": row["frame_number"],
                    "function": function.to_dict(),
                    "destinationPhysicalStart": physical,
                    "destinationPhysicalEndExclusive": physical + size,
                    "destinationLiveStart": 0x80000000 + physical,
                    "destinationLiveEndExclusive": 0x80000000 + physical + size,
                    "mappingMethod": "atomic-baseline-rdram-exact-function-bytes",
                    "equalityBasis": "complete-static-function-bytes",
                    "executionClaim": False,
                    "reviewState": "generated-unreviewed",
                }
            )
    return placements, {
        "status": "captured",
        "snapshotCount": 1,
        "snapshotSequence": int(row["sequence_id"]),
        "snapshotBridgeSequence": row["bridge_event_sequence"],
        "rdramBytes": len(rdram),
        "uniqueStaticContentFunctionsScanned": len(unique_functions),
        "ambiguousStaticContentGroups": ambiguous_groups,
        "ambiguousShortMatches": ambiguous_short,
        "placementCount": len(placements),
        "mappingRole": "resident-byte-placement-evidence-not-execution-evidence",
    }


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
    ordered_transactions = sorted(
        (
            int(transaction.record["completionBridgeSequence"]),
            index,
            transaction,
        )
        for index, transaction in enumerate(transactions)
    )
    transaction_sequences = [item[0] for item in ordered_transactions]
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
        if len(data) != payload.get("size") or payload.get("bytesEncoding") != "hex-uppercase":
            malformed += 1
            continue
        content_sha = hashlib.sha256(data).hexdigest().upper()
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
            "contentSha256": content_sha,
            "legacyContentHashMatches": content_sha == payload.get("contentSha256"),
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
            transaction_start = bisect_left(transaction_sequences, previous_next)
            transaction_end = bisect_left(transaction_sequences, current_next)
            for _, _, transaction in ordered_transactions[
                transaction_start:transaction_end
            ]:
                transaction_record = transaction.record
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


class _ActiveRegionIndex:
    """Incremental exact-region lookup for observations ordered by sequence."""

    _PAGE_SHIFT = 12

    def __init__(self, regions: list[dict[str, Any]]) -> None:
        self._regions = regions
        self._starts = sorted(
            (int(region["firstSequence"]), index)
            for index, region in enumerate(regions)
        )
        self._ends = sorted(
            (int(region["endSequenceExclusive"]), index)
            for index, region in enumerate(regions)
            if region["endSequenceExclusive"] is not None
        )
        self._start_cursor = 0
        self._end_cursor = 0
        self._last_sequence: int | None = None
        self._active: set[int] = set()
        self._active_by_page: defaultdict[int, set[int]] = defaultdict(set)

    def _page_numbers(self, index: int) -> range:
        region = self._regions[index]
        start = int(region["destinationPhysicalStart"])
        end_exclusive = int(region["destinationPhysicalEndExclusive"])
        if end_exclusive <= start:
            return range(0)
        return range(
            start >> self._PAGE_SHIFT,
            ((end_exclusive - 1) >> self._PAGE_SHIFT) + 1,
        )

    def _activate(self, index: int) -> None:
        if index in self._active:
            return
        self._active.add(index)
        for page in self._page_numbers(index):
            self._active_by_page[page].add(index)

    def _deactivate(self, index: int) -> None:
        if index not in self._active:
            return
        self._active.remove(index)
        for page in self._page_numbers(index):
            candidates = self._active_by_page[page]
            candidates.remove(index)
            if not candidates:
                del self._active_by_page[page]

    def resolve(self, sequence: int, physical_pc: int) -> dict[str, Any] | None:
        if self._last_sequence is not None and sequence < self._last_sequence:
            raise ValueError("active-region index requires nondecreasing sequences")

        while (
            self._start_cursor < len(self._starts)
            and self._starts[self._start_cursor][0] <= sequence
        ):
            self._activate(self._starts[self._start_cursor][1])
            self._start_cursor += 1
        while (
            self._end_cursor < len(self._ends)
            and self._ends[self._end_cursor][0] <= sequence
        ):
            self._deactivate(self._ends[self._end_cursor][1])
            self._end_cursor += 1
        self._last_sequence = sequence

        matches = [
            self._regions[index]
            for index in self._active_by_page.get(
                physical_pc >> self._PAGE_SHIFT, set()
            )
            if int(self._regions[index]["destinationPhysicalStart"])
            <= physical_pc
            < int(self._regions[index]["destinationPhysicalEndExclusive"])
        ]
        if len(matches) != 1:
            return None
        return matches[0]


def _execution_analysis(
    connection: sqlite3.Connection,
    regions: list[dict[str, Any]],
    transactions: list[Any],
    static: StaticModel,
    rom: bytes,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    trace_pages: dict[int, dict[str, Any]] = {}
    trace_page_bytes: dict[int, bytes] = {}
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
            encoded = page_payload.get("codeBytesHex")
            if isinstance(encoded, str):
                try:
                    trace_page_bytes[content_id] = bytes.fromhex(encoded)
                except ValueError:
                    pass
    rows = connection.execute(
        """
        SELECT sequence_id, frame_number, bridge_stream, bridge_event_sequence,
               bridge_event_type, raw_payload_json
        FROM event_sequence
        WHERE bridge_event_type IN ('exec', 'exec-coverage', 'focused-exec', 'pc-sample')
        ORDER BY sequence_id
        """
    ).fetchall()
    if rows:
        static.preload_nominal_pc_index()
    transaction_by_id = {
        str(item.record["transactionId"]): item for item in transactions
    }
    observations: list[dict[str, Any]] = []
    unresolved: list[dict[str, Any]] = []
    unresolved_by_exact_issue: dict[tuple[Any, ...], dict[str, Any]] = {}

    def retain_unresolved(
        value: dict[str, Any], *, exact_issue: tuple[Any, ...]
    ) -> None:
        existing = unresolved_by_exact_issue.get(exact_issue)
        if existing is None:
            value["firstSequence"] = value.get("sequence")
            value["lastSequence"] = value.get("sequence")
            value["firstFrame"] = value.get("frame")
            value["lastFrame"] = value.get("frame")
            value["occurrenceCount"] = 1
            unresolved_by_exact_issue[exact_issue] = value
            unresolved.append(value)
            return
        existing["lastSequence"] = value.get("sequence")
        existing["lastFrame"] = value.get("frame")
        existing["occurrenceCount"] = int(existing["occurrenceCount"]) + 1
    exact_count = 0
    native_coverage_count = 0
    exact_watch_count = 0
    sampled_count = 0
    focused_count = 0
    region_index = _ActiveRegionIndex(regions)

    for row in rows:
        payload = _read_payload(row, connection)
        encoded_pc = payload.get("pc")
        try:
            pc = int(str(encoded_pc), 0)
            physical_pc = physical_from_live(pc)
        except (TypeError, ValueError):
            continue
        exact = (
            (
                row["bridge_event_type"] in {"exec", "focused-exec"}
                and row["bridge_stream"] == "watch"
            )
            or (
                row["bridge_event_type"] == "exec-coverage"
                and row["bridge_stream"] == "trace"
            )
        )
        exact_count += int(exact)
        native_coverage_count += int(row["bridge_event_type"] == "exec-coverage")
        exact_watch_count += int(row["bridge_event_type"] in {"exec", "focused-exec"})
        focused_count += int(row["bridge_event_type"] == "focused-exec")
        sampled_count += int(not exact)
        sequence = int(row["sequence_id"])
        code_page_content_id = payload.get("codePageContentId")
        trace_page = (
            trace_pages.get(code_page_content_id)
            if isinstance(code_page_content_id, int) and not isinstance(code_page_content_id, bool)
            else None
        )
        exact_trace_bytes = (
            trace_page_bytes.get(code_page_content_id)
            if isinstance(code_page_content_id, int)
            and not isinstance(code_page_content_id, bool)
            else None
        )
        captured_opcode = (
            _captured_instruction_opcode(payload, pc, exact_trace_bytes)
            if exact
            else None
        )
        structural_instruction_resolved = payload.get("exactInstructionResolved") is True
        if structural_instruction_resolved:
            try:
                payload_physical = int(str(payload.get("physicalAddress")), 0)
            except (TypeError, ValueError):
                structural_instruction_resolved = False
            else:
                structural_instruction_resolved = payload_physical == physical_pc
        trace_content_resolved = (
            row["bridge_event_type"] != "exec-coverage"
            or structural_instruction_resolved
            or (trace_page is not None and int(trace_page["sequence"]) < sequence)
        )
        region = region_index.resolve(sequence, physical_pc)
        nominal_mapping = static.resolve_nominal_mapping(pc) if region is None else None
        transaction = (
            transaction_by_id.get(str(region["sourceLoaderEventId"]))
            if region is not None and region.get("sourceLoaderEventId") is not None
            else None
        )
        rom_offset: int | None = None
        function = None
        mapping_method: str | None = None
        mapping_verification: dict[str, Any] | None = None
        mapping_candidate: dict[str, Any] | None = None
        if transaction is not None:
            destination = int(transaction.record["destinationPhysicalStart"])
            candidate = int(transaction.record["sourceZ64Start"]) + physical_pc - destination
            if (
                destination <= physical_pc < int(transaction.record["destinationMatchedEndExclusive"])
                and int(transaction.record["sourceZ64Start"])
                <= candidate
                < int(transaction.record["sourceMatchedEndExclusive"])
            ):
                candidate_function = static.function_containing(candidate)
                if exact:
                    mapping_verification = _opcode_mapping_verification(
                        rom, candidate, captured_opcode
                    )
                    if mapping_verification["status"] == "exact-opcode-match":
                        rom_offset = candidate
                        function = candidate_function
                        mapping_method = "contemporaneous-rom-dma-region"
                    else:
                        mapping_candidate = {
                            "mappingMethod": "contemporaneous-rom-dma-region",
                            "romOffset": candidate,
                            "function": (
                                candidate_function.to_dict()
                                if candidate_function is not None
                                else None
                            ),
                        }
                else:
                    rom_offset = candidate
                    function = candidate_function
                    mapping_method = "contemporaneous-rom-dma-region"
                    mapping_verification = {
                        "status": "contextual-placement-without-exact-execution-opcode",
                        "romOffset": candidate,
                        "capturedOpcode": None,
                        "romOpcode": None,
                        "equalityBasis": "ordered-rom-dma-region-context",
                    }
        if function is None and region is None and nominal_mapping is not None:
            nominal_function, nominal_rom_offset = nominal_mapping
            mapping_verification = _opcode_mapping_verification(
                rom, nominal_rom_offset, captured_opcode
            )
            if exact and mapping_verification["status"] == "exact-opcode-match":
                function = nominal_function
                rom_offset = nominal_rom_offset
                mapping_method = "accepted-static-nominal-vram"
            else:
                mapping_candidate = {
                    "mappingMethod": "static-nominal-vram-address-candidate",
                    "romOffset": nominal_rom_offset,
                    "function": nominal_function.to_dict(),
                }
        if row["bridge_event_type"] == "focused-exec":
            target_z64 = _u32(payload.get("focusedZ64Start"))
            target_function_id = payload.get("focusedFunctionId")
            target_live_start = _u32(payload.get("targetLiveStart"))
            signature_hex = payload.get("targetSignatureBytesHex")
            focused_function = (
                static.function_containing(target_z64)
                if target_z64 is not None
                else None
            )
            try:
                signature = (
                    bytes.fromhex(signature_hex)
                    if isinstance(signature_hex, str)
                    else b""
                )
            except ValueError:
                signature = b""
            focused_offset = (
                None
                if target_z64 is None or target_live_start is None
                else target_z64 + pc - target_live_start
            )
            if (
                focused_function is not None
                and isinstance(target_function_id, int)
                and not isinstance(target_function_id, bool)
                and focused_function.function_id == target_function_id
                and target_z64 == focused_function.rom_start
                and signature
                and rom[target_z64 : target_z64 + len(signature)] == signature
                and focused_offset is not None
                and focused_function.rom_start
                <= focused_offset
                < focused_function.rom_end_exclusive
                and captured_opcode is not None
                and rom[focused_offset : focused_offset + 4]
                == captured_opcode.to_bytes(4, "big")
            ):
                function = focused_function
                rom_offset = focused_offset
                mapping_method = "focused-profile-exact-signature-and-opcode"
                mapping_verification = {
                    "status": "exact-signature-and-opcode-match",
                    "romOffset": focused_offset,
                    "capturedOpcode": f"0x{captured_opcode:08X}",
                    "signatureByteLength": len(signature),
                    "equalityBasis": "event-time-target-signature-and-exact-opcode",
                }
                mapping_candidate = None
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
                else "focused-owner-state"
                if row["bridge_event_type"] == "focused-exec"
                else "exact-watch-hit"
                if exact
                else "sampled-pc-context"
            ),
            "executionClaim": "observed" if exact else "sampled-only",
            "opcode": (
                f"0x{captured_opcode:08X}"
                if captured_opcode is not None
                else payload.get("opcode")
            ),
            "codePageContentId": code_page_content_id,
            "codePageContent": trace_page,
            "codePageContentResolved": trace_content_resolved,
            "exactInstructionResolved": (
                structural_instruction_resolved
                if row["bridge_event_type"] == "exec-coverage"
                else exact
            ),
            "pageGeneration": payload.get("pageGeneration"),
            "newInstruction": payload.get("newInstruction"),
            "newEdge": payload.get("newEdge"),
            "previous": payload.get("previous"),
            "regionInstanceId": region["regionInstanceId"] if region else None,
            "romOffset": rom_offset,
            "function": function.to_dict() if function else None,
            "mappingMethod": mapping_method,
            "mappingVerification": mapping_verification,
            "mappingCandidate": mapping_candidate,
            "status": status,
            "reviewState": "generated-unreviewed",
            "registerSnapshot": payload.get("regs") if exact else None,
            "returnAddress": (
                payload.get("regs", {}).get("ra")
                if exact and isinstance(payload.get("regs"), Mapping)
                else None
            ),
        }
        if row["bridge_event_type"] == "focused-exec":
            observation.update(
                {
                    "focusedProfileId": payload.get("focusedProfileId"),
                    "focusedProfileVersion": payload.get("focusedProfileVersion"),
                    "focusedTargetId": payload.get("focusedTargetId"),
                    "focusedFunctionId": payload.get("focusedFunctionId"),
                    "focusedZ64Start": payload.get("focusedZ64Start"),
                    "focusedRole": payload.get("focusedRole"),
                    "focusedInvocationId": payload.get("focusedInvocationId"),
                    "sampleMode": payload.get("sampleMode"),
                    "targetLiveStart": payload.get("targetLiveStart"),
                    "targetLiveEndExclusive": payload.get("targetLiveEndExclusive"),
                    "entryReturnAddress": payload.get("entryReturnAddress"),
                    "targetSignatureBytesEncoding": payload.get(
                        "targetSignatureBytesEncoding"
                    ),
                    "targetSignatureByteLength": payload.get(
                        "targetSignatureByteLength"
                    ),
                    "targetSignatureBytesHex": payload.get(
                        "targetSignatureBytesHex"
                    ),
                    "stackSnapshot": payload.get("stack"),
                    "pointerSnapshots": payload.get("pointerSnapshots"),
                    "pointerSnapshotIssues": payload.get("pointerSnapshotIssues"),
                    "capturePhase": payload.get("capturePhase"),
                    "returnPhaseLimitation": payload.get("returnPhaseLimitation"),
                }
            )
        if "newCall" in payload:
            observation["newCall"] = payload["newCall"]
        if "call" in payload:
            observation["call"] = payload["call"]
        observations.append(observation)
        if row["bridge_event_type"] == "exec-coverage" and not trace_content_resolved:
            retain_unresolved(
                {
                    "schema": UNRESOLVED_SCHEMA,
                    "unresolvedId": f"unresolved-trace-content:{sequence:08d}",
                    "kind": "exact-instruction-placement-unresolved",
                    "sequence": sequence,
                    "frame": row["frame_number"],
                    "pc": pc,
                    "codePageContentId": code_page_content_id,
                    "nextEvidence": "recapture with a native physical placement and generation payload",
                    "reviewState": "generated-unreviewed",
                },
                exact_issue=(
                    "exact-instruction-placement-unresolved",
                    physical_pc,
                    captured_opcode,
                ),
            )
        if status in {"resident-unmapped", "unknown-region"}:
            verification_status = (
                mapping_verification.get("status")
                if isinstance(mapping_verification, Mapping)
                else None
            )
            candidate_method = (
                mapping_candidate.get("mappingMethod")
                if isinstance(mapping_candidate, Mapping)
                else None
            )
            unresolved_kind = status
            if verification_status == "opcode-mismatch":
                unresolved_kind = (
                    "nominal-vram-opcode-mismatch"
                    if candidate_method == "static-nominal-vram-address-candidate"
                    else "contemporaneous-placement-opcode-mismatch"
                )
            elif verification_status in {
                "captured-opcode-unavailable",
                "rom-offset-out-of-range",
            }:
                unresolved_kind = f"mapping-{verification_status}"
            candidate_rom_offset = (
                mapping_candidate.get("romOffset")
                if isinstance(mapping_candidate, Mapping)
                else None
            )
            retain_unresolved(
                {
                    "schema": UNRESOLVED_SCHEMA,
                    "unresolvedId": f"unresolved-pc:{sequence:08d}",
                    "kind": unresolved_kind,
                    "sequence": sequence,
                    "frame": row["frame_number"],
                    "pc": pc,
                    "observationKind": observation["observationKind"],
                    "mappingVerification": mapping_verification,
                    "mappingCandidate": mapping_candidate,
                    "nextEvidence": (
                        "capture the loader/write that established this page, then resolve through its contemporaneous region"
                    ),
                    "reviewState": "generated-unreviewed",
                },
                exact_issue=(
                    unresolved_kind,
                    physical_pc,
                    captured_opcode,
                    candidate_rom_offset,
                    observation["observationKind"],
                ),
            )
    diagnostics = {
        "observationCount": len(observations),
        "exactExecutionCount": exact_count,
        "exactWatchHitCount": exact_watch_count,
        "nativeCoverageCount": native_coverage_count,
        "focusedOwnerStateCount": focused_count,
        "resolvedTraceContentCount": sum(
            item["observationKind"] == "native-exact-coverage"
            and item["codePageContentResolved"]
            for item in observations
        ),
        "sampledPcCount": sampled_count,
        "resolvedFunctionCount": sum(item["status"] == "resolved-function" for item in observations),
        "resolvedRomCount": sum(item["romOffset"] is not None for item in observations),
        "unresolvedPcCount": len(unresolved),
        "opcodeConfirmedMappingCount": sum(
            item.get("mappingVerification", {}).get("status") == "exact-opcode-match"
            for item in observations
            if isinstance(item.get("mappingVerification"), Mapping)
        ),
        "opcodeMismatchMappingCount": sum(
            item.get("mappingVerification", {}).get("status") == "opcode-mismatch"
            for item in observations
            if isinstance(item.get("mappingVerification"), Mapping)
        ),
        "addressOnlyMappingCandidateCount": sum(
            item.get("mappingCandidate") is not None for item in observations
        ),
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
    rom: bytes,
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
    region_index = _ActiveRegionIndex(regions)
    for row in rows:
        payload = _read_payload(row, connection)
        try:
            pc = int(str(payload.get("pc")), 0)
            physical_pc = physical_from_live(pc)
            address = int(str(payload.get("address")), 0)
        except (TypeError, ValueError):
            continue
        sequence = int(row["sequence_id"])
        region = region_index.resolve(sequence, physical_pc)
        transaction = (
            transaction_by_id.get(str(region["sourceLoaderEventId"]))
            if region is not None and region.get("sourceLoaderEventId") is not None
            else None
        )
        rom_offset: int | None = None
        function = None
        mapping_method: str | None = None
        mapping_verification: dict[str, Any] | None = None
        mapping_candidate: dict[str, Any] | None = None
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
                mapping_verification = {
                    "status": "contextual-placement-without-accessor-opcode",
                    "romOffset": candidate,
                    "capturedOpcode": None,
                    "romOpcode": None,
                    "equalityBasis": "ordered-rom-dma-region-context",
                }
        if function is None and region is None:
            nominal_mapping = static.resolve_nominal_mapping(pc)
            if nominal_mapping is not None:
                nominal_function, nominal_rom_offset = nominal_mapping
                accessor_opcode = _u32(
                    payload.get("pcOpcode", payload.get("opcode"))
                )
                mapping_verification = _opcode_mapping_verification(
                    rom, nominal_rom_offset, accessor_opcode
                )
                if mapping_verification["status"] == "exact-opcode-match":
                    function = nominal_function
                    rom_offset = nominal_rom_offset
                    mapping_method = "accepted-static-nominal-vram"
                else:
                    mapping_candidate = {
                        "mappingMethod": "static-nominal-vram-address-candidate",
                        "romOffset": nominal_rom_offset,
                        "function": nominal_function.to_dict(),
                    }
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
                "mappingVerification": mapping_verification,
                "mappingCandidate": mapping_candidate,
                "registerSnapshot": payload.get("regs"),
                "reviewState": "generated-unreviewed",
            }
        )
    diagnostics = {
        "memoryAccessCount": len(accesses),
        "readCount": sum(item["accessKind"] == "read" for item in accesses),
        "writeCount": sum(item["accessKind"] == "write" for item in accesses),
        "resolvedAccessorFunctionCount": sum(item["function"] is not None for item in accesses),
        "addressOnlyAccessorCandidateCount": sum(
            item.get("mappingCandidate") is not None for item in accesses
        ),
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
            connection, regions, transactions, static, rom
        )
        memory_accesses, memory = _memory_analysis(
            connection, regions, transactions, static, rom
        )
        controller_inputs, controller_input = _controller_input_analysis(connection)
        baseline_placements, baseline = _baseline_census(
            connection, session_id, static, rom
        )
        loss_ranges = int(
            connection.execute("SELECT COUNT(*) FROM bridge_loss_range").fetchone()[0]
        )
    finally:
        connection.close()

    slabs, placements = _derive_code_slabs(transactions, static)
    existing_placements = {
        (
            int(item["function"]["functionId"]),
            int(item["destinationPhysicalStart"]),
            int(item["destinationPhysicalEndExclusive"]),
        )
        for item in placements
    }
    placements.extend(
        item
        for item in baseline_placements
        if (
            int(item["function"]["functionId"]),
            int(item["destinationPhysicalStart"]),
            int(item["destinationPhysicalEndExclusive"]),
        )
        not in existing_placements
    )
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
        "The one-time 4 MiB baseline proves exact resident bytes at capture start; it does not prove execution or loader ancestry.",
        "Static nominal function mapping requires equality of all four observed opcode bytes at the proposed ROM offset; address-only crosswalks remain candidates.",
        "Controller rows are effective P1 input transitions. A run lasts until the next transition; repeated identical polls are coalesced.",
        "This generated product is intended to accelerate decompilation and remains unreviewed.",
    ]
    summary: dict[str, Any] = {
        "schema": SESSION_PRODUCT_SCHEMA,
        "mappingPolicy": MAPPING_POLICY,
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
            "baselineFunctionPlacements": sum(
                item["mappingMethod"] == "atomic-baseline-rdram-exact-function-bytes"
                for item in placements
            ),
            "regionInstances": len(regions),
            "timelineBursts": len(bursts),
            "rangeSnapshots": safety["acceptedSnapshotCount"],
            "rangeChanges": safety["changeCount"],
            "unresolvedRangeChanges": safety["unresolvedChangeCount"],
            "executionObservations": execution["observationCount"],
            "exactExecutionWatchHits": execution["exactWatchHitCount"],
            "focusedOwnerStateWitnesses": execution["focusedOwnerStateCount"],
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
        "baselineCensusDiagnostics": baseline,
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
