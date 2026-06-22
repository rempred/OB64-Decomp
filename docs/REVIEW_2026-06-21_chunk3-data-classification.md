# Review Handoff: Chunk 3 Source-Ownership / Data Classification (`0x31000..0x41000`)

> **Superseded by the chunk-4 run (2026-06-21).** Three updates to the snapshot
> below: (1) the chunk-3 straddler was a parent-DB over-merge — `func_00040F88`
> `[0x40F88,0x40FF4)` is a COMPLETE leaf and the real straddler is `func_00040FF4`
> (head `func_00040ff4_chunk3head`, tail `func_00040ff4_chunk4tail`). Chunk 3 is
> now **67 parts (23 code + 44 data)**, not 66/22+44. (2) `build/check_manifest.js`
> was promoted to tracked **`tools/check_manifest.js`**. (3) §7 "next steps"
> (chunk 4) is DONE — see `docs/dossiers/lib-chunk4-41000-51000.md`. The historical
> 743→809 / 66-part figures below describe the original chunk-3 commit.

For the next decomp agent / reviewer. Two commits (`0441406` chunk 3, `0a2d412`
chunk-4 recon), static/offline, byte-exact rebuild preserved. Chunk 3 was handled
as a **data/code classification pass**, not a blind function split.

## TL;DR

- Source-owned chunk 3 (`0x00031000..0x00041000`) as **66 byte-exact parts**:
  **22 code** (`func_*`) + **44 data** (`rsp_ucode_*`/`zero_fill_*`/`table_*`/`data_*`).
  Tracked source files **743 → 809**; fallback chunks 97 → 96; code SHA
  `40D4E787…B409` / ROM SHA `571E8339…CC67A` unchanged. Coverage `0x1000..0x41000`
  = **9.20 %** of the evidenced executable extent.
- Chunk 3 is **DATA-DOMINANT**: ~91 % data (a bundle of N64 SDK RSP microcodes +
  the text-VM jump table + zero-fill/rodata), ~9 % overlay-relocated code tail.
- The prior `0x3F1B0`/BSS hazard is **resolved** (overlay-relocated, not BSS).
- MAIN goal met. Chunk 4 (code-dominant) is recon'd and documented as the next run.

## 1. Opening corrections (required before extending)

1. **Data-file headers.** Added `kind:'data'` support to
   `split_original_mips_part.js` → data parts now emit `/* Data region (not
   executable host code): <note>. */` instead of the "True entry / read-before-write
   preamble" wording. Fixed the two chunk-2 data files (`data_000283C4.s`,
   `data_0002E450_rsp_ucode.s`) and resynced the manifest (text sha/textBytes; the
   assembled bytes are unchanged — comments only).
2. **Doc wording.** "fully split into named functions" → "fully source-owned as
   named code/data parts" across AGENTS.md, PLATFORM.md, NEXT_STEPS.md,
   DECOMP_LOG.md (chunk 2 has data parts, chunk 3 has 44).
3. **Re-audit.** All 743 prior parts pass the manifest integrity check
   (contiguity + range-vs-decode-comment + sha256 + textBytes + duplicate-name).

## 2. Work completed — the classification

Code/data oracle = the parent **overlay map** (`scripts/ob64_overlay_map.json`,
real RAM snapshots): 0 loaded functions in `0x31000..0x3F1B0`, real functions only
at `0x3F1B0..0x40638` and `0x40E90..0x41098`. Cross-checked: 0 detected functions
(`dump_function_context`) and 0 `addiu $sp`+`jr $ra` signatures in the disasm for
that range. So `0x31000..0x3F1B0` is data; the 34 `jr $ra` words there are isolated
data coincidences.

Data identified with **hard evidence** (strings/anchors), not guesswork:
- **RSP microcode bundle** (~26 KB): name strings `RSP Gfx ucode F3DEX / F3DEX.NoN
  / F3DEX.Rej / F3DLX.Rej / L3DEX / S2DEX / S2DEXD … fifo 2.08 … Yoshitaka Yasumoto
  1999 Nintendo`. Continues from chunk 2's `data_0002E450_rsp_ucode`.
- **text-VM jump table** (`0x387C0..0x3C100`, 306 ptr words): anchored at `0x39CB0`
  → RAM `0x800A98B0` (parent `overlay-system.md`/`table_map.json`) + glyph charset.
- **zero-fill** blocks (6,208 B) and a few honest `data_*` "mixed — needs follow-up".

Full per-byte index (every byte owned): the dossier table
`docs/dossiers/lib-chunk3-31000-41000.md` + machine-readable `build/chunk3_index.json`.
Bytes by class: rsp_ucode 26,160; text-VM table 14,656; mixed data 12,888;
zero-fill 6,208; code 5,624.

Code tail: 22 overlay-relocated functions (`0x3F1B0`→RAM `0x800E9C20`,
`0x40E90`→RAM `0x8016AF90`) — all kept conservative `func_*` because overlay RAM
makes callee/global identity unverifiable. Straddler `func_00040f88_chunk3head`
`[0x40F88,0x41000)` continues to `0x41098` in chunk 4.

## 3. Tooling changes

- `tools/split_original_mips_part.js`: `--splits-file` entries accept `kind` +
  `note`; `kind:'data'` emits a data-region header (no "true entry" wording).
- Gitignored `build/` helpers (reusable): `classify_chunk3.js` (window-level
  content classifier), `plan_chunk3_final.js` (code-from-overlay-map + data
  segmentation at zero-runs), `enrich_chunk3_index.js` / `final_index_chunk3.js`
  (data index with composition/strings/pointers/anchors), `resync_manifest.js`.

## 4. Issues discovered

- **Parent DB misses non-prologue code AND mislabels data.** It found 0 functions
  in `0x31000..0x3F1B0` (correct — it's data) but ALSO a false-positive "function"
  inside the RSP ucode (the linear-map artifact). Use the overlay map as the
  code/data oracle in this region, not the parent function DB.
- **Frameless leaf hidden in "data".** The adversarial swarm caught
  `0x3FE68..0x3FEB4` — a real leaf function (entry `0x3FE70`, byte-clear loops,
  `jr $ra` `0x3FEAC`) with no stack frame, which both the parent DB and my own
  prologue scanner missed. Reclassified `data_0003fe68` → `func_0003fe68`. Lesson:
  prologue+`jr $ra` scans miss frameless leaves; an adversarial pass is worth it.
- **Multi-pass index drift.** Refining data names in the splits JSON left the
  enriched index stale; rebuilt the final index from the authoritative splits JSON
  (`final_index_chunk3.js`) so the dossier table matches the on-disk files.
- **Data-header debt (now fixed).** Chunk-2's two data files carried the
  code-oriented "True entry" boilerplate — corrected (§1.1).

## 5. Verification

- `node --check tools/split_original_mips_part.js` → OK
- `node build/check_manifest.js` (809 parts) → ALL CHECKS PASS
- code-only fragment check → 22 code funcs all have a return; 0 fragments
- `node tools/assemble_original_mips.js` → byte-exact (`40D4E787…B409`)
- `node tools/verify_setup.js` → **PASS** (4 composite chunks / 809 files / 96 fallback)
- `node tools/audit_code_region.js` → OK; `git diff --check` → clean

## 6. Files updated

- **Source:** `asm/original/rev0/manifest.json`; 66 new `asm/original/rev0/lib/*.s`;
  2 modified chunk-2 data files; temp `code_00031000_00041000.s` promoted then
  removed by `--remove-source`.
- **Tools:** `tools/split_original_mips_part.js` (data headers).
- **Docs:** new dossier `docs/dossiers/lib-chunk3-31000-41000.md` (data/code index
  table); updated `docs/DECOMP_LOG.md`, `AGENTS.md`, `docs/NEXT_STEPS.md`,
  `docs/PLATFORM.md`, `docs/WORKFLOW.md`.

## 7. Next steps

**Chunk 4 (`0x41000..0x51000`) — CODE-DOMINANT (recon done).** The overlay map
shows **164 loaded functions** (first `0x41098`→RAM `0x8016B198`, last `0x50F98`) —
overlay-relocated, so RAM/globals/callees are suspect; use the function-split
pipeline (`plan_chunk.js`/`slice_chunk.js`/`integrate_chunk.js` swarm) with
**conservative `func_*`** by default (real RAM in `ob64_overlay_map.json`). FIRST
continue the straddler: chunk-4's head file is `func_00040f88`'s tail
`[0x41000,0x41098)`. The **10% executable target `0x000468F8` is only 22,776 bytes
into chunk 4** (chunks 0–3 = 9.20%).

Separately, the full-ROM coverage track can still reclassify the proven non-code
tail `0x002B89B4..0x0063676C` to a data source form (independent of chunk splitting).
