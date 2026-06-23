# Rev 0 Patch-Workbench Backfill Review - 2026-06-23

## Summary

Completed the one-shot lightweight patch-workbench backfill for already source-owned Rev 0 chunks 0-27
(`0x00001000..0x001C1000`). No chunk 28 source-ownership work was started.

Primary artifact:

- `docs/patch-workbench/rev0/patch-workbench-backfill-2026-06-23.json`

## Scope Covered

- Completed chunks: 0-27.
- Completed range: `0x00001000..0x001C1000`.
- Current source mix: 28 tracked composite chunks, 3,344 tracked source files, 72 generated fallback chunks.
- Coverage remains 1,835,008 source-owned bytes, 64.4042%; code-only 1,514,224 bytes, 53.1455%.
- Normal next frontier remains chunk 28, `0x001C1000..0x001D1000`; first action is
  `func_001C0FC8_chunk28tail`.

## Backfilled Harvest

The JSON records behavior tags, hook-site candidates/proven/rejected entries, data/free-space classifications,
runtime-state requests, provenance, and caveats. Static-only findings are not marked proven.

Counts in the artifact:

- Behavior tags: 6.
- Hook sites: 8 total; 4 proven, 1 candidate, 1 needs-runtime, 2 rejected.
- Data/free-space entries: 5 total; 2 proven, 2 candidate, 1 rejected.
- Runtime-state requests: 5 unresolved.
- Explicit rejected entries: 4.

Highlights:

- Squads record-builder hook at Rev 0 z64 `0x00195584` is recorded as proven, with displaced words
  `0x2EA2001E` / `0x38420001` and likely resume `0x0019558C`.
- Chaos Frame / Army Management hook at z64 `0x00023F7C` is recorded as proven, preserving the delay-slot
  word at `0x00023F80`; bootstrap lane `0x00034E78..0x00034EE8` is classified as a proven cave.
- High Attack streamsplit is recorded as in-scope only for the bootstrap cave at `0x00034F00`; primary behavior
  hooks are outside chunks 0-27 and remain candidate/needs-runtime.
- Tail padding `0x0275DD40..0x02800000` is recorded as candidate runtime-lane storage with explicit collision
  caveats. Raw tail data `0x0275415B..0x0275DD40` is rejected as free space.

## Cleanup Applied

Confirmed the last run's concrete issues were already fixed by the chunk 27/review commits: duplicate chunk
preamble labels in the previous pass, manifest hash/textBytes drift, stale chunk 27 data-index zero-fill range,
stale raw-control-byte wording, and stale frontier docs.

Additional minimal cleanup from this audit:

- Updated stale coverage wording in `AGENTS.md`.
- Added patch-workbench-backfill prerequisite references to `docs/NEXT_STEPS.md`.
- Updated `docs/PLATFORM.md` to include chunk 26/27 dossiers and remove stale chunk-history wording.
- Marked the chunk 26 dossier's chunk 27 frontier note as historical.
- Rewrote two garbled chunk 27 straddler prose fields in `docs/data-index/rev0/chunk27-data-region-inventory.json`.
- Removed the duplicate same-address `func_001C0FC8:` label from the current frontier source owner and refreshed
  its manifest entry.

## Caveats

- The backfill avoids manifest-only patch classification because the current manifest does not persist
  `kind`/straddler metadata. A future automation pass should extend the manifest schema before relying on it
  as a patch harvester source.
- Same-file duplicate labels remain elsewhere; only the active frontier duplicate was cleaned here.
- `euler_to_matrix_full` straddler headers and clustered multi-entry files remain broader source-indexing hazards,
  not blockers for this lightweight artifact.
- Overlay/RAM address-space claims still require runtime-state proof. Do not infer patch safety from decode-column
  RAM comments alone.

## Verification

Planned and run after edits:

- Parse all `docs/patch-workbench/rev0/*.json`.
- Parse touched data-index JSON.
- `node tools/check_manifest.js`.
- `node tools/check_splits.js --splits build/chunk_001B1000-001C1000_splits.json --disasm build/original-mips/rev0/code_001B1000_001C1000.s`.
- `node tools/check_boundaries.js --splits build/chunk_001B1000-001C1000_splits.json --disasm build/original-mips/rev0/code_001B1000_001C1000.s`.
- `git diff --check`.
- `git status --short --branch`.

No full rebuild/runtime verification was required because source bytes, splits, and manifests were not behaviorally
changed; the only source-owner change removed a duplicate label and refreshed manifest text metadata.
