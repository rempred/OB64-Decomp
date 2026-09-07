# OB64 Decomp — Structural Audit

## Purpose

The structural audit protects the foundations on which ordinary matching work depends.

It is intentionally heavier than the normal matching-C verifier and should not run as a mandatory
promotion ceremony for every small function.

Canonical interface:

```text
node tools/audit.js
```

The command retains compatibility arguments required by the structural gate,
including the accepted external Phase 5A evidence root. Local configuration may
supply that root. These requirements remain confined to the audit path rather
than the normal per-function loop.

---

## Run the Audit When

Run the structural audit when changing or accepting changes to:

- baserom/profile identity;
- ROM byte-order normalization rules;
- Splat segmentation or owner rows;
- function/data boundaries;
- executable extent;
- overlay descriptors or ROM↔VRAM mapping;
- linker script/layout generation;
- accepted structural symbol ownership;
- source-ownership/coverage rules;
- compiler identity or compile flags;
- assembler/linker/binutils identity or flags;
- build logic that decides which object owns retail bytes; or
- the verification implementation itself.

Also run it periodically before a release/milestone if useful.

---

## Do Not Require the Audit For

The audit is not required merely because:

- one accepted assembly owner was replaced by exact C;
- a pure-C function was cleaned up without changing its boundary;
- a comment changed;
- a provisional semantic name changed with appropriate evidence; or
- several independently verified pure-C targets were integrated and the normal verifier remains
  exact.

Normal matching uses `node tools/verify.js`.

---

## Required Structural Checks

The audit should preserve the valuable existing checks and consolidate them under one command.

At minimum verify:

### ROM identity

- supported US Rev 0 identity;
- expected size/header/game ID/revision;
- canonical z64 normalization; and
- expected retail hash/identity.

### Coverage and source ownership

- every ROM byte remains represented by an accepted source strategy;
- independent archive/LHA scanning remains consistent with the accepted catalog;
- known overlaps/ambiguous ranges remain visible rather than silently reassigned; and
- no-gap assembly/data reconstruction remains valid.

### Executable/data classification

- accepted executable extent remains consistent with structural evidence;
- no unexpected code edge is introduced into a region classified as data; and
- code/data ownership totals remain internally consistent.

### Overlay model

- accepted overlay descriptors/groups/pointers remain valid;
- runtime addresses use overlay-aware mapping rather than the early-boot linear shortcut; and
- linker reservations/placement remain consistent.

### Toolchain

- required tool binaries/versions/hashes match the tracked contract;
- the GNU 2.6 source commit, deterministic build recipe, host package inventory, patches, complete
  executable set, MSYS2 runner, and configured pinned PowerShell executable/automation assembly
  match their authenticated pins; normal verification must not fall back to an ambient updated
  PowerShell installation;
- assembler endianness/ISA/alignment/delay-slot, historical `move`, COP1, call/relocation, custom
  section, linker LMA/`PT_LOAD`, and binary-extraction smoke tests pass;
- compiler flags used for matching remain pinned;
- untouched KMC compiler output differs from assembler input only by the accepted target-section
  assignment and any target-specific reviewed read-only auxiliary-section assignment;
- an explicit multi-function compiler contract gaplessly covers one accepted text owner, retains
  exactly one global owner symbol, and keeps every reviewed secondary entry local;
- a partially replaced auxiliary data row retains exact remainder bytes, placement, and assembly
  ownership through a unique read-only input section rather than `.data` or `.bss`;
- C switch-table fragments and explicit retained original-ASM intervals completely cover their accepted auxiliary row in address order;
- auxiliary coverage removes the original row contribution once, retains its authenticated fallback, and leaves no gap, overlap, or duplicate tail;
- only the first auxiliary fragment may retain an exterior prefix, and only the final fragment may retain the exterior tail;
- retained interiors contain literal data from a whole original row with no nonempty REL/RELA sections targeting it, even outside retained intervals;
- generated retained interval objects are read-only, alignment-one `PROGBITS`, with no actual relocations or named non-section symbols;
- map order, full object paths, addresses, sizes, sole ownership, and ELF row bytes agree without changing the load-segment model;
- producer, manifest, layout, source-object proof, CURRENT/cache, recorded-build, and status evidence agree on the complete retained-interior contract;
- retained ASM remains distinct from compiler padding and matching-C accounting, as detailed in [AUXILIARY_INTERIOR_ASSEMBLY.md](AUXILIARY_INTERIOR_ASSEMBLY.md);
- active configuration/build code contains no retired compiler-assembly rewrite stage or modern
  Binutils dependency;
- the pinned preprocessing executable closure, accepted include roots, exact compiler-input bytes,
  and complete repository-local regular-file dependency identities are authenticated, recorded,
  and independently reproduced; external or symlinked dependencies fail closed;
- the project-owned ELF report and program-header checks retain exact section VMA/LMA, flags,
  sizes, and one-section load mapping; and
- stale build, verification, current-state, proof, or audit schemas reject.

### Baseline build

- the accepted assembly/data baseline links;
- generated layout/map ownership agrees with the structural model; and
- the complete baseline ROM is byte-identical to retail.

### Current build

- active C/hybrid replacements do not leave their original target implementations linked;
- ownership/placement checks pass; and
- every target is classified before compilation and `UNKNOWN` rejects;
- strict verification independently recreates each section adjustment and source-to-object proof;
- the reviewed matching-C linkage file is an authenticated build input, its shared symbols remain
  consistent with retained legacy evidence, and no strict build accepts a missing target contract;
- every load-relevant target-section relocation is compared by offset, type, and normalized
  symbol/value semantics;
- discarded ancillary differences, including retired procedure-descriptor relocations, remain
  visible in reports without entering the active relocation contract;
- every active replacement retains exact target bytes and sole C-object ownership, while source
  classes remain honest; and
- the complete current matching ROM is byte-identical to retail.

The GNU 2.6 source-object proof distinguishes load-relevant relocations from discarded ancillary
metadata. Exact linked bytes do not excuse a missing or altered load-relevant relocation. Raw ELF
container identity is not required across independently reproduced builds when deterministic
production executables, target-section bytes, normalized relocations, and structural ELF reports
are exact.

The audit must also protect the `func_0002CD70` OR-encoding regression. The target must remain
`HYBRID_C`, retain its accepted target hash, and contain `0x00801025` at offsets `+0x004` and
`+0x028`.

The audit pins the accepted Squad migration at canonical `24d0818`: p3063, p3064, and p3066
are active `PURE_C` owners with their accepted target hashes and sole C contributions.
Missing or duplicate owners, a changed source class, changed bytes, or retained target assembly reject.
The report records all three source classes and target hashes, and reports `p3066Active: true`.
Run `node tests/audit_squad_migration.js` for the focused positive and invalid-state controls.
The complete verifier still establishes placement, relocations, fresh source proof, and exact ROM bytes.

---

## Review Rule

Structural changes require independent review because a wrong boundary/overlay/linker model can
mislead many later functions even when local byte comparisons look plausible.

Ordinary matching waves require no independent review after their canonical verifier gates pass.
Use focused linked-diff and source-policy checks per target, then one final verifier after the complete wave is ready.
Recording actual per-target relocations under existing linker rules remains ordinary matching work without a separate reviewer.
Verify changed combined integration inputs; do not repeat the verifier solely for review or an unchanged commit or handoff.
Tooling acceptance does not activate a production owner or accept an unfinished matching wave.
See [WORKFLOW.md](WORKFLOW.md); structural, tooling/verification, and semantic changes retain their applicable review requirements.

Independent review should focus on the structural delta and its smallest useful falsifiers.

It does **not** require a Highway/Lane/Checkpoint evidence package.

A good structural review is:

```text
what structural claim changed?
→ what direct evidence supports it?
→ what test would falsify it?
→ does the full baseline/current rebuild remain exact?
```

---

## Generated Evidence

Detailed audit output may be written under `build/audit/` as JSON/text and remain ignored.

Commit a durable report only when documenting a real structural decision whose reasoning will be
needed later.

Do not commit hashes of every intermediate compiler/build artifact merely because the audit
generated them.

Git plus the reproducible audit is the evidence chain.

---

## Retained structural gate

The multi-check setup/coverage/overlay/source-ownership verifier remains behind
`tools/audit.js`. The normal `tools/verify.js` path is independently responsible
for current target ownership, placement, relocations, source class, target
bytes, and complete-ROM identity; it does not make the broader structural gate
part of every function match.

Do not remove or weaken retained structural checks merely to reduce the
displayed command count. A future replacement is itself structural work and
must prove equivalent coverage before the old gate is retired.

## Native text evidence

Audit schema 4 requires complete textContract, objectEvidence, and linkEvidence on every active target. Native fixtures exercise untouched compiler input, exact section and function censuses, native alignment, zero tail, sole object contribution, load mapping, and full-owner exactness. Malformed and stale evidence must fail independently of identical reports. The retained nonexact Combat candidate must remain a negative control. Tooling acceptance does not accept the unfinished Combat source wave.

## Compilation-group audit evidence

The group registry is an authenticated CURRENT/build input. A stale report without its identity rejects. Group text contracts use schema 2 and group object evidence uses schema 3; legacy representation schemas retain their existing meaning. CURRENT fingerprint version 7 and diff-cache schema 4 invalidate prior reuse inputs.

For each active group, audit the complete native, projected and stripped object evidence. Verify exact `.reginfo` shape and reference closure before removal, payload preservation during projection and absence after stripping. Verify complete compiler function and marker censuses, native tail provenance, unchanged projected bytes, original section-symbol anchors and relocation addends. Keep all accepted owner sections and one-section PT_LOAD mappings.

Require one linked producer object with complete ordered member records, individual fallback exclusion, public entries, source classes and full-owner hashes. Count functions and owner bytes once per member; report compilation producers separately. All current and baseline complete-ROM gates remain mandatory.

`node tests/compilation_groups.js` covers unrelated pure-C call/address and zero-tail groups, two link placements, source/cache artifact agreement and bounded malformed inputs. `node tests/compilation_groups_phase8.js` exercises the designated pose research group with art-native coexistence through an isolated full-ROM link and strict proof. Its source and artifacts remain ignored. It does not activate production targets. Existing native, multi-owner and multi-function tests retain their contracts.

The accepted design is `docs/Plans/compilation-groups-design.md` with `docs/Plans/compilation-groups-design-r2.md`. Implementation acceptance requires a completed changed-input structural audit and independent review. Ordinary matching waves gain no additional review gate.
