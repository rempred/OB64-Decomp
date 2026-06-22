# Review Handoff: Chunk 7 — data/code/data/code mixed (`0x00071000..0x00081000`)

For the next decomp agent / reviewer. Static/offline, byte-exact rebuild preserved.

- **Chunk:** 7, ROM `0x00071000..0x00081000` (65,536 B).
- **Commit:** see git log (message starts "Source-own Rev 0 chunk 7").
- **Composition:** 103 parts = **80 code `func_*` + 1 straddler-head + 22 data**,
  in four ROM-ordered regions (DATA1 2, CODE1 45, DATA2 20, CODE2 36).

## Files added/modified/removed
- Added: 103 `asm/original/rev0/lib/*.s` (chunk 7).
- Removed: temp whole-chunk `code_00071000_00081000.s` (`--remove-source`); root
  scratch dumps `regB.json`/`regionA.txt` (cleanup commit `5c3e12e`).
- Modified: `asm/original/rev0/manifest.json`; `tools/split_original_mips_part.js`
  (NEW `sanitizeComment` — neutralizes `*/`/`/*` in note/label text).
- Docs: new dossier `docs/dossiers/lib-chunk7-71000-81000.md`; this review;
  updated `AGENTS.md`, `DECOMP_LOG.md`, `NEXT_STEPS.md`, `PLATFORM.md`,
  `WORKFLOW.md` (the cleanup also fixed stale WORKFLOW counts + run-handoff wording).

## Key boundary decisions
- Four regions (recon + adversarial-confirmed): DATA1 `0x71000..0x71280`
  (blob continuation), CODE1 `0x71280..0x783A0` (PARENT-UNDETECTED), DATA2
  `0x783A0..0x79730` (Controller-Pak menu data), CODE2 `0x79730..0x81000`
  (parent-detected, ends with a chunk-8 straddler). Boundaries pinned from disasm
  (return/prologue structure + pointer/ASCII density), not the coarse window scan
  (which misreads large-function interiors as "data").
- The 11 KB `func_00079E7C` is ONE switch-dispatcher (4 internal `jr $v0`), not data.

## Code/data classification evidence
- DATA1 = chunk-6 packed blob tail + a 10-ptr table. DATA2 = Controller-Pak /
  save-data menu data: string pools (chapter labels, glyph/charset, month
  abbreviations, element names, UI/menu strings, `NOBE`/`EB` save magic, format
  tokens) + RAM-pointer tables + small index/layout records. 0 returns/prologues/
  overlay-fns in both data regions.

## Parent DB contradictions discovered
- CODE1 (`0x71280..0x783A0`, ~29 KB) is entirely parent-undetected (the parent
  gap that began at chunk 6 continues); `scan_functions` seeded it.
- CODE2 over-merges: trailing frameless leaves hidden in large parent records
  (idx14 `0x7D450`, idx5 `0x7D9CC`), preamble-orphans on several records.

## Frameless leaves / preamble-orphans
- CODE1: 33 framed → 45 (queue/dequeue accessor leaves, etc.). CODE2: 27 parent →
  36 (un-merged leaves + folds). Many 2-word `lui/lw $v0,0x7AF8`-style global-load
  preambles folded forward.

## Data islands / jump tables
- No inline data islands inside the code regions (the indirect `jr $v0` sites are
  in-function switch dispatches reading relocated-RAM tables).

## Straddlers
- **In (data):** `data_00071000` continues chunk-6 `data_00070e70`.
- **Out (function):** `func_0007ffac_chunk7head` `[0x7FFAC,0x81000)` — true entry
  `0x7FFAC` (2-word preamble; parent labeled `0x7FFB4`) — continues to `0x810DC`
  in chunk 8.

## Mistakes corrected (this chunk)
- 3 slice-seam preamble straddler-head mislabels folded; 1 delay-slot leak fixed;
  1 adversarial preamble-orphan fold (`0x7E148`).
- **Tool bug fixed:** a data note containing a charset string (`+-*/=`) closed the
  C-comment and broke the assembler. `split_original_mips_part.js` now sanitizes
  `*/`/`/*` in comments (byte-exact unaffected). The chunk was re-split after the
  fix (source restored from the `build/` generated chunk).
- My inline slice-seam-fold helper has a quirk: folding a preamble straddler-head
  INTO the chunk-end straddler-head demotes it to `code` — I fixed the
  `func_0007ffac` straddler-head by hand. Future: keep `straddler-head` kind when
  the fold target is itself the region-end straddler-head.

## Verification (all PASS)
- `node tools/check_manifest.js` → ALL PASS (1,455 parts).
- `node tools/check_boundaries.js --splits build/chunk_00071000-00081000_splits.json --disasm build/original-mips/rev0/code_00071000_00081000.s` → PASS.
- `node tools/check_splits.js --splits … --disasm …` → 0 fragments (1 legit 8-byte `jr;nop` stub `func_0007dc00`).
- `node tools/assemble_original_mips.js` → byte-exact (`40D4E787…B409`).
- `node tools/verify_setup.js` → PASS (8 chunks / 1,455 files / 92 fallback; ROM `571E8339…CC67A`).
- `node tools/audit_code_region.js` → OK; `git diff --check` → clean; 0 data files with function wording; 0 root scratch artifacts tracked.

## Current frontier after chunk 7
- **`0x00081000` (chunk 8).** Tracked files **1,455**; fallback **92**; coverage
  **18.40 %** (code-only ≈ 14.04 %).

## Next chunk's required first action
- Continue the straddler: chunk 8's first file is `func_0007ffac_chunk8tail`
  `[0x81000,0x810DC)` (tail of `func_0007FFAC`). Chunk 8 is the first largely
  parent-detected chunk in a while (`0x79730`+ parent run continues), so
  `plan_chunk` should seed most of it — but content-scan for data regions first
  (chunk 7 had two interior data regions).

## Unresolved caveats
- Code names are conservative overlay address labels. Controller-Pak menu data
  pointer-table→string wiring not decoded. CODE1's two switch dispatchers' jump
  tables live in relocated RAM (not resolved).
