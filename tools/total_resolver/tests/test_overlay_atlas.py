from __future__ import annotations

from contextlib import closing
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from tools.total_resolver.capture_db import canonical_json
from tools.total_resolver.derive_session import SESSION_PRODUCT_SCHEMA
from tools.total_resolver.overlay_atlas import build_overlay_atlas, verify_overlay_atlas
from tools.total_resolver.tests.test_derive_transition import create_static_database


def write_rows(path: Path, rows: list[dict[str, object]]) -> None:
    path.write_text("".join(canonical_json(row) + "\n" for row in rows), encoding="utf-8")


def make_session_product(root: Path, *, destination: int = 0x2000) -> Path:
    root.mkdir(parents=True)
    transaction_id = "S:rom-dma:1:2"
    transaction = {
        "transactionId": transaction_id,
        "entrySequence": 1,
        "completionSequence": 2,
        "frame": 10,
        "sourceZ64Start": 256,
        "sourceMatchedEndExclusive": 264,
        "capturedByteLength": 8,
        "destinationPhysicalStart": destination,
        "destinationTransferEndExclusive": destination + 8,
        "destinationContentSha256": "A" * 64,
        "staticRegionClass": "executable",
        "pairingStatus": "matched",
        "contentBytesValid": True,
        "legacyContentHashMatches": False,
        "romMatch": "exact-span",
        "romMatchedPrefixLength": 8,
    }
    slab = {
        "codeSlabId": "code-slab:0001",
        "sourceZ64Start": 256,
        "sourceZ64EndExclusive": 264,
        "destinationPhysicalStart": destination,
        "destinationPhysicalEndExclusive": destination + 8,
        "contentSha256": "A" * 64,
        "staticRegionClass": "executable",
        "byteSize": 8,
        "mappingDeltaPhysicalMinusZ64": destination - 256,
        "mappingMethod": "contiguous-exact-rom-dma-transactions",
        "firstCompletionSequence": 2,
        "lastCompletionSequence": 2,
        "firstFrame": 10,
        "lastFrame": 10,
        "transactionIds": [transaction_id],
    }
    function = {
        "placementId": "code-slab:0001:function:crosses_dma_chunks",
        "codeSlabId": "code-slab:0001",
        "firstCompletionSequence": 2,
        "lastCompletionSequence": 2,
        "firstFrame": 10,
        "lastFrame": 10,
        "function": {
            "functionId": 2,
            "structuralName": "crosses_dma_chunks",
            "displayName": "crosses_dma_chunks",
            "z64Start": 258,
            "z64EndExclusive": 262,
            "confidence": "high",
        },
        "destinationPhysicalStart": destination + 2,
        "destinationPhysicalEndExclusive": destination + 6,
        "mappingMethod": "direct-contiguous-rom-dma-slab-equality",
    }
    region = {
        "regionInstanceId": "S:region:00000001",
        "destinationPhysicalStart": destination,
        "destinationPhysicalEndExclusive": destination + 8,
        "contentSha256": "A" * 64,
        "firstSequence": 2,
        "endSequenceExclusive": 5,
        "firstFrame": 10,
        "lastObservedFrame": 11,
        "closureReason": "replaced",
        "regionClass": "executable",
        "evidenceGrade": "verified",
        "sourceKind": "z64-rom",
        "sourceIdentity": "z64:00000100-00000108",
        "sourceLoaderEventId": transaction_id,
        "transientAtMostTwoFrames": True,
    }
    files = {
        "transactions": "transactions.ndjson",
        "regions": "regions.ndjson",
        "codeSlabs": "code-slabs.ndjson",
        "functionPlacements": "function-placements.ndjson",
        "unresolved": "unresolved.ndjson",
    }
    write_rows(root / files["transactions"], [transaction])
    write_rows(root / files["regions"], [region])
    write_rows(root / files["codeSlabs"], [slab])
    write_rows(root / files["functionPlacements"], [function])
    write_rows(root / files["unresolved"], [])
    (root / "summary.json").write_text(
        json.dumps(
            {
                "schema": SESSION_PRODUCT_SCHEMA,
                "sessionId": "S",
                "rawSession": {
                    "manifestSha256": "B" * 64,
                    "bridgeVersion": "0.7.2",
                    "closureStatus": "closed",
                    "continuityStatus": "continuous",
                },
                "workingEvidenceQuality": "supported-working-evidence",
                "files": files,
            },
            sort_keys=True,
        ),
        encoding="utf-8",
    )
    return root


class OverlayAtlasTests(unittest.TestCase):
    def test_build_is_deterministic_and_destination_changes_identity(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static = root / "static.sqlite"
            create_static_database(static)
            source = make_session_product(root / "source")
            first = build_overlay_atlas(
                [source], output_directory=root / "first", static_database=static
            )
            second = build_overlay_atlas(
                [source], output_directory=root / "second", static_database=static
            )
            self.assertEqual(first["result"], "PASS")
            self.assertEqual(first["logicalSha256"], second["logicalSha256"])
            self.assertEqual(first["counts"]["functionPlacements"], 1)
            self.assertEqual(first["counts"]["transientOnlyPlacements"], 1)

            mutated = make_session_product(root / "mutated", destination=0x3000)
            changed = build_overlay_atlas(
                [mutated], output_directory=root / "changed", static_database=static
            )
            self.assertNotEqual(first["logicalSha256"], changed["logicalSha256"])
            with closing(sqlite3.connect(first["database"])) as left, closing(
                sqlite3.connect(changed["database"])
            ) as right:
                left_ids = {row[0] for row in left.execute("SELECT placement_id FROM placement")}
                right_ids = {row[0] for row in right.execute("SELECT placement_id FROM placement")}
            self.assertNotEqual(left_ids, right_ids)

    def test_verifier_detects_database_mutation(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static = root / "static.sqlite"
            create_static_database(static)
            source = make_session_product(root / "source")
            built = build_overlay_atlas(
                [source], output_directory=root / "atlas", static_database=static
            )
            with closing(sqlite3.connect(built["database"])) as connection:
                connection.execute(
                    "UPDATE placement SET destination_physical_start=destination_physical_start+4"
                )
                connection.commit()
            verified = verify_overlay_atlas(root / "atlas")
            self.assertEqual(verified["result"], "FAIL")
            self.assertFalse(verified["checks"]["logicalHash"])


if __name__ == "__main__":
    unittest.main()
