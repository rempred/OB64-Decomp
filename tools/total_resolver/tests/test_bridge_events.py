from __future__ import annotations

import hashlib
import unittest

from tools.total_resolver.bridge_events import parse_drain_response
from tools.total_resolver.protocol import BridgeProtocolError


class BridgeEventTests(unittest.TestCase):
    @staticmethod
    def envelope(events: list, **updates: object) -> dict:
        value = {
            "queueModel": "unified",
            "bridgeEpoch": "EPOCH-1",
            "nextEventSequence": 3,
            "count": len(events),
            "remaining": 0,
            "dropped": 0,
            "droppedRanges": [],
            "events": events,
        }
        value.update(updates)
        return value

    def test_global_order_unknown_fields_and_dma_bytes_are_preserved(self) -> None:
        content = bytes.fromhex("00112233")
        batch = parse_drain_response(
            self.envelope(
                [
                    {
                        "kind": "exec",
                        "frameCount": 9,
                        "futureField": {"x": 1},
                        "bridgeEpoch": "EPOCH-1",
                        "bridgeSequence": 1,
                        "bridgeStream": "watch",
                    },
                    {
                        "kind": "dma-start",
                        "sourceDomain": "cartridge-rom",
                        "frameCount": 9,
                        "bridgeEpoch": "EPOCH-1",
                        "bridgeSequence": 2,
                        "bridgeStream": "dma",
                        "capturePhase": "pre-transfer-callback",
                        "phys": "0x00001000",
                        "romoff": "0x00002000",
                        "requestedLength": 4,
                    },
                    {
                        "kind": "dma-complete",
                        "sourceDomain": "cartridge-rom",
                        "frameCount": 9,
                        "bridgeEpoch": "EPOCH-1",
                        "bridgeSequence": 3,
                        "bridgeStream": "dma",
                        "capturePhase": "post-transfer-callback",
                        "phys": "0x00001000",
                        "romoff": "0x00002000",
                        "requestedLength": 4,
                        "transferSpanLength": 4,
                        "dmaStartSequence": 2,
                        "pairingStatus": "matched",
                        "destinationByteLength": 4,
                        "destinationBytesEncoding": "hex-uppercase",
                        "destinationBytesHex": content.hex().upper(),
                    },
                ],
                nextEventSequence=4,
            )
        )
        self.assertEqual([event.bridge_sequence for event in batch.events], [1, 2, 3])
        self.assertEqual(batch.events[0].payload["futureField"], {"x": 1})
        self.assertEqual(
            batch.events[2].event_time_content_sha256,
            hashlib.sha256(content).hexdigest().upper(),
        )

    def test_envelope_order_count_and_counters_fail_closed(self) -> None:
        with self.assertRaisesRegex(BridgeProtocolError, "does not match"):
            parse_drain_response(
                self.envelope([], count=2),
            )
        with self.assertRaisesRegex(BridgeProtocolError, "nonnegative integer"):
            parse_drain_response(
                self.envelope([], remaining=-1),
            )
        with self.assertRaisesRegex(BridgeProtocolError, "disagrees"):
            parse_drain_response(
                self.envelope(
                    [],
                    dropped=2,
                    droppedRanges=[{"firstSequence": 1, "lastSequence": 1, "count": 1}],
                )
            )
        with self.assertRaisesRegex(BridgeProtocolError, "strictly ordered"):
            parse_drain_response(
                self.envelope(
                    [
                        {
                            "kind": "exec",
                            "bridgeEpoch": "EPOCH-1",
                            "bridgeSequence": 2,
                            "bridgeStream": "watch",
                        },
                        {
                            "kind": "write",
                            "bridgeEpoch": "EPOCH-1",
                            "bridgeSequence": 1,
                            "bridgeStream": "watch",
                        },
                    ],
                    nextEventSequence=3,
                )
            )
        event = {
            "kind": "exec",
            "bridgeEpoch": "EPOCH-1",
            "bridgeSequence": 1,
            "bridgeStream": "watch",
        }
        with self.assertRaisesRegex(BridgeProtocolError, "both drained and reported dropped"):
            parse_drain_response(
                self.envelope(
                    [event],
                    nextEventSequence=2,
                    dropped=1,
                    droppedRanges=[{"firstSequence": 1, "lastSequence": 1, "count": 1}],
                )
            )
        with self.assertRaisesRegex(BridgeProtocolError, "below nextEventSequence"):
            parse_drain_response(
                self.envelope(
                    [],
                    nextEventSequence=2,
                    dropped=1,
                    droppedRanges=[{"firstSequence": 2, "lastSequence": 2, "count": 1}],
                )
            )

    def test_dma_without_event_time_bytes_fails_closed(self) -> None:
        with self.assertRaisesRegex(BridgeProtocolError, "byte-capture provenance"):
            parse_drain_response(
                self.envelope(
                    [
                        {
                            "kind": "dma-start",
                            "sourceDomain": "cartridge-rom",
                            "bridgeEpoch": "EPOCH-1",
                            "bridgeSequence": 1,
                            "bridgeStream": "dma",
                            "capturePhase": "pre-transfer-callback",
                            "requestedLength": 2,
                        },
                        {
                            "kind": "dma-complete",
                            "sourceDomain": "cartridge-rom",
                            "bridgeEpoch": "EPOCH-1",
                            "bridgeSequence": 2,
                            "bridgeStream": "dma",
                            "requestedLength": 2,
                            "transferSpanLength": 2,
                            "dmaStartSequence": 1,
                            "pairingStatus": "matched",
                        }
                    ],
                    nextEventSequence=3,
                )
            )


if __name__ == "__main__":
    unittest.main()
