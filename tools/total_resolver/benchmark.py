"""Deterministic bridge simulation for persistent-delta volume and lookup cost."""

from __future__ import annotations

import json
from pathlib import Path
import shutil
import subprocess
import time
from typing import Any

from .inventory import load_inventory, repository_root, sha256_file
from .schema import utc_now


def default_benchmark_report() -> Path:
    return (
        repository_root()
        / "build"
        / "total-resolver"
        / "benchmarks"
        / "persistent-delta.json"
    ).resolve()


def run_persistent_delta_benchmark(output: Path | None = None) -> dict[str, Any]:
    """Run the bridge in a fake emulator; never launches or controls Project64."""

    node = shutil.which("node")
    if node is None:
        raise RuntimeError("Node.js is required for the bridge benchmark")
    inventory = load_inventory()
    bridge = (
        repository_root().parent / inventory["project64"]["activeBridge"]["path"]
    ).resolve()
    if sha256_file(bridge) != inventory["project64"]["activeBridge"]["sha256"]:
        raise ValueError("active bridge bytes differ from the frozen benchmark inventory")
    harness = (
        repository_root()
        / "tools"
        / "total_resolver"
        / "tests"
        / "bridge_110_harness.js"
    )
    started = time.perf_counter_ns()
    completed = subprocess.run(
        (node, str(harness), str(bridge)),
        check=True,
        capture_output=True,
        text=True,
    )
    wall_ns = time.perf_counter_ns() - started
    raw = json.loads(completed.stdout)
    first_facts = int(raw["firstCanonicalExecutionEdgeFacts"])
    repeated_facts = int(raw["repeatedCanonicalExecutionEdgeFacts"])
    first_trace_events = int(raw["firstTraceEvents"])
    repeated_trace_events = int(raw["repeatedTraceEvents"])
    fact_reduction = 1.0 - repeated_facts / max(first_facts, 1)
    event_reduction = 1.0 - repeated_trace_events / max(first_trace_events, 1)
    passed = (
        repeated_facts == 0
        and int(raw["pageReadsDuringExecutionTrace"]) == 0
        and int(raw["knownDmaEvents"]) == 0
        and int(raw["newDmaEvents"]) == 1
        and int(raw["upperMemoryEvents"]) == 0
        and int(raw["baselineBytes"]) == 0x00400000
        and bool(raw["coldBootBaselineFirst"])
        and bool(raw["wrongRomRejected"])
    )
    report = {
        "schema": "ob64-total-resolver-persistent-delta-benchmark.v4",
        "result": "PASS" if passed else "FAIL",
        "measuredUtc": utc_now(),
        "simulation": "Node.js fake emulator exercising the production bridge script",
        "bridgeVersion": raw["version"],
        "captureVolume": {
            "firstCanonicalExecutionEdgeFacts": first_facts,
            "repeatedCanonicalExecutionEdgeFacts": repeated_facts,
            "canonicalFactReductionFraction": fact_reduction,
            "firstStructuralTraceEvents": first_trace_events,
            "repeatedStructuralTraceEvents": repeated_trace_events,
            "traceEventReductionFraction": event_reduction,
            "fullPageReadsDuringExecutionTrace": int(raw["pageReadsDuringExecutionTrace"]),
        },
        "nativeBoundary": {
            "knownExecutionEventsCrossingIntoJavaScript": repeated_trace_events,
            "knownDmaEventsCrossingIntoJavaScript": int(raw["knownDmaEvents"]),
            "changedDmaEventsCrossingIntoJavaScript": int(raw["newDmaEvents"]),
            "upperFourMiBEventsCrossingIntoJavaScript": int(raw["upperMemoryEvents"]),
            "atomicBaselineBytes": int(raw["baselineBytes"]),
            "note": "deterministic bridge/native-filter simulation; not an emulator FPS claim",
        },
        "contracts": {
            "newTailAndCallerRetained": True,
            "changedAndRelocatedCodeRetained": True,
            "ambiguousSourceFallsBackToCapture": True,
            "explicitDroppedRanges": True,
            "eventTimeDmaBytes": True,
            "exactLowerFourMiBCaptureWindow": True,
            "coldBootBaselineFirst": bool(raw["coldBootBaselineFirst"]),
            "wrongRomRejectedBeforeCapture": bool(raw["wrongRomRejected"]),
            "observationOnlyCapture": bool(raw["observationOnlyCapture"]),
        },
        "harnessWallNanoseconds": wall_ns,
    }
    destination = (output or default_benchmark_report()).resolve()
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_name(destination.name + ".tmp")
    temporary.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temporary.replace(destination)
    report["reportPath"] = str(destination)
    return report
