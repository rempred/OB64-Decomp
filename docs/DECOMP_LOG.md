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
- Current tracked code source mix: one composite real-assembler chunk
  `0x00001000..0x00011000` made from 177 tracked source files, plus 99 generated
  fallback code chunks. **Chunk 0 is now fully split into named functions**
  (`0x00001000..0x00011000`); next is chunk 1 (`0x00011000`, still a generated
  fallback chunk — see Next Frontier for the promote-tool blocker).
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
- Current remainder: none in chunk 0 (`0x1000..0x11000` fully named). Next is
  chunk 1 generated fallback `0x00011000..0x00021000`.

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

## Current Dossier Set

The current boot/source-layout dossier list is long; use `docs/PLATFORM.md` for
the full quick index. The newest dossiers are:

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

Chunk 0 (`0x00001000..0x00011000`) is fully split into named functions. The next
frontier is **`0x00011000` (chunk 1)**, but first clear the BLOCKER below.

BLOCKER for chunk 1 (must fix before promoting it): `tools/promote_original_mips.js`
**overwrites** `asm/original/rev0/manifest.json` with ONLY the newly-promoted
chunk (it builds `manifest.chunks = promoted` and writes), so running it for
chunk 1 would clobber chunk 0's 177-part composite. Multi-chunk promotion was
never implemented. Fix: make it MERGE (load the existing manifest, append new
chunks by range, refuse to overwrite an existing chunk unless `--force`). Then
`node tools/promote_original_mips.js --chunk <chunk1 file>` and split with
`tools/split_original_mips_part.js`.

Chunk-boundary straddler: `euler_to_matrix_full` is `0x10FE0..0x11168`; its head
`[0x10FE0,0x11000)` is the last chunk-0 file, and the tail `[0x11000,0x11168)`
is the head of chunk 1's first file (name it as the straddler continuation).

Reaching the 4% target `0x0001CD34` needs ~201 chunk-1 functions; the boundary
planner shows 25 preamble-orphans + 26 dual/secondary entries in chunk 1, so
budget for heavy boundary validation. Seed with
`node tools/dump_function_context.js --start 0x11000 --end <next>` (now correct
exclusive ends). Subsystem/globals context:
`docs/dossiers/boot-codec-libc-vec3-F22C-11000.md` and
`docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`.

There are now two active tracks. The boot function-split track continues at
`0x11000` (chunk 1) as above. The full-ROM coverage track (opened 2026-06-21) next refines
the exact code/data boundary near `0x002B89B4` and reclassifies the non-code tail
`0x002B89B4..0x0063676C` from `original_mips` to a data source form, shrinking the
configured code region to the executable extent while keeping the exact rebuild
gate green. See `docs/CODE_REGION_AUDIT.md` and `docs/NEXT_STEPS.md`.
