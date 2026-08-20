"""Observation-only Project64 raw-session recorder.

The recorder preserves bridge evidence and capture-health facts. It intentionally
does not derive loader, placement, or runtime-atlas claims.
"""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
from pathlib import Path
import time
from typing import Any, Callable, Mapping, Protocol

from .addressing import RDRAM_SIZE
from .bridge_events import DrainBatch, parse_drain_response
from .capture_db import CaptureStore, RawEventInput
from .identities import rom_identity_from_file
from .knowledge import empty_novelty_frontier
from .protocol import BRIDGE_PROTOCOL_VERSION, BridgeProtocolError
from .schema import utc_now


class RecorderClient(Protocol):
    handshake_result: Any

    def connect(self) -> Any: ...

    def status(self) -> dict[str, Any]: ...

    def health(self) -> dict[str, Any]: ...

    def execution(self) -> dict[str, Any]: ...

    def drain_events(self, maximum: int | None = None) -> dict[str, Any]: ...

    def dma_start(
        self,
        physical_start: int = 0,
        physical_end: int = RDRAM_SIZE,
        *,
        maximum: int = 8192,
        skip_length: int = 0,
        context_words: int = 0,
    ) -> dict[str, Any]: ...

    def dma_set_rom_range(self, rom_start: int, rom_end: int) -> dict[str, Any]: ...

    def dma_stop(self) -> dict[str, Any]: ...

    def load_novelty_frontier(self, frontier: Any, *, edge_batch_size: int = 512) -> dict[str, Any]: ...

    def capture_start(self, frontier_identity: str) -> dict[str, Any]: ...

    def capture_stop(self) -> dict[str, Any]: ...

    def cold_boot_arm(
        self, frontier_identity: str, expected_crc1: str, expected_crc2: str
    ) -> dict[str, Any]: ...

    def cold_boot_status(self) -> dict[str, Any]: ...

    def cold_boot_cancel(self) -> dict[str, Any]: ...

    def baseline_status(self) -> dict[str, Any]: ...

    def read_baseline_snapshot(self) -> Any: ...

    def release_baseline_snapshot(self, snapshot_id: str) -> dict[str, Any]: ...

    def install_watch(
        self, kind: str, address: int, *, size: int = 1, label: str = ""
    ) -> dict[str, Any]: ...

    def remove_watch(self, bridge_watch_id: int) -> dict[str, Any]: ...

    def memory_fingerprints(self, specs: Any) -> Any: ...

    def read_block(self, address: int, size: int) -> Any: ...


@dataclass(frozen=True)
class WatchSpec:
    watch_id: str
    kind: str
    address: int
    size: int
    address_space: str
    label: str
    reason: str
    definition_source: str
    expected_event_rate: str | None = None


@dataclass(frozen=True)
class SafetyRangeSpec:
    range_id: str
    live_address: int
    size: int
    label: str
    expected_class: str
    reason: str
    definition_source: str

    def __post_init__(self) -> None:
        if not self.range_id or any(character.isspace() for character in self.range_id):
            raise ValueError("safety range ID must be nonempty and contain no whitespace")
        if not 0x80000000 <= self.live_address < 0x80000000 + RDRAM_SIZE:
            raise ValueError("safety range must start in cached vanilla OB64 RDRAM KSEG0")
        if not 0 < self.size <= 0x100000:
            raise ValueError("safety range size must be 1..1 MiB")
        if self.live_address + self.size > 0x80000000 + RDRAM_SIZE:
            raise ValueError("safety range must fit in vanilla OB64's 4 MiB RDRAM")
        if self.expected_class not in {"executable", "data", "mixed", "unknown"}:
            raise ValueError("safety range expected_class is invalid")


@dataclass(frozen=True)
class RecorderSettings:
    expected_rom_sha256: str
    poll_interval_seconds: float = 0.01
    drain_limit: int = 4096
    dma_queue_limit: int = 65536
    dma_physical_start: int = 0
    dma_physical_end: int = RDRAM_SIZE
    dma_rom_start: int = 0
    dma_rom_end: int = 0x10000000
    dma_context_words: int = 8
    frame_sample_interval_seconds: float = 0.25
    health_interval_seconds: float = 1.0
    watches: tuple[WatchSpec, ...] = ()
    safety_range_interval_seconds: float = 0.25
    safety_ranges: tuple[SafetyRangeSpec, ...] = ()
    novelty_frontier: Any | None = None

    def __post_init__(self) -> None:
        expected = self.expected_rom_sha256.upper()
        if len(expected) != 64 or any(character not in "0123456789ABCDEF" for character in expected):
            raise ValueError("expected_rom_sha256 must be a 64-character hexadecimal digest")
        if self.poll_interval_seconds < 0:
            raise ValueError("poll_interval_seconds must be nonnegative")
        if self.drain_limit < 1 or self.dma_queue_limit < 1:
            raise ValueError("drain limits must be positive")
        if not 0 <= self.dma_physical_start < self.dma_physical_end <= RDRAM_SIZE:
            raise ValueError("DMA physical range must be inside vanilla OB64's 4 MiB RDRAM")
        if not 0 <= self.dma_rom_start < self.dma_rom_end <= 0x10000000:
            raise ValueError("DMA ROM range must be nonempty")
        if not 0 <= self.dma_context_words <= 128:
            raise ValueError("dma_context_words must be 0..128")
        if self.safety_range_interval_seconds <= 0:
            raise ValueError("safety_range_interval_seconds must be positive")
        if sum(item.size for item in self.safety_ranges) > RDRAM_SIZE:
            raise ValueError("safety ranges must total at most 4 MiB")
        ids = [item.range_id for item in self.safety_ranges]
        if len(ids) != len(set(ids)):
            raise ValueError("safety range IDs must be unique")


@dataclass(frozen=True)
class RecorderPreflight:
    bridge_version: str
    bridge_port: int
    bridge_epoch: str
    bridge_next_sequence: int
    cpu_core: str
    rom_identity: Mapping[str, Any]
    initial_frame: int | None


@dataclass(frozen=True)
class PollResult:
    stored_events: int
    remaining: int
    dropped_total: int
    frame_number: int | None


class RecorderClock:
    """Injectable wall/monotonic clock for deterministic recorder tests."""

    def monotonic_ns(self) -> int:
        return time.monotonic_ns()

    def utc_now(self) -> str:
        return utc_now()

    def sleep(self, seconds: float) -> None:
        time.sleep(seconds)


def _integer(value: Any, field: str, *, nullable: bool = False) -> int | None:
    if value is None and nullable:
        return None
    if isinstance(value, bool) or not isinstance(value, int):
        raise BridgeProtocolError(f"Project64 {field} must be an integer")
    return value


def _hex_identity(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    normalized = value.upper()
    if normalized.startswith("0X"):
        normalized = normalized[2:]
    return normalized


def _resolve_live_rom_path(rom: Mapping[str, Any]) -> Path:
    candidates: list[Path] = []
    for field in ("filePath", "fileName"):
        value = rom.get(field)
        if isinstance(value, str) and value:
            candidates.append(Path(value))
    directory = rom.get("filePath")
    name = rom.get("fileName")
    if isinstance(directory, str) and isinstance(name, str) and directory and name:
        candidates.append(Path(directory) / name)
    for candidate in candidates:
        if candidate.is_file():
            return candidate.resolve()
    rendered = ", ".join(str(candidate) for candidate in candidates) or "<none>"
    raise BridgeProtocolError(f"cannot resolve the loaded ROM file from Project64: {rendered}")


def verify_observation_preflight(
    client: RecorderClient,
    expected_rom_sha256: str,
) -> RecorderPreflight:
    """Prove exact ROM/core/protocol and exclusive pristine bridge ownership."""

    client.connect()
    handshake = client.handshake_result
    if handshake is None or handshake.version != BRIDGE_PROTOCOL_VERSION:
        raise BridgeProtocolError("Project64 client did not establish the frozen bridge handshake")
    status = client.status()
    health = client.health()
    core = health.get("core")
    if core != "interpreter":
        raise BridgeProtocolError(
            "watch/DMA/trace/input capture requires the interpreter core; "
            f"connected core is {core!r}"
        )

    watches = status.get("watches")
    if not isinstance(watches, list) or watches:
        raise BridgeProtocolError(
            "observation-only startup requires a pristine bridge with no existing watches"
        )
    if status.get("queueModel") != "unified":
        raise BridgeProtocolError("observation-only startup requires one unified event queue")
    if status.get("bridgeEpoch") != handshake.bridge_epoch:
        raise BridgeProtocolError("bridge epoch changed during recorder preflight")
    if _integer(status.get("queued"), "unified queue depth") != 0:
        raise BridgeProtocolError("observation-only startup refuses a nonempty unified queue")
    if _integer(status.get("dropped"), "unified dropped count") != 0:
        raise BridgeProtocolError("observation-only startup refuses stale event loss")
    if status.get("droppedRanges") != []:
        raise BridgeProtocolError("observation-only startup refuses stale dropped sequence ranges")
    next_sequence = _integer(status.get("nextEventSequence"), "next event sequence")
    assert next_sequence is not None
    if next_sequence < 1:
        raise BridgeProtocolError("Project64 next event sequence must be positive")

    dma = status.get("dma")
    if not isinstance(dma, Mapping):
        raise BridgeProtocolError("Project64 status omitted native DMA state")
    if dma.get("enabled") is not False:
        raise BridgeProtocolError("observation-only startup requires native DMA tracing to be off")

    capture = status.get("capture")
    if not isinstance(capture, Mapping):
        raise BridgeProtocolError("Project64 status omitted execution/input capture state")
    if capture.get("enabled") is not False:
        raise BridgeProtocolError("observation-only startup requires execution/input capture to be off")
    trace = capture.get("trace")
    controller_capture = capture.get("controllerInput")
    if not isinstance(trace, Mapping) or trace.get("enabled") is not False:
        raise BridgeProtocolError("observation-only startup requires native execution tracing to be off")
    if not isinstance(controller_capture, Mapping) or controller_capture.get("enabled") is not False:
        raise BridgeProtocolError("observation-only startup requires controller observation to be off")

    input_state = status.get("input")
    if not isinstance(input_state, Mapping):
        raise BridgeProtocolError("Project64 status omitted controller-intervention state")
    mask = _hex_identity(input_state.get("mask"))
    samples = input_state.get("samples")
    if mask not in {"0", "00000000"} or input_state.get("stickActive") is not False or samples != 0:
        raise BridgeProtocolError("observation-only startup refuses active bridge controller input")

    live_rom = health.get("rom")
    if not isinstance(live_rom, Mapping):
        raise BridgeProtocolError("Project64 has no loaded ROM identity")
    rom_path = _resolve_live_rom_path(live_rom)
    identity = rom_identity_from_file(rom_path)
    expected = expected_rom_sha256.upper()
    if identity["normalizedSha256"] != expected:
        raise BridgeProtocolError(
            "loaded ROM normalized SHA-256 mismatch: "
            f"{identity['normalizedSha256']} (required {expected})"
        )
    for field in ("crc1", "crc2"):
        live_value = _hex_identity(live_rom.get(field))
        if live_value != identity[field]:
            raise BridgeProtocolError(
                f"Project64 {field} {live_value!r} disagrees with loaded file {identity[field]}"
            )
    if identity["version"] != 0 or identity["country"] != "0x45":
        raise BridgeProtocolError(
            f"loaded ROM is not the US Rev 0 target ({identity['country']}, Rev {identity['version']})"
        )

    frame = status.get("frameCount")
    frame_number = _integer(frame, "frame count", nullable=True)
    if frame_number is not None and frame_number < 0:
        raise BridgeProtocolError("Project64 frame count must be nonnegative")
    return RecorderPreflight(
        bridge_version=handshake.version,
        bridge_port=int(handshake.port),
        bridge_epoch=handshake.bridge_epoch,
        bridge_next_sequence=next_sequence,
        cpu_core=core,
        rom_identity=identity,
        initial_frame=frame_number,
    )


def verify_pre_rom_preflight(
    client: RecorderClient,
    expected_identity: Mapping[str, Any],
) -> RecorderPreflight:
    """Verify a powered-off bridge before any ROM or RDRAM is present."""

    client.connect()
    handshake = client.handshake_result
    if handshake is None or handshake.version != BRIDGE_PROTOCOL_VERSION:
        raise BridgeProtocolError("Project64 did not establish the cold-boot bridge handshake")
    status = client.status()
    health = client.health()
    if health.get("rom") is not None:
        raise BridgeProtocolError("pre-ROM capture requires Project64 to have no loaded ROM")
    if status.get("rdramSize") != 0 or health.get("rdramSize") != 0:
        raise BridgeProtocolError("pre-ROM capture requires no allocated N64 RDRAM")
    if status.get("bridgeEpoch") != handshake.bridge_epoch:
        raise BridgeProtocolError("bridge epoch changed during pre-ROM preflight")
    if status.get("queueModel") != "unified":
        raise BridgeProtocolError("pre-ROM capture requires one unified event queue")
    if status.get("watches") != [] or status.get("queued") != 0 or status.get("dropped") != 0:
        raise BridgeProtocolError("pre-ROM capture requires a pristine empty bridge")
    if status.get("droppedRanges") != []:
        raise BridgeProtocolError("pre-ROM capture refuses stale dropped sequence ranges")
    capture = status.get("capture")
    dma = status.get("dma")
    cold_boot = status.get("coldBoot")
    if not isinstance(capture, Mapping) or capture.get("enabled") is not False:
        raise BridgeProtocolError("pre-ROM capture requires execution capture to be off")
    if not isinstance(dma, Mapping) or dma.get("enabled") is not False:
        raise BridgeProtocolError("pre-ROM capture requires DMA capture to be off")
    if not isinstance(cold_boot, Mapping) or cold_boot.get("state") not in {"idle", "cancelled"}:
        raise BridgeProtocolError("pre-ROM capture requires no existing cold-boot arm")
    next_sequence = _integer(status.get("nextEventSequence"), "next event sequence")
    assert next_sequence is not None
    if next_sequence < 1:
        raise BridgeProtocolError("Project64 next event sequence must be positive")
    required = ("normalizedSha256", "crc1", "crc2", "country", "version")
    if any(field not in expected_identity for field in required):
        raise BridgeProtocolError("configured cold-boot ROM identity is incomplete")
    return RecorderPreflight(
        bridge_version=handshake.version,
        bridge_port=int(handshake.port),
        bridge_epoch=handshake.bridge_epoch,
        bridge_next_sequence=next_sequence,
        cpu_core="interpreter",
        rom_identity=dict(expected_identity),
        initial_frame=None,
    )


def verify_loaded_rom_after_arm(
    client: RecorderClient,
    preflight: RecorderPreflight,
) -> Mapping[str, Any]:
    """Prove the exact target after the bridge has synchronously armed capture."""

    status = client.status()
    health = client.health()
    if status.get("bridgeEpoch") != preflight.bridge_epoch:
        raise BridgeProtocolError("bridge epoch changed while waiting for the cold boot")
    if health.get("core") != "interpreter":
        raise BridgeProtocolError("cold-boot capture did not start under the interpreter core")
    live_rom = health.get("rom")
    if not isinstance(live_rom, Mapping):
        raise BridgeProtocolError("cold-boot capture started without a loaded ROM identity")
    identity = rom_identity_from_file(_resolve_live_rom_path(live_rom))
    if identity["normalizedSha256"] != str(preflight.rom_identity["normalizedSha256"]).upper():
        raise BridgeProtocolError("cold-boot loaded ROM normalized SHA-256 mismatch")
    for field in ("crc1", "crc2"):
        if _hex_identity(live_rom.get(field)) != identity[field]:
            raise BridgeProtocolError(f"Project64 {field} disagrees with the cold-boot ROM file")
        if identity[field] != _hex_identity(preflight.rom_identity.get(field)):
            raise BridgeProtocolError(f"cold-boot loaded ROM {field} differs from the armed target")
    if identity["version"] != 0 or identity["country"] != "0x45":
        raise BridgeProtocolError("cold-boot loaded ROM is not the US Rev 0 target")
    return identity


class Pj64CaptureRecorder:
    """Capture ordered watch, DMA, trace, and input streams without mutating game state."""

    def __init__(
        self,
        client: RecorderClient,
        store: CaptureStore,
        settings: RecorderSettings,
        *,
        clock: RecorderClock | None = None,
    ) -> None:
        self.client = client
        self.store = store
        self.settings = settings
        self.clock = clock or RecorderClock()
        self.preflight: RecorderPreflight | None = None
        self._started = False
        self._batch_id = 0
        self._bridge_next_sequence = 1
        self._coverage_cursor = 1
        self._last_drained_bridge_sequence = 0
        self._last_loss_sequence = 0
        self._last_dropped_count = 0
        self._installed_bridge_watch_ids: list[int] = []
        self._queue_high_water = 0
        self._longest_drain_stall_ms = 0.0
        self._last_poll_ns: int | None = None
        self._last_frame_sample_ns: int | None = None
        self._last_health_ns: int | None = None
        self._last_safety_sample_ns: int | None = None
        self._last_event_ns = -1
        self._last_frame: int | None = None
        self._watch_failures = 0
        self._recorder_exceptions = 0
        self._continuity = "continuous"
        self._dma_enabled = False
        self._capture_enabled = False
        self._pending_dma_starts: dict[int, Mapping[str, Any]] = {}
        self._safety_fingerprints: dict[str, str] = {}
        self._frontier: Any | None = None
        self._baseline_snapshot: Any | None = None
        self._cold_boot_armed = False

    @property
    def started(self) -> bool:
        return self._started

    @property
    def bridge_next_sequence(self) -> int:
        return self._bridge_next_sequence

    def _next_host_ns(self) -> int:
        observed = self.clock.monotonic_ns()
        self._last_event_ns = max(observed, self._last_event_ns + 1)
        return self._last_event_ns

    def _append_recorder_event(
        self,
        event_type: str,
        payload: Mapping[str, Any],
        *,
        ingestion_status: str = "accepted",
        batch_id: int | None = None,
        batch_index: int = 0,
        dropped_total: int | None = None,
        event_time_content_sha256: str | None = None,
        event_time_content_size: int | None = None,
        event_time_content_encoding: str | None = None,
        event_time_content_phase: str | None = None,
        event_time_content_field: str | None = None,
    ) -> int:
        if batch_id is None:
            self._batch_id += 1
            batch_id = self._batch_id
        stored = self.store.append_event_batch(
            (
                RawEventInput(
                    frame_number=self._last_frame,
                    host_monotonic_ns=self._next_host_ns(),
                    observed_utc=self.clock.utc_now(),
                    bridge_stream="recorder",
                    bridge_epoch=(
                        self.preflight.bridge_epoch if self.preflight is not None else "unknown"
                    ),
                    bridge_event_sequence=None,
                    recorder_batch_id=batch_id,
                    recorder_batch_index=batch_index,
                    bridge_event_type=event_type,
                    payload=dict(payload),
                    ingestion_status=ingestion_status,
                    bridge_queue_remaining=0,
                    bridge_dropped_total=dropped_total,
                    event_time_content_sha256=event_time_content_sha256,
                    event_time_content_size=event_time_content_size,
                    event_time_content_encoding=event_time_content_encoding,
                    event_time_content_phase=event_time_content_phase,
                    event_time_content_field=event_time_content_field,
                ),
            )
        )
        return stored[0].sequence_id

    def _prepare_session(self, preflight: RecorderPreflight, *, start_mode: str) -> None:
        self.preflight = preflight
        session = self.store.connection.execute(
            """
            SELECT bridge_version, bridge_port, bridge_epoch,
                   bridge_next_sequence_start, cpu_core, rom_normalized_sha256,
                   accepted_resolver_identity
            FROM session WHERE session_id=?
            """,
            (self.store.session_id,),
        ).fetchone()
        self._frontier = self.settings.novelty_frontier or empty_novelty_frontier(
            self.settings.expected_rom_sha256
        )
        if self._frontier.rom_normalized_sha256 != self.preflight.rom_identity["normalizedSha256"]:
            raise BridgeProtocolError("novelty frontier ROM identity differs from the live ROM")
        expected_session = (
            self.preflight.bridge_version,
            self.preflight.bridge_port,
            self.preflight.bridge_epoch,
            self.preflight.bridge_next_sequence,
            self.preflight.cpu_core,
            self.preflight.rom_identity["normalizedSha256"],
            self._frontier.identity,
        )
        if session is None or tuple(session) != expected_session:
            raise BridgeProtocolError(
                "capture session metadata does not match the live preflight identity"
            )
        self._bridge_next_sequence = self.preflight.bridge_next_sequence
        self._coverage_cursor = self.preflight.bridge_next_sequence
        self._last_drained_bridge_sequence = self.preflight.bridge_next_sequence - 1
        self._last_frame = self.preflight.initial_frame
        self._append_recorder_event(
            "session-start",
            {
                "kind": "session-start",
                "startMode": start_mode,
                "observationOnly": True,
                "bridgeVersion": self.preflight.bridge_version,
                "bridgePort": self.preflight.bridge_port,
                "bridgeEpoch": self.preflight.bridge_epoch,
                "bridgeNextSequence": self.preflight.bridge_next_sequence,
                "cpuCore": self.preflight.cpu_core,
                "romNormalizedSha256": self.preflight.rom_identity["normalizedSha256"],
                "machineEventOrder": "emulator-global-bridge-sequence",
                "executionTrace": {
                    "mode": "persistent-structural-frontier-filtered-native-coverage",
                    "dedupe": "physical-instruction-address-plus-exact-opcode-and-exact-edge",
                    "frontierFormatVersion": self._frontier.format_version,
                    "frontierIdentity": self._frontier.identity,
                    "frontierLedgerOrdinal": self._frontier.ledger_ordinal,
                    "frontierPhysicalPages": len(self._frontier.pages),
                    "frontierInstructions": self._frontier.instruction_count,
                    "frontierEdges": len(self._frontier.edges),
                    "frontierDmaPlacements": len(self._frontier.dma),
                    "pageGenerations": "context-only-on-emitted-novel-facts",
                    "captureAuthority": "observation-only",
                    "timestampsAndFrames": "context-only",
                },
                "baselineCensus": {
                    "rdramSize": RDRAM_SIZE,
                    "mode": "one-time-native-atomic-copy-before-first-captured-instruction",
                    "role": "resident-byte-placement-evidence-not-execution-evidence",
                },
                "controllerInput": {
                    "controller": 0,
                    "source": "effective-pif-response",
                    "dedupe": "consecutive-identical-state-coalesced",
                    "timing": "transition-sequence-and-frame-preserved",
                },
                "safetyRangeSampling": {
                    "ordering": "host-polled-context-only",
                    "intervalSeconds": self.settings.safety_range_interval_seconds,
                    "fingerprintRole": "cheap-change-signal-not-content-proof",
                    "ranges": [
                        {
                            "rangeId": item.range_id,
                            "liveAddress": item.live_address,
                            "size": item.size,
                            "label": item.label,
                            "expectedClass": item.expected_class,
                            "reason": item.reason,
                            "definitionSource": item.definition_source,
                        }
                        for item in self.settings.safety_ranges
                    ],
                },
            },
        )

    def start(self, preflight: RecorderPreflight | None = None) -> RecorderPreflight:
        if self._started:
            raise RuntimeError("recorder has already started")
        resolved = preflight or verify_observation_preflight(
            self.client, self.settings.expected_rom_sha256
        )
        self._prepare_session(resolved, start_mode="already-loaded-rom")

        try:
            self._start_instrumentation()
            self._started = True
            self.poll_once(_startup_drain=True)
        except Exception:
            self._started = False
            self._rollback_instrumentation_start()
            raise
        return self.preflight

    def arm_before_rom(self, preflight: RecorderPreflight) -> RecorderPreflight:
        """Load the frontier and arm synchronous capture for EMU_STARTED."""

        if self._started:
            raise RuntimeError("recorder has already started")
        self._prepare_session(preflight, start_mode="before-rom-load")
        assert self._frontier is not None
        loaded = self.client.load_novelty_frontier(self._frontier)
        if loaded.get("frontierIdentity") != self._frontier.identity:
            raise BridgeProtocolError("bridge loaded the wrong cold-boot novelty frontier")
        crc1 = _hex_identity(preflight.rom_identity.get("crc1"))
        crc2 = _hex_identity(preflight.rom_identity.get("crc2"))
        if crc1 is None or crc2 is None:
            raise BridgeProtocolError("cold-boot target CRC identity is incomplete")
        response = self.client.cold_boot_arm(self._frontier.identity, crc1, crc2)
        cold_boot = response.get("coldBoot")
        if not isinstance(cold_boot, Mapping) or cold_boot.get("state") != "armed":
            raise BridgeProtocolError("bridge did not enter the pre-ROM armed state")
        if cold_boot.get("armedAtNextSequence") != preflight.bridge_next_sequence:
            raise BridgeProtocolError("cold-boot arm changed the event cursor before ROM load")
        self._cold_boot_armed = True
        self._started = True
        return preflight

    def await_cold_boot_start(self) -> None:
        """Wait for manual ROM load, validate it exactly, then adopt active hooks."""

        if not self._started or not self._cold_boot_armed or self.preflight is None:
            raise RuntimeError("cold-boot capture has not been armed")
        while True:
            if self.store.stop_requested():
                raise BridgeProtocolError("cold-boot capture was cancelled before ROM load")
            cold_boot = self.client.cold_boot_status()
            state = cold_boot.get("state")
            if state == "failed":
                raise BridgeProtocolError(
                    "cold-boot bridge rejected the loaded ROM: " + str(cold_boot.get("error"))
                )
            if state == "capturing":
                break
            if state != "armed":
                raise BridgeProtocolError(f"cold-boot arm entered unexpected state {state!r}")
            self.clock.sleep(0.02)
        verify_loaded_rom_after_arm(self.client, self.preflight)
        deadline = self.clock.monotonic_ns() + 10_000_000_000
        while True:
            baseline_status = self.client.baseline_status()
            if baseline_status.get("state") == "ready":
                break
            if baseline_status.get("state") == "failed":
                raise BridgeProtocolError("cold-boot native 4 MiB baseline snapshot failed")
            if self.clock.monotonic_ns() >= deadline:
                raise BridgeProtocolError("timed out waiting for cold-boot baseline snapshot")
            self.clock.sleep(0.01)
        self._baseline_snapshot = self.client.read_baseline_snapshot()
        if (
            self._baseline_snapshot.bridge_epoch != self.preflight.bridge_epoch
            or len(self._baseline_snapshot.data) != RDRAM_SIZE
        ):
            raise BridgeProtocolError("cold-boot baseline changed bridge identity or size")
        self.client.release_baseline_snapshot(self._baseline_snapshot.snapshot_id)
        status = self.client.status()
        capture = status.get("capture")
        trace = capture.get("trace") if isinstance(capture, Mapping) else None
        controller = capture.get("controllerInput") if isinstance(capture, Mapping) else None
        dma = status.get("dma")
        if (
            not isinstance(capture, Mapping)
            or capture.get("enabled") is not True
            or not isinstance(trace, Mapping)
            or trace.get("enabled") is not True
            or not isinstance(controller, Mapping)
            or controller.get("enabled") is not True
            or not isinstance(dma, Mapping)
            or dma.get("enabled") is not True
        ):
            raise BridgeProtocolError("cold-boot bridge did not atomically enable all capture hooks")
        self._capture_enabled = True
        self._dma_enabled = True
        self._cold_boot_armed = False
        self._record_native_watch_definitions(trace)
        self.poll_once(_startup_drain=True)

    def _record_native_watch_definitions(self, trace: Mapping[str, Any]) -> None:
        trace_callback_id = trace.get("callbackId")
        if isinstance(trace_callback_id, bool) or not isinstance(trace_callback_id, int):
            raise BridgeProtocolError("capture start response omitted native trace callback ID")
        trace_callback_ids = trace.get("callbackIds")
        if (
            not isinstance(trace_callback_ids, list)
            or len(trace_callback_ids) != 2
            or any(isinstance(value, bool) or not isinstance(value, int) for value in trace_callback_ids)
            or trace_callback_ids[0] != trace_callback_id
        ):
            raise BridgeProtocolError("capture start response omitted exact KSEG0/KSEG1 trace callbacks")
        for name, callback_id, start in (
            ("kseg0", trace_callback_ids[0], 0x80000000),
            ("kseg1", trace_callback_ids[1], 0xA0000000),
        ):
            self.store.record_watch(
                watch_id=f"native-exact-execution-coverage-{name}",
                bridge_watch_id=callback_id,
                watch_kind="exec",
                address_space="live-kseg",
                address_start=start,
                address_end_exclusive=start + RDRAM_SIZE,
                label=f"Native exact execution coverage ({name.upper()})",
                reason="Preserve new exact instruction and edge coverage without per-hit queue growth",
                definition_source=f"total-resolver:bridge-{BRIDGE_PROTOCOL_VERSION}-native-frontier-v3",
                interpreter_required=True,
                interpreter_verified=True,
                ownership_scope="recorder-owned",
                expected_event_rate="new exact address/opcode instruction or edge identities only",
            )
        self.store.record_watch(
            watch_id="native-pi-dma",
            bridge_watch_id=None,
            watch_kind="dma",
            address_space="physical-rdram",
            address_start=self.settings.dma_physical_start,
            address_end_exclusive=self.settings.dma_physical_end,
            label="Native PI DMA",
            reason="Preserve ROM-to-RDRAM transfer evidence",
            definition_source="total-resolver:recorder-settings",
            interpreter_required=False,
            interpreter_verified=True,
            ownership_scope="recorder-owned",
        )

    def _start_instrumentation(self) -> None:
        """Enable recorder-owned hooks, with caller-managed rollback on any failure."""

        if self._frontier is None:
            raise RuntimeError("recorder novelty frontier was not prepared")
        loaded = self.client.load_novelty_frontier(self._frontier)
        if loaded.get("frontierIdentity") != self._frontier.identity:
            raise BridgeProtocolError("bridge loaded the wrong novelty frontier")
        self._capture_enabled = True
        capture_response = self.client.capture_start(self._frontier.identity)
        capture = capture_response.get("capture")
        if not isinstance(capture, Mapping) or capture.get("enabled") is not True:
            raise BridgeProtocolError("capture start response did not enable trace/input capture")
        trace = capture.get("trace")
        controller_capture = capture.get("controllerInput")
        if not isinstance(trace, Mapping) or trace.get("enabled") is not True:
            raise BridgeProtocolError("capture start response did not enable native execution tracing")
        if not isinstance(controller_capture, Mapping) or controller_capture.get("enabled") is not True:
            raise BridgeProtocolError("capture start response did not enable controller observation")
        deadline = self.clock.monotonic_ns() + 10_000_000_000
        while True:
            baseline_status = self.client.baseline_status()
            if baseline_status.get("state") == "ready":
                break
            if baseline_status.get("state") == "failed":
                raise BridgeProtocolError("native 4 MiB baseline snapshot failed")
            if self.clock.monotonic_ns() >= deadline:
                raise BridgeProtocolError("timed out waiting for native 4 MiB baseline snapshot")
            self.clock.sleep(0.01)
        self._baseline_snapshot = self.client.read_baseline_snapshot()
        if (
            self._baseline_snapshot.bridge_epoch != self.preflight.bridge_epoch
            or len(self._baseline_snapshot.data) != RDRAM_SIZE
        ):
            raise BridgeProtocolError("native baseline snapshot changed bridge identity or size")
        self.client.release_baseline_snapshot(self._baseline_snapshot.snapshot_id)
        self._record_native_watch_definitions(trace)

        self._dma_enabled = True
        dma_response = self.client.dma_start(
            self.settings.dma_physical_start,
            self.settings.dma_physical_end,
            maximum=self.settings.dma_queue_limit,
            context_words=self.settings.dma_context_words,
        )
        if not isinstance(dma_response.get("dma"), Mapping):
            raise BridgeProtocolError("DMA start response omitted DMA state")
        self.client.dma_set_rom_range(self.settings.dma_rom_start, self.settings.dma_rom_end)

        for spec in self.settings.watches:
            try:
                installed = self.client.install_watch(
                    spec.kind, spec.address, size=spec.size, label=spec.label
                )
                bridge_id = installed.get("id")
                if isinstance(bridge_id, bool) or not isinstance(bridge_id, int):
                    raise BridgeProtocolError(f"watch {spec.watch_id} omitted its numeric bridge ID")
                self._installed_bridge_watch_ids.append(bridge_id)
                self.store.record_watch(
                    watch_id=spec.watch_id,
                    bridge_watch_id=bridge_id,
                    watch_kind=spec.kind,
                    address_space=spec.address_space,
                    address_start=spec.address,
                    address_end_exclusive=spec.address + spec.size,
                    label=spec.label,
                    reason=spec.reason,
                    definition_source=spec.definition_source,
                    interpreter_required=True,
                    interpreter_verified=True,
                    ownership_scope="recorder-owned",
                    expected_event_rate=spec.expected_event_rate,
                )
            except Exception:
                self._watch_failures += 1
                raise

    def _rollback_instrumentation_start(self) -> None:
        """Best-effort removal so a partial startup cannot leave a watch running."""

        for bridge_watch_id in reversed(self._installed_bridge_watch_ids):
            try:
                self.client.remove_watch(bridge_watch_id)
            except Exception:
                pass
        self._installed_bridge_watch_ids.clear()
        if self._cold_boot_armed:
            try:
                self.client.cold_boot_cancel()
            except Exception:
                pass
            self._cold_boot_armed = False
        if self._dma_enabled:
            try:
                self.client.dma_stop()
            except Exception:
                pass
            self._dma_enabled = False
        if self._capture_enabled:
            try:
                self.client.capture_stop()
            except Exception:
                pass
            self._capture_enabled = False
        if self._baseline_snapshot is not None:
            try:
                self.client.release_baseline_snapshot(self._baseline_snapshot.snapshot_id)
            except Exception:
                pass
        try:
            latest = self.store.latest_sequence()
            if latest is not None:
                self.store.mark_recorder_watches_removed(latest)
        except Exception:
            pass

    def _event_inputs(self, batch: DrainBatch, batch_id: int, start_index: int) -> list[RawEventInput]:
        inputs: list[RawEventInput] = []
        for offset, event in enumerate(batch.events):
            frame = event.frame_number if event.frame_number is not None else self._last_frame
            payload = dict(event.payload)
            content_sha256 = event.event_time_content_sha256
            content_size = event.event_time_content_size
            content_encoding = event.event_time_content_encoding
            content_phase = event.event_time_content_phase
            content_field = event.event_time_content_field
            if event.event_type == "baseline-snapshot":
                snapshot = self._baseline_snapshot
                if (
                    snapshot is None
                    or payload.get("snapshotId") != snapshot.snapshot_id
                    or event.bridge_sequence != snapshot.bridge_sequence
                    or snapshot.bridge_epoch != event.bridge_epoch
                    or len(snapshot.data) != RDRAM_SIZE
                ):
                    raise BridgeProtocolError("baseline event does not match the frozen native copy")
                payload["rdramBytesEncoding"] = "hex-uppercase"
                payload["rdramByteLength"] = RDRAM_SIZE
                payload["rdramBytesHex"] = snapshot.data.hex().upper()
                content_sha256 = hashlib.sha256(snapshot.data).hexdigest().upper()
                content_size = RDRAM_SIZE
                content_encoding = "hex-uppercase"
                content_phase = "pre-execution-native-rdram-snapshot"
                content_field = "rdramBytesHex"
            inputs.append(
                RawEventInput(
                    frame_number=frame,
                    host_monotonic_ns=self._next_host_ns(),
                    observed_utc=self.clock.utc_now(),
                    bridge_stream=event.bridge_stream,
                    bridge_epoch=event.bridge_epoch,
                    bridge_event_sequence=event.bridge_sequence,
                    recorder_batch_id=batch_id,
                    recorder_batch_index=start_index + offset,
                    bridge_event_type=event.event_type,
                    payload=payload,
                    ingestion_status=event.ingestion_status,
                    bridge_queue_remaining=batch.remaining,
                    bridge_dropped_total=batch.dropped,
                    event_time_content_sha256=content_sha256,
                    event_time_content_size=content_size,
                    event_time_content_encoding=content_encoding,
                    event_time_content_phase=content_phase,
                    event_time_content_field=content_field,
                )
            )
        return inputs

    def _track_dma_pairs(self, batch: DrainBatch) -> None:
        for event in batch.events:
            if event.event_type == "dma-start":
                self._pending_dma_starts[event.bridge_sequence] = event.payload
                continue
            if event.event_type != "dma-complete":
                continue
            if event.payload.get("pairingStatus") == "native-completion-only":
                if event.payload.get("dmaStartSequence") is not None:
                    raise BridgeProtocolError("native completion-only DMA named a start event")
                continue
            start_sequence = event.payload.get("dmaStartSequence")
            start = self._pending_dma_starts.pop(start_sequence, None)
            if start is None:
                raise BridgeProtocolError(
                    f"DMA completion {event.bridge_sequence} has no captured start "
                    f"{start_sequence!r}"
                )
            for field in ("phys", "romoff", "requestedLength"):
                if start.get(field) != event.payload.get(field):
                    raise BridgeProtocolError(
                        f"DMA pair {start_sequence}/{event.bridge_sequence} disagrees on {field}"
                    )

    def _new_loss_markers(
        self, batch: DrainBatch, batch_id: int, start_index: int
    ) -> tuple[list[RawEventInput], list[tuple[int, int]]]:
        if batch.dropped < self._last_dropped_count:
            raise BridgeProtocolError("bridge dropped-event count decreased within one epoch")
        markers: list[RawEventInput] = []
        new_ranges: list[tuple[int, int]] = []
        for item in batch.dropped_ranges:
            if item.last_sequence <= self._last_loss_sequence:
                continue
            first = max(item.first_sequence, self._last_loss_sequence + 1)
            last = item.last_sequence
            new_ranges.append((first, last))
            markers.append(
                RawEventInput(
                    frame_number=self._last_frame,
                    host_monotonic_ns=self._next_host_ns(),
                    observed_utc=self.clock.utc_now(),
                    bridge_stream="recorder",
                    bridge_epoch=batch.bridge_epoch,
                    bridge_event_sequence=None,
                    recorder_batch_id=batch_id,
                    recorder_batch_index=start_index + len(markers),
                    bridge_event_type="event-loss",
                    payload={
                        "kind": "event-loss",
                        "bridgeEpoch": batch.bridge_epoch,
                        "firstDroppedBridgeSequence": first,
                        "lastDroppedBridgeSequence": last,
                        "droppedCount": last - first + 1,
                        "description": "bridge reported an exact dropped sequence range",
                        "smallestNextEvidence": (
                            "repeat the affected transition in a new continuous session"
                        ),
                    },
                    ingestion_status="loss-marker",
                    bridge_queue_remaining=batch.remaining,
                    bridge_dropped_total=batch.dropped,
                )
            )
            self._last_loss_sequence = last
        self._last_dropped_count = batch.dropped
        if markers:
            self._continuity = "broken"
            self.store.set_continuity_broken("bridge reported dropped sequence ranges")
        return markers, new_ranges

    def _sample_safety_ranges(self) -> int:
        """Capture exact bytes only for bounded ranges whose cheap fingerprint changed."""

        if not self.settings.safety_ranges:
            return 0
        batch = self.client.memory_fingerprints(
            tuple((item.live_address, item.size) for item in self.settings.safety_ranges)
        )
        if self.preflight is None or batch.bridge_epoch != self.preflight.bridge_epoch:
            raise BridgeProtocolError("bridge instance epoch changed during safety-range sampling")
        if batch.next_event_sequence < self._bridge_next_sequence:
            raise BridgeProtocolError("safety-range sample reported a stale bridge sequence")
        if len(batch.ranges) != len(self.settings.safety_ranges):
            raise BridgeProtocolError("safety-range fingerprint count changed unexpectedly")

        captured = 0
        for spec, probe in zip(self.settings.safety_ranges, batch.ranges, strict=True):
            if probe.address != spec.live_address or probe.size != spec.size:
                raise BridgeProtocolError(
                    f"safety-range fingerprint disagrees for {spec.range_id}"
                )
            previous = self._safety_fingerprints.get(spec.range_id)
            if previous == probe.digest:
                continue
            block = self.client.read_block(spec.live_address, spec.size)
            if block.bridge_epoch != self.preflight.bridge_epoch:
                raise BridgeProtocolError(
                    "bridge instance epoch changed during safety-range byte capture"
                )
            content_sha256 = hashlib.sha256(block.data).hexdigest().upper()
            sample_reason = "initial" if previous is None else "fingerprint-changed"
            self._append_recorder_event(
                "range-snapshot",
                {
                    "kind": "range-snapshot",
                    "rangeId": spec.range_id,
                    "label": spec.label,
                    "expectedClass": spec.expected_class,
                    "liveAddress": spec.live_address,
                    "physicalAddress": spec.live_address & 0x003FFFFF,
                    "size": spec.size,
                    "sampleReason": sample_reason,
                    "ordering": "host-polled-context-only",
                    "bridgeNextSequenceAtProbe": batch.next_event_sequence,
                    "bridgeNextSequenceAtSnapshot": block.next_event_sequence,
                    "frameAtProbe": batch.frame_count,
                    "frameAtSnapshot": block.frame_count,
                    "fingerprintAlgorithm": probe.algorithm,
                    "previousFingerprint": previous,
                    "probeFingerprint": probe.digest,
                    "snapshotFingerprint": block.fingerprint,
                    "changedBetweenProbeAndSnapshot": probe.digest != block.fingerprint,
                    "contentSha256": content_sha256,
                    "bytesEncoding": "hex-uppercase",
                    "bytesHex": block.data.hex().upper(),
                    "reason": spec.reason,
                    "definitionSource": spec.definition_source,
                    "claimLimit": (
                        "exact bytes at one host-polled observation; fingerprint polling may "
                        "miss changes that revert between samples"
                    ),
                },
            )
            self._safety_fingerprints[spec.range_id] = block.fingerprint
            captured += 1
        return captured

    def _record_pc_sample(self, status: Mapping[str, Any]) -> None:
        encoded = status.get("pc")
        if not isinstance(encoded, str):
            return
        try:
            pc = int(encoded, 0)
        except ValueError:
            return
        matching_ranges = [
            item.range_id
            for item in self.settings.safety_ranges
            if item.live_address <= pc < item.live_address + item.size
        ]
        self._append_recorder_event(
            "pc-sample",
            {
                "kind": "pc-sample",
                "pc": encoded,
                "frameCount": self._last_frame,
                "bridgeNextSequenceAtSample": status.get("nextEventSequence"),
                "ordering": "host-polled-context-only",
                "sampleKind": "periodic-frame-context",
                "safetyRangeIds": matching_ranges,
                "claimLimit": "one sampled PC, not continuous execution tracing",
            },
        )

    def poll_once(
        self, *, force_samples: bool = False, _startup_drain: bool = False
    ) -> PollResult:
        if not self._started:
            raise RuntimeError("recorder has not started")
        started_ns = self.clock.monotonic_ns()
        self._batch_id += 1
        batch_id = self._batch_id
        batch = parse_drain_response(self.client.drain_events(self.settings.drain_limit))
        if self.preflight is None or batch.bridge_epoch != self.preflight.bridge_epoch:
            self._continuity = "broken"
            self.store.set_continuity_broken("bridge instance epoch changed during capture")
            raise BridgeProtocolError("bridge instance epoch changed during capture")
        sequences = [event.bridge_sequence for event in batch.events]
        if sequences and sequences[0] <= self._last_drained_bridge_sequence:
            raise BridgeProtocolError("unified drain replayed or reordered a bridge event")
        if batch.next_event_sequence < self._bridge_next_sequence:
            raise BridgeProtocolError("bridge nextEventSequence decreased within one epoch")
        coverage = [
            (item.first_sequence, item.last_sequence) for item in batch.dropped_ranges
        ]
        coverage.extend((sequence, sequence) for sequence in sequences)
        cursor = self._coverage_cursor
        for first, last in sorted(coverage):
            if last < cursor:
                continue
            if first > cursor:
                raise BridgeProtocolError(
                    f"unexplained bridge sequence gap [{cursor},{first}) in unified drain"
                )
            cursor = max(cursor, last + 1)
        if batch.next_event_sequence - cursor != batch.remaining:
            raise BridgeProtocolError(
                "unified queue depth does not conserve created, drained, and dropped sequences"
            )
        self._coverage_cursor = cursor
        if sequences:
            self._last_drained_bridge_sequence = sequences[-1]
        self._bridge_next_sequence = batch.next_event_sequence
        pending = self._event_inputs(batch, batch_id, 0)
        loss_markers, new_loss_ranges = self._new_loss_markers(batch, batch_id, len(pending))
        pending.extend(loss_markers)
        self.store.append_event_batch(pending)
        for first, last in new_loss_ranges:
            self.store.record_bridge_loss_range(
                bridge_epoch=batch.bridge_epoch,
                first_sequence=first,
                last_sequence=last,
            )
        self._track_dma_pairs(batch)

        queue_depth = batch.remaining
        self._queue_high_water = max(
            self._queue_high_water,
            queue_depth + len(batch.events),
        )
        dropped_total = batch.dropped
        now_ns = self.clock.monotonic_ns()
        drain_ms = max(0.0, (now_ns - started_ns) / 1_000_000.0)
        interval_ms = (
            None
            if self._last_poll_ns is None
            else max(0.0, (started_ns - self._last_poll_ns) / 1_000_000.0)
        )
        self._last_poll_ns = started_ns
        self._longest_drain_stall_ms = max(self._longest_drain_stall_ms, drain_ms)

        frame_due = not _startup_drain and (
            force_samples
            or self._last_frame_sample_ns is None
            or now_ns - self._last_frame_sample_ns
            >= int(self.settings.frame_sample_interval_seconds * 1_000_000_000)
        )
        health_due = not _startup_drain and (
            force_samples
            or self._last_health_ns is None
            or now_ns - self._last_health_ns
            >= int(self.settings.health_interval_seconds * 1_000_000_000)
        )
        safety_due = not _startup_drain and bool(self.settings.safety_ranges) and (
            force_samples
            or self._last_safety_sample_ns is None
            or now_ns - self._last_safety_sample_ns
            >= int(self.settings.safety_range_interval_seconds * 1_000_000_000)
        )
        frame_poll_latency_ms: float | None = None
        if frame_due or health_due:
            status_started = self.clock.monotonic_ns()
            status = self.client.status()
            status_finished = self.clock.monotonic_ns()
            frame_poll_latency_ms = max(0.0, (status_finished - status_started) / 1_000_000.0)
            if status.get("bridgeEpoch") != batch.bridge_epoch:
                raise BridgeProtocolError("bridge instance epoch changed during status sampling")
            if status.get("queueModel") != "unified":
                raise BridgeProtocolError("Project64 status lost the unified queue contract")
            frame = status.get("frameCount")
            self._last_frame = _integer(frame, "frame count", nullable=True)
            if self._last_frame is not None and self._last_frame < 0:
                raise BridgeProtocolError("Project64 frame count must be nonnegative")
            if frame_due and self._last_frame is not None:
                execution = self.client.execution()
                emu_state = status.get("emuState")
                system_paused = (
                    emu_state.get("systemPaused") if isinstance(emu_state, Mapping) else None
                )
                debug_paused = status.get("debugPaused")
                self.store.record_frame_sample(
                    frame_number=self._last_frame,
                    host_monotonic_ns=self._next_host_ns(),
                    execution_state=(
                        str(execution.get("state")) if execution.get("state") is not None else None
                    ),
                    system_paused=system_paused if isinstance(system_paused, bool) else None,
                    debug_paused=debug_paused if isinstance(debug_paused, bool) else None,
                    frame_hash=None,
                    configuration_sha256=None,
                    queue_depth=queue_depth,
                    dropped_total=dropped_total,
                )
                self._record_pc_sample(status)
                self._last_frame_sample_ns = now_ns
        if health_due:
            self.store.record_health(
                frame_number=self._last_frame,
                host_monotonic_ns=self._next_host_ns(),
                queue_depth=queue_depth,
                queue_high_water=self._queue_high_water,
                dropped_total=dropped_total,
                drain_interval_ms=interval_ms,
                longest_drain_stall_ms=self._longest_drain_stall_ms,
                frame_poll_latency_ms=frame_poll_latency_ms,
                cpu_core=self.preflight.cpu_core if self.preflight is not None else "unknown",
                bridge_reconnects=0,
                watch_failures=self._watch_failures,
                recorder_exceptions=self._recorder_exceptions,
                continuity_status=self._continuity,
            )
            self._last_health_ns = now_ns
        if safety_due:
            self._sample_safety_ranges()
            self._last_safety_sample_ns = now_ns
        return PollResult(
            stored_events=len(pending),
            remaining=batch.remaining,
            dropped_total=dropped_total,
            frame_number=self._last_frame,
        )

    def run(
        self,
        *,
        maximum_polls: int | None = None,
        should_stop: Callable[[], bool] | None = None,
    ) -> int:
        polls = 0
        while maximum_polls is None or polls < maximum_polls:
            if self.store.stop_requested() or (should_stop is not None and should_stop()):
                break
            try:
                self.poll_once()
            except Exception:
                self._recorder_exceptions += 1
                self._continuity = "broken"
                self.store.set_continuity_broken("recorder exception interrupted event draining")
                raise
            polls += 1
            self.clock.sleep(self.settings.poll_interval_seconds)
        return polls

    def stop_instrumentation(self) -> None:
        """Stop only recorder-owned instrumentation; queued evidence remains drainable."""

        if self._cold_boot_armed:
            self.client.cold_boot_cancel()
            self._cold_boot_armed = False
        if self._capture_enabled:
            self.client.capture_stop()
            self._capture_enabled = False
        if self._dma_enabled:
            self.client.dma_stop()
            self._dma_enabled = False
        for bridge_watch_id in reversed(self._installed_bridge_watch_ids):
            self.client.remove_watch(bridge_watch_id)
        self._installed_bridge_watch_ids.clear()
        removed_sequence = self._append_recorder_event(
            "instrumentation-stopped",
            {
                "kind": "instrumentation-stopped",
                "bridgeEpoch": self.preflight.bridge_epoch if self.preflight else None,
                "bridgeNextSequence": self._bridge_next_sequence,
                "executionAndInputCaptureStopped": True,
            },
        )
        self.store.mark_recorder_watches_removed(removed_sequence)

    def drain_to_empty(self, maximum_rounds: int = 16) -> None:
        for _ in range(maximum_rounds):
            result = self.poll_once(force_samples=True)
            if result.remaining == 0:
                return
        self._continuity = "broken"
        self.store.set_continuity_broken("queues did not drain to empty during bounded shutdown")
        raise BridgeProtocolError("Project64 event queues did not drain to empty")

    def append_terminal_event(self, status: str) -> int:
        if self._continuity == "continuous" and self._pending_dma_starts:
            first = min(self._pending_dma_starts)
            raise BridgeProtocolError(f"capture ended with an unmatched DMA start at {first}")
        self.store.set_bridge_next_sequence_end(self._bridge_next_sequence)
        return self._append_recorder_event(
            "session-stop" if status == "closed" else "session-interruption",
            {
                "kind": "session-stop" if status == "closed" else "session-interruption",
                "closureStatus": status,
                "continuityStatus": self._continuity,
                "bridgeEpoch": self.preflight.bridge_epoch if self.preflight else None,
                "bridgeNextSequenceEnd": self._bridge_next_sequence,
                "machineEventOrder": "emulator-global-bridge-sequence",
            },
        )
