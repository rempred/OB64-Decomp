# Review Handoff: Section A slice 2 data ownership — `0x00341000..0x003E1000` (chunks 52-61)

Date: 2026-06-24 (run); filename keeps the coordinator-assigned `2026-06-23` slug.

Second data-territory ownership run after the one-shot survey, using
`docs/templates/data-territory-source-ownership-run-prompt.md`. Owns the second slice of the survey's
natural unit **Section A** (high-entropy asset pool `0x301000..0x4E3000`). First run to use a **10-chunk
batch** (vs the 4-chunk slice 1).

## Natural unit & exact ownership range

- Natural unit: survey **Section A** (`0x00301000..0x004E3000`, 1,974,272 B). This run owns the second
  slice; slice 1 (`0x301000..0x341000`, chunks 48-51) was already owned.
- Ownership range: **`0x00341000..0x003E1000`** = 655,360 B (ten 64 KiB chunks).
- Chunk coverage: **chunks 52, 53, 54, 55, 56, 57, 58, 59, 60, 61** (full).
- Frontier before: `0x00341000`. Frontier after: **`0x003E1000`** (chunk 62).

## Known issues checked

- No blocking known issue from slice 1. Preserved its caveats: type unresolved; 4a/4f offsets are
  decompressed-stream (not ROM); B-table-to-A rejected. Slice 1 was **not** retroactively renamed (no
  slice-2 evidence resolves the type).
- The `docs/WORKFLOW.md` line-broken stale-fallback fix from slice 1 remains intact (now correctly `38`).
- Opening checks: repo clean on `main` at frontier `0x00341000`; docs consistent. No stale frontier.

## Code/data composition

**64 parts = 37 data + 27 zero_fill, 0 code.** Per chunk: 52 = 13 (7+6), 53 = 9 (5+4), 54 = 9 (5+4),
55 = 9 (5+4), 56 = 7 (4+3), 57 = 1 (1+0, single 64 KiB blob), 58 = 5 (3+2), 59 = 3 (2+1), 60 = 3 (2+1),
61 = 5 (3+2). Byte split: **raw-but-classified data 654,812 B · parsed zero_fill 548 B · undecoded
0 B.** Type **UNRESOLVED** (graphics/texture vs audio-codec-residual) — conservative `data_`/`zero_fill_`
names, status `raw-but-classified`.

## Continuations

- Incoming: chunk 51 `data_0033FD78` → `data_00341000` (seamless; seam at `0x341000` non-zero both
  sides — before `0xEDDEDACE`, after `0x62AF2102`).
- Outgoing: `data_003DE988` runs to `0x3E1000` (no terminating zero-fill) → continues into chunk 62
  (Section A slice 3).

## Machine-readable index

`docs/data-index/rev0/section-a-00341000-003E1000-data-inventory.json` (data-territory template schema +
`decodedContainerSchema`, `adversarialVerification`, `batchSizeFinding`). Validated: parses; byteSplit
sum = subregion contiguity = 655,360 (to `0x3E1000`); 64 subregions, 0 gaps. Dossier:
`docs/dossiers/section-a-00341000-003E1000-data-ownership.md`.

## Parent tooling inspected — all rejected/none-in-range (`anyAcceptedRomLead = false`)

Inspected (exact paths): `scripts/ob64_functions.json` (0 functions in range; last real fn ends
`0x2B89B4`; lone `0x594A9C` is `valid=false` masked-data noise), `scripts/ob64_archive_catalog.json`
(825 entries, first LHA `0x636784`, 0 in range), `scripts/ob64_anim_block_catalog.json` (63 blocks
`0x4F0FB0..0x592490`, 0 in range), `scripts/ob64_4a_audit.json` / `ob64_4f_audit.json`, the Section-B
index table at ROM `0x4E3158`.

- **No accepted in-range ROM lead** — the region is **parent-tooling-dark**; provenance is
  internal-scan-derived only.
- **REJECTED (byte-verified):** 4a/4f in-range-looking `gapOffset`s are decompressed-7MB-LZSS-stream
  offsets (source `ob64_7mb_blocks/`, max `0x6BA170`/`0x6DAE24`), NOT ROM. Disproof: stream
  `block_3126_0x341e44` = `e6f70000…` vs raw ROM `0x341E44` = `dcbd53ae…` (no match).
- **B-table-to-A hypothesis: re-tested + REJECTED for this slice** — `0x4E3158` table (1798 ×
  `[u32-BE offset 0x3848..0xDC58][u32-BE 0x64]`) yields **0 in-range records under all four mandated
  bases** (absolute / table-relative / section-B-tail / `0x301000`-relative). Only an unmandated
  `+0x341000` self-base hits, provably coincidental (arbitrary `+0x351000` also maps all 1798; one
  contiguous ~41 KB blob; 6.4 % coverage; no byte-verified justification).

## Parser/schema result — container decoded, contents undecoded

No compression magic (0 MIO0/Yay0/Yaz0/LHA/FORM/gzip), no F3DEX2 display list (0 `G_ENDDL`), no fixed
texture row stride (autocorrelation weak <0.29 at irregular lags), no uncompressed TLUT/palette
(0 windows < 6.0 bits/byte over 8 KB), VADPCM rejected (16/16 distinct predictor indices), raw PCM weak.
**Decoded container layout:** 37 discrete asset objects + 27 zero-fill pads (4–7 words); all 27 post-pad
boundaries 8-byte aligned but never 16-byte aligned (`end & 0xF == 8`). Heterogeneity: lag-1 byte
correlation rises ~0.01→0.29 toward the tail (chunks 59–61 measurably smoother); chunk 57's byte
histogram skews to a compressed/encoded asset-stream signature. Conservative names retained.

## Hidden-MIPS adversarial result

**DATA-ONLY SAFE.** 0 `jr $ra`, 0 stack prologues AND 0 epilogues / 0 `lw $ra` restores at **all four
byte alignments**, 0 pointer-table runs (RAM-range word density 0.056–0.07 %, below ~0.195 % random),
0 archive magic, **0 real strings** (strict ≥4-letter dictionary test = 0 hits across 320 KiB; elevated
printable counts in chunks 59–61 are garbage). Common-opcode density 33–50 % (real MIPS > 85 %); JAL
distinct/count ≈ 1.0 (no call-graph reuse). 6-pass adversarial swarm (2 hidden-code halves + parent +
parser + boundary QA + independent reviewer): **unanimous, 0 problems.** The 11,833 "in-range branch
targets" hiddenB measured were adjudicated coincidental (~random baseline, no coherent control flow). No
chunk-fallback/mixed pass needed.

## Ownership status: `yes` (this slice only)

`0x341000..0x3E1000` is byte-exact tracked as 64 `data_`/`zero_fill_` parts under
`asm/original/rev0/lib/`, with per-part provenance, the index, the dossier, recorded adversarial
hidden-code proof (independently re-derived from the baserom at all 4 byte alignments), exact chunk
coverage, and confidence/caveats. **Only chunks 52-61 are owned** — the rest of Section A (to `0x4E3000`)
is NOT yet owned.

## Batch-size finding (10-chunk experiment)

The 10-chunk batch did **not** degrade review quality versus the 4-chunk slice 1, because this is
homogeneous high-entropy asset data with a machine-checkable ownership standard (contiguity math,
all-alignment code scan, zero-run set-equality, entropy floor) that scales O(bytes). **Recommendation:
10 chunks is the safe ceiling** for proven-clean, parent-tooling-dark, flat-signal data-only Section A
runs; **drop back to 4** the moment any chunk shows heterogeneity needing per-object reasoning (a real
compression magic, a sustained low-entropy window < 6.0 bits/2 KB, a pointer/jump-table run ≥ 4, a
meaningful ASCII/symbol run, or any `jr $ra`/prologue hit).

## Caveats & unresolved fields

- Section A type (graphics/texture vs audio-codec-residual) unresolved — kept conservative.
- Object contents undecoded; whether compressed (no standard magic) or raw is unknown.
- Provenance internal-scan-only (parent-tooling-dark); revisit names if a future artifact maps in-range.
- The 8-aligned-never-16 boundary rule is a container-layout invariant, not a decoded record stride.

## Recommended next ownership unit

**Section A slice 3** — chunks 62+ (`0x3E1000..`), continuing `data_003DE988`, via the data-territory
template. Still inside Section A (to `0x4E3000`). A 10-chunk batch (62-71) is acceptable while the signal
stays flat; the A/B boundary near `0x4E3000` is where the texture-vs-audio type may finally resolve.

## Runtime-state & patch-workbench

No runtime states used; `RUNTIME_STATE_ONESHOT = none`; `docs/runtime-state-requests.md` unchanged.
No patch-workbench (data/asset territory, not patch space; static-only).

## Verification

```text
JSON parse docs/data-index/rev0/section-a-00341000-003E1000-data-inventory.json   parses; byteSplit=655,360, contiguous to 0x3E1000, 64 subregions
source-owner coverage 0x341000..0x3E1000                                          64 parts, byte-exact, 0 gaps
node tools/check_boundaries.js (x10 chunks)                                        BOUNDARY CHECK PASS (0 code, data only)
node tools/check_splits.js (x10 chunks)                                            0 fragments
node tools/check_manifest.js                                                       ALL CHECKS PASS (62 chunks; 52=13,53=9,54=9,55=9,56=7,57=1,58=5,59=3,60=3,61=5)
node tools/assemble_original_mips.js                                              Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                        PASS (62 composites / 5,810 files / 38 fallback; all sub-checks PASS)
node tools/audit_code_region.js                                                   OK (executable extent 0x1000..0x2B89B4 unchanged; tail data-evidenced)
git diff --check                                                                  clean (exit 0)
```

## Commits

- `8d6a1f5` — `Source-own Rev0 Section A slice 2 (chunks 52-61, 0x341000..0x3E1000)` (64 parts +
  manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-23_section-a-00341000-003E1000-data-ownership.md`
