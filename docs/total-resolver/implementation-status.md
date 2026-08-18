# Total Resolver R3 Implementation Status

Status: **Phases 0-9 complete; Phase 10 manual coverage pending**
Updated: 2026-08-18

This page records the current implementation boundary. It is not a claim that the game has been
fully observed or that every resolver result is semantically proven.

## Accepted generated products

The current clean dynamic products were built from two real bridge sessions:

- `20260818T032141.053282Z-9dae1dea`
- `20260818T040416.150382Z-95d69e8b`

| Product | Logical SHA-256 | Verification |
|---|---|---|
| Overlay Atlas 2.0 | `8DC910669EF472FB4CB19FE2F8A8EE39A344DBF10A54B9A05DA75FEB11D5F7A5` | PASS |
| Runtime Provenance 2.0 | `B4F0F150E150B9D09F27897D0CB498B4F881856F474EF198965EDC1D27ED92A6` | PASS |
| Total Resolver R3 | `EFA84497D8B9951997949AFC43F1CD28BCE12D2AD6B326C28F89EE1EE3B5D729` | PASS, reproduced by a second build |

Current coverage is reported by `python -m tools.total_resolver coverage` rather than duplicated in
this document. The accepted product has placement and sampled-PC context, but no exact watch hit
has yet established function execution. Sampled PCs remain context and do not count as execution.

## Completed behavior

- Exact bridge `0.7.2` handshake and fail-closed compatibility tests.
- Unified emulator-ordered watch/DMA stream with epoch and explicit dropped ranges.
- Event-time destination-byte evidence for completed ROM DMA events.
- Observation-only raw recorder with close, recovery, verification, and deterministic replay.
- Region lifetimes, transient placements, Overlay Atlas 2.0, and Runtime Provenance 2.0.
- Compact typed resolver with separate static, placement, runtime, field, and resource lanes.
- Contextual live-address resolution that fails ambiguous without sufficient lifetime context.
- Raw-first event and crash bundles whose enrichment reproduces offline.
- Source identity, coverage conservation, placement arithmetic, and sampled-versus-executed checks.

## Demonstrated ambiguity handling

Live address `0x80197B70` is reused by multiple placements. A context-free query reports all
supported candidates and fails ambiguous. In session `20260818T032141.053282Z-9dae1dea`, sequence
`200` selects `func_001ce070`, while sequence `12000` selects `func_0006e660`, because those are the
placements alive at the respective event boundaries.

## Current limits

- Coverage is deliberately incomplete and currently biased toward the observed Army/menu state.
- There are no exact execution hits or event-time memory-watch accesses in the accepted runtime
  product yet.
- Static calls, sampled PCs, residency, exact execution, field candidates, and supported semantic
  names remain different evidence classes.
- Hashes identify bytes and inputs; they do not prove meaning or equivalent behavior.
- Live enrichment is `live-unreviewed` until incorporated into a rebuilt, verified product.

Phase 10 now needs ordinary gameplay coverage. Human labels are optional; the machine recorder
captures bridge transitions without requiring a courtroom-style evidence ritual.
