# Review Handoff: Codec / libc / vec3 Split (`0xF22C..0x11000`) — chunk 0 complete

For the next decomp agent / reviewer. One commit (`55c3413`), static/offline,
byte-exact rebuild preserved. This run also fixed the issues flagged in the prior
review before splitting new code.

## TL;DR

- Advanced the split frontier **`0x0000F22C → 0x00011000`** → **chunk 0
  (`0x1000..0x11000`) is now fully split into named functions**. 47 new functions;
  tracked source files **131 → 177**; code SHA `40D4E787…B409` / ROM SHA
  `571E8339…CC67A` unchanged.
- **Did NOT reach the 4% target `0x0001CD34`** (fallback clause). Blockers in §6.
- Fixed all 3 prior-review items (tool end_rom semantics, true-entry labels, stale
  docs) before splitting.
- Bonus: the prior tranche's dispatch tables are now **resolved** (§5).

## 1. Prerequisite fixes (from the prior review)

1. **`tools/dump_function_context.js`** — parent `end_rom` is the last-instruction
   address (INCLUSIVE), so exclusive end = `end_rom + 4`. Fixed
   `romEndExclusive`, `bytes`, and the boundary-notes (the phantom 4-byte
   delay-slot "gaps" are gone). Added an always-on regression assertion that
   fails loudly if `end_rom + 4 - start_rom != size`, so the off-by-4 cannot
   silently return.
2. **True-entry labels** — `func_0000D248.s`, `func_0000D600.s`,
   `boot_decode_huffman_codelengths.s` now expose the true entry as the primary
   label (the parent-DB boundary is annotated, not presented as the start).
   Manifest part hashes resynced; assembled bytes unchanged.
   `tools/split_original_mips_part.js` gained an optional `:label` 5th field so new
   preamble-orphan splits get a true-entry label automatically.
3. **Stale docs** — `NEXT_STEPS.md`, `WORKFLOW.md`, `AGENTS.md` setup section
   updated (`102 → 177`; frontier `0xB030 → 0x11000`; chunk 0 marked complete).

## 2. Boundaries (verified from disasm)

The parent DB has two recurring defects, both handled this run:

- **Over-merge** (multiple real functions in one record + spurious "secondary
  entries"): un-split `0xF734` = 4 functions (`boot_decode_init_mtf_tables` + libc
  `strcat`/`strcpy`/`strcmp`); `0xF8B0` = `memset` + `boot_io_open_stream`;
  `0x10B98` = 3 (`text_draw_string_flagged` + `char_to_glyph_index` +
  `parse_decimal_inline`); `0x10CF0` = `rand_unit_double` + `memcpy_bytewise`.
- **Preamble-orphan** (true entry precedes the labeled prologue): `0xF22C`,
  `0xFDB8`, `0x1054C`, `0x10E70`, `0x10FE0`.

Also: dual-entry fallthroughs merged as one file (`0x10500`/`0x10528`,
`0x107B8`/`0x107C0`); a chunk-boundary **straddler** `euler_to_matrix_full`
`0x10FE0..0x11168` (head only in chunk 0). The gate (`split` no-gap check +
`verify_setup` byte-exact) confirms every boundary.

## 3. Names (47)

Mostly high-confidence, evidence-backed:
- **libc**: `strcat`, `strcpy`, `strcmp`, `memset`, `memcpy_bytewise`,
  `memcpy_aligned` (canonical idioms).
- **stream I/O**: `boot_io_open_stream`, `boot_io_fread`, `boot_io_fwrite`.
- **codec**: `boot_decode_canonical_huffman_symbol` (renamed to avoid colliding
  with the prior-tranche adaptive `boot_decode_huffman_symbol` @0xE3F0),
  `boot_decode_read_block_header`, `boot_decode_read_packed_code`,
  `boot_decode_init_mtf_tables`.
- **vec3 float math library** (13): copy, distance, cross, dot, normalize×2,
  sub/add/scale + in-place variants, magnitude_checked, weighted_blend.
- **text renderer**: `text_render_begin*`, `text_draw_string*`,
  `char_to_glyph_index`, `parse_decimal_inline`; `set_dl_cursor`.
- Medium/hypothesis (kept descriptive, flagged in the dossier):
  `ui_set_scroll_window`, `fade_channel_*`, `emit_rdp_setup_displaylist`,
  `rand_*`, `euler_to_matrix*`. One kept conservative: `func_0000FC80`.

Full per-function table + evidence:
`docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`.

## 4. Did MIPS decomp advance, and how?

Yes, materially: **+47 named functions** (chunk 0 fully named), a **systematic
boundary-quality fix** (the end_rom+4 tool fix + the over-merge/preamble-orphan
corrections), a reusable **`:label`** split-tool option, and the **dispatch-table
resolution** below. The naming is predominantly descriptive-with-hard-evidence
this time (libc/vec3/io are unambiguous), not just `func_*`.

## 5. Dispatch tables RESOLVED (updates prior tranche)

The "runtime" dispatch tables are actually **static ROM data** baked into the
boot image — an xref scan found zero writers:
- `0x800AE128` (85-entry, used by `boot_resource_tag_record_decode` `0xB3E4`) =
  z64 ROM `0x3E528`. Opcode→handler: op1→`0xB888`, op2→`0xB8D0`, op64→`0xB92C`,
  op80→`0xB964`, op81→`0xB980`, op84→`0xB9A4`, default(79)→`0xB9C0`.
- `0x800AE2E8` (9-entry, used by `boot_resource_op_dispatch` `0xBE98`) =
  z64 ROM `0x3E6E8`.
- Codec vtable: `0x800AF3B4` is the per-call working copy; the TRUE source vtable
  is RAM `0x800A876C` / ROM `0x38B6C`.
These table/vtable bytes are data inside a not-yet-split generated chunk — flag
for data-vs-code reclassification when reached.

## 6. Why 4% (`0x1CD34`) wasn't reached — blockers (with evidence)

The target spans **266 functions across 2 chunks**. Two concrete blockers make it
unsafe in one turn:
1. **Chunk-boundary straddler** `0x10FE0..0x11168` crosses the fixed `0x11000`
   chunk boundary (source chunks are fixed at 64 KiB; can't be merged because
   `assemble_original_mips.js` matches tracked chunks to source chunks by exact
   range).
2. **`tools/promote_original_mips.js` clobbers the manifest** — it builds
   `manifest.chunks = promoted` and writes, so promoting chunk 1 would overwrite
   chunk 0's 177-part composite. Multi-chunk promotion was never implemented; it
   needs a MERGE (load existing manifest, append new chunk by range, refuse
   overwrite unless `--force`).

Plus the chunk-1 volume itself: the boundary planner counts **251 functions in
chunk 1, 201 before `0x1CD34`** (25 preamble-orphans + 26 dual/secondary entries),
i.e. a full tranche's worth of boundary validation.

## 7. Verification

- `node --check tools/dump_function_context.js` / `split_original_mips_part.js` → OK
- `node tools/dump_function_context.js --start 0xF22C --end 0x11000` → ran (correct ends)
- `node tools/assemble_original_mips.js` + `node tools/verify_setup.js` → PASS,
  byte-exact (177 tracked files)
- `node tools/audit_code_region.js` → OK (executable extent unchanged)
- `git diff --check` → clean

## 8. Exact next task

1. **Fix `promote_original_mips.js` to merge** (see §6 blocker 2).
2. Promote chunk 1 (`code_00011000_00021000.s`); make its first file the straddler
   tail `[0x11000,0x11168)`.
3. Split chunk 1 from `0x11000` toward `0x1CD34` (~201 functions). Seed with
   `node tools/dump_function_context.js --start 0x11000 --end <next>` (exclusive
   ends now correct). Expect over-merges and preamble-orphans; validate from
   disasm; resolve `jal 0x8007C25C`→`0xC65C` / `jal 0x8007C438`→`0xC838` /
   `jal 0x8007BC24`→`0xC024` to their real/secondary entries.

## 9. Caveats

- Medium-confidence names (§3) are hypotheses; confirm before relying on them.
- The dispatch-table/vtable bytes (`0x3E528`/`0x3E6E8`/`0x38B6C`) are data inside
  the code region in a generated chunk — they will need data-vs-code handling.
- This run is split/naming/boundary/tooling + docs only; nothing in the rebuild
  path or classification changed (byte-exact).
