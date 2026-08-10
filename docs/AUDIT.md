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
- assembler endianness/ISA/delay-slot behavior and dialect relocation smoke tests pass;
- compiler flags used for matching remain pinned;
- the compiler-assembly dialect manifest and adapter-module hashes match their authenticated pins;
- compiler and assembler identities, versions, and flags match the dialect manifest;
- the dialect schema and ordered rule identities match the versioned contract; and
- stale build, verification, current-state, proof, or audit schemas reject.

### Baseline build

- the accepted assembly/data baseline links;
- generated layout/map ownership agrees with the structural model; and
- the complete baseline ROM is byte-identical to retail.

### Current build

- active C/hybrid replacements do not leave their original target implementations linked;
- ownership/placement checks pass; and
- every target is classified before compilation and `UNKNOWN` rejects;
- strict verification independently recreates each adapted file, section adjustment, and proof;
- every hybrid raw and adapted file is byte-identical with zero total and per-rule transformations;
- proof counts and total and per-rule transformation totals are derived from unique verified target
  proofs; and
- the complete current matching ROM is byte-identical to retail.

For an authenticated assembler-dialect rule, retain GNU assembler as the production assembler and
use a historical assembler only as a behavioral oracle. Compare emitted instruction words and
logical relocations by offset, type, and resolved symbol; do not require raw ELF-container identity
when authenticated metadata and section-layout differences are documented. A pinned production
optimization flag is not a historical eligibility requirement unless the oracle evidence shows it.

The audit must also protect the `func_0002CD70` OR-encoding regression. The target must remain
`HYBRID_C`, retain its accepted target hash, and contain `0x00801025` at offsets `+0x004` and
`+0x028`.

Phase 2 reports zero transformed targets and zero transformations. These values describe that
inert result; they are not permanent audit invariants for later eligible pure-C migrations.

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
