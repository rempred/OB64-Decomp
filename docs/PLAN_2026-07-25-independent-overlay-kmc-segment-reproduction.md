# Independent Overlay, KMC, and Segment Reproduction Plan

Status: **superseded and closed — 2026-08-01**
Created: 2026-07-25
Intake updated: 2026-07-26
Target: Ogre Battle 64 US Rev 0 only
Superseded by:
`C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\PLAN_2026-07-30-independent-external-intake-validation-r2.md`

## Closure

This proposal never became the active authority. Its editor slice never received
Joe's authorization.

The external-intake program replaced this proposal and completed its decomp
build objectives under independent review.

Canonical technical promotion commit
`31e781898a585285f87a4dd3b4edd91bc6319b5a` contains the accepted clean-room
delta. Integration review commits
`f55c5832d74ee5f68d6619afff7d2dd859cdd257` and
`9a42b85f4a3b3858d0862a1e3c33aa8e5ee4b02f` accepted the program and final
setup correction.

The remaining body is historical planning context. It does not grant current
authority or describe the current queue.

## Objective

Independently reproduce the useful structural leads found in the external
`hijsje/ogrebattle64` project from our own verified US Rev 0 ROM, corrected
decomp atlas, and runtime evidence. The target outputs are:

1. a verified overlay-descriptor and overlay-group manifest;
2. an independently proven KMC compiler configuration;
3. a corrected, machine-readable segment map suitable for a conventional
   linker/Splat build; and
4. an assembly-first exact rebuild through that new build path, followed by
   the first matching-C vertical slice.

The external project is a hypothesis source, not an implementation donor. No
external C, scripts, configuration, or symbol files may be copied without a
compatible license or explicit permission from its author.

## Why This Work Is Needed

The current repository is a byte-exact source atlas, not a conventional
matching-C decompilation:

- the full configured `0x00001000..0x0063676C` region is represented by 100
  tracked composite chunks and 6,181 tracked `.s`/data parts;
- the executable extent is pinned at `0x00001000..0x002B89B8`;
- the existing build verifies complete ROM identity;
- tracked assembly is primarily `.word` ownership with decode comments;
- no game C has been adopted into `src/`; and
- there is no authoritative ELF/linker/map/relocation loop for progressive C
  replacement.

The external project demonstrates that Splat, KMC GCC 2.7.2, GNU MIPS
binutils, asm-differ, ultralib, and libmus can be arranged around this ROM. We
must reproduce the underlying facts independently and preserve our stronger
no-gap and evidence gates.

## Governing Boundaries

### Parent research workspace

The parent `OgreBattlel64` repository owns experiments, ROM parsing, runtime
traces, Project64 work, generated evidence, and comparison artifacts.

### `OB64 Decomp/`

This repository owns accepted configuration, reproducible source, build and
verification tools, linker inputs, curated decomp documentation, and matching
C/assembly.

### `editor/`

No Editor changes are part of this plan until a vertical slice has passed
matching, runtime-causality, round-trip, and packaging gates.

## External Lead Provenance

The following local repositories preserve the comparison inputs without making
them build dependencies:

- ignored Codeberg clone:
  `../ModderResources/External Decomp Research/ogrebattle64-codeberg`;
- ignored decomp.me index repository:
  `../ModderResources/External Decomp Research/berendbutje-decompme`.

The Codeberg clone includes its four pinned submodules and was clean at intake.
The scratch repository is an uncommitted local Git repository containing only
public URLs, rendered profile metadata, hashes, and validation tooling. It does
not contain scratch source, binary objects, or ROM bytes.

Record the comparison inputs as follows:

- upstream project: `https://codeberg.org/hijsje/ogrebattle64`;
- examined upstream commit:
  `d7ad1d18edaa277d1dd4eb1f0b8de1c3d978439c`;
- predecessor project: `https://git.noest.dev/gijs/ogrebattle64`;
- examined predecessor commit:
  `dd2624f0d935d288e80752863f9f0b137ce28bc7`;
- scratch profile: `https://decomp.me/u/berendbutje`;
- scratch capture: 110 unique URLs captured 2026-07-26, with canonical JSON
  SHA-256
  `F2554AD0E3BC9BF615CDDD07B5333A72FD9BCD00F38BF5EF5FCA268D818C25BA`;
- downloaded ZIP SHA-256:
  `3ABEA0E85550C4BDD0141BC6C8B6537EB6B81256B7BD5B1AEAA08B8D16C79AF5`;
- target ROM SHA-1:
  `9CD0CFB50B883EDB068E0C30D213193B9CF89895`;
- canonical local z64 SHA-256:
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The author has identified the Noest repository as his older original and the
Codeberg repository as its continued, history-collapsed successor. The two
public histories do not share Git ancestry, so the Noest tree remains a recovery
and comparison backlog, not a second current upstream. The ZIP is not a build
dependency: it has no Git history, contains empty submodule directories, and
includes no license file.

Neither examined public repository has a root license file. Authorship and
public visibility are not permission to copy. External C, configuration,
scripts, and scratch source remain quarantined until a compatible license or
explicit written permission identifies what may be reused.

## Intake Findings and Evidence State

These findings define the starting queue. They are not accepted decomp facts
until the relevant local gate passes.

### Current Codeberg project

- `symbol_addrs.txt` contains 731 assignments: 502 with ROM annotations, 249
  function symbols, 248 ROM-addressed functions, and 229 RAM-only globals.
- Of its ROM functions, 224 start exactly on current local manifest part
  boundaries; 201 of those local parts still use generic names.
- 152 of the external ROM functions are represented in the local v2 function
  database: 125 are locally unnamed and 27 already have local names.
- 24 external function starts fall inside larger local assembly parts and form
  a concrete boundary-disagreement queue.
- `SCENES.md` is only a small flow sketch (`sentinel -> 24 -> 9` and
  `start -> 9 -> 10 -> 4`). The symbol file also supplies candidate scene
  getters, initialization, tick, and render symbols for scene IDs 0 through 24.
- Five high-value name conflicts must remain aliases until adjudicated:
  `0x4AC8` (`boot_resource_probe_init` / `__check_save_slot_state`),
  `0x4C5C` (`boot_resource_probe_dispatch_prepare` / `buSave`),
  `0x51A0` (resource/signature initialization / `__init_sram`),
  `0x368C` (resource-buffer reset / `__gfx_list_reset`), and
  `0x3798` (resource-state reset / `__gfx_reset`).

### Older Noest project

The examined predecessor has 153 C files, 111 headers, approximately 10,962 C
lines, and 1,725 `INCLUDE_ASM` sites. Its function-definition audit found 134
implemented names not present as definitions in the examined Codeberg tree:
57 SDK/NuSystem/audio/ROM helpers, 61 generic address-named functions, and 16
semantic/helper names. These are recovery leads only.

The older tree includes useful candidate implementations or names such as
`obEquipmentGetFirstSpellbook`, `obGetCurrentTimeF`, `obSetCurrentTime`,
`obSetViMode`, and overlay setup. Its `CharacterSlot` (`0x38`), `ClassData`
(`0x48`), `AbilityData` (`0x10`), and `EquipmentData` (`0x20`) layouts are useful
cross-checks, but most current Codeberg types are more developed. Prefer the
current tree and consult Noest only when a fact is absent or history is needed.

### decomp.me scratch corpus

The local snapshot contains 110 unique URLs and 95 unique displayed function
names. At capture time it contained:

- 60 rows at 100% and 66 at or above 90%;
- 32 rows at 0% and 18 partial rows;
- 58 unique names with a 100% version and 61 with a version at or above 90%;
- 109 GCC 2.7.2 (KMC) rows; and
- one explicitly non-OB64 *Star Wars: Shadows of the Empire* row, which must be
  excluded from OB64 inference.

Thirty-six of the 58 unique 100%-matched names already appear as C definitions
in the current Codeberg tree. Seven exact names were still `INCLUDE_ASM` there
and are the strongest compiler/boundary probes after permission and byte
identity are established:

| Scratch | Function | Candidate z64 ROM offset |
|---|---|---:|
| `uDQgr` | `func_8017BD48_51C48` | `0x00051C48` |
| `D5iSP` | `func_80072710_2B10` | `0x00002B10` |
| `Ri4lW` | `obSetViMode` | `0x00002B38` |
| `GVmix` | `func_800728BC_2CBC` | `0x00002CBC` |
| `DJ9zh` | `HIsAllocatedPointer` | `0x000018D4` |
| `DfT9R` | `func_80073F58_4358` | `0x00004358` |
| `r9nlI` | `func_80073ED8_42D8` | `0x000042D8` |

Exact displayed names are not enough: renamed functions and changed boundaries
can conceal overlap, and a profile match percentage does not prove the target
ROM revision or linked placement.

### Facts already reproducible from local bytes

- Direct big-endian decoding at `0x000387C0` reproduces 19 records of `0x28`
  bytes ending at `0x00038AB8`; the basic ROM/VRAM/section range invariants pass.
  The current broad local part beginning at `0x000387C0` owns the bytes but does
  not expose the descriptor subdivision.
- Local disassembly independently supports a function start at `0x00002B10`:
  the preceding function returns at `0x00002B08` with its delay slot at
  `0x00002B0C`.
- Local disassembly independently supports a function start at `0x00004358`:
  the preceding function returns at `0x00004350` with its delay slot at
  `0x00004354`.

The two boundary observations should be the first review items; they are not to
be batch-applied with the other 22 disagreements.

## Recommended Execution Order

The highest-value route is:

1. **Freeze and license the inputs.** Keep the clean Codeberg clone and hashed
   scratch URL index local; request explicit reuse terms before copying source.
2. **Build a parent-side candidate correlation layer.** Join external symbols,
   scratch slugs, Noest-only names, local ROM parts, v2 function records,
   overlays, and evidence grades without changing canonical names. Emit alias
   conflicts and boundary disagreements separately.
3. **Review the two locally obvious boundary splits.** Adjudicate `0x2B10` and
   `0x4358`, regenerate their owning parts deterministically, and rerun the exact
   build. This produces immediate atlas value without trusting external code.
4. **Generate overlay and segment facts from the ROM.** Formalize the already
   reproduced descriptor table, then reconcile all remaining boundaries and
   generate Splat/linker inputs from accepted local ownership.
5. **Reproduce the KMC environment and assembly-only link.** Pin every tool and
   first prove a whole-ROM exact assembly build plus named asm-differ targets.
6. **Use the seven priority scratches as probes, not donations.** With permission,
   compare their context and source against local bytes; without permission,
   write independent C from local disassembly and use only the public match
   metadata to prioritize work.
7. **Land one mechanical C match, then one editor-value slice.** Prefer a small
   early-boot leaf such as the `0x2B10` candidate for the compiler/link proof,
   then pursue the shop restriction slice with causal runtime and packaging
   evidence.
8. **Promote research aids immediately after review.** Feed accepted boundaries,
   ROM/RAM mappings, aliases, callers, and field accesses into the parent unified
   resolver and structure/field-access atlas. This benefits byte/function
   research assignments before broad C conversion is complete.

This order keeps decomp standards intact while giving the parent research and
modding workbench useful navigation data at each accepted milestone.

## Non-Goals

- Do not replace the current source manifest with upstream splits.
- Do not import upstream matching C.
- Do not treat upstream names or boundaries as verified evidence.
- Do not commit a baserom, rebuilt ROM, compiler binaries, extracted assets, or
  generated bulk assembly.
- Do not declare KMC proven from configuration resemblance or one trivial
  match.
- Do not begin broad whole-program C conversion before the new assembly-only
  path reproduces the ROM exactly.
- Do not modify the Editor during the reproduction phases.

## Success Criteria

The plan is complete only when all of the following are true:

1. All 19 overlay descriptors and all 11 overlay groups regenerate from local
   ROM bytes and pass structural validation.
2. Representative runtime transitions confirm descriptor-derived ROM source,
   RAM destination, length, BSS, and cache/load behavior.
3. Every accepted segment boundary is derived from local evidence and the
   segment map has no gaps or overlaps.
4. All external/local function-boundary disagreements have an explicit
   disposition.
5. KMC compiler identity and flags are supported by exact matches across at
   least three structurally different original game functions.
6. A Splat/linker/ELF assembly-only path rebuilds the complete ROM exactly.
7. asm-differ can compare named local functions against the verified baserom.
8. At least one original game function is replaced by byte-matching C.
9. One editor-relevant vertical slice has matching code, causal runtime proof,
   a stable schema, and a tested patch-package path.
10. The existing `node tools/verify_setup.js` gate remains green throughout.

## Phase 0 — Baseline and Lead Register

### Work

1. Record starting HEAD and `git status` for the parent and decomp repositories.
2. Run the current exact-rebuild gate:

   ```powershell
   node tools/verify_setup.js
   ```

3. Create a compact parent-side lead register with one row per external claim:

   - claim;
   - external source and commit;
   - local evidence required;
   - reproduction method;
   - current status;
   - accepted local artifact, when complete.

4. Seed the register with:

   - overlay descriptors at `0x000387C0..0x00038AB8`;
   - terminated overlay-ID groups at `0x00038AB8..0x00038AFC`;
   - group pointers at `0x00038AFC..0x00038B28`;
   - 19 descriptor records of `0x28` bytes;
   - 11 group pointers plus a null terminator;
   - KMC GCC 2.7.2/binutils 2.6 and candidate flags;
   - upstream segment starts; and
   - the 24 upstream function starts that fall inside larger local parts.

5. Register the immutable intake artifacts and their evidence class:

   - Codeberg clone commit and submodule commits;
   - Noest predecessor commit and rewritten-history relationship;
   - decomp.me capture hash, all 110 URLs, and the non-OB64 exclusion;
   - license/permission status for each external surface; and
   - the seven priority scratch correlations.

6. Define generated parent artifacts before implementation:

   - `external-symbol-candidates.json`;
   - `decompme-scratch-index.json` or a deterministic import of the local
     capture;
   - `boundary-disagreements.json`;
   - `external-alias-conflicts.json`; and
   - `external-license-register.json`.

### Deliverables

- Parent-side lead register with explicit provenance.
- Validated external-input registry and license register.
- Baseline verification report and hashes.

### Gate

`verify_setup.js` passes and no upstream source has entered a tracked project
path.

## Phase 1 — Overlay Descriptor and Group Reproduction

### ROM parser

Write a parent-workspace parser that reads canonical z64 bytes and decodes each
`0x28`-byte descriptor as ten big-endian `u32` fields:

1. VRAM start;
2. VRAM end;
3. ROM start;
4. ROM end;
5. BSS start;
6. BSS end;
7. text start;
8. text end;
9. data start; and
10. data end.

Parse the terminated overlay-ID groups and the pointer table independently.
The parser must not contain a copied table of expected values.

### Static validation

For every record, check:

- every start is less than or equal to its end;
- ROM ranges lie inside the verified ROM/executable ownership model;
- text and data ranges fit the overlay's loaded VRAM span;
- BSS occupies RAM without requiring stored ROM bytes;
- descriptor indexes referenced by groups are valid;
- group pointers resolve inside the group-table range;
- the pointer table contains eleven entries and a null terminator;
- ranges and sizes use consistent alignment; and
- illegal overlaps are rejected.

### Runtime validation

Use natural-load or cold-route Project64 traces for representative transitions:

- boot/permanent;
- world map;
- mission or cutscene to scenario;
- scenario card to combat; and
- a cutscene/late overlay when a suitable state exists.

Capture and reconcile:

- PI-DMA/cart source;
- RDRAM destination;
- transfer length;
- descriptor/group selection;
- BSS clearing;
- I-cache/D-cache preparation; and
- final resident byte identity.

States not represented in the current corpus remain explicitly unverified.

### Promotion

After the parent research gate passes, add to this repository:

- `config/overlays/us_rev0.json` as a generated/verified manifest;
- a deterministic overlay-manifest generator or importer;
- an overlay-manifest verifier wired into `verify_setup.js`;
- a curated overlay-format document; and
- compact entries in `docs/DECOMP_LOG.md` and `docs/PLATFORM.md`.

Parent-side durable results belong in `docs/overlay-system.md` and
`docs/OB64Decomp-log.md`.

### Gate

- 19/19 descriptors reproduce from ROM bytes.
- 11/11 groups plus the null terminator reproduce.
- Structural validation passes.
- Sampled runtime loads agree with the derived records.
- No upstream code or serialized configuration was copied.

## Phase 2 — Segment-Boundary Reconciliation

### Candidate sources

Build a candidate boundary ledger from:

1. the corrected local decomp manifest;
2. overlay text/data/BSS boundaries reproduced in Phase 1;
3. runtime DMA ranges and residency evidence;
4. direct branch, jump, and pointer targets;
5. string, rodata, zero-fill, and alignment transitions;
6. archive and decoded-resource boundaries; and
7. upstream boundaries, recorded only as audit leads.

### Boundary checks

For each candidate boundary, evaluate:

- function prologue, return, and delay-slot integrity;
- direct control-flow edges crossing the boundary;
- jump-table membership;
- pointer and rodata references;
- code/data density and illegal-opcode evidence;
- overlay ROM/VRAM containment;
- section order and alignment;
- BSS ownership;
- current part hashes and exact byte ownership; and
- whether the boundary changes a previously accepted local dossier.

### Disagreement queue

Audit every external function start that falls inside a larger local part. Each
must end with one disposition:

- confirmed secondary function and local split;
- confirmed internal label or jump-table target, no function split;
- confirmed data label;
- rejected external boundary; or
- unresolved, with the competing evidence preserved.

Review `0x2B10` and `0x4358` first because the local return/delay-slot sequences
already provide independent static support. Apply each split separately, retain
the original owning-byte hashes, regenerate through the local manifest tooling,
and prove exact-ROM identity before proceeding to the next candidate.

### Generated configuration

Generate, rather than hand-duplicate, a Splat-compatible segment map from the
accepted boundary ledger and current no-gap ownership manifest. The generated
map must retain conservative names where semantics are not verified.

### Deliverables

- Machine-readable boundary ledger.
- Boundary-disagreement report.
- Manifest-to-Splat configuration generator.
- Generated US Rev 0 Splat configuration.
- Updated dossiers for accepted boundary changes.

### Gate

- No gaps or overlaps.
- Every direct control-flow edge is accounted for.
- Every current source-owned byte remains represented.
- `check_boundaries.js`, `check_splits.js`, and `check_manifest.js` pass.
- The full ROM still matches SHA-256
  `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

## Phase 3 — KMC Compiler and Flag Reproduction

### Toolchain acquisition

Install candidate compiler tools only in an ignored local toolchain directory.
Record:

- original source URL;
- archive filename;
- SHA-256;
- extracted executable hashes;
- host/runtime requirements; and
- redistribution/license status.

Candidate tools are KMC GCC 2.7.2 and binutils 2.6. Current GNU binutils remain
the independent assembly/objdump reference.

The upstream project's compiler archives or binaries must not be copied into
this repository. Obtain tools from an independently identified source and keep
them ignored.

### Compiler fingerprint matrix

Test candidate combinations including:

- big-endian output;
- MIPS III;
- O32 ABI with 32-bit GPR/FPR mode;
- `-G 0`;
- `-O2` and any per-file optimization exceptions;
- non-PIC/no-abicalls behavior;
- unsigned `char` behavior;
- builtin suppression;
- section ordering;
- four-byte rodata alignment; and
- assembler scheduling and alignment behavior.

### Probe corpus

Select original game functions covering at least:

- a small leaf/accessor;
- a framed function containing calls;
- branch-heavy control flow;
- floating-point operations;
- rodata/global references; and
- a switch or jump table.

Use independently written C drafts derived from local disassembly and evidence.
Compare object sections and final linked bytes, not only human-readable
assembly.

Use the locally captured seven-scratch priority set to order candidate probes.
The `0x2B10` leaf is the preferred first original-game target because it also
tests the newly reviewed boundary. Add a framed/calling function and a
rodata/global-dependent function before claiming the KMC configuration proven.
Do not obtain scratch source until its reuse status is explicit; URL and match
metadata alone may be used for prioritization.

### Deliverables

- `config/toolchains/kmc-gcc-2.7.2.json` with hashes and proven flags.
- Ignored local compiler installation.
- Compiler-probe harness and deterministic reports.
- `docs/KMC_TOOLCHAIN.md` with confirmed, rejected, and unresolved settings.

### Gate

At least three structurally different original game functions match exactly,
including one with rodata or another linked data dependency. Configuration
similarity alone is not sufficient.

## Phase 4 — Conventional Assembly/Linker Build Path

### Build architecture

Add a generated build path without replacing the current atlas:

```text
corrected source manifest
        -> generated Splat configuration
        -> extracted/owned assembly and data
        -> GNU/KMC object build
        -> ELF and linker map
        -> ROM rebuild
        -> existing exact verification gate
```

### Requirements

- Pin Splat and asm-differ versions and licenses explicitly.
- Keep generated extraction under ignored `build/` paths.
- Treat the existing manifest as boundary and byte-ownership authority.
- Preserve current `.word` owners until a replacement matches exactly.
- Emit an ELF and map with overlay-aware ROM and RAM symbols.
- Support assembly fallbacks while C conversion proceeds.
- Reject a linker layout that introduces implicit padding or section drift.
- Feed the new output through the existing full-ROM rebuild and compare gate.

### Environment decision

The candidate KMC toolchain and mature reference Makefiles are Linux-oriented.
Before implementation, choose and document one host path:

1. WSL with a pinned distribution and package list;
2. a pinned container image; or
3. a verified native-Windows compiler wrapper.

The environment must be reproducible; a one-machine undocumented setup is not
an acceptable final toolchain.

### Deliverables

- Pinned Splat dependency.
- Generated linker script and symbol inputs.
- Reproducible assembly-only build command.
- ELF, map, and compare reports under ignored build paths.
- asm-differ configuration for named functions and ROM addresses.

### Gate

The new assembly/linker path rebuilds the full ROM exactly before any tracked C
replacement is accepted. The old and new verification paths must agree.

## Phase 5 — First Matching-C Vertical Slice

### Mechanical proof target

Choose one small original game function to prove compilation, linking,
symbolization, and asm-differ operation. A precompiled SDK/library function may
be used as a separate library-version check, but it does not satisfy the
original-game C gate.

Preferred first target: the independently bounded function at z64 ROM
`0x00002B10`. If its object cannot match across the candidate KMC matrix, retain
the mismatch report and select another small original-game function rather than
changing an accepted boundary to fit external source.

### Editor-value target

Immediately follow with one bounded editor-relevant subsystem. Preferred first
candidate:

- the shop expendable-item restriction/allow-list gate.

Alternatives require an explicit plan amendment and should remain small enough
to prove the full path.

### Required evidence

- Matching original C for the selected function set.
- Overlay-aware callers, callees, globals, and data dependencies.
- Runtime entry/access proof in the correct state.
- Controlled edit proving the relevant branch, formula, or field is causal.
- A stable editor-facing schema with validation limits.
- Cold-boot or natural-load proof of the modified build.
- A reproducible patch-package output that does not distribute a ROM.

### Gate

One original game function matches exactly, and one bounded behavioral
vertical slice produces a verified editor/package capability without weakening
the byte-exact baseline.

## Phase 6 — Independent Review and Canonical Promotion

A fresh reviewer must independently reproduce:

- overlay parsing and all record counts;
- runtime DMA/load agreement;
- segment-boundary conservation;
- every boundary disagreement disposition;
- compiler hashes, flags, and exact-match claims;
- assembly-only exact rebuild;
- first matching-C result;
- controlled behavioral edit; and
- patch-package verification.

The review must also check licenses and prove that no unlicensed upstream source
was incorporated.

The external-correlation artifacts require a separate acceptance review from
the existing MIPS atlas review. Do not retroactively add network-derived names
or boundaries to a review prompt whose evidence scope was local and read-only.

After acceptance:

- promote durable facts to the relevant decomp and parent domain docs;
- update `docs/NEXT_STEPS.md` and parent `docs/pending-tasks.md` only where the
  next starting point actually changes;
- append the parent `docs/OB64Decomp-log.md` entry;
- write the required after-action report with claims mapped to artifacts; and
- leave repositories uncommitted unless Joe separately authorizes commits.

## Verification Commands

The final implementation plan must preserve at least these gates:

```powershell
node tools/check_manifest.js
node tools/assemble_original_mips.js --strict-tracked
node tools/verify_setup.js
```

Phase-specific overlay, segment, KMC, Splat, ELF, and matching-C commands must
be added as they become real tools. Generated reports must include input ROM
identity, tool versions, command line, hashes, and first-difference details.

## Stop Conditions

Stop and record a rigorous blocker if:

- the candidate compiler cannot be legally or reproducibly obtained;
- no KMC flag set matches multiple original game functions;
- a proposed boundary breaks no-gap ownership or introduces unresolved control
  flow;
- runtime evidence contradicts a decoded overlay descriptor;
- the new linker path cannot reproduce the assembly-only ROM exactly;
- the requested runtime state is unavailable;
- external licensing is required to continue; or
- proceeding would require modifying the Editor before research promotion.

An unresolved lead remains a lead. It must not be converted into accepted
configuration merely to keep the implementation moving.
