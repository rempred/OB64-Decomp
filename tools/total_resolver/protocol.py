"""Fail-closed contract for the accepted OB64 Project64 bridge."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping


BRIDGE_PROTOCOL_VERSION = "0.8.0"

# Bridge 0.8.0 does not advertise a machine-readable command catalog. This map
# is therefore part of the frozen client contract. A new bridge version must be
# reviewed and added explicitly instead of inheriting capabilities by guess.
BRIDGE_CAPABILITIES = (
    "health-status",
    "memory-read",
    "memory-batch-read",
    "memory-range-fingerprint",
    "memory-block-read",
    "memory-write-explicit",
    "exec-read-write-watches",
    "unified-ordered-event-drain",
    "bridge-instance-epoch",
    "explicit-dropped-sequence-ranges",
    "native-rom-dma-start-completion-pairs",
    "native-dma-completion-events",
    "event-time-dma-destination-bytes",
    "native-generation-aware-exec-coverage",
    "exact-page-placement-dedup",
    "effective-controller-input-transitions",
    "pause-resume",
    "frame-step",
    "instruction-step",
    "state-save-load",
    "controller-input-explicit",
    "framebuffer-capture",
    "frame-hash",
    "memory-dump",
)


class BridgeProtocolError(RuntimeError):
    """The connected bridge does not satisfy the frozen protocol contract."""


@dataclass(frozen=True)
class BridgeHandshake:
    version: str
    port: int
    core: str
    rom: Mapping[str, Any] | None
    bridge_epoch: str
    queue_model: str = "unified"
    capabilities: tuple[str, ...] = BRIDGE_CAPABILITIES

    def to_dict(self) -> dict[str, Any]:
        return {
            "version": self.version,
            "port": self.port,
            "core": self.core,
            "rom": dict(self.rom) if self.rom is not None else None,
            "bridgeEpoch": self.bridge_epoch,
            "queueModel": self.queue_model,
            "capabilities": list(self.capabilities),
        }


def _version(response: Mapping[str, Any], command: str) -> str:
    value = response.get("version")
    if not isinstance(value, str) or not value:
        raise BridgeProtocolError(f"{command} response omitted bridge version")
    return value


def validate_handshake(
    ping: Mapping[str, Any],
    status: Mapping[str, Any],
    health: Mapping[str, Any],
) -> BridgeHandshake:
    """Validate three independent identity responses from bridge 0.8.0."""

    if ping.get("pong") is not True:
        raise BridgeProtocolError("ping response did not acknowledge pong")

    versions = {
        _version(ping, "ping"),
        _version(status, "status"),
        _version(health, "health"),
    }
    if versions != {BRIDGE_PROTOCOL_VERSION}:
        seen = ", ".join(sorted(versions))
        raise BridgeProtocolError(
            f"unsupported Project64 bridge version(s): {seen}; "
            f"required exactly {BRIDGE_PROTOCOL_VERSION}"
        )

    required_status = (
        "queued",
        "dropped",
        "droppedRanges",
        "watches",
        "dma",
        "capture",
        "emuState",
        "nextEventSequence",
    )
    missing_status = [name for name in required_status if name not in status]
    if missing_status:
        raise BridgeProtocolError(
            f"status response lacks {BRIDGE_PROTOCOL_VERSION} fields: "
            + ", ".join(missing_status)
        )

    epochs = {response.get("bridgeEpoch") for response in (ping, status, health)}
    if len(epochs) != 1 or not isinstance(next(iter(epochs)), str) or not next(iter(epochs)):
        raise BridgeProtocolError("ping/status/health bridge epochs are missing or inconsistent")
    bridge_epoch = str(next(iter(epochs)))
    queue_models = {response.get("queueModel") for response in (ping, status, health)}
    if queue_models != {"unified"}:
        raise BridgeProtocolError(
            f"bridge {BRIDGE_PROTOCOL_VERSION} requires one unified ordered event queue"
        )
    dropped_ranges = status.get("droppedRanges")
    if not isinstance(dropped_ranges, list):
        raise BridgeProtocolError("status droppedRanges must be an array")
    capture = status.get("capture")
    if not isinstance(capture, Mapping) or not isinstance(capture.get("enabled"), bool):
        raise BridgeProtocolError("status capture state must be an object with enabled boolean")
    for component in ("trace", "controllerInput"):
        value = capture.get(component)
        if not isinstance(value, Mapping) or not isinstance(value.get("enabled"), bool):
            raise BridgeProtocolError(f"status capture.{component} state is incomplete")
    next_sequence = status.get("nextEventSequence")
    if isinstance(next_sequence, bool) or not isinstance(next_sequence, int) or next_sequence < 1:
        raise BridgeProtocolError("status nextEventSequence must be a positive integer")

    core = health.get("core")
    if not isinstance(core, str) or not core:
        raise BridgeProtocolError("health response omitted CPU core")

    port = status.get("port")
    if not isinstance(port, int) or isinstance(port, bool):
        raise BridgeProtocolError("status response omitted numeric bridge port")

    rom = health.get("rom")
    if rom is not None and not isinstance(rom, Mapping):
        raise BridgeProtocolError("health ROM identity must be an object or null")

    return BridgeHandshake(
        version=BRIDGE_PROTOCOL_VERSION,
        port=port,
        core=core,
        rom=rom,
        bridge_epoch=bridge_epoch,
    )
