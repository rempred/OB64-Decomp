"""Repo-local client for the OB64 Project64 bridge.

The normal Total Resolver path is observation-only. Methods which mutate RAM,
emulator state, or controller state are named explicitly and are never called
by ``doctor`` or the future passive recorder startup path.
"""

from __future__ import annotations

from dataclasses import dataclass
import json
from pathlib import Path
import socket
from typing import Any, Mapping, Protocol, Sequence

from .addressing import RDRAM_SIZE
from .protocol import BridgeHandshake, BridgeProtocolError, validate_handshake


DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 64640
FRONTIER_EDGE_BATCH_SIZE = 512
FRONTIER_INSTRUCTION_BATCH_SIZE = 512
MEMORY_KINDS = frozenset(("u8", "u16", "u32", "s8", "s16", "s32"))
WATCH_KINDS = frozenset(("exec", "read", "write"))


@dataclass(frozen=True)
class MemoryFingerprint:
    address: int
    size: int
    algorithm: str
    digest: str


@dataclass(frozen=True)
class MemoryFingerprintBatch:
    bridge_epoch: str
    next_event_sequence: int
    frame_count: int | None
    ranges: tuple[MemoryFingerprint, ...]


@dataclass(frozen=True)
class MemoryBlock:
    bridge_epoch: str
    next_event_sequence: int
    frame_count: int | None
    address: int
    data: bytes
    fingerprint_algorithm: str
    fingerprint: str


@dataclass(frozen=True)
class BaselineSnapshot:
    snapshot_id: str
    bridge_epoch: str
    bridge_sequence: int
    frame_count: int | None
    pc: str
    data: bytes


class Pj64Error(RuntimeError):
    """A transport or bridge command failed."""


class BridgeTransport(Protocol):
    def connect(self) -> None: ...

    def request(self, line: str) -> Mapping[str, Any]: ...

    def close(self) -> None: ...


class SocketLineTransport:
    """Persistent newline-framed JSON transport used by the accepted bridge."""

    def __init__(self, host: str, port: int, timeout: float) -> None:
        self.host = host
        self.port = port
        self.timeout = timeout
        self._socket: socket.socket | None = None
        self._buffer = b""

    def connect(self) -> None:
        if self._socket is not None:
            return
        try:
            sock = socket.create_connection((self.host, self.port), timeout=self.timeout)
            sock.settimeout(self.timeout)
        except OSError as exc:
            raise Pj64Error(
                f"cannot connect to Project64 bridge at {self.host}:{self.port}: {exc}"
            ) from exc
        self._socket = sock
        self._buffer = b""

    def close(self) -> None:
        if self._socket is None:
            return
        try:
            self._socket.close()
        finally:
            self._socket = None
            self._buffer = b""

    def request(self, line: str) -> Mapping[str, Any]:
        _validate_line(line)
        self.connect()
        assert self._socket is not None
        try:
            self._socket.sendall((line + "\n").encode("utf-8"))
            while b"\n" not in self._buffer:
                chunk = self._socket.recv(65536)
                if not chunk:
                    raise Pj64Error("Project64 bridge closed the connection")
                self._buffer += chunk
        except OSError as exc:
            raise Pj64Error(f"Project64 bridge transport failed: {exc}") from exc

        raw, _, self._buffer = self._buffer.partition(b"\n")
        try:
            value = json.loads(raw.decode("utf-8", errors="strict"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise Pj64Error("Project64 bridge returned invalid JSON") from exc
        if not isinstance(value, dict):
            raise Pj64Error("Project64 bridge response must be a JSON object")
        return value


def _validate_line(line: str) -> None:
    if not isinstance(line, str) or not line.strip():
        raise ValueError("bridge command must be a nonempty string")
    if "\r" in line or "\n" in line:
        raise ValueError("bridge command must contain exactly one line")


def _path_argument(path: str | Path) -> str:
    value = str(path)
    if not value:
        raise ValueError("path must not be empty")
    _validate_line(value)
    return value


def _label_argument(label: str) -> str:
    _validate_line(label or "_")
    return "_".join(label.split()) if label else ""


def _u32(value: int, name: str) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or not 0 <= value <= 0xFFFFFFFF:
        raise ValueError(f"{name} must be an unsigned 32-bit integer")
    return value


def _positive(value: int, name: str, *, maximum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value < 1:
        raise ValueError(f"{name} must be a positive integer")
    if maximum is not None and value > maximum:
        raise ValueError(f"{name} must be at most {maximum}")
    return value


def _nonnegative(value: int, name: str, *, maximum: int | None = None) -> int:
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise ValueError(f"{name} must be a nonnegative integer")
    if maximum is not None and value > maximum:
        raise ValueError(f"{name} must be at most {maximum}")
    return value


class Pj64Client:
    """Accepted bridge client surface for capture and later explicit control modes."""

    def __init__(
        self,
        host: str = DEFAULT_HOST,
        port: int = DEFAULT_PORT,
        timeout: float = 5.0,
        *,
        transport: BridgeTransport | None = None,
        allow_unloaded: bool = False,
    ) -> None:
        self.host = host
        self.port = port
        self.timeout = timeout
        self._transport = transport or SocketLineTransport(host, port, timeout)
        self._allow_unloaded = allow_unloaded
        self.handshake_result: BridgeHandshake | None = None

    def connect(self) -> Pj64Client:
        if self.handshake_result is not None:
            return self
        self._transport.connect()
        try:
            self.handshake_result = self._perform_handshake()
        except Exception:
            self._transport.close()
            raise
        return self

    def close(self) -> None:
        self._transport.close()
        self.handshake_result = None

    def observation_only(self) -> ObservationOnlyPj64Client:
        """Return the capture facade, which has no mutation/control methods."""

        return ObservationOnlyPj64Client(self)

    def __enter__(self) -> Pj64Client:
        return self.connect()

    def __exit__(self, *_exc: Any) -> None:
        self.close()

    def _raw_command(self, line: str) -> dict[str, Any]:
        _validate_line(line)
        response = self._transport.request(line)
        if response.get("ok") is not True:
            error = response.get("error")
            raise Pj64Error(str(error or f"bridge command failed: {line}"))
        return dict(response)

    def _perform_handshake(self) -> BridgeHandshake:
        ping = self._raw_command("ping")
        status = self._raw_command("status")
        health = self._raw_command("health")
        return validate_handshake(
            ping,
            status,
            health,
            allow_unloaded=self._allow_unloaded,
        )

    def handshake(self) -> BridgeHandshake:
        self.connect()
        assert self.handshake_result is not None
        return self.handshake_result

    def _command(self, line: str) -> dict[str, Any]:
        # Every operation crosses the exact-version gate, even when callers do
        # not explicitly use a context manager or call connect().
        self.connect()
        return self._raw_command(line)

    # Observation and identity.
    def ping(self) -> bool:
        return self._command("ping").get("pong") is True

    def status(self) -> dict[str, Any]:
        return self._command("status")

    def health(self) -> dict[str, Any]:
        return self._command("health")

    def execution(self) -> dict[str, Any]:
        return dict(self._command("execution").get("execution") or {})

    def exception(self) -> dict[str, Any]:
        return dict(self._command("exception").get("exception") or {})

    def emulator_state(self) -> dict[str, Any]:
        return dict(self._command("emustate").get("emuState") or {})

    def registers(self) -> dict[str, Any]:
        return dict(self._command("regs").get("regs") or {})

    def require_interpreter(self) -> None:
        core = str(self.health().get("core") or "unknown")
        if core != "interpreter":
            raise BridgeProtocolError(
                f"watch capture requires the interpreter core; connected core is {core!r}"
            )

    def frame_count(self) -> int:
        value = self._command("framecount").get("frameCount")
        if not isinstance(value, int) or isinstance(value, bool):
            raise Pj64Error("framecount response omitted an integer frameCount")
        return value

    # Memory observation.
    def read(self, address: int, kind: str = "u32") -> int:
        return self.read_many(((kind, address),))[0]

    def read_many(self, specs: Sequence[tuple[str, int]]) -> list[int]:
        if not specs:
            return []
        parts: list[str] = []
        for kind, address in specs:
            if kind not in MEMORY_KINDS:
                raise ValueError(f"unsupported memory kind: {kind}")
            parts.extend((kind, f"0x{_u32(address, 'address'):X}"))
        values = self._command("peekmany " + " ".join(parts)).get("values")
        if not isinstance(values, list) or len(values) != len(specs):
            raise Pj64Error("peekmany response count does not match the request")
        result: list[int] = []
        for value in values:
            if not isinstance(value, Mapping) or not isinstance(value.get("decimal"), int):
                raise Pj64Error("peekmany response contains a malformed value")
            result.append(int(value["decimal"]))
        return result

    def read_bytes(self, address: int, size: int, *, chunk_size: int = 256) -> bytes:
        _u32(address, "address")
        _positive(size, "size")
        _positive(chunk_size, "chunk_size", maximum=1024)
        if address + size > 0x100000000:
            raise ValueError("memory read crosses the 32-bit address boundary")
        output = bytearray()
        for offset in range(0, size, chunk_size):
            count = min(chunk_size, size - offset)
            specs = tuple(("u8", address + offset + index) for index in range(count))
            output.extend(value & 0xFF for value in self.read_many(specs))
        return bytes(output)

    def memory_fingerprints(
        self, specs: Sequence[tuple[int, int]]
    ) -> MemoryFingerprintBatch:
        """Fingerprint bounded ranges without transferring their contents.

        The bridge uses FNV-1a/32 as a cheap change signal.  Callers must use
        :meth:`read_block` when they need the actual observed bytes.
        """

        if not specs:
            raise ValueError("at least one memory fingerprint range is required")
        parts: list[str] = []
        total = 0
        normalized: list[tuple[int, int]] = []
        for address, size in specs:
            checked_address = _u32(address, "address")
            checked_size = _positive(size, "size", maximum=0x100000)
            if checked_address + checked_size > 0x100000000:
                raise ValueError("memory fingerprint range crosses the 32-bit boundary")
            total += checked_size
            if total > RDRAM_SIZE:
                raise ValueError("memory fingerprint aggregate must be at most 4 MiB")
            normalized.append((checked_address, checked_size))
            parts.extend((f"0x{checked_address:X}", f"0x{checked_size:X}"))
        response = self._command("hashmem " + " ".join(parts))
        ranges = response.get("ranges")
        if not isinstance(ranges, list) or len(ranges) != len(normalized):
            raise Pj64Error("hashmem response count does not match the request")
        parsed: list[MemoryFingerprint] = []
        for expected, item in zip(normalized, ranges, strict=True):
            if not isinstance(item, Mapping):
                raise Pj64Error("hashmem response contains a malformed range")
            try:
                observed_address = int(str(item.get("address")), 0)
            except (TypeError, ValueError) as exc:
                raise Pj64Error("hashmem response contains a malformed address") from exc
            observed_size = item.get("size")
            algorithm = item.get("hashAlgorithm")
            digest = item.get("hash")
            if (
                (observed_address, observed_size) != expected
                or algorithm != "fnv1a32"
                or not isinstance(digest, str)
                or not digest.startswith("0x")
            ):
                raise Pj64Error("hashmem response disagrees with the requested range")
            parsed.append(
                MemoryFingerprint(observed_address, int(observed_size), algorithm, digest.upper())
            )
        epoch, next_sequence, frame = self._memory_observation_context(response, "hashmem")
        return MemoryFingerprintBatch(epoch, next_sequence, frame, tuple(parsed))

    def read_block(self, address: int, size: int) -> MemoryBlock:
        """Read one bounded block and retain its bridge-side fingerprint/context."""

        checked_address = _u32(address, "address")
        checked_size = _positive(size, "size", maximum=0x100000)
        if checked_address + checked_size > 0x100000000:
            raise ValueError("memory block crosses the 32-bit address boundary")
        response = self._command(f"readblock 0x{checked_address:X} 0x{checked_size:X}")
        try:
            observed_address = int(str(response.get("address")), 0)
        except (TypeError, ValueError) as exc:
            raise Pj64Error("readblock response contains a malformed address") from exc
        observed_size = response.get("size")
        encoding = response.get("bytesEncoding")
        encoded = response.get("bytesHex")
        algorithm = response.get("hashAlgorithm")
        digest = response.get("hash")
        if (
            observed_address != checked_address
            or observed_size != checked_size
            or encoding != "hex-uppercase"
            or not isinstance(encoded, str)
            or len(encoded) != checked_size * 2
            or algorithm != "fnv1a32"
            or not isinstance(digest, str)
            or not digest.startswith("0x")
        ):
            raise Pj64Error("readblock response disagrees with the requested range")
        try:
            data = bytes.fromhex(encoded)
        except ValueError as exc:
            raise Pj64Error("readblock response contains malformed hexadecimal bytes") from exc
        epoch, next_sequence, frame = self._memory_observation_context(response, "readblock")
        return MemoryBlock(
            epoch,
            next_sequence,
            frame,
            observed_address,
            data,
            algorithm,
            digest.upper(),
        )

    def _memory_observation_context(
        self, response: Mapping[str, Any], command: str
    ) -> tuple[str, int, int | None]:
        epoch = response.get("bridgeEpoch")
        next_sequence = response.get("nextEventSequence")
        frame = response.get("frameCount")
        if not isinstance(epoch, str) or not epoch:
            raise Pj64Error(f"{command} response omitted the bridge epoch")
        if isinstance(next_sequence, bool) or not isinstance(next_sequence, int) or next_sequence < 1:
            raise Pj64Error(f"{command} response omitted nextEventSequence")
        if frame is not None and (isinstance(frame, bool) or not isinstance(frame, int) or frame < 0):
            raise Pj64Error(f"{command} response contains a malformed frame count")
        return epoch, next_sequence, frame

    # Watch/event observation. The accepted bridge supports per-ID removal, so the
    # recorder never needs a global clear that could destroy another owner.
    def install_watch(
        self,
        kind: str,
        address: int,
        *,
        size: int = 1,
        label: str = "",
    ) -> dict[str, Any]:
        if kind not in WATCH_KINDS:
            raise ValueError(f"unsupported watch kind: {kind}")
        suffix = f" {_label_argument(label)}" if label else ""
        response = self._command(
            f"watch {kind} 0x{_u32(address, 'address'):X} {_positive(size, 'size')}{suffix}"
        )
        watch = response.get("watch")
        if not isinstance(watch, Mapping):
            raise Pj64Error("watch response omitted watch definition")
        return dict(watch)

    def install_focused_watch(
        self,
        *,
        live_start: int,
        live_end_exclusive: int,
        entry_opcode: int,
        signature_bytes: bytes,
        profile_id: str,
        target_id: str,
        function_id: int,
        z64_start: int,
        sample_mode: str,
        pointer_snapshots: Sequence[tuple[str, int, str]],
        stack_words: int,
    ) -> dict[str, Any]:
        """Install one exact native-gated focused function trigger."""

        start = _u32(live_start, "live_start")
        end = _u32(live_end_exclusive, "live_end_exclusive")
        if end <= start:
            raise ValueError("focused live range must be nonempty")
        opcode = _u32(entry_opcode, "entry_opcode")
        if not 4 <= len(signature_bytes) <= 64 or len(signature_bytes) & 3:
            raise ValueError("focused signature must contain 4..64 aligned bytes")
        signature = signature_bytes.hex().upper()
        profile = _label_argument(profile_id)
        target = _label_argument(target_id)
        if profile != profile_id or target != target_id:
            raise ValueError("focused profile and target IDs must be whitespace-free tokens")
        if sample_mode not in {"all", "first-per-frame"}:
            raise ValueError("unsupported focused sample mode")
        pointer_parts: list[str] = []
        for register, size, label in pointer_snapshots:
            if register not in {"a0", "a1", "a2", "a3"}:
                raise ValueError(f"unsupported focused pointer register: {register}")
            token_label = _label_argument(label)
            if token_label != label:
                raise ValueError("focused pointer labels must be whitespace-free tokens")
            pointer_parts.append(
                f"{register}:{_positive(size, 'pointer size', maximum=4096)}:{token_label}"
            )
        recipe = ",".join(pointer_parts) if pointer_parts else "-"
        response = self._command(
            "focusedwatch "
            f"0x{start:X} 0x{end:X} 0x{opcode:X} {signature} "
            f"{profile} {target} {_positive(function_id, 'function_id')} "
            f"0x{_u32(z64_start, 'z64_start'):X} {sample_mode} {recipe} "
            f"{_nonnegative(stack_words, 'stack_words', maximum=128)}"
        )
        watch = response.get("watch")
        if not isinstance(watch, Mapping):
            raise Pj64Error("focusedwatch response omitted watch definition")
        return dict(watch)

    def watch_exec(self, address: int, *, size: int = 1, label: str = "") -> dict[str, Any]:
        return self.install_watch("exec", address, size=size, label=label)

    def watch_read(self, address: int, *, size: int = 1, label: str = "") -> dict[str, Any]:
        return self.install_watch("read", address, size=size, label=label)

    def watch_write(self, address: int, *, size: int = 1, label: str = "") -> dict[str, Any]:
        return self.install_watch("write", address, size=size, label=label)

    def remove_watch(self, bridge_watch_id: int) -> dict[str, Any]:
        response = self._command(f"unwatch {_positive(bridge_watch_id, 'bridge_watch_id')}")
        removed = response.get("removedWatch")
        if not isinstance(removed, Mapping):
            raise Pj64Error("unwatch response omitted the removed watch definition")
        return dict(removed)

    def drain_events(self, maximum: int | None = None) -> dict[str, Any]:
        command = "drain" if maximum is None else f"drain {_positive(maximum, 'maximum')}"
        return self._command(command)

    def clear_all_watches_and_events(self) -> dict[str, Any]:
        """Explicit global bridge mutation; never used by passive startup."""
        return self._command("clear")

    def frontier_status(self) -> dict[str, Any]:
        value = self._command("frontier status").get("frontier")
        if not isinstance(value, Mapping):
            raise Pj64Error("frontier status omitted its exact state")
        return dict(value)

    def load_novelty_frontier(
        self,
        frontier: Any,
        *,
        native_path: Path | None = None,
        instruction_batch_size: int = FRONTIER_INSTRUCTION_BATCH_SIZE,
        edge_batch_size: int = FRONTIER_EDGE_BATCH_SIZE,
    ) -> dict[str, Any]:
        """Load one exact binary frontier directly into Project64."""

        del instruction_batch_size, edge_batch_size  # retained for API compatibility
        from .knowledge import native_frontier_cache_path, write_native_frontier

        identity = str(frontier.identity)
        rom_sha256 = str(frontier.rom_normalized_sha256)
        if (
            not identity
            or len(identity) > 192
            or any(character.isspace() or ord(character) < 0x21 for character in identity)
        ):
            raise ValueError("frontier identity must be one bounded opaque token")
        if len(rom_sha256) != 64:
            raise ValueError("frontier ROM identity must be SHA-256")
        path = write_native_frontier(frontier, native_path or native_frontier_cache_path(frontier))
        path_hex = str(path).encode("utf-16le").hex().upper()
        response = self._command(f"frontier load {identity} {rom_sha256} {path_hex}")
        status = response.get("frontier")
        expected = {
            "formatVersion": int(frontier.format_version),
            "committed": True,
            "frontierIdentity": identity,
            "romNormalizedSha256": rom_sha256,
            "physicalPageCount": len(frontier.pages),
            "instructionCount": int(frontier.instruction_count),
            "edgeCount": len(frontier.edges),
            "callCount": len(frontier.calls),
            "dmaCount": len(frontier.dma),
            "instructionMaxOrdinal": max(
                (item.fact_ordinal for item in frontier.instructions), default=0
            ),
            "edgeMaxOrdinal": max((item.fact_ordinal for item in frontier.edges), default=0),
            "callMaxOrdinal": max((item.fact_ordinal for item in frontier.calls), default=0),
            "dmaMaxOrdinal": max((item.fact_ordinal for item in frontier.dma), default=0),
            "nativeLoaded": True,
            "nativeRdramSize": RDRAM_SIZE,
        }
        if not isinstance(status, Mapping) or any(status.get(key) != value for key, value in expected.items()):
            raise BridgeProtocolError("bridge frontier commit did not preserve the exact loaded identity")
        return dict(status)

    def capture_start(self, frontier_identity: str) -> dict[str, Any]:
        """Enable native-filtered execution coverage and effective P1 input observation."""
        if (
            not frontier_identity
            or len(frontier_identity) > 192
            or any(
                character.isspace() or ord(character) < 0x21
                for character in frontier_identity
            )
        ):
            raise ValueError("frontier_identity must be one bounded opaque token")
        return self._command("capture on " + frontier_identity)

    def configure_execution_context(self, enabled: bool) -> dict[str, Any]:
        """Enable the marker ring only for focused captures, before capture starts."""
        if not isinstance(enabled, bool):
            raise TypeError("enabled must be a boolean")
        response = self._command("context configure " + ("on" if enabled else "off"))
        context = response.get("context")
        if (
            not isinstance(context, Mapping)
            or context.get("configured") is not True
            or context.get("enabled") is not enabled
        ):
            raise BridgeProtocolError("bridge did not preserve execution-context configuration")
        return dict(context)

    def cold_boot_arm(
        self,
        frontier_identity: str,
        expected_crc1: str,
        expected_crc2: str,
    ) -> dict[str, Any]:
        for value, name in (
            (frontier_identity, "frontier_identity"),
            (expected_crc1, "expected_crc1"),
            (expected_crc2, "expected_crc2"),
        ):
            if not isinstance(value, str) or not value:
                raise ValueError(f"{name} must be nonempty text")
        for value, name in ((expected_crc1, "expected_crc1"), (expected_crc2, "expected_crc2")):
            if len(value) != 8 or value != value.upper() or any(c not in "0123456789ABCDEF" for c in value):
                raise ValueError(f"{name} must be eight uppercase hexadecimal digits")
        return self._command(
            f"coldboot arm {frontier_identity} {expected_crc1} {expected_crc2}"
        )

    def cold_boot_status(self) -> dict[str, Any]:
        value = self._command("coldboot status").get("coldBoot")
        if not isinstance(value, Mapping):
            raise Pj64Error("cold-boot status omitted its state")
        return dict(value)

    def cold_boot_cancel(self) -> dict[str, Any]:
        return self._command("coldboot cancel")

    def capture_stop(self) -> dict[str, Any]:
        return self._command("capture off")

    def capture_status(self) -> dict[str, Any]:
        return self._command("capture status")

    def arm_execution_context(
        self,
        session_id: str,
        marker_id: int,
        *,
        before: int = 256,
        after: int = 256,
    ) -> dict[str, Any]:
        if (
            not session_id
            or len(session_id) > 192
            or any(character.isspace() or ord(character) < 0x21 for character in session_id)
        ):
            raise ValueError("session_id must be one bounded opaque token")
        if isinstance(before, bool) or not isinstance(before, int) or not 0 <= before <= 4096:
            raise ValueError("before must be between zero and 4096")
        bounded_after = _positive(after, "after", maximum=4096)
        response = self._command(
            f"context marker {session_id} {_positive(marker_id, 'marker_id')} "
            f"{before} {bounded_after}"
        )
        context = response.get("context")
        if not isinstance(context, Mapping) or context.get("markerId") != marker_id:
            raise BridgeProtocolError("bridge did not arm the requested marker context")
        return dict(context)

    def baseline_status(self) -> dict[str, Any]:
        value = self._command("baseline status").get("baseline")
        if not isinstance(value, Mapping):
            raise Pj64Error("baseline status omitted its snapshot state")
        return dict(value)

    def read_baseline_snapshot(self) -> BaselineSnapshot:
        status = self.baseline_status()
        if status.get("state") != "ready":
            raise Pj64Error(f"native baseline snapshot is not ready: {status.get('state')}")
        snapshot_id = status.get("snapshotId")
        bridge_sequence = status.get("bridgeSequence")
        if (
            not isinstance(snapshot_id, str)
            or not snapshot_id
            or isinstance(bridge_sequence, bool)
            or not isinstance(bridge_sequence, int)
            or status.get("byteLength") != RDRAM_SIZE
            or status.get("rdramSize") != RDRAM_SIZE
        ):
            raise BridgeProtocolError("native baseline snapshot identity is incomplete")
        chunks: list[bytes] = []
        for offset in range(0, RDRAM_SIZE, 0x100000):
            response = self._command(
                f"baseline read {snapshot_id} {offset} {min(0x100000, RDRAM_SIZE - offset)}"
            )
            baseline = response.get("baseline")
            encoded = response.get("bytesHex")
            if (
                not isinstance(baseline, Mapping)
                or baseline.get("snapshotId") != snapshot_id
                or baseline.get("bridgeSequence") != bridge_sequence
                or not isinstance(encoded, str)
            ):
                raise BridgeProtocolError("baseline chunk changed identity while being read")
            try:
                chunks.append(bytes.fromhex(encoded))
            except ValueError as exc:
                raise BridgeProtocolError("baseline chunk is not hexadecimal") from exc
        data = b"".join(chunks)
        if len(data) != RDRAM_SIZE:
            raise BridgeProtocolError("baseline snapshot is not exactly 4 MiB")
        return BaselineSnapshot(
            snapshot_id,
            self.handshake().bridge_epoch,
            bridge_sequence,
            status.get("frameCount") if isinstance(status.get("frameCount"), int) else None,
            str(status.get("pc")),
            data,
        )

    def release_baseline_snapshot(self, snapshot_id: str) -> dict[str, Any]:
        if not snapshot_id or any(character.isspace() for character in snapshot_id):
            raise ValueError("snapshot_id must be one token")
        return self._command("baseline release " + snapshot_id)

    # Native PI DMA observation.
    def dma_start(
        self,
        physical_start: int = 0,
        physical_end: int = RDRAM_SIZE,
        *,
        maximum: int = 8192,
        skip_length: int = 0,
        context_words: int = 0,
    ) -> dict[str, Any]:
        if physical_start >= physical_end:
            raise ValueError("physical DMA range must be nonempty")
        _positive(maximum, "maximum")
        if not 0 <= context_words <= 128:
            raise ValueError("context_words must be 0..128")
        command = (
            f"dma on 0x{_u32(physical_start, 'physical_start'):X} "
            f"0x{_u32(physical_end, 'physical_end'):X} {maximum} "
            f"0x{_u32(skip_length, 'skip_length'):X}"
        )
        if context_words:
            command += f" {context_words}"
        return self._command(command)

    def dma_set_rom_range(self, rom_start: int, rom_end: int) -> dict[str, Any]:
        if rom_start >= rom_end:
            raise ValueError("ROM DMA range must be nonempty")
        return self._command(
            f"dma cart 0x{_u32(rom_start, 'rom_start'):X} 0x{_u32(rom_end, 'rom_end'):X}"
        )

    def dma_status(self) -> dict[str, Any]:
        return self._command("dma status")

    def dma_drain(self, maximum: int | None = None) -> dict[str, Any]:
        raise BridgeProtocolError(
            "the accepted bridge has one unified ordered queue; use drain_events()"
        )

    def dma_stop(self) -> dict[str, Any]:
        return self._command("dma off")

    # Explicit emulator-control methods for focused research and later optional
    # automation. Passive capture does not call these.
    def open_rom(self, path: str | Path) -> dict[str, Any]:
        return self._command("openrom " + _path_argument(path))

    def close_rom(self) -> dict[str, Any]:
        return self._command("closerom")

    def pause(self) -> dict[str, Any]:
        return self._command("pause")

    def resume(self) -> dict[str, Any]:
        return self._command("resume")

    def frame_step(self, frames: int = 1) -> dict[str, Any]:
        return self._command(f"framestep {_positive(frames, 'frames')}")

    def instruction_step(self) -> dict[str, Any]:
        return self._command("step")

    def save_state(self, path: str | Path) -> dict[str, Any]:
        return self._command("savestate " + _path_argument(path))

    def load_state(self, path: str | Path) -> dict[str, Any]:
        return self._command("loadstate " + _path_argument(path))

    def capture_framebuffer(self, path: str | Path) -> dict[str, Any]:
        return self._command("framebuffer " + _path_argument(path))

    def frame_hash(self) -> dict[str, Any]:
        return self._command("framehash")

    def dump_memory(self, address: int, size: int, path: str | Path) -> dict[str, Any]:
        return self._command(
            f"dumpmem 0x{_u32(address, 'address'):X} "
            f"0x{_positive(size, 'size', maximum=0x1000000):X} {_path_argument(path)}"
        )

    def write_memory(self, address: int, value: int, kind: str = "u32") -> dict[str, Any]:
        if kind not in MEMORY_KINDS:
            raise ValueError(f"unsupported memory kind: {kind}")
        return self._command(
            f"poke {kind} 0x{_u32(address, 'address'):X} 0x{_u32(value, 'value'):X}"
        )

    def press_button(self, button: str, *, samples: int = 6) -> dict[str, Any]:
        normalized = _label_argument(button).lower()
        if not normalized:
            raise ValueError("button must not be empty")
        return self._command(f"input {normalized} {_positive(samples, 'samples')}")

    def set_stick(self, x: int, y: int, *, samples: int = 6) -> dict[str, Any]:
        if not -128 <= x <= 127 or not -128 <= y <= 127:
            raise ValueError("stick axes must be -128..127")
        return self._command(f"input stick {x} {y} {_positive(samples, 'samples')}")

    def clear_input(self) -> dict[str, Any]:
        return self._command("input clear")


class ObservationOnlyPj64Client:
    """Narrow recorder authority with no emulator mutation/control methods.

    Persistent knowledge and captured bytes pass only through this facade
    during recorder operation. Explicit research commands may still use the
    broader client, but the recorder cannot reach that command surface.
    """

    __slots__ = ("__client",)

    def __init__(self, client: Pj64Client) -> None:
        self.__client = client

    @property
    def handshake_result(self) -> BridgeHandshake | None:
        return self.__client.handshake_result

    def connect(self) -> ObservationOnlyPj64Client:
        self.__client.connect()
        return self

    def close(self) -> None:
        self.__client.close()

    def status(self) -> dict[str, Any]:
        return self.__client.status()

    def health(self) -> dict[str, Any]:
        return self.__client.health()

    def execution(self) -> dict[str, Any]:
        return self.__client.execution()

    def drain_events(self, maximum: int | None = None) -> dict[str, Any]:
        return self.__client.drain_events(maximum)

    def dma_start(
        self,
        physical_start: int = 0,
        physical_end: int = RDRAM_SIZE,
        *,
        maximum: int = 8192,
        skip_length: int = 0,
        context_words: int = 0,
    ) -> dict[str, Any]:
        return self.__client.dma_start(
            physical_start,
            physical_end,
            maximum=maximum,
            skip_length=skip_length,
            context_words=context_words,
        )

    def dma_set_rom_range(self, rom_start: int, rom_end: int) -> dict[str, Any]:
        return self.__client.dma_set_rom_range(rom_start, rom_end)

    def dma_stop(self) -> dict[str, Any]:
        return self.__client.dma_stop()

    def load_novelty_frontier(
        self,
        frontier: Any,
        *,
        instruction_batch_size: int = FRONTIER_INSTRUCTION_BATCH_SIZE,
        edge_batch_size: int = FRONTIER_EDGE_BATCH_SIZE,
    ) -> dict[str, Any]:
        return self.__client.load_novelty_frontier(
            frontier,
            instruction_batch_size=instruction_batch_size,
            edge_batch_size=edge_batch_size,
        )

    def baseline_status(self) -> dict[str, Any]:
        return self.__client.baseline_status()

    def read_baseline_snapshot(self) -> BaselineSnapshot:
        return self.__client.read_baseline_snapshot()

    def release_baseline_snapshot(self, snapshot_id: str) -> dict[str, Any]:
        return self.__client.release_baseline_snapshot(snapshot_id)

    def capture_start(self, frontier_identity: str) -> dict[str, Any]:
        return self.__client.capture_start(frontier_identity)

    def configure_execution_context(self, enabled: bool) -> dict[str, Any]:
        return self.__client.configure_execution_context(enabled)

    def capture_stop(self) -> dict[str, Any]:
        return self.__client.capture_stop()

    def cold_boot_arm(
        self, frontier_identity: str, expected_crc1: str, expected_crc2: str
    ) -> dict[str, Any]:
        return self.__client.cold_boot_arm(frontier_identity, expected_crc1, expected_crc2)

    def cold_boot_status(self) -> dict[str, Any]:
        return self.__client.cold_boot_status()

    def cold_boot_cancel(self) -> dict[str, Any]:
        return self.__client.cold_boot_cancel()

    def install_watch(
        self, kind: str, address: int, *, size: int = 1, label: str = ""
    ) -> dict[str, Any]:
        return self.__client.install_watch(kind, address, size=size, label=label)

    def install_focused_watch(
        self,
        *,
        live_start: int,
        live_end_exclusive: int,
        entry_opcode: int,
        signature_bytes: bytes,
        profile_id: str,
        target_id: str,
        function_id: int,
        z64_start: int,
        sample_mode: str,
        pointer_snapshots: Sequence[tuple[str, int, str]],
        stack_words: int,
    ) -> dict[str, Any]:
        return self.__client.install_focused_watch(
            live_start=live_start,
            live_end_exclusive=live_end_exclusive,
            entry_opcode=entry_opcode,
            signature_bytes=signature_bytes,
            profile_id=profile_id,
            target_id=target_id,
            function_id=function_id,
            z64_start=z64_start,
            sample_mode=sample_mode,
            pointer_snapshots=pointer_snapshots,
            stack_words=stack_words,
        )

    def remove_watch(self, bridge_watch_id: int) -> dict[str, Any]:
        return self.__client.remove_watch(bridge_watch_id)

    def memory_fingerprints(
        self, specs: Sequence[tuple[int, int]]
    ) -> MemoryFingerprintBatch:
        return self.__client.memory_fingerprints(specs)

    def read_block(self, address: int, size: int) -> MemoryBlock:
        return self.__client.read_block(address, size)
