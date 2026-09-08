"""Real Python focused-watch serialization through the source bridge VM."""

import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

from tools.total_resolver.pj64_client import Pj64Client
from tools.total_resolver.tests.test_pj64_client import ScriptedTransport


class StartupWireTests(unittest.TestCase):
    def test_real_serializer_parser_and_stack_reads(self):
        node = shutil.which("node")
        if node is None:
            self.skipTest("Node.js is unavailable")
        transport = ScriptedTransport()
        client = Pj64Client(transport=transport)
        cases = []
        arguments = dict(
            live_start=0x80001000, live_end_exclusive=0x80001040,
            entry_opcode=0, signature_bytes=bytes(4),
            profile_id="synthetic-profile", target_id="synthetic-target",
            function_id=7, z64_start=0x1000, sample_mode="all",
            pointer_snapshots=(),
        )
        for count in (0, 1, 8, 32, 128):
            client.install_focused_watch(**arguments, stack_words=count)
            cases.append({"count": count, "line": transport.lines[-1]})
        for bad in (-1, 129, 1.5, True, "1junk"):
            with self.assertRaises(ValueError):
                client.install_focused_watch(**arguments, stack_words=bad)
        tests = Path(__file__).parent
        bridge = tests.parents[3] / "tools/project64/ob64_pj64_bridge.js"
        with tempfile.TemporaryDirectory() as directory:
            wire = Path(directory) / "wire.json"
            wire.write_text(json.dumps(cases), encoding="utf-8")
            result = subprocess.run(
                [node, str(tests / "bridge_110_harness.js"), str(bridge), str(wire)],
                check=True, capture_output=True, text=True,
            )
            self.assertEqual(json.loads(result.stdout)["serializedStackCases"], len(cases))


if __name__ == "__main__":
    unittest.main()
