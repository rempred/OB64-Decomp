"""Append-only raw capture store for one Total Resolver session."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any, Iterable, Mapping

from .contracts import CaptureMode, InterventionPolicy
from .schema import create_capture_database, open_capture_database, utc_now


def canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def payload_sha256(payload_json: str) -> str:
    return hashlib.sha256(payload_json.encode("utf-8")).hexdigest().upper()


def load_event_payload(
    connection: sqlite3.Connection,
    raw_payload_json: str,
) -> dict[str, Any]:
    """Load a v2 inline payload or rehydrate a v3 content-blob payload."""

    value = json.loads(raw_payload_json)
    if not isinstance(value, dict):
        raise ValueError("event payload is not a JSON object")
    metadata = value.get("contentBlob")
    if metadata is None:
        return value
    if not isinstance(metadata, Mapping):
        raise ValueError("event contentBlob metadata is not an object")
    digest = metadata.get("sha256")
    size = metadata.get("byteLength")
    encoding = metadata.get("encoding")
    field = metadata.get("originalField")
    if (
        not isinstance(digest, str)
        or isinstance(size, bool)
        or not isinstance(size, int)
        or size < 0
        or encoding != "hex-uppercase"
        or not isinstance(field, str)
        or not field
    ):
        raise ValueError("event contentBlob metadata is malformed")
    row = connection.execute(
        "SELECT byte_size, content_bytes FROM content_blob WHERE content_sha256=?",
        (digest,),
    ).fetchone()
    if row is None:
        raise ValueError(f"event content blob {digest} is missing")
    content = bytes(row[1])
    # The legacy column name is content_sha256, but the value is only the
    # storage reference used by capture schema v3.  The referenced bytes and
    # their declared length are authoritative; recomputing the digest here
    # would turn a storage index back into an integrity requirement.
    if int(row[0]) != size or len(content) != size:
        raise ValueError(f"event content blob {digest} has an inconsistent length")
    result = dict(value)
    del result["contentBlob"]
    if field in result:
        raise ValueError(f"event content field {field} is both inline and blob-backed")
    result[field] = content.hex().upper()
    return result


def content_deduplication_stats(connection: sqlite3.Connection) -> dict[str, Any]:
    """Report automatic exact-content interning without mutating the capture.

    Event rows are deliberately never deduplicated: they are the occurrence and
    ordering record.  Only exact byte payloads referenced by those rows are
    interned, and a digest match is accepted only after byte-for-byte comparison
    at ingestion time.
    """

    schema_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
    if schema_version not in {2, 3, 4}:
        raise ValueError(f"unsupported capture schema version: {schema_version}")
    session_rows = connection.execute("SELECT session_id FROM session").fetchall()
    if len(session_rows) != 1:
        raise ValueError("capture database must contain exactly one session")
    session_id = str(session_rows[0][0])
    event_count = int(connection.execute("SELECT COUNT(*) FROM event_sequence").fetchone()[0])
    policy = {
        "unit": "exact-content-bytes",
        "occurrencesPreserved": True,
        "orderingPreserved": True,
        "approximateHashesMaySuppress": False,
        "digestMatchesRequireExactByteComparison": True,
        "mutation": "none",
    }
    if schema_version < 3:
        return {
            "schema": "ob64-total-resolver-content-deduplication.v1",
            "sessionId": session_id,
            "captureSchemaVersion": schema_version,
            "automaticContentInterning": False,
            "legacyInlineContent": True,
            "eventOccurrences": event_count,
            "contentOccurrences": None,
            "uniqueContentBlobs": None,
            "duplicateContentOccurrences": None,
            "contentOccurrenceBytes": None,
            "uniqueContentBytesStored": None,
            "exactPayloadBytesAvoided": None,
            "policy": policy,
        }

    occurrence = connection.execute(
        """
        SELECT COUNT(*), COALESCE(SUM(event_time_content_size), 0),
               COUNT(DISTINCT event_time_content_sha256)
        FROM event_sequence
        WHERE event_time_content_sha256 IS NOT NULL
        """
    ).fetchone()
    blob = connection.execute(
        """
        SELECT COUNT(*), COALESCE(SUM(content_blob.byte_size), 0)
        FROM content_blob
        WHERE content_sha256 IN (
            SELECT DISTINCT event_time_content_sha256
            FROM event_sequence
            WHERE event_time_content_sha256 IS NOT NULL
        )
        """
    ).fetchone()
    all_blob_count = int(connection.execute("SELECT COUNT(*) FROM content_blob").fetchone()[0])
    content_occurrences = int(occurrence[0])
    occurrence_bytes = int(occurrence[1])
    unique_references = int(occurrence[2])
    referenced_blob_count = int(blob[0])
    unique_bytes = int(blob[1])
    if referenced_blob_count != unique_references:
        raise ValueError("capture contains a missing exact-content blob reference")
    return {
        "schema": "ob64-total-resolver-content-deduplication.v1",
        "sessionId": session_id,
        "captureSchemaVersion": schema_version,
        "automaticContentInterning": True,
        "legacyInlineContent": False,
        "eventOccurrences": event_count,
        "contentOccurrences": content_occurrences,
        "uniqueContentBlobs": referenced_blob_count,
        "unreferencedContentBlobs": all_blob_count - referenced_blob_count,
        "duplicateContentOccurrences": content_occurrences - referenced_blob_count,
        "contentOccurrenceBytes": occurrence_bytes,
        "uniqueContentBytesStored": unique_bytes,
        "exactPayloadBytesAvoided": occurrence_bytes - unique_bytes,
        "policy": policy,
    }


@dataclass(frozen=True)
class SessionMetadata:
    session_id: str
    started_utc: str
    tool_version: str
    tool_git_commit: str | None
    decomp_git_commit: str
    decomp_dirty: bool
    project64_branch: str | None
    project64_git_commit: str | None
    bridge_version: str
    bridge_port: int
    bridge_epoch: str
    bridge_next_sequence_start: int
    cpu_core: str
    rom_crc1: str | None
    rom_crc2: str | None
    rom_country: str | None
    rom_version: int | None
    rom_normalized_sha256: str | None
    static_sources: Mapping[str, Any]
    accepted_resolver_identity: str | None = None
    capture_mode: CaptureMode = CaptureMode.MANUAL_PLAY
    intervention_policy: InterventionPolicy = InterventionPolicy.OBSERVATION_ONLY
    notes: str | None = None


@dataclass(frozen=True)
class RawEventInput:
    frame_number: int | None
    host_monotonic_ns: int
    observed_utc: str
    bridge_stream: str
    bridge_epoch: str
    bridge_event_sequence: int | None
    recorder_batch_id: int
    recorder_batch_index: int
    bridge_event_type: str
    payload: Mapping[str, Any]
    ingestion_status: str = "accepted"
    bridge_queue_remaining: int | None = None
    bridge_dropped_total: int | None = None
    event_time_content_sha256: str | None = None
    event_time_content_size: int | None = None
    event_time_content_encoding: str | None = None
    event_time_content_phase: str | None = None
    event_time_content_field: str | None = None


@dataclass(frozen=True)
class StoredEvent:
    sequence_id: int
    input: RawEventInput
    raw_payload_json: str
    raw_payload_sha256: str
    stored_payload_json: str
    stored_payload_sha256: str
    event_time_content_sha256: str | None
    event_time_content_size: int | None
    event_time_content_encoding: str | None
    event_time_content_phase: str | None
    event_time_content_field: str | None


_CONTENT_FIELDS: dict[str, tuple[str, str, str, str]] = {
    "dma-complete": (
        "destinationBytesHex",
        "destinationBytesEncoding",
        "destinationByteLength",
        "post-transfer-callback",
    ),
    "trace-page": (
        "codeBytesHex",
        "codeBytesEncoding",
        "codeByteLength",
        "pre-execution-callback",
    ),
    "range-snapshot": (
        "bytesHex",
        "bytesEncoding",
        "size",
        "host-polled-range-snapshot",
    ),
    "baseline-snapshot": (
        "rdramBytesHex",
        "rdramBytesEncoding",
        "rdramByteLength",
        "pre-execution-native-rdram-snapshot",
    ),
}


def _compact_event_payload(
    event: RawEventInput,
) -> tuple[str, str, str, str, bytes | None, str | None, str | None]:
    """Return original/compact JSON identities and exact content, if present."""

    raw_json = canonical_json(event.payload)
    raw_hash = payload_sha256(raw_json)
    specification = _CONTENT_FIELDS.get(event.bridge_event_type)
    if specification is None:
        if any(
            value is not None
            for value in (
                event.event_time_content_sha256,
                event.event_time_content_size,
                event.event_time_content_encoding,
                event.event_time_content_phase,
                event.event_time_content_field,
            )
        ):
            raise ValueError(
                f"{event.bridge_event_type} declares exact content without a content-field contract"
            )
        return raw_json, raw_hash, raw_json, raw_hash, None, None, None

    field, encoding_field, size_field, expected_phase = specification
    if event.event_time_content_field not in {None, field}:
        raise ValueError(f"{event.bridge_event_type} declared the wrong exact-content field")
    encoded = event.payload.get(field)
    encoding = event.payload.get(encoding_field)
    size = event.payload.get(size_field)
    if encoding != "hex-uppercase" or not isinstance(encoded, str):
        raise ValueError(f"{event.bridge_event_type} lacks canonical uppercase-hex content")
    if encoded != encoded.upper() or any(character not in "0123456789ABCDEF" for character in encoded):
        raise ValueError(f"{event.bridge_event_type} content is not canonical uppercase hex")
    if isinstance(size, bool) or not isinstance(size, int) or size < 0 or len(encoded) != size * 2:
        raise ValueError(f"{event.bridge_event_type} exact-content length is inconsistent")
    content = bytes.fromhex(encoded)
    digest = hashlib.sha256(content).hexdigest().upper()
    # Bridge-provided digests are contextual compatibility fields.  Capture
    # computes its own candidate storage key and always confirms an existing
    # key with exact bytes before interning; a digest is never fact evidence.
    if event.event_time_content_size not in {None, size}:
        raise ValueError(f"{event.bridge_event_type} declared exact-content size is inconsistent")
    if event.event_time_content_encoding not in {None, encoding}:
        raise ValueError(f"{event.bridge_event_type} declared exact-content encoding is inconsistent")
    if event.event_time_content_phase not in {None, expected_phase}:
        raise ValueError(f"{event.bridge_event_type} declared exact-content phase is inconsistent")

    compact = dict(event.payload)
    del compact[field]
    if "contentBlob" in compact:
        raise ValueError("event payload already contains reserved contentBlob metadata")
    compact["contentBlob"] = {
        "sha256": digest,
        "byteLength": size,
        "encoding": encoding,
        "originalField": field,
    }
    stored_json = canonical_json(compact)
    return raw_json, raw_hash, stored_json, payload_sha256(stored_json), content, field, expected_phase


class CaptureStore:
    def __init__(
        self,
        path: Path,
        connection: sqlite3.Connection,
        session_id: str,
        *,
        mirror_events: bool = False,
    ) -> None:
        self.path = path
        self.session_dir = path.parent
        self.connection = connection
        self.session_id = session_id
        self._mirror_path = self.session_dir / "events.ndjson" if mirror_events else None
        self._mirror_stream = None
        if self._mirror_path is not None:
            self._mirror_stream = self._mirror_path.open("a", encoding="utf-8", newline="\n")

    @classmethod
    def create(
        cls,
        path: Path,
        metadata: SessionMetadata,
        *,
        mirror_events: bool = False,
    ) -> CaptureStore:
        if not metadata.session_id:
            raise ValueError("session_id must not be empty")
        connection = create_capture_database(path)
        try:
            connection.execute(
                """
                INSERT INTO session(
                    session_id, started_utc, tool_version, tool_git_commit,
                    decomp_git_commit, decomp_dirty, project64_branch,
                    project64_git_commit, bridge_version, bridge_port, cpu_core,
                    bridge_epoch, bridge_next_sequence_start,
                    rom_crc1, rom_crc2, rom_country, rom_version,
                    rom_normalized_sha256, static_sources_json,
                    accepted_resolver_identity, capture_mode, intervention_policy,
                    closure_status, continuity_status, notes
                ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """,
                (
                    metadata.session_id,
                    metadata.started_utc,
                    metadata.tool_version,
                    metadata.tool_git_commit,
                    metadata.decomp_git_commit,
                    int(metadata.decomp_dirty),
                    metadata.project64_branch,
                    metadata.project64_git_commit,
                    metadata.bridge_version,
                    metadata.bridge_port,
                    metadata.cpu_core,
                    metadata.bridge_epoch,
                    metadata.bridge_next_sequence_start,
                    metadata.rom_crc1,
                    metadata.rom_crc2,
                    metadata.rom_country,
                    metadata.rom_version,
                    metadata.rom_normalized_sha256,
                    canonical_json(metadata.static_sources),
                    metadata.accepted_resolver_identity,
                    metadata.capture_mode.value,
                    metadata.intervention_policy.value,
                    "open",
                    "continuous",
                    metadata.notes,
                ),
            )
            connection.commit()
        except Exception:
            connection.close()
            raise
        return cls(path, connection, metadata.session_id, mirror_events=mirror_events)

    @classmethod
    def open(cls, path: Path, *, mirror_events: bool = False) -> CaptureStore:
        connection = open_capture_database(path)
        rows = connection.execute("SELECT session_id FROM session").fetchall()
        if len(rows) != 1:
            connection.close()
            raise ValueError("capture database must contain exactly one session")
        return cls(path, connection, str(rows[0][0]), mirror_events=mirror_events)

    def close_connection(self) -> None:
        if self._mirror_stream is not None:
            self._mirror_stream.flush()
            self._mirror_stream.close()
            self._mirror_stream = None
        self.connection.close()

    def __enter__(self) -> CaptureStore:
        return self

    def __exit__(self, *_exc: Any) -> None:
        self.close_connection()

    def _session_row(self) -> sqlite3.Row:
        row = self.connection.execute(
            "SELECT * FROM session WHERE session_id=?", (self.session_id,)
        ).fetchone()
        if row is None:
            raise RuntimeError("session row disappeared")
        return row

    def _require_open(self) -> None:
        status = self._session_row()["closure_status"]
        if status != "open":
            raise RuntimeError(f"raw session is immutable after closure ({status})")

    def latest_sequence(self) -> int | None:
        row = self.connection.execute(
            "SELECT MAX(sequence_id) FROM event_sequence WHERE session_id=?",
            (self.session_id,),
        ).fetchone()
        return int(row[0]) if row and row[0] is not None else None

    def append_event_batch(self, events: Iterable[RawEventInput]) -> tuple[StoredEvent, ...]:
        self._require_open()
        pending = list(events)
        if not pending:
            return ()
        stored: list[StoredEvent] = []
        try:
            self.connection.execute("BEGIN IMMEDIATE")
            for event in pending:
                (
                    raw_json,
                    raw_hash,
                    stored_json,
                    stored_hash,
                    content,
                    content_field,
                    content_phase,
                ) = _compact_event_payload(event)
                content_hash = None
                content_size = None
                content_encoding = None
                if content is not None:
                    content_hash = hashlib.sha256(content).hexdigest().upper()
                    content_size = len(content)
                    content_encoding = "hex-uppercase"
                    existing = self.connection.execute(
                        "SELECT byte_size, content_bytes FROM content_blob WHERE content_sha256=?",
                        (content_hash,),
                    ).fetchone()
                    if existing is None:
                        self.connection.execute(
                            """
                            INSERT INTO content_blob(
                                content_sha256, byte_size, content_bytes, first_observed_utc
                            ) VALUES(?,?,?,?)
                            """,
                            (content_hash, content_size, content, event.observed_utc),
                        )
                    elif int(existing[0]) != content_size or bytes(existing[1]) != content:
                        raise RuntimeError(
                            "SHA-256 collision while interning exact event content; refusing dedupe"
                        )
                cursor = self.connection.execute(
                    """
                    INSERT INTO event_sequence(
                        session_id, frame_number, host_monotonic_ns, observed_utc,
                        bridge_stream, bridge_epoch, bridge_event_sequence, recorder_batch_id,
                        recorder_batch_index, bridge_event_type, raw_payload_sha256,
                        stored_payload_sha256, raw_payload_json, ingestion_status, bridge_queue_remaining,
                        bridge_dropped_total, event_time_content_sha256,
                        event_time_content_size, event_time_content_encoding,
                        event_time_content_phase, event_time_content_field
                    ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                    """,
                    (
                        self.session_id,
                        event.frame_number,
                        event.host_monotonic_ns,
                        event.observed_utc,
                        event.bridge_stream,
                        event.bridge_epoch,
                        event.bridge_event_sequence,
                        event.recorder_batch_id,
                        event.recorder_batch_index,
                        event.bridge_event_type,
                        raw_hash,
                        stored_hash,
                        stored_json,
                        event.ingestion_status,
                        event.bridge_queue_remaining,
                        event.bridge_dropped_total,
                        content_hash,
                        content_size,
                        content_encoding,
                        content_phase,
                        content_field,
                    ),
                )
                assert cursor.lastrowid is not None
                stored.append(
                    StoredEvent(
                        int(cursor.lastrowid),
                        event,
                        raw_json,
                        raw_hash,
                        stored_json,
                        stored_hash,
                        content_hash,
                        content_size,
                        content_encoding,
                        content_phase,
                        content_field,
                    )
                )
            self.connection.commit()
        except Exception:
            self.connection.rollback()
            raise

        if self._mirror_stream is not None:
            for item in stored:
                envelope = {
                    "sequenceId": item.sequence_id,
                    "frame": item.input.frame_number,
                    "hostMonotonicNs": item.input.host_monotonic_ns,
                    "observedUtc": item.input.observed_utc,
                    "bridgeStream": item.input.bridge_stream,
                    "bridgeEpoch": item.input.bridge_epoch,
                    "bridgeEventSequence": item.input.bridge_event_sequence,
                    "recorderBatchId": item.input.recorder_batch_id,
                    "recorderBatchIndex": item.input.recorder_batch_index,
                    "bridgeEventType": item.input.bridge_event_type,
                    "ingestionStatus": item.input.ingestion_status,
                    "rawPayloadSha256": item.raw_payload_sha256,
                    "storedPayloadSha256": item.stored_payload_sha256,
                    "bridgeQueueRemaining": item.input.bridge_queue_remaining,
                    "bridgeDroppedTotal": item.input.bridge_dropped_total,
                    "eventTimeContentSha256": item.event_time_content_sha256,
                    "eventTimeContentSize": item.event_time_content_size,
                    "eventTimeContentEncoding": item.event_time_content_encoding,
                    "eventTimeContentPhase": item.event_time_content_phase,
                    "eventTimeContentField": item.event_time_content_field,
                    "payload": json.loads(item.stored_payload_json),
                }
                self._mirror_stream.write(canonical_json(envelope) + "\n")
            self._mirror_stream.flush()
        return tuple(stored)

    def record_bridge_loss_range(
        self,
        *,
        bridge_epoch: str,
        first_sequence: int,
        last_sequence: int,
        source: str = "unified-drain-envelope",
    ) -> bool:
        self._require_open()
        if first_sequence < 1 or last_sequence < first_sequence:
            raise ValueError("bridge loss range is invalid")
        if source not in {"unified-drain-envelope", "recorder-recovery-gap"}:
            raise ValueError(f"unsupported bridge loss source: {source}")
        before = self.connection.total_changes
        self.connection.execute(
            """
            INSERT OR IGNORE INTO bridge_loss_range(
                session_id, bridge_epoch, first_bridge_sequence,
                last_bridge_sequence, dropped_count,
                first_observed_after_sequence, reported_utc, source
            ) VALUES(?,?,?,?,?,?,?,?)
            """,
            (
                self.session_id,
                bridge_epoch,
                first_sequence,
                last_sequence,
                last_sequence - first_sequence + 1,
                self.latest_sequence(),
                utc_now(),
                source,
            ),
        )
        self.connection.commit()
        return self.connection.total_changes > before

    def set_bridge_next_sequence_end(self, next_sequence: int) -> None:
        self._require_open()
        if next_sequence < 1:
            raise ValueError("bridge next sequence must be positive")
        self.connection.execute(
            "UPDATE session SET bridge_next_sequence_end=? WHERE session_id=?",
            (next_sequence, self.session_id),
        )
        self.connection.commit()

    def record_frame_sample(
        self,
        *,
        frame_number: int,
        host_monotonic_ns: int,
        execution_state: str | None,
        system_paused: bool | None,
        debug_paused: bool | None,
        frame_hash: str | None,
        configuration_sha256: str | None,
        queue_depth: int | None,
        dropped_total: int | None,
    ) -> int:
        self._require_open()
        cursor = self.connection.execute(
            """
            INSERT INTO frame_sample(
                session_id, observed_after_sequence, frame_number, host_monotonic_ns,
                observed_utc, execution_state, system_paused, debug_paused,
                frame_hash, configuration_sha256, queue_depth, dropped_total
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                self.session_id,
                self.latest_sequence(),
                frame_number,
                host_monotonic_ns,
                utc_now(),
                execution_state,
                None if system_paused is None else int(system_paused),
                None if debug_paused is None else int(debug_paused),
                frame_hash,
                configuration_sha256,
                queue_depth,
                dropped_total,
            ),
        )
        self.connection.commit()
        assert cursor.lastrowid is not None
        return int(cursor.lastrowid)

    def record_watch(
        self,
        *,
        watch_id: str,
        bridge_watch_id: int | None,
        watch_kind: str,
        address_space: str,
        address_start: int,
        address_end_exclusive: int,
        label: str | None,
        reason: str,
        definition_source: str,
        interpreter_required: bool,
        interpreter_verified: bool,
        ownership_scope: str,
        expected_event_rate: str | None = None,
    ) -> None:
        self._require_open()
        self.connection.execute(
            """
            INSERT INTO watch_definition(
                watch_id, session_id, bridge_watch_id, watch_kind, address_space,
                address_start, address_end_exclusive, label, reason,
                definition_source, installed_sequence, interpreter_required,
                interpreter_verified, ownership_scope, expected_event_rate
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                watch_id,
                self.session_id,
                bridge_watch_id,
                watch_kind,
                address_space,
                address_start,
                address_end_exclusive,
                label,
                reason,
                definition_source,
                self.latest_sequence(),
                int(interpreter_required),
                int(interpreter_verified),
                ownership_scope,
                expected_event_rate,
            ),
        )
        self.connection.commit()

    def mark_recorder_watches_removed(self, removed_sequence: int) -> None:
        self._require_open()
        self.connection.execute(
            """
            UPDATE watch_definition
            SET removed_sequence=?
            WHERE session_id=? AND ownership_scope='recorder-owned'
              AND removed_sequence IS NULL
            """,
            (removed_sequence, self.session_id),
        )
        self.connection.commit()

    def close_open_region_lifetimes(self, terminal_sequence: int, *, interrupted: bool) -> int:
        """Close every still-live region at a terminal recorder event."""

        self._require_open()
        reason = "continuity-break" if interrupted else "session-end"
        before = self.connection.total_changes
        self.connection.execute(
            """
            UPDATE region_instance
            SET end_sequence_exclusive=?, closure_reason=?
            WHERE session_id=? AND end_sequence_exclusive IS NULL
            """,
            (terminal_sequence, reason, self.session_id),
        )
        self.connection.commit()
        return self.connection.total_changes - before

    def add_marker(
        self,
        label: str,
        *,
        marker_type: str,
        frame_number: int | None,
        marker_source: str = "human",
        confidence: str = "certain",
        supersedes_marker_id: int | None = None,
        note: str | None = None,
    ) -> int:
        self._require_open()
        if not label.strip():
            raise ValueError("marker label must not be empty")
        cursor = self.connection.execute(
            """
            INSERT INTO semantic_marker(
                session_id, start_sequence, start_frame, label, marker_type,
                marker_source, confidence, supersedes_marker_id, note, created_utc
            ) VALUES(?,?,?,?,?,?,?,?,?,?)
            """,
            (
                self.session_id,
                self.latest_sequence(),
                frame_number,
                label.strip(),
                marker_type,
                marker_source,
                confidence,
                supersedes_marker_id,
                note,
                utc_now(),
            ),
        )
        self.connection.commit()
        assert cursor.lastrowid is not None
        return int(cursor.lastrowid)

    def record_health(
        self,
        *,
        frame_number: int | None,
        host_monotonic_ns: int,
        queue_depth: int,
        queue_high_water: int,
        dropped_total: int,
        drain_interval_ms: float | None,
        longest_drain_stall_ms: float,
        frame_poll_latency_ms: float | None,
        cpu_core: str,
        bridge_reconnects: int,
        watch_failures: int,
        recorder_exceptions: int,
        continuity_status: str,
        note: str | None = None,
    ) -> int:
        self._require_open()
        cursor = self.connection.execute(
            """
            INSERT INTO recorder_health(
                session_id, observed_after_sequence, frame_number, observed_utc,
                host_monotonic_ns, queue_depth, queue_high_water, dropped_total,
                drain_interval_ms, longest_drain_stall_ms, frame_poll_latency_ms,
                cpu_core, bridge_reconnects, watch_failures, recorder_exceptions,
                continuity_status, note
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """,
            (
                self.session_id,
                self.latest_sequence(),
                frame_number,
                utc_now(),
                host_monotonic_ns,
                queue_depth,
                queue_high_water,
                dropped_total,
                drain_interval_ms,
                longest_drain_stall_ms,
                frame_poll_latency_ms,
                cpu_core,
                bridge_reconnects,
                watch_failures,
                recorder_exceptions,
                continuity_status,
                note,
            ),
        )
        self.connection.commit()
        assert cursor.lastrowid is not None
        return int(cursor.lastrowid)

    def set_continuity_broken(self, note: str | None = None) -> None:
        self._require_open()
        self.connection.execute(
            "UPDATE session SET continuity_status='broken', notes=COALESCE(?, notes) WHERE session_id=?",
            (note, self.session_id),
        )
        self.connection.commit()

    def request_stop(self) -> None:
        self._require_open()
        self.connection.execute(
            "UPDATE recorder_control SET requested_action='stop', updated_utc=? WHERE singleton=1",
            (utc_now(),),
        )
        self.connection.commit()

    def stop_requested(self) -> bool:
        row = self.connection.execute(
            "SELECT requested_action FROM recorder_control WHERE singleton=1"
        ).fetchone()
        return bool(row and row[0] == "stop")

    def close_session(self, status: str, *, note: str | None = None) -> None:
        self._require_open()
        if status not in {"closed", "aborted", "interrupted"}:
            raise ValueError(f"invalid terminal session status: {status}")
        self.connection.execute(
            """
            UPDATE session
            SET ended_utc=?, closure_status=?, notes=COALESCE(?, notes)
            WHERE session_id=?
            """,
            (utc_now(), status, note, self.session_id),
        )
        self.connection.commit()

    def checkpoint(self) -> None:
        if self._mirror_stream is not None:
            self._mirror_stream.flush()
        self.connection.execute("PRAGMA wal_checkpoint(TRUNCATE)")
