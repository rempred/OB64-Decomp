# Review Handoff: Chunk 2 Library Split (`0x21000..0x31000`) — chunk 2 complete

For the next decomp agent / reviewer. One commit (`ba546c0`), static/offline,
byte-exact rebuild preserved. This run also fixed the stale docs flagged in the
prior review before extending source, and characterized chunk 3 as a blocker.

## TL;DR

- Fully split **chunk 2** (`0x00021000..0x00031000`) into **216 byte-exact files**
  under `asm/original/rev0/lib/`. Tracked source files **527 → 743**; fallback
  chunks 98 → 97; code SHA `40D4E787…B409` / ROM SHA `571E8339…CC67A` unchanged.
  Named coverage is now `0x1000..0x31000` (chunks 0+1+2) = **6.90 %** of the
  evidenced executable extent.
- Chunk 2 is the statically-linked **Nintendo N64 SDK (libultra) + libc +
  compiler 64-bit runtime + `gu` matrix library** — the most recognizable code so
  far (88 exact SDK/libc descriptive names).
- **MAIN goal met.** The PREFERRED goal (chunk 3) is a **documented data/overlay
  blocker**, not done by design (see §6).

## 1. Opening corrections (from the prior review)

1. `AGENTS.md` — both the bottom setup-state block and the Assembly-Backed Code
   Rebuild section (`1/177/99` → `3/743/97`, frontier `0x21000` → `0x31000`).
2. `docs/WORKFLOW.md` — current expected source mix (`177/99` → `743/97`).
3. `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md` — stale frontier
   `0x11000` → `0x31000`.
4. `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md` — "Next frontier" superseded
   (chunk 1 + promote blocker done) → `0x31000`.
5. Re-audited all 527 prior tracked parts (contiguity + range-vs-decode-comment +
   sha256 + textBytes + duplicate-name) → **no mistakes**.

## 2. Work completed (chunk 2)

- 216 files, contiguous `0x21000→0x31000`, first is the straddler tail
  `func_00020d40_tail` `[0x21000,0x210C0)` (continuation of chunk-1
  `func_00020d40`).
- **88 descriptive** (libultra OS 28, `gu` matrix 12, libc 17, math 12, 64-bit
  runtime 7, MMIO accessors 7, list helpers 3), **126** conservative `func_`,
  **2 data**.
- Highlights: `osException`/`__osDispatchThread`/`__osEnqueueThread`/`osSendMesg`/
  `osEPiRawStartDma`/`__osGetSR`/`__osSetCompare`/`__osSpRawStartDma`/`osMapTLBRdb`;
  `guRotate`/`guMtxCatF`/`guMtxF2L`/`guTranslateF`; `memcpy`/`strcpy`/`sprintf`/
  `_Printf`; `sin`/`cos`/`tan`/`sqrt_f64`/`hypotf`/`rand`; `udivmod_u64`/
  `divmod_s64`. Full table + groupings: `docs/dossiers/lib-chunk2-21000-31000.md`.

## 3. Data handled explicitly (not dressed up as functions)

- `data_000283C4` `0x283C4..0x28430` (108 B) — small table.
- `data_0002E450_rsp_ucode` `0x2E450..0x31000` (11,184 B) — **RSP microcode**
  (COP2 vector words; data from the CPU view). It continues into chunk 3, so the
  parent DB's "function at `0x30008`" is a false positive inside ucode.

## 4. Tooling changes

- Generalized the chunk-1 helpers into parameterized, reusable (gitignored)
  `build/plan_chunk.js`, `build/slice_chunk.js`, `build/integrate_chunk.js`,
  `build/check_splits.js` (take `--start/--end/--tail-end/--tail-name`).
- Relaxed the integrator name filter to allow libultra/libc **camelCase** and
  `__`-prefixed SDK symbols (asm labels permit `[A-Za-z_][A-Za-z0-9_]*`) — the
  first integrate wrongly dropped `osException`/`guRotate`/`__osDispatchThread` to
  `func_`. Collisions now **dedupe by address suffix** (preserving the descriptive
  root) instead of falling back to `func_`.
- (`tools/promote_original_mips.js` merge fix and `tools/split_original_mips_part.js
  --splits-file` from the chunk-1 run were reused unchanged.)

## 5. Issues discovered

- **Parent DB misses non-prologue code.** It only detects standard `addiu $sp`
  prologue functions, so the libultra exception/thread/CP0/RSP handlers (which use
  `k0`/`k1`, `mtc0`/`mfc0`, `jr $k0`, jump trampolines) appeared as large "gaps".
  The swarm recovered them as real functions. Do not treat parent-DB gaps as data
  by default in library/OS regions — check whether they decode as instructions.
- **Cross-chunk duplicate symbols.** The game statically links libc/libultra into
  multiple TUs, so `memcpy`/`memset`/`strcpy`/`os_virtual_to_physical`/
  `list_insert_head` recur (chunk 1 and chunk 2). Kept unique via address suffix
  (`strcpy_0002c950`, `os_virtual_to_physical_000254e0`, …) — genuine separate
  copies, not mis-ids.
- **Integrator name filter was too strict** (snake_case only) — fixed (§4).
- **Swarm reliability:** all 10 chunk-2 slices completed (no API retries this run,
  unlike chunk 1 which needed 2 re-runs).

## 6. Chunk 3 is a blocker (DATA-DOMINANT + overlay/BSS) — documented, not forced

Investigated and deliberately deferred:
- `dump_function_context --start 0x31000 --end 0x41000` finds only ~21 functions,
  ALL at `0x3F1B0..0x41098` (which spill into chunk 4). `0x31000..~0x3F1B0`
  (~57 KB) is the RSP-ucode continuation + zero-fill blocks (`0x34000`) +
  small-integer data tables (`0x3A000`: `0x1388`=5000, `0x0FA0`=4000).
- `0x31000+` is **above the `~0x2F000` linear-RAM boundary** (CLAUDE.md hard rule;
  overlays confirmed far higher at `0x2637B0`+ in `ram_snapshots/overlay_sources.json`),
  so the linear RAM map is officially suspect there.
- `0x3F1B0` maps (linearly) to RAM `0x800AEDB0` = the **BSS-clear start** from the
  boot entry. Real functions at the BSS base would be zeroed at boot → either
  overlay-relocated (linear RAM wrong) or an initialized-data/rodata section.
- Per the hard rules (don't assert suspect linear RAM; don't pretend data is
  functions), forcing the function-naming swarm here would risk wrong output.
  Chunk 3 needs a **data-classification pass** + overlay/BSS resolution instead.

## 7. Verification

- `node build/check_manifest.js` (743 parts) → ALL CHECKS PASS
- `node build/check_splits.js` → 0 fragments (every function has a return/tail)
- `node tools/assemble_original_mips.js` → byte-exact (`40D4E787…B409`)
- `node tools/verify_setup.js` → **PASS** (3 composite chunks / 743 files / 97
  fallback; code & ROM SHA unchanged)
- `node tools/audit_code_region.js` → OK; `git diff --check` → clean

## 8. Files updated (commit `ba546c0`)

- **Source:** `asm/original/rev0/manifest.json`; 216 new `asm/original/rev0/lib/*.s`
  (the temp `code_00021000_00031000.s` was promoted then removed by
  `--remove-source`).
- **Docs:** new `docs/dossiers/lib-chunk2-21000-31000.md`; updated
  `docs/DECOMP_LOG.md`, `AGENTS.md`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`,
  `docs/WORKFLOW.md`, and the two older dossiers (frontier fixes).
- (No tool files changed this commit — the chunk-1 tool fixes were reused; the
  generalized helpers live in gitignored `build/`.)

## 9. Next steps

1. **Chunk 3 (`0x31000..0x41000`) data-classification pass** (see §6): promote;
   scan and emit `data_`/`rodata_`/`bss_zero_`/ucode-continuation files for
   `0x31000..~0x3F1B0`; resolve the `0x3F1B0`/`0x800AEDB0` BSS/overlay question
   against the overlay map (and runtime if needed) BEFORE naming the `0x3F1B0+`
   tail (conservative `func_` until settled). Keep byte-exact + no-gap.
2. Continue toward the 10 % executable-MIPS target `0x000468F8` (chunk 4) once
   chunk 3's data/code boundary is pinned.
3. Separately, the full-ROM coverage track can reclassify the proven non-code tail
   `0x002B89B4..0x0063676C` to a data source form (independent of chunk splitting).
