# Data-Inventory / Index Audit — Rev 0 chunks 0–11 (`0x00001000..0x000C1000`)

One-shot retroactive audit of the **already source-owned DATA spans** in the first
12 promoted 64 KiB chunks. **No `.s` source file was modified.** This pass
classifies every data part, computes the parsed / raw-but-classified / undecoded
byte split, flags proven mislabels, and emits conservative machine-readable JSON
indexes for the clearest spans (under `docs/data-index/rev0/`).

Source of truth: `asm/original/rev0/manifest.json` (121 data parts in 0x1000..0xC1000,
identified by file-name class `data_`/`table_`/`rodata_`/`zero_fill_`/`rsp_ucode_`)
cross-checked against the chunk dossiers (`docs/dossiers/lib-chunk{3,5,6,7,8}-*.md`)
and direct byte reconstruction from each part's `.word` lines.

## Where the data lives

| Chunk | Range (z64) | Data parts | Data bytes | Character |
|---|---|---:|---:|---|
| 0 | `0x01000..0x11000` | 0 | 0 | all code (boot) |
| 1 | `0x11000..0x21000` | 0 | 0 | all code |
| 2 | `0x21000..0x31000` | 2 | 11,292 | tail RSP ucode + 1 zero blob |
| 3 | `0x31000..0x41000` | 44 | 59,912 | **DATA-DOMINANT**: RSP ucode bundle + text-VM jump table + rodata + zero-fill |
| 4 | `0x41000..0x51000` | 0 | 0 | all (overlay) code |
| 5 | `0x51000..0x61000` | 11 | 19,960 | game-data tail: display-list + string pools + record/pointer tables |
| 6 | `0x61000..0x71000` | 18 | 27,344 | item/equipment data + 6 inline code-island pointer tables + tail blob |
| 7 | `0x71000..0x81000` | 22 | 5,648 | Controller-Pak / save-menu data + 1 straddled blob |
| 8 | `0x81000..0x91000` | 24 | 6,632 | mission-name + options-menu pools + record/pointer tables |
| 9 | `0x91000..0xA1000` | 0 | 0 | **all code** |
| 10 | `0xA1000..0xB1000` | 0 | 0 | **all code** |
| 11 | `0xB1000..0xC1000` | 0 | 0 | **all code** |
| **Total** | | **121** | **130,788** | |

Chunks 0, 1, 4, 9, 10, 11 contain **zero** classified data parts (confirmed: the
manifest lists only `func_*`/straddler parts there). Data is concentrated in
chunk 3 (microcode + VM tables) and chunks 5–8 (game data).

## Totals: parsed / raw-but-classified / undecoded

Over all 130,788 data bytes in `0x1000..0xC1000`:

| State | Bytes | % | What it covers |
|---|---:|---:|---|
| **parsed** | **22,408** | 17.1% | Fully enumerable: 6 string pools (mission, options, element, attack, item-name string portion, Controller-Pak pools) + 2 fixed-stride record tables (0x48-stride ×165, 0x10-stride ×158). |
| **raw-but-classified** | **95,384** | 72.9% | Type known, fields not fully decoded: RSP microcode (37,344), pointer/record tables (23,536 incl. the text-VM jump table), zero-fill (6,300), rodata float/charset spans, and the `data_*` packed-record/display-list blobs whose container type is known. Includes the ~10,040-byte non-string tail of `rodata_000613b0`. |
| **undecoded** | **12,996** | 9.9% | Type genuinely uncertain: chunk-3 `data_*` "mixed — follow-up" spans (`data_00035280`, `data_00037480`, `data_0003c180/0003c800/0003cc40/0003d040/0003d440/0003d880`, `data_00040638`) interleaved in the ucode bundle, plus the chunk-2 `data_000283C4` zero blob. |

By class (independent of state): microcode 37,344 · mixed `data_*` 44,884 ·
pointer/record-tables 23,536 · rodata/string-pools 18,724 · zero-fill 6,300.

## Master inventory

Zero-fill blocks in chunk 3 are numerous and trivially classified; the 23 chunk-3
`zero_fill_*` parts (6,208 B total) are collapsed into one row. All other parts are
listed individually. `has-dossier-table` = the span appears in a dossier code/data
map. `json` = a `docs/data-index/rev0/*.json` index was emitted for it this pass.

| Chunk | Part | Range (z64) | Bytes | Class | State | Dossier | json | Evidence / notes |
|---|---|---|---:|---|---|:--:|:--:|---|
| 2 | `data_000283C4` | `0x283C4..0x28430` | 108 | zero-fill(?) | undecoded | y | n | 108 bytes all `0x00`; labeled `data_` but content is pure zero — see mislabels. |
| 2 | `data_0002E450_rsp_ucode` | `0x2E450..0x31000` | 11,184 | microcode | raw-classified | y | n | Tail of the RSP ucode bundle; continues into chunk 3. |
| 3 | `rsp_ucode_bundle_00031000` | `0x31000..0x31900` | 2,304 | microcode | raw-classified | y | n | RSP ucode bundle (continues from chunk 2). |
| 3 | `rsp_ucode_text_*` (×5) | `0x31BC0..0x37400` | 16,256 | microcode | raw-classified | y | n | F3DEX-family ucode instruction sections. |
| 3 | `rsp_ucode_f3dex / _non / _rej / f3dlx_rej / l3dex / s2dex / s2dexd` | `0x3C600..0x3F1B0` | 7,584 | microcode | raw-classified | y | n | Per-variant ucode name/data sections (name strings prove identity). |
| 3 | `data_00035280` | `0x35280..0x35F80` | 3,328 | unknown | undecoded | y | n | Mixed rodata/table inside the ucode bundle — "follow-up". |
| 3 | `data_00037480` | `0x37480..0x386C0` | 4,672 | unknown | undecoded | y | n | Mixed data, ~30 pointer words — "follow-up". |
| 3 | `table_text_vm_jump_table` | `0x387C0..0x3C100` | 14,656 | pointer-table | raw-classified | y | n | text-VM jump table @0x39CB0 → RAM 0x800A98B0 + glyph charset; 306 ptr words. RAM is overlay-relocated. |
| 3 | `data_0003c180 / 0003c800 / 0003cc40 / 0003d040 / 0003d440 / 0003d880` | within `0x3C180..0x3D9C0` | 2,368 | unknown | undecoded | y | n | Six small "mixed — follow-up" blobs interleaved with the ucode variants. |
| 3 | `data_00040638` | `0x40638..0x40E90` | 2,136 | unknown | undecoded | y | n | Mixed data, 19 ptr words, between two overlay code groups — "follow-up". |
| 3 | `zero_fill_*` (×23) | scattered `0x31900..0x386C0`+ | 6,208 | zero-fill | raw-classified | y | n | Uninitialized-data image blocks between ucode sections. |
| 5 | `data_0005c208` | `0x5C208..0x5CE70` | 3,176 | display-list | raw-classified | y | n | RSP/RDP F3DEX2 GBI command image (E7/DC/SetCombine…), terminates E7+DF. Not CPU code. |
| 5 | `rodata_0005ce70` | `0x5CE70..0x5CEBC` | 76 | string-pool | parsed | y | n* | AI-behaviour names (Autonomous / Attack-Strongest/Leader/Weakest). *Small; enumerated in report, not separate json. |
| 5 | `table_0005cebc` | `0x5CEBC..0x5CEC4` | 8 | record-table | raw-classified | y | n | 8-byte permutation `{07 02 06 03 05 04 01 00}`. |
| 5 | `table_0005cec4` | `0x5CEC4..0x5CEE4` | 32 | pointer-table | raw-classified | y | n | 8 RAM-pointer words (AI-string ptrs). |
| 5 | `data_0005cee4` | `0x5CEE4..0x5D510` | 1,580 | record-table | raw-classified | y | n | Byte-array (id,value) records + glyph-index subarray; interior zero gaps. |
| 5 | `table_0005d510` | `0x5D510..0x5D560` | 80 | pointer-table | raw-classified | y | n | 6× (RAM-pointer, count) pairs + zero pad. |
| 5 | `rodata_0005d560` | `0x5D560..0x5D5FC` | 156 | string-pool | parsed | y | **y** | Element names (15) → `chunk05-element-name-pool.json`. |
| 5 | `rodata_0005d5fc` | `0x5D5FC..0x5DAD4` | 1,240 | string-pool | parsed | y | **y** | Attack/spell names (100) → `chunk05-attack-name-pool.json`. |
| 5 | `table_0005dad4` | `0x5DAD4..0x5DB18` | 68 | pointer-table | raw-classified | y | n | 18 RAM-pointer words into a `0x80187660` block. |
| 5 | `data_0005db18` | `0x5DB18..0x60980` | 11,880 | record-table | parsed | y | **y** | 0x48-stride ×165, RAM ptr @+0x44 → `chunk05-record-table-0x48.json`. |
| 5 | `data_00060980` | `0x60980..0x61000` | 1,664 | record-table | parsed | y | **y** | 0x10-stride, ptr @+0xC; straddles to chunk 6 → `chunk05-06-record-table-0x10.json`. |
| 6 | `data_00061000` | `0x61000..0x6136C` | 876 | record-table | parsed | y | **y** | Continuation of the 0x10-stride table (same json). |
| 6 | `table_0006136c` | `0x6136C..0x613B0` | 68 | pointer-table | raw-classified | y | n | Glyph/index byte table + 4 RAM ptr words. |
| 6 | `rodata_000613b0` | `0x613B0..0x64A44` | 13,972 | string-pool + record | parsed (partial) | y | **y** | **MIXED**: string pool `0x613B0..0x6230C` (277 item names, enumerated) then ~10,040 B of RAM-pointer/record data → `chunk06-item-name-pool.json` (string portion only). |
| 6 | `table_00064a44` | `0x64A44..0x64BE0` | 412 | pointer-table | raw-classified | y | n | 103 RAM-pointer words (0x8018E/0x80190). |
| 6 | `data_00064be0` | `0x64BE0..0x665C8` | 6,632 | mixed | raw-classified | y | n | Interleaved strings + small ptr tables + records. |
| 6 | `table_000665c8` | `0x665C8..0x66B58` | 1,424 | pointer-table | raw-classified | y | n | ~485 RAM-pointer words (0x80170/0x80171). |
| 6 | `rodata_00066b58` | `0x66B58..0x66C28` | 208 | rodata(float) | raw-classified | y | n | Float consts (30.0) + a `string_dsp()` debug fragment. |
| 6 | `table_00066c28` | `0x66C28..0x66D4C` | 292 | pointer-table | raw-classified | y | n | 73 words (0x8017Bxxx). |
| 6 | `data_00066d4c` | `0x66D4C..0x66DA0` | 84 | record-table | raw-classified | y | n | `0x01DExxxx` offset/record block (21 entries). |
| 6 | `table_00066da0` | `0x66DA0..0x66DB8` | 24 | pointer-table | raw-classified | y | n | 6 words (0x80184xxx). |
| 6 | `data_00066db8` | `0x66DB8..0x66E10` | 88 | mixed | raw-classified | y | n | Byte/level lookup + start of "Blue Knights" string. |
| 6 | `data_000694b0` / `table_00069618` / `data_000698dc` | `0x694B0..0x69900` | 1,104 | pointer-table | raw-classified | y | n | Inline data islands inside the code region (~166 RAM ptr words). |
| 6 | `data_0006df80 / 0006e528 / 0006e5dc` | `0x6DF80..0x6E660` | 1,760 | pointer-table | raw-classified | y | n | Inline `0x6Exxx` island family (RAM ptr words). |
| 6 | `data_00070e70` | `0x70E70..0x71000` | 400 | packed-record | raw-classified | y | n | RAM ptr + packed F2/F3 record stream; straddles to chunk 7. |
| 7 | `data_00071000` | `0x71000..0x71258` | 600 | packed-record | raw-classified | y | n | Tail of chunk-6 `data_00070e70` blob (straddler-in). |
| 7 | `table_00071258` | `0x71258..0x71280` | 40 | pointer-table | raw-classified | y | n | 10-word RAM-pointer table (0x80197Cxx). |
| 7 | DATA2 `table_*` (×10) | within `0x783A0..0x79730` | ~3,400 | pointer-table | raw-classified | y | n | Parallel string-pointer arrays (18/55/128/424/12/15-word…) of 0x801A/0x8019/0x8017 ptrs. |
| 7 | DATA2 `data_*` (×6) | within `0x783A0..0x79730` | ~250 | record/index | raw-classified | y | n | Glyph-width/progression index arrays + a UI rect/layout record block. |
| 7 | DATA2 `rodata_*` (×8) | within `0x783F8..0x79730` | ~1,950 | string-pool | parsed | y | **y** | Controller-Pak / save-menu pools → `chunk07-controller-pak-strings.json`. |
| 8 | `data_00085820` / `data_000858e4` | `0x85820..0x85960` | 280 | packed-record | raw-classified | y | n | Packed delta/offset/index blobs (0x02–0x27 values, 0xFF delimiters). |
| 8 | `rodata_00085960` | `0x85960..0x85C60` | 768 | string-pool | parsed | y | **y** | Mission/location names (40) → `chunk08-mission-name-pool.json`. |
| 8 | `rodata_00085c60` | `0x85C60..0x85EA8` | 584 | string-pool | parsed | y | **y** | Options-menu + chapter + element names (54) → `chunk08-options-menu-pool.json`. |
| 8 | `data_00085ea8` | `0x85EA8..0x86010` | 360 | record | raw-classified | y | n | Animation/display-bytecode records. |
| 8 | `table_00086010 / 000864a0 / 00086728 / 00086828 / 00086ef0 / 0008717c / 000871c0` | within `0x86010..0x87200` | 2,592 | pointer/record-table | raw-classified | y | n | Stride-8 {index, RAM ptr 0x801A6xxx} records + RAM-pointer tables. |
| 8 | `data_0008678c / 0008687c / 00086968 / 00086a70 / 00087154 / 000871a4` | within `0x8678C..0x871C0` | 1,856 | record | raw-classified | y | n | Display-bytecode (0xE2/E3/E7/DF lead) + small-value/coord record blobs. |
| 8 | `zero_fill_*` (×4) | `0x85818 / 0x858BC / 0x86864 / 0x86954` | 92 | zero-fill | raw-classified | y | n | Padding/lead-in nops. |

(The `~` byte figures for chunk-7 DATA2 sub-groups are group sums; per-part exact
bytes are in the manifest. Totals above are computed from the manifest, not these
rounded group rows.)

## PROVEN MISLABELS TO FIX

One concrete candidate; the rest of the corpus is honestly labeled.

- **`data_000283C4`** (`0x283C4..0x28430`, 108 B, chunk 2): content is **108 bytes
  of `0x00`** (verified by byte reconstruction). It is functionally a
  **zero-fill / BSS-image** block, not initialized data. Recommended class:
  `zero_fill_000283c4` (matching the chunk-3 convention). *Severity: cosmetic* —
  the bytes are correct and byte-exact; only the class prefix is arguably wrong. It
  is possible the original object intends a deliberately-zeroed data table (not
  `.bss`), in which case `data_` is defensible; flagged for the chunk-2 owner to
  confirm before any rename. **Not auto-fixed** (audit is read-only on `.s`).

### Classification refinement (NOT a mislabel, but worth recording)

- **`rodata_000613b0`** (`0x613B0..0x64A44`, 13,972 B): the `rodata_` name fits the
  **first 3,932 bytes** (`0x613B0..0x6230C`, 277 NUL-terminated item names) but the
  **remaining ~10,040 bytes** (`0x6230C..0x64A44`) are RAM-pointer (`0x8018xxxx`/
  `0x8019xxxx`) and packed-record data — **not strings**. The dossier label
  "weapon/item NAME string pool" describes the leading content only. This is a
  single manifest part spanning two content types; the JSON index covers only the
  verified string sub-range. No rename recommended (the part is one promoted span),
  but the mixed nature is documented here and in the index `notes`.

## JSON indexes written (8)

All validated (`JSON.parse` OK) and every offset/range cross-checked against the
manifest (0 out-of-bounds). Under `docs/data-index/rev0/`:

| File | Part(s) | Class | Entries |
|---|---|---|---:|
| `chunk08-mission-name-pool.json` | `rodata_00085960` | string-pool | 40 |
| `chunk08-options-menu-pool.json` | `rodata_00085c60` | string-pool | 54 |
| `chunk05-element-name-pool.json` | `rodata_0005d560` | string-pool | 15 |
| `chunk05-attack-name-pool.json` | `rodata_0005d5fc` | string-pool | 100 |
| `chunk06-item-name-pool.json` | `rodata_000613b0` (string portion) | string-pool | 277 |
| `chunk07-controller-pak-strings.json` | 8 chunk-7 DATA2 rodata pools | string-pool | 8 sections |
| `chunk05-record-table-0x48.json` | `data_0005db18` | record-table | 165 |
| `chunk05-06-record-table-0x10.json` | `data_00060980`+`data_00061000` | record-table | 158 |

Indexes are conservative: string pools list exact offset+text (non-ASCII as
`{XX}`); record tables list stride/count and **only** the proven RAM-pointer field
offset, with all other per-record bytes left as undecoded scalars. RAM pointers are
**overlay runtime** addresses (NOT a linear ROM back-map) per repo rules, so they
are recorded as opaque values, not resolved.

## Encoding notes (used by the string-pool indexes)

- `0x0E` … `0x0F` bracket a single logical string; `0x10 0x34` (`{10}4`) and
  `0x10 0x63` (`{10}c`) are in-string **line-break / second-line markers**;
  `0x10 0x30` (`{10}0`) also appears. NUL pads entries to ~4-byte alignment.
- The "1 length byte" wording in the chunk-8 dossier for `rodata_00085960` is
  **imprecise**: the lead byte is a constant `0x0E` control prefix, not a per-entry
  length (e.g. "Castro Canyon" is 13 chars but the lead byte is `0x0E`). The index
  documents the true `0x0E`/`0x0F` framing.
- Cross-part string spill: "Alba" at the very end of `rodata_00085960` has its final
  `a`+`0x0F` in the next part (`rodata_00085c60` at `0x85C60`); the options index
  excludes those 4 lead bytes.

## Follow-up recommendations (ranked)

1. **Decode the two parsed record tables' scalar fields.** `data_0005db18`
   (0x48-stride ×165, one of the larger structured tables in the game-data region)
   and the `0x10`-stride table (`data_00060980`+`data_00061000`, ×158) each have a
   confirmed RAM-pointer field; the remaining 0x44 / 0x0C scalar bytes are the
   highest-value undecoded structured data. Pair with overlay-aware RAM resolution
   (`scripts/ob64_overlay_map.json`) to follow the pointer fields to their targets.

2. **Wire the string pools to their pointer tables.** The item-name pool tail
   (`rodata_000613b0` `0x6230C+`), `table_00064a44` (103 ptrs), `table_000665c8`
   (~485 ptrs), and the chunk-7 DATA2 `table_*` arrays are parallel pointer arrays
   into the enumerated string pools. Resolving pointer→string index would turn the
   item/equipment/mission/attack/element name pools into id-keyed indexes (directly
   useful for the editor, given item IDs are 1-based and class def record_index =
   class_id+1).

3. **Resolve the chunk-3 `data_* "follow-up"` blobs (12,996 undecoded bytes).**
   `data_00035280`, `data_00037480`, the six `0x3Cxxx/0x3Dxxx` blobs, and
   `data_00040638` are interleaved with the RSP ucode bundle. A ucode-aware
   disassembler (or matching against a known F3DEX2 build) would reclassify these as
   ucode data sections vs. genuine CPU rodata, eliminating most of the remaining
   "undecoded" bytes in the entire 0x1000..0xC1000 window.
