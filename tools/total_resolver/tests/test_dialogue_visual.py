from __future__ import annotations

import json
import hashlib
from pathlib import Path
import sqlite3
import struct
import tempfile
import unittest
import zlib

from tools.total_resolver.dialogue_visual import (
    visual_capture_config, verify_dialogue_visual,
)


def _png(red: int, *, filter_byte: int = 0, compressed: bytes | None = None) -> bytes:
    def chunk(kind: bytes, content: bytes) -> bytes:
        return (struct.pack(">I", len(content)) + kind + content
                + struct.pack(">I", zlib.crc32(kind + content) & 0xFFFFFFFF))

    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", 1, 1, 8, 6, 0, 0, 0))
            + chunk(b"IDAT", compressed if compressed is not None else
                    zlib.compress(bytes((filter_byte, red, 0, 0, 255))))
            + chunk(b"IEND", b""))


class DialogueVisualTests(unittest.TestCase):
    def test_images_and_trigger_bind_to_consecutive_vi_events(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            visual = root / "dialogue-visual"
            visual.mkdir()
            db = sqlite3.connect(root / "capture.sqlite")
            db.executescript("""
                CREATE TABLE session(session_id TEXT,closure_status TEXT,
                    bridge_epoch TEXT,static_sources_json TEXT);
                CREATE TABLE event_sequence(bridge_event_sequence INTEGER,
                    bridge_event_type TEXT,raw_payload_json TEXT);
            """)
            config = visual_capture_config()
            db.execute("INSERT INTO session VALUES(?,?,?,?)", (
                "TEST", "closed", "EPOCH",
                json.dumps({"captureProfile": {"dialogueVisual": config}}),
            ))
            frames = []
            for ordinal, frame in enumerate(range(8, 17), 1):
                sequence = ordinal if ordinal <= 3 else ordinal + 1
                image_sequence = ordinal + 20
                filename = f"frame-{ordinal:06d}.png"
                png = _png(ordinal)
                digest = hashlib.sha256(png).hexdigest().upper()
                (visual / filename).write_bytes(png)
                frames.append({
                    "ordinal": ordinal, "frameCount": frame,
                    "bridgeSequence": sequence, "callbackId": 7,
                    "file": filename, "width": 1, "height": 1,
                    "imageEventSequence": image_sequence,
                    "pngSha256": digest,
                })
                db.execute("INSERT INTO event_sequence VALUES(?,?,?)", (
                    sequence, "visual-frame", json.dumps({
                        "visualOrdinal": ordinal, "frameCount": frame,
                        "callbackId": 7,
                        "pixelSource": "VI-origin-RDRAM-after-UpdateScreen",
                    }),
                ))
                db.execute("INSERT INTO event_sequence VALUES(?,?,?)", (
                    image_sequence, "visual-image-saved", json.dumps({
                        "visualOrdinal": ordinal, "visualFrameSequence": sequence,
                        "frameCount": frame, "callbackId": 7,
                        "file": filename, "pngSha256": digest,
                    }),
                ))
            db.execute("INSERT INTO event_sequence VALUES(?,?,?)", (
                4, "focused-exec", json.dumps({
                    "focusedTargetId": "dialogue-draw-callback",
                    "focusedRole": "entry", "focusedProfileId": config["profileId"],
                    "focusedInvocationId": "draw:1", "frameCount": 10,
                    "regs": {"a0": "0x00000002"},
                }),
            ))
            db.commit()
            db.close()
            manifest = {
                "schemaVersion": 1, "bridgeEpoch": "EPOCH",
                "profileId": config["profileId"], "enabled": False,
                "hookRegistered": False, "callbackId": 7,
                "stopReason": "requested", "failures": [],
                "pixelSource": "VI-origin-RDRAM-after-UpdateScreen",
                "beforeFrames": 2, "afterFrames": 6,
                "maxTriggers": 40, "maxImages": 360,
                "frames": frames,
                "triggers": [{
                    "ordinal": 1, "targetId": "dialogue-draw-callback",
                    "slot": "0x00000002", "kind": "draw", "frameCount": 10,
                    "bridgeSequence": 4, "invocationId": "draw:1",
                    "firstFrameCount": 8, "lastFrameCount": 16,
                }],
            }
            (visual / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
            result = verify_dialogue_visual(root)
            self.assertEqual((result["triggerCount"], result["imageCount"]), (1, 9))

            manifest["triggers"].append({**manifest["triggers"][0], "ordinal": 2})
            (visual / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "unique bridge order"):
                verify_dialogue_visual(root)
            manifest["triggers"].pop()
            (visual / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")

            (visual / frames[3]["file"]).write_bytes(b"only a hash, not an image")
            with self.assertRaisesRegex(ValueError, "PNG"):
                verify_dialogue_visual(root)

            (visual / frames[3]["file"]).write_bytes(_png(99))
            with self.assertRaisesRegex(ValueError, "PNG bytes"):
                verify_dialogue_visual(root)

            (visual / frames[3]["file"]).write_bytes(_png(4, filter_byte=5))
            with self.assertRaisesRegex(ValueError, "scanline filter"):
                verify_dialogue_visual(root)

            (visual / frames[3]["file"]).write_bytes(_png(4, compressed=b"broken"))
            with self.assertRaisesRegex(ValueError, "cannot be decoded"):
                verify_dialogue_visual(root)


if __name__ == "__main__":
    unittest.main()
