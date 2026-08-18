from __future__ import annotations

import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from tools.total_resolver.capture_db import (
    CaptureStore,
    RawEventInput,
    SessionMetadata,
    content_deduplication_stats,
    load_event_payload,
)


def metadata() -> SessionMetadata:
    return SessionMetadata(
        session_id="S-DEDUP",
        started_utc="2026-08-18T00:00:00.000Z",
        tool_version="0.1.0",
        tool_git_commit=None,
        decomp_git_commit="A" * 40,
        decomp_dirty=True,
        project64_branch="ob64-core",
        project64_git_commit="B" * 40,
        bridge_version="0.8.0",
        bridge_port=64640,
        bridge_epoch="EPOCH-DEDUP",
        bridge_next_sequence_start=1,
        cpu_core="interpreter",
        rom_crc1=None,
        rom_crc2=None,
        rom_country=None,
        rom_version=None,
        rom_normalized_sha256=None,
        static_sources={"fixture": True},
    )


def dma_event(sequence: int, content: bytes) -> RawEventInput:
    digest = hashlib.sha256(content).hexdigest().upper()
    return RawEventInput(
        frame_number=10 + sequence,
        host_monotonic_ns=100 + sequence,
        observed_utc="2026-08-18T00:00:00.100Z",
        bridge_stream="dma",
        bridge_epoch="EPOCH-DEDUP",
        bridge_event_sequence=sequence,
        recorder_batch_id=1,
        recorder_batch_index=sequence - 1,
        bridge_event_type="dma-complete",
        payload={
            "kind": "dma-complete",
            "bridgeEpoch": "EPOCH-DEDUP",
            "bridgeSequence": sequence,
            "bridgeStream": "dma",
            "capturePhase": "post-transfer-callback",
            "destinationByteLength": len(content),
            "destinationBytesEncoding": "hex-uppercase",
            "destinationBytesHex": content.hex().upper(),
        },
        event_time_content_sha256=digest,
        event_time_content_size=len(content),
        event_time_content_encoding="hex-uppercase",
        event_time_content_phase="post-transfer-callback",
        event_time_content_field="destinationBytesHex",
    )


class ContentDedupTests(unittest.TestCase):
    def test_exact_bytes_are_interned_while_every_occurrence_remains(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            store = CaptureStore.create(Path(raw) / "capture.sqlite", metadata())
            try:
                repeated = b"same DMA payload"
                changed = b"unique DMA bytes"
                store.append_event_batch(
                    (dma_event(1, repeated), dma_event(2, repeated), dma_event(3, changed))
                )
                self.assertEqual(
                    store.connection.execute("SELECT COUNT(*) FROM event_sequence").fetchone()[0],
                    3,
                )
                self.assertEqual(
                    store.connection.execute("SELECT COUNT(*) FROM content_blob").fetchone()[0],
                    2,
                )
                rows = store.connection.execute(
                    "SELECT raw_payload_json FROM event_sequence ORDER BY sequence_id"
                ).fetchall()
                compact = [json.loads(row[0]) for row in rows]
                self.assertTrue(all("destinationBytesHex" not in item for item in compact))
                restored = [load_event_payload(store.connection, row[0]) for row in rows]
                self.assertEqual(
                    [item["destinationBytesHex"] for item in restored],
                    [repeated.hex().upper(), repeated.hex().upper(), changed.hex().upper()],
                )
                stats = content_deduplication_stats(store.connection)
                self.assertEqual(stats["eventOccurrences"], 3)
                self.assertEqual(stats["contentOccurrences"], 3)
                self.assertEqual(stats["uniqueContentBlobs"], 2)
                self.assertEqual(stats["duplicateContentOccurrences"], 1)
                self.assertEqual(
                    stats["contentOccurrenceBytes"], len(repeated) * 2 + len(changed)
                )
                self.assertEqual(
                    stats["uniqueContentBytesStored"], len(repeated) + len(changed)
                )
                self.assertEqual(stats["exactPayloadBytesAvoided"], len(repeated))
                self.assertTrue(stats["policy"]["occurrencesPreserved"])
            finally:
                store.close_connection()

    def test_hash_match_never_suppresses_an_exact_byte_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            store = CaptureStore.create(Path(raw) / "capture.sqlite", metadata())
            content = b"AB"
            digest = hashlib.sha256(content).hexdigest().upper()
            try:
                store.connection.execute(
                    """
                    INSERT INTO content_blob(
                        content_sha256, byte_size, content_bytes, first_observed_utc
                    ) VALUES(?,?,?,?)
                    """,
                    (digest, 2, b"CD", "2026-08-18T00:00:00.000Z"),
                )
                store.connection.commit()
                with self.assertRaisesRegex(RuntimeError, "collision"):
                    store.append_event_batch((dma_event(1, content),))
                self.assertEqual(
                    store.connection.execute("SELECT COUNT(*) FROM event_sequence").fetchone()[0],
                    0,
                )
            finally:
                store.close_connection()


if __name__ == "__main__":
    unittest.main()
