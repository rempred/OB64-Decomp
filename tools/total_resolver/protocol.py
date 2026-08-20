"""Fail-closed contract for the accepted OB64 Project64 bridge."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping

from .addressing import RDRAM_SIZE


BRIDGE_PROTOCOL_VERSION = "0.13.0"
FRONTIER_FORMAT_VERSION = 4

BRIDGE_CAPABILITIES = (
    "capability-advertisement",
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
    "native-persistent-novelty-frontier-v4",
    "stable-frontier-fact-ordinals",
    "stop-time-known-activity-bitmaps",
    "native-exact-dma-novelty-filter",
    "exact-physical-opcode-instruction-identity",
    "page-local-address-bitmaps",
    "sparse-exact-opcode-edge-frontier",
    "known-prefix-predecessor-tracking",
    "generation-context-on-novel-facts",
    "atomic-4mib-rdram-baseline",
    "vanilla-ob64-lower-4mib-capture-window",
    "pre-rom-armed-cold-boot-capture",
    "observation-only-capture-contract",
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
    frontier_format_version: int = FRONTIER_FORMAT_VERSION
    queue_model: str = "unified"
    capabilities: tuple[str, ...] = BRIDGE_CAPABILITIES

    def to_dict(self) -> dict[str, Any]:
        return {
            "version": self.version,
            "port": self.port,
            "core": self.core,
            "rom": dict(self.rom) if self.rom is not None else None,
            "bridgeEpoch": self.bridge_epoch,
            "frontierFormatVersion": self.frontier_format_version,
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
    *,
    allow_unloaded: bool = False,
) -> BridgeHandshake:
    """Validate bridge identity, optionally before any ROM or RDRAM exists."""

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
        "frontier",
        "coldBoot",
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
    for command, response in (("ping", ping), ("status", status), ("health", health)):
        advertised = response.get("capabilities")
        if not isinstance(advertised, list) or tuple(advertised) != BRIDGE_CAPABILITIES:
            raise BridgeProtocolError(
                f"bridge {BRIDGE_PROTOCOL_VERSION} {command} capability advertisement "
                "is missing or incompatible"
            )
    frontier_versions = {
        response.get("frontierFormatVersion") for response in (ping, status, health)
    }
    if frontier_versions != {FRONTIER_FORMAT_VERSION}:
        raise BridgeProtocolError(
            f"bridge requires novelty frontier format {FRONTIER_FORMAT_VERSION} exactly"
        )
    rom = health.get("rom")
    if rom is not None and not isinstance(rom, Mapping):
        raise BridgeProtocolError("health ROM identity must be an object or null")
    rdram_sizes = {response.get("rdramSize") for response in (ping, status, health)}
    permitted_rdram_sizes = {RDRAM_SIZE, 0x00800000}
    if allow_unloaded and rom is None:
        permitted_rdram_sizes.add(0)
    if len(rdram_sizes) != 1 or next(iter(rdram_sizes)) not in permitted_rdram_sizes:
        raise BridgeProtocolError(
            "Total Resolver requires a Project64 4 or 8 MiB RDRAM allocation"
        )
    capture_sizes = {
        response.get("captureRdramSize") for response in (ping, status, health)
    }
    if capture_sizes != {RDRAM_SIZE}:
        raise BridgeProtocolError(
            "Total Resolver requires an exact lower-4-MiB capture window"
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
    frontier = status.get("frontier")
    if not isinstance(frontier, Mapping):
        raise BridgeProtocolError("status novelty frontier state must be an object")
    if frontier.get("formatVersion") != FRONTIER_FORMAT_VERSION:
        raise BridgeProtocolError("status novelty frontier format is incompatible")
    if not isinstance(frontier.get("committed"), bool):
        raise BridgeProtocolError("status novelty frontier committed state is missing")
    cold_boot = status.get("coldBoot")
    if not isinstance(cold_boot, Mapping) or cold_boot.get("state") not in {
        "idle",
        "armed",
        "capturing",
        "failed",
        "cancelled",
    }:
        raise BridgeProtocolError("status cold-boot arm state is missing or incompatible")
    next_sequence = status.get("nextEventSequence")
    if isinstance(next_sequence, bool) or not isinstance(next_sequence, int) or next_sequence < 1:
        raise BridgeProtocolError("status nextEventSequence must be a positive integer")

    core = health.get("core")
    if not isinstance(core, str) or not core:
        raise BridgeProtocolError("health response omitted CPU core")

    port = status.get("port")
    if not isinstance(port, int) or isinstance(port, bool):
        raise BridgeProtocolError("status response omitted numeric bridge port")

    return BridgeHandshake(
        version=BRIDGE_PROTOCOL_VERSION,
        port=port,
        core=core,
        rom=rom,
        bridge_epoch=bridge_epoch,
    )
