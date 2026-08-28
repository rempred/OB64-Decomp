from __future__ import annotations

import hashlib
import unittest

from tools.total_resolver.bridge_events import (
    _validate_trace_or_input_event,
    parse_drain_response,
)
from tools.total_resolver.protocol import BridgeProtocolError, FRONTIER_FORMAT_VERSION


class BridgeEventTests(unittest.TestCase):
    FRONTIER = "K2:TEST:1:1:1:0"

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

    def test_drain_sample_context_is_validated_and_preserved(self) -> None:
        batch = parse_drain_response(
            self.envelope(
                [],
                sampleContext={
                    "frameCount": 123,
                    "debugPaused": False,
                    "emuState": {"systemPaused": False},
                    "execution": {"state": "running-or-system-paused"},
                    "pc": "0x80001234",
                },
            )
        )
        self.assertIsNotNone(batch.sample_context)
        assert batch.sample_context is not None
        self.assertEqual(batch.sample_context.frame_number, 123)
        self.assertEqual(batch.sample_context.pc, "0x80001234")
        with self.assertRaisesRegex(BridgeProtocolError, "systemPaused"):
            parse_drain_response(
                self.envelope(
                    [],
                    sampleContext={
                        "frameCount": 123,
                        "debugPaused": False,
                        "emuState": {},
                        "execution": {"state": "running"},
                        "pc": "0x80001234",
                    },
                )
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

    def test_focused_state_event_requires_exact_trigger_and_pointer_evidence(self) -> None:
        low_names = (
            "pc", "ra", "sp", "gp", "a0", "a1", "a2", "a3", "v0", "v1",
            "t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9",
            "s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8",
        )
        upper_names = (
            "zero", "at", "v0", "v1", "a0", "a1", "a2", "a3",
            "t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7",
            "s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7",
            "t8", "t9", "k0", "k1", "gp", "sp", "s8", "ra",
        )
        registers = {
            **{name: "0x00000000" for name in low_names},
            "a0": "0x80002000",
            "sp": "0x80003000",
            "ra": "0x80001100",
            "gprUpper": {name: "0x00000000" for name in upper_names},
            "special": {
                name: "0x00000000" for name in ("hi", "uhi", "lo", "ulo", "fcr31")
            },
            "cop0": {
                name: "0x00000000"
                for name in ("badvaddr", "epc", "errorepc", "status", "cause", "context")
            },
            "fprSingle": [0.0] * 32,
            "fprDouble": [0.0] * 32,
            "floatingPointClaim": "numeric-context-not-raw-nan-payload-bits",
        }
        event = {
            "kind": "focused-exec",
            "bridgeEpoch": "EPOCH-1",
            "bridgeSequence": 1,
            "bridgeStream": "watch",
            "frameCount": 90,
            "pc": "0x80001000",
            "opcode": "0x0C000050",
            "physicalAddress": "0x00001000",
            "exactInstructionResolved": True,
            "focusedProfileId": "cutscene-studio-v1",
            "focusedProfileVersion": 1,
            "focusedTargetId": "stage-builder",
            "focusedFunctionId": 1,
            "focusedZ64Start": "0x00000100",
            "focusedRole": "entry",
            "focusedInvocationId": "cutscene-studio-v1:stage-builder:1",
            "sampleMode": "all",
            "targetLiveStart": "0x80001000",
            "targetLiveEndExclusive": "0x80001040",
            "targetPhysicalStart": "0x00001000",
            "targetSignatureVerified": True,
            "targetSignatureBytesEncoding": "hex-uppercase",
            "targetSignatureByteLength": 4,
            "targetSignatureBytesHex": "0C000050",
            "entryReturnAddress": "0x80001100",
            "capturePhase": "focused-function-entry",
            "orderingClaim": "bridge-sequence-orders-focused-events;-frame-is-context",
            "returnPhaseLimitation": None,
            "regs": registers,
            "stack": {"base": "0x80003000", "words": []},
            "pointerSnapshots": [
                {
                    "register": "a0",
                    "label": "arg0-stage",
                    "phase": "entry",
                    "address": "0x80002000",
                    "physicalAddress": "0x00002000",
                    "byteLength": 4,
                    "bytesEncoding": "hex-uppercase",
                    "bytesHex": "01020304",
                    "capturePhase": "synchronous-focused-callback",
                }
            ],
            "pointerSnapshotIssues": [],
        }
        parsed = parse_drain_response(self.envelope([event], nextEventSequence=2))
        self.assertEqual(parsed.events[0].event_type, "focused-exec")

        wrong_signature = dict(event, targetSignatureBytesHex="0C000051")
        with self.assertRaisesRegex(BridgeProtocolError, "entry contradicts"):
            parse_drain_response(self.envelope([wrong_signature], nextEventSequence=2))

        wrong_segment = dict(event)
        wrong_segment["pointerSnapshots"] = [
            dict(event["pointerSnapshots"][0], address="0x00002000")
        ]
        with self.assertRaisesRegex(BridgeProtocolError, "pointer snapshot is malformed"):
            parse_drain_response(self.envelope([wrong_segment], nextEventSequence=2))

    def test_structural_coverage_and_input_share_one_exact_order(self) -> None:
        batch = parse_drain_response(
            self.envelope(
                [
                    {
                        "kind": "exec-coverage",
                        "bridgeEpoch": "EPOCH-1",
                        "bridgeSequence": 1,
                        "bridgeStream": "trace",
                        "pc": "0x80001000",
                        "opcode": "0xAAABACAD",
                        "physicalPageAddress": "0x00001000",
                        "physicalAddress": "0x00001000",
                        "pageOffset": 0,
                        "pageGeneration": 1,
                        "generationResolved": True,
                        "exactInstructionResolved": True,
                        "newInstruction": True,
                        "newEdge": False,
                        "newCall": False,
                        "frontierFormatVersion": FRONTIER_FORMAT_VERSION,
                        "frontierIdentity": self.FRONTIER,
                        "noveltyDecision": "new-instruction",
                        "capturePhase": "pre-execution-callback",
                        "dedupeDecision": "physical-address-and-exact-opcode",
                    },
                    {
                        "kind": "controller-input",
                        "bridgeEpoch": "EPOCH-1",
                        "bridgeSequence": 2,
                        "bridgeStream": "input",
                        "controller": 0,
                        "state": "0x80000000",
                        "capturePhase": "post-controller-read-and-bridge-injection",
                    },
                ],
                nextEventSequence=3,
            )
        )
        self.assertEqual([item.bridge_stream for item in batch.events], ["trace", "input"])
        self.assertIsNone(batch.events[0].event_time_content_field)

        broken = dict(batch.events[0].payload)
        broken["dedupeDecision"] = "hash-only"
        with self.assertRaisesRegex(BridgeProtocolError, "exact dedupe"):
            parse_drain_response(self.envelope([broken], nextEventSequence=2))

    def test_atomic_call_context_is_exact_and_opcode_consistent(self) -> None:
        callsite = {
            "pc": "0x80001000",
            "opcode": "0x0C000400",
            "physicalPageAddress": "0x00001000",
            "physicalAddress": "0x00001000",
            "pageOffset": 0,
            "pageGeneration": 2,
            "generationResolved": True,
            "exactInstructionResolved": True,
        }
        delay = {
            "pc": "0x80001004",
            "opcode": "0x00000000",
            "physicalPageAddress": "0x00001000",
            "physicalAddress": "0x00001004",
            "pageOffset": 4,
            "pageGeneration": 2,
            "generationResolved": True,
            "exactInstructionResolved": True,
        }
        target = dict(callsite)
        event = {
            "kind": "exec-coverage",
            "bridgeEpoch": "EPOCH-1",
            "bridgeSequence": 1,
            "bridgeStream": "trace",
            "pc": target["pc"],
            "opcode": target["opcode"],
            "physicalPageAddress": target["physicalPageAddress"],
            "physicalAddress": target["physicalAddress"],
            "pageOffset": target["pageOffset"],
            "pageGeneration": target["pageGeneration"],
            "generationResolved": True,
            "exactInstructionResolved": True,
            "newInstruction": False,
            "newEdge": False,
            "newCall": True,
            "previous": delay,
            "call": {
                "callKind": "jal-direct",
                "exactRelationshipResolved": True,
                "callsite": callsite,
                "delaySlot": delay,
                "target": target,
            },
            "frontierFormatVersion": FRONTIER_FORMAT_VERSION,
            "frontierIdentity": self.FRONTIER,
            "noveltyDecision": "new-call-relationship",
            "capturePhase": "pre-execution-callback",
            "dedupeDecision": "physical-address-and-exact-opcode",
        }
        parsed = parse_drain_response(self.envelope([event], nextEventSequence=2))
        self.assertTrue(parsed.events[0].payload["newCall"])

        contradictory = dict(event)
        contradictory_call = dict(event["call"])
        contradictory_target = dict(target)
        contradictory_target["pc"] = "0x80002000"
        contradictory_call["target"] = contradictory_target
        contradictory["call"] = contradictory_call
        with self.assertRaisesRegex(BridgeProtocolError, "JAL call target"):
            parse_drain_response(self.envelope([contradictory], nextEventSequence=2))

    def test_activity_and_marker_context_are_bounded_context_not_stream_order(self) -> None:
        activity = {
            "kind": "known-activity",
            "bridgeEpoch": "EPOCH-1",
            "bridgeSequence": 1,
            "bridgeStream": "trace",
            "frontierFormatVersion": FRONTIER_FORMAT_VERSION,
            "frontierIdentity": self.FRONTIER,
            "instructionMaxOrdinal": 2,
            "instructionHitCount": 2,
            "instructionHitBitmapEncoding": "ordinal-minus-one-lsb0-hex-uppercase",
            "instructionHitBitmapHex": "03",
            "edgeMaxOrdinal": 1,
            "edgeHitCount": 1,
            "edgeHitBitmapEncoding": "ordinal-minus-one-lsb0-hex-uppercase",
            "edgeHitBitmapHex": "01",
            "callMaxOrdinal": 0,
            "callHitCount": 0,
            "callHitBitmapEncoding": "ordinal-minus-one-lsb0-hex-uppercase",
            "callHitBitmapHex": "",
            "dmaMaxOrdinal": 0,
            "dmaHitCount": 0,
            "dmaHitBitmapEncoding": "ordinal-minus-one-lsb0-hex-uppercase",
            "dmaHitBitmapHex": "",
            "capturePhase": "session-stop-native-hit-bitmap",
            "orderingClaim": "session-membership-only-not-event-order",
        }
        marker = {
            "kind": "marker-execution-context",
            "bridgeEpoch": "EPOCH-1",
            "bridgeSequence": 2,
            "bridgeStream": "trace",
            "markerSessionId": "SESSION-1",
            "markerId": 7,
            "beforeCount": 1,
            "afterCount": 1,
            "requestedBeforeCount": 1,
            "requestedAfterCount": 1,
            "capturePhase": "native-bounded-marker-window",
            "orderingClaim": "native-local-order-and-frame-context-only",
            "records": [
                {
                    "localOrder": 10,
                    "frame": 100,
                    "pc": "0x80001000",
                    "opcode": "0x24020001",
                    "physicalAddress": "0x00001000",
                    "previousValid": False,
                    "previousPc": "0x00000000",
                    "previousOpcode": "0x00000000",
                    "previousPhysicalAddress": None,
                    "side": "before",
                },
                {
                    "localOrder": 11,
                    "frame": 101,
                    "pc": "0x80001004",
                    "opcode": "0x24420001",
                    "physicalAddress": "0x00001004",
                    "previousValid": True,
                    "previousPc": "0x80001000",
                    "previousOpcode": "0x24020001",
                    "previousPhysicalAddress": "0x00001000",
                    "side": "after",
                },
            ],
        }
        batch = parse_drain_response(
            self.envelope([activity, marker], nextEventSequence=3)
        )
        self.assertEqual(
            [event.event_type for event in batch.events],
            ["known-activity", "marker-execution-context"],
        )
        broken = dict(activity)
        broken["instructionHitCount"] = 1
        with self.assertRaisesRegex(BridgeProtocolError, "hit count"):
            parse_drain_response(self.envelope([broken], nextEventSequence=2))

        historical = dict(activity)
        historical["frontierFormatVersion"] = 5
        _validate_trace_or_input_event(historical, "known-activity", 5)
        with self.assertRaisesRegex(BridgeProtocolError, "incompatible"):
            _validate_trace_or_input_event(historical, "known-activity")


if __name__ == "__main__":
    unittest.main()
