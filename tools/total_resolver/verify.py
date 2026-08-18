"""Independent read-only verification for raw Total Resolver sessions."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import sqlite3
from typing import Any

from .capture_db import canonical_json, payload_sha256
from .configuration import ConfigurationRegion, machine_configuration_identity
from .contracts import RegionClass
from .inventory import sha256_file
from .manifest import build_manifest_core, manifest_core_sha256
from .replay import build_timeline
from .schema import open_capture_database, verify_capture_schema


@dataclass(frozen=True)
class SessionVerification:
    ok: bool
    checks: tuple[dict[str, str], ...]
    timeline_sha256: str | None

    def to_dict(self) -> dict[str, Any]:
        return {
            "result": "PASS" if self.ok else "FAIL",
            "checks": list(self.checks),
            "timelineSha256": self.timeline_sha256,
        }


def _check(checks: list[dict[str, str]], name: str, ok: bool, detail: str) -> None:
    checks.append({"name": name, "status": "PASS" if ok else "FAIL", "detail": detail})


def _verify_events(
    connection: sqlite3.Connection,
    checks: list[dict[str, str]],
    session: sqlite3.Row,
) -> None:
    rows = connection.execute(
        """
        SELECT sequence_id, bridge_stream, bridge_epoch, bridge_event_sequence,
               host_monotonic_ns, raw_payload_json, raw_payload_sha256,
               bridge_event_type, event_time_content_sha256,
               event_time_content_size, event_time_content_encoding,
               event_time_content_phase
        FROM event_sequence ORDER BY sequence_id
        """
    ).fetchall()
    global_ids = [int(row[0]) for row in rows]
    expected_global = list(range(1, len(rows) + 1))
    _check(checks, "event-sequence-contiguous", global_ids == expected_global, f"{len(rows)} event(s)")

    last_host = -1
    machine_sequences: list[int] = []
    payloads_ok = True
    host_ok = True
    epochs_ok = True
    content_ok = True
    pair_ok = True
    dma_starts: dict[int, dict[str, Any]] = {}
    require_dma_pairs = session["bridge_version"] in {"0.7.1", "0.7.2"}

    def is_rom_loader_dma(value: dict[str, Any]) -> bool:
        if value.get("sourceDomain") == "cartridge-rom":
            return True
        cart = value.get("cart")
        if not isinstance(cart, str):
            return False
        try:
            return int(cart, 0) & 0xF0000000 == 0xB0000000
        except ValueError:
            return False
    for row in rows:
        stream = str(row[1])
        epoch = str(row[2])
        bridge_sequence = row[3]
        host = int(row[4])
        if host < last_host:
            host_ok = False
        last_host = host
        if epoch != session["bridge_epoch"]:
            epochs_ok = False
        if stream == "recorder":
            if bridge_sequence is not None:
                epochs_ok = False
        elif bridge_sequence is None:
            epochs_ok = False
        else:
            machine_sequences.append(int(bridge_sequence))
        try:
            value = json.loads(row[5])
            raw_json = canonical_json(value)
        except (TypeError, json.JSONDecodeError):
            payloads_ok = False
            continue
        if raw_json != row[5] or payload_sha256(raw_json) != row[6]:
            payloads_ok = False
        if bridge_sequence is not None and (
            value.get("bridgeEpoch") != epoch
            or value.get("bridgeSequence") != bridge_sequence
            or value.get("bridgeStream") != stream
        ):
            epochs_ok = False
        is_dma = row[7] == "dma-complete"
        if row[7] == "dma-start" and is_rom_loader_dma(value):
            if bridge_sequence is None:
                pair_ok = False
            else:
                dma_starts[int(bridge_sequence)] = value
        elif is_dma and require_dma_pairs and is_rom_loader_dma(value):
            start_sequence = value.get("dmaStartSequence")
            start = dma_starts.pop(start_sequence, None)
            if start is None:
                pair_ok = False
            else:
                pair_ok = pair_ok and all(
                    start.get(field) == value.get(field)
                    for field in ("phys", "romoff", "requestedLength")
                )
        content_columns = (row[8], row[9], row[10], row[11])
        if is_dma:
            encoded = value.get("destinationBytesHex")
            if not isinstance(encoded, str):
                content_ok = False
            else:
                try:
                    content = bytes.fromhex(encoded)
                except ValueError:
                    content_ok = False
                else:
                    expected_content = (
                        hashlib.sha256(content).hexdigest().upper(),
                        len(content),
                        value.get("destinationBytesEncoding"),
                        value.get("capturePhase"),
                    )
                    if tuple(content_columns) != expected_content:
                        content_ok = False
        elif row[7] == "range-snapshot":
            encoded = value.get("bytesHex")
            if any(item is not None for item in content_columns) or not isinstance(encoded, str):
                content_ok = False
            else:
                try:
                    content = bytes.fromhex(encoded)
                except ValueError:
                    content_ok = False
                else:
                    if (
                        value.get("bytesEncoding") != "hex-uppercase"
                        or value.get("size") != len(content)
                        or value.get("contentSha256")
                        != hashlib.sha256(content).hexdigest().upper()
                    ):
                        content_ok = False
        elif any(item is not None for item in content_columns):
            content_ok = False
    order_ok = machine_sequences == sorted(machine_sequences) and len(machine_sequences) == len(
        set(machine_sequences)
    )
    _check(
        checks,
        "bridge-global-event-order",
        order_ok,
        f"{len(machine_sequences)} emulator event(s)",
    )
    _check(checks, "bridge-epoch-consistency", epochs_ok, str(session["bridge_epoch"]))
    _check(
        checks,
        "event-host-ingestion-context",
        host_ok,
        "monotonic recorder timestamps; not used as emulator ordering evidence",
    )
    _check(checks, "event-payload-hashes", payloads_ok, "canonical JSON and SHA-256")
    _check(
        checks,
        "dma-event-time-content",
        content_ok,
        "post-transfer exact bytes and recomputed SHA-256",
    )
    if require_dma_pairs:
        pair_ok = pair_ok and not dma_starts
        _check(
            checks,
            "dma-start-completion-pairs",
            pair_ok,
            "every DMA completion links to one earlier matching start",
        )

    ranges = connection.execute(
        """
        SELECT bridge_epoch, first_bridge_sequence, last_bridge_sequence, dropped_count
        FROM bridge_loss_range
        ORDER BY first_bridge_sequence, last_bridge_sequence
        """
    ).fetchall()
    ranges_ok = True
    segments: list[tuple[int, int]] = [(value, value) for value in machine_sequences]
    for row in ranges:
        first = int(row[1])
        last = int(row[2])
        if (
            row[0] != session["bridge_epoch"]
            or int(row[3]) != last - first + 1
            or last < first
        ):
            ranges_ok = False
        segments.append((first, last))
    start = int(session["bridge_next_sequence_start"])
    end_value = session["bridge_next_sequence_end"]
    end = int(end_value) if end_value is not None else None
    cursor = start
    if end is None:
        ranges_ok = False
    else:
        for first, last in sorted(segments):
            if last < start or first >= end:
                ranges_ok = False
                continue
            if first != cursor:
                ranges_ok = False
            cursor = max(cursor, last + 1)
        if cursor != end:
            ranges_ok = False
    _check(
        checks,
        "bridge-sequence-conservation",
        ranges_ok,
        f"epoch={session['bridge_epoch']}, [{start},{end}), lossRanges={len(ranges)}",
    )


def _verify_regions(connection: sqlite3.Connection, checks: list[dict[str, str]], closed: bool) -> None:
    open_count = int(
        connection.execute(
            "SELECT COUNT(*) FROM region_instance WHERE end_sequence_exclusive IS NULL"
        ).fetchone()[0]
    )
    _check(
        checks,
        "closed-region-lifetimes",
        not closed or open_count == 0,
        f"{open_count} open region(s)",
    )
    overlaps = connection.execute(
        """
        SELECT COUNT(*)
        FROM region_instance a
        JOIN region_instance b
          ON a.session_id=b.session_id
         AND a.region_instance_id < b.region_instance_id
         AND a.destination_physical_start < b.destination_physical_end_exclusive
         AND b.destination_physical_start < a.destination_physical_end_exclusive
         AND a.first_sequence < COALESCE(b.end_sequence_exclusive, 9223372036854775807)
         AND b.first_sequence < COALESCE(a.end_sequence_exclusive, 9223372036854775807)
        """
    ).fetchone()[0]
    _check(checks, "region-lifetime-overlap", int(overlaps) == 0, f"{overlaps} illegal overlap(s)")


def _verify_configurations(connection: sqlite3.Connection, checks: list[dict[str, str]]) -> None:
    ok = True
    count = 0
    for row in connection.execute(
        "SELECT configuration_sha256, configuration_kind, canonical_json FROM machine_configuration"
    ):
        count += 1
        links = connection.execute(
            """
            SELECT r.region_class, r.destination_physical_start,
                   r.destination_physical_end_exclusive, r.content_sha256,
                   COALESCE(r.source_kind, 'unknown'),
                   COALESCE(r.source_resource_id, CAST(r.source_start AS TEXT)),
                   r.source_loader_event_id
            FROM configuration_region c
            JOIN region_instance r ON r.region_instance_id=c.region_instance_id
            WHERE c.configuration_sha256=?
            """,
            (row[0],),
        ).fetchall()
        regions = [
            ConfigurationRegion(
                RegionClass(link[0]),
                int(link[1]),
                int(link[2]),
                str(link[3]),
                str(link[4]),
                link[5],
                link[6],
            )
            for link in links
        ]
        digest, canonical = machine_configuration_identity(regions, kind=str(row[1]))
        if digest != row[0] or canonical != row[2]:
            ok = False
    _check(checks, "configuration-identities", ok, f"{count} configuration(s)")


def _verify_event_mirror(connection: sqlite3.Connection, path: Path) -> bool:
    expected: list[dict[str, Any]] = []
    for row in connection.execute(
        """
        SELECT sequence_id, frame_number, host_monotonic_ns, observed_utc,
               bridge_stream, bridge_epoch, bridge_event_sequence,
               recorder_batch_id, recorder_batch_index, bridge_event_type,
               ingestion_status, raw_payload_sha256, bridge_queue_remaining,
               bridge_dropped_total, event_time_content_sha256,
               event_time_content_size, event_time_content_encoding,
               event_time_content_phase, raw_payload_json
        FROM event_sequence ORDER BY sequence_id
        """
    ):
        expected.append(
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
                "bridgeEventType": row[9],
                "ingestionStatus": row[10],
                "rawPayloadSha256": row[11],
                "bridgeQueueRemaining": row[12],
                "bridgeDroppedTotal": row[13],
                "eventTimeContentSha256": row[14],
                "eventTimeContentSize": row[15],
                "eventTimeContentEncoding": row[16],
                "eventTimeContentPhase": row[17],
                "payload": json.loads(row[18]),
            }
        )
    try:
        actual = [
            json.loads(line)
            for line in path.read_text(encoding="utf-8").splitlines()
            if line
        ]
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return False
    return actual == expected


def verify_session(session_dir: Path, repository_root: Path) -> SessionVerification:
    checks: list[dict[str, str]] = []
    database = session_dir / "capture.sqlite"
    if not database.is_file():
        _check(checks, "capture-database", False, f"missing {database}")
        return SessionVerification(False, tuple(checks), None)
    connection = open_capture_database(database, read_only=True)
    connection.execute("PRAGMA query_only = ON")
    timeline_sha: str | None = None
    try:
        schema_errors = verify_capture_schema(connection)
        _check(checks, "capture-schema", not schema_errors, "; ".join(schema_errors) or "v2")
        sessions = connection.execute("SELECT * FROM session").fetchall()
        _check(checks, "single-session", len(sessions) == 1, f"{len(sessions)} row(s)")
        if len(sessions) != 1:
            return SessionVerification(False, tuple(checks), None)
        session = sessions[0]
        closed = session["closure_status"] in {"closed", "aborted", "interrupted"}
        _check(checks, "session-closed", closed, str(session["closure_status"]))
        _verify_events(connection, checks, session)
        _verify_regions(connection, checks, closed)
        _verify_configurations(connection, checks)

        dropped = int(
            connection.execute(
                "SELECT COALESCE(SUM(dropped_count),0) FROM bridge_loss_range"
            ).fetchone()[0]
        )
        loss_rows = int(
            connection.execute(
                "SELECT COUNT(*) FROM event_sequence WHERE ingestion_status='loss-marker'"
            ).fetchone()[0]
        )
        interruption_rows = int(
            connection.execute(
                "SELECT COUNT(*) FROM event_sequence WHERE bridge_event_type='session-interruption'"
            ).fetchone()[0]
        )
        continuity_ok = (
            dropped == 0
            and loss_rows == 0
            and session["continuity_status"] == "continuous"
        ) or (
            dropped > 0
            and loss_rows > 0
            and session["continuity_status"] == "broken"
        ) or (
            session["closure_status"] == "interrupted"
            and interruption_rows > 0
            and session["continuity_status"] == "broken"
        )
        _check(
            checks,
            "event-loss-visible",
            continuity_ok,
            f"dropped={dropped}, lossMarkers={loss_rows}, "
            f"interruptions={interruption_rows}, continuity={session['continuity_status']}",
        )

        timeline = build_timeline(connection)
        repeated = build_timeline(connection)
        timeline_sha = str(timeline["timelineSha256"])
        _check(
            checks,
            "deterministic-raw-replay",
            timeline == repeated,
            timeline_sha,
        )

        manifest_path = session_dir / "manifest.json"
        if manifest_path.is_file():
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            core = build_manifest_core(connection, repository_root)
            core_hash = manifest_core_sha256(core)
            manifest_ok = (
                manifest.get("manifestCore") == core
                and manifest.get("manifestCoreSha256") == core_hash
                and session["manifest_sha256"] == core_hash
            )
            _check(checks, "session-manifest", manifest_ok, core_hash)
            file_hash_ok = manifest.get("captureDatabaseFileSha256") == sha256_file(database)
            _check(checks, "capture-file-hash", file_hash_ok, sha256_file(database))
            mirror_path = session_dir / "events.ndjson"
            declared_mirror = manifest.get("eventMirrorSha256")
            if mirror_path.is_file():
                actual_mirror = sha256_file(mirror_path)
                _check(
                    checks,
                    "event-mirror-hash",
                    declared_mirror == actual_mirror,
                    actual_mirror,
                )
                mirror_ok = _verify_event_mirror(connection, mirror_path)
                _check(
                    checks,
                    "event-mirror-content",
                    mirror_ok,
                    "NDJSON envelopes equal authoritative SQLite rows",
                )
            else:
                _check(
                    checks,
                    "event-mirror-hash",
                    declared_mirror is None,
                    "optional mirror absent",
                )
        else:
            _check(checks, "session-manifest", False, f"missing {manifest_path}")
    finally:
        connection.close()
    return SessionVerification(
        all(check["status"] == "PASS" for check in checks),
        tuple(checks),
        timeline_sha,
    )
