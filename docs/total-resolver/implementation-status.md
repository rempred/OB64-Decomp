# Total Resolver R3 Implementation Status

Status: **Phases 0-9 complete; first protocol 0.8 Phase 10 candidate verified but not promoted**
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

## First Phase 10 candidate

The first protocol `0.8.0` boot smoke and manual gameplay sessions are closed, continuous, and
independently verified:

- `20260819T010624.950173Z-c80aab2f` — bounded boot/title smoke;
- `20260819T010909.773985Z-2ec6591b` — user-driven gameplay capture.

The gameplay session retained 315,320 emulator-created events in one bridge epoch with zero lost
sequence ranges. It captured 22,267 paired ROM DMA transactions, 265,996 native exact execution
observations, and 439 effective P1 input transitions. Exact-content interning preserved every event
occurrence while avoiding 17,461,584 duplicate payload bytes.

An isolated candidate built from the two accepted sessions plus these two new sessions verifies and
reproduces deterministically. It has not replaced the accepted products.

| Candidate product | Logical SHA-256 | Verification |
|---|---|---|
| Overlay Atlas 2.0 | `1123891AE8F984B656D06E0C0B646272CEF7C64D1096A118DBCCD908E5F1E732` | PASS |
| Runtime Provenance 2.0 | `4A0DC3DB34270EFDF51DB2129E9914EB9605F923709DDC8F4819D5E7DB8EBAFD` | PASS |
| Total Resolver R3 | `0D2AE8AF7ED713A0D50E887B33BDB41A2DBB58CF38BD0D9FD5B1E3984AED393D` | PASS, reproduced by a second build |

The candidate reports 878 of 4,870 static functions placed and 747 observed executing. It retains
290,679 exact content-resolved instruction transitions and leaves 3,568 functions never observed.
These are bounded coverage results for the recorded paths, not completeness or semantic claims.

## Completed behavior

- Exact bridge `0.8.0` handshake and fail-closed compatibility tests.
- Unified emulator-ordered watch/DMA/trace/input stream with epoch and explicit dropped ranges.
- Event-time destination-byte evidence for completed ROM DMA events.
- Lightweight generation-aware execution capture for unique PC/opcode and edge identities, paired
  with exact event-time code-page bytes.
- Exact native instruction transitions propagated into Runtime Provenance with ambiguous function
  endpoints left unset.
- Effective Player 1 controller transitions, with consecutive identical states coalesced.
- Exact per-session content interning that preserves every event occurrence and verifies bytes
  before reusing a SHA-256-indexed blob.
- Observation-only raw recorder with close, recovery, verification, and deterministic replay.
- Region lifetimes, transient placements, Overlay Atlas 2.0, and Runtime Provenance 2.0.
- Compact typed resolver with separate static, placement, runtime, field, and resource lanes.
- Contextual live-address resolution that fails ambiguous without sufficient lifetime context.
- Raw-first event and crash bundles whose enrichment reproduces offline.
- Source identity, coverage conservation, placement arithmetic, and sampled-versus-executed checks.
- Sequence-aware active-region indexing and a bulk accepted nominal-PC/z64 crosswalk keep large
  gameplay derivations linear enough for routine use without weakening contextual mapping checks.

## Demonstrated ambiguity handling

Live address `0x80197B70` is reused by multiple placements. A context-free query reports all
supported candidates and fails ambiguous. In session `20260818T032141.053282Z-9dae1dea`, sequence
`200` selects `func_001ce070`, while sequence `12000` selects `func_0006e660`, because those are the
placements alive at the respective event boundaries.

## Current limits

- Coverage is deliberately incomplete and biased toward the paths actually played.
- The accepted runtime product predates protocol `0.8.0`, so it still has no exact execution hits
  or event-time memory-watch accesses. New capture capability does not retroactively strengthen it.
- The Phase 10 candidate is generated working evidence, not an accepted-source promotion. It has
  no event-time memory-watch accesses and retains 976 runtime and 614 placement unresolved rows.
- Static calls, sampled PCs, residency, exact execution, field candidates, and supported semantic
  names remain different evidence classes.
- Hashes identify bytes and inputs; they do not prove meaning or equivalent behavior.
- Live enrichment is `live-unreviewed` until incorporated into a rebuilt, verified product.
- Code-page generations currently advance on CPU stores and completed PI DMA writes. Other RDRAM
  writers remain a safety-net limitation and must not be silently treated as fully observed.
- Exact content is shared within one session database, not across separate session files. Raw
  sessions are not automatically deleted.

Phase 10 now needs broader ordinary gameplay coverage using the new trace/input stream. Repeating an
unchanged menu stops adding learned instruction/edge coverage, while a new placement, changed
bytes, new edge, or controller transition remains visible. Human labels are optional; the machine
recorder captures bridge transitions without requiring a courtroom-style evidence ritual.
