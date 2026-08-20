"""Strict preservation-oriented normalization of unified bridge drains."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
from typing import Any, Mapping

from .protocol import BridgeProtocolError, FRONTIER_FORMAT_VERSION
from .addressing import RDRAM_SIZE


BRIDGE_STREAMS = frozenset({"watch", "dma", "trace", "input"})


@dataclass(frozen=True)
class DroppedSequenceRange:
    first_sequence: int
    last_sequence: int
    count: int


@dataclass(frozen=True)
class PreservedBridgeEvent:
    payload: Mapping[str, Any]
    event_type: str
    frame_number: int | None
    ingestion_status: str
    bridge_epoch: str
    bridge_sequence: int
    bridge_stream: str
    event_time_content_sha256: str | None = None
    event_time_content_size: int | None = None
    event_time_content_encoding: str | None = None
    event_time_content_phase: str | None = None
    event_time_content_field: str | None = None


@dataclass(frozen=True)
class DrainBatch:
    bridge_epoch: str
    events: tuple[PreservedBridgeEvent, ...]
    remaining: int
    dropped: int
    dropped_ranges: tuple[DroppedSequenceRange, ...]
    next_event_sequence: int


def _nonnegative_integer(value: Any, field: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise BridgeProtocolError(f"drain response {field} must be a nonnegative integer")
    return value


def _positive_integer(value: Any, field: str) -> int:
    result = _nonnegative_integer(value, field)
    if result < 1:
        raise BridgeProtocolError(f"drain response {field} must be positive")
    return result


def _parse_ranges(value: Any) -> tuple[DroppedSequenceRange, ...]:
    if not isinstance(value, list):
        raise BridgeProtocolError("drain response droppedRanges must be an array")
    ranges: list[DroppedSequenceRange] = []
    previous_last = 0
    for index, item in enumerate(value):
        if not isinstance(item, Mapping):
            raise BridgeProtocolError(f"droppedRanges[{index}] must be an object")
        first = _positive_integer(item.get("firstSequence"), "dropped range firstSequence")
        last = _positive_integer(item.get("lastSequence"), "dropped range lastSequence")
        count = _positive_integer(item.get("count"), "dropped range count")
        if last < first or count != last - first + 1:
            raise BridgeProtocolError(f"droppedRanges[{index}] has inconsistent bounds/count")
        if first <= previous_last:
            raise BridgeProtocolError("droppedRanges must be strictly ordered and nonoverlapping")
        ranges.append(DroppedSequenceRange(first, last, count))
        previous_last = last
    return tuple(ranges)


def _content_identity(
    payload: Mapping[str, Any], event_type: str
) -> tuple[str, int, str, str, str] | None:
    if event_type == "dma-complete":
        phase = payload.get("capturePhase")
        encoding = payload.get("destinationBytesEncoding")
        size = payload.get("destinationByteLength")
        field = "destinationBytesHex"
        expected_phase = "post-transfer-callback"
    elif event_type == "trace-page":
        phase = payload.get("capturePhase")
        encoding = payload.get("codeBytesEncoding")
        size = payload.get("codeByteLength")
        field = "codeBytesHex"
        expected_phase = "pre-execution-callback"
    else:
        return None
    encoded = payload.get(field)
    if phase != expected_phase or encoding != "hex-uppercase":
        raise BridgeProtocolError(f"{event_type} lacks exact byte-capture provenance")
    if isinstance(size, bool) or not isinstance(size, int) or size < 1:
        raise BridgeProtocolError(f"{event_type} byte length must be positive")
    if not isinstance(encoded, str) or len(encoded) != size * 2:
        raise BridgeProtocolError(f"{event_type} exact-byte field length mismatch")
    if encoded != encoded.upper() or any(
        character not in "0123456789ABCDEF" for character in encoded
    ):
        raise BridgeProtocolError(
            f"{event_type} exact-byte field is not canonical uppercase hex"
        )
    content = bytes.fromhex(encoded)
    return hashlib.sha256(content).hexdigest().upper(), size, encoding, phase, field


def _frontier_identity(payload: Mapping[str, Any], event_type: str) -> str:
    if payload.get("frontierFormatVersion") != FRONTIER_FORMAT_VERSION:
        raise BridgeProtocolError(f"{event_type} has an incompatible novelty frontier format")
    identity = payload.get("frontierIdentity")
    if (
        not isinstance(identity, str)
        or not identity
        or len(identity) > 192
        or any(character.isspace() or ord(character) < 0x21 for character in identity)
    ):
        raise BridgeProtocolError(f"{event_type} omitted its opaque novelty frontier identity")
    return identity


def _trace_placement(payload: Mapping[str, Any], event_type: str) -> tuple[int, int]:
    physical = payload.get("physicalAddress")
    try:
        physical_value = int(str(physical), 0)
    except (TypeError, ValueError) as exc:
        raise BridgeProtocolError(f"{event_type} omitted its physical placement") from exc
    generation = payload.get("pageGeneration")
    if (
        physical_value & 0xFFF
        or not 0 <= physical_value <= RDRAM_SIZE - 0x1000
        or isinstance(generation, bool)
        or not isinstance(generation, int)
        or generation < 0
    ):
        raise BridgeProtocolError(f"{event_type} has an invalid placement/generation")
    return physical_value, generation


def _validate_frontier_match(payload: Mapping[str, Any], event_type: str) -> None:
    matched = payload.get("frontierMatch")
    page_id = payload.get("frontierPageId")
    if not isinstance(matched, bool):
        raise BridgeProtocolError(f"{event_type} omitted its exact frontier match decision")
    if matched:
        if isinstance(page_id, bool) or not isinstance(page_id, int) or page_id < 1:
            raise BridgeProtocolError(f"{event_type} frontier match omitted its exact page ID")
    elif page_id is not None:
        raise BridgeProtocolError(f"{event_type} unmatched frontier page ID must be null")


def _validate_activity_bitmap(payload: Mapping[str, Any], prefix: str) -> None:
    maximum = payload.get(f"{prefix}MaxOrdinal")
    count = payload.get(f"{prefix}HitCount")
    encoding = payload.get(f"{prefix}HitBitmapEncoding")
    encoded = payload.get(f"{prefix}HitBitmapHex")
    if (
        isinstance(maximum, bool)
        or not isinstance(maximum, int)
        or maximum < 0
        or maximum > 0x1000000
        or isinstance(count, bool)
        or not isinstance(count, int)
        or not 0 <= count <= maximum
        or encoding != "ordinal-minus-one-lsb0-hex-uppercase"
        or not isinstance(encoded, str)
        or len(encoded) != ((maximum + 7) // 8) * 2
        or encoded != encoded.upper()
        or any(character not in "0123456789ABCDEF" for character in encoded)
    ):
        raise BridgeProtocolError(f"known activity {prefix} bitmap is malformed")
    bitmap = bytes.fromhex(encoded)
    if sum(byte.bit_count() for byte in bitmap) != count:
        raise BridgeProtocolError(f"known activity {prefix} hit count is inconsistent")
    if maximum & 7 and bitmap and bitmap[-1] & ~((1 << (maximum & 7)) - 1):
        raise BridgeProtocolError(f"known activity {prefix} bitmap has set padding bits")


def _validate_trace_or_input_event(payload: Mapping[str, Any], event_type: str) -> None:
    if event_type == "trace-page":
        if payload.get("dedupeDecision") != "exact-byte-compare":
            raise BridgeProtocolError("trace page lacks an exact-byte dedupe decision")
        _frontier_identity(payload, event_type)
        _trace_placement(payload, event_type)
        _validate_frontier_match(payload, event_type)
        content_id = payload.get("codePageContentId")
        if isinstance(content_id, bool) or not isinstance(content_id, int) or content_id < 1:
            raise BridgeProtocolError("trace page omitted its exact page-content ID")
    elif event_type == "trace-generation":
        if payload.get("dedupeDecision") != "generation-distinct-exact-content":
            raise BridgeProtocolError("trace generation lacks an exact generation decision")
        if payload.get("exactContentResolved") is not True:
            raise BridgeProtocolError("trace generation is not tied to exact page content")
        _frontier_identity(payload, event_type)
        _, generation = _trace_placement(payload, event_type)
        _validate_frontier_match(payload, event_type)
        content_id = payload.get("codePageContentId")
        previous = payload.get("previousPageGeneration")
        if (
            isinstance(content_id, bool)
            or not isinstance(content_id, int)
            or content_id < 1
            or isinstance(previous, bool)
            or not isinstance(previous, int)
            or previous < 0
            or previous == generation
        ):
            raise BridgeProtocolError("trace generation has invalid exact identity fields")
    elif event_type == "exec-coverage":
        if payload.get("dedupeDecision") != "physical-address-and-exact-opcode":
            raise BridgeProtocolError("execution coverage lacks its exact dedupe decision")
        _frontier_identity(payload, event_type)
        if not isinstance(payload.get("newInstruction"), bool) or not isinstance(
            payload.get("newEdge"), bool
        ):
            raise BridgeProtocolError("execution coverage novelty flags must be booleans")
        if payload.get("newInstruction") is not True and payload.get("newEdge") is not True:
            raise BridgeProtocolError("execution coverage contains no new exact identity")
        if payload.get("noveltyDecision") not in {
            "new-instruction-and-edge",
            "new-instruction",
            "new-edge",
            "unresolved-edge-fallback",
            "unresolved-instruction-fallback",
        }:
            raise BridgeProtocolError("execution coverage omitted its exact novelty decision")
        resolved = payload.get("exactInstructionResolved")
        generation_resolved = payload.get("generationResolved")
        if not isinstance(resolved, bool) or not isinstance(generation_resolved, bool):
            raise BridgeProtocolError("execution coverage omitted its resolution flags")
        try:
            pc_value = int(str(payload.get("pc")), 0)
            opcode_value = int(str(payload.get("opcode")), 0)
        except (TypeError, ValueError) as exc:
            raise BridgeProtocolError("execution coverage omitted its PC/opcode") from exc
        generation = payload.get("pageGeneration")
        page_offset = payload.get("pageOffset")
        if (
            isinstance(page_offset, bool)
            or not isinstance(page_offset, int)
            or page_offset != (pc_value & 0xFFF)
            or page_offset & 3
            or not 0 <= opcode_value <= 0xFFFFFFFF
        ):
            raise BridgeProtocolError("execution coverage has an invalid PC/opcode")
        if resolved:
            try:
                physical_page = int(str(payload.get("physicalPageAddress")), 0)
                physical_address = int(str(payload.get("physicalAddress")), 0)
            except (TypeError, ValueError) as exc:
                raise BridgeProtocolError(
                    "resolved execution coverage omitted physical placement"
                ) from exc
            if (
                physical_page & 0xFFF
                or not 0 <= physical_page <= RDRAM_SIZE - 0x1000
                or physical_address != physical_page + page_offset
                or not generation_resolved
                or isinstance(generation, bool)
                or not isinstance(generation, int)
                or generation < 0
            ):
                raise BridgeProtocolError(
                    "resolved execution coverage has invalid placement/generation"
                )
        elif payload.get("noveltyDecision") not in {
            "unresolved-edge-fallback",
            "unresolved-instruction-fallback",
        }:
            raise BridgeProtocolError("unresolved execution fact was not captured conservatively")
        previous = payload.get("previous")
        if payload.get("newEdge") is True:
            if not isinstance(previous, Mapping):
                raise BridgeProtocolError("new execution edge omitted its predecessor")
            previous_resolved = previous.get("exactInstructionResolved")
            if not isinstance(previous_resolved, bool):
                raise BridgeProtocolError(
                    "execution predecessor omitted exact-instruction status"
                )
            if (
                payload.get("noveltyDecision") == "unresolved-edge-fallback"
                and previous_resolved
                and resolved
            ):
                raise BridgeProtocolError("unresolved edge claims two exact endpoints")
            if (
                payload.get("noveltyDecision") != "unresolved-edge-fallback"
                and (not previous_resolved or not resolved)
            ):
                raise BridgeProtocolError("exact edge has an unresolved endpoint")
    elif event_type == "controller-input":
        if payload.get("controller") != 0:
            raise BridgeProtocolError("controller capture currently requires effective P1 input")
        if payload.get("capturePhase") != "post-controller-read-and-bridge-injection":
            raise BridgeProtocolError("controller input lacks effective-input provenance")
        state = payload.get("state")
        if not isinstance(state, str):
            raise BridgeProtocolError("controller input omitted its exact state word")
    elif event_type == "baseline-snapshot":
        if (
            payload.get("capturePhase") != "pre-execution-native-rdram-snapshot"
            or payload.get("ordering") != "native-copy-before-first-captured-instruction"
            or payload.get("rdramSize") != RDRAM_SIZE
            or payload.get("byteLength") != RDRAM_SIZE
            or not isinstance(payload.get("snapshotId"), str)
            or not payload.get("snapshotId")
        ):
            raise BridgeProtocolError("baseline snapshot lacks its atomic 4 MiB contract")
    elif event_type == "known-activity":
        _frontier_identity(payload, event_type)
        if (
            payload.get("capturePhase") != "session-stop-native-hit-bitmap"
            or payload.get("orderingClaim") != "session-membership-only-not-event-order"
        ):
            raise BridgeProtocolError("known activity summary overstates its ordering evidence")
        for prefix in ("instruction", "edge", "dma"):
            _validate_activity_bitmap(payload, prefix)
    elif event_type == "marker-execution-context":
        marker_id = payload.get("markerId")
        session_id = payload.get("markerSessionId")
        before = payload.get("beforeCount")
        after = payload.get("afterCount")
        records = payload.get("records")
        if (
            isinstance(marker_id, bool)
            or not isinstance(marker_id, int)
            or marker_id < 1
            or not isinstance(session_id, str)
            or not session_id
            or len(session_id) > 192
            or any(character.isspace() or ord(character) < 0x21 for character in session_id)
            or isinstance(before, bool)
            or not isinstance(before, int)
            or not 0 <= before <= 4096
            or isinstance(after, bool)
            or not isinstance(after, int)
            or not 1 <= after <= 4096
            or not isinstance(records, list)
            or len(records) != before + after
            or payload.get("capturePhase") != "native-bounded-marker-window"
            or payload.get("orderingClaim")
            != "native-local-order-and-frame-context-only"
        ):
            raise BridgeProtocolError("marker execution context has invalid bounds or identity")
        orders: list[int] = []
        for index, record in enumerate(records):
            if not isinstance(record, Mapping):
                raise BridgeProtocolError("marker execution context record is not an object")
            order = record.get("localOrder")
            frame = record.get("frame")
            if (
                isinstance(order, bool)
                or not isinstance(order, int)
                or order < 1
                or (frame is not None and (
                    isinstance(frame, bool) or not isinstance(frame, int) or frame < 0
                ))
                or record.get("side") != ("before" if index < before else "after")
                or not isinstance(record.get("previousValid"), bool)
            ):
                raise BridgeProtocolError("marker execution context record metadata is invalid")
            orders.append(order)
            for field in ("pc", "opcode", "previousPc", "previousOpcode"):
                try:
                    value = int(str(record.get(field)), 0)
                except (TypeError, ValueError) as exc:
                    raise BridgeProtocolError(
                        f"marker execution context record omitted {field}"
                    ) from exc
                if not 0 <= value <= 0xFFFFFFFF:
                    raise BridgeProtocolError(
                        f"marker execution context record has invalid {field}"
                    )
            for field in ("physicalAddress", "previousPhysicalAddress"):
                raw = record.get(field)
                if raw is None:
                    continue
                try:
                    physical = int(str(raw), 0)
                except (TypeError, ValueError) as exc:
                    raise BridgeProtocolError(
                        f"marker execution context record has invalid {field}"
                    ) from exc
                if physical & 3 or not 0 <= physical <= RDRAM_SIZE - 4:
                    raise BridgeProtocolError(
                        f"marker execution context record has invalid {field}"
                    )
        if orders != list(range(orders[0], orders[0] + len(orders))):
            raise BridgeProtocolError("marker execution context local order is discontinuous")
    elif event_type == "marker-execution-context-incomplete":
        if (
            payload.get("capturePhase")
            != "capture-stopped-before-native-window-completed"
            or payload.get("orderingClaim") != "no-execution-context-claim"
        ):
            raise BridgeProtocolError("incomplete marker context overstates its evidence")


def _validate_dma_event(payload: Mapping[str, Any], event_type: str, sequence: int) -> None:
    if event_type not in {"dma-start", "dma-complete", "dma-unresolved"}:
        return
    requested = payload.get("requestedLength")
    if isinstance(requested, bool) or not isinstance(requested, int) or requested < 1:
        raise BridgeProtocolError(f"{event_type} requestedLength must be positive")
    if payload.get("sourceDomain") != "cartridge-rom":
        raise BridgeProtocolError(f"{event_type} is outside the cartridge-ROM loader scope")
    if event_type == "dma-start":
        if payload.get("capturePhase") != "pre-transfer-callback":
            raise BridgeProtocolError("DMA start lacks pre-transfer callback provenance")
        return
    start_sequence = payload.get("dmaStartSequence")
    pairing = payload.get("pairingStatus")
    if pairing == "native-completion-only":
        if start_sequence is not None:
            raise BridgeProtocolError("native DMA completion unexpectedly names a start event")
    elif (
        pairing != "matched"
        or isinstance(start_sequence, bool)
        or not isinstance(start_sequence, int)
        or start_sequence < 1
        or start_sequence >= sequence
    ):
        raise BridgeProtocolError("DMA completion has an invalid pairing contract")
    if event_type == "dma-unresolved":
        if payload.get("exactDestinationResolved") is not False:
            raise BridgeProtocolError("unresolved DMA event lacks its conservative fallback flag")
        return
    transfer_span = payload.get("transferSpanLength")
    destination_size = payload.get("destinationByteLength")
    if (
        isinstance(transfer_span, bool)
        or not isinstance(transfer_span, int)
        or transfer_span != destination_size
    ):
        raise BridgeProtocolError("DMA completion transfer span is inconsistent")


def _preserve_event(value: Any, envelope_epoch: str) -> PreservedBridgeEvent:
    if not isinstance(value, Mapping):
        raise BridgeProtocolError("unified drain event must be an object")
    payload = dict(value)
    epoch = payload.get("bridgeEpoch")
    if epoch != envelope_epoch:
        raise BridgeProtocolError("event bridgeEpoch disagrees with its drain envelope")
    sequence = _positive_integer(payload.get("bridgeSequence"), "event bridgeSequence")
    stream = payload.get("bridgeStream")
    if stream not in BRIDGE_STREAMS:
        raise BridgeProtocolError(f"event bridgeStream is invalid: {stream!r}")
    kind = payload.get("kind")
    event_type = kind if isinstance(kind, str) and kind else "unknown-bridge-event"
    frame = payload.get("frameCount")
    status = "accepted"
    if frame is not None and (
        isinstance(frame, bool) or not isinstance(frame, int) or frame < 0
    ):
        frame = None
        status = "malformed"
    if not isinstance(kind, str) or not kind:
        status = "malformed"
    content = _content_identity(payload, event_type)
    _validate_dma_event(payload, event_type, sequence)
    _validate_trace_or_input_event(payload, event_type)
    return PreservedBridgeEvent(
        payload=payload,
        event_type=event_type,
        frame_number=frame,
        ingestion_status=status,
        bridge_epoch=envelope_epoch,
        bridge_sequence=sequence,
        bridge_stream=str(stream),
        event_time_content_sha256=content[0] if content else None,
        event_time_content_size=content[1] if content else None,
        event_time_content_encoding=content[2] if content else None,
        event_time_content_phase=content[3] if content else None,
        event_time_content_field=content[4] if content else None,
    )


def parse_drain_response(response: Mapping[str, Any]) -> DrainBatch:
    """Validate the accepted bridge's unified ordered drain envelope."""

    if response.get("queueModel") != "unified":
        raise BridgeProtocolError("drain response did not declare the unified queue model")
    epoch = response.get("bridgeEpoch")
    if not isinstance(epoch, str) or not epoch:
        raise BridgeProtocolError("drain response omitted bridgeEpoch")
    events = response.get("events")
    if not isinstance(events, list):
        raise BridgeProtocolError("drain response omitted an events array")
    count = _nonnegative_integer(response.get("count"), "count")
    remaining = _nonnegative_integer(response.get("remaining"), "remaining")
    dropped = _nonnegative_integer(response.get("dropped"), "dropped")
    next_sequence = _positive_integer(response.get("nextEventSequence"), "nextEventSequence")
    if count != len(events):
        raise BridgeProtocolError(
            f"drain count {count} does not match {len(events)} returned event(s)"
        )
    ranges = _parse_ranges(response.get("droppedRanges"))
    if sum(item.count for item in ranges) != dropped:
        raise BridgeProtocolError("aggregate dropped count disagrees with droppedRanges")
    if ranges and ranges[-1].last_sequence >= next_sequence:
        raise BridgeProtocolError("dropped range is not below nextEventSequence")
    preserved = tuple(_preserve_event(event, epoch) for event in events)
    sequences = [event.bridge_sequence for event in preserved]
    if sequences != sorted(sequences) or len(sequences) != len(set(sequences)):
        raise BridgeProtocolError("unified drain events are not strictly ordered")
    if sequences and sequences[-1] >= next_sequence:
        raise BridgeProtocolError("drained event sequence is not below nextEventSequence")
    for sequence in sequences:
        if any(item.first_sequence <= sequence <= item.last_sequence for item in ranges):
            raise BridgeProtocolError("one bridge sequence is both drained and reported dropped")
    return DrainBatch(
        bridge_epoch=epoch,
        events=preserved,
        remaining=remaining,
        dropped=dropped,
        dropped_ranges=ranges,
        next_event_sequence=next_sequence,
    )
