from __future__ import annotations

import json
from pathlib import Path
import shutil
import subprocess
import unittest

from tools.total_resolver.inventory import load_inventory, repository_root


class ActiveBridgeTests(unittest.TestCase):
    def test_node_harness_proves_structural_delta_and_ordering_contract(self) -> None:
        node = shutil.which("node")
        if node is None:
            self.skipTest("Node.js is unavailable")
        inventory = load_inventory()
        bridge = (
            repository_root().parent
            / inventory["project64"]["activeBridge"]["path"]
        ).resolve()
        harness = Path(__file__).with_name("bridge_110_harness.js")
        completed = subprocess.run(
            (node, str(harness), str(bridge)),
            check=True,
            capture_output=True,
            text=True,
        )
        result = json.loads(completed.stdout)
        self.assertEqual(result["version"], "0.14.0")
        self.assertEqual(result["frontierFormatVersion"], 5)
        self.assertEqual(result["pageReadsDuringExecutionTrace"], 0)
        self.assertEqual(result["repeatedCanonicalExecutionEdgeFacts"], 0)
        self.assertGreater(result["explicitDroppedRanges"], 0)
        self.assertEqual(result["tracePageCount"], 0)
        self.assertEqual(result["traceGenerationCount"], 0)
        self.assertEqual(result["exactCoverageCount"], 2)
        self.assertEqual(result["repeatedKnownMetadataCount"], 0)
        self.assertEqual(result["firstCanonicalExecutionEdgeFacts"], 3)
        self.assertEqual(result["newTailAndCallerEvents"], 6)
        self.assertEqual(result["baselineBytes"], 0x00400000)
        self.assertEqual(result["knownDmaEvents"], 0)
        self.assertEqual(result["upperMemoryEvents"], 0)
        self.assertEqual(result["newDmaEvents"], 1)
        self.assertTrue(result["coldBootBaselineFirst"])
        self.assertTrue(result["wrongRomRejected"])
        self.assertTrue(result["observationOnlyCapture"])
        self.assertEqual(result["stopTimeActivitySummaries"], 1)
        self.assertGreater(result["knownActivityFactHits"], 0)
        self.assertGreater(result["knownCallActivityHits"], 0)
        self.assertGreater(result["knownActivityBitmapBytes"], 0)
        self.assertEqual(result["markerContextWindows"], 1)


if __name__ == "__main__":
    unittest.main()
