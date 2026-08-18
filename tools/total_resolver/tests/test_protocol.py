from __future__ import annotations

import unittest

from tools.total_resolver.protocol import (
    BRIDGE_CAPABILITIES,
    BRIDGE_PROTOCOL_VERSION,
    BridgeProtocolError,
    validate_handshake,
)


def good_responses() -> tuple[dict, dict, dict]:
    shared = {
        "version": BRIDGE_PROTOCOL_VERSION,
        "bridgeEpoch": "EPOCH-1",
        "queueModel": "unified",
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
        self.assertEqual(handshake.version, "0.7.2")
        self.assertEqual(handshake.bridge_epoch, "EPOCH-1")
        self.assertEqual(handshake.core, "interpreter")
        self.assertEqual(handshake.capabilities, BRIDGE_CAPABILITIES)

    def test_version_mismatch_fails_closed(self) -> None:
        ping, status, health = good_responses()
        health["version"] = "0.7.1"
        with self.assertRaisesRegex(BridgeProtocolError, "required exactly 0.7.2"):
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
