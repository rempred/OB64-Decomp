from __future__ import annotations

from collections.abc import Mapping
import unittest
from typing import Any

from tools.total_resolver.pj64_client import Pj64Client, Pj64Error
from tools.total_resolver.protocol import BRIDGE_PROTOCOL_VERSION, BridgeProtocolError


class ScriptedTransport:
    def __init__(self, *, version: str = BRIDGE_PROTOCOL_VERSION) -> None:
        self.version = version
        self.connected = False
        self.closed = False
        self.lines: list[str] = []
        self.epoch = "EPOCH-TEST"

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
            }
        if line == "status":
            return {
                "ok": True,
                "version": self.version,
                "port": 64640,
                "bridgeEpoch": self.epoch,
                "queueModel": "unified",
                "nextEventSequence": 1,
                "queued": 0,
                "dropped": 0,
                "droppedRanges": [],
                "watches": [],
                "dma": {},
                "emuState": {},
            }
        if line == "health":
            return {
                "ok": True,
                "version": self.version,
                "bridgeEpoch": self.epoch,
                "queueModel": "unified",
                "nextEventSequence": 1,
                "core": "interpreter",
                "rom": None,
            }
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
    def test_connect_performs_three_way_protocol_handshake(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)
        client.connect()
        self.assertEqual(transport.lines, ["ping", "status", "health"])
        self.assertEqual(client.handshake_result.version, "0.7.2")

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
        self.assertIn("dma on 0x1000 0x2000 64 0x0 8", transport.lines)
        self.assertIn("dma cart 0x3000 0x4000", transport.lines)

    def test_explicit_control_and_diagnostic_surface(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)

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

    def test_command_injection_and_bridge_errors_are_rejected(self) -> None:
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)
        with self.assertRaises(ValueError):
            client.save_state("state.pj\nclear")
        with self.assertRaises(ValueError):
            client.watch_exec(0x80000000, label="bad\nclear")

        class ErrorTransport(ScriptedTransport):
            def request(self, line: str) -> Mapping[str, Any]:
                return {"ok": False, "error": "rejected"}

        with self.assertRaisesRegex(Pj64Error, "rejected"):
            Pj64Client(transport=ErrorTransport()).status()


if __name__ == "__main__":
    unittest.main()
