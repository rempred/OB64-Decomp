from __future__ import annotations

import json
from pathlib import Path
import shutil
import subprocess
import unittest

from tools.total_resolver.inventory import load_inventory, repository_root


class ActiveBridgeTests(unittest.TestCase):
    def test_node_harness_proves_order_epoch_loss_and_dma_content_contract(self) -> None:
        node = shutil.which("node")
        if node is None:
            self.skipTest("Node.js is unavailable")
        inventory = load_inventory()
        bridge = (
            repository_root().parent
            / inventory["project64"]["activeBridge"]["path"]
        ).resolve()
        harness = Path(__file__).with_name("bridge_080_harness.js")
        completed = subprocess.run(
            (node, str(harness), str(bridge)),
            check=True,
            capture_output=True,
            text=True,
        )
        result = json.loads(completed.stdout)
        self.assertEqual(result["version"], "0.8.0")
        self.assertEqual(result["orderedSequences"], [1, 2, 3])
        self.assertEqual(result["dmaBytes"], "AAAB")
        self.assertEqual(result["memoryBytes"], "AAABAC")
        self.assertEqual(result["tracePageCount"], 2)
        self.assertEqual(result["exactCoverageCount"], 3)
        self.assertEqual(result["inputTransitionCount"], 2)
        self.assertEqual(result["suppressedCoverage"], 1)
        self.assertEqual(result["droppedRange"]["count"], 65539)


if __name__ == "__main__":
    unittest.main()
