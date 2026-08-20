"""Validated session-to-knowledge delta extraction and automatic ingestion."""

from __future__ import annotations

import json
from pathlib import Path
import sqlite3
from typing import Any, Mapping

from .capture_db import load_event_payload
from .derive_session import derive_session
from .inventory import repository_root
from .knowledge import (
    CodePageObservation,
    ControllerTransitionObservation,
    DmaPlacementObservation,
    EdgeObservation,
    FunctionPlacementObservation,
    InstructionObservation,
    KnownActivityObservation,
    MarkerContextWindowObservation,
    MarkerExecutionContextRecord,
    RegionLifetimeObservation,
    SampledPcObservation,
    SemanticMarkerObservation,
    SessionDelta,
    UnresolvedKnowledgeObservation,
    compare_canonical_machine_facts,
    compare_knowledge_databases,
    create_knowledge_database,
    ingest_delta,
    knowledge_status,
    open_knowledge_database,
    verify_knowledge_database,
)
from .overlay_atlas import SessionProduct, _read_ndjson, load_session_product
from .schema import open_capture_database
from .protocol import BRIDGE_PROTOCOL_VERSION
from .verify import verify_session


def knowledge_staging_products_root(knowledge_database: Path) -> Path:
    database = knowledge_database.resolve()
    return database.parent / f"{database.stem}-staging-products"


def _integer(value: Any, field: str) -> int:
    if isinstance(value, bool):
        raise ValueError(f"{field} is not an integer")
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        try:
            return int(value, 0)
        except ValueError as exc:
            raise ValueError(f"{field} is not an integer") from exc
    raise ValueError(f"{field} is not an integer")


def _optional_rows(product: SessionProduct, name: str) -> tuple[Mapping[str, Any], ...]:
    files = product.summary.get("files")
    relative = files.get(name) if isinstance(files, Mapping) else None
    if not isinstance(relative, str):
        return ()
    return _read_ndjson(product.root / relative)


def _frontier_identity_from_capture(connection: sqlite3.Connection) -> str:
    session = connection.execute(
        "SELECT accepted_resolver_identity FROM session"
    ).fetchone()
    if session is not None and isinstance(session[0], str) and session[0]:
        return str(session[0])
    row = connection.execute(
        """
        SELECT raw_payload_json FROM event_sequence
        WHERE bridge_event_type='session-start' ORDER BY sequence_id LIMIT 1
        """
    ).fetchone()
    if row is not None:
        payload = load_event_payload(connection, str(row[0]))
        trace = payload.get("executionTrace")
        if isinstance(trace, Mapping):
            identity = trace.get("frontierIdentity")
            if isinstance(identity, str) and identity:
                return identity
    return "legacy-session-isolated"


def _evidence_grade(transaction: Mapping[str, Any]) -> str:
    content_bytes_valid = transaction.get("contentBytesValid")
    if not isinstance(content_bytes_valid, bool):
        # Compatibility for products derived before exact bytes, rather than
        # their digest, became the acceptance field.
        content_bytes_valid = transaction.get("contentHashValid") is True
    exact = bool(
        transaction.get("pairingStatus") == "matched"
        and content_bytes_valid
    )
    if exact and transaction.get("romMatch") == "exact-span":
        return "verified"
    if exact and int(transaction.get("romMatchedPrefixLength") or 0) > 0:
        return "supported"
    return "unresolved"


def _capture_page_observations(
    connection: sqlite3.Connection,
) -> tuple[tuple[CodePageObservation, ...], dict[int, CodePageObservation]]:
    observations: list[CodePageObservation] = []
    pages: dict[int, CodePageObservation] = {}
    for row in connection.execute(
        """
        SELECT bridge_event_sequence, bridge_event_type, raw_payload_json
        FROM event_sequence
        WHERE bridge_stream='trace'
          AND bridge_event_type IN ('trace-page','trace-generation')
        ORDER BY sequence_id
        """
    ):
        payload = load_event_payload(connection, str(row[2]))
        content_id = payload.get("codePageContentId")
        if isinstance(content_id, bool) or not isinstance(content_id, int) or content_id < 1:
            raise ValueError("trace page/generation omitted its local content ID")
        bridge_sequence = int(row[0])
        if row[1] == "trace-page":
            encoded = payload.get("codeBytesHex")
            if not isinstance(encoded, str):
                raise ValueError("trace page omitted exact code bytes")
            data = bytes.fromhex(encoded)
            page = CodePageObservation(
                content_id,
                _integer(payload.get("physicalAddress"), "trace physical page"),
                _integer(payload.get("pageGeneration"), "trace page generation"),
                data,
                bridge_sequence,
                bridge_sequence,
            )
            previous = pages.get(content_id)
            if previous is not None and (
                previous.physical_page_start != page.physical_page_start
                or previous.exact_bytes != page.exact_bytes
            ):
                raise ValueError("trace local content ID changed exact identity")
            pages[content_id] = page
            observations.append(page)
            continue
        known = pages.get(content_id)
        if known is None:
            raise ValueError("trace generation references an unseen exact trace page")
        physical = _integer(payload.get("physicalAddress"), "trace-generation physical page")
        if physical != known.physical_page_start:
            raise ValueError("trace generation physical placement disagrees with exact page")
        observations.append(
            CodePageObservation(
                content_id,
                physical,
                _integer(payload.get("pageGeneration"), "trace generation"),
                known.exact_bytes,
                bridge_sequence,
                bridge_sequence,
            )
        )
    return tuple(observations), pages


def build_session_delta(
    *,
    knowledge_database: Path,
    session_directory: Path,
    product: SessionProduct,
) -> SessionDelta:
    """Convert one verified raw capture and deterministic product to exact facts."""

    database = session_directory.resolve() / "capture.sqlite"
    capture = open_capture_database(database, read_only=True)
    capture.execute("PRAGMA query_only = ON")
    try:
        session = capture.execute("SELECT * FROM session").fetchone()
        if session is None or str(session["session_id"]) != product.session_id:
            raise ValueError("capture and session product identities disagree")
        if session["closure_status"] != "closed" or session["continuity_status"] != "continuous":
            raise ValueError("only closed continuous sessions can enter persistent knowledge")
        capture_identity = (
            f"capture:{product.session_id}:{session['bridge_epoch']}:"
            f"{session['bridge_next_sequence_start']}:{session['bridge_next_sequence_end']}"
        )
        legacy_manifest_reference = session["manifest_sha256"]
        raw_manifest_reference = (
            str(legacy_manifest_reference)
            if legacy_manifest_reference is not None
            else capture_identity
        )
        code_pages, page_by_local = _capture_page_observations(capture)
        frontier_identity = _frontier_identity_from_capture(capture)

        execution_values = _optional_rows(product, "executionObservations")

        def exact_instruction(
            value: Mapping[str, Any],
        ) -> tuple[int, int, int | None] | None:
            try:
                pc = _integer(value.get("pc"), "execution PC")
                opcode = _integer(value.get("opcode"), "execution opcode")
            except ValueError:
                return None
            generation_value = value.get("pageGeneration")
            generation = (
                generation_value
                if isinstance(generation_value, int)
                and not isinstance(generation_value, bool)
                and generation_value >= 0
                else None
            )
            if value.get("exactInstructionResolved") is True:
                try:
                    physical = _integer(value.get("physicalPc"), "execution physical PC")
                except ValueError:
                    return None
                return physical, opcode, generation
            local_id = value.get("codePageContentId")
            page = (
                page_by_local.get(local_id)
                if isinstance(local_id, int) and not isinstance(local_id, bool)
                else None
            )
            if page is None or value.get("codePageContentResolved") is not True:
                return None
            offset = pc & 0xFFF
            if page.exact_bytes[offset : offset + 4] != opcode.to_bytes(4, "big"):
                return None
            return page.physical_page_start + offset, opcode, page.native_generation

        def exact_predecessor(
            previous: Mapping[str, Any],
        ) -> tuple[int, int, int | None] | None:
            try:
                pc = _integer(previous.get("pc"), "edge source PC")
                opcode = _integer(previous.get("opcode"), "edge source opcode")
            except ValueError:
                return None
            generation_value = previous.get("pageGeneration")
            generation = (
                generation_value
                if isinstance(generation_value, int)
                and not isinstance(generation_value, bool)
                and generation_value >= 0
                else None
            )
            if previous.get("exactInstructionResolved") is True:
                try:
                    physical = _integer(
                        previous.get("physicalAddress"), "edge source physical address"
                    )
                except ValueError:
                    return None
                return physical, opcode, generation
            local_id = previous.get("codePageContentId")
            page = (
                page_by_local.get(local_id)
                if isinstance(local_id, int) and not isinstance(local_id, bool)
                else None
            )
            if page is None or previous.get("exactContentResolved") is not True:
                return None
            offset = pc & 0xFFF
            if page.exact_bytes[offset : offset + 4] != opcode.to_bytes(4, "big"):
                return None
            return page.physical_page_start + offset, opcode, page.native_generation

        function_candidates: dict[tuple[int, int], set[tuple[int, int | None]]] = {}
        for value in execution_values:
            if value.get("observationKind") != "native-exact-coverage":
                continue
            exact = exact_instruction(value)
            function = value.get("function")
            if exact is None or not isinstance(function, Mapping):
                continue
            key = (exact[0], exact[1])
            function_candidates.setdefault(key, set()).add(
                (int(function["functionId"]), value.get("romOffset"))
            )

        instructions: list[InstructionObservation] = []
        edges: list[EdgeObservation] = []
        generated_unresolved: list[UnresolvedKnowledgeObservation] = []
        for ordinal, value in enumerate(execution_values, 1):
            if value.get("observationKind") != "native-exact-coverage":
                continue
            exact = exact_instruction(value)
            if exact is None:
                generated_unresolved.append(
                    UnresolvedKnowledgeObservation(
                        f"knowledge-exec-placement:{ordinal:08d}",
                        "exact-execution-placement-or-generation-unresolved",
                        value.get("sequence"),
                        value.get("frame"),
                        dict(value),
                    )
                )
                continue
            physical, opcode, generation = exact
            bridge_sequence = _integer(value.get("bridgeSequence"), "execution bridge sequence")
            function = value.get("function")
            function_id = int(function["functionId"]) if isinstance(function, Mapping) else None
            instructions.append(
                InstructionObservation(
                    physical,
                    opcode,
                    bridge_sequence,
                    generation,
                    function_id,
                    value.get("romOffset"),
                    str(value.get("mappingMethod") or "unresolved"),
                    value.get("frame"),
                    str(value.get("observationKind") or "native-exact-coverage"),
                )
            )
            previous = value.get("previous")
            if value.get("newEdge") is not True or not isinstance(previous, Mapping):
                continue
            source = exact_predecessor(previous)
            if source is None:
                generated_unresolved.append(
                    UnresolvedKnowledgeObservation(
                        f"knowledge-edge-source:{ordinal:08d}",
                        "exact-edge-source-placement-or-generation-unresolved",
                        value.get("sequence"),
                        value.get("frame"),
                        dict(value),
                    )
                )
                continue
            previous_physical, previous_opcode, previous_generation = source
            candidates = function_candidates.get(
                (previous_physical, previous_opcode), set()
            )
            caller = next(iter(candidates)) if len(candidates) == 1 else (None, None)
            edges.append(
                EdgeObservation(
                    previous_physical,
                    previous_opcode,
                    physical,
                    opcode,
                    bridge_sequence,
                    previous_generation,
                    generation,
                    source_function_id=caller[0],
                    source_z64_offset=caller[1],
                    destination_function_id=function_id,
                    destination_z64_offset=value.get("romOffset"),
                    frame=value.get("frame"),
                    observation_kind="native-exact-instruction-transition",
                )
            )

        completion_payloads: dict[int, Mapping[str, Any]] = {}
        for row in capture.execute(
            """
            SELECT sequence_id, raw_payload_json FROM event_sequence
            WHERE bridge_stream='dma' AND bridge_event_type='dma-complete'
            """
        ):
            completion_payloads[int(row[0])] = load_event_payload(capture, str(row[1]))

        dma_values: list[DmaPlacementObservation] = []
        for transaction in product.transactions:
            completion_sequence = int(transaction["completionSequence"])
            payload = completion_payloads.get(completion_sequence)
            if payload is None or not isinstance(payload.get("destinationBytesHex"), str):
                raise ValueError("derived DMA transaction lacks exact raw completion bytes")
            data = bytes.fromhex(str(payload["destinationBytesHex"]))
            dma_values.append(
                DmaPlacementObservation(
                    "cartridge-rom",
                    int(transaction["sourceZ64Start"]),
                    int(transaction["sourceZ64Start"]) + len(data),
                    int(transaction["destinationPhysicalStart"]),
                    int(transaction["destinationTransferEndExclusive"]),
                    int(transaction["romMatchedPrefixLength"]),
                    data,
                    str(transaction["staticRegionClass"]),
                    "ordered-rom-dma-with-event-time-destination-bytes",
                    _evidence_grade(transaction),
                    int(transaction["entryBridgeSequence"]),
                    int(transaction["completionBridgeSequence"]),
                    transaction.get("frame"),
                    transaction.get("frame"),
                )
            )

        placements: list[FunctionPlacementObservation] = []
        for value in product.functions:
            function = value.get("function")
            if not isinstance(function, Mapping):
                continue
            placements.append(
                FunctionPlacementObservation(
                    int(function["functionId"]),
                    int(function["z64Start"]),
                    int(function["z64EndExclusive"]),
                    int(value["destinationPhysicalStart"]),
                    int(value["destinationPhysicalEndExclusive"]),
                    str(value["mappingMethod"]),
                    int(value["firstCompletionSequence"]),
                    int(value["lastCompletionSequence"]),
                )
            )

        controllers: list[ControllerTransitionObservation] = []
        for value in _optional_rows(product, "controllerInput"):
            controllers.append(
                ControllerTransitionObservation(
                    _integer(value.get("bridgeSequence"), "controller bridge sequence"),
                    value.get("frame"),
                    value.get("endBridgeSequenceExclusive"),
                    value.get("endFrameExclusive"),
                    _integer(value.get("controller"), "controller index"),
                    _integer(value.get("state"), "controller state"),
                    _integer(value.get("buttons"), "controller buttons"),
                    _integer(value.get("stickX"), "controller stick X"),
                    _integer(value.get("stickY"), "controller stick Y"),
                    value.get("injectedByBridge") is True,
                    str(value.get("capturePhase")),
                )
            )

        regions: list[RegionLifetimeObservation] = []
        for value in product.regions:
            source_identity = value.get("sourceIdentity")
            source_z64_start = source_z64_end = None
            if isinstance(source_identity, str) and source_identity.startswith("z64:"):
                try:
                    start_text, end_text = source_identity[4:].split("-", 1)
                    source_z64_start = int(start_text, 16)
                    source_z64_end = int(end_text, 16)
                except (ValueError, TypeError):
                    source_z64_start = source_z64_end = None
            regions.append(
                RegionLifetimeObservation(
                    str(value["regionInstanceId"]),
                    int(value["destinationPhysicalStart"]),
                    int(value["destinationPhysicalEndExclusive"]),
                    str(value.get("sourceKind") or "unknown"),
                    str(source_identity) if isinstance(source_identity, str) else None,
                    source_z64_start,
                    source_z64_end,
                    int(value["firstSequence"]),
                    value.get("endSequenceExclusive"),
                    value.get("firstFrame"),
                    value.get("lastObservedFrame"),
                    value.get("lastObservedSequence"),
                    value.get("closureReason"),
                    str(value.get("regionClass") or "unknown"),
                    str(value.get("evidenceGrade") or "unresolved"),
                    value.get("sourceLoaderEventId"),
                    value.get("parentRegionInstanceId"),
                )
            )

        sampled_pcs: list[SampledPcObservation] = []
        for value in execution_values:
            if value.get("observationKind") != "sampled-pc-context":
                continue
            function = value.get("function")
            opcode_value = value.get("opcode")
            try:
                opcode = _integer(opcode_value, "sampled opcode")
            except ValueError:
                opcode = None
            physical_value = value.get("physicalPc")
            try:
                physical_pc = _integer(physical_value, "sampled physical PC")
            except ValueError:
                physical_pc = None
            sampled_pcs.append(
                SampledPcObservation(
                    str(value.get("executionObservationId") or f"sample:{len(sampled_pcs) + 1:08d}"),
                    _integer(value.get("sequence"), "sample sequence"),
                    value.get("bridgeSequence"),
                    value.get("frame"),
                    _integer(value.get("pc"), "sample live PC"),
                    physical_pc,
                    opcode,
                    value.get("regionInstanceId"),
                    int(function["functionId"]) if isinstance(function, Mapping) else None,
                    value.get("romOffset"),
                    str(value.get("status") or "unknown"),
                    dict(value),
                )
            )

        semantic_markers = tuple(
            SemanticMarkerObservation(
                int(row["marker_id"]),
                str(row["marker_type"]),
                str(row["marker_source"]),
                str(row["confidence"]),
                str(row["label"]),
                None if row["note"] is None else str(row["note"]),
                row["start_sequence"],
                row["end_sequence"],
                row["start_frame"],
                row["end_frame"],
                str(row["created_utc"]),
            )
            for row in capture.execute(
                "SELECT * FROM semantic_marker ORDER BY marker_id"
            )
        )

        activity_rows = list(
            capture.execute(
                "SELECT bridge_event_sequence,raw_payload_json FROM event_sequence "
                "WHERE bridge_event_type='known-activity' AND ingestion_status='accepted' "
                "ORDER BY sequence_id"
            )
        )
        if len(activity_rows) > 1:
            raise ValueError("capture contains more than one stop-time known-activity summary")
        known_activity = None
        if activity_rows:
            activity_row = activity_rows[0]
            payload = load_event_payload(capture, str(activity_row["raw_payload_json"]))
            bridge_sequence = activity_row["bridge_event_sequence"]
            if bridge_sequence is None:
                raise ValueError("known-activity summary lacks its bridge sequence")
            known_activity = KnownActivityObservation(
                str(payload.get("frontierIdentity")),
                _integer(payload.get("frontierFormatVersion"), "activity frontier format"),
                int(bridge_sequence),
                _integer(payload.get("instructionMaxOrdinal"), "instruction max ordinal"),
                _integer(payload.get("instructionHitCount"), "instruction hit count"),
                bytes.fromhex(str(payload.get("instructionHitBitmapHex"))),
                _integer(payload.get("edgeMaxOrdinal"), "edge max ordinal"),
                _integer(payload.get("edgeHitCount"), "edge hit count"),
                bytes.fromhex(str(payload.get("edgeHitBitmapHex"))),
                _integer(payload.get("dmaMaxOrdinal"), "DMA max ordinal"),
                _integer(payload.get("dmaHitCount"), "DMA hit count"),
                bytes.fromhex(str(payload.get("dmaHitBitmapHex"))),
                str(payload.get("capturePhase")),
            )

        marker_context_windows: list[MarkerContextWindowObservation] = []
        for context_row in capture.execute(
            "SELECT bridge_event_type,bridge_event_sequence,raw_payload_json "
            "FROM event_sequence WHERE bridge_event_type IN "
            "('marker-execution-context','marker-execution-context-incomplete') "
            "AND ingestion_status='accepted' ORDER BY sequence_id"
        ):
            payload = load_event_payload(capture, str(context_row["raw_payload_json"]))
            if payload.get("markerSessionId") != product.session_id:
                raise ValueError("marker execution context names a different session")
            bridge_sequence = context_row["bridge_event_sequence"]
            if bridge_sequence is None:
                raise ValueError("marker execution context lacks a bridge sequence")
            complete = context_row["bridge_event_type"] == "marker-execution-context"
            records: list[MarkerExecutionContextRecord] = []
            record_values = payload.get("records", ()) if complete else ()
            for record in record_values:
                if not isinstance(record, Mapping):
                    raise ValueError("marker execution context record is malformed")
                physical = record.get("physicalAddress")
                previous_physical = record.get("previousPhysicalAddress")
                records.append(
                    MarkerExecutionContextRecord(
                        _integer(record.get("localOrder"), "marker local order"),
                        str(record.get("side")),
                        record.get("frame"),
                        _integer(record.get("pc"), "marker PC"),
                        None
                        if physical is None
                        else _integer(physical, "marker physical address"),
                        _integer(record.get("opcode"), "marker opcode"),
                        record.get("previousValid") is True,
                        _integer(record.get("previousPc"), "marker previous PC"),
                        None
                        if previous_physical is None
                        else _integer(
                            previous_physical, "marker previous physical address"
                        ),
                        _integer(
                            record.get("previousOpcode"), "marker previous opcode"
                        ),
                    )
                )
            marker_context_windows.append(
                MarkerContextWindowObservation(
                    _integer(payload.get("markerId"), "marker context ID"),
                    "complete" if complete else "incomplete",
                    int(bridge_sequence),
                    _integer(
                        payload.get("requestedBeforeCount"),
                        "marker requested-before count",
                    ),
                    _integer(
                        payload.get("requestedAfterCount"),
                        "marker requested-after count",
                    ),
                    _integer(payload.get("beforeCount"), "marker before count")
                    if complete
                    else 0,
                    _integer(payload.get("afterCount"), "marker after count")
                    if complete
                    else 0,
                    (
                        "Native local execution order and VI frames are contextual, not "
                        "canonical bridge ordering."
                        if complete
                        else "Capture stopped before the requested after-window completed."
                    ),
                    tuple(records),
                )
            )

        unresolved = list(generated_unresolved)
        for ordinal, value in enumerate(product.unresolved, 1):
            unresolved.append(
                UnresolvedKnowledgeObservation(
                    str(value.get("unresolvedId") or f"product-unresolved:{ordinal:08d}"),
                    str(value.get("kind") or "unknown"),
                    value.get("sequence"),
                    value.get("frame"),
                    dict(value),
                )
            )
        context = product.summary.get("counts")
        contextual_counts = {
            str(key): int(value)
            for key, value in (context.items() if isinstance(context, Mapping) else ())
            if isinstance(value, int) and not isinstance(value, bool)
        }
        return SessionDelta(
            product.session_id,
            capture_identity,
            raw_manifest_reference,
            int(capture.execute("PRAGMA user_version").fetchone()[0]),
            str(session["bridge_version"]),
            frontier_identity,
            str(session["rom_normalized_sha256"]),
            str(session["bridge_epoch"]),
            int(session["bridge_next_sequence_start"]),
            int(session["bridge_next_sequence_end"]),
            str(database.resolve()),
            str(product.root.resolve()),
            product.summary_sha256,
            code_pages,
            tuple(instructions),
            tuple(edges),
            tuple(dma_values),
            tuple(placements),
            tuple(controllers),
            tuple(unresolved),
            contextual_counts,
            tuple(regions),
            tuple(sampled_pcs),
            semantic_markers,
            (
                "Historical known execution suppressed by the persistent frontier cannot be recreated; "
                "only emitted events and saved samples are retained.",
            ),
            known_activity,
            tuple(marker_context_windows),
        )
    finally:
        capture.close()


def _frontier_is_declared(connection: sqlite3.Connection, identity: str) -> bool:
    if identity == "legacy-session-isolated":
        return True
    current = connection.execute(
        "SELECT frontier_identity FROM frontier_state WHERE singleton=1"
    ).fetchone()
    if current is not None and str(current[0]) == identity:
        return True
    if connection.execute(
        "SELECT 1 FROM ingestion_ledger WHERE frontier_identity_at_start=? LIMIT 1",
        (identity,),
    ).fetchone():
        return True
    for row in connection.execute("SELECT delta_summary_json FROM ingestion_ledger"):
        try:
            value = json.loads(str(row[0]))
        except json.JSONDecodeError:
            continue
        if isinstance(value, Mapping) and value.get("frontierAfter") == identity:
            return True
    # The initial frontier may not occur in a ledger summary yet.
    if not connection.execute("SELECT 1 FROM ingestion_ledger LIMIT 1").fetchone():
        return current is not None and str(current[0]) == identity
    return False


def ingest_session(
    knowledge_database: Path,
    session_directory: Path,
    *,
    product_directory: Path | None = None,
    rom_path: Path | None = None,
    static_database: Path | None = None,
    resource_database: Path | None = None,
) -> dict[str, Any]:
    """Verify, derive, and atomically ingest one immutable staging session."""

    session_root = session_directory.resolve()
    capture = open_capture_database(session_root / "capture.sqlite", read_only=True)
    try:
        row = capture.execute("SELECT * FROM session").fetchone()
        if row is None:
            raise ValueError("capture has no session identity")
        session_id = str(row["session_id"])
        capture_reference = (
            f"capture:{session_id}:{row['bridge_epoch']}:"
            f"{row['bridge_next_sequence_start']}:{row['bridge_next_sequence_end']}"
        )
        capture_schema_version = int(capture.execute("PRAGMA user_version").fetchone()[0])
        capture_metadata = (
            capture_reference,
            capture_schema_version,
            str(row["bridge_version"]),
            str(row["rom_normalized_sha256"]),
            str(row["bridge_epoch"]),
            int(row["bridge_next_sequence_start"]),
            int(row["bridge_next_sequence_end"]),
        )
    finally:
        capture.close()

    knowledge = open_knowledge_database(knowledge_database)
    try:
        existing = knowledge.execute(
            "SELECT * FROM ingestion_ledger WHERE session_id=?",
            (session_id,),
        ).fetchone()
        if existing is not None:
            ledger_metadata = (
                str(existing["capture_reference"]),
                int(existing["capture_schema_version"]),
                str(existing["protocol_version"]),
                str(existing["rom_normalized_sha256"]),
                str(existing["bridge_epoch"]),
                int(existing["bridge_sequence_start"]),
                int(existing["bridge_sequence_end"]),
            )
            if ledger_metadata != capture_metadata:
                raise ValueError("session ID conflicts with already ingested exact metadata")
            return {
                "result": "PASS",
                "action": "no-op",
                "sessionId": session_id,
                "captureIdentity": str(existing["capture_reference"]),
                "knowledge": knowledge_status(knowledge_database),
            }
        meta = {str(item[0]): str(item[1]) for item in knowledge.execute("SELECT key,value FROM knowledge_meta")}
    finally:
        knowledge.close()

    verification = verify_session(session_root, repository_root())
    if not verification.ok:
        raise ValueError("raw session verification failed; persistent knowledge is unchanged")

    selected_rom = (rom_path or Path(meta["romPath"])).resolve()
    selected_static = (static_database or Path(meta["staticDatabasePath"])).resolve()
    selected_resource = (resource_database or Path(meta["resourceDatabasePath"])).resolve()
    destination = (
        product_directory.resolve()
        if product_directory is not None
        else knowledge_staging_products_root(knowledge_database) / session_id
    )
    derivation = derive_session(
        session_id,
        rom_path=selected_rom,
        sessions_directory=session_root.parent,
        output_directory=destination,
        static_database=selected_static,
        resource_database=selected_resource,
    )
    if derivation.get("result") != "PASS":
        raise ValueError("session derivation is incomplete; persistent knowledge is unchanged")
    product = load_session_product(destination)
    delta = build_session_delta(
        knowledge_database=knowledge_database,
        session_directory=session_root,
        product=product,
    )
    knowledge = open_knowledge_database(knowledge_database, read_only=True)
    try:
        if delta.protocol_version == BRIDGE_PROTOCOL_VERSION and not _frontier_is_declared(
            knowledge, delta.frontier_identity_at_start
        ):
            raise ValueError("capture names a frontier that is not in this knowledge ledger")
    finally:
        knowledge.close()
    return ingest_delta(knowledge_database, delta)


def import_valid_sessions(
    knowledge_database: Path,
    sessions_directory: Path,
    *,
    strict: bool = True,
) -> dict[str, Any]:
    """Import existing valid sessions beside historical products in stable order."""

    imported: list[dict[str, Any]] = []
    skipped: list[dict[str, str]] = []
    for capture in sorted(sessions_directory.resolve().glob("*/capture.sqlite")):
        session_dir = capture.parent
        try:
            result = ingest_session(knowledge_database, session_dir)
        except (OSError, sqlite3.Error, ValueError, RuntimeError) as exc:
            skipped.append({"sessionId": session_dir.name, "reason": str(exc)})
            if strict:
                raise
        else:
            imported.append(
                {"sessionId": result["sessionId"], "action": result["action"]}
            )
    return {
        "result": "PASS" if not skipped else "PARTIAL",
        "knowledgeDatabase": str(knowledge_database.resolve()),
        "imported": imported,
        "skipped": skipped,
    }


def rebuild_knowledge_database(source: Path, output: Path) -> dict[str, Any]:
    """Deterministically replay the declared ingestion ledger into a new database."""

    source_path = source.resolve()
    output_path = output.resolve()
    if output_path.exists():
        raise FileExistsError(output_path)
    source_verification = verify_knowledge_database(source_path)
    if source_verification["result"] != "PASS":
        raise ValueError("source knowledge database failed verification")
    connection = open_knowledge_database(source_path, read_only=True)
    try:
        meta = {
            str(row[0]): str(row[1])
            for row in connection.execute("SELECT key,value FROM knowledge_meta")
        }
        ledger = [
            dict(row)
            for row in connection.execute(
                "SELECT * FROM ingestion_ledger WHERE status='ingested' ORDER BY ledger_ordinal"
            )
        ]
    finally:
        connection.close()

    create_knowledge_database(
        output_path,
        rom_path=Path(meta["romPath"]),
        static_database=Path(meta["staticDatabasePath"]),
        resource_database=Path(meta["resourceDatabasePath"]),
        _database_id=meta["databaseId"],
    )
    rebuilt = open_knowledge_database(output_path)
    try:
        rebuilt_meta = {
            str(row[0]): str(row[1])
            for row in rebuilt.execute("SELECT key,value FROM knowledge_meta")
        }
        for identity_key in ("romNormalizedSha256", "databaseId"):
            if rebuilt_meta[identity_key] != meta[identity_key]:
                raise ValueError(
                    f"rebuild source identity changed for {identity_key}"
                )
        if rebuilt_meta["frontierFormatVersion"] != meta["frontierFormatVersion"]:
            raise ValueError("rebuild cannot change the frontier format")
        rebuilt.execute(
            "UPDATE knowledge_meta SET value=? WHERE key='activeBridgeProtocolVersion'",
            (meta["activeBridgeProtocolVersion"],),
        )
        rebuilt.commit()
    finally:
        rebuilt.close()
    replayed: list[dict[str, Any]] = []
    for row in ledger:
        capture = Path(str(row["source_capture_path"])).resolve()
        if capture.name != "capture.sqlite" or not capture.is_file():
            raise FileNotFoundError(
                f"ledger session {row['session_id']!r} capture is unavailable: {capture}"
            )
        result = ingest_session(
            output_path,
            capture.parent,
            product_directory=(
                knowledge_staging_products_root(output_path) / str(row["session_id"])
            ),
        )
        if (
            result.get("action") != "ingested"
            or result.get("captureIdentity") != row["capture_reference"]
        ):
            raise ValueError(
                f"ledger replay disagreed at session {row['session_id']!r}"
            )
        replayed.append(
            {
                "ledgerOrdinal": int(row["ledger_ordinal"]),
                "sessionId": str(row["session_id"]),
                "captureIdentity": str(row["capture_reference"]),
            }
        )

    rebuilt_verification = verify_knowledge_database(output_path)
    if int(meta["schemaVersion"]) == int(
        knowledge_status(output_path)["schemaVersion"]
    ):
        exact_equivalence = compare_knowledge_databases(source_path, output_path)
    else:
        exact_equivalence = compare_canonical_machine_facts(source_path, output_path)
    equivalent = (
        rebuilt_verification["result"] == "PASS"
        and exact_equivalence["equivalent"]
    )
    if not equivalent:
        raise ValueError(
            "deterministic knowledge rebuild is not logically equivalent to its source"
        )
    return {
        "result": "PASS",
        "sourceDatabase": str(source_path),
        "rebuiltDatabase": str(output_path),
        "sessionCount": len(replayed),
        "sessions": replayed,
        "exactEquivalence": exact_equivalence,
        "verification": rebuilt_verification,
    }
