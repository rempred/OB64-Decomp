# Review Handoff: Section A slice 3 data ownership — `0x003E1000..0x00421000` (chunks 62-65) — FALLBACK

Date: 2026-06-24 (run); filename keeps the coordinator slug date `2026-06-23`.

Third data-territory ownership run, using `docs/templates/data-territory-source-ownership-run-prompt.md`.

## ⚠️ FALLBACK SUMMARY (read first)

The run was dispatched as a **10-chunk batch (chunks 62-71, `0x3E1000..0x481000`)**. It **fell back to
4 chunks (62-65, `0x3E1000..0x421000`)** and owned only those. Chunk 66 (`0x421000..0x431000`) contains
a **structured N64 audio sound-bank** whose low-entropy region (min **2.66 bits/2KB @ `0x429800`**, first
`<6.0` at `0x423C00`) trips the prompt's explicit *"sustained low-entropy window below 6.0 bits/2 KiB →
fall back immediately"* rule. Owning it with the flat `data_` template would be wrong — it needs a
focused decode run. **Stopped at the clean chunk boundary `0x421000`.** Ownership of 62-65 is complete,
verified, and committed; chunks 66-71 are deferred.

- **Bridge event used: `agent/error`** (fallback), frontier **`0x00421000`** — *not* `run-complete` with
  the planned `0x481000`, which the run did not reach. This is the honest signal to the coordinator.

## Natural unit & exact ownership range

- Natural unit: survey **Section A** (`0x301000..0x4E3000`). Slices 1 (`0x301000..0x341000`) and 2
  (`0x341000..0x3E1000`) already owned.
- Planned: chunks 62-71 (`0x3E1000..0x481000`). **Owned: chunks 62, 63, 64, 65** (`0x3E1000..0x421000`,
  262,144 B).
- Frontier before: `0x003E1000`. Frontier after: **`0x00421000`** (chunk 66). Planned `0x481000` NOT reached.

## Code/data composition

**32 parts = 18 data + 14 zero_fill, 0 code.** Per chunk: 62 = 5 (3+2), 63 = 5 (3+2), 64 = 7 (4+3),
65 = 15 (8+7). Byte split: **raw-but-classified data 261,836 B · parsed zero_fill 308 B · undecoded
0 B.** Whole-chunk entropy 7.14–7.30; min-2KB-window 6.49–6.97 (uniformly high). Type **UNRESOLVED** —
conservative `data_`/`zero_fill_`.

## Continuations

- Incoming: chunk 61 `data_003DE988` → `data_003E1000` (seamless; seam non-zero both sides `0x62324433`
  / `0x054327F6`).
- Outgoing: `data_00420438` → `0x421000` → continues into chunk 66 (the deferred audio sound-bank).

## Machine-readable index

`docs/data-index/rev0/section-a-003E1000-00421000-data-inventory.json` (data-territory schema +
`fallback`, `audioBankFinding`, `decodedContainerSchema`, `batchSizeFinding`). Validated: parses;
byteSplit sum = subregion contiguity = 262,144 (to `0x421000`); 32 subregions, 0 gaps. Dossier:
`docs/dossiers/section-a-003E1000-00421000-data-ownership.md`.

## 🔊 Major finding — chunk 66 is an N64 audio sound-bank (Section A is likely AUDIO)

Two independent passes (hidden-code + parser) found embedded ASCII magic headers in chunk 66:
**`N64 PtrTablesV2` @ `0x00423FF0`** and **`N64 WaveTables ` @ `0x00429CD0`** — a libultra/n_audio bank
(directory + fixed-stride record table [strides `0xA0`/`0xD0`, 133 records, marker `··02`/`··04`,
monotonic u32-BE offset table @ `0x429820` whose deltas equal the strides, 132/132 mapped] + WaveTables
sample payload; entropy resumes ~7.26 after the magic). The 128 B zero block @ `0x429A34` and the
**519 B zero run @ `0x429AC1`** (the survey-documented *only* ≥256 B zero run in the entire tail) are
bank padding.

**Implication:** strong evidence the whole Section A high-entropy family (slices 1-3) is **AUDIO sample/
bank data, not graphics/texture** — partially resolving the slice-1/2 ambiguity. Kept as **evidence
only**: the magics are in chunk 66, not 62-65, so 62-65 stay owned conservatively (not typed audio).

## Parent tooling inspected — all rejected/none-in-range (`anyAcceptedRomLead = false`)

`ob64_functions.json` (0 in range; last fn ends `0x2B89B4`), `ob64_archive_catalog.json` (first LHA
`0x636784`, 0 in range), `ob64_anim_block_catalog.json` (63 blocks `0x4F0FB0..0x592490`, 0 in range),
`ob64_4a/4f_audit.json`, Section-B table `0x4E3158`. **REJECTED (byte-verified):** 4a in-range
gapOffsets `0x3e4c4c`/`0x440172`/`0x44db22` are decompressed-7MB-stream offsets (extracted blocks
all-zero-leading vs dense ROM; match 0.7–1.4 %, chance); 4f 0 in-range. B-table relative offsets resolve
(base `0x4E3140`) to Section B's *own* payload `0x4E6988..0x4F0D98`, not Section A — rejected. No parent
artifact maps into the chunk-66 audio bank (self-describing via magics only).

## Hidden-MIPS adversarial result

**DATA-ONLY SAFE.** 0 `jr $ra` / 0 prologues / 0 epilogues / 0 `lw $ra` at all 4 byte alignments (+ 0
`jr $ra` at every unaligned offset `0x3E1000..0x431000`), 0 pointer-table runs. Discriminator validated
against control `.text` regions (validFrac 0.99–1.00 vs targets 0.66–0.71). Chunk 66 screened non-code
(audio directory = file-relative offsets, not code addresses). 5-pass swarm unanimous; QA 0 structural
problems.

## Ownership status: `yes` (chunks 62-65 only); fallback endorsed

`0x3E1000..0x421000` is byte-exact tracked as 32 `data_`/`zero_fill_` parts with full provenance, index,
dossier, adversarial proof, exact chunk coverage, caveats. Independent reviewer: **yes**; fallback to 4
chunks **endorsed** (boundary `0x00421000`). Chunks 66-71 deferred.

## Batch-size finding

The 10-chunk default correctly **did not** hold here: the entropy-floor guard caught chunk 66's
structured audio bank and the run fell back to 4 chunks — exactly as the slice-2 recommendation intended
(10 is a *ceiling contingent on flat-signal homogeneity*, not a fixed size). The mechanism works.

## Caveats & unresolved fields

- Chunks 62-65 type unresolved at byte level (likely audio WaveTables payload, but the magics are in
  chunk 66 — kept conservative, NOT typed audio).
- Chunk-66 audio bank internal schema (0x28-byte record header fields, int16-BE coefficient/sample
  encoding) undecoded — deferred.
- Two `data_` parts contain a byte-misaligned 16 B zero coincidence (3 aligned words, below the 4-word
  split threshold) — correctly not split (QA confirmed; keep the aligned-word rule).
- Region parent-tooling-dark; provenance internal-scan-only.

## Recommended next ownership unit

**Focused chunk-66+ AUDIO run** (`0x421000..`): own/decode the N64 sound-bank (`N64 PtrTablesV2` header
+ 133-record directory + `N64 WaveTables ` payload; classify the 519 B zero run as bank padding; resolve
record-header + sample encoding; cross-check parent audio tooling). Small batch (1-2 chunks) until the
schema is resolved; re-enable 10-chunk batches only once signal is flat again.

## Runtime-state & patch-workbench

No runtime states (`RUNTIME_STATE_ONESHOT = none`; request log unchanged). No patch-workbench
(data/asset territory, static-only).

## Verification

```text
JSON parse docs/data-index/rev0/section-a-003E1000-00421000-data-inventory.json   parses; byteSplit=262,144, contiguous to 0x421000, 32 subregions
source-owner coverage 0x3E1000..0x421000                                          32 parts, byte-exact, 0 gaps
node tools/check_boundaries.js (x4 chunks 62-65)                                   BOUNDARY CHECK PASS (0 code, data only)
node tools/check_splits.js (x4 chunks 62-65)                                       0 fragments
node tools/check_manifest.js                                                       ALL CHECKS PASS (66 chunks; 62=5,63=5,64=7,65=15)
node tools/assemble_original_mips.js                                              Exact code-region match: PASS (SHA 40D4E787..B409 unchanged)
node tools/verify_setup.js                                                        PASS (66 composites / 5,842 files / 34 fallback)   [see final report]
node tools/audit_code_region.js                                                   OK (executable extent 0x1000..0x2B89B4 unchanged)
git diff --check                                                                  clean
```

## Commits

- `0b9b550` — `Source-own Rev0 Section A slice 3 chunks 62-65 (0x3E1000..0x421000) [FALLBACK]`
  (32 parts + manifest + index + dossier + current-state docs).
- This review handoff (final commit).

## Review doc path

`docs/REVIEW_2026-06-23_section-a-003E1000-00421000-data-ownership.md`
