from __future__ import annotations

import unittest

from tools.total_resolver.configuration import machine_configuration_identity
from tools.total_resolver.contracts import EvidenceGrade, RegionClass
from tools.total_resolver.region_tracker import RegionTracker


class RegionTrackerTests(unittest.TestCase):
    def test_partial_overlap_splits_and_preserves_all_lifetimes(self) -> None:
        tracker = RegionTracker("S1")
        first = tracker.observe_load(
            physical_start=0x100,
            data=b"ABCDEFGH",
            sequence=1,
            frame=10,
            region_class=RegionClass.EXECUTABLE,
            evidence_grade=EvidenceGrade.VERIFIED,
            source_kind="z64-rom",
            source_identity="rom:0x200-0x208",
            loader_event_id="loader:1",
        )
        original = first.created[0]

        second = tracker.observe_load(
            physical_start=0x102,
            data=b"1234",
            sequence=2,
            frame=11,
            region_class=RegionClass.DATA,
            source_kind="resource",
            source_identity="resource:1",
            loader_event_id="loader:2",
        )
        self.assertEqual(second.closed[0].region_instance_id, original.region_instance_id)
        self.assertEqual(second.closed[0].closure_reason, "partial-overlap-split")
        self.assertEqual(
            [(region.physical_start, region.physical_end_exclusive, region.data) for region in tracker.active_regions],
            [(0x100, 0x102, b"AB"), (0x102, 0x106, b"1234"), (0x106, 0x108, b"GH")],
        )
        fragments = [region for region in second.created if region.parent_region_instance_id]
        self.assertEqual(len(fragments), 2)

    def test_one_event_transient_remains_in_history(self) -> None:
        tracker = RegionTracker("S2")
        tracker.observe_load(physical_start=0x300, data=b"AAAA", sequence=1, frame=20)
        transient = tracker.observe_load(
            physical_start=0x300,
            data=b"BBBB",
            sequence=2,
            frame=21,
        ).created[-1]
        replacement = tracker.observe_load(
            physical_start=0x300,
            data=b"CCCC",
            sequence=3,
            frame=21,
        )
        closed_transient = next(
            region for region in replacement.closed if region.region_instance_id == transient.region_instance_id
        )
        self.assertEqual(closed_transient.first_sequence, 2)
        self.assertEqual(closed_transient.end_sequence_exclusive, 3)
        self.assertEqual(closed_transient.closure_reason, "replaced")

    def test_configuration_changes_with_machine_bytes_and_close_is_explicit(self) -> None:
        tracker = RegionTracker("S3")
        tracker.observe_load(physical_start=0x400, data=b"AAAA", sequence=1, frame=1)
        first_digest, _ = machine_configuration_identity(tracker.configuration_regions())
        tracker.observe_load(physical_start=0x400, data=b"BBBB", sequence=2, frame=2)
        second_digest, _ = machine_configuration_identity(tracker.configuration_regions())
        self.assertNotEqual(first_digest, second_digest)
        closed = tracker.close_all(sequence=3, frame=2)
        self.assertEqual(closed[0].closure_reason, "session-end")
        self.assertEqual(tracker.active_regions, ())

    def test_non_monotonic_sequence_is_rejected(self) -> None:
        tracker = RegionTracker("S4")
        tracker.observe_load(physical_start=0, data=b"A", sequence=1, frame=1)
        with self.assertRaisesRegex(ValueError, "strictly increasing"):
            tracker.observe_load(physical_start=1, data=b"B", sequence=1, frame=1)

    def test_large_disjoint_set_replaces_only_the_overlapping_interval(self) -> None:
        tracker = RegionTracker("S5")
        region_count = 10_000
        for index in range(region_count):
            tracker.observe_load(
                physical_start=index * 4,
                data=b"AA",
                sequence=index + 1,
                frame=index,
            )

        target = region_count // 2
        change = tracker.observe_load(
            physical_start=target * 4 + 1,
            data=b"BB",
            sequence=region_count + 1,
            frame=region_count,
        )
        active = tracker.active_regions

        self.assertEqual(len(change.closed), 1)
        self.assertEqual(len(active), region_count + 1)
        self.assertEqual(
            [
                (region.physical_start, region.physical_end_exclusive, region.data)
                for region in active[target : target + 2]
            ],
            [
                (target * 4, target * 4 + 1, b"A"),
                (target * 4 + 1, target * 4 + 3, b"BB"),
            ],
        )
        self.assertEqual(active[target - 1].physical_start, (target - 1) * 4)
        self.assertEqual(active[target + 2].physical_start, (target + 1) * 4)


if __name__ == "__main__":
    unittest.main()
