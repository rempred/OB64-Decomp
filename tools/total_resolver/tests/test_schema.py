from __future__ import annotations

from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.schema import create_capture_database, verify_capture_schema


def insert_session(connection: sqlite3.Connection, *, mode: str = "manual-play") -> None:
    connection.execute(
        """
        INSERT INTO session(
            session_id, started_utc, tool_version, decomp_git_commit, decomp_dirty,
            bridge_version, bridge_port, bridge_epoch, bridge_next_sequence_start,
            cpu_core, static_sources_json, capture_mode,
            intervention_policy, closure_status, continuity_status
        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """,
        (
            "S1",
            "2026-08-17T00:00:00.000Z",
            "0.1.0",
            "A" * 40,
            0,
            "0.7.2",
            64640,
            "EPOCH-S1",
            1,
            "interpreter",
            "{}",
            mode,
            "observation-only",
            "open",
            "continuous",
        ),
    )


class CaptureSchemaTests(unittest.TestCase):
    def test_schema_creates_strict_integrity_checked_database(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            path = Path(raw) / "capture.sqlite"
            connection = create_capture_database(path)
            try:
                self.assertEqual(verify_capture_schema(connection), [])
                tables = {
                    row[0]
                    for row in connection.execute(
                        "SELECT name FROM sqlite_schema WHERE type='table'"
                    )
                }
                self.assertTrue(
                    {
                        "session",
                        "event_sequence",
                        "bridge_loss_range",
                        "loader_event",
                        "region_instance",
                        "execution_observation",
                        "semantic_marker",
                        "recorder_health",
                    }.issubset(tables)
                )
            finally:
                connection.close()

    def test_closed_enums_reject_unknown_values(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            connection = create_capture_database(Path(raw) / "capture.sqlite")
            try:
                with self.assertRaises(sqlite3.IntegrityError):
                    insert_session(connection, mode="probably-manual")
            finally:
                connection.close()

    def test_event_sequence_is_monotonic_and_loss_status_is_explicit(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            connection = create_capture_database(Path(raw) / "capture.sqlite")
            try:
                insert_session(connection)
                rows = []
                for status in ("accepted", "loss-marker"):
                    cursor = connection.execute(
                        """
                        INSERT INTO event_sequence(
                            session_id, frame_number, host_monotonic_ns, observed_utc,
                            bridge_stream, bridge_epoch, bridge_event_sequence,
                            recorder_batch_id,
                            recorder_batch_index,
                            bridge_event_type, raw_payload_sha256, raw_payload_json,
                            ingestion_status, bridge_queue_remaining, bridge_dropped_total
                        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                        """,
                        (
                            "S1",
                            10,
                            100 + len(rows),
                            "2026-08-17T00:00:00.000Z",
                            "watch" if status == "accepted" else "recorder",
                            "EPOCH-S1",
                            1 if status == "accepted" else None,
                            1,
                            len(rows),
                            "exec" if status == "accepted" else "event-loss",
                            "A" * 64,
                            "{}",
                            status,
                            0,
                            0 if status == "accepted" else 1,
                        ),
                    )
                    rows.append(cursor.lastrowid)
                self.assertEqual(rows, [1, 2])
            finally:
                connection.close()


if __name__ == "__main__":
    unittest.main()
