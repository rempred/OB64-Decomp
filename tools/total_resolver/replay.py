"""Deterministic raw-session timeline replay."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any

from .capture_db import canonical_json


def build_timeline(connection: sqlite3.Connection) -> dict[str, Any]:
    events: list[dict[str, Any]] = []
    for row in connection.execute(
        """
        SELECT sequence_id, frame_number, host_monotonic_ns, observed_utc,
               bridge_stream, bridge_epoch, bridge_event_sequence, recorder_batch_id,
               recorder_batch_index, bridge_event_type, raw_payload_sha256,
               raw_payload_json, ingestion_status, bridge_queue_remaining,
               bridge_dropped_total, event_time_content_sha256,
               event_time_content_size, event_time_content_encoding,
               event_time_content_phase
        FROM event_sequence
        ORDER BY sequence_id
        """
    ):
        events.append(
            {
                "sequenceId": row[0],
                "frame": row[1],
                "hostMonotonicNs": row[2],
                "observedUtc": row[3],
                "bridgeStream": row[4],
                "bridgeEpoch": row[5],
                "bridgeEventSequence": row[6],
                "recorderBatchId": row[7],
                "recorderBatchIndex": row[8],
                "eventType": row[9],
                "rawPayloadSha256": row[10],
                "payload": json.loads(row[11]),
                "ingestionStatus": row[12],
                "bridgeQueueRemaining": row[13],
                "bridgeDroppedTotal": row[14],
                "eventTimeContentSha256": row[15],
                "eventTimeContentSize": row[16],
                "eventTimeContentEncoding": row[17],
                "eventTimeContentPhase": row[18],
            }
        )
    session = connection.execute(
        """
        SELECT bridge_epoch, bridge_next_sequence_start, bridge_next_sequence_end
        FROM session
        """
    ).fetchone()
    loss_ranges = [
        {
            "firstBridgeSequence": row[0],
            "lastBridgeSequence": row[1],
            "droppedCount": row[2],
        }
        for row in connection.execute(
            """
            SELECT first_bridge_sequence, last_bridge_sequence, dropped_count
            FROM bridge_loss_range
            ORDER BY first_bridge_sequence, last_bridge_sequence
            """
        )
    ]
    core = {
        "schema": "ob64-total-resolver-raw-timeline.v2",
        "machineOrder": "bridgeEventSequence",
        "timestampsAndFrames": "context-only",
        "bridgeEpoch": session[0] if session else None,
        "bridgeNextSequenceStart": session[1] if session else None,
        "bridgeNextSequenceEnd": session[2] if session else None,
        "droppedSequenceRanges": loss_ranges,
        "eventCount": len(events),
        "events": events,
    }
    return {
        "timeline": core,
        "timelineSha256": hashlib.sha256(canonical_json(core).encode("utf-8")).hexdigest().upper(),
    }


def write_timeline(connection: sqlite3.Connection, path: Path) -> dict[str, Any]:
    timeline = build_timeline(connection)
    path.write_text(json.dumps(timeline, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return timeline
