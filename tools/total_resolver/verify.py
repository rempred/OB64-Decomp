"""Independent read-only verification for raw Total Resolver sessions."""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
import sqlite3
from typing import Any

from .addressing import RDRAM_SIZE
from .bridge_events import _validate_trace_or_input_event
from .capture_db import canonical_json, load_event_payload
from .configuration import ConfigurationRegion, machine_configuration_identity
from .contracts import RegionClass
from .protocol import BRIDGE_PROTOCOL_VERSION
from .protocol import BridgeProtocolError
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


def _diagnostic(checks: list[dict[str, str]], name: str, matches: bool, detail: str) -> None:
    """Record non-authoritative legacy/context information.

    Diagnostics deliberately cannot make a session pass or fail.  This keeps
    old hashes inspectable without treating them as capture evidence.
    """

    checks.append(
        {
            "name": name,
            "status": "INFO",
            "detail": f"{'matches' if matches else 'differs or absent'}; {detail}",
        }
    )


def _verify_events(
    connection: sqlite3.Connection,
    checks: list[dict[str, str]],
    session: sqlite3.Row,
) -> None:
    capture_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
    if capture_version >= 3:
        query = """
        SELECT sequence_id, bridge_stream, bridge_epoch, bridge_event_sequence,
               host_monotonic_ns, raw_payload_json, raw_payload_sha256,
               stored_payload_sha256, bridge_event_type, event_time_content_sha256,
               event_time_content_size, event_time_content_encoding,
               event_time_content_phase, event_time_content_field
        FROM event_sequence ORDER BY sequence_id
        """
    else:
        query = """
        SELECT sequence_id, bridge_stream, bridge_epoch, bridge_event_sequence,
               host_monotonic_ns, raw_payload_json, raw_payload_sha256,
               raw_payload_sha256, bridge_event_type, event_time_content_sha256,
               event_time_content_size, event_time_content_encoding,
               event_time_content_phase, NULL
        FROM event_sequence ORDER BY sequence_id
        """
    rows = connection.execute(query).fetchall()
    global_ids = [int(row[0]) for row in rows]
    expected_global = list(range(1, len(rows) + 1))
    _check(checks, "event-sequence-contiguous", global_ids == expected_global, f"{len(rows)} event(s)")

    last_host = -1
    machine_sequences: list[int] = []
    payload_encoding_ok = True
    host_ok = True
    epochs_ok = True
    content_ok = True
    trace_reference_ok = True
    trace_pages: dict[int, tuple[int, bytes]] = {}
    trace_generations: set[tuple[int, int, int]] = set()
    strict_trace_generations = session["bridge_version"] == "0.9.0"
    structural_trace = session["bridge_version"] in {
        "0.10.0", "0.11.0", "0.12.0", BRIDGE_PROTOCOL_VERSION
    }
    pair_ok = True
    dma_starts: dict[int, dict[str, Any]] = {}
    baseline_sequences: list[int] = []
    execution_sequences: list[int] = []
    activity_sequences: list[int] = []
    require_dma_pairs = session["bridge_version"] in {
        "0.7.1", "0.7.2", "0.8.0", "0.9.0", "0.10.0"
    }

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

    def exact_content_metadata_ok(
        stored_value: dict[str, Any],
        columns: tuple[Any, ...],
        *,
        size: int,
        encoding: Any,
        phase: Any,
        field: str,
        legacy_inline_columns: bool = True,
    ) -> bool:
        if capture_version >= 3:
            metadata = stored_value.get("contentBlob")
            return isinstance(metadata, dict) and columns == (
                metadata.get("sha256"),
                size,
                encoding,
                phase,
                field,
            )
        if not legacy_inline_columns:
            return all(item is None for item in columns)
        return (
            columns[0] is not None
            and columns[1:] == (size, encoding, phase, None)
        )

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
            stored_value = json.loads(row[5])
            stored_json = canonical_json(stored_value)
            value = load_event_payload(connection, row[5])
        except (TypeError, json.JSONDecodeError, ValueError):
            payload_encoding_ok = False
            content_ok = False
            continue
        if stored_json != row[5]:
            payload_encoding_ok = False
        if bridge_sequence is not None and (
            value.get("bridgeEpoch") != epoch
            or value.get("bridgeSequence") != bridge_sequence
            or value.get("bridgeStream") != stream
        ):
            epochs_ok = False
        event_type = str(row[8])
        if event_type == "baseline-snapshot" and bridge_sequence is not None:
            baseline_sequences.append(int(bridge_sequence))
        if event_type == "exec-coverage" and bridge_sequence is not None:
            execution_sequences.append(int(bridge_sequence))
        if event_type == "known-activity" and bridge_sequence is not None:
            activity_sequences.append(int(bridge_sequence))
        if event_type in {
            "known-activity",
            "marker-execution-context",
            "marker-execution-context-incomplete",
        }:
            try:
                _validate_trace_or_input_event(value, event_type)
            except BridgeProtocolError:
                trace_reference_ok = False
        is_dma = event_type == "dma-complete"
        if event_type == "dma-start" and is_rom_loader_dma(value):
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
        content_columns = (row[9], row[10], row[11], row[12], row[13])
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
                    if not exact_content_metadata_ok(
                        stored_value,
                        content_columns,
                        size=len(content),
                        encoding=value.get("destinationBytesEncoding"),
                        phase=value.get("capturePhase"),
                        field="destinationBytesHex",
                    ):
                        content_ok = False
        elif event_type == "trace-page":
            encoded = value.get("codeBytesHex")
            if not isinstance(encoded, str):
                content_ok = False
            else:
                try:
                    content = bytes.fromhex(encoded)
                except ValueError:
                    content_ok = False
                else:
                    if not exact_content_metadata_ok(
                        stored_value,
                        content_columns,
                        size=len(content),
                        encoding=value.get("codeBytesEncoding"),
                        phase=value.get("capturePhase"),
                        field="codeBytesHex",
                    ):
                        content_ok = False
                    try:
                        content_id = int(value["codePageContentId"])
                        physical = int(str(value["physicalAddress"]), 0)
                        generation = int(value["pageGeneration"])
                    except (KeyError, TypeError, ValueError):
                        trace_reference_ok = False
                    else:
                        identity = (physical, content)
                        previous = trace_pages.get(content_id)
                        if content_id < 1 or generation < 0 or (
                            previous is not None and previous != identity
                        ):
                            trace_reference_ok = False
                        trace_pages[content_id] = identity
                        trace_generations.add((content_id, physical, generation))
        elif event_type == "trace-generation":
            if (
                value.get("exactContentResolved") is not True
                or value.get("dedupeDecision") != "generation-distinct-exact-content"
                or any(item is not None for item in content_columns)
            ):
                content_ok = False
            try:
                content_id = int(value["codePageContentId"])
                physical = int(str(value["physicalAddress"]), 0)
                generation = int(value["pageGeneration"])
            except (KeyError, TypeError, ValueError):
                trace_reference_ok = False
            else:
                known = trace_pages.get(content_id)
                if (
                    known is None
                    or known[0] != physical
                    or generation < 0
                    or int(value.get("previousPageGeneration", generation)) == generation
                ):
                    trace_reference_ok = False
                trace_generations.add((content_id, physical, generation))
        elif event_type == "exec-coverage":
            if structural_trace:
                resolved = value.get("exactInstructionResolved")
                if not isinstance(resolved, bool):
                    trace_reference_ok = False
                elif resolved:
                    try:
                        physical_page = int(str(value["physicalPageAddress"]), 0)
                        physical = int(str(value["physicalAddress"]), 0)
                        pc = int(str(value["pc"]), 0)
                        generation = int(value["pageGeneration"])
                        opcode = int(str(value["opcode"]), 0)
                    except (KeyError, TypeError, ValueError):
                        trace_reference_ok = False
                    else:
                        if (
                            physical_page & 0xFFF
                            or physical != physical_page + (pc & 0xFFF)
                            or generation < 0
                            or not 0 <= opcode <= 0xFFFFFFFF
                        ):
                            trace_reference_ok = False
                previous = value.get("previous")
                if value.get("newEdge") is True:
                    if not isinstance(previous, dict) or not isinstance(
                        previous.get("exactInstructionResolved"), bool
                    ):
                        trace_reference_ok = False
                    elif previous.get("exactInstructionResolved") is True:
                        try:
                            previous_page = int(
                                str(previous["physicalPageAddress"]), 0
                            )
                            previous_physical = int(
                                str(previous["physicalAddress"]), 0
                            )
                            previous_pc = int(str(previous["pc"]), 0)
                            previous_generation = int(previous["pageGeneration"])
                            previous_opcode = int(str(previous["opcode"]), 0)
                        except (KeyError, TypeError, ValueError):
                            trace_reference_ok = False
                        else:
                            if (
                                previous_page & 0xFFF
                                or previous_physical
                                != previous_page + (previous_pc & 0xFFF)
                                or previous_generation < 0
                                or not 0 <= previous_opcode <= 0xFFFFFFFF
                            ):
                                trace_reference_ok = False
            else:
                try:
                    content_id = int(value["codePageContentId"])
                    physical = int(str(value["physicalPageAddress"]), 0)
                    generation = int(value["pageGeneration"])
                except (KeyError, TypeError, ValueError):
                    trace_reference_ok = False
                else:
                    if (
                        trace_pages.get(content_id, (-1, ""))[0] != physical
                        or (
                            strict_trace_generations
                            and (content_id, physical, generation) not in trace_generations
                        )
                    ):
                        trace_reference_ok = False
                    previous = value.get("previous")
                    if isinstance(previous, dict) and previous.get("exactContentResolved") is True:
                        try:
                            previous_id = int(previous["codePageContentId"])
                            previous_physical = int(str(previous["physicalPageAddress"]), 0)
                            previous_generation = int(previous["pageGeneration"])
                        except (KeyError, TypeError, ValueError):
                            trace_reference_ok = False
                        else:
                            if (
                                trace_pages.get(previous_id, (-1, ""))[0] != previous_physical
                                or (
                                    strict_trace_generations
                                    and (previous_id, previous_physical, previous_generation)
                                    not in trace_generations
                                )
                            ):
                                trace_reference_ok = False
            if any(item is not None for item in content_columns):
                content_ok = False
        elif event_type == "range-snapshot":
            encoded = value.get("bytesHex")
            if not isinstance(encoded, str):
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
                    ):
                        content_ok = False
                    if not exact_content_metadata_ok(
                        stored_value,
                        content_columns,
                        size=len(content),
                        encoding="hex-uppercase",
                        phase="host-polled-range-snapshot",
                        field="bytesHex",
                        legacy_inline_columns=False,
                    ):
                        content_ok = False
        elif event_type == "baseline-snapshot":
            encoded = value.get("rdramBytesHex")
            if not isinstance(encoded, str):
                content_ok = False
            else:
                try:
                    content = bytes.fromhex(encoded)
                except ValueError:
                    content_ok = False
                else:
                    if (
                        len(content) != RDRAM_SIZE
                        or value.get("rdramSize") != RDRAM_SIZE
                        or value.get("rdramByteLength") != RDRAM_SIZE
                        or value.get("rdramBytesEncoding") != "hex-uppercase"
                        or value.get("ordering")
                        != "native-copy-before-first-captured-instruction"
                    ):
                        content_ok = False
                    if not exact_content_metadata_ok(
                        stored_value,
                        content_columns,
                        size=RDRAM_SIZE,
                        encoding="hex-uppercase",
                        phase="pre-execution-native-rdram-snapshot",
                        field="rdramBytesHex",
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
    _check(
        checks,
        "event-payload-encoding",
        payload_encoding_ok,
        "canonical JSON; legacy digest columns are not acceptance evidence",
    )
    if capture_version >= 3:
        for blob in connection.execute(
            "SELECT byte_size, content_bytes FROM content_blob"
        ):
            content = bytes(blob[1])
            if len(content) != int(blob[0]):
                content_ok = False
    _check(
        checks,
        "event-time-content",
        content_ok,
        "exact stored bytes, lengths, fields, encodings, and event phases",
    )
    if capture_version >= 4 and session["bridge_version"] in {
        "0.11.0", "0.12.0", BRIDGE_PROTOCOL_VERSION
    }:
        baseline_ok = len(baseline_sequences) == 1 and (
            not execution_sequences or baseline_sequences[0] < min(execution_sequences)
        )
        _check(
            checks,
            "atomic-4mib-baseline",
            baseline_ok,
            "exactly one native snapshot ordered before captured execution",
        )
    _check(
        checks,
        "trace-exact-content-references",
        trace_reference_ok,
        f"{len(trace_pages)} exact page identity record(s)",
    )
    if session["bridge_version"] == BRIDGE_PROTOCOL_VERSION:
        _check(
            checks,
            "stop-time-known-activity-summary",
            len(activity_sequences) == 1,
            f"{len(activity_sequences)} accepted summary event(s)",
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
    capture_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
    expected: list[dict[str, Any]] = []
    if capture_version >= 3:
        query = """
        SELECT sequence_id, frame_number, host_monotonic_ns, observed_utc,
               bridge_stream, bridge_epoch, bridge_event_sequence,
               recorder_batch_id, recorder_batch_index, bridge_event_type,
               ingestion_status, raw_payload_sha256, stored_payload_sha256,
               bridge_queue_remaining,
               bridge_dropped_total, event_time_content_sha256,
               event_time_content_size, event_time_content_encoding,
               event_time_content_phase, event_time_content_field, raw_payload_json
        FROM event_sequence ORDER BY sequence_id
        """
    else:
        query = """
        SELECT sequence_id, frame_number, host_monotonic_ns, observed_utc,
               bridge_stream, bridge_epoch, bridge_event_sequence,
               recorder_batch_id, recorder_batch_index, bridge_event_type,
               ingestion_status, raw_payload_sha256, raw_payload_sha256,
               bridge_queue_remaining,
               bridge_dropped_total, event_time_content_sha256,
               event_time_content_size, event_time_content_encoding,
               event_time_content_phase, NULL, raw_payload_json
        FROM event_sequence ORDER BY sequence_id
        """
    for row in connection.execute(query):
        item = {
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
                "bridgeQueueRemaining": row[13],
                "bridgeDroppedTotal": row[14],
                "eventTimeContentSha256": row[15],
                "eventTimeContentSize": row[16],
                "eventTimeContentEncoding": row[17],
                "eventTimeContentPhase": row[18],
                "payload": json.loads(row[20]),
            }
        if capture_version >= 3:
            item["storedPayloadSha256"] = row[12]
            item["eventTimeContentField"] = row[19]
        expected.append(item)
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
    del repository_root  # retained for CLI/API compatibility with historical verification
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
        capture_version = int(connection.execute("PRAGMA user_version").fetchone()[0])
        _check(
            checks,
            "capture-schema",
            not schema_errors,
            "; ".join(schema_errors) or f"v{capture_version}",
        )
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

        manifest_path = session_dir / "manifest.json"
        if manifest_path.is_file():
            try:
                manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                _diagnostic(
                    checks,
                    "session-context-manifest",
                    False,
                    "context file is unreadable; capture.sqlite remains authoritative",
                )
            else:
                historical_core = manifest.get("manifestCore")
                context_session = manifest.get("session")
                if not isinstance(context_session, dict) and isinstance(historical_core, dict):
                    context_session = historical_core.get("session")
                fields = (
                    "session_id",
                    "bridge_version",
                    "bridge_epoch",
                    "bridge_next_sequence_start",
                    "bridge_next_sequence_end",
                    "rom_normalized_sha256",
                )
                context_matches = isinstance(context_session, dict) and all(
                    context_session.get(field) == session[field] for field in fields
                )
                expected_reference = (
                    f"capture:{session['session_id']}:{session['bridge_epoch']}:"
                    f"{session['bridge_next_sequence_start']}:"
                    f"{session['bridge_next_sequence_end']}"
                )
                if manifest.get("schema") == "ob64-total-resolver-session-context.v2":
                    context_matches = (
                        context_matches
                        and manifest.get("captureReference") == expected_reference
                    )
                _diagnostic(
                    checks,
                    "session-context-manifest",
                    context_matches,
                    "context only; legacy manifest/file digests are not acceptance evidence",
                )
        else:
            _diagnostic(
                checks,
                "session-context-manifest",
                False,
                f"optional context file is missing: {manifest_path}",
            )
        mirror_path = session_dir / "events.ndjson"
        _diagnostic(
            checks,
            "event-mirror-context",
            mirror_path.is_file(),
            "optional NDJSON is never authoritative and is not read during ingestion",
        )
    finally:
        connection.close()
    return SessionVerification(
        all(check["status"] != "FAIL" for check in checks),
        tuple(checks),
        timeline_sha,
    )
