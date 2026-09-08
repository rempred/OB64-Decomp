# Research intake rollout R1

Implemented generic `match.js intake <symbol>` and fresh research presentation in normal
prepare/watch output and standalone analysis-packet results, including cached packets.
Canonical dossier observations work without importing them into an ignored SQLite store.
Optional store reads use SQLite read-only mode; absent stores are never created and incompatible
schemas are not initialized. No database schema migration was added.

With an authenticated baserom, candidate IDs bind exact source bytes to the current accepted
target. Without the ROM, source/header/preprocessor/reference checks remain useful but rows
are explicitly `reference-only`, with target binding unavailable. Present invalid ROMs retain
authentication failure. Archive observation IDs are opaque provenance, not falsely reconstructed.
Current active-source hashes, historical selected-best annotations and relation verification
are separate fields. Missing, corrupt, stale and mismatched history remain distinct.

Opt-in `import --capture-identities` reduces recording boilerplate: authors provide claims,
tags, relations and path-only references; existing source-policy APIs compute expected identities.
Supplied computed fields reject instead of being silently replaced. The unchanged validated
import/preserve route owns storage and export. See the
[workbench reference](../../MATCHING_WORKBENCH.md#research-intake) for the complete recipe.

Changed files: `tools/lib/matching/intake.js`, shared authentication/capture helpers in
`research.js`, CLI presentation in `tools/match.js`, read-only bridge support in matching
`store.js`/`store.py`, packet return presentation in `tools/analysis_packet/core.js`, focused
tests and suite wiring, and the workbench/packet reference documentation. Parent-owned AGENTS,
workflow and program changes are separate from this implementation.

Validation:

- `node tests/matching_workbench.js`: PASS. Includes 21 intake controls (11.996 s in the
  completed suite), zero KMC invocations, cross-family resource/combat targets, missing store,
  corrupt store, malformed/stale/source/header/preprocessor/target cases, foreign/missing
  relations, and real seven-record W8 archive lookup with no DB and no-ROM reference mode.
  Existing research/probe/group and workbench behavior checks also pass.
- Actual prepare/watch CLI output wiring exercised through narrow dependency spies: history
  survives output summaries; unavailable lookup leaves compiled status/exit unchanged; only
  explicit watch source and existing generator arguments reach compiler/decompiler paths.
- Real `runIntakeRefresh` from `tools/analysis_packet/test.js`: PASS. A fresh packet produced
  both decompiler hypotheses (reported packet preparation 1.247 s). Adding a new authored
  dossier observation after that packet appeared on the next cache hit, with identical cache
  directory/manifest and zero decompiler calls. Authoritative evidence:
  `build/research-intake-rollout-r1/packet-final/intake-vXyKx7/`.
- Real `match.js intake func_001F3C00`: seven valid preserved observations plus two correctly
  stale superseded private store observations. This confirms fresh archival coverage and
  explicit handling of obsolete local evidence rather than quietly accepting it.
- All twenty current W8 input hashes remain equal to the R8 terminal inventory.
  `git diff --check`: PASS. No generated proof or compiler output is tracked.

Implementation changes naturally alter existing tool implementation cache identities once.
Changing observations does not alter immutable packet inputs, raw m2c assembly, generated
artifacts or manifests. Optional discovery errors are caught only at the presentation boundary;
packet/cache/compiler failures retain their existing behavior. Group history is readable without
widening single-member compilation/import/preservation. No matching source, compiler identity,
flags, target model, ownership, linker, source-policy or verifier contracts were changed.
No W8 experiments, runtime, full-ROM verification, branches, commits or pushes were performed.

Measured times above are actual check/packet measurements, not an allocation of reasoning or
reporting time. Overall preparation and interpretation were not separately instrumented.
Ready for independent shared-tool review; all implementation/build/report writes and processes
are released at terminal handback. Parent owns integration and final acceptance.

## Read-only store correction

Independent review found that SQLite `mode=ro` could create WAL/SHM sidecars despite leaving
the main database unchanged. The corrected path holds a Windows read handle denying writes
and deletion, opens SQLite with `mode=ro&immutable=1`, and compares main/sidecar census,
sizes, timestamps and SHA-256 before/after. Existing SHM plus empty/absent WAL is permitted
unchanged; nonempty WAL or rollback journal rejects, as does a concurrent writable handle.
No global sidecars were deleted or modified to obtain a successful result. Unsupported platforms
explicitly report optional-store unavailability rather than silently use an unguarded immutable read.

`node tests/matching_intake.js`: 24 controls pass in 13.370 s, zero KMC calls, plus prepare/watch
output wiring. New controls inspect the full main/sidecar census and hashes for clean databases,
preexisting SHM+empty WAL, nonempty WAL/journal, and concurrent writable handles. The actual
427 MB workbench lookup completed in 6.819 s, retaining seven valid archives and two stale local
observations with store supplementation available. Evidence is in
`build/research-intake-rollout-r1/immutable-cli.json` and `tests-1DYGsA/`.
This focused correction does not alter decompiler/cache behavior; the prior full suite and real
packet cache-refresh results above remain recorded. All twenty protected source inputs remain
unchanged. Corrected tooling/docs/report writes are released for reviewer retest.
