"""Bounded, opt-in VI framebuffer evidence for full Cutscene Studio capture."""

from __future__ import annotations

import json
import hashlib
from pathlib import Path
import re
import struct
from typing import Any
import zlib

from .capture_db import load_event_payload
from .focused_capture import CUTSCENE_STUDIO_PROFILE_ID
from .schema import open_capture_database


BEFORE_FRAMES = 2
AFTER_FRAMES = 6
MAX_TRIGGERS = 40
MAX_IMAGES = 360
DIRECTORY_NAME = "dialogue-visual"


def visual_capture_config() -> dict[str, Any]:
    return {
        "schema": "ob64-total-resolver-dialogue-visual.v1",
        "profileId": CUTSCENE_STUDIO_PROFILE_ID,
        "beforeFrames": BEFORE_FRAMES,
        "afterFrames": AFTER_FRAMES,
        "maxTriggers": MAX_TRIGGERS,
        "maxImages": MAX_IMAGES,
        "directory": DIRECTORY_NAME,
        "source": "VI-origin-RDRAM-after-graphics-update",
        "selection": "first-observed-draw-entry-per-slot-lifetime-and-release-entry",
    }


def visual_capture_directory(session_directory: Path) -> Path:
    return session_directory / DIRECTORY_NAME


def _integer(value: Any, label: str, *, minimum: int = 0) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value < minimum:
        raise ValueError(f"visual {label} is invalid")
    return value


def _png_identity(path: Path) -> tuple[int, int, str]:
    data = path.read_bytes()
    if len(data) > 4_000_000 or not data.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError(f"visual PNG is missing or invalid: {path.name}")
    offset = 8
    width = height = None
    image_parts: list[bytes] = []
    ended = False
    while offset + 12 <= len(data):
        size = struct.unpack_from(">I", data, offset)[0]
        kind = data[offset + 4 : offset + 8]
        end = offset + 12 + size
        if size > 4_000_000 or end > len(data):
            raise ValueError(f"visual PNG chunk is truncated: {path.name}")
        content = data[offset + 8 : offset + 8 + size]
        crc = struct.unpack_from(">I", data, offset + 8 + size)[0]
        if zlib.crc32(kind + content) & 0xFFFFFFFF != crc:
            raise ValueError(f"visual PNG chunk CRC differs: {path.name}")
        if kind == b"IHDR":
            if width is not None or size != 13:
                raise ValueError(f"visual PNG header is malformed: {path.name}")
            width, height, depth, color, compression, filtering, interlace = struct.unpack(
                ">IIBBBBB", content,
            )
            if (
                not 1 <= width <= 640 or not 1 <= height <= 480
                or (depth, color, compression, filtering, interlace) != (8, 6, 0, 0, 0)
            ):
                raise ValueError(f"visual PNG geometry or format is unsupported: {path.name}")
        elif kind == b"IDAT":
            image_parts.append(content)
        elif kind == b"IEND":
            if size != 0 or end != len(data):
                raise ValueError(f"visual PNG ending is malformed: {path.name}")
            ended = True
            break
        offset = end
    if width is None or height is None or not image_parts or not ended:
        raise ValueError(f"visual PNG lacks image content: {path.name}")
    expected = height * (1 + width * 4)
    decoder = zlib.decompressobj()
    try:
        raw = decoder.decompress(b"".join(image_parts), expected + 1)
    except zlib.error as exc:
        raise ValueError(f"visual PNG pixel data cannot be decoded: {path.name}") from exc
    if len(raw) != expected or not decoder.eof or decoder.unconsumed_tail or decoder.unused_data:
        raise ValueError(f"visual PNG pixel data is incomplete: {path.name}")
    stride = 1 + width * 4
    if any(raw[row * stride] > 4 for row in range(height)):
        raise ValueError(f"visual PNG scanline filter is invalid: {path.name}")
    return width, height, hashlib.sha256(data).hexdigest().upper()


def verify_dialogue_visual(session_directory: Path) -> dict[str, Any]:
    """Bind saved PNGs and trigger windows to one unchanged raw capture."""

    directory = session_directory.resolve()
    manifest_path = visual_capture_directory(directory) / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(manifest, dict) or manifest.get("schemaVersion") != 1:
        raise ValueError("visual manifest schema is invalid")
    if manifest.get("failures") != [] or manifest.get("enabled") is not False:
        raise ValueError("visual capture has failures or has not stopped")
    if manifest.get("hookRegistered") is not False:
        raise ValueError("visual graphics hook was not removed")
    if manifest.get("stopReason") not in {
        "requested", "capture-stop", "trigger-limit-complete",
    }:
        raise ValueError("visual capture stopped before its requested window completed")
    if manifest.get("pixelSource") != "VI-origin-RDRAM-after-UpdateScreen":
        raise ValueError("visual pixel source is unrecognized")

    connection = open_capture_database(directory / "capture.sqlite", read_only=True)
    connection.execute("PRAGMA query_only = ON")
    try:
        session = connection.execute("SELECT * FROM session").fetchone()
        if session is None or session["closure_status"] != "closed":
            raise ValueError("visual capture session is not closed")
        static = json.loads(str(session["static_sources_json"]))
        configured = static.get("captureProfile", {}).get("dialogueVisual")
        if configured != visual_capture_config():
            raise ValueError("visual manifest has no matching frozen session configuration")
        if manifest.get("profileId") != configured["profileId"] or manifest.get("bridgeEpoch") != session["bridge_epoch"]:
            raise ValueError("visual manifest profile or bridge epoch differs from the capture")
        for field, key in (("beforeFrames", "beforeFrames"), ("afterFrames", "afterFrames"),
                           ("maxTriggers", "maxTriggers"), ("maxImages", "maxImages")):
            if manifest.get(field) != configured[key]:
                raise ValueError(f"visual manifest {field} differs from the frozen setting")
        callback = _integer(manifest.get("callbackId"), "callback ID")
        frame_events: dict[int, tuple[int, int]] = {}
        image_events: dict[int, tuple[int, dict[str, Any]]] = {}
        last_frame = -1
        for row in connection.execute(
            "SELECT bridge_event_sequence,raw_payload_json FROM event_sequence "
            "WHERE bridge_event_type='visual-frame' ORDER BY bridge_event_sequence"
        ):
            payload = load_event_payload(connection, str(row["raw_payload_json"]))
            ordinal = _integer(payload.get("visualOrdinal"), "frame ordinal", minimum=1)
            frame = _integer(payload.get("frameCount"), "VI count")
            sequence = _integer(row["bridge_event_sequence"], "frame bridge sequence", minimum=1)
            if (
                ordinal != len(frame_events) + 1 or frame != last_frame + 1 and last_frame >= 0
                or payload.get("callbackId") != callback
                or payload.get("pixelSource") != manifest["pixelSource"]
            ):
                raise ValueError("visual frame event order or source is inconsistent")
            frame_events[ordinal] = (frame, sequence)
            last_frame = frame
        for row in connection.execute(
            "SELECT bridge_event_sequence,raw_payload_json FROM event_sequence "
            "WHERE bridge_event_type='visual-image-saved' ORDER BY bridge_event_sequence"
        ):
            payload = load_event_payload(connection, str(row["raw_payload_json"]))
            ordinal = _integer(payload.get("visualOrdinal"), "image event ordinal", minimum=1)
            if ordinal in image_events:
                raise ValueError("visual image has duplicate ordered events")
            image_events[ordinal] = (int(row["bridge_event_sequence"]), payload)
        frames = manifest.get("frames")
        triggers = manifest.get("triggers")
        if not isinstance(frames, list) or not isinstance(triggers, list):
            raise ValueError("visual frames or triggers are missing")
        if not frames or not triggers:
            raise ValueError("visual capture contains no dialogue image window")
        if len(frames) > MAX_IMAGES or len(triggers) > MAX_TRIGGERS:
            raise ValueError("visual image or trigger limit was exceeded")
        if len(image_events) != len(frames):
            raise ValueError("visual image event count differs from saved images")
        saved_by_frame: dict[int, int] = {}
        saved_ordinals: set[int] = set()
        for frame_record in frames:
            if not isinstance(frame_record, dict):
                raise ValueError("visual frame record is malformed")
            ordinal = _integer(frame_record.get("ordinal"), "saved ordinal", minimum=1)
            frame = _integer(frame_record.get("frameCount"), "saved VI count")
            sequence = _integer(frame_record.get("bridgeSequence"), "saved bridge sequence", minimum=1)
            filename = frame_record.get("file")
            image_event = image_events.get(ordinal)
            if (
                ordinal in saved_ordinals or frame in saved_by_frame
                or frame_events.get(ordinal) != (frame, sequence)
                or frame_record.get("callbackId") != callback
                or not isinstance(filename, str)
                or not re.fullmatch(r"frame-[0-9]{6}\.png", filename)
                or filename != f"frame-{ordinal:06d}.png"
                or image_event is None
                or frame_record.get("imageEventSequence") != image_event[0]
                or image_event[0] <= sequence
                or image_event[1].get("visualFrameSequence") != sequence
                or image_event[1].get("frameCount") != frame
                or image_event[1].get("callbackId") != callback
                or image_event[1].get("file") != filename
                or image_event[1].get("pngSha256") != frame_record.get("pngSha256")
            ):
                raise ValueError("saved visual frame disagrees with its ordered event")
            png_path = visual_capture_directory(directory) / filename
            if _png_identity(png_path) != (
                _integer(frame_record.get("width"), "width", minimum=1),
                _integer(frame_record.get("height"), "height", minimum=1),
                frame_record.get("pngSha256"),
            ):
                raise ValueError("visual PNG bytes disagree with the ordered image event")
            saved_by_frame[frame] = sequence
            saved_ordinals.add(ordinal)
        last_trigger_sequence = 0
        for index, trigger in enumerate(triggers, 1):
            if not isinstance(trigger, dict) or trigger.get("ordinal") != index:
                raise ValueError("visual trigger ordinal is invalid")
            kind = trigger.get("kind")
            target = (
                "dialogue-draw-callback" if kind == "draw" else
                "dialogue-release-callback" if kind == "release" else None
            )
            sequence = _integer(trigger.get("bridgeSequence"), "trigger sequence", minimum=1)
            if sequence <= last_trigger_sequence:
                raise ValueError("visual triggers are not in unique bridge order")
            row = connection.execute(
                "SELECT raw_payload_json FROM event_sequence WHERE bridge_event_sequence=? "
                "AND bridge_event_type='focused-exec'", (sequence,),
            ).fetchone()
            if row is None:
                raise ValueError("visual trigger has no focused callback event")
            event = load_event_payload(connection, str(row[0]))
            frame = _integer(trigger.get("frameCount"), "trigger VI count")
            first = _integer(trigger.get("firstFrameCount"), "first VI count")
            last = _integer(trigger.get("lastFrameCount"), "last VI count")
            if (
                target is None or trigger.get("targetId") != target
                or event.get("focusedTargetId") != target
                or event.get("focusedRole") != "entry"
                or event.get("focusedProfileId") != configured["profileId"]
                or event.get("focusedInvocationId") != trigger.get("invocationId")
                or event.get("frameCount") != frame
                or str(event.get("regs", {}).get("a0")) != trigger.get("slot")
                or first != frame - BEFORE_FRAMES or last != frame + AFTER_FRAMES
                or any(vi not in saved_by_frame for vi in range(first, last + 1))
            ):
                raise ValueError("visual trigger or its consecutive PNG window is inconsistent")
            last_trigger_sequence = sequence
        return {
            "result": "PASS", "sessionId": str(session["session_id"]),
            "profileId": configured["profileId"], "triggerCount": len(triggers),
            "imageCount": len(frames), "observedViFrames": len(frame_events),
            "firstSavedViFrame": min(saved_by_frame) if saved_by_frame else None,
            "lastSavedViFrame": max(saved_by_frame) if saved_by_frame else None,
            "pixelSource": manifest["pixelSource"],
        }
    finally:
        connection.close()
