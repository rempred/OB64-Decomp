# OB64 Decomp Platform

Read this after `../AGENTS.md`. It is the fast orientation document for future
agents who need to understand where the Rev 0 decomp repo stands without
reconstructing the parent workspace history.

## Purpose

`OB64 Decomp/` is the dedicated source-level decompilation repo for Ogre Battle
64: Person of Lordly Caliber, US Rev 0 only.

The intended finished output is a reproducible source tree that can build the
original ROM from:

- C source under `src/`.
- Original/reference MIPS under `asm/original/`.
- Nonmatching or handwritten MIPS under `asm/nonmatching/` only while C is not
  matching.
- Structured data and asset source forms under `data/` and `assets/`.

The parent `OgreBattlel64` workspace remains the research lab for emulator
traces, Project64 automation, editor experiments, patch builders, and large
generated artifacts. This repo should receive only stable decomp inputs, tools,
and curated notes.

## Source Of Truth Order

For decomp work, use this order:

1. `../AGENTS.md`
2. `docs/PLATFORM.md`
3. `docs/REV0_SCOPE.md`
4. `docs/TOOLCHAIN.md`
5. `docs/WORKFLOW.md`
6. `docs/DECOMP_LOG.md`
7. `docs/FULL_ROM_SOURCE_MANIFEST.md`
8. `docs/NEXT_STEPS.md`
9. Parent `docs/mips-decomp-workflow-plan.md`
10. Parent subsystem docs and trace artifacts as cited by the local note

When a durable fact changes, update `AGENTS.md` and the relevant `docs/` file in
the same commit.

## Current State

Setup is complete and the data-ownership loop is COMPLETE (2026-06-24): the
entire configured code region `0x00001000..0x0063676C` (6,510,444 bytes) is
100% source-owned as named code/data parts — 100 composite chunks, 6,184
tracked real-assembler source files, 0 generated fallback chunks. The full
41,943,040-byte ROM rebuilds byte-identically, gated by
`node tools/verify_setup.js --phase5a-root <accepted-root>` (21 checks).

What "source-owned" means precisely — and does not mean — is defined in
`../AGENTS.md` ("What This Repo Is (And Is Not)" + "Definitions"). Canonical
detail, in reading order:

1. `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md` — consolidated loop report
   (coverage, natural units, HUFF/NJPG findings, unresolved questions).
2. The Structural Snapshot table below — per-chunk composition, generated from
   `asm/original/rev0/manifest.json`.
3. `docs/dossiers/` — per-chunk and per-subsystem evidence (139+ dossiers).
4. `docs/data-index/rev0/*.json` — machine-readable data-region inventories.
5. `docs/DISASM_VALIDATION_2026-07-08.md` — the decode comments are validated
   against GNU objdump (0 genuine disagreements over the executable extent).

Historical additions (2026-07-08): AGENTS.md restored to a thin rulebook (run log
archived, commit `d259dca`); `check_manifest.js` wired into the setup gate;
`tools/export_function_corrections.js` delivered the loop's boundary
corrections to the parent as `../scripts/ob64_function_corrections_rev0.json`
(parent `docs/mips-decode.md` Stage 1b; regeneration filed as parent
pending-tasks #16). The former fix plan is complete and remains at
`docs/PLAN_2026-07-08-assessment-fixes.md`.

Current known-good pipeline and expected results:

```powershell
$phase5aRoot = '<accepted-phase5a-product-root>'
node tools/verify_setup.js --phase5a-root $phase5aRoot
```

- Rev 0 baserom verified (Project64 CRC `E6419BC5/69011DE3`), normalized to
  `build/baserom.us_rev0.z64`.
- Coverage ledger: 825 LHA archives (independent scan matches the parent
  catalog), 0 unknown bytes, the 108-byte archive/audio overlap visible.
- Manifest integrity audit: ALL CHECKS PASS (6,184 parts, contiguity + SHA-256).
- Executable-extent gate: boundary PINNED `0x2B89B8` (2026-07-09); manifest split `original_mips` 2,849,208 B / `owned_data_parts` (data tail) 3,661,236 B, audit-asserted every run.
- Assembled code region SHA256
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`; full ROM
  rebuild SHA256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` (exact).
- Full-ROM source manifest: 1,060 entries, 0 unknown bytes, 2,469,141
  ambiguous bytes preserved explicitly; source-owner mix 3 tracked non-code
  files / 44,029 bytes + 1,055 generated fallback files / 35,388,567 bytes;
  source-manifest rebuild exact.

## Accepted External-Intake Promotion — 2026-08-01

Final review accepted the clean-room program result and its setup correction.
The canonical technical promotion is commit
`31e781898a585285f87a4dd3b4edd91bc6319b5a`.

Its exact no-renames path boundary is the Git delta from baseline
`98863fa79e8b8908f1df00ba7bf24b4aa5361c11`. That delta contains 43 additions,
eight modifications, and one deletion across 52 unique actions.

The promoted capabilities are:

- ROM-derived overlay descriptors and group configuration;
- a no-gap 7,242-owner Splat 0.34.0 configuration;
- an overlay-aware conventional assembly and linker build;
- exact ELF, map, code-region, and full-ROM verification; and
- one independently written 36-byte matching-C function.

The matching target is structural symbol `func_000E5938`. It covers z64 ROM
`0x000E5938..0x000E595C` in overlay descriptor 2.

The promotion preserves the canonical ROM and code-region SHA-256 values above.
It applies to the accepted Windows host and external authenticated tools.

The review does not prove gameplay semantics or cross-host reproduction. Five
segment candidates and 6,154 function candidates remain unresolved.

External-derived source, integration records, and proof-export records remain
outside this clean-room repository. No acceptance grants publication authority.

## Accepted Matching-C Wave 1 — 2026-08-02

Critical review accepted the second matching-C slice with two documentation
corrections. The review verdict is commit
`6082c2f755d08dcfc514a28c12b145c3085818db`. The completed cleanup is commit
`0a4c16c765272e6ad4aebcf6d12c4c469dd21c9e`.

Wave 1 left these matching-C owners:

| Structural symbol | Static role | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_000E5938` | Existing overlay target | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | Boot resource-pool acquire/release | `0x0000B33C..0x0000B3E4` | 168 |

Both linked targets match their original bytes. Their original assembly owners
remain available as comparison fallbacks.

The multi-target build preserves the full-ROM and code-region SHA-256 values
above. It authenticates the accepted KMC manifest before compiler use.

The accepted review proves structural matching, provenance, and exact rebuild
preservation. It does not prove gameplay semantics or runtime behavior.

## Accepted Matching-C Wave 2 — 2026-08-02

Critical review accepted the third matching-C slice without correction. The
worker result is commit `f06aea6b5bc8cd9c99ab09881e4f91a55474a602`.
The review verdict is commit `082ad7a02be2b6069c2843d1aad4eeab7785ccf2`.

Wave 2 left these matching-C owners:

| Structural symbol | Static role | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_000E5938` | Existing overlay target | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | Boot resource-pool acquire/release | `0x0000B33C..0x0000B3E4` | 168 |
| `func_00007688` | Boot state-slot flagged dispatch and lookup owner | `0x00007688..0x00007768` | 224 |

The third owner preserves secondary entry `func_00007714` at owner offset
`0x8C`. Its retained assembly remains available as the comparison fallback.

All three linked targets match their original bytes. Two fresh build roots
reproduced the same target, relocation, code-region, and full-ROM identities.

The review proves static structure, clean-room derivation, and exact build
identity. It does not prove state-slot semantics or gameplay behavior.

## Accepted Matching-C Wave 3 — 2026-08-02

Critical review accepted the fourth matching-C slice without correction. The
worker result is commit `b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399`.
The review verdict is commit `c51f9988abdaf3e5ab7e6d6e13b18544a928b488`.

Wave 3 left these matching-C owners:

| Structural symbol | Static role | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_000E5938` | Existing overlay target | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | Boot resource-pool acquire/release | `0x0000B33C..0x0000B3E4` | 168 |
| `func_00007688` | Boot state-slot flagged dispatch and lookup owner | `0x00007688..0x00007768` | 224 |
| `func_0000BC8C` | Boot resource-record resolver and loader owner | `0x0000BC8C..0x0000BE98` | 524 |

The fourth owner ends before adjacent dispatcher `func_0000BE98`. It has no
secondary entry. Its retained assembly remains the comparison fallback.

All four linked targets match their original bytes. Two fresh review roots
reproduced target placement, relocations, code-region identity, and full-ROM
identity.

The review proves static structure, clean-room derivation, and exact build
identity. It does not prove runtime behavior or gameplay meaning.

## Accepted Matching-C Wave 4 — 2026-08-02

Critical review accepted the fifth matching-C slice with one documentation
correction. The worker result is commit
`db8f7e697bdffc9ed6b3224894db4efe5cd2d6aa`. The review verdict is commit
`fd7dd36d521a5f6a96ee3812de56642a8ba5daf0`. The completed cleanup is commit
`d4c4c3d1e88ae7a81d17f147741c8559882e1f90`.

Wave 4 left these matching-C owners:

| Structural symbol | Static role | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_000E5938` | Existing overlay target | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | Boot resource-pool acquire/release | `0x0000B33C..0x0000B3E4` | 168 |
| `func_00007688` | Boot state-slot flagged dispatch and lookup owner | `0x00007688..0x00007768` | 224 |
| `func_0000BC8C` | Boot resource-record resolver and loader owner | `0x0000BC8C..0x0000BE98` | 524 |
| `func_00269470` | Overlay descriptor 12 seven-way state-handler owner | `0x00269470..0x00269798` | 808 |

The fifth owner has no secondary entry and retains its assembly fallback.
Overlay descriptor 12 places it at runtime virtual range
`0x802148C0..0x80214BE8`. The linked owner preserves all 42 relocations.

All five linked targets match their original bytes. Independent review
reproduced their placement, relocations, code-region identity, and full-ROM
identity.

The review proves static structure, clean-room derivation, and exact build
identity. It does not prove runtime behavior or gameplay meaning.

## Accepted Matching-C Wave 5 — 2026-08-02

Critical review accepted the sixth matching-C slice without correction. The
worker result is commit `470d7c4f9686e73f728d23862601c9d97a9110b2`.
The review verdict is commit `8d2d0d947729778b0b50fe6ea9a62f85b2b815d5`.

Wave 5 left these matching-C owners:

| Structural symbol | Static role | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_000E5938` | Existing overlay target | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | Boot resource-pool acquire/release | `0x0000B33C..0x0000B3E4` | 168 |
| `func_00007688` | Boot state-slot flagged dispatch and lookup owner | `0x00007688..0x00007768` | 224 |
| `func_0000BC8C` | Boot resource-record resolver and loader owner | `0x0000BC8C..0x0000BE98` | 524 |
| `func_00269470` | Overlay descriptor 12 seven-way state-handler owner | `0x00269470..0x00269798` | 808 |
| `func_0026B360` | Overlay descriptor 12 structural control-path owner | `0x0026B360..0x0026B7E4` | 1,156 |

The sixth owner has no secondary entry and retains its assembly fallback.
Overlay descriptor 12 places it at runtime virtual range
`0x802167B0..0x80216C34`. The linked owner preserves 29 `.rel.text`
relocations and one `.rel.pdr` relocation.

All six linked targets match their original bytes. Independent review
reproduced their placement, relocations, code-region identity, and full-ROM
identity.

The review proves static structure, clean-room derivation, and exact build
identity. It does not prove runtime behavior or gameplay meaning.

## Accepted Matching-C Wave 6 — 2026-08-02

Critical review accepted the seventh matching-C slice with a documentation
correction. The worker result is commit
`7d527a7ff8c3ad01ba00d586aee6ef7dba567d39`. The review verdict is commit
`b9a2e5acc53d3aee009a46edae88fd2d5a5b89f8`. The completed cleanup is commit
`ed78fc639dcdf4593b32d7092313161143ef9b8e`.

At the Wave 6 boundary, the matching-C owners were:

| Structural symbol | Static role | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_000E5938` | Existing overlay target | `0x000E5938..0x000E595C` | 36 |
| `func_0000B33C` | Boot resource-pool acquire/release | `0x0000B33C..0x0000B3E4` | 168 |
| `func_00007688` | Boot state-slot flagged dispatch and lookup owner | `0x00007688..0x00007768` | 224 |
| `func_0000BC8C` | Boot resource-record resolver and loader owner | `0x0000BC8C..0x0000BE98` | 524 |
| `func_00269470` | Overlay descriptor 12 seven-way state-handler owner | `0x00269470..0x00269798` | 808 |
| `func_0026B360` | Overlay descriptor 12 structural control-path owner | `0x0026B360..0x0026B7E4` | 1,156 |
| `func_0026B820` | Overlay descriptor 12 selector and state dispatcher | `0x0026B820..0x0026BCCC` | 1,196 |

The seventh owner has no secondary entry and retains its assembly fallback.
Overlay descriptor 12 places it at runtime virtual range
`0x80216C70..0x8021711C`. The linked owner preserves 28 text relocations and
one `.rel.pdr` relocation.

All seven linked targets match their original bytes. Independent review
reproduced their placement, relocations, code-region identity, and full-ROM
identity.

The review proves static structure, clean-room derivation, and exact build
identity. It does not prove runtime behavior or gameplay meaning.

## Accepted Four-Lane Lane C Target 1 — 2026-08-03

Critical review accepted the cumulative row-565 Phase 5B correction and Lane C
`func_000241F8`. The function remains on Lane C pending batch promotion. It is
not yet an active canonical owner. The canonical correction commit is
`0e2499d35ec34dd7399cfb041cd17cc2c1b99af3`. The frozen Lane C result is
`bb88c6d175ddf5e65c05bb7b0730d4466d243c13`.

The parent review-verdict commit is
`606771c76bc7b84d0d18a6f2b833b4d9ec3ca5ed`. Two fresh review builds
preserved exact object, linked, placement, relocation, code-region, and
full-ROM identities.

This acceptance proves structural and build identity. It does not prove
gameplay meaning, runtime behavior, editor readiness, or release safety.

## Accepted Four-Lane Lane A Batch 01 Promotion — 2026-08-03

Critical review accepted canonical commit
`6ca9a3bdbb3197b4289d9d12e86a15bccc055c01` as the eleven-owner baseline.
The parent review-verdict commit is
`5dbb72cf3832b972555941a8fc351df652b5046b`.

The bounded report-format correction froze in parent commit
`2aa340ce7e5e7a996356a12f63d820c96015f624`. It removed one terminal LF and
preserved every reviewed technical byte and claim.

The four newly active structural owners are:

| Structural symbol | Source owner | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_00003798` | `src/boot/boot_resource_state_reset.c` | `0x00003798..0x000037F8` | 96 |
| `func_0000A1F8` | `src/boot/boot_resource_node_recursive_payload_clear.c` | `0x0000A1F8..0x0000A250` | 88 |
| `func_0002CBCC` | `src/lib/rand.c` | `0x0002CBCC..0x0002CC00` | 52 |
| `func_0025C8A4` | `src/lib/func_0025C8A4.c` | `0x0025C8A4..0x0025C8D0` | 44 |

The accepted matching-C configuration has SHA-256
`FF8E396A08341C31D28DF12EE9DF021A2A201477D63A68CF4E25B4F4442386F3`.
Two fresh review runs preserved the canonical ROM and code-region identities.

The eleven owners prove clean-room static structure and exact build identity.
They do not prove gameplay meaning, runtime behavior, or editor readiness.

## Accepted Four-Lane Lane B Batch 01 Promotion — 2026-08-03

Critical review accepted the Lane B promotion with one record correction. The
accepted canonical commit is
`76ab996e818c54e23e51a89ae5fd32e96fcd8794`.

The parent review-verdict commit is
`31932c39c9b5b2de05a8593703855314d1fa2d65`.

The four newly active structural owners are:

| Structural symbol | Source owner | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_00008564` | `src/boot/boot_state_slot_payload_copy_free.c` | `0x00008564..0x0000859C` | 56 |
| `func_00023970` | `src/lib/osCreateMesgQueue.c` | `0x00023970..0x000239A0` | 48 |
| `func_0002CB80` | `src/lib/hypotf.c` | `0x0002CB80..0x0002CBC0` | 64 |
| `func_0025CAF0` | `src/lib/func_0025CAF0.c` | `0x0025CAF0..0x0025CB60` | 112 |

The fifteen-owner configuration has SHA-256
`4BA9398C154B4C14097F9500DF45EE9EE15EB0B588CE138A50D5F186DA50887F`.
Fresh builds preserved the canonical ROM and code-region identities.

## Accepted Four-Lane Lane D Batch 01 Promotion — 2026-08-03

Critical review accepted canonical commit
`6b493bf1108e026e516c74029e472ace89d7dd75` as the nineteen-owner baseline.
The parent review-verdict commit is
`b650ccf2d677a974defcc0b27f8fe1fde77a2266`.

The four newly active structural owners are:

| Structural symbol | Source owner | z64 ROM range | Bytes |
|---|---|---:|---:|
| `func_00025000` | `src/lib/list_remove_node.c` | `0x00025000..0x00025040` | 64 |
| `func_0000D994` | `src/boot/boot_decode_huffman_reset_state.c` | `0x0000D994..0x0000D9B8` | 36 |
| `func_0002CD70` | `src/lib/memset_0002cd70.c` | `0x0002CD70..0x0002CDA0` | 48 |
| `func_0025DAB0` | `src/lib/func_0025DAB0.c` | `0x0025DAB0..0x0025DB00` | 80 |

The nineteen-owner configuration has SHA-256
`0443605E350DA54EA1131DC693B66E630DB9C0B2B2DB13A6F66AE2127904940C`.
Three fresh review roots preserved exact ROM and code-region identities.

All nineteen owners prove clean-room static structure and exact build identity.
They do not prove gameplay meaning, runtime behavior, or editor readiness.

## Repo Invariants

- Rev 0 only until the build, compare, and overlay workflow is stable.
- Do not commit ROM binaries, savestates, save files, generated bulk outputs,
  object files, rebuilt ROMs, or local experiments.
- Documentation offsets use z64 byte order.
- Tool input may be `.v64`, `.z64`, or `.n64`, but extraction and comparison use
  canonical z64 bytes.
- Every configured byte must remain represented by source or raw span data. The
  decomp can have incomplete names and imperfect function boundaries; it cannot
  have missing bytes.
- The coverage ledger must keep using an independent archive scan. Do not rely
  on the parent archive catalog alone.
- `rebuild_rom.js` must stay green before replacing raw spans with assembly or C.

## Folder Map

```text
baserom/       local ROM inputs, ignored
config/        Rev 0 ROM profile, segments, overlays, symbols, linker inputs
include/       shared C headers and structs
src/           decompiled C source
asm/           original, nonmatching, and handwritten MIPS assembly
data/          tables, rodata, archive manifests, binary data source forms
assets/        extracted art/audio/model source artifacts
tools/         extraction, disassembly, coverage, rebuild, and compare tools
docs/          curated decomp notes and subsystem docs
wiki/          regenerated reports and imported function dossiers
tests/         parser, extraction, compare, and regression tests
build/         generated intermediates, ignored
dist/          rebuilt ROMs and reports, ignored
scratch/       local experiments, ignored
.toolchains/   local toolchains, ignored
```

## Generated Artifacts

These outputs are useful but ignored:

- `build/baserom.us_rev0.z64`
- `build/baserom.us_rev0.report.json`
- `build/original-mips/rev0/`
- `build/original-mips/rev0-report.json`
- `build/coverage/rev0-rom-coverage-ledger.json`
- `build/coverage/rev0-rom-coverage-ledger.md`
- `build/assembled/rev0/code.bin`
- `build/assembled/rev0-report.json`
- `build/segments/rev0/manifest.json`
- `build/segments/rev0/raw/`
- `build/rebuild/rev0-rebuild-report.json`
- `build/source-manifest/rev0-full-source-manifest.json`
- `build/source-manifest/rev0-full-source-manifest.md`
- `build/source-owners/rev0/`
- `build/rebuild/rev0-source-manifest-rebuild-report.json`
- `build/setup/verify-setup-report.json`
- `build/toolchain-smoke/binutils-smoke-report.json`
- `dist/rebuilt.us_rev0.z64`

## Structural Snapshot

Whole-ROM facts:

- ROM size: 41,943,040 bytes; z64 SHA256 `571E8339...2CC67A`.
- Configured code region: `0x00001000..0x0063676C` (fully source-owned).
- Executable MIPS extent: `0x00001000..0x002B89B8` — boundary PINNED and the
  tail RECLASSIFIED as data 2026-07-09 (`owned_data_parts`, 3,661,236 bytes,
  gate-enforced; `docs/CODE_REGION_AUDIT.md` closure section).
- Valid parsed LHA archives: 825 (first at `0x636784`); archive-gap bytes
  2,429,124; tail data `0x275415B..0x275DD40`; trailing `0xFF` padding to
  `0x2800000`; known archive/audio overlap `0x925483..0x9254EF` (108 bytes).

Region map by content family (detail in the FINAL report + dossiers):

| Range | Family |
|---|---|
| `0x1000..0x11000` | Chunk 0 `boot/`: resource loader/allocator, LZSS + Huffman codecs, libc, vec3, display-list core (semantically named; 81 boot dossiers) |
| `0x11000..0x31000` | Statically linked libultra/libc/gu + graphics/unit-script library (named symbols) |
| `0x31000..0x41000` | RSP microcode, overlay descriptor/group tables, residual data, and code tail |
| `0x41000..0x2B89B8` | Overlay-relocated game code (army/char/scenario/combat/menu/world-map/mission-briefing modules) with interleaved data islands; conservative `func_*` naming; per-chunk dossiers |
| `0x2B89B8..0x301000` | Non-code high-entropy asset territory (code→data transition pinned `0x2B89B8` in chunk 43) |
| `0x301000..0x4E3140` | Section A = AUDIO: decoded PtrTablesV2/WaveTables VADPCM sound bank @`0x421000` + flat sample payload |
| `0x4E3140..0x4F0FB0` | Section B index (1,798 records, shape decoded) + payload |
| `0x4F0FB0..0x594280` | Section B: 63 parser-backed cutscene audio-sequence blocks (tag `0x215`, Gate-2 proven) |
| `0x594280..0x63676C` | Section C: 65-entry directory + 29-block 320x240 NJPG "HUFF" image pool (entropy stage decoded; render pending) |

Per-chunk composition (generated from `asm/original/rev0/manifest.json`;
code = named function/straddler/cluster parts, data/zero-fill by part prefix;
6,184 parts total — regenerate this table after any split change):

| # | z64 range | parts | code | data | zero-fill | dossier |
|---|---|---|---|---|---|---|
| 0 | `0x00001000..0x00011000` | 177 | 177 | 0 | 0 | `boot-*` |
| 1 | `0x00011000..0x00021000` | 350 | 349 | 1 | 0 | `lib-chunk1-11000-21000` |
| 2 | `0x00021000..0x00031000` | 216 | 214 | 2 | 0 | `lib-chunk2-21000-31000` |
| 3 | `0x00031000..0x00041000` | 70 | 23 | 26 | 21 | `lib-chunk3-31000-41000` |
| 4 | `0x00041000..0x00051000` | 376 | 376 | 0 | 0 | `lib-chunk4-41000-51000` |
| 5 | `0x00051000..0x00061000` | 88 | 77 | 11 | 0 | `lib-chunk5-51000-61000` |
| 6 | `0x00061000..0x00071000` | 78 | 60 | 18 | 0 | `lib-chunk6-61000-71000` |
| 7 | `0x00071000..0x00081000` | 103 | 81 | 22 | 0 | `lib-chunk7-71000-81000` |
| 8 | `0x00081000..0x00091000` | 87 | 63 | 20 | 4 | `lib-chunk8-81000-91000` |
| 9 | `0x00091000..0x000A1000` | 34 | 34 | 0 | 0 | `lib-chunk9-91000-A1000` |
| 10 | `0x000A1000..0x000B1000` | 35 | 35 | 0 | 0 | `lib-chunk10-A1000-B1000` |
| 11 | `0x000B1000..0x000C1000` | 191 | 191 | 0 | 0 | `lib-chunk11-B1000-C1000` |
| 12 | `0x000C1000..0x000D1000` | 74 | 74 | 0 | 0 | `lib-chunk12-C1000-D1000` |
| 13 | `0x000D1000..0x000E1000` | 67 | 27 | 35 | 5 | `lib-chunk13-D1000-E1000` |
| 14 | `0x000E1000..0x000F1000` | 94 | 74 | 16 | 4 | `lib-chunk14-E1000-F1000` |
| 15 | `0x000F1000..0x00101000` | 153 | 134 | 17 | 2 | `lib-chunk15-F1000-101000` |
| 16 | `0x00101000..0x00111000` | 95 | 72 | 20 | 3 | `lib-chunk16-101000-111000` |
| 17 | `0x00111000..0x00121000` | 66 | 66 | 0 | 0 | `lib-chunk17-111000-121000` |
| 18 | `0x00121000..0x00131000` | 95 | 95 | 0 | 0 | `lib-chunk18-121000-131000` |
| 19 | `0x00131000..0x00141000` | 80 | 64 | 15 | 1 | `lib-chunk19-131000-141000` |
| 20 | `0x00141000..0x00151000` | 175 | 89 | 64 | 22 | `lib-chunk20-141000-151000` |
| 21 | `0x00151000..0x00161000` | 99 | 95 | 4 | 0 | `lib-chunk21-151000-161000` |
| 22 | `0x00161000..0x00171000` | 99 | 35 | 60 | 4 | `lib-chunk22-161000-171000` |
| 23 | `0x00171000..0x00181000` | 73 | 40 | 26 | 7 | `lib-chunk23-171000-181000` |
| 24 | `0x00181000..0x00191000` | 63 | 40 | 19 | 4 | `lib-chunk24-181000-191000` |
| 25 | `0x00191000..0x001A1000` | 71 | 59 | 11 | 1 | `lib-chunk25-191000-1A1000` |
| 26 | `0x001A1000..0x001B1000` | 96 | 81 | 12 | 3 | `lib-chunk26-1A1000-1B1000` |
| 27 | `0x001B1000..0x001C1000` | 142 | 128 | 10 | 4 | `lib-chunk27-1B1000-1C1000` |
| 28 | `0x001C1000..0x001D1000` | 97 | 75 | 20 | 2 | `lib-chunk28-1C1000-1D1000` |
| 29 | `0x001D1000..0x001E1000` | 103 | 99 | 0 | 4 | `lib-chunk29-1D1000-1E1000` |
| 30 | `0x001E1000..0x001F1000` | 122 | 91 | 26 | 5 | `lib-chunk30-1E1000-1F1000` |
| 31 | `0x001F1000..0x00201000` | 86 | 86 | 0 | 0 | `lib-chunk31-1F1000-201000` |
| 32 | `0x00201000..0x00211000` | 198 | 198 | 0 | 0 | `lib-chunk32-201000-211000` |
| 33 | `0x00211000..0x00221000` | 109 | 84 | 22 | 3 | `lib-chunk33-211000-221000` |
| 34 | `0x00221000..0x00231000` | 120 | 91 | 28 | 1 | `lib-chunk34-221000-231000` |
| 35 | `0x00231000..0x00241000` | 134 | 129 | 4 | 1 | `lib-chunk35-231000-241000` |
| 36 | `0x00241000..0x00251000` | 164 | 136 | 24 | 4 | `lib-chunk36-241000-251000` |
| 37 | `0x00251000..0x00261000` | 180 | 172 | 6 | 2 | `lib-chunk37-251000-261000` |
| 38 | `0x00261000..0x00271000` | 232 | 232 | 0 | 0 | `lib-chunk38-261000-271000` |
| 39 | `0x00271000..0x00281000` | 155 | 136 | 13 | 6 | `lib-chunk39-271000-281000` |
| 40 | `0x00281000..0x00291000` | 159 | 143 | 15 | 1 | `lib-chunk40-281000-291000` |
| 41 | `0x00291000..0x002A1000` | 160 | 136 | 20 | 4 | `lib-chunk41-291000-2A1000` |
| 42 | `0x002A1000..0x002B1000` | 171 | 159 | 11 | 1 | `lib-chunk42-2A1000-2B1000` |
| 43 | `0x002B1000..0x002C1000` | 90 | 82 | 4 | 4 | `lib-chunk43-2B1000-2C1000` |
| 44 | `0x002C1000..0x002D1000` | 17 | 0 | 9 | 8 | `lib-chunk44-2C1000-2D1000` |
| 45 | `0x002D1000..0x002E1000` | 15 | 0 | 8 | 7 | `lib-chunk45-2D1000-2E1000` |
| 46 | `0x002E1000..0x002F1000` | 17 | 0 | 9 | 8 | `lib-chunk46-2E1000-2F1000` |
| 47 | `0x002F1000..0x00301000` | 27 | 0 | 14 | 13 | `lib-chunk47-2F1000-301000` |
| 48 | `0x00301000..0x00311000` | 9 | 0 | 5 | 4 | `section-a-00301000-00341000-data-ownership` |
| 49 | `0x00311000..0x00321000` | 11 | 0 | 6 | 5 | `section-a-00301000-00341000-data-ownership` |
| 50 | `0x00321000..0x00331000` | 13 | 0 | 7 | 6 | `section-a-00301000-00341000-data-ownership` |
| 51 | `0x00331000..0x00341000` | 13 | 0 | 7 | 6 | `section-a-00301000-00341000-data-ownership` |
| 52 | `0x00341000..0x00351000` | 13 | 0 | 7 | 6 | `section-a-00341000-003E1000-data-ownership` |
| 53 | `0x00351000..0x00361000` | 9 | 0 | 5 | 4 | `section-a-00341000-003E1000-data-ownership` |
| 54 | `0x00361000..0x00371000` | 9 | 0 | 5 | 4 | `section-a-00341000-003E1000-data-ownership` |
| 55 | `0x00371000..0x00381000` | 9 | 0 | 5 | 4 | `section-a-00341000-003E1000-data-ownership` |
| 56 | `0x00381000..0x00391000` | 7 | 0 | 4 | 3 | `section-a-00341000-003E1000-data-ownership` |
| 57 | `0x00391000..0x003A1000` | 1 | 0 | 1 | 0 | `section-a-00341000-003E1000-data-ownership` |
| 58 | `0x003A1000..0x003B1000` | 5 | 0 | 3 | 2 | `section-a-00341000-003E1000-data-ownership` |
| 59 | `0x003B1000..0x003C1000` | 3 | 0 | 2 | 1 | `section-a-00341000-003E1000-data-ownership` |
| 60 | `0x003C1000..0x003D1000` | 3 | 0 | 2 | 1 | `section-a-00341000-003E1000-data-ownership` |
| 61 | `0x003D1000..0x003E1000` | 5 | 0 | 3 | 2 | `section-a-00341000-003E1000-data-ownership` |
| 62 | `0x003E1000..0x003F1000` | 5 | 0 | 3 | 2 | `section-a-003E1000-00421000-data-ownership` |
| 63 | `0x003F1000..0x00401000` | 5 | 0 | 3 | 2 | `section-a-003E1000-00421000-data-ownership` |
| 64 | `0x00401000..0x00411000` | 7 | 0 | 4 | 3 | `section-a-003E1000-00421000-data-ownership` |
| 65 | `0x00411000..0x00421000` | 15 | 0 | 8 | 7 | `section-a-003E1000-00421000-data-ownership` |
| 66 | `0x00421000..0x00431000` | 8 | 0 | 5 | 3 | `section-a-audio-bank-00421000-00431000-data-ownership` |
| 67 | `0x00431000..0x00441000` | 21 | 0 | 11 | 10 | `section-a-audio-bank-tail-00431000-00441000-data-ownership` |
| 68 | `0x00441000..0x00451000` | 33 | 0 | 17 | 16 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 69 | `0x00451000..0x00461000` | 23 | 0 | 12 | 11 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 70 | `0x00461000..0x00471000` | 19 | 0 | 10 | 9 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 71 | `0x00471000..0x00481000` | 23 | 0 | 12 | 11 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 72 | `0x00481000..0x00491000` | 21 | 0 | 11 | 10 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 73 | `0x00491000..0x004A1000` | 33 | 0 | 17 | 16 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 74 | `0x004A1000..0x004B1000` | 13 | 0 | 7 | 6 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 75 | `0x004B1000..0x004C1000` | 7 | 0 | 4 | 3 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 76 | `0x004C1000..0x004D1000` | 7 | 0 | 4 | 3 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 77 | `0x004D1000..0x004E1000` | 15 | 0 | 8 | 7 | `section-a-flat-audio-00441000-004E1000-data-ownership` |
| 78 | `0x004E1000..0x004F1000` | 4 | 0 | 4 | 0 | `section-a-to-b-boundary-004E1000-004F1000-data-ownership` |
| 79 | `0x004F1000..0x00501000` | 11 | 0 | 11 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 80 | `0x00501000..0x00511000` | 5 | 0 | 5 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 81 | `0x00511000..0x00521000` | 4 | 0 | 4 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 82 | `0x00521000..0x00531000` | 4 | 0 | 4 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 83 | `0x00531000..0x00541000` | 5 | 0 | 5 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 84 | `0x00541000..0x00551000` | 9 | 0 | 9 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 85 | `0x00551000..0x00561000` | 9 | 0 | 9 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 86 | `0x00561000..0x00571000` | 11 | 0 | 11 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 87 | `0x00571000..0x00581000` | 4 | 0 | 4 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 88 | `0x00581000..0x00591000` | 9 | 0 | 9 | 0 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 89 | `0x00591000..0x005A1000` | 5 | 0 | 4 | 1 | `section-b-audio-sequence-blocks-004F1000-00595000-data-ownership` |
| 90 | `0x005A1000..0x005B1000` | 3 | 0 | 3 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 91 | `0x005B1000..0x005C1000` | 4 | 0 | 4 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 92 | `0x005C1000..0x005D1000` | 4 | 0 | 4 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 93 | `0x005D1000..0x005E1000` | 4 | 0 | 4 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 94 | `0x005E1000..0x005F1000` | 4 | 0 | 4 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 95 | `0x005F1000..0x00601000` | 3 | 0 | 3 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 96 | `0x00601000..0x00611000` | 4 | 0 | 4 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 97 | `0x00611000..0x00621000` | 4 | 0 | 4 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 98 | `0x00621000..0x00631000` | 5 | 0 | 5 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |
| 99 | `0x00631000..0x0063676C` | 1 | 0 | 1 | 0 | `section-c-huff-pool-005A1000-0063676C-data-ownership` |

## Current Tool Roles

- `tools/verify_baserom.js` verifies Rev 0 identity and writes canonical z64.
- `tools/extract_original_mips.js` emits no-gap `.word` MIPS reference chunks
  for the configured code region.
- `tools/build_rom_coverage_ledger.js` builds the whole-ROM structural ledger
  and rejects suspicious archive-like signatures outside valid LHA headers.
- `tools/extract_rom_segments.js` extracts the ledger's non-overlapping spans as
  raw rebuild inputs.
- `tools/rebuild_rom.js` rebuilds from the segment manifest and fails on any
  byte mismatch. With `--assembled-code`, it substitutes an assembled code blob
  for the configured code-region span.
- `tools/build_full_source_manifest.js` assigns every ROM byte to a source
  strategy and audits ledger/segment/original-MIPS consistency.
- `tools/promote_non_code_sources.js` promotes selected non-code manifest
  entries into tracked `data/source-owners/rev0/` source owners.
- `tools/extract_non_code_sources.js` verifies tracked non-code source owners
  when present and writes ignored byte-exact fallback source-owner files for
  every unpromoted non-code manifest entry.
- `tools/rebuild_from_source_manifest.js` rebuilds from assembled original MIPS
  plus source-owner files and byte-compares against the baserom.
- `tools/assemble_original_mips.js` assembles tracked/generated source chunks
  into one code-region binary. Tracked chunks use GNU `mips64-elf-as`; generated
  fallback chunks use the minimal `.word` assembler. Manifest chunk `parts` are
  assembled in order for named source splits.
- `tools/promote_original_mips.js` promotes generated chunks into tracked
  `asm/original/rev0/` source in deliberate batches.
- `tools/audit_code_region.js` is a read-only code-region audit: it unions the
  parent valid-function intervals and an intrinsic per-window `jr $ra`/opcode/
  pointer/zero/ASCII scan to report the executable extent versus non-code data
  inside the configured code region, and runs a static control-flow edge audit
  (direct branch/J/JAL targets into the suspected data tail). Parent JSON is
  required by default (missing/corrupt = hard error; `--allow-missing-parent-db`
  for intrinsic-only). Reports go to ignored
  `build/coverage/rev0-code-region-audit.json/.md`; it does not touch the rebuild
  path. See `docs/CODE_REGION_AUDIT.md`.
- `tools/dump_function_context.js` is a read-only analysis aid for split passes:
  for a ROM range it joins parent function boundaries, the `symbols_v2` callgraph
  (callees/callers with names), accessed globals, top constants, secondary
  entries, and flags into a per-function context report under ignored
  `build/context/`. Parent JSON required by default (`--allow-missing-parent-db`).
- `tools/split_original_mips_part.js` splits one tracked manifest part into named
  sub-parts (contiguous, no-gap-validated), preserving exact `.word` lines. The
  `--splits-file` entries accept `kind` (`data` / `straddler-head` /
  `straddler-tail`) and `note` for honest data/straddler/recovered-boundary
  headers.
- `tools/plan_chunk.js` → `tools/slice_chunk.js` → (analysis swarm) →
  `tools/integrate_chunk.js` → `tools/check_splits.js` are the chunk-split
  pipeline used for chunks 1+: plan a base partition from the function-context
  report, slice it for the per-slice analysis swarm, integrate the swarm's
  results into a validated `--splits-file`, and run an adversarial fragment check.
  They write only gitignored `build/` artifacts.
- `tools/check_manifest.js` is a read-only manifest integrity audit (contiguity,
  first/last `.word` vs declared range, sha256/textBytes/bytes, and duplicate
  part name/file detection across all chunks). Wired into `verify_setup.js` as
  the `manifestIntegrityAudit` check (2026-07-08).
- `tools/export_function_corrections.js` is a read-only exporter of the loop's
  accumulated function-boundary corrections as a diff against the parent
  function DB (`../scripts/ob64_functions.json`): recovered functions, start
  corrections (preamble-orphan folds), over-merges, data refutes, and
  end-over-extensions, written to ignored `build/corrections/`. The 2026-07-08
  run was delivered parent-side as
  `../scripts/ob64_function_corrections_rev0.json` (parent `docs/mips-decode.md`
  Stage 1b).
- `tools/check_boundaries.js` is a read-only deterministic boundary gate over a
  splits JSON + chunk disasm: overlay-immune invariants (no fragment, no
  cross-boundary PC-relative branch, no prologue-after-return under-split, no
  delay-slot leak, straddler-position sanity) plus a data-island warning. Used
  every chunk alongside `check_splits.js`. `slice_chunk.js` takes `--disasm` to
  slice a code sub-region of a MIXED chunk from the full-chunk disasm.
- `tools/scan_functions.js` seeds the chunk-split pipeline for PARENT-UNDETECTED
  code regions (where `ob64_functions.json`/overlay map have 0 entries, e.g.
  chunks 6–7): framed-function starts = range start + every `addiu $sp,-N`
  prologue; the analysis swarm then recovers frameless leaves. Emits a
  `slice_chunk`-compatible plan. `integrate_chunk.js` treats the context as
  optional so these regions integrate without a parent-DB context file.
- `tools/generate_overlay_config.js` derives the accepted overlay configuration
  from canonical ROM bytes.
- `tools/verify_overlay_config.js` verifies 19 descriptors, groups, pointers,
  source ownership, and hostile controls.
- `tools/generate_phase5b_production_config.js` regenerates the no-gap Splat
  and segment configuration from an accepted Phase 5A product.
- `tools/verify_phase5b_production_config.js` checks configuration identity,
  conservation, unresolved counts, and authenticated Splat provenance.
- `tools/run_phase7_splat.js` runs authenticated Splat into an external output
  directory.
- `tools/build_phase7_conventional.js` produces the conventional ELF, map, and
  exact ROM outside the repository.
- `tools/verify_phase7_conventional.js` rechecks build identities, layout, and
  asm-differ resolution.
- `tools/build_phase8_matching_c.js` replaces configured assembly owners with
  independently written matching C.
- `tools/verify_phase8_matching_c.js` verifies compiler identity, per-target
  section ownership, target bytes, and full-ROM identity.
- `tools/verify_setup.js` is the canonical 21-check setup command. Canonical use
  requires `--phase5a-root <accepted-phase5a-product-root>`.
- `tests/verify_setup_phase5a_root.js` checks strict argument forwarding and the
  preserved integration-local default.
- `tests/binutils_smoke.js` verifies the GNU MIPS binutils path.
- `tests/word_asm_smoke.js` verifies the minimal `.word` assembler used by the
  generated fallback path.


## Setup Complete

Setup is complete when the explicit-root command reports 21 passing checks:

```powershell
$phase5aRoot = '<accepted-phase5a-product-root>'
node tools/verify_setup.js --phase5a-root $phase5aRoot
```

The baseline toolchain is `n64-tools-gcc-toolchain-mips64-win64`. It provides
GNU Binutils 2.39 with `-EB -mips3 -32` on Windows.

Authenticated Splat and KMC prerequisites remain external. Full expected
numbers and evidence limits appear in Current State above.

## Next Best Work

The data-ownership and external-intake programs are complete. There is no chunk
frontier or intake correction pending.

1. Use `docs/NEXT_STEPS.md` for the standing decomp queue.
2. Add matching C incrementally through the accepted build path.
3. Preserve structural names until evidence supports gameplay meaning.
4. Keep the explicit-root setup command green after every layout change.
