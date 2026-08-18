from __future__ import annotations

import copy
import unittest

from tools.total_resolver.contracts import validate_normalized_record


def valid_record() -> dict:
    return {
        "schema": "ob64-total-resolver-normalized-record.v1",
        "recordId": "region:1",
        "recordType": "region-instance",
        "sourceId": "session:S1",
        "sessionId": "S1",
        "sequence": 1,
        "frame": 10,
        "evidenceLane": "placement",
        "evidenceGrade": "verified",
        "reviewState": "live-unreviewed",
        "disposition": "compatible",
        "addresses": [
            {
                "space": "physical-rdram",
                "role": "destination",
                "start": 0x1000,
                "endExclusive": 0x1100,
                "contextId": "region:1",
            }
        ],
        "relationships": [
            {"type": "loaded-by", "target": "loader:1", "disposition": "compatible"}
        ],
        "nativePayload": {"contentSha256": "A" * 64},
    }


class ContractTests(unittest.TestCase):
    def test_valid_normalized_record_passes(self) -> None:
        validate_normalized_record(valid_record())

    def test_unknown_fields_and_enums_fail_closed(self) -> None:
        record = valid_record()
        record["semanticGuess"] = "Army"
        with self.assertRaisesRegex(ValueError, "unknown normalized fields"):
            validate_normalized_record(record)

        record = valid_record()
        record["reviewState"] = "trusted-because-live"
        with self.assertRaisesRegex(ValueError, "reviewState"):
            validate_normalized_record(record)

    def test_unknown_address_space_and_fields_fail_closed(self) -> None:
        record = copy.deepcopy(valid_record())
        record["addresses"][0]["space"] = "rom-or-ram"
        with self.assertRaisesRegex(ValueError, "invalid space"):
            validate_normalized_record(record)

        record = copy.deepcopy(valid_record())
        record["addresses"][0]["label"] = "World Map"
        with self.assertRaisesRegex(ValueError, "invalid fields"):
            validate_normalized_record(record)


if __name__ == "__main__":
    unittest.main()
