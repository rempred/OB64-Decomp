from __future__ import annotations

from collections.abc import Mapping
from pathlib import Path
import struct
import unittest
from typing import Any

from tools.total_resolver.pj64_client import Pj64Client, Pj64Error
from tools.total_resolver.knowledge import (
    FrontierDma,
    FrontierEdge,
    FrontierInstruction,
    FrontierPage,
    NoveltyFrontier,
    empty_novelty_frontier,
)
from tools.total_resolver.addressing import RDRAM_SIZE
from tools.total_resolver.protocol import (
    BRIDGE_CAPABILITIES,
    BRIDGE_PROTOCOL_VERSION,
    FRONTIER_FORMAT_VERSION,
    BridgeProtocolError,
)


class ScriptedTransport:
    def __init__(
        self, *, version: str = BRIDGE_PROTOCOL_VERSION, powered_off: bool = False
    ) -> None:
        self.version = version
        self.connected = False
        self.closed = False
        self.lines: list[str] = []
        self.epoch = "EPOCH-TEST"
        self.powered_off = powered_off
        self.cold_state = "idle"
        self.frontier = {
            "formatVersion": FRONTIER_FORMAT_VERSION,
            "loading": False,
            "committed": False,
            "frontierIdentity": None,
            "romNormalizedSha256": None,
            "physicalPageCount": 0,
            "instructionCount": 0,
            "edgeCount": 0,
            "dmaCount": 0,
            "nativeLoaded": False,
            "nativeRdramSize": None,
        }

    def connect(self) -> None:
        self.connected = True

    def close(self) -> None:
        self.closed = True

    def request(self, line: str) -> Mapping[str, Any]:
        self.lines.append(line)
        if line == "ping":
            return {
                "ok": True,
                "pong": True,
                "version": self.version,
                "bridgeEpoch": self.epoch,
                "queueModel": "unified",
                "frontierFormatVersion": FRONTIER_FORMAT_VERSION,
                "capabilities": list(BRIDGE_CAPABILITIES),
                "rdramSize": 0 if self.powered_off else RDRAM_SIZE,
                "captureRdramSize": RDRAM_SIZE,
            }
        if line == "status":
            return {
                "ok": True,
                "version": self.version,
                "port": 64640,
                "bridgeEpoch": self.epoch,
                "queueModel": "unified",
                "frontierFormatVersion": FRONTIER_FORMAT_VERSION,
                "capabilities": list(BRIDGE_CAPABILITIES),
                "rdramSize": 0 if self.powered_off else RDRAM_SIZE,
                "captureRdramSize": RDRAM_SIZE,
                "nextEventSequence": 1,
                "queued": 0,
                "dropped": 0,
                "droppedRanges": [],
                "watches": [],
                "dma": {},
                "capture": {
                    "enabled": False,
                    "trace": {"enabled": False},
                    "controllerInput": {"enabled": False},
                },
                "frontier": dict(self.frontier),
                "coldBoot": {"state": self.cold_state},
                "emuState": {},
            }
        if line == "health":
            return {
                "ok": True,
                "version": self.version,
                "bridgeEpoch": self.epoch,
                "queueModel": "unified",
                "frontierFormatVersion": FRONTIER_FORMAT_VERSION,
                "capabilities": list(BRIDGE_CAPABILITIES),
                "rdramSize": 0 if self.powered_off else RDRAM_SIZE,
                "captureRdramSize": RDRAM_SIZE,
                "nextEventSequence": 1,
                "core": "interpreter",
                "rom": None,
            }
        if line.startswith("frontier load "):
            _, _, identity, rom, encoded_path = line.split()
            path = Path(bytes.fromhex(encoded_path).decode("utf-16le"))
            data = path.read_bytes()
            if data[:8] != b"OB64TRF3":
                return {"ok": False, "error": "bad frontier magic"}
            _, _, identity_length, rom_length, instruction_count, edge_count, dma_count = (
                struct.unpack_from("<IIIIQQQ", data, 8)
            )
            self.frontier.update(
                loading=False,
                committed=True,
                frontierIdentity=identity,
                romNormalizedSha256=rom,
                physicalPageCount=0 if instruction_count == 0 else 1,
                instructionCount=instruction_count,
                edgeCount=edge_count,
                dmaCount=dma_count,
                nativeLoaded=True,
                nativeRdramSize=RDRAM_SIZE,
            )
            return {"ok": True, "frontier": dict(self.frontier)}
        if line == "frontier status":
            return {"ok": True, "frontier": dict(self.frontier)}
        if line.startswith("coldboot arm "):
            self.cold_state = "armed"
            return {
                "ok": True,
                "coldBoot": {"state": "armed", "armedAtNextSequence": 1},
            }
        if line == "coldboot status":
            return {"ok": True, "coldBoot": {"state": self.cold_state}}
        if line == "coldboot cancel":
            self.cold_state = "cancelled"
            return {"ok": True, "coldBoot": {"state": "cancelled"}}
        if line.startswith("peekmany "):
            pair_count = (len(line.split()) - 1) // 2
            return {"ok": True, "values": [{"decimal": index} for index in range(pair_count)]}
        if line.startswith("hashmem "):
            parts = line.split()[1:]
            return {
                "ok": True,
                "bridgeEpoch": self.epoch,
                "nextEventSequence": 1,
                "frameCount": 123,
                "ranges": [
                    {
                        "address": f"0x{int(parts[index], 0):08X}",
                        "size": int(parts[index + 1], 0),
                        "hashAlgorithm": "fnv1a32",
                        "hash": "0x12345678",
                    }
                    for index in range(0, len(parts), 2)
                ],
            }
        if line.startswith("readblock "):
            _, address, size = line.split()
            count = int(size, 0)
            return {
                "ok": True,
                "bridgeEpoch": self.epoch,
                "nextEventSequence": 1,
                "frameCount": 123,
                "address": f"0x{int(address, 0):08X}",
                "size": count,
                "hashAlgorithm": "fnv1a32",
                "hash": "0x12345678",
                "bytesEncoding": "hex-uppercase",
                "bytesHex": bytes(range(count)).hex().upper(),
            }
        if line.startswith("watch "):
            return {"ok": True, "watch": {"id": 7}}
        if line == "framecount":
            return {"ok": True, "frameCount": 123}
        if line == "execution":
            return {"ok": True, "execution": {"state": "running-or-system-paused"}}
        if line == "exception":
            return {"ok": True, "exception": {"exceptionCode": None}}
        if line == "emustate":
            return {"ok": True, "emuState": {"sequence": 1}}
        if line == "regs":
            return {"ok": True, "regs": {"pc": "0x80000000"}}
        return {"ok": True}


class ClientTests(unittest.TestCase):
    def test_powered_off_client_requires_explicit_mode_and_can_arm(self) -> None:
        transport = ScriptedTransport(powered_off=True)
        with self.assertRaisesRegex(BridgeProtocolError, "4 or 8 MiB"):
            Pj64Client(transport=transport).connect()
        transport = ScriptedTransport(powered_off=True)
        client = Pj64Client(transport=transport, allow_unloaded=True)
        client.connect()
        armed = client.cold_boot_arm("K2:TEST", "12345678", "9ABCDEF0")
        self.assertEqual(armed["coldBoot"]["state"], "armed")
        self.assertEqual(client.cold_boot_status()["state"], "armed")
        client.cold_boot_cancel()

    def test_connect_performs_three_way_protocol_handshake(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)
        client.connect()
        self.assertEqual(transport.lines, ["ping", "status", "health"])
        self.assertEqual(client.handshake_result.version, BRIDGE_PROTOCOL_VERSION)

    def test_incompatible_bridge_closes_transport(self) -> None:
        transport = ScriptedTransport(version="0.6.7")
        client = Pj64Client(transport=transport)
        with self.assertRaises(BridgeProtocolError):
            client.connect()
        self.assertTrue(transport.closed)

    def test_direct_operation_cannot_bypass_handshake(self) -> None:
        transport = ScriptedTransport(version="0.6.7")
        client = Pj64Client(transport=transport)
        with self.assertRaises(BridgeProtocolError):
            client.frame_count()
        self.assertEqual(transport.lines, ["ping", "status", "health"])

    def test_observation_surface_uses_accepted_commands(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)

        self.assertEqual(client.read_many((("u8", 0x80000000), ("u32", 0x80000004))), [0, 1])
        self.assertEqual(client.read_bytes(0x80000000, 3), b"\x00\x01\x02")
        fingerprints = client.memory_fingerprints(((0x80190000, 0x1000), (0x801A0000, 0x2000)))
        self.assertEqual([item.size for item in fingerprints.ranges], [0x1000, 0x2000])
        block = client.read_block(0x80000000, 3)
        self.assertEqual(block.data, b"\x00\x01\x02")
        self.assertEqual(block.frame_count, 123)
        self.assertEqual(client.watch_exec(0x80100000, size=4, label="loader entry"), {"id": 7})
        client.drain_events(32)
        frontier = empty_novelty_frontier("A" * 64)
        loaded = client.load_novelty_frontier(frontier)
        self.assertEqual(loaded["frontierIdentity"], frontier.identity)
        client.capture_start(frontier.identity)
        client.capture_status()
        client.capture_stop()
        client.dma_start(0x1000, 0x2000, maximum=64, context_words=8)
        client.dma_set_rom_range(0x3000, 0x4000)
        client.dma_status()
        with self.assertRaisesRegex(BridgeProtocolError, "unified ordered queue"):
            client.dma_drain(16)
        client.dma_stop()
        client.execution()
        client.exception()
        client.emulator_state()
        client.registers()
        self.assertEqual(client.frame_count(), 123)

        self.assertIn("peekmany u8 0x80000000 u32 0x80000004", transport.lines)
        self.assertIn("hashmem 0x80190000 0x1000 0x801A0000 0x2000", transport.lines)
        self.assertIn("readblock 0x80000000 0x3", transport.lines)
        self.assertIn("watch exec 0x80100000 4 loader_entry", transport.lines)
        self.assertIn("drain 32", transport.lines)
        self.assertIn(f"capture on {frontier.identity}", transport.lines)
        self.assertIn("capture status", transport.lines)
        self.assertIn("capture off", transport.lines)
        self.assertIn("dma on 0x1000 0x2000 64 0x0 8", transport.lines)
        self.assertIn("dma cart 0x3000 0x4000", transport.lines)

    def test_structural_frontier_transport_has_no_page_bytes(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)
        bitmap = bytearray(128)
        bitmap[0] = 0b00000011
        frontier = NoveltyFrontier(
            "K2:TEST:1:1:2:1",
            "A" * 64,
            1,
            (FrontierPage(0x1000, bytes(bitmap)),),
            (
                FrontierInstruction(0x1000, 0, 0x0C000050),
                FrontierInstruction(0x1000, 1, 0x00000000),
            ),
            (
                FrontierEdge(
                    0x1000,
                    0,
                    0x0C000050,
                    0x1000,
                    1,
                    0x00000000,
                ),
            ),
            (),
        )
        client.load_novelty_frontier(frontier, instruction_batch_size=1)
        load_command = next(line for line in transport.lines if line.startswith("frontier load "))
        self.assertEqual(len(load_command.split()), 5)
        self.assertFalse(any(line.startswith("frontier page ") for line in transport.lines))

    def test_explicit_control_and_diagnostic_surface(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)

        client.open_rom(r"C:\Games\Ogre Battle 64.v64")
        client.close_rom()
        client.pause()
        client.resume()
        client.frame_step(2)
        client.instruction_step()
        client.save_state(r"C:\Temp\state.pj")
        client.load_state(r"C:\Temp\state.pj")
        client.capture_framebuffer(r"C:\Temp\frame.png")
        client.frame_hash()
        client.dump_memory(0x80000000, 0x100, r"C:\Temp\dump.bin")
        client.write_memory(0x80001000, 0x12345678)
        client.press_button("A", samples=3)
        client.set_stick(-10, 20, samples=2)
        client.clear_input()

        expected = {
            r"openrom C:\Games\Ogre Battle 64.v64",
            "closerom",
            "pause",
            "resume",
            "framestep 2",
            "step",
            r"savestate C:\Temp\state.pj",
            r"loadstate C:\Temp\state.pj",
            r"framebuffer C:\Temp\frame.png",
            "framehash",
            r"dumpmem 0x80000000 0x100 C:\Temp\dump.bin",
            "poke u32 0x80001000 0x12345678",
            "input a 3",
            "input stick -10 20 2",
            "input clear",
        }
        self.assertTrue(expected.issubset(set(transport.lines)))

    def test_recorder_facade_does_not_expose_mutation_capabilities(self) -> None:
        client = Pj64Client(transport=ScriptedTransport())
        observer = client.observation_only()
        observer.status()
        for name in (
            "open_rom",
            "close_rom",
            "pause",
            "resume",
            "frame_step",
            "instruction_step",
            "save_state",
            "load_state",
            "write_memory",
            "press_button",
            "set_stick",
            "clear_input",
            "dump_memory",
            "clear_all_watches_and_events",
        ):
            self.assertFalse(hasattr(observer, name), name)

    def test_command_injection_and_bridge_errors_are_rejected(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)
        with self.assertRaises(ValueError):
            client.save_state("state.pj\nclear")
        with self.assertRaises(ValueError):
            client.open_rom("game.v64\nclear")
        with self.assertRaises(ValueError):
            client.watch_exec(0x80000000, label="bad\nclear")

        class ErrorTransport(ScriptedTransport):
            def request(self, line: str) -> Mapping[str, Any]:
                return {"ok": False, "error": "rejected"}

        with self.assertRaisesRegex(Pj64Error, "rejected"):
            Pj64Client(transport=ErrorTransport()).status()


if __name__ == "__main__":
    unittest.main()
