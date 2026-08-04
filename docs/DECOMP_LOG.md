# OB64 Decomp Log

This is the compact current-state decomp memory. Full historical logs are
archived under `docs/archive/`; the newest full archive before this compaction
is `docs/archive/DECOMP_LOG-full-2026-07-08.md` (through the map-AI/ESET
import), preceded by the 2026-06-21 archives.

Read this after `AGENTS.md`, `docs/PLATFORM.md`, `docs/REV0_SCOPE.md`,
`docs/TOOLCHAIN.md`, and `docs/WORKFLOW.md`. Keep this file focused on durable
session facts, active frontiers, and verification results. If it again grows
toward roughly 10,000 tokens, archive the full version under `docs/archive/`
and replace the active log with a compact current-state summary.

## Current Invariants

- Target: Ogre Battle 64 US Rev 0 only.
- Every configured byte must remain source-owned. The full-ROM source manifest
  covers all 41,943,040 bytes with zero unknown bytes.
- Whole-ROM coverage independently scans for LHA headers; do not trust the
  parent archive catalog by itself.
- Executable extent `0x1000..0x2B89B8` — boundary PINNED and the 3.66 MB tail
  RECLASSIFIED as data (`owned_data_parts`) 2026-07-09, gate-enforced
  (`docs/CODE_REGION_AUDIT.md` closure). `codeRegion` in config is the
  assembly/tiling region only.
- Current state numbers, the per-chunk composition table, and the section map
  live in `docs/PLATFORM.md`; the loop summary lives in
  `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`. Do not clone the chunk
  narrative into this file (AGENTS.md Documentation Policy).
- Gate: `node tools/verify_setup.js --phase5a-root <accepted-root>` must pass
  all 21 checks after every source-layout change.
- Current tracked assembly owners: 6,184 across 100 composites, with zero
  generated fallback chunks.
- Code SHA `40D4E787...B409` and ROM SHA `571E8339...CC67A` remain exact.

## Dated Log (compact)

- **2026-06-20..24 — the data-ownership loop** (full detail: the archives + the
  FINAL report): setup, chunk-split pipeline, chunks 0-99 source-owned
  (`0x1000..0x63676C`, 6,181 files, 0 fallback). LOOP-COMPLETE 2026-06-24.
- **2026-06-28 — Section C classified NJPG** (`b245157`): "HUFF" pool = 29
  N64 JPEG/NJPG-style 320x240 blocks; MSB-first JPEG Huffman decode 29/29 to
  230,400-byte coefficient buffers; render stage pending. Final consolidated
  report committed: `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.
- **2026-07-03 — runtime fact import: map-AI/ESET** (`fd9afc1`):
  `docs/subsystems/map-ai-eset-runtime.md` — 14 evidence-named function
  identities, 16 data labels, struct sketches, three proven overlay VRAM
  deltas beyond the boot linear rule; every claim graded
  ([live]/[edit]/[code+multi]) with parent artifact citations; the
  "Explicitly NOT promoted" list is binding. Naming source for the
  `0x101000..0x130000` overlay + `0x195xxx..0x197xxx` scenario-loader module.
- **2026-07-08 — repo assessment + AGENTS migration** (`d259dca`): 13-agent
  verified read-only assessment; AGENTS.md restored to a thin rulebook (~85
  run-log sections archived verbatim to
  `docs/archive/AGENTS-run-log-archive-2026-07-08.md`); new AGENTS sections
  (What This Repo Is / Definitions / Parent Function DB Hazards / Known Gate
  Limitations / Backup And Remote Status / Documentation Policy /
  Decomp-To-Parent Promotion). Fix plan:
  `docs/PLAN_2026-07-08-assessment-fixes.md`. No git remote by owner decision;
  Joe maintains manual backups.
- **2026-07-08 — P5 hardening** (`1af761a`): `*.srcbin binary` gitattribute;
  `check_manifest.js` wired into `verify_setup.js` (17 checks, PASS); decode
  comments cross-validated against `mips64-elf-objdump` over the executable
  extent — **0 genuine decode disagreements** across 608,395 code rows
  (`docs/DISASM_VALIDATION_2026-07-08.md`; residuals: pseudo-instruction
  rendering variants + 5 COP0 CO-bit ops as `cop0_0x10`).
- **2026-07-08 — P1 reverse-promotion** (parent `9d524c4`): Section A/B/C
  decodes + data-tail map promoted into parent `rom-layout.md`,
  `cutscene-system.md`, `pending-tasks.md` #7, `OB64Decomp-log.md`.
- **2026-07-08 — P2 function-DB corrections** (`acd9bfc`; parent `7edf0f9`):
  `tools/export_function_corrections.js` diffs the manifest parts against
  parent `scripts/ob64_functions.json` over the executable extent — 1,279
  recovered functions, 714 start corrections (646 preamble-orphan folds), 497
  over-merges, 2 data refutes, 3 end-over-extensions, 1 tail false positive
  (`0x594A9C`). Spot-verified vs documented ground truth (0xD248 family exact;
  chunks 6-7 = 105 exact). Delivered as parent
  `scripts/ob64_function_corrections_rev0.json` (mips-decode.md Stage 1b);
  wholesale regeneration filed as parent pending-tasks #16.
- **2026-07-08 — P6 doc dedupe** (`5e67bbf`): DECOMP_LOG compacted (full
  version archived as `docs/archive/DECOMP_LOG-full-2026-07-08.md`);
  PLATFORM.md rebuilt around a manifest-generated per-chunk table
  (pre-dedupe snapshot `docs/archive/PLATFORM-full-2026-07-08.md`);
  NEXT_STEPS reduced to the queue (snapshot
  `docs/archive/NEXT_STEPS-full-2026-07-08.md`).
- **2026-07-08 — P3 NJPG render stage**: `tools/render_section_c_njpg.js`
  renders the Section C pool (de-zigzag, FLAT dequant — spectrum analysis
  refuted Annex-K ramps — IDCT, 4:2:0, BT.601) to PNGs under `build/njpg/`.
  All 29 blocks render at 0% clip. Animation-loop hypothesis REFUTED. Joe's
  eyeball pass: tentative ID = **battle backgrounds**, grouped in **~14
  chroma-signature-confirmed PAIRS + 1**; chroma appears stored NEGATED vs
  standard JPEG (`--chroma neg` turns the pink cast into green/olive painted
  terrain washes; chroma is near-DC-only = flat washes). `--scale` option
  added for review (`*_neg_2x.png`). Open: prove the negation from the
  in-game decoder, pair semantics, flat-scale constant, in-game consumer
  trace. Details in `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.

- **2026-07-09 — P4 editor data port + attack-name decode**: new generator
  `tools/export_editor_names.js` -> editor `rom-names-data.js`. Solved the
  combat action ID -> name mapping STATICALLY: action table @0x60980 (158 x
  0x10), name pointer at +0xC, overlay RAM delta `0x8012A100`
  (anchor-verified); 149/158 resolve to exact name-pool entries
  (`0x5D560-0x5DAD4`), 9 caster actions (IDs 45-48/51-54/145) share the
  dynamic-name slot RAM `0x8018FEB8` / ROM `0x65DB8` (element-composed at
  runtime). **REFUTED the parent hard rule "attack names are runtime-only"**
  (linear-mapping fallacy; corrected in parent CLAUDE/AGENTS/platform/
  rom-layout). Also fixed the editor's shifted `SPELL_NAMES` (6 skipped
  multi-line entries, 82 wrong keys, no consumers) and ported mission +
  equipment-type name pools with per-entry ROM offsets. Editor wiring:
  B43/B45/B47 tooltips show resolved names; browser smoke test clean.

- **2026-07-09 — P7 executable-extent reclassification (gate-enforced)**:
  boundary PINNED at `0x2B89B8` (last `jr $ra` @0x2B89B0 + delay slot =
  func_002B88C8 end; next part zero_fill_002B89B8). Ledger splits the old
  code span into `code` + `code_region_data_tail`; manifest maps the tail to
  new source form `owned_data_parts` (DATA, assembled-blob-backed, same
  tracked parts; 3,661,236 B) leaving `original_mips` = the extent
  (2,849,208 B); manifest 1,060 entries. `rebuild_rom --assembled-code`
  slices across split segments; tracked owners matched by ROM range.
  `verify_setup` now 19 checks incl. `executableExtentPinned` +
  `codeDataSplitHonest` (audit runs every gate). Both SHAs unchanged.
  Closure: `docs/CODE_REGION_AUDIT.md`.
- **2026-08-01 — external-intake program accepted and promoted locally**:
  Final review `f55c5832d74ee5f68d6619afff7d2dd859cdd257` accepted the program.
  Correction review `9a42b85f4a3b3858d0862a1e3c33aa8e5ee4b02f` accepted the explicit
  Phase 5A setup-root interface and 52-action boundary. Canonical technical
  commit `31e781898a585285f87a4dd3b4edd91bc6319b5a` promotes that boundary.
  The no-renames delta contains 43 additions, eight modifications, and one
  deletion. The 21-check setup gate passes with unchanged code and ROM hashes.
  Accepted capabilities include overlay configuration, Splat 0.34.0 ownership,
  a conventional linker build, and one 36-byte matching-C function.
  `func_000E5938` remains a structural name without gameplay semantics.
  Five segment candidates and 6,154 function candidates remain unresolved.

- **2026-08-02 — matching-C high-value Wave 1 accepted**: canonical worker
  commit `444c99c3a163d8526ced583e1d6c63626a21f54c` adds structural function
  `func_0000B33C` at z64 ROM `0x0000B33C..0x0000B3E4` as independently
  derived C. Fresh Critical review accepted both configured C targets with two
  documentation corrections at commit
  `6082c2f755d08dcfc514a28c12b145c3085818db`. Cleanup commit
  `0a4c16c765272e6ad4aebcf6d12c4c469dd21c9e` distinguishes object and linked
  hashes and marks the recovered compiler-manifest blocker as historical. The
  168-byte linked target, existing 36-byte target, code region, and full ROM
  remain exact. Matching proves structure and build identity, not gameplay
  semantics.

- **2026-08-02 — matching-C high-value Wave 2 accepted**: canonical worker
  commit `f06aea6b5bc8cd9c99ab09881e4f91a55474a602` adds structural function
  `func_00007688` at z64 ROM `0x00007688..0x00007768` as independently
  derived C. Its accepted owner contains secondary entry `func_00007714` at
  offset `0x8C`. Fresh Critical review returned `Accepted` at commit
  `082ad7a02be2b6069c2843d1aad4eeab7785ccf2`. The 224-byte linked target,
  both earlier C targets, relocations, code region, and full ROM remain exact.
  Two fresh roots reproduced the same identities. Matching proves structure
  and build identity, not state-slot semantics or gameplay behavior.

- **2026-08-02 — matching-C high-value Wave 3 accepted**: canonical worker
  commit `b0cdbc4d6efcfc1264214959ca17b3bf8c4b0399` adds structural function
  `func_0000BC8C` at z64 ROM `0x0000BC8C..0x0000BE98` as independently
  derived C. The 524-byte resolver owner has no secondary entry. Fresh Critical
  review returned `Accepted` at commit
  `c51f9988abdaf3e5ab7e6d6e13b18544a928b488`. All four C targets,
  relocations, code region, and full ROM remain exact. Two fresh review roots
  reproduced the same identities. Matching proves static structure and build
  identity, not runtime behavior or gameplay meaning.

- **2026-08-02 — matching-C high-value Wave 4 accepted**: canonical worker
  commit `db8f7e697bdffc9ed6b3224894db4efe5cd2d6aa` adds structural function
  `func_00269470` at z64 ROM `0x00269470..0x00269798` as independently
  derived C. The 808-byte overlay owner has no secondary entry and preserves
  42 relocations. Fresh Critical review returned `Accepted with corrections`
  at commit `fd7dd36d521a5f6a96ee3812de56642a8ba5daf0`. Cleanup commit
  `d4c4c3d1e88ae7a81d17f147741c8559882e1f90` corrects only the comparison-
  report identity. All five C targets, relocations, code region, and full ROM
  remain exact. Matching proves static structure and build identity, not
  runtime behavior or gameplay meaning.

- **2026-08-02 — matching-C high-value Wave 5 accepted**: canonical worker
  commit `470d7c4f9686e73f728d23862601c9d97a9110b2` adds structural function
  `func_0026B360` at z64 ROM `0x0026B360..0x0026B7E4` as independently
  derived C. The 1,156-byte overlay descriptor 12 owner has no secondary entry
  and preserves 29 `.rel.text` relocations plus one `.rel.pdr` relocation.
  Fresh Critical review returned `Accepted` at commit
  `8d2d0d947729778b0b50fe6ea9a62f85b2b815d5`. All six C targets,
  relocations, code region, and full ROM remain exact. Matching proves static
  structure and build identity, not runtime behavior or gameplay meaning.

- **2026-08-02 — matching-C high-value Wave 6 accepted**: canonical worker
  commit `7d527a7ff8c3ad01ba00d586aee6ef7dba567d39` adds structural function
  `func_0026B820` at z64 ROM `0x0026B820..0x0026BCCC` as independently
  derived C. The 1,196-byte overlay descriptor 12 owner has no secondary entry.
  Fresh Critical review returned `Accepted with corrections` at commit
  `b9a2e5acc53d3aee009a46edae88fd2d5a5b89f8`. Cleanup commit
  `ed78fc639dcdf4593b32d7092313161143ef9b8e` corrects relocation-count prose.
  All seven C targets, relocations, code region, and full ROM remain exact.
  Matching proves static structure and build identity, not runtime behavior or
  gameplay meaning.

- **2026-08-03 — four-lane Lane C target 1 accepted**: canonical correction
  commit `0e2499d35ec34dd7399cfb041cd17cc2c1b99af3` admits the authenticated
  cumulative row-565 Phase 5B profile. Lane C commit
  `bb88c6d175ddf5e65c05bb7b0730d4466d243c13` adds structural function
  `func_000241F8` at z64 ROM `0x000241F8..0x00024250` as Lane C's eighth
  target. It remains pending canonical batch promotion. Fresh Critical review
  returned `Accepted` at parent commit
  `606771c76bc7b84d0d18a6f2b833b4d9ec3ca5ed`. Two fresh builds preserved
  exact object, linked, placement, relocation, code-region, and full-ROM
  identities. Matching proves static structure and build identity, not runtime
  behavior or gameplay meaning.

- **2026-08-03 — four-lane canonical promotions accepted through Lane D**:
  Lane A promotion `6ca9a3bdbb3197b4289d9d12e86a15bccc055c01`, Lane B accepted
  correction `76ab996e818c54e23e51a89ae5fd32e96fcd8794`, and Lane D promotion
  `6b493bf1108e026e516c74029e472ace89d7dd75` expand canonical matching C
  from seven to nineteen structural owners. Lane D's fresh Sol Max Critical
  review froze at parent commit `b650ccf2d677a974defcc0b27f8fe1fde77a2266`.
  Three fresh review roots preserved exact full-ROM and code-region identities.
  Matching proves clean-room static structure and build identity, not gameplay
  meaning or runtime behavior.

- **2026-08-03 — Lane A batch 02 canonical promotion accepted**: Canonical
  commit `675caf7db95d09ae8e945da9211ef9555983919e` adds independently reviewed
  `func_00269798` as the twentieth matching-C owner. The Sol Max Critical review
  froze at parent commit `bda65be82da0e28ea4bd0451022cf21715576a23`.
  Two fresh review roots preserved exact full-ROM and code-region identities.
  Matching proves clean-room static structure and build identity, not gameplay
  meaning or runtime behavior.

## Dossier Set

139+ dossiers under `docs/dossiers/`: 81 `boot-*` (chunk 0 splits), 47
`lib-chunkNN-*` (one per library chunk), 10 `section-*` data-ownership, 1
survey, plus `docs/subsystems/map-ai-eset-runtime.md`. Machine-readable
inventories: `docs/data-index/rev0/*.json`. Review handoffs: `docs/REVIEW_*.md`.

## Next Frontier

The data-ownership and external-intake programs are complete. No chunk frontier
or intake correction remains.

The active queue is `docs/NEXT_STEPS.md`. It prioritizes incremental matching C,
evidence-based naming, non-code owner promotion, and optional decode work.

The structural gap `0x63676C..0x636784` and LHA region `0x636784+` remain
outside scope without Joe's authority.

2026-07-09 parent Phase-1 checkpoint: Milestones 1 and 2 are complete in the
parent workspace. Atlas-authoritative dossiers now cover the cutscene
interpreter, all 45 VM handlers, and six overlay-resolved pose/director
functions. The Project64 JSONL ingester mapped a content-verified opening-
ceremony run 89/89 with no ambiguity, promoted opcode `0x90` (ROM `0x114F0`)
after 38 handler-entry hits, and mapped the creator/integrator coordinate
writers to `func_002A0B14` / `func_002A0EF0`. A recovered prior capture then
mapped 169/169 events (145 more `0x90`, 24 `0x84`), verifying both handler
entries. Milestone 4 closes with
`docs/subsystems/cutscene-animation-vm-runtime.md`. Parent evidence:
`../../wiki/decomp/traces/op84-op90-runtime-20260709/runtime-summary.md`. No
byte-exact atlas source or manifest changed in this pass.

2026-07-09 coordinator linkage correction: the M4 packet's controller `+0x7C`
"linked sprite" claim is REFUTED, not merely demoted. The offset was an
adjacency heuristic in the parent capture tooling; disassembly of atlas parts
`func_00014830`/`func_0001489c` (VM ops `0x95`/`0x96`) proves the alleged
sprite bundle field `(C+0x7C)+0x74 = C+0xF0` is the repeat-stack save slot
for the mutable `+0x38` parser cursor (depth byte `+0xDB`, frames
`+0xE0..+0x13B`). The packet now promotes the repeat-stack decode at
[code+multi] and lists ANY controller→sprite pairing offset as not promoted;
true ownership is the parent's Phase-1 P0. Review chain: parent
`wiki/after-action-reports/20260709-cutscene-controller-plus7c-linkage-review-aar.md`
and `2026-07-09-phase1-coordinator-review.md`. No atlas source or manifest
changed.
