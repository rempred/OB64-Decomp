# OB64 Decomp — Structural Audit

## Purpose

The structural audit protects the foundations on which ordinary matching work depends.

It is intentionally heavier than the normal matching-C verifier and should not run as a mandatory
promotion ceremony for every small function.

Canonical interface:

```text
node tools/audit.js
```

During migration, the command may accept compatibility arguments required by the existing forensic
gate, such as an accepted external evidence root. Those requirements should remain confined to the
audit path rather than the normal per-function loop.

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
  adjustment;
- active configuration/build code contains no retired compiler-assembly rewrite stage or modern
  Binutils dependency;
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

The audit must also prove p3066 remains inactive unless a separate accepted matching task changes
its ownership.

---

## Review Rule

Structural changes require independent review because a wrong boundary/overlay/linker model can
mislead many later functions even when local byte comparisons look plausible.

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

## Legacy Gate

The existing multi-check setup/coverage/overlay/source-ownership verifier is valuable.

During simplification:

1. keep it intact;
2. place it behind `tools/audit.js`;
3. prove the new normal verifier against the existing Phase 8 proof separately;
4. only then remove duplicated checks from the normal path.

Do not weaken or delete structural checks merely to reduce the displayed command count.
