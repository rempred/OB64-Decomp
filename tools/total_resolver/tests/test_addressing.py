from __future__ import annotations

import unittest

from tools.total_resolver.addressing import (
    AddressRange,
    AddressSpace,
    live_kseg0_from_physical,
    live_kseg0_range_from_physical,
    physical_from_live,
    physical_range_from_live,
)


class AddressingTests(unittest.TestCase):
    def test_kseg_aliases_convert_only_to_physical_rdram(self) -> None:
        self.assertEqual(physical_from_live(0x80123456), 0x00123456)
        self.assertEqual(physical_from_live(0xA0123456), 0x00123456)
        self.assertEqual(live_kseg0_from_physical(0x00123456), 0x80123456)

        live = AddressRange(AddressSpace.LIVE_KSEG, 0x80100000, 0x80100100, "region:1")
        physical = physical_range_from_live(live)
        self.assertEqual(
            physical,
            AddressRange(AddressSpace.PHYSICAL_RDRAM, 0x00100000, 0x00100100, "region:1"),
        )
        self.assertEqual(live_kseg0_range_from_physical(physical), live)

    def test_rom_and_nominal_spaces_do_not_gain_fake_generic_mapping(self) -> None:
        rom = AddressRange(AddressSpace.Z64_ROM, 0x1000, 0x1100)
        with self.assertRaisesRegex(ValueError, "physical-rdram"):
            live_kseg0_range_from_physical(rom)
        with self.assertRaisesRegex(ValueError, "live-kseg"):
            physical_range_from_live(rom)

    def test_invalid_live_and_physical_ranges_fail_closed(self) -> None:
        with self.assertRaises(ValueError):
            physical_from_live(0x70000000)
        with self.assertRaises(ValueError):
            physical_from_live(0x80800000)
        with self.assertRaises(ValueError):
            AddressRange(AddressSpace.PHYSICAL_RDRAM, 0, 0x00800001)


if __name__ == "__main__":
    unittest.main()
