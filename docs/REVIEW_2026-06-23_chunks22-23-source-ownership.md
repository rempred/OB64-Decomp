# Review Handoff: 2026-06-23 Chunks 22–23 Source-Ownership (`0x00161000..0x00181000`)

Self-contained handoff for a fresh reviewer. Static/offline; exact byte-for-byte rebuild
preserved. Per-byte detail: `docs/dossiers/lib-chunk22-161000-171000.md`,
`docs/dossiers/lib-chunk23-171000-181000.md`.

## 1. Title
Review Handoff — Chunks 22 & 23 Source-Ownership, ROM z64 `0x00161000..0x00181000`,
run date 2026-06-23.

## 2. TL;DR
- **Completed:** chunk 22 (`0x161000..0x171000`, MIXED — UI/text + weapon-type/terrain resource
  data wrapping FP-heavy menu/item/legion code) + chunk 23 (`0x171000..0x181000`, MIXED, 6
  regions — scenario/camera + char-data code interleaved with two large data islands), plus one
  opening doc fix.
- **Both chunks are source-owned as code/data parts** (not "fully split into functions").
- **Chunk 22:** **99 parts** = 35 code + 64 data. Begins AND ends in DATA (incoming + outgoing
  DATA straddlers).
- **Chunk 23:** **73 parts** = 40 code + 33 data. Ends in a CODE (FUNCTION) straddler-head.
- **Tracked source files:** 2,800 → 2,899 (chunk 22) → **2,972** (chunk 23), +172.
- **Generated fallback chunks:** 78 → 77 → **76**.
- **Source-owned bytes:** chunks 0–23 = `0x1000..0x181000` = **1,572,864 B = 55.2036 %** of the
  2,849,204-byte evidenced executable extent.
- **Code-only classified:** **1,287,268 B (45.1799 %)** (chunk 22 +39,888 code / +25,648 data;
  chunk 23 +38,080 code / +27,456 data).
- **Exact rebuild preserved:** YES — code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A`, both
  unchanged.
- **Current frontier:** `0x00181000` (chunk 24). Working tree clean.
- **Tooling:** no new tools; reused `tools/decode_rodata_strings.js` for the ASCII pools and the
  gitignored `build/combine_chunk.js`/`scan_chunk.js` helpers.

## 3. Commits (this run, newest first)
| Hash | Category | Purpose |
|---|---|---|
| `_(this doc's commit)_` | review handoff | Add chunks 22–23 review handoff (this file) |
| `ff8871e` | source + docs | Source-own chunk 23 (73 parts, MIXED 6-region); dossier `lib-chunk23` + data-index inventory + decoded help-message export + doc updates |
| `fefc199` | source + docs | Source-own chunk 22 (99 parts, MIXED); dossier `lib-chunk22` + data-index inventory + 3 decoded string-pool exports + doc updates |
| `52c113d` | opening fix | Chunks 20–21 review nit: real commit hash `887b444` for the review-handoff own-row (replaced the `_(this doc's commit)_` placeholder) |

## 4. Opening Fix (commit `52c113d`)
1. **`docs/REVIEW_2026-06-23_chunks20-21-source-ownership.md`** — replaced the commit-table
   placeholder `_(this doc's commit)_` with the real hash **`887b444`** (the review's own
   handoff commit).
2. **Verified (no edit needed):** the chunks-18-19 review row already uses the real hash
   `e1b54b1`; AGENTS/DECOMP_LOG/NEXT_STEPS/PLATFORM/WORKFLOW were already consistent at the
   chunk-21-done state (22 chunks / 2,800 files / 78 fallback / frontier `0x00161000`); no data
   file carries "True entry"/"read-before-write preamble"/function wording; no root scratch
   tracked; prior review own-rows use real hashes.

## 5. Work Completed

### Chunk 22 (`0x161000..0x171000`), MIXED — 99 parts (35 code + 64 data)
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| DATA leading (incl. incoming straddler-tail) | `0x161000..0x165FC0` | 20,416 | data | 54 |
| CODE (FP-heavy menu/item/legion) | `0x165FC0..0x16FB90` | 39,888 | code | 35 |
| DATA trailing (incl. outgoing straddler-head) | `0x16FB90..0x171000` | 5,232 | data | 10 |
- Incoming DATA straddler-tail `data_00161000_chunk22tail [0x161000,0x161388)` (chunk-21
  packed-byte continuation, ends at the `0x00110000` alphabet break). CODE entry
  `func_00165FC0` is a preamble-orphan (DATA→CODE at the `lui/lw $v1` read-before-write pair);
  `func_0016A56C` is a **lower-confidence** preamble fold (body reloads `$a0` at `0x16A600` —
  recorded honestly). Outgoing DATA straddler-head `data_001708C8_chunk22head [0x1708C8,
  0x171000)` (`0xF83E`-family packed halfwords) → chunk 23.
- **Decoded ASCII pools:** weapon/armor **type-name table** `rodata_00163FC0 [0x163FC0,
  0x1641C4)` (Sword…Garment, embedded `\x0E/\x10/\x0F` codes); **terrain + battle/legion/item UI
  message pool** `rodata_001650A0 [0x1650A0,0x165BD4)` (2,868 B); `{Cn}` color tokens; stat-label
  abbreviations + confirmation prompts in the trailing region.

### Chunk 23 (`0x171000..0x181000`), MIXED — 73 parts (40 code + 33 data), 6 regions
| Region | Range | Bytes | Class | Parts |
|---|---|---:|---|---:|
| DATA leading (incl. incoming straddler-tail) | `0x171000..0x171EA0` | 3,744 | data | 8 |
| CODE 1 (scenario/camera) | `0x171EA0..0x175F28` | 16,520 | code | 22 (+1 inline data) |
| DATA island 1 | `0x175F28..0x177ED0` | 8,104 | data | 10 |
| CODE 2 (char-data/promotion) | `0x177ED0..0x17BCD0` | 15,872 | code | 14 |
| DATA island 2 (largest) | `0x17BCD0..0x17F9C0` | 15,600 | data | 14 |
| CODE 3 (+ outgoing function straddler) | `0x17F9C0..0x181000` | 5,696 | code | 4 |
- Incoming DATA straddler-tail `data_00171000_chunk23tail [0x171000,0x171C48)` (chunk-22
  `0xF83E` continuation). Camera-transition LEADS (names kept conservative): `func_00173D50`
  (begin), `func_001742D0` (stepSetup). DATA island 1 holds a 408-byte tutorial help-message
  (`rodata_001779A0`). Outgoing **FUNCTION** straddler-head `func_0017FF4C [0x17FF4C,0x181000)`
  (preamble at `0x17FF4C` → prologue `0x17FF54`; 0 `jr $ra` to `0x181000`) → chunk 24.

## 6. Parent DB / Overlay Contradictions & Corrections
- **HEADLINE (chunk 23): the parent functions DB mislabels two DATA islands as functions.** It
  lists ~35 "functions" across `[0x171EA0,0x181000]`, but `0x175F28..0x177ED0` (8,104 B) and
  `0x17BCD0..0x17F9C0` (15,600 B) contain **0 `addiu $sp,-N` prologues and 0 `jr $ra`** — proven
  by an independent byte-exact scan AND by two adversarial data-island verifiers each scanning
  every word. The parent `func_00177D20` is a `0x80218D00` pointer run (false positive),
  correctly absorbed into `table_00177B44`. All code/data boundaries here are pinned from
  byte-exact returns/prologues, never the DB.
- **Address-space correction (both chunks):** symbols_v2 `ram` (`0x801d5xxx`) is the WRONG
  linear back-map; real runtime slots are the `0x8021xxxx` band (scenario-state overlay) — trust
  `runtime_ram_primary`. Classifier role tags NOT adopted (names stay `func_*`); the
  camera-transition and growth-table-consumer identities recorded as LEADS only.
- **ASCII content correction (chunk 22):** the parent guessed a "weapon-name table" at
  `0x1650A0`; the byte-exact decode proves that pool is **terrain names + battle/legion/item UI
  messages**. The actual weapon/armor **type**-name table is the smaller block at
  `0x163FC0..0x1641C4`.
- **Chunk 22 adversarial (6 agents, all CLEAN):** fixes were 1 kind correction
  (`func_0016C8B8` frameless-leaf→prologue — it is framed), 1 rodata-seam merge (weapon-type
  table spanning the `0x164000` swarm seam), and 4 note-accuracy nits (`data_001614B8` first
  word `0xE000EE0E`; `data_00161388` +1 trailing zero word; `table_001641C4` 20 not 21 pointers;
  `float_00165E00` first double 8.0833 not 8.16667, recomputed).
- **Chunk 23 adversarial (6 agents, 4 CLEAN + 2 low fixes):** `func_0017FA04`
  frameless-leaf→prologue (framed `-0x48`, saves `$ra/$s0-$s3`); `zero_fill_00177918` split into
  `zero_fill_00177918` + `data_00177928` (0x15-band index, 88 B) + `zero_fill_00177980`. Both
  data-island verifiers + both adjacent code verifiers independently confirmed 0 prologues/0
  returns in the islands.
- **Overlay invariants:** `jr $reg`/`jr $v0` are jump-table dispatches into relocated
  `0x801A…/0x801F…/0x8021…/0x8022…` tables (NOT boundaries); `j 0x801/0x802xxxxx` are overlay
  tail-jumps. FP instructions are CODE (the FP-heavy menu/camera bodies are code, not data).

## 7. Straddler Refinements
- **Chunk 21 → 22:** `data_0015FDF8_chunk21head` continues as `data_00161000_chunk22tail
  [0x161000,0x161388)` (packed small-byte stream; ends at `0x00110000` alphabet break).
- **Chunk 22 → 23:** `data_001708C8_chunk22head [0x1708C8,0x171000)` (`0xF83E`-family packed
  halfwords, no terminator) continues as `data_00171000_chunk23tail [0x171000,0x171C48)` (ends
  at two zero words before a float64 pool). **DATA** straddler.
- **Chunk 23 → 24:** **`func_0017FF4C [0x17FF4C,0x181000)`** — a CODE (FUNCTION) straddler-head:
  the read-before-write preamble (`lui/lbu $v0,0x8022` @`0x17FF4C`) and `addiu $sp,-0x88`
  prologue (`0x17FF54`) are in chunk 23; 0 `jr $ra` in `[0x17FF4C,0x181000)`; continues into
  chunk 24 (parent end `0x181118`, combat_transition). **Chunk-24 first action: emit the tail of
  `func_0017FF4C` and confirm its `jr $ra`.** (This revised the pre-analysis note that placed
  the straddler at `0x17FF54`.)

## 8. Data Classification & Decode/Export Outputs (Data Territory)
- **Chunk 22 — 25,648 B in 64 parts** (`docs/data-index/rev0/chunk22-data-region-inventory.json`).
  By class: packed/unknown 20,540 B · ASCII strings 3,620 B · RAM-pointer tables 792 B ·
  zero-fill 600 B · IEEE-754 const 96 B. **Parsed:** ASCII pools (decoded byte-exactly), pointer
  tables, float pools. **Raw-but-classified:** packed/bitmap/high-entropy blobs (possibly
  compressed/graphics). **Undecoded:** the packed blob contents (no structure evident).
- **Chunk 23 — 27,456 B in 33 parts** (`docs/data-index/rev0/chunk23-data-region-inventory.json`).
  By class: packed/unknown 25,408 B · RAM-pointer tables 1,132 B · ASCII strings 432 B ·
  IEEE-754 const 384 B · zero-fill 100 B. **Parsed:** the 408-byte help-message, float64 pools,
  pointer tables. **Raw-but-classified:** island-2 packed/high-entropy (possibly compressed).
  **Undecoded:** island-2 blob contents.
- **Index files added (2):** `chunk22-data-region-inventory.json`,
  `chunk23-data-region-inventory.json`; **plus string-pool indexes (4):**
  `chunk22-equipment-type-name-table.json`, `chunk22-ui-string-pool.json`,
  `chunk22-trailing-ui-strings.json`, `chunk23-help-message-text.json`.
- **Human-readable exports added (4):** `data/decoded/rev0/strings/chunk22-equipment-type-name-table.md`,
  `chunk22-ui-string-pool.md`, `chunk22-trailing-ui-strings.md`, `chunk23-help-message-text.md`.
  All derive byte-exactly from the disasm (control codes preserved, not normalized).
- **Format families found:** ASCII name/message pools (with `\x0E/\x10/\x0F` and `\x81\x97`
  control codes); RAM-pointer tables (`0x801F/0x8020/0x8021` bands); IEEE float32/float64 const
  pools; GBI/RDP display-list data; packed-halfword/bitmap streams; high-entropy/possibly-
  compressed blobs; `{Cn}` color tokens.
- **Total data bytes source-owned this run:** 53,104 (25,648 + 27,456). **Exact next frontier:**
  the CODE straddler `func_0017FF4C` at `0x181000` (chunk 24).

## 9. Tooling Changes
- **None added.** Reused `tools/decode_rodata_strings.js` (ASCII pools) and the gitignored build
  helpers `build/combine_chunk.js`, `build/scan_chunk.js`, `build/wf_chunk2{2,3}_analyze.js`,
  `build/wf_chunk2{2,3}_adversarial.js`. `node --check` on all tracked tools: clean.

## 10. Verification (commands + key output)
- `node tools/check_manifest.js` → **ALL CHECKS PASS** (24 chunks, 2,972 parts).
- `node tools/check_boundaries.js --splits build/chunk_00161000-00171000_splits.json …` → **PASS** (99 parts; 0 of each).
- `node tools/check_boundaries.js --splits build/chunk_00171000-00181000_splits.json …` → **PASS** (73 parts; 0 of each).
- `node tools/check_splits.js …` (both chunks) → 0 true fragments (the small files — `func_0016D698`, `func_00171F10` — are real `lui/jr$ra/lbu` accessor leaves).
- Adversarial: chunk 22 → 6 verifiers all CLEAN (1 kind + 1 merge + 4 note nits); chunk 23 → 6 verifiers, 4 CLEAN + 2 low fixes; both data islands confirmed 0 prologues/returns.
- Every byte `0x161000..0x181000` assigned to a tracked code/data part (no gaps/overlaps).
- `node tools/rebuild_from_source_manifest.js` → **Exact byte match: PASS** (ROM SHA `571E8339…CC67A`).
- `node tools/assemble_original_mips.js` → **Exact code-region match: PASS**, code SHA `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- `node tools/verify_setup.js` → **PASS**: 24 tracked composite chunks, **2,972** tracked files, **76** fallback; ROM SHA `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- `node tools/audit_code_region.js` → `no-credible-code-edge-into-tail` (executable extent unchanged).
- 0 data files with function/true-entry wording; 0 root scratch tracked; all
  `docs/data-index/rev0/*.json` parse; the ASCII decodes derive from the disasm bytes.
- `git diff --check` → clean.

Summary numbers: **tracked chunks 24 · tracked files 2,972 · fallback 76 · code SHA
`40D4E787…B409` · ROM SHA `571E8339…CC67A` · frontier `0x00181000`.**

## 11. Files Changed
- **Source `.s` (added):** 99 (chunk 22: 35 code + 64 data) + 73 (chunk 23: 40 code + 33 data)
  = 172 under `asm/original/rev0/lib/`. **Removed:** temp whole-chunk `code_00161000_…s` /
  `code_00171000_…s` (`--remove-source`).
- **Manifest:** chunk count 22→24, total parts 2,800→2,972.
- **Tools:** none.
- **Data indexes:** 6 new under `docs/data-index/rev0/` (chunk22 inventory + 3 string indexes;
  chunk23 inventory + 1 help-message index).
- **Decoded exports:** 4 new under `data/decoded/rev0/strings/`.
- **Docs:** new `docs/dossiers/lib-chunk22-161000-171000.md`, `lib-chunk23-171000-181000.md`;
  this review; updated `AGENTS.md`, `docs/DECOMP_LOG.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, `docs/WORKFLOW.md`; chunks-20-21 review hash fix.

## 12. Current Frontier
- **Next ROM address:** `0x00181000` (chunk 24, `0x181000..0x191000`).
- **First required action:** continue the OUTGOING **FUNCTION** straddler — `func_0017FF4C`
  `[0x17FF4C,0x181000)` has its preamble/prologue in chunk 23 and continues into chunk 24 (parent
  end `0x181118`, combat_transition). Emit the chunk-24 tail of this function first and confirm
  its `jr $ra`. Then content-scan/classify the rest. Unlike chunks 22→23, this straddler is
  CODE, not data.

## 13. Unresolved Caveats
- **Conservative code names:** all new functions are `func_<addr>`; overlay relocation
  (runtime `0x8021xxxx`) makes RAM/global/callee identity SUSPECT. LEADS recorded
  (camera-transition `func_00173D50`/`func_001742D0`, growth-table consumer near
  `func_00167DE0`) but not adopted.
- **`func_0016A56C` (chunk 22):** lower-confidence preamble fold — the body redundantly reloads
  `$a0`, so the 2-word preamble is not strictly read-before-write; folded forward as the most
  defensible ownership (adversary endorsed), recorded honestly.
- **Packed/high-entropy data (both chunks):** the packed blobs (chunk-22 leading bitmap-ish
  blocks; chunk-23 island 2) are undecoded — possibly compressed/graphics; no structure
  evident. Follow-up: test an LZSS/decoder if a header is found.
- **Linear-map fallacy:** any future RAM→ROM mapping from a runtime trace must be validated
  against byte-exact Rev 0 (prologue/return presence), never trusted as `ROM = RAM − 0x8006FC00`
  for overlay code/data. The chunk-23 data islands are a fresh example of the parent DB getting
  this wrong.

## 14. Reviewer Checklist
- [ ] `git status --short --branch` → clean `## main`; `git log --oneline -5` shows the
  review-handoff commit, `ff8871e`, `fefc199`, `52c113d`.
- [ ] `node tools/check_manifest.js` → ALL CHECKS PASS (24 chunks / 2,972 parts).
- [ ] `node tools/rebuild_from_source_manifest.js` → byte-exact (ROM `571E8339…CC67A`);
  `node tools/assemble_original_mips.js` → byte-exact (code SHA `40D4E787…B409`);
  `node tools/verify_setup.js` → PASS (24 / 2,972 / 76).
- [ ] Chunk 22 spot-check: `data_00161000_chunk22tail.s` (incoming straddler); `func_00165FC0.s`
  (preamble-orphan DATA→CODE entry, label = own name); `rodata_00163FC0.s` (weapon-type table,
  no function wording) + its decoded JSON/MD; `rodata_001650A0.s` (terrain/UI pool);
  `data_001708C8_chunk22head.s` (outgoing DATA straddler-head).
- [ ] Chunk 23 spot-check: `data_00171000_chunk23tail.s` (incoming straddler-tail); confirm both
  data islands `[0x175F28,0x177ED0)` and `[0x17BCD0,0x17F9C0)` have 0 prologues/returns;
  `rodata_001779A0.s` (408-byte help-message) + its decoded MD; `func_0017FF4C.s` (outgoing
  FUNCTION straddler-head, no `jr $ra`, label = own name).
- [ ] Confirm docs/counts: AGENTS / DECOMP_LOG / NEXT_STEPS / PLATFORM / WORKFLOW all say
  24 chunks / 2,972 files / 76 fallback / frontier `0x00181000`.
- [ ] Confirm the 6 chunk-22/23 data-index JSONs parse and match manifest ranges; the 4 decoded
  exports derive from the disasm; 0 data files with function wording; 0 root scratch.
- [ ] Confirm next frontier `0x00181000` and the `func_0017FF4C` CODE-straddler first-action.
