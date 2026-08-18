"""Strict preservation-oriented normalization of unified bridge drains."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
from typing import Any, Mapping

from .protocol import BridgeProtocolError


BRIDGE_STREAMS = frozenset({"watch", "dma"})


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
) -> tuple[str, int, str, str] | None:
    if event_type != "dma-complete":
        return None
    phase = payload.get("capturePhase")
    encoding = payload.get("destinationBytesEncoding")
    size = payload.get("destinationByteLength")
    encoded = payload.get("destinationBytesHex")
    if phase != "post-transfer-callback" or encoding != "hex-uppercase":
        raise BridgeProtocolError("DMA completion lacks post-transfer byte-capture provenance")
    if isinstance(size, bool) or not isinstance(size, int) or size < 1:
        raise BridgeProtocolError("DMA completion destinationByteLength must be positive")
    if not isinstance(encoded, str) or len(encoded) != size * 2:
        raise BridgeProtocolError("DMA completion destinationBytesHex length mismatch")
    if encoded != encoded.upper() or any(
        character not in "0123456789ABCDEF" for character in encoded
    ):
        raise BridgeProtocolError(
            "DMA completion destinationBytesHex is not canonical uppercase hex"
        )
    content = bytes.fromhex(encoded)
    return hashlib.sha256(content).hexdigest().upper(), size, encoding, phase


def _validate_dma_event(payload: Mapping[str, Any], event_type: str, sequence: int) -> None:
    if event_type not in {"dma-start", "dma-complete"}:
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
    if (
        isinstance(start_sequence, bool)
        or not isinstance(start_sequence, int)
        or start_sequence < 1
        or start_sequence >= sequence
    ):
        raise BridgeProtocolError("DMA completion has an invalid dmaStartSequence")
    if payload.get("pairingStatus") != "matched":
        raise BridgeProtocolError("DMA completion does not match its start descriptor")
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
    )


def parse_drain_response(response: Mapping[str, Any]) -> DrainBatch:
    """Validate bridge 0.7.2's unified ordered drain envelope."""

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
