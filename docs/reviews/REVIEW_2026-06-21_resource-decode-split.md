# Review Handoff: Resource/Decode Subsystem Split (`0xB030..0xF22C`)

For the next decomp agent / reviewer. Substantial boot MIPS split/naming tranche.
One commit (`4ccf7ba`), static/offline only, byte-exact rebuild preserved.

## TL;DR

- Advanced the split frontier **`0x0000B030 → 0x0000F22C`** (~0x41FC bytes,
  **29 functions**) — one coherent subsystem: a tagged resource-archive loader +
  custom decompressor (Huffman/DEFLATE + adaptive-Huffman + CRC16/MODBUS).
- **29 boundaries validated; 5 corrected** (recurring preamble-orphan idiom);
  **29 names** (19 descriptive + 10 conservative `func_*`).
- New reusable tool `tools/dump_function_context.js`. `verify_setup` PASS,
  byte-exact (code SHA `40D4E787…B409`, ROM SHA `571E8339…CC67A` unchanged).
- Did this advance MIPS decomp? **Yes** — see §4.

## 1. What was done

- Built `tools/dump_function_context.js`, ran it over `0xB030..0xF23C`, ran a
  6-cluster analysis swarm + adversarial review, and re-verified all hazards and
  boundary corrections from the disassembly myself.
- Split `code_0000B030_00011000.s` into 29 named function files +
  `code_0000F22C_00011000.s` (new remainder) via
  `tools/split_original_mips_part.js` (no-gap validated).
- Wrote the dossier, updated docs, compacted `DECOMP_LOG.md` at the 10k-token
  threshold, committed.

## 2. Subsystem (evidence-backed)

Permanent core code, active in all 7 captured states. Three layers:

- **Front end `0xB030..0xBE98`** — `boot_resource_archive_load_many/one` open an
  archive (`jal 0x8007F4E4`, table `0x800BE0A8`), bracket with the begin/end pool
  manager `boot_resource_pool_acquire_release` (`seed::resource_alloc 0x1330` /
  `resource_free 0x16C4`, list `0x800B884C`), decode each tagged record with the
  85-way jump-table decoder `boot_resource_tag_record_decode` (runtime table RAM
  `0x800AE128`, stream cursor `0x800AF390`), resolve/load via
  `boot_resource_record_resolve_load`. `boot_resource_lzss_load_entry` is a
  separate `seed::lzss_decompress 0xA510` driver over list `0x800BF320`.
- **Decode/verify core `0xBE98..0xC310`** — `boot_resource_op_dispatch` (9-way
  jump table RAM `0x800AE2E8`) → `func_0000C990` (buffered fread/fwrite + CRC16)
  and `boot_decode_driver` (3 `jalr` codec callbacks from vtable `0x800AF3B4`;
  CRC16/MODBUS poly `0xA001`; shared bit-reader secondary `0xC65C`).
  `boot_decode_build_huffman_table` is the shared canonical-Huffman table builder
  (5 callers).
- **Codec `0xC024..0xF22C`** — canonical/DEFLATE path (`func_0000CB4C/CEB8`,
  `func_0000D248` read-symbol, `…EADC` litlen 286, `…EC00` distance, `…ECF0`
  code-lengths 285/286) + adaptive-Huffman path (`…DBBC` StartHuff, `…D9B8`
  reconstruct, `…DCA8`+`0xDFF4` update, `func_0000D600` DecodeChar, cluster-E
  decoders) over shared state `0x800AF360..0x800AF4xx` (628-node arrays,
  `0x8000` renorm).

## 3. Naming (conservative policy)

19 descriptive names where a hard structural anchor supports the role (known
callees lzss/alloc/free, proven jump tables, callback vtable, canonical-Huffman
histogram, DEFLATE 286/285, CRC16 poly). 10 `func_0000XXXX` where the specific
role is unclear or the swarm name was an over-specification (the three
`0x80093540` log wrappers; `func_0000D600` decode_char; `func_0000E708`
prefetch). Adaptive-Huffman codec names are explicitly **hypothesis** (structural
inference, not symbol-proven). Full per-function table + evidence:
`docs/dossiers/boot-resource-decode-subsystem-B030-F22C.md`.

## 4. Did MIPS decomp advance, and how?

**Yes, materially:**

1. **+29 named functions** (102 → 131 tracked source files), turning a 16,892-byte
   opaque `.word` remainder into a labeled, dossier-documented subsystem with a
   callgraph and per-function role notes.
2. **5 boundary corrections** that fix a *systematic* parent-DB error (the
   preamble-orphan idiom), so the split files start at true entries — better
   boundaries for everyone downstream, and a documented invariant for the next
   passes.
3. **Two runtime dispatch tables pinned** (`0x800AE128` 85-way, `0x800AE2E8`
   9-way) and a pluggable codec callback (`0x800AF3B4`) — the control-flow spine
   of the subsystem.
4. **Reusable tooling** (`dump_function_context.js`) that makes the next split
   passes much faster.

This is split/naming + boundary + callgraph + tooling progress on the executable
code itself — not just notes.

## 5. Boundary corrections (recurring idiom)

The parent boundary DB orphans a 2–4 word **read-before-write load preamble**
onto the previous function's tail. Corrected true starts: `func_0000D248`
(was 0xD250), `func_0000D600` (was 0xD610), `…codelengths` `0xECF0` (was 0xECF8),
`func_0000CEB8` end extended to `0xD248`, and the next frontier `0xF22C`
(was 0xF23C). Rejected spurious secondaries `0xBBB8`, `0xDC48`. **Expect this idiom
on essentially every function in this region.**

## 6. Verification

- `node tools/dump_function_context.js --start 0xB030 --end 0xF23C` → OK.
- `node tools/split_original_mips_part.js …` → 29 named parts + remainder.
- `node tools/verify_setup.js` → PASS, byte-exact (code SHA `40D4E787…B409`,
  ROM SHA `571E8339…CC67A` unchanged; source mix 131 tracked + 99 fallback).
- `git diff --check` → clean.

## 7. Next recommended task

Split from `asm/original/rev0/code_0000F22C_00011000.s` starting at the corrected
true entry **`0x0000F22C`** (a canonical-Huffman read/decode worker), then
continue the codec and the low-level stream I/O it calls (`func_0000F970`
fread-like, `F9D8` fwrite-like). Seed with
`node tools/dump_function_context.js --start 0xF22C --end <next>`; expect the
preamble-orphan idiom; resolve `jal 0x8007C25C`→`0xC65C` /
`jal 0x8007C438`→`0xC838` / `jal 0x8007BC24`→`0xC024` to their real/secondary
entries rather than trusting static call degree. **Side quest:** decode the
runtime dispatch tables `0x800AE128` / `0x800AE2E8` (registered outside this
tranche) to map opcodes → handlers and upgrade the `func_*`/hypothesis names.

## 8. Caveats

- The adaptive-Huffman codec roles are hypothesis-grade (constants + control
  shape, not symbol/string proof); confirm against runtime or a known algorithm
  before promoting those names.
- The two dispatch tables are runtime DATA (not embedded in the code files); their
  targets are unverified here.
- Static callgraph degree mislabels several functions as "leaf 0/0" because they
  call bit-reader *secondary* entries — don't trust raw degree in this region.
