# OB64 Decomp - Agent Guide

This file is this repo's local memory gate. Read it first, then read
`docs/PLATFORM.md` for the current platform snapshot and `docs/NEXT_STEPS.md`
for the active work queue.

This repository is the dedicated decompilation workspace for Ogre Battle 64:
Person of Lordly Caliber, US Rev 0 only.

## Scope

- Target ROM: US Rev 0 retail, game ID `NOBE`, country `C:45`.
- Do not add Rev 1 support until the Rev 0 structure, build, and compare loop are
  stable.
- Final tracked output should be source form:
  - C decompilation under `src/`.
  - Original/reference MIPS under `asm/original/`.
  - Nonmatching assembly under `asm/nonmatching/` only while C is not matching.
- Do not commit ROM binaries, save files, savestates, object files, rebuilt ROMs,
  or generated bulk artifacts.

## What This Repo Is (And Is Not)

Honest scope of "source-owned" — read this before trusting any headline number:

- This is currently a **byte-exact disassembly atlas**, not a matched
  decompilation. All 6,181 tracked `.s` files (code AND data) are `.word`
  directive dumps; the MIPS mnemonics in them are trailing comments generated
  by `tools/lib/mips.js` and are decode AIDS — no gate validates them.
- There is **zero decompiled C** so far: `src/` and `include/` are `.gitkeep`
  scaffolds. "Source-owned" means byte ownership + named layout +
  classification evidence, NOT semantic understanding.
- Editing tracked source is **word-patching**, not source editing: there are no
  symbols or relocations, and branch/JAL targets are hardcoded, so code can be
  overwritten in place but never resized or relinked.
- This repo does **not** compute the CIC-6102 checksum. Byte-identical rebuilds
  preserve the stock CRC trivially, but any real patch inside the z64 CRC
  window `0x1000..0x100FFF` needs the parent workspace's CRC tooling or the
  ROM freezes.
- Rebuild output is canonical **z64**; the parent editor consumes the supported
  US retail **.v64**. Convert byte order before feeding rebuilt ROMs to
  editor/emulator flows that expect `.v64`.

## Relationship To Parent Workspace

The parent `OgreBattlel64` workspace remains the research lab: emulator traces,
runtime probes, editor experiments, patch builders, and large generated artifacts
belong there until they become stable decomp inputs.

This repo should contain reproducible decomp source, configuration, curated docs,
and tools. When importing facts from the parent workspace, include the source doc
or artifact path in the relevant note.

This canonical Git-linked decomp is a clean-room boundary. External-derived
source from Hijs, AdrSheik, or another unlicensed personal decomp may be verified
and retained only in the separate local integration fork at
`C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration`. Never copy, cherry-pick,
mechanically rewrite, or merge that external-derived source, configuration,
comments, or documentation into this repository. Correctness verification does
not convert external work into our work.

Only work independently produced by our project may enter this repository, with
its own ROM/evidence derivation and normal review gates. Independently verified
facts such as addresses, boundaries, and library identity may define the problem
being solved, but external expression may not be copied. Record provenance so a
canonical promotion cannot be confused with external-source intake.

## Required Context

Before decomp work, read:

1. Parent `AGENTS.md`.
2. Local `docs/PLATFORM.md`.
3. Local `docs/REV0_SCOPE.md`.
4. Local `docs/TOOLCHAIN.md`.
5. Local `docs/WORKFLOW.md`.
6. Local `docs/DECOMP_LOG.md`.
7. Local `docs/FULL_ROM_SOURCE_MANIFEST.md`.
8. Local `docs/NEXT_STEPS.md`.
9. Parent `docs/mips-decomp-workflow-plan.md`.
10. Parent `docs/mips-decode.md`.
11. Parent `docs/overlay-system.md`.
12. The relevant subsystem doc in the parent `docs/` folder.

When a durable fact changes, update this file and the relevant local doc before
committing. If the fact came from parent-workspace research, include the parent
source path in the note.

## Address Rules

- Documentation offsets use z64 byte order.
- The local baserom may be supplied as `.v64`, `.z64`, or `.n64`, but tools
  should normalize to canonical z64 bytes for extraction and comparison.
- Only the boot region below roughly z64 `0x0002F000` follows the simple
  `RAM = ROM + 0x8006FC00` mapping.
- Later code is overlay-loaded and must be resolved through the overlay map.

## Evidence Rules

- Static decomp output is candidate evidence.
- Runtime trace or controlled mutation is required before naming behavior as
  verified.
- Matching code is not automatically semantic proof; semantic claims still need
  subsystem evidence.
- Update docs when a function name, struct field, segment boundary, or overlay
  mapping becomes durable.

## No-Gap Decomp Rule

The repo may have incomplete C and imperfect function boundaries, but every byte
in a configured segment must remain represented by source. The current
`tools/extract_original_mips.js` first pass preserves the Rev 0 code region by
emitting every 4-byte word as `.word` plus a decode comment into ignored
`build/original-mips/rev0/`. Promote generated original MIPS into
`asm/original/` only after the split/link/compare policy is stable.

## Current Rev 0 Coverage Ledger

`tools/build_rom_coverage_ledger.js` is the whole-ROM structural safety check.
It independently scans LHA headers instead of trusting the parent archive
catalog alone, compares count and offsets with the parent catalog, records
rejected method-like signatures, and reports overlaps.

Current Rev 0 result:

- Valid parsed LHA archives: 825.
- Parent catalog offsets match: yes.
- Method-like signatures: 837 total, 12 rejected/unparsed, none in unknown
  space.
- Unknown bytes: 0.
- Archive-gap bytes: 2,429,124.
- Tail data: `0x0275415B..0x0275DD40`.
- Clean trailing `0xFF` padding: `0x0275DD40..0x02800000`.

## Full-ROM Source Manifest

`tools/build_full_source_manifest.js` audits the coverage ledger, raw segment
manifest, original-MIPS report, and assembled-code report into a full-ROM source
ownership manifest. It is part of `node tools/verify_setup.js`.

Current result:

- Entries: 1,060 contiguous ROM spans (code span split at the pinned extent 2026-07-09).
- ROM bytes covered: 41,943,040 / 41,943,040.
- Unknown bytes: 0.
- Original-MIPS source bytes: 2,849,208 (the pinned executable extent); owned_data_parts (reclassified data tail, assembled-blob-backed): 3,661,236.
- Non-code/raw/data/archive source bytes: 35,432,596.
- Ambiguous bytes preserved explicitly: 2,469,141.

The generated manifest lives under ignored `build/source-manifest/`. Durable
policy and current numbers are in `docs/FULL_ROM_SOURCE_MANIFEST.md`.

Tracked non-code source owners now begin under `data/source-owners/rev0/`.
`tools/promote_non_code_sources.js` promotes selected non-code source-manifest
entries into tracked `.srcbin` files and writes
`data/source-owners/rev0/manifest.json`. `tools/extract_non_code_sources.js`
verifies that tracked manifest and prefers matching tracked files while still
generating ignored fallback owners for every unpromoted non-code span.

Current tracked batch:

- `raw_header` `0x00000000..0x00001000` (4,096 bytes).
- `raw_structural_gap` `0x0063676C..0x00636784` (24 bytes).
- `raw_tail_data` `0x0275415B..0x0275DD40` (39,909 bytes, ambiguous).

Current source-owner mix: 3 tracked files / 44,029 bytes, plus 1,055 generated
fallback files / 35,388,567 bytes. Total non-code source ownership remains
1,058 files / 35,432,596 bytes.

## Code Region Extent (Code vs Data) — RECLASSIFIED 2026-07-09

The boundary is PINNED and the reclassification is DONE, enforced by the gate:

- **Executable extent: `0x00001000..0x002B89B8`** (2,849,208 bytes). Pin
  evidence: last instruction `jr $ra` @`0x2B89B0` + delay slot @`0x2B89B4`
  (end of `func_002B88C8`, chunk 43); the next part is `zero_fill_002B89B8`.
  Recorded in `config/roms/us_rev0.json` `executableExtent`.
- **The tail `0x002B89B8..0x0063676C`** (3,661,236 bytes) is classified DATA:
  ledger category `code_region_data_tail`, source form `owned_data_parts` —
  still byte-owned by the same tracked `asm/original/rev0` `.word` parts via
  the assembled blob (`codeRegion` remains the assembly/tiling region), but
  no longer counted or reported as MIPS.
- **Gate enforcement:** `verify_setup.js` (19 checks) runs
  `audit_code_region.js` every time and asserts `executableExtentPinned`
  (config pin == audit jr-ra extent + the 4-byte final delay slot; tail
  verdict data-evidenced; no credible control-flow edge into the tail) and
  `codeDataSplitHonest` (manifest byte counts exactly match the split).
- The parent function DB's `0x00594A9C` `valid:false` entry stays excluded
  (compressed-data false positive inside Section C).
- `audit_code_region.js` requires the parent function DB by default (missing
  or corrupt = hard error); `--allow-missing-parent-db` downgrades to
  intrinsic-only mode.
- Tracked non-code source owners are matched by ROM RANGE, not manifest entry
  index (indexes shift when ledger spans split).

Evidence and history: `docs/CODE_REGION_AUDIT.md`.

## Exact Rebuild Rule

Before replacing raw bytes with assembly or C, preserve the exact-rebuild loop:

```powershell
node tools/verify_setup.js
```

`verify_setup.js` runs baserom verification, whole-ROM coverage, MIPS extraction,
binutils smoke tests, raw rebuild, full-ROM source-manifest audit, non-code
source-owner extraction, source-manifest rebuild, and assembled-code rebuild. It
must report PASS before source replacement work is considered safe.

Current exact rebuild result:

- Segment count: 1,060.
- Total bytes: 41,943,040.
- Rebuilt/reference SHA256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
- Exact match: pass.
- First diff: none.

## Assembly-Backed Code Rebuild

`tools/assemble_original_mips.js` assembles the generated no-gap `.word`
reference into ignored `build/assembled/rev0/code.bin`. It prefers tracked
chunks under `asm/original/rev0/` when present and falls back to generated chunks
under `build/original-mips/rev0/` for ranges not yet promoted. Tracked chunks go
through the real GNU MIPS assembler configured in `config/toolchain.json`;
generated fallback chunks still use the minimal `.word` path until promoted.
Tracked manifest chunks may now contain ordered `parts`, allowing a promoted
64 KiB chunk to be split into named source files while still rebuilding as one
no-gap source range.

Current result:

- Assembled code region: `0x00001000..0x0063676C`.
- Bytes: 6,510,444 (assembly/tiling region; classified as 2,849,208 code + 3,661,236 owned data tail).
- Code-region SHA256:
  `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.
- Code-region match against baserom: pass.
- Tracked real-assembler original-MIPS chunks: **100 composites** (chunk 0 in
  `boot/`, chunks 1-99 in `lib/`) = **6,181 tracked source files, 0 generated
  fallback chunks**. The ENTIRE configured code region `0x00001000..0x0063676C`
  is fully source-owned as named code/data parts; the data-ownership loop is
  COMPLETE (2026-06-24). Canonical current-state references, in order:
  `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md` (consolidated loop report),
  `docs/PLATFORM.md` (per-chunk composition), `docs/NEXT_STEPS.md` (active
  queue), per-chunk dossiers under `docs/dossiers/`, machine-readable
  inventories under `docs/data-index/rev0/`. Do NOT re-grow per-chunk narrative
  in this file; the pre-migration narrative is archived verbatim in
  `docs/archive/AGENTS-run-log-archive-2026-07-08.md`.
- Generated fallback chunks: 0.
- Assembled-code ROM rebuild command:

```powershell
node tools/assemble_original_mips.js
node tools/rebuild_rom.js --assembled-code build/assembled/rev0/code.bin --out dist/rebuilt.us_rev0.assembled-code.z64 --report build/rebuild/rev0-assembled-code-rebuild-report.json
```

The assembled-code rebuild currently preserves the full ROM SHA256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` exactly.
Every configured code chunk is now tracked (promotion complete 2026-06-24), so
`assemble_original_mips.js --strict-tracked` is valid; any future source-layout
change must keep the exact rebuild gate green.

## Source Layout Status And Split Pipeline

Per-chunk composition (code/data/straddler counts, region maps, decoded tables)
lives in `docs/PLATFORM.md`, the per-chunk `docs/dossiers/` files, and
`docs/data-index/rev0/*.json`. The tracked chunk-split pipeline and the MIXED
chunk data-classification procedure are specified in `docs/WORKFLOW.md` ("Chunk
Split Pipeline"). The pre-migration AGENTS.md narrative for chunks 0-33 is
archived verbatim in `docs/archive/AGENTS-run-log-archive-2026-07-08.md`.

## Parent Function DB Hazards

Durable rules, validated across dozens of chunks, for consuming parent
`scripts/ob64_functions.json` / `ob64_symbols_v2.json` boundaries:

- The parent DB **over-merges** real functions (spurious "secondary entries")
  and **hides** many jal-reachable accessor/leaf functions — especially
  FRAMELESS leaves with no `addiu $sp` prologue (chunk 4 alone had ~211
  recovered).
- It **orphans 2-4 word read-before-write load preambles** onto the previous
  function's tail, so true entries often precede the labeled start (first
  corrected at `0xD248`/`0xD600`/`0xECF0`/`0xF22C`, then at dozens of later
  sites).
- It has **mislabeled multi-KB data islands as functions** (chunks 23/24,
  refuted byte-exactly: 0 prologues / 0 returns) and **missed whole code
  regions** (chunks 6-7 PARENT-UNDETECTED).
- Therefore: validate every boundary from the disassembly; treat parent labels
  as leads only. Use conservative `func_*` names in overlay-relocated chunks
  unless runtime evidence supports semantics (see Evidence Rules).

## Definitions

Centralized vocabulary (previously scattered across run templates and parent
docs):

- **Source ownership** (data-territory template "Ownership Standard"):
  byte-exact tracked source owners for every byte of a range (or explicit
  gaps), plus provenance, plus parser/dumper/catalog or strong byte-pattern
  evidence, plus hidden-code checks, plus confidence/caveats. Final status is
  yes / partial / no; span status is parsed / raw-but-classified / undecoded /
  owned-candidate / gap. "Bytes owned: yes" does NOT imply the natural unit is
  decoded.
- **Parser-backed**: boundaries proven by an actual round-tripping codec (e.g.
  the parent `anim_block_codec.py` over Section B), not by heuristics.
- **Gate-1 / Gate-2** (parent cutscene validation tiers, defined in parent
  `docs/cutscene-system.md` and its archived plan doc): Gate 1 = offline
  byte-identical round-trip through a codec; Gate 2 = in-game behavioral proof
  of the write path. Imported here as classification evidence only — never as
  a build gate.
- **RUN-COMPLETE / FALLBACK / LOOP-COMPLETE** (bridge/run vocabulary from
  `docs/templates/`): RUN-COMPLETE = all target chunks complete + verified +
  committed + review handoff written; FALLBACK = a principled early stop at a
  safe chunk boundary with the blocking reason recorded (partial success must
  NOT signal run-complete); LOOP-COMPLETE = the configured stop condition
  reached.
- **Promotion-grade**: a parent fact is importable here only with an evidence
  grade (`[live]`/`[edit]`/`[code+multi]`) and a per-claim parent artifact
  citation; below-bar claims go in an explicit "Explicitly NOT promoted" list.
  Pattern: `docs/subsystems/map-ai-eset-runtime.md`.

## Known Gate Limitations

Honest current limits of the verification chain — do not over-trust it:

- `verify_setup.js` proves BYTE identity, not semantics. The disassembly
  comments were cross-validated against `mips64-elf-objdump` on 2026-07-08
  (`docs/DISASM_VALIDATION_2026-07-08.md`): 0 genuine decode disagreements
  across the executable extent; residual limits are pseudo-instruction naming
  variants, generic `cop0_0x10` rendering for 5 COP0 CO-bit ops, and no
  coverage of the data tail (whose comments are acknowledged noise by design).
- `tools/check_manifest.js` is wired into `verify_setup.js` as the
  `manifestIntegrityAudit` check (2026-07-08).
- Non-code "ownership" outside the 3 tracked `.srcbin` owners is regenerated
  from the local baserom at verify time (1,055 fallback files) — that path
  proves plumbing, not tracked source.
- The analysis/adversarial swarm scripts that decided split boundaries lived
  under gitignored `build/` (`wf_analyze.js`/`wf_data.js`/`wf_adversarial.js`)
  and are not reproducible from this repo; the `docs/REVIEW_*.md` handoffs are
  the durable record of what they found.
- The pinned toolchain is Windows-only (`config/toolchain.json` hardcodes
  `.exe` paths).
- `.gitattributes` declares `*.srcbin binary` (2026-07-08), so promoted
  non-code owners are safe from text/eol normalization.

## Backup And Remote Status

This repo has NO git remote by owner decision (2026-07-08). The corpus lives on
this machine and the parent workspace gitignores the nested repo; Joe maintains
manual backups. Do not add a remote, push, or publish any part of this repo
without Joe's explicit direction — the tracked `.s` files encode ROM-derived
bytes, so treat the entire repo as private.

## Documentation Policy (Anti-Duplication)

- This file holds durable RULES only. Run history goes to `docs/DECOMP_LOG.md`
  (compact at ~10k tokens into `docs/archive/`), per-run review handoffs to
  `docs/REVIEW_*.md`, and consolidated milestones to reports like
  `docs/FINAL_DATA_OWNERSHIP_REPORT_2026-06-24.md`.
- The chunk-by-chunk narrative has exactly two canonical homes:
  `docs/PLATFORM.md` (current composition) and the FINAL report (loop summary).
  Do not clone it into this file or `docs/NEXT_STEPS.md` again; link instead.
- On 2026-07-08 the accreted ~85-section run log and status narratives were
  migrated verbatim to `docs/archive/AGENTS-run-log-archive-2026-07-08.md`
  (mirroring the parent's 2026-07-02 AGENTS migration).

## Decomp-To-Parent Promotion

Knowledge must flow both ways. When this repo produces a decomp-novel durable
fact (a decoded container/format, a section boundary, executable-extent
evidence, a parent function-DB correction), promote it to the parent workspace
instead of letting it sit here:

- Write or extend a curated evidence-graded doc for the parent (the reverse of
  `docs/subsystems/map-ai-eset-runtime.md`), or update the relevant parent
  `docs/` domain doc directly, citing the decomp artifact paths (dossier,
  data-index JSON, review handoff).
- Add a dated entry to parent `docs/OB64Decomp-log.md`.
- Reverse-promotion candidates owed as of 2026-07-08: the Section A audio-bank
  format (PtrTablesV2/WaveTables VADPCM), the A/B boundary `0x4E3140`, the
  Section B 1,798-record index, the Section C NJPG "HUFF" pool + 65-entry
  directory, and the accumulated parent function-DB corrections.

## Setup Complete Gate

The setup phase is complete when `node tools/verify_setup.js` passes. Current
setup-complete state:

- Local toolchain: `n64-tools-gcc-toolchain-mips64-win64` (Windows-only).
- Toolchain source:
  `https://github.com/n64-tools/gcc-toolchain-mips64/releases/download/latest/gcc-toolchain-mips64-win64.zip`.
- Archive SHA256:
  `7EE3598AC151C0A728DCFD916E3DF615793D2ED0A28CDC0CCAFA31EEF76526BB`.
- Installed under ignored `.toolchains/gcc-toolchain-mips64-win64/`.
- Assembler: GNU Binutils 2.39 `mips64-elf-as.exe` with `-EB -mips3 -32`.
- Setup verifier: `tools/verify_setup.js`.
- Current verifier result: PASS; 825 archives, 0 unknown bytes, 108 overlap
  bytes visible, 100 tracked composite real-asm chunks made from 6,181 tracked
  source files (chunks 0-99 fully source-owned as code/data parts,
  `0x00001000..0x0063676C` — the entire configured code region; data-ownership
  loop COMPLETE 2026-06-24), 0 generated fallback chunks, full-source manifest
  1,060 entries with 2,469,141 ambiguous bytes preserved explicitly, 3 tracked
  non-code source-owner files / 44,029 bytes, 1,055 generated non-code fallback
  files / 35,388,567 bytes, source-manifest rebuild exact, full ROM SHA256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The data-ownership loop is COMPLETE; there is no open chunk frontier. The
active queue lives in `docs/NEXT_STEPS.md` (code/data boundary reclassification
track, optional NJPG render track, non-code owner-batch promotion). There is no
tooling blocker. Do not begin semantic C decomp unless the setup verifier is
green.
