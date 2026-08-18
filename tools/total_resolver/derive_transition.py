"""Deterministic ROM-DMA and placement derivation for one marked transition."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
import hashlib
import json
import os
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping

from .capture_db import canonical_json
from .configuration import machine_configuration_identity
from .contracts import EvidenceGrade, RegionClass
from .identities import read_normalized_rom, rom_identity_from_file
from .inventory import load_inventory, repository_root
from .region_tracker import RegionTracker, TrackedRegion
from .schema import open_capture_database
from .sessions import sessions_root
from .static_model import StaticModel


TRANSITION_PRODUCT_SCHEMA = "ob64-total-resolver-transition-product.v1"
TRANSACTION_SCHEMA = "ob64-total-resolver-rom-dma-transaction.v1"
REGION_SCHEMA = "ob64-total-resolver-derived-region.v1"
PLACEMENT_SCHEMA = "ob64-total-resolver-function-placement.v1"
CODE_SLAB_SCHEMA = "ob64-total-resolver-code-slab.v1"


@dataclass(frozen=True)
class DerivedTransaction:
    record: Mapping[str, Any]
    data: bytes
    physical_start: int
    completion_sequence: int
    frame: int | None
    region_class: RegionClass
    evidence_grade: EvidenceGrade
    source_identity: str | None


def products_root(explicit: Path | None = None) -> Path:
    return (
        explicit
        or repository_root() / "build" / "total-resolver" / "products" / "transitions"
    ).resolve()


def research_root() -> Path:
    configured = os.environ.get("OB64_RESEARCH_ROOT")
    return Path(configured).resolve() if configured else repository_root().parent.resolve()


def default_static_database() -> Path:
    return research_root() / "wiki" / "sol-decomp-static-db-r3-20260710" / "db" / "ob64-static.sqlite"


def default_resource_database() -> Path:
    return (
        research_root()
        / "wiki"
        / "rom-resource-load-chain-atlas-static-20260711"
        / "db"
        / "resource-load-chains.sqlite"
    )


def _integer(value: Any, field: str) -> int:
    if isinstance(value, bool):
        raise ValueError(f"{field} is not an integer")
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        try:
            return int(value, 0)
        except ValueError as exc:
            raise ValueError(f"{field} is not an integer: {value!r}") from exc
    raise ValueError(f"{field} is not an integer: {value!r}")


def _is_rom_dma(payload: Mapping[str, Any]) -> bool:
    if payload.get("sourceDomain") == "cartridge-rom":
        return True
    try:
        cart = _integer(payload.get("cart"), "cart")
    except ValueError:
        return False
    return cart & 0xF0000000 == 0xB0000000


def _first_difference(left: bytes, right: bytes) -> int:
    for index, (a, b) in enumerate(zip(left, right)):
        if a != b:
            return index
    return min(len(left), len(right))


def _read_payload(row: sqlite3.Row) -> dict[str, Any]:
    try:
        value = json.loads(str(row["raw_payload_json"]))
    except json.JSONDecodeError as exc:
        raise ValueError(f"event {row['sequence_id']} has invalid JSON") from exc
    if not isinstance(value, dict):
        raise ValueError(f"event {row['sequence_id']} payload is not an object")
    return value


def _marker(connection: sqlite3.Connection, marker_id: int) -> sqlite3.Row:
    row = connection.execute(
        "SELECT * FROM semantic_marker WHERE marker_id=?", (marker_id,)
    ).fetchone()
    if row is None:
        raise ValueError(f"semantic marker {marker_id} does not exist")
    if row["start_sequence"] is None:
        raise ValueError(f"semantic marker {marker_id} has no sequence boundary")
    return row


def _source_match(
    rom: bytes,
    rom_offset: int,
    data: bytes,
) -> tuple[str, int]:
    if rom_offset < 0 or rom_offset >= len(rom):
        return "outside-rom", 0
    expected = rom[rom_offset : rom_offset + len(data)]
    prefix = _first_difference(data, expected)
    if len(expected) == len(data) and prefix == len(data):
        return "exact-span", len(data)
    if prefix:
        return "exact-prefix-with-alignment-tail", prefix
    return "different", 0


def _event_rows(connection: sqlite3.Connection, end_sequence: int) -> Iterable[sqlite3.Row]:
    return connection.execute(
        """
        SELECT sequence_id, frame_number, bridge_event_sequence,
               bridge_event_type, raw_payload_json,
               event_time_content_sha256, event_time_content_size
        FROM event_sequence
        WHERE sequence_id <= ?
          AND bridge_stream='dma'
          AND bridge_event_type IN ('dma-start', 'dma-complete')
        ORDER BY sequence_id
        """,
        (end_sequence,),
    )


def _derive_transactions(
    connection: sqlite3.Connection,
    session_id: str,
    end_sequence: int,
    rom: bytes,
    static: StaticModel,
) -> tuple[list[DerivedTransaction], dict[str, Any]]:
    starts: dict[int, tuple[sqlite3.Row, dict[str, Any]]] = {}
    transactions: list[DerivedTransaction] = []
    issues: list[dict[str, Any]] = []
    ignored_non_rom_starts = 0
    ignored_non_rom_completions = 0

    for row in _event_rows(connection, end_sequence):
        payload = _read_payload(row)
        event_type = str(row["bridge_event_type"])
        if not _is_rom_dma(payload):
            if event_type == "dma-start":
                ignored_non_rom_starts += 1
            else:
                ignored_non_rom_completions += 1
            continue
        bridge_sequence = int(row["bridge_event_sequence"])
        if event_type == "dma-start":
            starts[bridge_sequence] = (row, payload)
            continue

        linked_sequence = payload.get("dmaStartSequence")
        linked = starts.pop(linked_sequence, None) if isinstance(linked_sequence, int) else None
        if linked is None:
            issues.append(
                {
                    "kind": "rom-completion-without-start",
                    "completionSequence": int(row["sequence_id"]),
                    "dmaStartBridgeSequence": linked_sequence,
                }
            )
            continue
        start_row, start_payload = linked
        phys = _integer(payload.get("phys"), "phys")
        rom_offset = _integer(payload.get("romoff"), "romoff")
        requested_length = _integer(payload.get("requestedLength"), "requestedLength")
        transfer_span = _integer(payload.get("transferSpanLength"), "transferSpanLength")
        encoded = payload.get("destinationBytesHex")
        if not isinstance(encoded, str):
            issues.append(
                {
                    "kind": "rom-completion-without-destination-bytes",
                    "completionSequence": int(row["sequence_id"]),
                }
            )
            continue
        try:
            data = bytes.fromhex(encoded)
        except ValueError:
            issues.append(
                {
                    "kind": "rom-completion-with-malformed-destination-bytes",
                    "completionSequence": int(row["sequence_id"]),
                }
            )
            continue
        content_sha = hashlib.sha256(data).hexdigest().upper()
        content_hash_valid = content_sha == row["event_time_content_sha256"]
        descriptor_fields = ("phys", "romoff", "requestedLength")
        descriptor_match = all(
            start_payload.get(field) == payload.get(field) for field in descriptor_fields
        )
        pair_match = bool(
            descriptor_match
            and payload.get("pairingStatus") == "matched"
            and linked_sequence == int(start_row["bridge_event_sequence"])
        )
        match_kind, matched_prefix = _source_match(rom, rom_offset, data)
        safe_end = rom_offset + matched_prefix
        static_class = static.classify_range(rom_offset, safe_end) if matched_prefix else "unknown"
        region_class = RegionClass(static_class)
        loader_pc = _integer(payload.get("pc"), "pc")
        loader = static.resolve_nominal_pc(loader_pc)
        transaction_id = (
            f"{session_id}:rom-dma:{int(start_row['bridge_event_sequence'])}:"
            f"{bridge_sequence}"
        )
        function_placements: list[dict[str, Any]] = []
        if matched_prefix:
            for function in static.functions_fully_within(rom_offset, safe_end):
                destination_start = phys + (function.rom_start - rom_offset)
                function_placements.append(
                    {
                        "schema": PLACEMENT_SCHEMA,
                        "placementId": f"{transaction_id}:function:{function.structural_name}",
                        "transactionId": transaction_id,
                        "completionSequence": int(row["sequence_id"]),
                        "frame": row["frame_number"],
                        "function": function.to_dict(),
                        "destinationPhysicalStart": destination_start,
                        "destinationPhysicalEndExclusive": destination_start
                        + (function.rom_end_exclusive - function.rom_start),
                        "destinationLiveStart": 0x80000000 + destination_start,
                        "destinationLiveEndExclusive": 0x80000000
                        + destination_start
                        + (function.rom_end_exclusive - function.rom_start),
                        "mappingMethod": "direct-rom-dma-prefix-equality",
                        "reviewState": "generated-unreviewed",
                    }
                )
        limitations: list[str] = []
        if not pair_match:
            limitations.append("start/completion descriptors disagree")
        if not content_hash_valid:
            limitations.append("stored destination-byte hash disagrees")
        if transfer_span != len(data):
            limitations.append("native transfer span differs from captured envelope size")
        if match_kind != "exact-span":
            limitations.append(
                "only the leading ROM-equal bytes are used for static placement mapping"
            )
        record = {
            "schema": TRANSACTION_SCHEMA,
            "transactionId": transaction_id,
            "sessionId": session_id,
            "entrySequence": int(start_row["sequence_id"]),
            "completionSequence": int(row["sequence_id"]),
            "entryBridgeSequence": int(start_row["bridge_event_sequence"]),
            "completionBridgeSequence": bridge_sequence,
            "frame": row["frame_number"],
            "loaderLivePc": loader_pc,
            "loaderFunction": loader.to_dict() if loader else None,
            "sourceDomain": "cartridge-rom",
            "sourceZ64Start": rom_offset,
            "sourceRequestedEndExclusive": rom_offset + requested_length,
            "sourceMatchedEndExclusive": safe_end,
            "destinationPhysicalStart": phys,
            "destinationTransferEndExclusive": phys + len(data),
            "destinationMatchedEndExclusive": phys + matched_prefix,
            "destinationLiveStart": 0x80000000 + phys,
            "requestedLength": requested_length,
            "transferSpanLength": transfer_span,
            "capturedByteLength": len(data),
            "destinationContentSha256": content_sha,
            "contentHashValid": content_hash_valid,
            "pairingStatus": "matched" if pair_match else "mismatch",
            "romMatch": match_kind,
            "romMatchedPrefixLength": matched_prefix,
            "staticRegionClass": static_class,
            "resourceMatches": list(static.resources_overlapping(rom_offset, safe_end))
            if matched_prefix
            else [],
            "functionPlacements": function_placements,
            "reviewState": "generated-unreviewed",
            "limitations": limitations,
        }
        if pair_match and content_hash_valid and match_kind == "exact-span":
            grade = EvidenceGrade.VERIFIED
            source_identity = f"z64:{rom_offset:08X}-{safe_end:08X}"
        elif pair_match and content_hash_valid and matched_prefix:
            grade = EvidenceGrade.SUPPORTED
            source_identity = None
        else:
            grade = EvidenceGrade.UNRESOLVED
            source_identity = None
        transactions.append(
            DerivedTransaction(
                record,
                data,
                phys,
                int(row["sequence_id"]),
                None if row["frame_number"] is None else int(row["frame_number"]),
                region_class,
                grade,
                source_identity,
            )
        )

    for bridge_sequence, (row, payload) in sorted(starts.items()):
        issues.append(
            {
                "kind": "rom-start-without-completion-before-endpoint",
                "entrySequence": int(row["sequence_id"]),
                "entryBridgeSequence": bridge_sequence,
                "cart": payload.get("cart"),
            }
        )
    diagnostics = {
        "ignoredNonRomStartCount": ignored_non_rom_starts,
        "ignoredNonRomCompletionCount": ignored_non_rom_completions,
        "romPairIssueCount": len(issues),
        "romPairIssues": issues,
    }
    return transactions, diagnostics


def _bursts(transactions: list[DerivedTransaction]) -> list[dict[str, Any]]:
    groups: list[list[DerivedTransaction]] = []
    current: list[DerivedTransaction] = []
    previous_frame: int | None = None
    for transaction in transactions:
        frame = transaction.frame
        if current and (
            frame is None
            or previous_frame is None
            or frame > previous_frame + 1
        ):
            groups.append(current)
            current = []
        current.append(transaction)
        previous_frame = frame
    if current:
        groups.append(current)

    result: list[dict[str, Any]] = []
    for ordinal, group in enumerate(groups, 1):
        frames = [item.frame for item in group if item.frame is not None]
        frame_counts = Counter(frames)
        classes = Counter(str(item.record["staticRegionClass"]) for item in group)
        resources = Counter(
            match["entityId"]
            for item in group
            for match in item.record["resourceMatches"]
        )
        result.append(
            {
                "burstId": f"burst:{ordinal:04d}",
                "firstSequence": group[0].completion_sequence,
                "lastSequence": group[-1].completion_sequence,
                "firstFrame": min(frames) if frames else None,
                "lastFrame": max(frames) if frames else None,
                "transactionCount": len(group),
                "transactionIds": [str(item.record["transactionId"]) for item in group],
                "capturedByteCount": sum(len(item.data) for item in group),
                "romMatchedByteCount": sum(
                    int(item.record["romMatchedPrefixLength"]) for item in group
                ),
                "uniqueSourceRangeCount": len(
                    {
                        (
                            item.record["sourceZ64Start"],
                            item.record["sourceMatchedEndExclusive"],
                        )
                        for item in group
                    }
                ),
                "uniqueDestinationRangeCount": len(
                    {
                        (
                            item.record["destinationPhysicalStart"],
                            item.record["destinationTransferEndExclusive"],
                        )
                        for item in group
                    }
                ),
                "functionPlacementCount": sum(
                    len(item.record["functionPlacements"]) for item in group
                ),
                "peakTransactionsInOneFrame": max(frame_counts.values()) if frame_counts else None,
                "staticClassCounts": dict(sorted(classes.items())),
                "mostFrequentResourceMatches": [
                    {"entityId": entity, "transactionCount": count}
                    for entity, count in sorted(
                        resources.items(), key=lambda item: (-item[1], item[0])
                    )[:8]
                ],
            }
        )
    return result


def _derive_code_slabs(
    transactions: list[DerivedTransaction],
    static: StaticModel,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    candidates = [
        item
        for item in transactions
        if item.record["romMatch"] == "exact-span"
        and item.record["pairingStatus"] == "matched"
        and item.record["contentHashValid"] is True
        and item.record["staticRegionClass"] in {"executable", "mixed"}
    ]
    groups: list[list[DerivedTransaction]] = []
    current: list[DerivedTransaction] = []
    for item in candidates:
        if current:
            previous = current[-1]
            previous_record = previous.record
            record = item.record
            previous_delta = (
                int(previous_record["destinationPhysicalStart"])
                - int(previous_record["sourceZ64Start"])
            )
            delta = int(record["destinationPhysicalStart"]) - int(record["sourceZ64Start"])
            contiguous = bool(
                delta == previous_delta
                and record["sourceZ64Start"] == previous_record["sourceMatchedEndExclusive"]
                and record["destinationPhysicalStart"]
                == previous_record["destinationMatchedEndExclusive"]
                and (
                    item.frame is None
                    or previous.frame is None
                    or item.frame <= previous.frame + 1
                )
            )
            if not contiguous:
                groups.append(current)
                current = []
        current.append(item)
    if current:
        groups.append(current)

    slabs: list[dict[str, Any]] = []
    placements: list[dict[str, Any]] = []
    for ordinal, group in enumerate(groups, 1):
        first = group[0].record
        last = group[-1].record
        source_start = int(first["sourceZ64Start"])
        source_end = int(last["sourceMatchedEndExclusive"])
        destination_start = int(first["destinationPhysicalStart"])
        destination_end = int(last["destinationMatchedEndExclusive"])
        data = b"".join(item.data for item in group)
        if len(data) != source_end - source_start or len(data) != destination_end - destination_start:
            raise ValueError("contiguous code-slab arithmetic is inconsistent")
        slab_id = f"code-slab:{ordinal:04d}"
        functions = static.functions_fully_within(source_start, source_end)
        slab_placements: list[str] = []
        for function in functions:
            mapped_start = destination_start + (function.rom_start - source_start)
            placement_id = f"{slab_id}:function:{function.structural_name}"
            slab_placements.append(placement_id)
            placements.append(
                {
                    "schema": PLACEMENT_SCHEMA,
                    "placementId": placement_id,
                    "codeSlabId": slab_id,
                    "sessionId": group[0].record["sessionId"],
                    "firstCompletionSequence": group[0].completion_sequence,
                    "lastCompletionSequence": group[-1].completion_sequence,
                    "firstFrame": group[0].frame,
                    "lastFrame": group[-1].frame,
                    "function": function.to_dict(),
                    "destinationPhysicalStart": mapped_start,
                    "destinationPhysicalEndExclusive": mapped_start
                    + function.rom_end_exclusive
                    - function.rom_start,
                    "destinationLiveStart": 0x80000000 + mapped_start,
                    "destinationLiveEndExclusive": 0x80000000
                    + mapped_start
                    + function.rom_end_exclusive
                    - function.rom_start,
                    "mappingMethod": "direct-contiguous-rom-dma-slab-equality",
                    "reviewState": "generated-unreviewed",
                }
            )
        slabs.append(
            {
                "schema": CODE_SLAB_SCHEMA,
                "codeSlabId": slab_id,
                "sessionId": group[0].record["sessionId"],
                "sourceZ64Start": source_start,
                "sourceZ64EndExclusive": source_end,
                "destinationPhysicalStart": destination_start,
                "destinationPhysicalEndExclusive": destination_end,
                "destinationLiveStart": 0x80000000 + destination_start,
                "destinationLiveEndExclusive": 0x80000000 + destination_end,
                "mappingDeltaPhysicalMinusZ64": destination_start - source_start,
                "byteSize": len(data),
                "contentSha256": hashlib.sha256(data).hexdigest().upper(),
                "firstCompletionSequence": group[0].completion_sequence,
                "lastCompletionSequence": group[-1].completion_sequence,
                "firstFrame": group[0].frame,
                "lastFrame": group[-1].frame,
                "transactionCount": len(group),
                "staticRegionClass": static.classify_range(source_start, source_end),
                "functionPlacementCount": len(slab_placements),
                "functionPlacementIds": slab_placements,
                "mappingMethod": "contiguous-exact-rom-dma-transactions",
                "reviewState": "generated-unreviewed",
            }
        )
    return slabs, placements


def _region_record(
    region: TrackedRegion,
    transition_start: int,
    transition_end: int,
) -> dict[str, Any]:
    resident_at_end = region.end_sequence_exclusive is None or (
        region.end_sequence_exclusive > transition_end
    )
    born = transition_start < region.first_sequence <= transition_end
    destroyed = (
        region.end_sequence_exclusive is not None
        and transition_start < region.end_sequence_exclusive <= transition_end
    )
    transient = bool(
        born
        and destroyed
        and region.first_frame is not None
        and region.last_observed_frame is not None
        and region.last_observed_frame - region.first_frame <= 2
    )
    return {
        "schema": REGION_SCHEMA,
        "regionInstanceId": region.region_instance_id,
        "destinationPhysicalStart": region.physical_start,
        "destinationPhysicalEndExclusive": region.physical_end_exclusive,
        "destinationLiveStart": 0x80000000 + region.physical_start,
        "destinationLiveEndExclusive": 0x80000000 + region.physical_end_exclusive,
        "byteSize": len(region.data),
        "contentSha256": region.content_sha256,
        "firstSequence": region.first_sequence,
        "firstFrame": region.first_frame,
        "lastObservedSequence": region.last_observed_sequence,
        "lastObservedFrame": region.last_observed_frame,
        "endSequenceExclusive": region.end_sequence_exclusive,
        "closureReason": region.closure_reason,
        "sourceKind": region.source_kind,
        "sourceIdentity": region.source_identity,
        "sourceLoaderEventId": region.loader_event_id,
        "parentRegionInstanceId": region.parent_region_instance_id,
        "regionClass": region.region_class.value,
        "evidenceGrade": region.evidence_grade.value,
        "bornDuringTransition": born,
        "destroyedDuringTransition": destroyed,
        "residentAtEndpoint": resident_at_end,
        "transientAtMostTwoFrames": transient,
    }


def _derive_regions(
    session_id: str,
    transactions: list[DerivedTransaction],
    transition_start: int,
    transition_end: int,
) -> tuple[list[dict[str, Any]], dict[str, Any], list[dict[str, Any]]]:
    tracker = RegionTracker(session_id)
    issues: list[dict[str, Any]] = []
    for item in transactions:
        if item.physical_start + len(item.data) > 0x00800000:
            issues.append(
                {
                    "kind": "destination-outside-rdram",
                    "completionSequence": item.completion_sequence,
                    "physicalStart": item.physical_start,
                    "byteLength": len(item.data),
                }
            )
            continue
        source_kind = "z64-rom" if item.source_identity is not None else "unknown"
        region_class = (
            item.region_class if item.source_identity is not None else RegionClass.UNKNOWN
        )
        tracker.observe_load(
            physical_start=item.physical_start,
            data=item.data,
            sequence=item.completion_sequence,
            frame=item.frame,
            region_class=region_class,
            evidence_grade=item.evidence_grade,
            source_kind=source_kind,
            source_identity=item.source_identity,
            loader_event_id=str(item.record["transactionId"]),
        )
    all_regions = list(tracker.history) + list(tracker.active_regions)
    relevant = [
        item
        for item in all_regions
        if item.first_sequence <= transition_end
        and (
            item.end_sequence_exclusive is None
            or item.end_sequence_exclusive > transition_start
        )
    ]
    region_records = [
        _region_record(item, transition_start, transition_end)
        for item in sorted(relevant, key=lambda r: (r.first_sequence, r.region_instance_id))
    ]
    configuration_hash, configuration_json = machine_configuration_identity(
        tracker.configuration_regions(), kind="combined"
    )
    configuration = {
        "configurationSha256": configuration_hash,
        "configurationKind": "combined",
        "regionCount": len(tracker.active_regions),
        "canonicalJson": json.loads(configuration_json),
    }
    return region_records, configuration, issues


def _write_ndjson(path: Path, values: Iterable[Mapping[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    with temporary.open("w", encoding="utf-8", newline="\n") as stream:
        for value in values:
            stream.write(canonical_json(value) + "\n")
    temporary.replace(path)


def _write_json(path: Path, value: Mapping[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temporary.replace(path)


def derive_transition(
    session_id: str,
    *,
    from_marker_id: int,
    to_marker_id: int,
    rom_path: Path,
    sessions_directory: Path | None = None,
    output_directory: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    """Derive a working transition product without mutating the raw session."""

    session_dir = sessions_root(sessions_directory) / session_id
    database = session_dir / "capture.sqlite"
    if not database.is_file():
        raise FileNotFoundError(database)
    rom_identity = rom_identity_from_file(rom_path)
    expected_identity = str(load_inventory()["target"]["normalizedRomSha256"])
    if rom_identity["normalizedSha256"] != expected_identity:
        raise ValueError("transition ROM does not match the frozen US Rev 0 target")
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
        start_marker = _marker(connection, from_marker_id)
        end_marker = _marker(connection, to_marker_id)
        start_sequence = int(start_marker["start_sequence"])
        end_sequence = int(end_marker["start_sequence"])
        if end_sequence <= start_sequence:
            raise ValueError("transition endpoint must follow its start marker")
        all_transactions, pair_diagnostics = _derive_transactions(
            connection, session_id, end_sequence, rom, static
        )
        transition_transactions = [
            item
            for item in all_transactions
            if start_sequence < item.completion_sequence <= end_sequence
        ]
        loss_count = int(
            connection.execute(
                """
                SELECT COUNT(*) FROM bridge_loss_range
                WHERE first_observed_after_sequence IS NULL
                   OR first_observed_after_sequence BETWEEN ? AND ?
                """,
                (start_sequence, end_sequence),
            ).fetchone()[0]
        )
    finally:
        connection.close()

    regions, configuration, region_issues = _derive_regions(
        session_id, all_transactions, start_sequence, end_sequence
    )
    code_slabs, placements = _derive_code_slabs(transition_transactions, static)
    bursts = _bursts(transition_transactions)
    for burst in bursts:
        burst["functionPlacementCount"] = sum(
            int(slab["functionPlacementCount"])
            for slab in code_slabs
            if slab["firstCompletionSequence"] >= burst["firstSequence"]
            and slab["lastCompletionSequence"] <= burst["lastSequence"]
        )
    exact = sum(item.record["romMatch"] == "exact-span" for item in transition_transactions)
    prefix = sum(
        item.record["romMatch"] == "exact-prefix-with-alignment-tail"
        for item in transition_transactions
    )
    different = len(transition_transactions) - exact - prefix
    matched_pairs = sum(
        item.record["pairingStatus"] == "matched" for item in transition_transactions
    )
    valid_hashes = sum(item.record["contentHashValid"] for item in transition_transactions)
    transient_count = sum(item["transientAtMostTwoFrames"] for item in regions)
    caveats = [
        "Frame numbers and human markers provide context; bridge sequence defines event order.",
        "The 0.7.1 run also recorded SRAM-to-RDRAM starts that have no ROM-copy completion; they are excluded here by cartridge domain.",
        "For unaligned transfers with a non-ROM-equal tail, only the leading equal bytes support static placement mapping.",
        "This is generated working evidence for decompilation and remains unreviewed.",
    ]
    quality = "supported-with-scoped-caveat"
    if (
        pair_diagnostics["romPairIssueCount"]
        or loss_count
        or matched_pairs != len(transition_transactions)
        or valid_hashes != len(transition_transactions)
    ):
        quality = "incomplete-working-evidence"
    summary: dict[str, Any] = {
        "schema": TRANSITION_PRODUCT_SCHEMA,
        "sessionId": session_id,
        "rawSession": {
            "closureStatus": session["closure_status"],
            "continuityStatus": session["continuity_status"],
            "bridgeVersion": session["bridge_version"],
            "bridgeEpoch": session["bridge_epoch"],
            "manifestSha256": session["manifest_sha256"],
        },
        "boundary": {
            "fromMarkerId": from_marker_id,
            "toMarkerId": to_marker_id,
            "startSequenceExclusive": start_sequence,
            "endSequenceInclusive": end_sequence,
            "startFrame": start_marker["start_frame"],
            "endFrame": end_marker["start_frame"],
            "annotations": {
                "from": start_marker["label"],
                "to": end_marker["label"],
            },
        },
        "rom": {
            "normalizedSha256": rom_identity["normalizedSha256"],
            "byteOrderOnDisk": rom_identity["byteOrder"],
            "size": rom_identity["size"],
        },
        "workingEvidenceQuality": quality,
        "counts": {
            "romDmaTransactions": len(transition_transactions),
            "matchedStartCompletionPairs": matched_pairs,
            "validDestinationContentHashes": valid_hashes,
            "exactRomSpanMatches": exact,
            "romPrefixWithAlignmentTail": prefix,
            "romDifferences": different,
            "capturedDestinationBytes": sum(len(item.data) for item in transition_transactions),
            "romMatchedPrefixBytes": sum(
                int(item.record["romMatchedPrefixLength"])
                for item in transition_transactions
            ),
            "timelineBursts": len(bursts),
            "derivedRegionsOverlappingTransition": len(regions),
            "transientRegionsAtMostTwoFrames": transient_count,
            "functionPlacements": len(placements),
            "contiguousCodeSlabs": len(code_slabs),
            "bridgeLossRangesInBoundary": loss_count,
        },
        "pairingDiagnostics": pair_diagnostics,
        "regionIssueCount": len(region_issues),
        "regionIssues": region_issues,
        "endpointConfiguration": configuration,
        "codeSlabs": code_slabs,
        "timelineBursts": bursts,
        "highestVolumeBursts": sorted(
            bursts,
            key=lambda item: (-item["transactionCount"], item["burstId"]),
        )[:12],
        "caveats": caveats,
        "files": {
            "transactions": "transactions.ndjson",
            "regions": "regions.ndjson",
            "functionPlacements": "function-placements.ndjson",
            "codeSlabs": "code-slabs.ndjson",
        },
    }

    destination = (
        output_directory.resolve()
        if output_directory is not None
        else products_root() / session_id / f"{from_marker_id:04d}-{to_marker_id:04d}"
    )
    _write_ndjson(destination / "transactions.ndjson", (item.record for item in transition_transactions))
    _write_ndjson(destination / "regions.ndjson", regions)
    _write_ndjson(destination / "function-placements.ndjson", placements)
    _write_ndjson(destination / "code-slabs.ndjson", code_slabs)
    _write_json(destination / "summary.json", summary)
    return {
        "result": "PASS" if quality == "supported-with-scoped-caveat" else "PARTIAL",
        "sessionId": session_id,
        "productDirectory": str(destination),
        "summaryPath": str(destination / "summary.json"),
        "workingEvidenceQuality": quality,
        "counts": summary["counts"],
        "highestVolumeBursts": summary["highestVolumeBursts"],
        "caveats": caveats,
    }
