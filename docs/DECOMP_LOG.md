# OB64 Decomp Log

This is the compact current-state decomp memory. Full historical logs are
archived under `docs/archive/`; the newest full archive before this compaction
is
`docs/archive/DECOMP_LOG-full-through-resource-decode-subsystem-2026-06-21.md`.

Read this after `AGENTS.md`, `docs/PLATFORM.md`, `docs/REV0_SCOPE.md`,
`docs/TOOLCHAIN.md`, and `docs/WORKFLOW.md`. Keep this file focused on durable
session facts, active frontiers, and verification results. If it again grows
toward roughly 10,000 tokens, archive the full version under `docs/archive/`
and replace the active log with a compact current-state summary.

## Current Invariants

- Target: Ogre Battle 64 US Rev 0 only.
- Every configured byte must remain source-owned. The full-ROM source manifest
  currently covers all 41,943,040 bytes with zero unknown bytes.
- Whole-ROM coverage still independently scans for LHA headers; do not trust the
  parent archive catalog by itself.
- The configured code region `0x00001000..0x0063676C` is conservative. Executable
  MIPS only occupies `0x00001000..0x002B89B4`; the trailing 3,661,240 bytes
  (56.24%) have zero `jr $ra` and are non-code data still emitted as `.word`
  `original_mips`. A static control-flow audit found no credible code edge into
  the tail (0 branch targets, 0 J/JAL to a known function). Audit:
  `tools/audit_code_region.js` / `docs/CODE_REGION_AUDIT.md`.
- Current tracked code source mix: three composite real-assembler chunks
  `0x00001000..0x00011000` (177 files, `boot/`), `0x00011000..0x00021000`
  (350 files, `lib/`), `0x00021000..0x00031000` (216 files, `lib/`), and
  `0x00031000..0x00041000` (66 files, `lib/`) = **809 tracked source files**, plus
  96 generated fallback code chunks. **Chunks 0, 1, 2 AND 3 are now fully
  source-owned as named code/data parts** (chunk 2: 2 data parts; chunk 3: 44 data
  + 22 code parts) (`0x00001000..0x00041000`); next is chunk 4 (`0x00041000`, still
  a generated fallback chunk). The promote-tool merge blocker is FIXED.
- The parent boundary DB has TWO recurring defects, both fixed when splitting:
  (1) `end_rom` is INCLUSIVE (exclusive end = `end_rom + 4`; do NOT treat the
  delay slot as a gap — `tools/dump_function_context.js` now enforces this with a
  regression guard); (2) it both over-merges (multiple real functions in one
  record with spurious "secondary entries", e.g. `0xF734` = 4 functions incl.
  libc `strcat/strcpy/strcmp`) and orphans a read-before-write load preamble onto
  the previous function's tail (true entry precedes the labeled `func_` start;
  seen at `0xD248/0xD600/0xECF0/0xF22C/0xFDB8/0x1054C/0x10E70/0x10FE0`). Always
  validate boundaries from disasm, not the parent record alone.
- Current tracked non-code source-owner mix: 3 tracked files / 44,029 bytes,
  plus 1,055 generated fallback owner files / 35,388,567 bytes.
- Current code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Current rebuilt/full ROM SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Canonical verification command: `node tools\verify_setup.js`.

## Source Promotion History

The first Rev 0 code chunk `0x00001000..0x00011000` is promoted as a tracked
composite chunk in `asm/original/rev0/manifest.json`. Its source files are still
original/reference MIPS using exact `.word` output plus decode comments; names
are conservative source-layout labels unless a dossier says runtime behavior is
verified.

Current named sequence:

- `boot_entry_clear_bss.s` `0x1000..0x1060`.
- Resource arena and allocator files through `resource_largest_free_block.s`
  `0x1060..0x18D4`.
- Resource validation/realloc/tree files through `resource_alloc_tree_scan.s`
  `0x18D4..0x22B0`.
- `early_boot_resource_loader.s` and `boot_state_service_loop.s`
  `0x22B0..0x2B38`.
- Boot mode/flag helpers through `boot_status_flag_test.s`
  `0x2B38..0x2D7C`.
- `boot_table_mask_reconcile.s` `0x2D7C..0x347C`.
- `boot_mode_message_accumulator_update.s` `0x347C..0x368C`.
- Resource-buffer/state/display-list helpers through
  `boot_display_list_sync_modes.s` `0x368C..0x4048`.
- Display-list counter helpers through `boot_display_list_counter_packet_emit.s`
  `0x4048..0x42D8`.
- `boot_resource_window_cache_update.s` `0x42D8..0x43D4`.
- Bitstream descriptor/cursor helpers through
  `boot_bitstream_descriptor_encode.s` `0x43D4..0x4AC8`.
- Resource probe helpers through
  `boot_resource_probe_record_checksum_signature.s` `0x4AC8..0x5FC0`.
- State/slot, resource-handle, transform-record, command/resource-node, and
  resource-node context/recursive helpers through
  `boot_resource_loader_callback_register.s` `0x5FC0..0xB030`.
- Resource/decode subsystem `0x0000B030..0x0000F22C` (29 named parts:
  `boot_resource_lzss_load_entry` … `boot_resource_huffman_codelengths`; 10 left
  as `func_0000XXXX`). Dossier:
  `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`.
- Codec / libc / vec3 tranche `0x0000F22C..0x00011000` (47 named parts: codec
  workers, libc `strcat/strcpy/strcmp/memset/memcpy`, `boot_io_*` stream I/O, a
  `vec3_*` float math library, text renderer, RNG). Dossier:
  `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`. **Chunk 0 complete.**
- Chunk 1 library tranche `0x00011000..0x00021000` (350 named parts in `lib/`:
  unit/character-record subsystem, tagged script/command interpreter, float math
  (trig/sqrt/ldexp), libc (`memset`/`memmove`/byte-copy), allocators/free-lists,
  glyph⇄ASCII text encoding, and libultra OS primitives — cache ops, AI audio,
  CPU interrupt mask, virtual→physical). Dossier:
  `docs/dossiers/lib-chunk1-11000-21000.md`. **Chunk 1 complete.**
- Chunk 2 library tranche `0x00021000..0x00031000` (216 named parts in `lib/`:
  the Nintendo SDK **libultra** OS core — exception/scheduler/threads, message
  queues, EPI DMA, CP0 access, RSP control, TLB — plus libc (`mem*`/`str*`/
  `sprintf`/`_Printf`), the `gu` matrix library, math (`sin`/`cos`/`sqrt`/…), the
  compiler 64-bit runtime (`udivmod_u64`/`divmod_s64`/…), MMIO register accessors,
  and an embedded **RSP microcode** data block). Dossier:
  `docs/dossiers/lib-chunk2-21000-31000.md`. **Chunk 2 complete.**
- Chunk 3 source-ownership `0x00031000..0x00041000` (66 parts: a bundle of N64
  RSP microcodes + text-VM jump table + zero-fill/rodata data, and a 22-function
  overlay-relocated code tail). Dossier: `docs/dossiers/lib-chunk3-31000-41000.md`.
  **Chunk 3 source-owned.**
- Current remainder: none in chunks 0–3 (`0x1000..0x41000` fully source-owned).
  Next is chunk 4 generated fallback `0x00041000..0x00051000`.

Static dossiers live under `docs/dossiers/` and are the durable evidence notes
for each promoted source-layout split.

## Earlier per-split entries (archived 2026-06-21)

The individual boot-segment split entries for the first code chunk
(`boot_resource_node_*` through `boot_resource_loader_callback_register`, plus
the earlier boot/display-list/probe/state-slot splits) were pruned here at the
~10k-token threshold. Full provenance is preserved in
`docs/archive/DECOMP_LOG-full-through-resource-decode-subsystem-2026-06-21.md` (do not read unless a specific older split is needed) and is
summarized in "Source Promotion History" above plus each function's dossier.

## 2026-06-21 - Code-Region Extent Audit (Full-ROM Coverage Phase)

Baseline before the step:

- `git status --short` was clean at commit
  `9652795 Split Rev 0 boot resource loader callback register`.
- `node tools\verify_setup.js` passed with 825 archives, zero unknown bytes, 108
  visible overlap bytes, 102 tracked source files, 99 generated fallback chunks,
  code SHA256 `40D4E787...B409`, ROM SHA256 `571E8339...CC67A`.

Opened the full-ROM coverage phase by auditing whether the configured code
region is actually all code. Added read-only tool `tools/audit_code_region.js`
and tracked doc `docs/CODE_REGION_AUDIT.md`. The tool writes only gitignored
reports (`build/coverage/rev0-code-region-audit.json/.md`) and does not touch the
rebuild path, so the exact-rebuild/`verify_setup` gate is unchanged.

Finding (evidence, not yet reclassified):

- Executable extent `0x00001000..0x002B89B4` (2,849,204 bytes): 96.75% opcode
  words, 5,065 `jr $ra` (1.82/KB), all 13 parent overlay anchors inside it;
  545,844 bytes (19.16%) interleaved gap/rodata between detected functions.
- Suspected non-code tail `0x002B89B4..0x0063676C` (3,661,240 bytes, 56.24% of
  the configured region): ZERO `jr $ra` across 915,310 words, ~52-64% opcode-word
  density, ~35% ASCII density, near-zero RAM-pointer density. Conclusion:
  non-code data currently emitted as `.word` `original_mips`.
- Last valid parent-detected function ends at `0x002B89B4`; no valid function
  starts beyond it. The parent DB's max `end_rom` `0x00598A9C` is one
  `valid:false` false positive inside the tail and is excluded.

Method: union of valid parent function `[start_rom,end_rom)` intervals plus
per-256 KiB intrinsic scan (`jr $ra`, opcode, pointer, zero, ASCII density);
conservative verdicts (`code-evidenced` / `data-evidenced` / `unproven`).

Verification for the step:

- `node tools\audit_code_region.js` runs clean and reports the extent/tail above.
- `node tools\verify_setup.js` still PASS after adding the tool and docs; code and
  ROM SHA256 unchanged.

Next: refine the exact code/data boundary near `0x002B89B4`, then reclassify the
tail from code to a data source form (config/segments + ledger + full-ROM source
manifest) while keeping the byte-exact gate green; later wire the audit into a
coverage gate.

## 2026-06-21 - Code-Region Audit Review Follow-up

Addressed the review of the code-region extent audit (no rebuild-breaking issue
found; tool + docs accepted). Changes, all in `tools/audit_code_region.js` + docs,
no rebuild-path or config change:

- Added a static control-flow edge audit. It scans every instruction word in the
  valid detected functions of the executable extent and reports direct
  branch/J/JAL targets landing in the tail `0x002B89B4..0x0063676C`. Result:
  **0 PC-relative branch targets** (overlay-immune, authoritative) and
  **0 J/JAL targets resolving to a known function**. The 7 raw J/JAL-into-tail
  hits all originate from function `0x001A42A4` and target non-functions
  (`targetKnownFn=false`) in the zero-`jr $ra` tail; they are a data ramp table
  embedded in that function (`0F0F0F0F`, `0C0D0E0F`, … near `0x1A4560`) decoding
  as `jal`. Verdict `no-credible-code-edge-into-tail`. Credibility is gated on the
  target resolving to a known function start (overlay-robust); "code-like source"
  alone is insufficient because real functions can embed data tables.
- Hardened missing-input behavior for gate readiness: parent JSON is required by
  default (missing or corrupt = hard error); `--allow-missing-parent-db`
  downgrades a *missing* file to intrinsic-only mode (corrupt always fails loud).
  Replaces the old silent `loadOptionalJson`.
- Surfaced returnless (no `jr $ra`) detected "functions" as data mis-detected as
  functions, and added per-hit `targetKnownFn` to the report.
- Mirrored the durable finding into parent `docs/rom-layout.md` (review item 4).
- A typo (template literal closed with `'` instead of a backtick) was caught and
  fixed during testing; `node --check` and a `${}`-aware lexer now pass.

Verification: `node tools/audit_code_region.js` runs clean (verdict above);
`node tools/verify_setup.js` PASS with code/ROM SHA256 unchanged;
`git diff --check` clean. Reclassification still gated on pinning the exact
boundary — not done.

## 2026-06-21 - Resource/Decode Subsystem Split (0xB030..0xF22C)

Substantial split/naming tranche on the boot function-split track.

- Range investigated: ROM `0x0000B030..0x0000F22C` (~0x41FC bytes, 29 functions).
- Previous frontier `0x0000B030`; new frontier `0x0000F22C` (new remainder
  `asm/original/rev0/code_0000F22C_00011000.s`). Chunk-0 named coverage is now
  `0x00001000..0x0000F22C`; tracked source files 102 -> 131.
- Method: built reusable `tools/dump_function_context.js`; ran it over the range;
  ran a 6-cluster analysis swarm + adversarial review; maintainer re-verified all
  hazards (jump tables, callback, dual-entry) and all boundary corrections from
  the disassembly. Full per-function provenance:
  `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`.

Subsystem: a permanent (all-7-states) tagged resource-archive loader + custom
decompressor. Front end `0xB030..0xBE98` (archive open + pool bracket + 85-way
tag-record decode + resolve/load), decode/verify core `0xBE98..0xC310`
(9-way dispatch + buffered copy/CRC16 + pluggable codec driver), and a
Huffman/DEFLATE + adaptive-Huffman codec `0xC778..0xF22C`. Shared state block
`0x800AF360..0x800AF4xx`; record/node block `0x800B0000+`.

Confirmed function boundaries (29): every parent boundary in the range was
validated against prologue/epilogue/delay-slot/`jr $ra`. Boundaries are listed in
the dossier table; all 29 split files rebuild byte-exactly.

Boundary corrections (recurring "preamble-orphan" idiom — the detector orphans a
2–4 word read-before-write load preamble onto the previous function's tail):
- `func_0000D248` true start `0xD248` (parent `0xD250`): `0xD248/0xD24C` load
  `0x800AF3C6`, consumed by `bne $v0` @`0xD254` before any write.
- `func_0000D600` true start `0xD600` (parent `0xD610`): `0xD600..0xD60C` load
  `0x800AF3C2/0x800AF410`, consumed @`0xD61C/0xD624`.
- `boot_decode_huffman_codelengths` true start `0xECF0` (parent `0xECF8`):
  `0xECF0/0xECF4` load `0x800AF3C6`, consumed @`0xED08`.
- `func_0000CEB8` extended to end `0xD248` (absorbs its `jr` delay slot `0xD244`).
- Next frontier corrected `0xF23C` -> `0xF22C` (same idiom); remainder starts there.
- Spurious parent secondary entries rejected (not split): `0xBBB8` (mid-loop in
  `0xB3E4`), `0xDC48` (mid-instruction in `boot_decode_huffman_tree_init`).
- Genuine multi-entry functions kept as one file: `0xE1F0`->`0xE204` dual entry;
  `0xDCA8`+`0xDFF4`; plus secondaries `0xBF48`, `0xC604/0xC65C/0xC444`,
  `0xC838/0xC938`, `0xCF8C/0xD00C`.

New/revised names: 19 descriptive (`boot_resource_*` loader, `boot_decode_*`
codec) + 10 conservative `func_0000XXXX` (role-noted). High confidence:
`boot_resource_pool_acquire_release` (`0xB33C`, alloc/free bracket — verified).
Medium (hard structural anchor): `boot_resource_lzss_load_entry` (lzss call),
`boot_resource_archive_load_many/one` (archive open+loop),
`boot_resource_tag_record_decode` (85-way jump table @`0x800AE128`),
`boot_resource_op_dispatch` (9-way jump table @`0x800AE2E8`),
`boot_decode_driver` (3 jalr codec callbacks @`0x800AF3B4`, CRC16 poly `0xA001`),
`boot_decode_build_huffman_table` (histogram+firstcode). The adaptive-Huffman
codec names (`boot_decode_huffman_*`) are **hypothesis** (constants 286/285/628,
`0x8000` renorm, bit-reader idiom — not symbol-proven). Address-only `func_*` for
the three `0x80093540` log wrappers and the uncertain codec internals.

Callgraph: dispatchers `0xB3E4`/`0xBE98`/`0xC310`; high-fanin shared workers
`func_0000BFC0` (4), `boot_decode_build_huffman_table` (5), the bit-reader
secondaries `0xC65C` (`jal 0x8007C25C`) / `0xC838` (`jal 0x8007C438`), and the
`0xDCA8`/`0xDFF4` tree-update pair. The tranche is entered almost entirely via
`boot_resource_archive_load_many` (20 callers incl. `0x9D50` and many
`0x1Cxxxx..0x23xxxx` sites). Codec internals have in-range jal in-degree 0
because they are reached via the codec vtable `0x800AF3B4` or as pointer entries
(so the static "leaf degree 0/0" label is unreliable here).

Key constants/globals informing interpretation: jump tables RAM `0x800AE128`
(85) / `0x800AE2E8` (9) (runtime DATA, NOT embedded — unverified targets);
CRC-16/MODBUS poly `0xA001`; DEFLATE `0x11E`=286 / `0x11D`=285; adaptive-Huffman
`0x274`=628 node arrays + `0x8000` renorm; record magic `0x81B6`; tag bytes
`0x55/0x4D/0x48/0x4B/0x58/0x6D`; descriptor lists `0x800BF320` (lzss) /
`0x800BE0A8` (archive) / `0x800B884C` (pool) / `0x800B8750` (dir table).

False leads / softened: parent secondaries `0xBBB8`/`0xDC48` rejected; the
`report2/3/2b` names dropped to `func_*` (helper `0x80093540` identity
unconfirmed); `decode_char`/`decode_with_prefetch` dropped to `func_*`
(mechanism unproven). Static callgraph degree mislabels "leaf" functions that
call bit-reader secondary entries.

Tool change: added `tools/dump_function_context.js` (read-only join of parent
boundaries + symbols_v2 callgraph + accessed globals + flags → gitignored
`build/context/` report; required-parent-DB by default with
`--allow-missing-parent-db`).

Verification: `node tools/dump_function_context.js --start 0xB030 --end 0xF23C`
OK; `node tools/split_original_mips_part.js` produced 29 named parts + remainder;
`node tools/verify_setup.js` PASS — code SHA256 `40D4E787...B409` and ROM SHA256
`571E8339...CC67A` unchanged (byte-exact); `git diff --check` clean.

Next recommended target: split from `code_0000F22C_00011000.s` starting at the
corrected entry `0x0000F22C` (a canonical-Huffman read/decode worker), then
continue the codec and the low-level stream I/O (`func_0000F970` fread-like,
`F9D8` fwrite-like, referenced from this tranche). Expect the preamble-orphan
boundary idiom on every function. A high-value side quest: decode the runtime
dispatch tables `0x800AE128`/`0x800AE2E8` to map opcodes to handlers. (RESOLVED
in the 2026-06-21 codec/libc/vec3 entry below: they are static ROM data, not
runtime-registered.)

## 2026-06-21 - Codec / libc / vec3 Split (0xF22C..0x11000); chunk 0 complete

Finished chunk 0's named coverage and fixed the review-flagged tooling/labels.

- Range: ROM `0x0000F22C..0x00011000` (**47 functions**). Previous frontier
  `0x0000F22C`; new frontier `0x00011000` (chunk 0 fully named). Tracked source
  files 131 -> 177. Byte-exact preserved (code SHA `40D4E787...B409`, ROM SHA
  `571E8339...CC67A`). Dossier: `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`.
- Method: fixed `dump_function_context.js` (end_rom inclusive -> exclusive
  +4; regression guard added), regenerated context, ran a 6-agent swarm
  (4 cluster + dispatch + adversarial review), integrated names + boundaries.
- Prerequisite fixes (from the prior review):
  - `dump_function_context.js`: `romEndExclusive`/`bytes`/boundary-notes now use
    `end_rom + 4`; phantom 4-byte delay-slot "gaps" eliminated; in-tool assertion
    fails loudly if `end_rom+4-start_rom != size`.
  - True-entry labels: `func_0000D248.s`, `func_0000D600.s`,
    `boot_decode_huffman_codelengths.s` now expose the true entry as the primary
    label (parent-DB boundary annotated); manifest part hashes resynced.
    `split_original_mips_part.js` gained an optional `:label` 5th field for new
    preamble-orphan splits.
  - Stale-doc fixes: `NEXT_STEPS.md`, `WORKFLOW.md`, `AGENTS.md` setup section
    (`102 -> 131 -> 177`, frontier `0xB030 -> 0x11000`).
- Boundary corrections (verified from disasm): parent UNDER-merges un-split —
  `0xF734` = `boot_decode_init_mtf_tables` + libc `strcat`/`strcpy`/`strcmp`;
  `0xF8B0` = `memset` + `boot_io_open_stream`; `0x10B98` = 3 (flagged wrapper +
  `char_to_glyph_index` + `parse_decimal_inline`); `0x10CF0` = `rand_unit_double`
  + `memcpy_bytewise`. Preamble-orphans `0xF22C/0xFDB8/0x1054C/0x10E70/0x10FE0`.
  Dual-entry fallthroughs merged `0x10500`/`0x10528`, `0x107B8`/`0x107C0`.
  Chunk-boundary straddler `euler_to_matrix_full` `0x10FE0..0x11168` (head only in
  chunk 0; tail starts chunk 1).
- New names (47): high-confidence libc (`strcat/strcpy/strcmp/memset/`
  `memcpy_bytewise/memcpy_aligned`), `boot_io_open_stream/fread/fwrite`, codec
  workers (`boot_decode_canonical_huffman_symbol` — renamed to avoid collision
  with the adaptive `boot_decode_huffman_symbol` @0xE3F0 — `read_block_header`,
  `read_packed_code`, `init_mtf_tables`), a `vec3_*` math library (copy, cross,
  dot, normalize x2, sub/add/scale x2, magnitude, weighted_blend), and a text
  renderer (`text_render_begin*`, `text_draw_string*`, `char_to_glyph_index`,
  `parse_decimal_inline`). Medium/hypothesis (kept descriptive, marked in
  dossier): `ui_set_scroll_window`, `fade_channel_*`, `emit_rdp_setup_displaylist`,
  `rand_*`, `euler_to_matrix*`. One awkward medium name kept conservative as
  `func_0000FC80` (thread-create-like; accesses `0x800BF440`).
- Dispatch tables RESOLVED (updates prior tranche): `0x800AE128` (85-entry) and
  `0x800AE2E8` (9-entry) are STATIC ROM data (z64 `0x3E528` / `0x3E6E8`), no
  runtime writers; opcode→handler map extracted (op1→`0xB888` … default→`0xB9C0`
  inside `0xB3E4`). The codec vtable: `0x800AF3B4` is the per-call working copy;
  the TRUE source vtable is RAM `0x800A876C` / ROM `0x38B6C`.
- False leads: parent "secondary entries" in the over-merged records are spurious;
  `0x10334` is a pad-then-leaf (alignment nops), not a strict preamble-orphan.
- Verification: `node --check tools/dump_function_context.js`;
  `node tools/dump_function_context.js --start 0xF22C --end 0x11000`;
  `node tools/assemble_original_mips.js`; `node tools/verify_setup.js` PASS;
  `node tools/audit_code_region.js` OK; `git diff --check` clean.
- Next frontier: `0x00011000` (chunk 1). See Next Frontier for the
  `promote_original_mips.js` merge blocker.

## 2026-06-21 - Chunk 1 Library Split (0x11000..0x21000); chunk 1 complete

Promoted and fully split the second 64 KiB code chunk. Largest source-layout
advance so far.

- Range: ROM `0x00011000..0x00021000` (**350 functions**, `asm/original/rev0/lib/`).
  Previous frontier `0x00011000`; new frontier `0x00021000`. Tracked source files
  177 -> **527**. Byte-exact preserved (code SHA `40D4E787...B409`, ROM SHA
  `571E8339...CC67A`). Dossier: `docs/dossiers/lib-chunk1-11000-21000.md`.
- **Promote-tool blocker FIXED.** `tools/promote_original_mips.js` now MERGES into
  the existing manifest (chunk 0's 177-part composite preserved), seeds each new
  chunk with a single whole-chunk part so the splitter can act on it immediately,
  and refuses same-range re-promote without `--force` (partial range overlap is
  always refused). `tools/split_original_mips_part.js` gained `--splits-file
  <json>` to avoid a 350-arg command line.
- Opening doc corrections: `boot-resource-decode-subsystem-B030-F22C.md` next
  frontier marked SUPERSEDED (now `0x11000`->`0x21000`);
  `boot-codec-libc-vec3-F22C-11000.md` typo `0xF10B98`->`0x10B98`. A full manifest
  integrity audit (contiguity + range-vs-decode-comment + sha256 + textBytes +
  duplicate-name) over all prior parts found NO mistakes.
- Method: `dump_function_context.js --start 0x11000 --end 0x21000` (277 parent
  records) -> deterministic base partition (252 files) -> 9-slice swarm
  (analyze -> adversarial review per slice; 2 slices re-run after transient API
  errors). Reviewers **un-merged** functions the parent DB hid in trailing bytes,
  **folded** read-before-write preamble-orphans forward, kept genuine dual-entries
  as one file, and demanded hard evidence for names. Net **350 files** (parent DB
  had only 277 records, incl. 26 secondaries).
- Boundary corrections (verified from disasm): parent DB hid many tiny
  jal-reachable accessor/leaf functions — e.g. `0x12400..0x12444` is SEVEN tiny
  `jr $ra` getters/setters, the `0x14338`/`0x145A8` block is ~40 jump-table
  opcode handlers, plus 6-/4-/3-/5-way un-merges at `0x130B8`/`0x1353C`/`0x18C40`/
  `0x18E4C`/`0x19050`/`0x1989C`/`0x1FFEC`/`0x20234`/`0x20BE0`. Preamble-orphans
  folded forward at `0x11168/0x17990/0x18380/0x183C4/0x15D08/0x1A87C/0x1FBA0/`
  `0x1FBCC/0x20870`. 20 genuine dual-entries kept as one file each. Straddler tail
  `euler_to_matrix_full_tail` `[0x11000,0x11168)` is the first file.
- Names: **21 descriptive, evidence-backed** (`memset`, `memmove`, `mem_byte_copy`,
  `sqrtf`, `sin_cos_approx`, `float_ldexp_d`, `list_insert_head`, `list_unlink`,
  `bump_alloc`, `cpu_set_int_mask`, `ai_get_len/ai_get_status/ai_set_next_buffer`,
  `os_inval_dcache/os_inval_icache/os_writeback_dcache/os_writeback_dcache_all`,
  `os_virtual_to_physical`, `encode_ascii_to_glyph/decode_glyph_to_ascii`,
  `set_byte_800f918d/get_byte_800f918c`) — recognizable libc / libultra / N64
  idioms. The other 328 are conservative `func_XXXXXXXX` (fabrication-averse);
  several identified-but-unproven subsystems are listed in the dossier for a
  future naming pass (unit-record interpreter, opcode-handler table, LCG random,
  allocator, free-list pairs, ~100 accessors).
- Data note: every jump table / float pool referenced here (`0x800B98B0`,
  `0x800BE690`, `0x800AE6C8/E700/E7F8/E820`, `0x800BE4xx`) is RAM data beyond
  `0x21000`, NOT embedded in this code chunk — no in-chunk data files were needed.
- Verification: `node --check` on both touched tools; manifest integrity audit
  (527 parts) PASS; an adversarial fragment check (every function contains a
  return/tail) found 0 fragments; `node tools/assemble_original_mips.js` byte-exact;
  `node tools/verify_setup.js` PASS; `node tools/audit_code_region.js` OK;
  `git diff --check` clean.
- Next frontier: `0x00021000` (chunk 2). No blocker (promote tool fixed). Stretch
  not attempted this run to keep chunk-1 boundary review thorough and the commit
  coherent.

## 2026-06-21 - Chunk 2 Library Split (0x21000..0x31000); chunk 2 complete

Promoted and fully split the third 64 KiB chunk — the most recognizable code yet.

- Range: ROM `0x00021000..0x00031000` (**216 files**, `asm/original/rev0/lib/`).
  Previous frontier `0x00021000`; new frontier `0x00031000`. Tracked source files
  527 -> **743**; generated fallback chunks 98 -> 97. Byte-exact preserved (code
  SHA `40D4E787...B409`, ROM SHA `571E8339...CC67A`). Dossier:
  `docs/dossiers/lib-chunk2-21000-31000.md`.
- Opening doc corrections this run: AGENTS.md bottom setup-state and the
  Assembly-Backed section, `docs/WORKFLOW.md` source mix, and the stale frontiers
  in both older dossiers (`boot-resource-decode-subsystem-B030-F22C.md`,
  `boot-codec-libc-vec3-F22C-11000.md`) were updated (`527`->`743`, `2`->`3`
  composites, `98`->`97`, frontier `0x21000`->`0x31000`). Full 527-part manifest
  re-audit found no prior `.s` mistakes.
- Method: same proven pipeline (`dump_function_context` 193 parent records ->
  base partition 180 files -> 10-slice analyze->adversarial-review swarm ->
  integrate -> split). All 10 slices succeeded (no API retries). Net 216 files.
- Composition (**88 descriptive, 126 `func_*`, 2 data**): this chunk is the
  statically-linked **libultra (N64 SDK) + libc + compiler 64-bit runtime + `gu`
  matrix library**. Named exactly where the idiom is unambiguous: libultra OS
  (`osException`/`__osDispatchThread`/`osSendMesg`/`osEPiRawStartDma`/`__osGetSR`/
  `__osSpRawStartDma`/`osMapTLBRdb`/…, 28), `gu` matrix (`guRotate`/`guMtxCatF`/
  `guTranslateF`/…, 12), libc (`memcpy`/`strcpy`/`sprintf`/`_Printf`/…, 17), math
  (`sin`/`cos`/`tan`/`sqrt_f64`/`hypotf`/`rand`/…, 12), 64-bit runtime
  (`udivmod_u64`/`divmod_s64`/…, 7), MMIO accessors (7), list helpers (3).
- Undetected-code recovery: the parent DB only detects standard `addiu $sp`
  prologues, so it missed the libultra exception/thread/CP0 handlers (use
  `k0`/`k1`, `mtc0`/`mfc0`, `jr $k0`); the swarm recovered them as the named OS
  functions. Straddler tail `func_00020d40_tail` `[0x21000,0x210C0)`.
- Data handled explicitly (NOT named as functions): `data_000283C4` (108 B table)
  and `data_0002E450_rsp_ucode` (`0x2E450..0x31000`, 11,184 B **RSP microcode**;
  continues into chunk 3). Cross-chunk duplicate libc/libultra symbols (static
  linking) are address-suffixed (`strcpy_0002c950`, `os_virtual_to_physical_000254e0`,
  …) to keep labels unique.
- Tooling: generalized the chunk helpers to parameterized `build/plan_chunk.js`,
  `slice_chunk.js`, `integrate_chunk.js`, `check_splits.js` (gitignored). Relaxed
  the integrator name filter to allow libultra/libc camelCase + `__`-prefixed SDK
  symbols (asm labels permit `[A-Za-z_][A-Za-z0-9_]*`) and to dedupe by address
  suffix instead of dropping to `func_`.
- Verification: manifest integrity (743 parts) PASS; fragment check (every
  function has a return/tail) 0 fragments; `node tools/assemble_original_mips.js`
  byte-exact; `node tools/verify_setup.js` PASS (3 composite chunks / 743 files /
  97 fallback); `node tools/audit_code_region.js` OK; `git diff --check` clean.
- Next frontier: `0x00031000` (chunk 3) — DATA-DOMINANT (see Next Frontier).

## 2026-06-21 - Chunk 3 Source-Ownership (0x31000..0x41000); DATA-DOMINANT

Handled chunk 3 as a data/code classification pass (not a blind function split).

- Range: ROM `0x00031000..0x00041000` (**66 parts**: 22 code `func_*` + 44 data),
  all in `asm/original/rev0/lib/`. Previous frontier `0x00031000`; new frontier
  `0x00041000`. Tracked source files 743 -> **809**; generated fallback chunks
  97 -> 96. Byte-exact preserved (code SHA `40D4E787...B409`, ROM SHA
  `571E8339...CC67A`). Dossier: `docs/dossiers/lib-chunk3-31000-41000.md` (full
  data/code index table); machine-readable `build/chunk3_index.json`.
- Opening corrections this run: (1) splitter now emits **data-specific headers**
  for `kind:'data'` parts (no "true entry/read-before-write" wording); fixed the
  two chunk-2 data files (`data_000283C4.s`, `data_0002E450_rsp_ucode.s`) +
  resynced manifest. (2) Doc wording "fully split into named functions" ->
  "fully source-owned as named code/data parts" (chunk 2 has data parts).
  (3) Re-audited all 743 prior parts (manifest integrity) — no mistakes.
- Code/data oracle = the parent **overlay map** (real RAM snapshots): it has 0
  loaded functions in `0x31000..0x3F1B0` and real functions only at
  `0x3F1B0..0x40638` + `0x40E90..0x41098`. Resolved the BSS/overlay question: the
  tail functions are overlay-relocated (`0x3F1B0`->RAM `0x800E9C20`,
  `0x40E90`->RAM `0x8016AF90`), NOT at the linear `0x800AEDB0` BSS base — so they
  are real code, RAM-suspect, kept conservative `func_*`. Three signals confirm
  `0x31000..0x3F1B0` is data (overlay map 0 fns; context 0 fns; 0 prologue+jr-ra).
- Data classification (hard evidence): a **bundle of N64 RSP microcodes** (name
  strings `RSP Gfx ucode F3DEX/F3DEX.NoN/F3DEX.Rej/F3DLX.Rej/L3DEX/S2DEX/S2DEXD …
  Yoshitaka Yasumoto 1999 Nintendo`), the **text-VM jump table** (`0x39CB0` ->
  RAM `0x800A98B0`, 306 ptr words + glyph charset), zero-fill blocks, and a few
  `data_*` "mixed — needs follow-up" spans. Bytes by class: rsp_ucode 26,160;
  text-VM table 14,656; mixed data 12,888; zero-fill 6,208; code 5,624.
- Adversarial swarm (3 agents) CONFIRMED the classification with ONE correction:
  `0x3FE68..0x3FEB4` is a frameless leaf function (true entry `0x3FE70`), not data
  — reclassified to `func_0003fe68` (the prologue scanner missed it; no frame).
  The 21 parent + 1 recovered = 22 code funcs all verified real (0 fragments).
- Straddler: `func_00040f88_chunk3head` `[0x40F88,0x41000)` continues to `0x41098`
  in chunk 4 (handle the chunk-4 tail when chunk 4 is done).
- Tooling: data-header support in `split_original_mips_part.js`; gitignored
  `build/` helpers `plan_chunk3_final.js`, `classify_chunk3.js`,
  `enrich_chunk3_index.js`, `final_index_chunk3.js`, `resync_manifest.js`.
- Verification: manifest integrity (809 parts) PASS; fragment check 0 code
  fragments; `node tools/assemble_original_mips.js` byte-exact;
  `node tools/verify_setup.js` PASS (4 composite chunks / 809 files / 96 fallback);
  `node tools/audit_code_region.js` OK; `git diff --check` clean.

## Current Dossier Set

The current boot/source-layout dossier list is long; use `docs/PLATFORM.md` for
the full quick index. The newest dossiers are:

- `docs/dossiers/lib-chunk3-31000-41000.md` (66-part chunk-3: RSP microcode bundle + text-VM tables + overlay code tail; data-dominant)
- `docs/dossiers/lib-chunk2-21000-31000.md` (216-file chunk-2 libultra/libc/gu library; chunk 2 done)
- `docs/dossiers/lib-chunk1-11000-21000.md` (350-function chunk-1 library; chunk 1 done)
- `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md` (47-function tranche; chunk 0 done)
- `docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md` (29-function tranche)
- `docs/dossiers/boot-command-stream-dispatch.md`
- `docs/dossiers/boot-command-stream-resource-node-dispatch.md`
- `docs/dossiers/boot-resource-node-payload-materialize.md`
- `docs/dossiers/boot-resource-node-insert-find.md`
- `docs/dossiers/boot-resource-node-context-materialize.md`
- `docs/dossiers/boot-resource-node-lzss-context-materialize.md`
- `docs/dossiers/boot-resource-node-overlay-context-materialize.md`
- `docs/dossiers/boot-resource-node-recursive-insert-slot-search.md`
- `docs/dossiers/boot-resource-node-recursive-cleanup-free.md`
- `docs/dossiers/boot-resource-node-recursive-payload-clear.md`
- `docs/dossiers/boot-resource-node-recursive-field0c-rewrite.md`
- `docs/dossiers/boot-resource-node-recursive-child-free.md`
- `docs/dossiers/boot-resource-node-recursive-key-field-clear.md`
- `docs/dossiers/boot-byte-copy-fill-aligned-leaves.md`
- `docs/dossiers/boot-lzss-decompress.md`
- `docs/dossiers/boot-resource-record-mark-ready.md`
- `docs/dossiers/boot-resource-loader-callback-register.md`

## Next Frontier

Chunks 0, 1, 2 and 3 (`0x00001000..0x00041000`) are fully source-owned as named
code/data parts (chunk 2: 2 data parts; chunk 3: 44 data + 22 code parts).
The next frontier is **`0x00041000` (chunk 4)**.

FIRST: continue the chunk-3 straddler. `func_00040f88_chunk3head` `[0x40F88,
0x41000)` continues to `0x41098` in chunk 4 — the chunk-4 first file is its tail
`[0x41000, 0x41098)` (name it `func_00040f88_chunk4tail` or fold per the proven
straddler pattern). It is overlay-relocated code (RAM `0x8016AF90+`), RAM-suspect.

Then classify chunk 4. Determine its code/data mix FIRST (use the parent overlay
map as the code/data oracle, as for chunk 3, plus `dump_function_context --start
0x41000 --end 0x51000`). If it is mostly overlay code, use the function-split
pipeline (conservative `func_*` for overlay-relocated code; real RAM in
`ob64_overlay_map.json`); if data-dominant, use the chunk-3 data-classification
pass (`build/plan_chunk3_final.js` + `classify`/`enrich`/`final_index` helpers are
generalizable). The 10% evidenced-executable target `0x000468F8` is inside chunk 4
(chunks 0–3 already cover 9.20% of the 2,849,204-byte executable extent).

There are now two active tracks. The library source-ownership track continues at
`0x41000` (chunk 4) as above. The full-ROM coverage track (opened 2026-06-21) next refines
the exact code/data boundary near `0x002B89B4` and reclassifies the non-code tail
`0x002B89B4..0x0063676C` from `original_mips` to a data source form, shrinking the
configured code region to the executable extent while keeping the exact rebuild
gate green. See `docs/CODE_REGION_AUDIT.md` and `docs/NEXT_STEPS.md`.
