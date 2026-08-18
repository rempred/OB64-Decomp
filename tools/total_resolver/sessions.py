"""Durable lifecycle management for observation-only capture sessions."""

from __future__ import annotations

from contextlib import suppress
from dataclasses import dataclass
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import sys
import time
from typing import Any, Callable, Mapping
import uuid

from . import __version__
from .bridge_events import DrainBatch, parse_drain_response
from .capture_db import CaptureStore, RawEventInput, SessionMetadata
from .contracts import CaptureMode, InterventionPolicy
from .inventory import config_path, load_inventory, repository_root, sha256_file
from .manifest import finalize_manifest
from .pj64_client import DEFAULT_HOST, DEFAULT_PORT, Pj64Client
from .protocol import BridgeProtocolError
from .recorder import (
    Pj64CaptureRecorder,
    RecorderSettings,
    SafetyRangeSpec,
    verify_observation_preflight,
)
from .replay import write_timeline
from .schema import open_capture_database, utc_now
from .verify import SessionVerification, verify_session


SESSION_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")
WORKER_FILE = "worker.json"
ACTIVE_FILE = "active.json"
CAPTURE_FILE = "capture.sqlite"


@dataclass(frozen=True)
class SessionConnection:
    host: str = DEFAULT_HOST
    port: int = DEFAULT_PORT
    timeout: float = 5.0


@dataclass(frozen=True)
class SessionLocation:
    root: Path
    session_id: str

    @property
    def directory(self) -> Path:
        return self.root / self.session_id

    @property
    def database(self) -> Path:
        return self.directory / CAPTURE_FILE

    @property
    def worker_state(self) -> Path:
        return self.directory / WORKER_FILE


def sessions_root(explicit: Path | None = None) -> Path:
    return (explicit or repository_root() / "build" / "total-resolver" / "sessions").resolve()


def _validate_session_id(session_id: str) -> str:
    if not SESSION_ID_PATTERN.fullmatch(session_id):
        raise ValueError(f"invalid Total Resolver session ID: {session_id!r}")
    return session_id


def session_location(root: Path, session_id: str) -> SessionLocation:
    return SessionLocation(root.resolve(), _validate_session_id(session_id))


def _read_json(path: Path) -> dict[str, Any] | None:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return None
    return value if isinstance(value, dict) else None


def _write_json(path: Path, value: Mapping[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temporary.replace(path)


def _update_worker_state(location: SessionLocation, state: str, **values: Any) -> dict[str, Any]:
    current = _read_json(location.worker_state) or {}
    current.update(
        {
            "schema": "ob64-total-resolver-worker-state.v1",
            "sessionId": location.session_id,
            "sessionDirectory": str(location.directory),
            "state": state,
            "updatedUtc": utc_now(),
            **values,
        }
    )
    _write_json(location.worker_state, current)
    return current


def _write_active(location: SessionLocation, state: Mapping[str, Any]) -> None:
    _write_json(
        location.root / ACTIVE_FILE,
        {
            "schema": "ob64-total-resolver-active-session.v1",
            "sessionId": location.session_id,
            "sessionDirectory": str(location.directory),
            "workerState": str(location.worker_state),
            "pid": state.get("pid"),
            "state": state.get("state"),
            "updatedUtc": utc_now(),
        },
    )


def active_session_id(root: Path) -> str | None:
    value = _read_json(root.resolve() / ACTIVE_FILE)
    session_id = value.get("sessionId") if value is not None else None
    return session_id if isinstance(session_id, str) and SESSION_ID_PATTERN.fullmatch(session_id) else None


def _pid_is_alive(pid: Any) -> bool:
    if isinstance(pid, bool) or not isinstance(pid, int) or pid <= 0:
        return False
    if os.name != "nt":
        try:
            os.kill(pid, 0)
        except (OSError, ProcessLookupError):
            return False
        return True

    # Query-only process access. Never signal or terminate the process.
    import ctypes

    process_query_limited_information = 0x1000
    still_active = 259
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    handle = kernel32.OpenProcess(process_query_limited_information, False, pid)
    if not handle:
        return False
    try:
        exit_code = ctypes.c_ulong()
        return bool(kernel32.GetExitCodeProcess(handle, ctypes.byref(exit_code))) and (
            exit_code.value == still_active
        )
    finally:
        kernel32.CloseHandle(handle)


def _git(root: Path, *arguments: str) -> str:
    completed = subprocess.run(
        ("git", "-C", str(root), *arguments),
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout.strip()


def _git_identity(root: Path) -> dict[str, Any]:
    return {
        "branch": _git(root, "branch", "--show-current"),
        "commit": _git(root, "rev-parse", "HEAD").upper(),
        "dirty": bool(_git(root, "status", "--porcelain", "--untracked-files=normal")),
    }


def _project64_root() -> Path | None:
    configured = os.environ.get("OB64_PROJECT64_ROOT")
    if configured:
        candidate = Path(configured).resolve()
    else:
        candidate = (repository_root().parent.parent / "project64").resolve()
    return candidate if (candidate / ".git").exists() else None


def default_safety_ranges() -> tuple[SafetyRangeSpec, ...]:
    """Probe one 4 KiB entry page for every accepted overlay text start."""

    source = repository_root() / "config" / "overlays" / "us_rev0.json"
    value = json.loads(source.read_text(encoding="utf-8"))
    descriptors = value.get("descriptors")
    if not isinstance(descriptors, list) or not descriptors:
        raise ValueError("overlay configuration has no descriptors for safety-range derivation")
    text_pages: set[int] = set()
    for descriptor in descriptors:
        if not isinstance(descriptor, Mapping) or not isinstance(descriptor.get("fields"), Mapping):
            raise ValueError("overlay descriptor is malformed")
        fields = descriptor["fields"]
        text_pages.add(int(str(fields["textStart"]), 0) & ~0xFFF)
    if not text_pages or min(text_pages) < 0x80000000 or max(text_pages) >= 0x80800000:
        raise ValueError("overlay text-entry safety pages fall outside cached RDRAM")
    source_label = "config/overlays/us_rev0.json:unique-descriptor-text-entry-pages"
    return tuple(
        SafetyRangeSpec(
            range_id=f"overlay-text-entry-{address:08X}",
            live_address=address,
            size=0x1000,
            label=f"Overlay text-entry page 0x{address:08X}",
            expected_class="executable",
            reason="Detect changes at accepted overlay text-entry pages missed by loader hooks",
            definition_source=source_label,
        )
        for address in sorted(text_pages)
    )


def _new_session_id() -> str:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S.%fZ")
    return f"{stamp}-{uuid.uuid4().hex[:8]}"


def _session_row(path: Path) -> sqlite3.Row:
    connection = open_capture_database(path, read_only=True)
    try:
        row = connection.execute("SELECT * FROM session").fetchone()
        if row is None:
            raise ValueError(f"capture database has no session row: {path}")
        return row
    finally:
        connection.close()


def list_open_sessions(root: Path) -> list[SessionLocation]:
    resolved = root.resolve()
    if not resolved.is_dir():
        return []
    result: list[SessionLocation] = []
    for database in sorted(resolved.glob(f"*/{CAPTURE_FILE}")):
        try:
            row = _session_row(database)
        except (OSError, sqlite3.Error, ValueError):
            continue
        if row["closure_status"] == "open":
            result.append(session_location(resolved, str(row["session_id"])))
    return result


def _metadata(preflight: Any, connection: SessionConnection, session_id: str) -> SessionMetadata:
    decomp = _git_identity(repository_root())
    project64_root = _project64_root()
    project64 = _git_identity(project64_root) if project64_root is not None else None
    freeze = load_inventory()
    static_sources = {
        "schema": "ob64-total-resolver-session-static-sources.v1",
        "sourceFreezeSha256": sha256_file(config_path()),
        "sourceFreeze": freeze,
        "captureProfile": {
            "overlayConfigurationPath": "config/overlays/us_rev0.json",
            "overlayConfigurationSha256": sha256_file(
                repository_root() / "config" / "overlays" / "us_rev0.json"
            ),
            "safetyRanges": [
                {
                    "rangeId": item.range_id,
                    "liveAddress": item.live_address,
                    "size": item.size,
                }
                for item in default_safety_ranges()
            ],
        },
    }
    identity = preflight.rom_identity
    return SessionMetadata(
        session_id=session_id,
        started_utc=utc_now(),
        tool_version=__version__,
        tool_git_commit=decomp["commit"],
        decomp_git_commit=decomp["commit"],
        decomp_dirty=bool(decomp["dirty"]),
        project64_branch=project64["branch"] if project64 is not None else None,
        project64_git_commit=project64["commit"] if project64 is not None else None,
        bridge_version=preflight.bridge_version,
        bridge_port=preflight.bridge_port,
        bridge_epoch=preflight.bridge_epoch,
        bridge_next_sequence_start=preflight.bridge_next_sequence,
        cpu_core=preflight.cpu_core,
        rom_crc1=identity.get("crc1"),
        rom_crc2=identity.get("crc2"),
        rom_country=identity.get("country"),
        rom_version=identity.get("version"),
        rom_normalized_sha256=identity.get("normalizedSha256"),
        static_sources=static_sources,
        capture_mode=CaptureMode.MANUAL_PLAY,
        intervention_policy=InterventionPolicy.OBSERVATION_ONLY,
        notes=(
            f"observation-only bridge endpoint {connection.host}:{connection.port}; "
            "frames and recorder timestamps are context only"
        ),
    )


def create_session(
    *,
    root: Path | None = None,
    connection: SessionConnection = SessionConnection(),
    foreground: bool = False,
) -> dict[str, Any]:
    resolved_root = sessions_root(root)
    resolved_root.mkdir(parents=True, exist_ok=True)

    for open_location in list_open_sessions(resolved_root):
        state = _read_json(open_location.worker_state) or {}
        if _pid_is_alive(state.get("pid")):
            raise RuntimeError(
                f"capture session {open_location.session_id} is already running "
                f"(PID {state.get('pid')})"
            )
        recover_session(
            open_location.session_id,
            root=resolved_root,
            connection=connection,
            refuse_live_worker=False,
        )

    freeze = load_inventory()
    expected_rom = str(freeze["target"]["normalizedRomSha256"])
    client = Pj64Client(connection.host, connection.port, connection.timeout)
    try:
        preflight = verify_observation_preflight(client, expected_rom)
    finally:
        client.close()

    session_id = _new_session_id()
    location = session_location(resolved_root, session_id)
    store = CaptureStore.create(location.database, _metadata(preflight, connection, session_id))
    store.close_connection()
    state = _update_worker_state(
        location,
        "prepared",
        pid=None,
        host=connection.host,
        port=connection.port,
        timeout=connection.timeout,
    )
    _write_active(location, state)

    if foreground:
        exit_code = run_session_worker(location, connection)
        return {"sessionId": session_id, "sessionDirectory": str(location.directory), "exitCode": exit_code}

    log_stream = (location.directory / "session.log").open("a", encoding="utf-8")
    command = (
        sys.executable,
        "-m",
        "tools.total_resolver.session_worker",
        "--root",
        str(resolved_root),
        "--session-id",
        session_id,
        "--host",
        connection.host,
        "--port",
        str(connection.port),
        "--timeout",
        str(connection.timeout),
    )
    popen_kwargs: dict[str, Any] = {
        "cwd": str(repository_root()),
        "stdin": subprocess.DEVNULL,
        "stdout": log_stream,
        "stderr": subprocess.STDOUT,
        "close_fds": True,
    }
    if os.name == "nt":
        popen_kwargs["creationflags"] = (
            subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.CREATE_NO_WINDOW
        )
    else:
        popen_kwargs["start_new_session"] = True
    try:
        process = subprocess.Popen(command, **popen_kwargs)
    finally:
        log_stream.close()

    current = _read_json(location.worker_state) or {}
    if current.get("state") in {"running", "failed", "interrupted", "closed", "closed-invalid"}:
        state = current
    else:
        state = _update_worker_state(location, "starting", pid=process.pid)
    _write_active(location, state)
    deadline = time.monotonic() + max(5.0, connection.timeout * 3.0)
    while time.monotonic() < deadline:
        state = _read_json(location.worker_state) or state
        if state.get("state") in {"running", "failed", "interrupted", "closed", "closed-invalid"}:
            break
        if not _pid_is_alive(process.pid):
            break
        time.sleep(0.05)
    if state.get("state") != "running":
        raise RuntimeError(
            f"capture worker did not become ready: {state.get('state')} "
            f"({state.get('error') or 'see session.log'})"
        )
    _write_active(location, state)
    return {
        "sessionId": session_id,
        "sessionDirectory": str(location.directory),
        "pid": process.pid,
        "state": state["state"],
        "bridgeEpoch": preflight.bridge_epoch,
        "bridgeNextSequenceStart": preflight.bridge_next_sequence,
        "observationOnly": True,
    }


def _finalize_store(
    store: CaptureStore,
    location: SessionLocation,
) -> SessionVerification:
    store.checkpoint()
    write_timeline(store.connection, location.directory / "timeline.json")
    finalize_manifest(store.connection, location.directory, repository_root())
    result = verify_session(location.directory, repository_root())
    _write_json(location.directory / "verification.json", result.to_dict())
    return result


def run_session_worker(location: SessionLocation, connection: SessionConnection) -> int:
    """Run one worker until a stop request or an evidence-breaking failure."""

    state = _update_worker_state(location, "starting", pid=os.getpid())
    _write_active(location, state)
    store = CaptureStore.open(location.database)
    client = Pj64Client(connection.host, connection.port, connection.timeout)
    recorder = Pj64CaptureRecorder(
        client,
        store,
        RecorderSettings(
            str(_session_row(location.database)["rom_normalized_sha256"]),
            safety_ranges=default_safety_ranges(),
        ),
    )
    closure = "interrupted"
    error: str | None = None
    verification: SessionVerification | None = None
    try:
        recorder.start()
        state = _update_worker_state(
            location,
            "running",
            pid=os.getpid(),
            bridgeEpoch=recorder.preflight.bridge_epoch if recorder.preflight else None,
        )
        _write_active(location, state)
        recorder.run()
        recorder.stop_instrumentation()
        recorder.drain_to_empty()
        terminal = recorder.append_terminal_event("closed")
        store.close_open_region_lifetimes(terminal, interrupted=False)
        store.close_session("closed")
        closure = "closed"
    except BaseException as exc:  # Ensure even Ctrl+C becomes an explicit interrupted session.
        error = f"{type(exc).__name__}: {exc}"
        with suppress(Exception):
            store.set_continuity_broken(error)
        if recorder.started:
            with suppress(Exception):
                recorder.stop_instrumentation()
            with suppress(Exception):
                recorder.drain_to_empty()
            try:
                terminal = recorder.append_terminal_event("interrupted")
            except Exception:
                terminal = _append_interruption_event(store, error)
        else:
            terminal = _append_interruption_event(store, error)
        with suppress(Exception):
            store.close_open_region_lifetimes(terminal, interrupted=True)
        with suppress(Exception):
            store.close_session("interrupted", note=error)
    finally:
        client.close()
        state = _update_worker_state(
            location,
            "finalizing",
            pid=os.getpid(),
            error=error,
            closureStatus=closure,
        )
        _write_active(location, state)
        try:
            verification = _finalize_store(store, location)
        except Exception as exc:
            error = f"{error + '; ' if error else ''}finalization failed: {type(exc).__name__}: {exc}"
        finally:
            store.close_connection()

    if closure == "closed" and verification is not None and verification.ok:
        final_state = "closed"
        exit_code = 0
    elif closure == "closed":
        final_state = "closed-invalid"
        exit_code = 1
    else:
        final_state = "interrupted"
        exit_code = 1
    state = _update_worker_state(
        location,
        final_state,
        pid=os.getpid(),
        error=error,
        verification=(verification.to_dict() if verification is not None else None),
    )
    _write_active(location, state)
    return exit_code


def _append_interruption_event(store: CaptureStore, note: str) -> int:
    row = store.connection.execute(
        "SELECT bridge_epoch, bridge_next_sequence_start FROM session WHERE session_id=?",
        (store.session_id,),
    ).fetchone()
    if row is None:
        raise RuntimeError("session row disappeared during interruption handling")
    end = _covered_extent(store.connection, int(row["bridge_next_sequence_start"]))
    store.set_bridge_next_sequence_end(end)
    batch_id = _next_batch_id(store.connection)
    stored = store.append_event_batch(
        (
            RawEventInput(
                frame_number=_latest_frame(store.connection),
                host_monotonic_ns=_next_host_ns(store.connection),
                observed_utc=utc_now(),
                bridge_stream="recorder",
                bridge_epoch=str(row["bridge_epoch"]),
                bridge_event_sequence=None,
                recorder_batch_id=batch_id,
                recorder_batch_index=0,
                bridge_event_type="session-interruption",
                payload={
                    "kind": "session-interruption",
                    "closureStatus": "interrupted",
                    "continuityStatus": "broken",
                    "bridgeEpoch": row["bridge_epoch"],
                    "bridgeNextSequenceEnd": end,
                    "reason": note,
                    "smallestNextEvidence": "start a new pristine bridge session",
                },
                ingestion_status="unresolved",
            ),
        )
    )
    return stored[0].sequence_id


def _next_batch_id(connection: sqlite3.Connection) -> int:
    row = connection.execute("SELECT COALESCE(MAX(recorder_batch_id),0)+1 FROM event_sequence").fetchone()
    return int(row[0])


def _next_host_ns(connection: sqlite3.Connection) -> int:
    row = connection.execute("SELECT COALESCE(MAX(host_monotonic_ns),-1) FROM event_sequence").fetchone()
    return max(time.monotonic_ns(), int(row[0]) + 1)


def _latest_frame(connection: sqlite3.Connection) -> int | None:
    row = connection.execute(
        """
        SELECT frame_number FROM (
            SELECT frame_number, sequence_id AS ordering FROM event_sequence
            WHERE frame_number IS NOT NULL
            UNION ALL
            SELECT frame_number, observed_after_sequence AS ordering FROM frame_sample
        ) ORDER BY ordering DESC LIMIT 1
        """
    ).fetchone()
    return int(row[0]) if row is not None and row[0] is not None else None


def _covered_segments(connection: sqlite3.Connection) -> list[tuple[int, int]]:
    segments = [
        (int(row[0]), int(row[0]))
        for row in connection.execute(
            """
            SELECT bridge_event_sequence FROM event_sequence
            WHERE bridge_event_sequence IS NOT NULL
            """
        )
    ]
    segments.extend(
        (int(row[0]), int(row[1]))
        for row in connection.execute(
            "SELECT first_bridge_sequence, last_bridge_sequence FROM bridge_loss_range"
        )
    )
    return sorted(segments)


def _covered_extent(connection: sqlite3.Connection, start: int) -> int:
    end = start
    for first, last in _covered_segments(connection):
        if last < end:
            continue
        if first > end:
            break
        end = max(end, last + 1)
    return end


def _missing_ranges(
    connection: sqlite3.Connection,
    start: int,
    end: int,
) -> list[tuple[int, int]]:
    cursor = start
    missing: list[tuple[int, int]] = []
    for first, last in _covered_segments(connection):
        if last < cursor or first >= end:
            continue
        if first > cursor:
            missing.append((cursor, min(first, end) - 1))
        cursor = max(cursor, last + 1)
        if cursor >= end:
            break
    if cursor < end:
        missing.append((cursor, end - 1))
    return missing


def _append_recovery_batch(store: CaptureStore, batch: DrainBatch) -> None:
    known = {
        int(row[0])
        for row in store.connection.execute(
            "SELECT bridge_event_sequence FROM event_sequence WHERE bridge_event_sequence IS NOT NULL"
        )
    }
    batch_id = _next_batch_id(store.connection)
    host_ns = _next_host_ns(store.connection)
    inputs: list[RawEventInput] = []
    for index, event in enumerate(batch.events):
        if event.bridge_sequence in known:
            continue
        inputs.append(
            RawEventInput(
                frame_number=event.frame_number,
                host_monotonic_ns=host_ns + index,
                observed_utc=utc_now(),
                bridge_stream=event.bridge_stream,
                bridge_epoch=event.bridge_epoch,
                bridge_event_sequence=event.bridge_sequence,
                recorder_batch_id=batch_id,
                recorder_batch_index=index,
                bridge_event_type=event.event_type,
                payload=event.payload,
                bridge_queue_remaining=batch.remaining,
                bridge_dropped_total=batch.dropped,
                event_time_content_sha256=event.event_time_content_sha256,
                event_time_content_size=event.event_time_content_size,
                event_time_content_encoding=event.event_time_content_encoding,
                event_time_content_phase=event.event_time_content_phase,
            )
        )
    store.append_event_batch(inputs)
    for item in batch.dropped_ranges:
        store.record_bridge_loss_range(
            bridge_epoch=batch.bridge_epoch,
            first_sequence=item.first_sequence,
            last_sequence=item.last_sequence,
        )


def _record_recovery_gaps(
    store: CaptureStore,
    bridge_epoch: str,
    start: int,
    end: int,
) -> None:
    for first, last in _missing_ranges(store.connection, start, end):
        batch_id = _next_batch_id(store.connection)
        marker = store.append_event_batch(
            (
                RawEventInput(
                    frame_number=_latest_frame(store.connection),
                    host_monotonic_ns=_next_host_ns(store.connection),
                    observed_utc=utc_now(),
                    bridge_stream="recorder",
                    bridge_epoch=bridge_epoch,
                    bridge_event_sequence=None,
                    recorder_batch_id=batch_id,
                    recorder_batch_index=0,
                    bridge_event_type="event-loss",
                    payload={
                        "kind": "event-loss",
                        "bridgeEpoch": bridge_epoch,
                        "firstDroppedBridgeSequence": first,
                        "lastDroppedBridgeSequence": last,
                        "droppedCount": last - first + 1,
                        "description": (
                            "recorder recovery inferred events delivered or created but not persisted"
                        ),
                        "smallestNextEvidence": "repeat the affected transition in a new session",
                    },
                    ingestion_status="loss-marker",
                ),
            )
        )[0]
        store.record_bridge_loss_range(
            bridge_epoch=bridge_epoch,
            first_sequence=first,
            last_sequence=last,
            source="recorder-recovery-gap",
        )
        if marker.sequence_id < 1:
            raise AssertionError("recovery loss marker was not stored")


def recover_session(
    session_id: str,
    *,
    root: Path | None = None,
    connection: SessionConnection = SessionConnection(),
    refuse_live_worker: bool = True,
    client_factory: Callable[[str, int, float], Any] = Pj64Client,
) -> dict[str, Any]:
    """Close a dead open session without ever treating restart as continuous."""

    location = session_location(sessions_root(root), session_id)
    state = _read_json(location.worker_state) or {}
    if refuse_live_worker and _pid_is_alive(state.get("pid")):
        raise RuntimeError(f"refusing to recover live capture worker PID {state.get('pid')}")
    store = CaptureStore.open(location.database)
    row = store.connection.execute("SELECT * FROM session").fetchone()
    if row is None:
        store.close_connection()
        raise ValueError("capture database has no session row")
    if row["closure_status"] != "open":
        store.close_connection()
        return session_status(session_id, root=location.root)

    epoch = str(row["bridge_epoch"])
    start = int(row["bridge_next_sequence_start"])
    final_next = _covered_extent(store.connection, start)
    notes = ["dead recorder process recovered as an interrupted session"]
    cleanup_confirmed = False
    client = client_factory(connection.host, connection.port, connection.timeout)
    try:
        client.connect()
        status = client.status()
        if status.get("bridgeEpoch") != epoch:
            notes.append("bridge epoch changed; the old instance cannot be drained")
        else:
            for watch in store.connection.execute(
                """
                SELECT bridge_watch_id FROM watch_definition
                WHERE ownership_scope='recorder-owned' AND bridge_watch_id IS NOT NULL
                """
            ):
                with suppress(Exception):
                    client.remove_watch(int(watch[0]))
            if store.connection.execute(
                "SELECT 1 FROM watch_definition WHERE watch_id='native-pi-dma'"
            ).fetchone():
                with suppress(Exception):
                    client.dma_stop()

            for _ in range(128):
                batch = parse_drain_response(client.drain_events(4096))
                if batch.bridge_epoch != epoch:
                    raise BridgeProtocolError("bridge epoch changed during interrupted-session drain")
                _append_recovery_batch(store, batch)
                final_next = batch.next_event_sequence
                if batch.remaining == 0:
                    cleanup_confirmed = True
                    break
            else:
                notes.append("bounded recovery drain did not empty the unified queue")
    except Exception as exc:
        notes.append(f"live recovery unavailable: {type(exc).__name__}: {exc}")
    finally:
        with suppress(Exception):
            client.close()

    _record_recovery_gaps(store, epoch, start, final_next)
    store.set_continuity_broken("; ".join(notes))
    store.set_bridge_next_sequence_end(final_next)
    terminal = _append_interruption_event(store, "; ".join(notes))
    if cleanup_confirmed:
        store.mark_recorder_watches_removed(terminal)
    store.close_open_region_lifetimes(terminal, interrupted=True)
    store.close_session("interrupted", note="; ".join(notes))
    verification = _finalize_store(store, location)
    store.close_connection()
    state = _update_worker_state(
        location,
        "interrupted",
        pid=state.get("pid"),
        error="; ".join(notes),
        verification=verification.to_dict(),
    )
    _write_active(location, state)
    return session_status(session_id, root=location.root)


def _resolve_session(root: Path, session_id: str | None) -> SessionLocation:
    selected = session_id or active_session_id(root)
    if selected is None:
        raise RuntimeError("there is no active Total Resolver session")
    location = session_location(root, selected)
    if not location.database.is_file():
        raise FileNotFoundError(f"capture session does not exist: {selected}")
    return location


def session_status(session_id: str | None = None, *, root: Path | None = None) -> dict[str, Any]:
    resolved_root = sessions_root(root)
    location = _resolve_session(resolved_root, session_id)
    state = _read_json(location.worker_state) or {}
    connection = open_capture_database(location.database, read_only=True)
    try:
        row = connection.execute("SELECT * FROM session").fetchone()
        assert row is not None
        events = int(connection.execute("SELECT COUNT(*) FROM event_sequence").fetchone()[0])
        machine_events = int(
            connection.execute(
                "SELECT COUNT(*) FROM event_sequence WHERE bridge_event_sequence IS NOT NULL"
            ).fetchone()[0]
        )
        loss = int(
            connection.execute(
                "SELECT COALESCE(SUM(dropped_count),0) FROM bridge_loss_range"
            ).fetchone()[0]
        )
        markers = int(connection.execute("SELECT COUNT(*) FROM semantic_marker").fetchone()[0])
        latest_frame = _latest_frame(connection)
    finally:
        connection.close()
    return {
        "sessionId": location.session_id,
        "sessionDirectory": str(location.directory),
        "workerState": state.get("state", "unknown"),
        "workerPid": state.get("pid"),
        "workerAlive": _pid_is_alive(state.get("pid")),
        "closureStatus": row["closure_status"],
        "continuityStatus": row["continuity_status"],
        "startedUtc": row["started_utc"],
        "endedUtc": row["ended_utc"],
        "bridgeVersion": row["bridge_version"],
        "bridgeEpoch": row["bridge_epoch"],
        "bridgeNextSequenceStart": row["bridge_next_sequence_start"],
        "bridgeNextSequenceEnd": row["bridge_next_sequence_end"],
        "eventCount": events,
        "machineEventCount": machine_events,
        "droppedSequenceCount": loss,
        "markerCount": markers,
        "latestFrame": latest_frame,
        "error": state.get("error"),
    }


def request_session_stop(
    session_id: str | None = None,
    *,
    root: Path | None = None,
    wait_seconds: float = 120.0,
) -> dict[str, Any]:
    resolved_root = sessions_root(root)
    location = _resolve_session(resolved_root, session_id)
    store = CaptureStore.open(location.database, mirror_events=False)
    try:
        row = store.connection.execute("SELECT closure_status FROM session").fetchone()
        if row is not None and row[0] == "open":
            store.request_stop()
    finally:
        store.close_connection()

    deadline = time.monotonic() + max(0.0, wait_seconds)
    while time.monotonic() < deadline:
        result = session_status(location.session_id, root=resolved_root)
        if result["closureStatus"] == "open" and not result["workerAlive"]:
            return recover_session(
                location.session_id,
                root=resolved_root,
                refuse_live_worker=False,
            )
        if result["closureStatus"] != "open" and not result["workerAlive"]:
            return result
        time.sleep(0.1)
    return session_status(location.session_id, root=resolved_root)


def add_session_annotation(
    text: str,
    *,
    marker_type: str,
    session_id: str | None = None,
    root: Path | None = None,
) -> dict[str, Any]:
    if marker_type not in {
        "stable-state",
        "transition-start",
        "transition-end",
        "note",
        "visible-action",
    }:
        raise ValueError(f"unsupported marker type: {marker_type}")
    resolved_root = sessions_root(root)
    location = _resolve_session(resolved_root, session_id)
    store = CaptureStore.open(location.database, mirror_events=False)
    try:
        marker_id = store.add_marker(
            text,
            marker_type=marker_type,
            frame_number=_latest_frame(store.connection),
            note=text if marker_type == "note" else None,
        )
    finally:
        store.close_connection()
    return {"sessionId": location.session_id, "markerId": marker_id, "markerType": marker_type}


def verify_named_session(
    session_id: str,
    *,
    root: Path | None = None,
) -> SessionVerification:
    location = _resolve_session(sessions_root(root), session_id)
    return verify_session(location.directory, repository_root())
