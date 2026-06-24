# Review Handoff: Section A slice 1 data ownership — `0x00301000..0x00341000` (chunks 48-51)

Date: 2026-06-23

First data-territory **ownership** run after the one-shot survey, using
`docs/templates/data-territory-source-ownership-run-prompt.md`. Owns the first slice of the survey's
natural unit **Section A** (high-entropy asset pool `0x301000..0x4E3000`).

## Natural unit & exact ownership range

- Natural unit: survey **Section A** (`0x00301000..0x004E3000`, 1,974,272 B). This run owns only the
  first slice.
- Ownership range: **`0x00301000..0x00341000`** = 262,144 B.
- Chunk coverage: **chunks 48, 49, 50, 51** (full).
- Frontier before: `0x00301000`. Frontier after: **`0x00341000`** (chunk 52).

## Known issues checked

- chunks45-47 review final-commit placeholder: already fixed → `e42eae7` (opening fix `b9ba728`);
  re-verified present. Coordinator template commit `cde60d2` (parent offset-space caveat) is in place
  and was applied (4a/4f stream-offset rejection used below).
- The survey changed only docs/indexes (no rebuild needed); THIS run changed source-owner/manifest
  files, so the full rebuild/manifest verification WAS run (below).
- Section A type left unresolved (not over-named); the B-table-to-A hypothesis was tested read-only
  and rejected for this slice.
- Also fixed a pre-existing stale current-state value: `docs/WORKFLOW.md` had a line-broken
  `plus 55 generated fallback` (prior advancers missed it across the line break) → corrected to `48`.

## Code/data composition

**46 parts = 25 data + 21 zero_fill, 0 code.** Per chunk: 48 = 9 (5+4), 49 = 11 (6+5), 50 = 13 (7+6),
51 = 13 (7+6). Byte split: **raw-but-classified data 261,708 B · parsed zero_fill 436 B · undecoded
0 B.** Type **UNRESOLVED** (graphics/texture vs audio-codec-residual per the survey) — conservative
`data_`/`zero_fill_` names, status `raw-but-classified`.

## Continuations

- Incoming: chunk 47 `data_003002E8` → `data_00301000` (seamless; 32 B before `0x301000` are non-zero
  high-entropy, no zero gap).
- Outgoing: `data_0033FD78` runs to `0x341000` (no terminating zero-fill) → continues into chunk 52
  (Section A slice 2).

## Machine-readable index

`docs/data-index/rev0/section-a-00301000-00341000-data-inventory.json` (data-territory template
schema: dataUnit/romRange/chunkCoverage/frontierBefore/After/sourceOwners/subregions[46]/typeFamily/
status/confidence/parser-dumper-catalog-editor-modder-runtime-evidence/hiddenCodeRisk/decodedRecords/
unresolvedFields/bTableToAHypothesis/rejectedLeads/ownershipAssessment/recommendedFollowups).
Validated: parses; byteSplit sum = subregion contiguity = 262,144 (to `0x341000`). Dossier:
`docs/dossiers/section-a-00301000-00341000-data-ownership.md`.

## Parent tooling inspected — matches & rejected leads

Inspected (exact paths): `scripts/ob64_functions.json` (0 valid functions in range),
`scripts/ob64_archive_catalog.json` (0 archive entries; first LHA `0x636784`),
`scripts/ob64_anim_block_catalog.json` (all 63 blocks `>= 0x4F0FB0`, none in range),
`scripts/ob64_4a_audit.json` / `ob64_4f_audit.json`, the Section-B index table at ROM `0x4E3158`, and
the local survey/chunk-43..47 indexes & dossiers.

- **No accepted in-range ROM lead** classifies `0x301000..0x341000` — it is opaque high-entropy asset
  data with no parser/dumper/catalog/editor evidence.
- **REJECTED**: `ob64_4a/4f_audit` in-range-looking gapOffsets (16 + 6, e.g. `0x3016b4`, `0x332cde`)
  are decompressed-7MB-LZSS-stream offsets, NOT ROM offsets (audit max ~`0x6dae24`; byte-verified:
  ROM at `0x332cde` is not a valid F3DEX2 display list).
- **B-table-to-A hypothesis: byte-tested + REJECTED for this slice** — the `0x4E3158` table (1798 ×
  `[u32-BE offset 0x3848..0xDC58][u32-BE 0x64]`) doesn't classify chunks 48-51 under any plausible
  base; the only arithmetic-in-slice base (`0x301000`) yields no record structure (coincidence).
- `.s` fallback decode comments (RAM column / mnemonics) = invalid linear back-map on data, ignored.

## Hidden-MIPS adversarial result

**DATA-ONLY SAFE.** 0 `jr $ra`, 0 stack prologues, 0 `0x80xxxxxx` pointer-table runs, 0 archive magic,
no real strings — across all 65,536 words, by a deterministic lead scan + 2 independent adversary
passes. The 4-pass adversarial swarm (2 hidden-code region + tiling QA + parent comparator) returned
**all clean** (2 benign tiling-QA labeling notes only). No chunk-fallback/mixed pass needed.

## Ownership status: `yes` (this slice only)

`0x301000..0x341000` is byte-exact tracked as 46 `data_`/`zero_fill_` parts under
`asm/original/rev0/lib/`, with per-part provenance, the index, this dossier, recorded adversarial
hidden-code proof, exact chunk coverage, and confidence/caveats. **Only this 4-chunk slice is owned**
— the rest of Section A (to `0x4E3000`) is NOT yet owned.

## Caveats & unresolved fields

- Section A type (graphics/texture vs audio-codec-residual) unresolved — kept conservative.
- Whether the data is compressed/encoded (entropy ~7.0–7.3) or raw is unknown.
- Full Section A type resolution deferred (a later slice / the A/B boundary may decide).

## Recommended next ownership unit

**Section A slice 2** — chunk 52+ (`0x341000..`), continuing `data_0033FD78`, via the data-territory
template. Still inside Section A (to `0x4E3000`). Optionally a coordinator may run a 4-chunk slice
(52-55) per the proven data-only-tail default.

## Runtime-state & patch-workbench

No runtime states used; `RUNTIME_STATE_ONESHOT = none`; `docs/runtime-state-requests.md` unchanged.
No patch-workbench (data/asset territory, not patch space; static-only).

## Verification

```text
JSON parse docs/data-index/rev0/section-a-00301000-00341000-data-inventory.json   parses; byteSplit=262,144, contiguous to 0x341000
source-owner coverage 0x301000..0x341000                                          46 parts, byte-exact, 0 gaps
node tools/check_manifest.js                                                       ALL CHECKS PASS (chunk 48=9,49=11,50=13,51=13; 52 chunks)
node tools/check_boundaries.js (x4 chunks)                                         PASS (0 code, data only)
node tools/check_splits.js (x4 chunks)                                             0 fragments
node tools/assemble_original_mips.js                                              Exact code-region match: PASS (SHA 40D4E787..B409)
node tools/verify_setup.js                                                        PASS (52 composites / 5,746 files / 48 fallback)
node tools/audit_code_region.js                                                   OK (executable extent unchanged)
git diff --check                                                                  clean
```

## Commits

- `19a96f6` — `Source-own Rev0 Section A slice 1 (chunks 48-51, 0x301000..0x341000)` (46 parts +
  manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-23_section-a-00301000-00341000-data-ownership.md`
