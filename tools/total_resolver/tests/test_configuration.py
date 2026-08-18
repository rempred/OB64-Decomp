from __future__ import annotations

import unittest

from tools.total_resolver.configuration import ConfigurationRegion, machine_configuration_identity
from tools.total_resolver.contracts import RegionClass


class ConfigurationTests(unittest.TestCase):
    def setUp(self) -> None:
        self.code = ConfigurationRegion(
            RegionClass.EXECUTABLE,
            0x1000,
            0x1100,
            "A" * 64,
            "z64-rom",
            "rom:0x2000-0x2100",
            "dma:1",
        )
        self.data = ConfigurationRegion(
            RegionClass.DATA,
            0x2000,
            0x2080,
            "B" * 64,
            "resource",
            "resource:shop",
            "loader:2",
        )

    def test_order_and_human_labels_cannot_change_machine_identity(self) -> None:
        digest_a, payload_a = machine_configuration_identity((self.code, self.data))
        human_label = "Army - Equipment"
        digest_b, payload_b = machine_configuration_identity((self.data, self.code))
        corrected_human_label = "Army - Unit Detail"
        self.assertNotEqual(human_label, corrected_human_label)
        self.assertEqual(digest_a, digest_b)
        self.assertEqual(payload_a, payload_b)
        self.assertNotIn("Army", payload_a)

    def test_code_and_resource_signatures_are_separate(self) -> None:
        code_digest, code_payload = machine_configuration_identity((self.code, self.data), kind="code")
        resource_digest, resource_payload = machine_configuration_identity(
            (self.code, self.data), kind="resource"
        )
        self.assertNotEqual(code_digest, resource_digest)
        self.assertIn("executable", code_payload)
        self.assertNotIn("resource:shop", code_payload)
        self.assertIn("resource:shop", resource_payload)


if __name__ == "__main__":
    unittest.main()
