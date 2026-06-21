# Boot Codec / libc / vec3 Tranche — `0x0000F22C..0x00011000`

Static dossier for the Rev 0 split/naming tranche that finishes chunk 0
(`0x00001000..0x00011000`). Covers `0x0000F22C..0x00011000` = **47 functions**.
Evidence: in-repo disassembly + parent DB (`scripts/ob64_functions.json`,
`ob64_symbols_v2.json`, `ob64_callgraph_v2.json`, `ob64_xrefs.json`), a 6-agent
analysis swarm, an adversarial review (verified every boundary from disasm), and
maintainer integration. The parent `end_rom` is INCLUSIVE; exclusive end =
`end_rom + 4` (see `tools/dump_function_context.js` regression guard).

## What's here

This region continues the decompressor codec from the prior tranche and then
turns into **shared low-level libraries**: a libc string/mem set, a buffered
stream-I/O layer, a 3-vector float math library, a text/glyph renderer, and RNG
helpers. Most are high-confidence (clear algorithmic idioms); medium ones are
marked hypothesis.

### Headline boundary findings

The parent DB **under-segmented** several regions (merged multiple functions into
one with spurious "secondary entries"). The swarm un-merged them, verified from
disasm:

- `0xF734..0xF8B0` is **4** functions: `boot_decode_init_mtf_tables`
  (`0xF734..0xF808`) + **`strcat`** (`0xF808`) + **`strcpy`** (`0xF850`) +
  **`strcmp`** (`0xF87C`).
- `0xF8B0..0xF970` is **2**: **`memset`** (`0xF8B0..0xF8E4`) +
  `boot_io_open_stream` (`0xF8E4`).
- `0x10B98..0x10CE4` is **3**: `text_draw_string_flagged` (`0x10B98..0x10BDC`) +
  `char_to_glyph_index` (`0x10BDC`) + `parse_decimal_inline` (`0x10C94`).
- `0x10CF0..0x10D98` is **2**: `rand_unit_double` (`0x10CF0..0x10D70`) +
  `memcpy_bytewise` (`0x10D70`).
- `0xFA48` and `0xF9D8` carry trailing dead-padding / inline-leaf tails (kept with
  the function; noted).

Preamble-orphans (true entry precedes the parent label; the head loads a global
consumed read-before-write): `0xF22C` (parent `0xF23C`), `0xFDB8` (`0xFE38`),
`0x1054C` (`0x10590`), `0x10E70` (`0x10E7C`, float `lwc1`+`mtc1` preamble), and
the straddler `0x10FE0`. (`0x10334` is a pad-then-leaf — 3 alignment nops, not a
strict orphan; `0x10190` is a guard-load orphan.) Dual-entry fallthroughs merged
as one file: `0x10500`/`0x10528`, `0x107B8`/`0x107C0`.

**Chunk-boundary straddler:** `euler_to_matrix_full` is `0x10FE0..0x11168`,
crossing the `0x11000` chunk boundary. Only its head `[0x10FE0,0x11000)` is in
this chunk-0 file; the tail `[0x11000,0x11168)` is the start of chunk 1.

## Function table (47)

| ROM range | name | conf | role |
|---|---|---|---|
| F22C..F5A0 | boot_decode_canonical_huffman_symbol | high | canonical-Huffman symbol decode over shared bit stream (vs prior-tranche adaptive `boot_decode_huffman_symbol` @0xE3F0) |
| F5A0..F618 | boot_decode_read_block_header | high | reads block header bits (1/11/4/8) via bit reader 0xC65C |
| F618..F734 | boot_decode_read_packed_code | high | packed run/length nibble code reader |
| F734..F808 | boot_decode_init_mtf_tables | high | inits default symbol/MTF/window tables in work buffer 0x800AF3A8 |
| F808..F850 | strcat | high | libc strcat (find NUL, append, re-terminate, return dest) |
| F850..F87C | strcpy | high | libc strcpy |
| F87C..F8B0 | strcmp | high | libc strcmp (masked byte compare, b0-b1) |
| F8B0..F8E4 | memset | high | libc memset (byte fill) |
| F8E4..F970 | boot_io_open_stream | high | stream/file open helper |
| F970..F9D8 | boot_io_fread | high | buffered read (referenced by 0xB3E4/0xC990) |
| F9D8..FA48 | boot_io_fwrite | high | buffered write |
| FA48..FC80 | ui_set_scroll_window | medium | hypothesis: scroll-window setup |
| FC80..FCE4 | func_0000FC80 | medium | thread-create-like; accesses 0x800BF440 (kept conservative) |
| FCE4..FDB8 | boot_subsystem_init_and_dispatch | medium | hypothesis: subsystem init/dispatch loop |
| FDB8..FE38 | fade_channel_init_1ch | medium | hypothesis (preamble-orphan) |
| FE38..FF04 | fade_channel_init_3ch | medium | hypothesis |
| FF10..FF60 | fade_channel_step_clamp | medium | hypothesis |
| FF60..10108 | emit_rdp_setup_displaylist | medium | hypothesis: RDP setup DL emit |
| 10110..1018C | rand_float_unit | medium | hypothesis RNG |
| 10190..10244 | rand_gaussian_cached | medium | hypothesis RNG (guard-orphan) |
| 10250..10270 | vec3_copy | high | 3-float copy |
| 10270..102E0 | vec3_distance | medium | 3-vec distance |
| 102E0..10334 | vec3_cross_product | high | cross product |
| 10334..10370 | vec3_dot_product | high | dot product (pad-then-leaf entry) |
| 10370..103D0 | vec3_normalize_to | high | normalize into dest |
| 103D0..1043C | vec3_normalize_inplace | high | normalize in place |
| 1043C..10480 | vec3_sub | high | subtract |
| 10480..104C0 | vec3_scale | high | scale |
| 104C0..10500 | vec3_add | high | add |
| 10500..1054C | vec3_magnitude_checked | high | magnitude w/ guard (dual-entry) |
| 1054C..10590 | vec3_sub_inplace | high | subtract in place (preamble-orphan) |
| 10590..105D0 | vec3_scale_inplace | high | scale in place |
| 105D0..10610 | vec3_add_inplace | high | add in place |
| 10610..10680 | vec3_weighted_blend | high | weighted blend |
| 10680..1068C | set_dl_cursor | high | tiny DL-cursor setter |
| 1068C..10704 | text_render_begin | high | text render begin (preamble-orphan) |
| 10704..107B8 | text_render_begin_at | high | text render begin at x/y |
| 107B8..10B68 | text_draw_string | high | main glyph-string draw (dual entry 0x107B8→0x107C0) |
| 10B68..10B98 | text_draw_string_xy | high | positioned wrapper |
| 10B98..10BDC | text_draw_string_flagged | high | flagged wrapper |
| 10BDC..10C94 | char_to_glyph_index | high | char→glyph/value map (caller is text renderer) |
| 10C94..10CF0 | parse_decimal_inline | high | inline decimal parse |
| 10CF0..10D70 | rand_unit_double | medium | hypothesis RNG |
| 10D70..10D98 | memcpy_bytewise | high | byte memcpy |
| 10D98..10E70 | memcpy_aligned | high | word-aligned memcpy |
| 10E70..10FE0 | euler_to_matrix3 | medium | hypothesis: euler→3x3 (float preamble-orphan) |
| 10FE0..11000 | euler_to_matrix_full | medium | hypothesis; **straddler head** (continues to 0x11168 in chunk 1) |

## Runtime dispatch tables — RESOLVED (updates prior tranche)

The dispatch worker resolved the prior tranche's open question. The "runtime"
tables are actually **statically-initialized DATA baked into the boot code image
in ROM** — an xref scan found **zero writers** anywhere:

- **`0x800AE128`** (85-entry, consumed by `boot_resource_tag_record_decode`
  `0xB3E4`) = static data at z64 ROM **`0x0003E528`**. Opcode→handler (all inside
  `0xB3E4`): op1→`0xB888`, op2→`0xB8D0`, op64→`0xB92C`, op80→`0xB964`,
  op81→`0xB980`, op84→`0xB9A4`, default (79 opcodes)→`0xB9C0`.
- **`0x800AE2E8`** (9-entry, consumed by `boot_resource_op_dispatch` `0xBE98`) =
  static data at z64 ROM **`0x0003E6E8`**; entries → ROM `0xBEF8/0xBF08/0xBF18/0xBF28`.
- **Codec vtable correction:** `0x800AF3B4` is the per-call *working copy* written
  by `boot_decode_driver` `0xC310`; the TRUE codec source vtable is RAM
  **`0x800A876C`** / ROM **`0x00038B6C`** (3 words/entry).

These table addresses (`0x3E528`/`0x3E6E8`) and the vtable (`0x38B6C`) are DATA
inside the configured code region but in a not-yet-split generated chunk — flag
for the data-vs-code reclassification work when those chunks are reached.

## Verification

- `node tools/dump_function_context.js --start 0xF22C --end 0x11000` (fixed
  end_rom semantics).
- `node tools/split_original_mips_part.js …` → 47 named parts (true-entry labels
  on preamble-orphans / un-merged sub-functions).
- `node tools/verify_setup.js` → PASS, byte-exact (code SHA `40D4E787…B409`,
  ROM SHA `571E8339…CC67A` unchanged; 177 tracked source files).
- `node tools/audit_code_region.js` → unchanged executable-extent finding.

## Next frontier

`0x00011000` (chunk 1). The straddler tail `[0x11000,0x11168)` is the head of
chunk 1's first file. Reaching the 4% target `0x0001CD34` requires ~201 more
functions across chunk 1 and a fix to `tools/promote_original_mips.js` (it
currently overwrites `manifest.json` with only the newly-promoted chunk, which
would clobber chunk 0's parts — multi-chunk promotion needs a merge). See
`docs/NEXT_STEPS.md`.
