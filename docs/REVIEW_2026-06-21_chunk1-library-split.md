# Review Handoff: Chunk 1 Library Split (`0x11000..0x21000`) — chunk 1 complete

For the next decomp agent / reviewer. One commit (`4a212ef`), static/offline,
byte-exact rebuild preserved. This run also fixed the chunk-1 promote blocker and
the opening doc issues flagged in the prior review before splitting new code.

## TL;DR

- Cleared the blocker and **fully split chunk 1** (`0x00011000..0x00021000`) into
  **350 byte-exact named files** under `asm/original/rev0/lib/`. Tracked source
  files **177 → 527**; code SHA `40D4E787…B409` / ROM SHA `571E8339…CC67A`
  unchanged. Named coverage is now `0x1000..0x21000` (chunk 0 + chunk 1).
- **Preferred outcome met** (chunk 1 fully split). The stretch (chunk 2) was
  deliberately deferred to keep chunk-1 boundary review thorough and the commit
  coherent — current frontier is `0x00021000`, no blocker.
- Method: deterministic base partition (safety net) + a 9-slice
  analyze→adversarial-review swarm + my integration/validation + the byte-exact
  gate.

## 1. Prerequisite / opening fixes (from the prior review + task list)

1. **`tools/promote_original_mips.js` merge fix (the blocker).** It used to write
   `manifest.chunks = promoted`, which would have clobbered chunk 0's 177-part
   composite. It now **loads and merges** into the existing manifest, **seeds**
   each promoted chunk with a single whole-chunk `parts` entry (so the splitter,
   which only searches `chunk.parts`, can act on it immediately), keeps chunks
   sorted by ROM start, and **refuses** an exact-range re-promote without
   `--force` (a partial range overlap is always refused). Proven on chunk 1.
2. **`tools/split_original_mips_part.js` `--splits-file <json>`.** Avoids a
   350-argument command line; accepts an array or `{splits,remainder}` with
   hex/number `start`/`end` and an optional preamble-orphan `label`.
3. **Opening dossier corrections.** `boot-resource-decode-subsystem-B030-F22C.md`
   next-frontier marked SUPERSEDED (`0xF22C` → current `0x21000`);
   `boot-codec-libc-vec3-F22C-11000.md` typo `0xF10B98` → `0x10B98`.
4. **Prior `.s` re-check.** A full manifest-integrity audit over all previously
   tracked parts (contiguity + range-vs-decode-comment + sha256 + textBytes +
   duplicate name/file) found **no** mistakes — the earlier true-entry label fixes
   are intact and consistent.

## 2. What was split / named

- 350 files, first is the spec-fixed straddler tail `euler_to_matrix_full_tail`
  `[0x11000,0x11168)` (head is the last chunk-0 file); 349 contiguous functions to
  `0x21000`.
- Chunk 1 is a mixed **library** (not boot — reached from gameplay states), hence
  the `lib/` directory: unit/character-record subsystem, tagged script/command
  interpreter, float math (trig/sqrt/ldexp), libc (`memset`/`memmove`/byte-copy),
  allocators/free-lists, glyph⇄ASCII text encoding, and libultra OS primitives.
- **21 evidence-backed descriptive names**: `memset`, `memmove`, `mem_byte_copy`,
  `sqrtf`, `sin_cos_approx`, `float_ldexp_d`, `list_insert_head`, `list_unlink`,
  `bump_alloc`, `cpu_set_int_mask`, `ai_get_len/ai_get_status/ai_set_next_buffer`,
  `os_inval_dcache/os_inval_icache/os_writeback_dcache/os_writeback_dcache_all`,
  `os_virtual_to_physical`, `encode_ascii_to_glyph/decode_glyph_to_ascii`,
  `set_byte_800f918d/get_byte_800f918c`. The other 328 stay conservative
  `func_XXXXXXXX` (fabrication-averse). Full table + identified-but-unproven
  subsystems: `docs/dossiers/lib-chunk1-11000-21000.md`.

## 3. Boundaries (verified from disasm)

The parent DB **under**-counted here (the opposite of chunk 0's over-merge): it
hid many tiny jal-reachable accessor/leaf functions inside the trailing bytes of
larger records. 277 parent records → **350 real functions**.

- **Un-merges:** `0x12400..0x12444` is **seven** distinct `jr $ra` getters/setters;
  the `0x14338`/`0x145A8` block is **~40** jump-table opcode handlers; plus
  6-/4-/3-/5-way un-merges at `0x130B8`/`0x1353C`/`0x18C40`/`0x18E4C`/`0x19050`/
  `0x1989C`/`0x1FFEC`/`0x20234`/`0x20BE0`.
- **Preamble-orphans folded forward:** `0x11168`, `0x17990`, `0x18380`, `0x183C4`,
  `0x15D08`, `0x1A87C`, `0x1FBA0`, `0x1FBCC`, `0x20870`.
- **20 genuine dual-entries kept as one file** (secondary in `secondaryLabels`).
- **No in-chunk data files:** every jump table / float pool referenced here
  (`0x800B98B0`, `0x800BE690`, `0x800AE6C8/E700/E7F8/E820`, `0x800BE4xx`) is RAM
  data **beyond** `0x21000`, not embedded in the code chunk.

How to re-check: each function start is a real `addiu $sp,-N` prologue or a proven
jal-only leaf / preamble true-entry; each end follows a `jr $ra` + delay slot.
A scripted fragment check (every function range contains a return/tail) found
**0 fragments**.

## 4. Issues discovered

- **Tooling:** the promote blocker (fixed, §1.1); the 350-arg command-line risk
  (fixed via `--splits-file`, §1.2).
- **Parent DB:** systematically under-counts tiny jal-reachable leaves and the
  opcode-handler table in this range, and keeps the recurring preamble-orphan /
  dual-entry defects. Do **not** trust parent boundaries here — validate from
  disasm. (Documented in `AGENTS.md` + `DECOMP_LOG.md`.)
- **Swarm transients:** 2 of 9 slices (4, 6) hit `Connection closed mid-response`
  API errors in the workflow; re-run as direct agents (combined analyze+review),
  no quality loss. The other 7 slices completed in the workflow.
- **Name conservatism:** several clearly-structured subsystems (unit-record script
  interpreter, opcode-handler table, LCG random, allocator, free-list pairs,
  ~100 accessors) were left `func_*` for lack of symbol proof — listed in the
  dossier as future naming-upgrade targets.

## 5. Verification

- `node --check tools/promote_original_mips.js` / `tools/split_original_mips_part.js` → OK
- Manifest integrity audit over all 527 parts → ALL CHECKS PASS
- Fragment check (return/tail present in every function) → 0 fragments
- `node tools/assemble_original_mips.js` → byte-exact (`40D4E787…B409`)
- `node tools/verify_setup.js` → **PASS** (2 composite chunks / 527 files / 98
  fallback; code & ROM SHA unchanged)
- `node tools/audit_code_region.js` → OK (executable extent unchanged)
- `git diff --check` → clean

## 6. Files updated (commit `4a212ef`, 360 files)

- **Tools:** `tools/promote_original_mips.js`, `tools/split_original_mips_part.js`.
- **Source:** `asm/original/rev0/manifest.json`; 350 new
  `asm/original/rev0/lib/*.s`; the temp `code_00011000_00021000.s` was promoted
  then removed by `--remove-source`.
- **Docs:** new `docs/dossiers/lib-chunk1-11000-21000.md`; updated
  `docs/DECOMP_LOG.md`, `AGENTS.md`, `docs/NEXT_STEPS.md`, `docs/PLATFORM.md`,
  `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`,
  `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`.
- (Gitignored `build/` helpers used this run: `plan_chunk1.js`, `slice_chunk1.js`,
  `integrate_chunk1.js`, `check_manifest.js`, `check_splits.js` — not committed.)

## 7. Exact next task

Chunk 2 (`0x00021000..0x00031000`) via the now-proven pipeline:
1. `node tools/promote_original_mips.js --chunk code_00021000_00031000.s`
2. `node tools/dump_function_context.js --start 0x21000 --end 0x31000`
3. Base partition → 9-slice analyze→review swarm → integrate to a `--splits-file`
   JSON → `node tools/split_original_mips_part.js --part <chunk2 file>
   --splits-file <json> --remove-source`
4. Validate: manifest integrity, fragment check, `assemble_original_mips`,
   `verify_setup`, `audit_code_region`, `git diff --check`.
Expect the same parent-DB defects; default names to `func_XXXXXXXX` unless
evidence is hard.

## 8. Caveats

- Medium-confidence names (§2) are hypotheses; confirm before relying on them.
  `func_*` names are pure address labels.
- The chunk-1 jump tables / float pools (§3) are data in RAM beyond `0x21000`;
  they will need data-vs-code handling on the full-ROM coverage track.
- This run is split/naming/boundary/tooling + docs only; nothing in the rebuild
  path or classification changed (byte-exact).
