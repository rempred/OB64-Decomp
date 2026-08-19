from __future__ import annotations

import json
from pathlib import Path
import tempfile
import unittest

from tools.total_resolver.overlay_atlas import build_overlay_atlas
from tools.total_resolver.runtime_provenance import build_runtime_provenance
from tools.total_resolver.tests.test_derive_transition import create_static_database
from tools.total_resolver.tests.test_overlay_atlas import make_session_product, write_rows


def add_runtime_rows(
    product: Path, observations: list[dict[str, object]]
) -> None:
    write_rows(product / "execution-observations.ndjson", observations)
    write_rows(product / "memory-accesses.ndjson", [])
    summary_path = product / "summary.json"
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    summary["files"]["executionObservations"] = "execution-observations.ndjson"
    summary["files"]["memoryAccesses"] = "memory-accesses.ndjson"
    summary_path.write_text(json.dumps(summary, sort_keys=True), encoding="utf-8")


def observation(*, sequence: int, claim: str = "observed") -> dict[str, object]:
    return {
        "executionObservationId": f"execution:{sequence:08d}",
        "sequence": sequence,
        "bridgeSequence": sequence,
        "frame": 10,
        "pc": 0x80002002,
        "physicalPc": 0x2002,
        "observationKind": "exact-watch-hit" if claim == "observed" else "sampled-pc-context",
        "executionClaim": claim,
        "regionInstanceId": "S:region:00000001",
        "romOffset": 258,
        "function": {
            "functionId": 2,
            "structuralName": "crosses_dma_chunks",
            "displayName": "crosses_dma_chunks",
            "z64Start": 258,
            "z64EndExclusive": 262,
            "confidence": "high",
        },
        "mappingMethod": "contemporaneous-rom-dma-region",
        "status": "resolved-function",
        "registerSnapshot": None,
        "returnAddress": None,
    }


class RuntimeProvenanceTests(unittest.TestCase):
    def test_only_exact_observation_creates_execution_coverage(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static = root / "static.sqlite"
            create_static_database(static)
            source = make_session_product(root / "source")
            add_runtime_rows(
                source,
                [observation(sequence=3), observation(sequence=4, claim="sampled-only")],
            )
            atlas = build_overlay_atlas(
                [source], output_directory=root / "atlas", static_database=static
            )
            runtime = build_runtime_provenance(
                [source],
                overlay_atlas=Path(atlas["productDirectory"]),
                output_directory=root / "runtime",
                static_database=static,
            )
            self.assertEqual(runtime["result"], "PASS")
            self.assertEqual(runtime["counts"]["exactExecutionObservations"], 1)
            self.assertEqual(runtime["counts"]["exactExecutionWatchHits"], 1)
            self.assertEqual(runtime["counts"]["nativeExecutionCoverage"], 0)
            self.assertEqual(runtime["counts"]["sampledPcContexts"], 1)
            self.assertEqual(runtime["counts"]["observedExecutedFunctions"], 1)

    def test_native_exact_transition_creates_content_resolved_edge(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static = root / "static.sqlite"
            create_static_database(static)
            source = make_session_product(root / "source")
            first = observation(sequence=3)
            first.update(
                {
                    "observationKind": "native-exact-coverage",
                    "codePageContentId": 7,
                    "codePageContentResolved": True,
                    "newEdge": False,
                    "previous": None,
                }
            )
            second = observation(sequence=4)
            second.update(
                {
                    "pc": 0x80002003,
                    "physicalPc": 0x2003,
                    "observationKind": "native-exact-coverage",
                    "codePageContentId": 7,
                    "codePageContentResolved": True,
                    "newEdge": True,
                    "previous": {
                        "pc": "0x80002002",
                        "codePageContentId": 7,
                        "exactContentResolved": True,
                    },
                }
            )
            add_runtime_rows(source, [first, second])
            atlas = build_overlay_atlas(
                [source], output_directory=root / "atlas", static_database=static
            )
            runtime = build_runtime_provenance(
                [source],
                overlay_atlas=Path(atlas["productDirectory"]),
                output_directory=root / "runtime",
                static_database=static,
            )
            self.assertEqual(runtime["counts"]["exactExecutionObservations"], 2)
            self.assertEqual(runtime["counts"]["exactExecutionWatchHits"], 0)
            self.assertEqual(runtime["counts"]["nativeExecutionCoverage"], 2)
            self.assertEqual(runtime["counts"]["observedEdges"], 1)
            edge = json.loads(
                (root / "runtime" / "observed-edges.ndjson").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(edge["edgeKind"], "native-exact-instruction-transition")
            self.assertEqual(edge["callerFunctionId"], 2)
            self.assertEqual(edge["calleeFunctionId"], 2)

    def test_residency_alone_never_creates_execution_and_bad_context_is_visible(self) -> None:
        with tempfile.TemporaryDirectory() as raw:
            root = Path(raw)
            static = root / "static.sqlite"
            create_static_database(static)

            empty = make_session_product(root / "empty")
            add_runtime_rows(empty, [])
            empty_atlas = build_overlay_atlas(
                [empty], output_directory=root / "empty-atlas", static_database=static
            )
            empty_runtime = build_runtime_provenance(
                [empty],
                overlay_atlas=Path(empty_atlas["productDirectory"]),
                output_directory=root / "empty-runtime",
                static_database=static,
            )
            self.assertEqual(empty_runtime["counts"]["executionObservations"], 0)
            self.assertEqual(empty_runtime["counts"]["observedExecutedFunctions"], 0)

            stale = make_session_product(root / "stale")
            add_runtime_rows(stale, [observation(sequence=6)])
            stale_atlas = build_overlay_atlas(
                [stale], output_directory=root / "stale-atlas", static_database=static
            )
            stale_runtime = build_runtime_provenance(
                [stale],
                overlay_atlas=Path(stale_atlas["productDirectory"]),
                output_directory=root / "stale-runtime",
                static_database=static,
            )
            self.assertEqual(stale_runtime["result"], "PASS")
            self.assertEqual(stale_runtime["counts"]["runtimeConflicts"], 1)
            self.assertEqual(stale_runtime["counts"]["unresolvedRuntimeObservations"], 1)
            self.assertEqual(stale_runtime["counts"]["observedExecutedFunctions"], 0)


if __name__ == "__main__":
    unittest.main()
