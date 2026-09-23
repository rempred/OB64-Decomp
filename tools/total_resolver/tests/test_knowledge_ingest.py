from __future__ import annotations

import unittest

from tools.total_resolver.knowledge_ingest import _focused_profile_version_from_wire


class FocusedProfileWireVersionTests(unittest.TestCase):
    def test_frozen_v2_definition_is_bound_to_v1_wire_event(self) -> None:
        event = {"focusedProfileId": "cutscene-studio-v2", "focusedProfileVersion": 1}
        frozen = {"profileId": "cutscene-studio-v2", "profileVersion": 2}
        self.assertEqual(_focused_profile_version_from_wire(event, frozen), 2)

        with self.assertRaisesRegex(ValueError, "profile ID"):
            _focused_profile_version_from_wire(event, {
                "profileId": "cutscene-studio-v1", "profileVersion": 2,
            })
        with self.assertRaisesRegex(ValueError, "wire version"):
            _focused_profile_version_from_wire({**event, "focusedProfileVersion": 2}, frozen)
        with self.assertRaisesRegex(ValueError, "definition version"):
            _focused_profile_version_from_wire(event, {
                "profileId": "cutscene-studio-v2", "profileVersion": True,
            })


if __name__ == "__main__":
    unittest.main()
