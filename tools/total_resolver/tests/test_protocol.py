from __future__ import annotations

import unittest

from tools.total_resolver.protocol import (
    BRIDGE_CAPABILITIES,
    BRIDGE_PROTOCOL_VERSION,
    FRONTIER_FORMAT_VERSION,
    BridgeProtocolError,
    validate_handshake,
)
from tools.total_resolver.addressing import RDRAM_SIZE


def good_responses() -> tuple[dict, dict, dict]:
    shared = {
        "version": BRIDGE_PROTOCOL_VERSION,
        "bridgeEpoch": "EPOCH-1",
        "queueModel": "unified",
        "frontierFormatVersion": FRONTIER_FORMAT_VERSION,
        "capabilities": list(BRIDGE_CAPABILITIES),
        "rdramSize": RDRAM_SIZE,
        "captureRdramSize": RDRAM_SIZE,
    }
    ping = {"ok": True, "pong": True, **shared}
    status = {
        "ok": True,
        **shared,
        "port": 64640,
        "queued": 0,
        "dropped": 0,
        "droppedRanges": [],
        "nextEventSequence": 1,
        "watches": [],
        "dma": {},
        "capture": {
            "enabled": False,
            "trace": {"enabled": False},
            "controllerInput": {"enabled": False},
        },
        "frontier": {
            "formatVersion": FRONTIER_FORMAT_VERSION,
            "committed": False,
        },
        "coldBoot": {"state": "idle"},
        "emuState": {},
    }
    health = {
        "ok": True,
        **shared,
        "core": "interpreter",
        "rom": {"crc1": "0x12345678", "crc2": "0x9ABCDEF0"},
    }
    return ping, status, health


class ProtocolTests(unittest.TestCase):
    def test_exact_bridge_contract_is_accepted(self) -> None:
        handshake = validate_handshake(*good_responses())
        self.assertEqual(handshake.version, BRIDGE_PROTOCOL_VERSION)
        self.assertEqual(handshake.bridge_epoch, "EPOCH-1")
        self.assertEqual(handshake.core, "interpreter")
        self.assertEqual(handshake.capabilities, BRIDGE_CAPABILITIES)

    def test_version_mismatch_fails_closed(self) -> None:
        ping, status, health = good_responses()
        ping["version"] = "0.15.0"
        status["version"] = "0.15.0"
        health["version"] = "0.15.0"
        with self.assertRaisesRegex(BridgeProtocolError, f"required exactly {BRIDGE_PROTOCOL_VERSION}"):
            validate_handshake(ping, status, health)

    def test_frontier_and_capability_mismatch_fail_closed(self) -> None:
        ping, status, health = good_responses()
        ping["frontierFormatVersion"] = 99
        with self.assertRaisesRegex(BridgeProtocolError, "frontier format"):
            validate_handshake(ping, status, health)
        ping, status, health = good_responses()
        health["capabilities"] = list(BRIDGE_CAPABILITIES[:-1])
        with self.assertRaisesRegex(BridgeProtocolError, "capability advertisement"):
            validate_handshake(ping, status, health)

    def test_8mib_allocation_uses_lower_4mib_capture_window(self) -> None:
        ping, status, health = good_responses()
        for response in (ping, status, health):
            response["rdramSize"] = 0x00800000
        validate_handshake(ping, status, health)

    def test_powered_off_handshake_requires_explicit_unloaded_mode(self) -> None:
        ping, status, health = good_responses()
        for response in (ping, status, health):
            response["rdramSize"] = 0
        health["rom"] = None
        with self.assertRaisesRegex(BridgeProtocolError, "4 or 8 MiB"):
            validate_handshake(ping, status, health)
        handshake = validate_handshake(ping, status, health, allow_unloaded=True)
        self.assertIsNone(handshake.rom)

    def test_inconsistent_or_wrong_capture_window_fails_closed(self) -> None:
        ping, status, health = good_responses()
        health["rdramSize"] = 0x00200000
        with self.assertRaisesRegex(BridgeProtocolError, "4 or 8 MiB"):
            validate_handshake(ping, status, health)
        ping, status, health = good_responses()
        health["captureRdramSize"] = 0x00800000
        with self.assertRaisesRegex(BridgeProtocolError, "capture window"):
            validate_handshake(ping, status, health)

    def test_missing_observation_fields_fail_closed(self) -> None:
        ping, status, health = good_responses()
        del status["dma"]
        with self.assertRaisesRegex(BridgeProtocolError, "dma"):
            validate_handshake(ping, status, health)

    def test_epoch_and_queue_model_mismatch_fail_closed(self) -> None:
        ping, status, health = good_responses()
        health["bridgeEpoch"] = "RELOADED"
        with self.assertRaisesRegex(BridgeProtocolError, "epochs"):
            validate_handshake(ping, status, health)
        ping, status, health = good_responses()
        status["queueModel"] = "split"
        with self.assertRaisesRegex(BridgeProtocolError, "unified"):
            validate_handshake(ping, status, health)


if __name__ == "__main__":
    unittest.main()
