# Boot Resource/Decode Subsystem — `0x0000B030..0x0000F22C`

Static dossier for the Rev 0 MIPS split/naming tranche covering ROM
`0x0000B030..0x0000F22C` (29 functions, ~0x41FC bytes). Evidence comes from the
in-repo disassembly (`asm/original/rev0/code_0000B030_00011000.s` before the
split), the parent overlay-aware DB (`scripts/ob64_functions.json`,
`ob64_symbols_v2.json`, `ob64_callgraph_v2.json`, `ob64_xrefs.json`), and direct
disassembly review. Decode comments and parent labels are evidence, not proof.

Analysis method: `tools/dump_function_context.js --start 0xB030 --end 0xF23C`
(context join) + a 6-cluster analysis swarm + an adversarial review pass +
maintainer hazard re-verification of the jump tables, callback, and dual-entry.

## Subsystem overview

This is **permanent/core code, active in all 7 captured states** (world_map …
combat) — not a combat overlay. It is a tagged resource-archive loader plus a
custom decompressor, in three layers:

1. **Front end** (`0xB030..0xBE98`): external callers (20+ sites, chiefly via
   `boot_resource_archive_load_many` `0xB0B0`) request an archive. `0xB0B0`/
   `0xB29C` open an archive descriptor (`jal 0x8007F4E4`, global table
   `0x800BE0A8`), bracket work with the begin/end pool manager `0xB33C` (built on
   `seed::resource_alloc 0x1330` / `seed::resource_free 0x16C4` over the list at
   `0x800B884C`), decode each tagged record with the 85-way jump-table decoder
   `0xB3E4` into a 0x12C-byte record struct (stream cursor `0x800AF390`), and
   resolve/load referenced sub-resources via `0xBC8C` → op-dispatcher `0xBE98`.
   `0xB030` is a separate, simpler driver that walks descriptor list
   `0x800BF320` and calls `seed::lzss_decompress 0xA510` directly.
2. **Decode + verify core** (`0xBE98..0xC310`): the 9-way dispatcher `0xBE98`
   routes to `func_0000C990` (buffered fread/fwrite copy + CRC16) and the
   pluggable decode driver `boot_decode_driver 0xC310`, which installs 3 codec
   callbacks (jalr from the vtable at `0x800AF3B4`) and hosts the shared
   bit-reader (secondary `0xC65C`) and the CRC16/MODBUS (poly `0xA001`) table
   builder (secondary `0xC604`). `boot_decode_build_huffman_table 0xC024` is the
   shared canonical-Huffman table builder (5 callers).
3. **Huffman/DEFLATE + adaptive-Huffman codec** (`0xC778..0xF22C`): two related
   entropy coders sharing one state block. A canonical/DEFLATE-style path
   (`func_0000CB4C`, `func_0000CEB8`, `func_0000D248` read-symbol, `…EADC`
   litlen, `…EC00` distance, `…ECF0` code-lengths) rebuilds Huffman tables from
   the bitstream using constants `0x11E`=286 / `0x11D`=285 / 16 levels; an
   adaptive (LZHUF/FGK-style) path (`…DBBC` StartHuff, `…D9B8` reconstruct,
   `…DCA8`+`0xDFF4` update, `func_0000D600` DecodeChar, `…D994` reset, plus the
   cluster-E decoders `0xE1F0/0xE204/…E3F0/func_0000E708/…EA98`) maintains a
   frequency/son/parent tree (628-entry parallel arrays at
   `0x800AF418..0x800AF430`, `0x8000` renorm threshold).

**Shared state block** `0x800AF360..0x800AF4xx`: bit window `+0x3C2`, bit count
`+0x3C5`, next byte `+0x3C4`, byte counter `+0x398`, stream struct `+0x36C`,
block counter `+0x3C6`, CRC accumulator `+0x3C0` / table `+0x3F8`, decode tables
`+0x3FC/+0x400/+0x404/+0x408/+0x40C/+0x410/+0x414`, codec vtable `+0x3B4`.
Record/node block at `0x800B0000+`. Tag bytes `0x55'U'/0x4D'M'/0x48'H'/0x4B'K'/
0x58'X'/0x6D'm'`, record magic `0x81B6`, path normalizers (`'\\'→'/'`, `':'↔'/'`).

## Naming policy (conservative)

Descriptive `boot_*` names are used only where a hard structural anchor supports
the role (known callee `lzss_decompress`/`resource_alloc`/`resource_free`; a
proven jump table; the callback vtable; the canonical-Huffman histogram; the
DEFLATE 286/285 constants; the CRC16 `0xA001` poly). The adaptive-Huffman codec
roles are marked **hypothesis** (structural inference from constants + control
shape, not symbol-proven). Functions whose specific role is unclear, plus the
review-flagged over-specified ones, keep `func_0000XXXX` names + role notes. The
in-asm labels remain `func_0000XXXX:` regardless; the descriptive name is the
manifest/file name only.

## Function table

| ROM range | name | conf | role (one line) |
|---|---|---|---|
| B030..B0B0 | boot_resource_lzss_load_entry | med | LZSS-decompress driver over descriptor list `0x800BF320`; calls `lzss_decompress` |
| B0B0..B29C | boot_resource_archive_load_many | med | front-end multi-record archive loader (20 callers); open+pool-bracket+decode loop |
| B29C..B33C | boot_resource_archive_load_one | med | single-descriptor variant of B0B0 (caller `0x9D50`); per-archive record loop |
| B33C..B3E4 | boot_resource_pool_acquire_release | **high** | two-mode pool bracket keyed on `$a0` (alloc!=0 / free==0) over list `0x800B884C` |
| B3E4..BC8C | boot_resource_tag_record_decode | med | 85-way jump-table tag/opcode record decoder → 0x12C-byte struct |
| BC8C..BE98 | boot_resource_record_resolve_load | med | per-record resolve/load: dir table `0x800B8750`, checksum, → `0xBE98` |
| BE98..BF90 | boot_resource_op_dispatch | med | 9-way jump-table op dispatcher; carries path-norm secondary `0xBF48` |
| BF90..BFC0 | func_0000BF90 | low | thin wrapper → shared helper `0x80093540` (identity unconfirmed) |
| BFC0..BFF4 | func_0000BFC0 | low | thin wrapper → `0x80093540` (highest-fanin of trio) |
| BFF4..C024 | func_0000BFF4 | low | thin wrapper → `0x80093540` |
| C024..C310 | boot_decode_build_huffman_table | med | shared canonical-Huffman table builder (5 callers); histogram(16)+firstcode |
| C310..C778 | boot_decode_driver | med | pluggable codec driver (3 jalr callbacks `0x800AF3B4`); +CRC16/bit-reader secondaries |
| C778..C990 | func_0000C778 | low | CRC16 update; secondaries `0xC838` (bit-skip), `0xC938` (path sanitize) |
| C990..CB4C | func_0000C990 | low | buffered fread/fwrite stream copy + optional CRC16, 0x800-byte chunks |
| CB4C..CEB8 | func_0000CB4C | low | builds 8-bit/256-sym canonical-Huffman table pair; finalizes via C024(a2=8) |
| CEB8..D248 | func_0000CEB8 | low | builds larger per-block Huffman table (cap 0x1FE/0x1000); secondaries `0xCF8C/0xD00C` |
| D248..D600 | func_0000D248 | low | top-level read-one-symbol driver; rebuilds tables on block-counter 0 (**true start 0xD248**) |
| D600..D994 | func_0000D600 | low | adaptive-Huffman DecodeChar tree-walk (**true start 0xD600**) |
| D994..D9B8 | boot_decode_huffman_reset_state | hyp | calls bit-reader init then clears block counter `0x800AF3C6` |
| D9B8..DBBC | boot_decode_huffman_tree_reconstruct | hyp | leaf: halve leaf freqs, rebuild internal nodes (628-entry arrays) |
| DBBC..DCA8 | boot_decode_huffman_tree_init | hyp | StartHuff: seed counts 286/256/628, reset reader, zero+seed tree |
| DCA8..E1F0 | boot_decode_huffman_tree_update | hyp | update: increment leaf freq + sift; genuine secondary `0xDFF4` |
| E1F0..E3F0 | boot_decode_huffman_tree_update_entry | med | **dual-entry**: `0xE1F0` stub falls into `0xE204`; 0x8000 renorm via DCA8/DFF4 |
| E3F0..E708 | boot_decode_huffman_symbol | med | adaptive-Huffman symbol decode: bit-refill + tree-walk + renorm |
| E708..EA98 | func_0000E708 | low | larger decode driver; 0x40-stride cursor prefetch + decode (role softened) |
| EA98..EADC | boot_decode_huffman_init | med | 64-byte model init; writes 286 node count, seeds bit state |
| EADC..EC00 | boot_decode_huffman_build_litlen_table | med | builds 286-symbol DEFLATE litlen table (degenerate fast path) |
| EC00..ECF0 | boot_decode_huffman_build_dist_table | med | builds depth-8 distance table from ROM const table `0x800A87CC` |
| ECF0..F22C | boot_decode_huffman_codelengths | med | DEFLATE dynamic-header code-length decoder (285/286 + run codes) (**true start 0xECF0**) |

## Dispatch tables & callback (hazards, maintainer-verified)

- **`0xB3E4` jump table** — `jr $v0` @`0xB880`; bound `sltiu $v1,0x55` @`0xB868`;
  index `sll 2` @`0xB870`; base `lw $v0,-0x1ED8($at)` with `$at=0x800B0000` →
  **table RAM `0x800AE128`, 85 entries**. Reads a 1-byte opcode at stream cursor
  `0x800AF390`. The table is a runtime/global DATA table (NOT embedded in this
  code) — its 85 `.word` targets are unverified and must be checked separately.
- **`0xBE98` jump table** — `jr $v0` @`0xBEF0`; bound `sltiu $v1,0x9` @`0xBED0`;
  base `-0x1D18($at)` → **table RAM `0x800AE2E8`, 9 entries** (runtime DATA,
  unverified). Stashes `a0–a3` into `0x800AF378..0x384`.
- **`0xC310` callbacks** — 3 `jalr $v0` at `0xC410/0xC458/0xC4E4`, function
  pointers from the codec vtable `0x800AF3B4` (`+0/+4/+8`, populated `0xBFB4..`).
  Pluggable codec — targets are data-driven, not statically resolvable.
- **`0xC310` CRC16** — secondary `0xC604` builds a 256-entry CRC16 table at
  `0x800AF3F8` with `xori 0xA001` (CRC-16/MODBUS poly).

## Boundary corrections (recurring preamble-orphan idiom)

The parent boundary detector consistently orphans a 2-or-4-word **read-before-
write load preamble** onto the previous function's tail. Maintainer-verified and
applied in this split (each split starts at the TRUE entry):

- `func_0000C778`/CEB8 chain: `func_0000CEB8` extended to end `0xD248` (its `jr`
  delay slot is `0xD244`).
- **`func_0000D248`** true start `0xD248` (parent said `0xD250`): words
  `0xD248/0xD24C` load `0x800AF3C6`, consumed read-before-write by `bne $v0` @`0xD254`.
- **`func_0000D600`** true start `0xD600` (parent said `0xD610`): words
  `0xD600..0xD60C` load `0x800AF3C2/0x800AF410`, consumed @`0xD61C/0xD624`.
- **`boot_decode_huffman_codelengths`** true start `0xECF0` (parent said `0xECF8`):
  words `0xECF0/0xECF4` load `0x800AF3C6`, consumed @`0xED08`.
- **Next frontier** `0xF23C` → true start **`0xF22C`** (same idiom); the new
  remainder file `code_0000F22C_00011000.s` begins there.

Spurious secondary entries flagged (do NOT split): `0xBBB8` (mid-loop label in
`0xB3E4`), `0xDC48` (mid-instruction in `…DBBC`). Genuine secondary entries:
`0xBF48` (path-norm, in `0xBE98`), `0xC604`/`0xC65C`/`0xC444` (in `0xC310`),
`0xC838`/`0xC938` (in `func_0000C778`), `0xCF8C`/`0xD00C` (in `func_0000CEB8`),
`0xDFF4` (in `…DCA8`), and the `0xE1F0`→`0xE204` dual entry.

## Callgraph notes

- **Dispatchers**: `0xB3E4` (85-way), `0xBE98` (9-way), `0xC310` (3 callbacks).
- **Shared leaves / high-fanin**: `func_0000BFC0` (4 callers), `0xC024` (5),
  `0xDCA8`/`0xDFF4` (the cluster-E rebuild pair), `0xD9B8`, and the bit-reader
  secondaries `0xC65C` (`jal 0x8007C25C`) / `0xC838` (`jal 0x8007C438`) — the
  single most-called helpers; note their callers show static degree `0` because
  they target **secondary entries**, so the static "leaf" label is unreliable
  here (e.g. `func_0000D600`, `…D994`, `…DBBC` all call a bit-reader secondary).
- **External callers** of the tranche: almost entirely through `0xB0B0` (20
  callers incl. `0x9D50` and many `0x1Cxxxx..0x23xxxx` sites). The codec
  internals (`func_0000D248` read-symbol, cluster-E decoders) have in-range jal
  in-degree 0 because they are invoked via the codec vtable `0x800AF3B4` or as
  top-level pointer entries.

## False leads / rejected or softened

- Parent "secondary entries" `0xBBB8` and `0xDC48` are NOT real entries (rejected).
- The three `0x80093540` wrappers (`func_0000BF90/BFC0/BFF4`) were proposed as
  `boot_resource_report*`; softened to `func_*` because the `0x80093540` helper's
  identity (printf vs assert vs log) is unconfirmed.
- `func_0000D600` (decode_char) and `func_0000E708` (decode_with_prefetch) were
  proposed with descriptive codec-role names; softened to `func_*` (hypothesis,
  mechanism not proven).

## Open questions / next frontier

- The 85-entry table `0x800AE128` and 9-entry table `0x800AE2E8` are **RESOLVED**
  (2026-06-21, see `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`): they are
  **static ROM data** (z64 `0x3E528` / `0x3E6E8`), NOT runtime-registered (xref
  scan found zero writers). Opcode→handler map for `0x800AE128`: op1→`0xB888`,
  op2→`0xB8D0`, op64→`0xB92C`, op80→`0xB964`, op81→`0xB980`, op84→`0xB9A4`,
  default (79 ops)→`0xB9C0` (all inside `boot_resource_tag_record_decode`). The
  codec source vtable is RAM `0x800A876C` / ROM `0x38B6C` (`0x800AF3B4` is the
  per-call working copy). Those table/vtable bytes are data inside a not-yet-split
  generated chunk — flag for data-vs-code reclassification when reached.
- The codec is hypothesis-grade Huffman/LZHUF/DEFLATE; runtime proof (or matching
  to a known algorithm) would upgrade the `boot_decode_huffman_*` names.
- **Next frontier — SUPERSEDED.** This dossier originally pointed at
  `0x0000F22C`; that tranche is done (see
  `docs/dossiers/boot-codec-libc-vec3-F22C-11000.md`, codec/libc/vec3/text
  `0xF22C..0x11000`) and **chunk 0 is fully split**. The current frontier is
  **`0x00011000` (chunk 1)**. See `docs/NEXT_STEPS.md` / `docs/DECOMP_LOG.md`.
  Historical note: the `0xF22C` continuation covered the canonical-Huffman
  read/decode workers and the low-level fread/fwrite stream I/O at
  `func_0000F970`/`F9D8` referenced here; the preamble-orphan boundary idiom
  recurred on most functions, as predicted.
