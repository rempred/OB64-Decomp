# OB64 Decomp — Canonical Workflow

## Goal

Produce a reproducible source tree for *Ogre Battle 64: Person of Lordly Caliber* US Rev 0.

For the matching baseline, source must rebuild the canonical normalized retail ROM byte-for-byte.

The workflow intentionally separates:

1. **matching evidence** — did the source produce the retail machine code?
2. **source evidence** — is the claimed C actually C rather than embedded assembly?
3. **structural evidence** — are boundaries, overlays, placement, and ownership correct?
4. **semantic evidence** — do we understand what the code means?

Do not make an ordinary matching-C contribution carry all four evidence burdens.

---

## Acceptance Principle

For an ordinary function to count as matching C:

```text
KNOWN REV 0 BASEROM
        +
PINNED MATCHING TOOLCHAIN
        +
PURE_C SOURCE
        +
ORIGINAL ASM TARGET EXCLUDED
        +
C OBJECT IS SOLE LINKED OWNER
        +
TARGET ADDRESS/SIZE CORRECT
        +
RELOCATION POLICY SATISFIED
        +
LINKED TARGET BYTES EXACT
        +
COMPLETE ROM EXACT
        =
MATCHING C ACCEPTED
```

This is machine-verifiable. A separate human or AI reviewer is not required to prove the
machine-code match.

A matching result does **not** prove a descriptive function name, field name, comment, or gameplay
explanation.

---

## Canonical Concepts

### Baseline

`BASELINE` means the accepted structural assembly/data build that reconstructs retail Rev 0.

It owns the accepted:

- ROM identity;
- section/segment model;
- overlay model;
- function/data owner model;
- linker layout; and
- toolchain contract.

Historical Phase 5A/5B/6/7 terminology may remain in implementation internals or archives during
migration, but normal contributors should not need it.

### Current

`CURRENT` means `BASELINE` with zero or more accepted assembly owners replaced by C sources.

The complete `CURRENT` matching build must still equal the retail ROM exactly.

---

## Evidence Classes

### Matching evidence

A target is exact when:

- the original assembly implementation for that target is not linked;
- the replacement object is the sole linked owner;
- the linked bytes equal the baserom target bytes; and
- the complete ROM equals the baserom.

The verifier should also check accepted address/size and normalized relocations.

### Source evidence

Source classification is defined in `docs/SOURCE_POLICY.md`.

An exact `.c` file can be `HYBRID_C`. Exact output alone does not make it decompiled C.

Only exact `PURE_C` targets contribute to matching-C progress.

### Compiler-assembly dialect evidence

The build classifies every active target before compilation. `UNKNOWN` and `ASM` classifications
reject before the compiler-assembly adapter can run.

Only authenticated `PURE_C` compiler output may enter the versioned dialect parser. Any `#APP` or
`#NO_APP` marker rejects pure output before statement parsing.

`HYBRID_C` compiler output is opaque passthrough. Raw and adapted bytes and SHA-256 values must
match, and the proof must record zero total and zero per-rule transformations.

The schema-2 contract has two target-blind rewrite rules:

- a complete numeric-register `move $N,$M` statement emits `addu $N,$M,$0`; and
- an unlabeled adjacent `la $4,symbol` plus direct `jal target`, where both operands match the
  strict C-linkage identifier grammar `[A-Za-z_][A-Za-z0-9_]*`, in the authenticated non-PIC,
  no-abicalls, `-G0`, MIPS3/gp32 configuration with reorder and macro expansion enabled and
  volatile mode disabled, may emit
  `lui $4,%hi(symbol)`, `jal target`, `addiu $4,$4,%lo(symbol)` under an explicit temporary
  `.set noreorder` boundary when the address symbol is undefined in the translation unit.

Current-location, section, dot-prefixed local-assembler, expression, addend, register, and `jalr`
forms are outside the latter rule. Valid excluded forms remain byte-identical; a register-valued
`la` address operand is rejected before adaptation or proof generation.

The second rule excludes other registers, local symbols, labels, intervening emitted statements or
mode boundaries, `jalr`, expressions/addends, unsupported relocation forms, and unverified modes.
A valid excluded sequence remains byte-identical. Malformed or ambiguous syntax, unsupported
statements, macros, conditionals, and semicolon statements reject. `-O2` remains the pinned
production compiler setting, but it is not an eligibility condition inferred from the historical
assembler behavior.

Each target retains four reviewable artifacts:

1. untouched compiler assembly in `<symbol>.compiler.s`;
2. adapted or passthrough assembly in `<symbol>.dialect.s`;
3. section-adjusted assembly in `<symbol>.s`; and
4. a deterministic `<symbol>.dialect-proof.json` record.

The assembler consumes only the section-adjusted file. Strict verification recreates the adapted
file, section adjustment, and proof before accepting linked bytes.

Build-wide reports derive transformed-target, total-transformation, and per-rule totals from unique
verified proofs. Phase 2 produced zero transformed targets and transformations; later pure-C
migrations may produce nonzero totals.

### Structural evidence

Function boundaries, overlay descriptors, linker placement, executable/data classification, and
toolchain/layout changes are structural.

Structural changes use `docs/AUDIT.md`.

### Semantic evidence

Names and behavioral explanations need evidence appropriate to the claim.

Static evidence may justify a cautious structural name. Runtime trace or controlled mutation is
needed when behavior cannot be established statically.

Semantic work is not a prerequisite for exact C output.

---

## Normal Matching-C Loop

### 1. Select an accepted target

Choose an existing accepted owner.

Prefer targets that remove a LordlyCaliber hook/limitation or unlock a high-value call graph.
Do not optimize the queue primarily for count of easy matching functions.

If the accepted boundary looks wrong, stop and create a structural task rather than silently
changing it during matching.

### 2. Write the C reconstruction

Create or adjust the target under `src/`.

The original assembly remains the comparison/fallback owner.

Use disassembly, call graphs, known structs, constants, static data, and existing research as
inputs. Weird-but-valid C is allowed when needed to reproduce historical compiler output.

Do not paste assembly into C to obtain a match. See `docs/SOURCE_POLICY.md`.

### 3. Iterate with the diff tool

Canonical interface:

```text
node tools/diff.js <symbol>
```

The diff command is a development aid. It should:

- resolve the target from the accepted model;
- compile the current source with the pinned compiler;
- compare the final linked target bytes directly with the baserom;
- report the asm-differ score and raw-byte result separately; and
- provide actionable asm-differ output.

`EXACT` requires both a zero nonempty asm-differ score and equal final linked bytes. A zero score
with unequal bytes reports `RAW BYTES DIFFER`. Missing, duplicate, malformed, or wrong-sized linked
sections fail with `ERROR`.

Intermediate diff output is generated evidence and is not committed.

### 4. Verify the target

Canonical interface:

```text
node tools/verify.js --target <symbol> --require-pure
```

For the requested symbol, the verifier must:

1. verify baserom identity;
2. verify matching compiler/toolchain identity;
3. resolve the accepted structural owner uniquely;
4. classify the translation unit using `docs/SOURCE_POLICY.md`;
5. compile the source;
6. remove/exclude the corresponding original assembly target from the linked build;
7. prove the C object is the sole linker-map owner of the target section;
8. verify accepted address and size;
9. derive and compare normalized relocation information according to policy;
10. compare final linked target bytes directly with the baserom;
11. build the complete current ROM; and
12. compare the complete current ROM byte-for-byte with the baserom.

`--require-pure` must fail if the source class is not `PURE_C`, even when output is exact.

Expected summary:

```text
OB64 Decomp Verification

Baserom identity ........ PASS
Toolchain ................ PASS
Structural owner ......... PASS
Source policy ............ PURE_C
C linker ownership ....... PASS
Target placement ......... PASS
Relocations .............. PASS
Target bytes ............. EXACT
Full ROM ................. EXACT

RESULT: MATCHING C
```

An exact hybrid should instead report:

```text
Source policy ............ HYBRID_C
Target bytes ............. EXACT
Full ROM ................. EXACT

RESULT: MATCHING HYBRID
```

and `--require-pure` must return failure.

A `HYBRID_C` allowance is permission to keep an intermediate or fallback, not automatic permission
to finish the target and move on. Treat an exact hybrid as final only when either:

- evidence indicates that the function most likely requires assembly inherently; or
- a documented pure-C attempt has reached a concrete blocker that cannot be solved with the
  current tools and information.

Large size, difficult register allocation or scheduling, and exact hybrid output are not sufficient
on their own. If neither condition applies, keep the target active and continue the pure-C work.
When an exception does apply, record the evidence or blocker and continue to label the result
`MATCHING HYBRID`, never matching C.

### 5. Verify integrated current state

Before merging/integrating a set of changes:

```text
node tools/verify.js
```

This verifies all active C/hybrid replacements and the complete ROM.

Legacy hybrid targets may allow the overall exact baseline to pass, but status must list them
separately from pure matching C.

### 6. Commit

Commit the source and the smallest configuration change necessary to activate it.

Git records source history. Do not create separate ordinary-function promotion manifests,
checkpoint receipts, worker lifecycle receipts, frozen accepted trees, or independent matching
review packages.

---

## Target Configuration

The long-term target configuration should contain only facts that cannot be derived safely from the
accepted structural model.

Preferred shape:

```json
{
  "symbol": "func_0000B33C",
  "source": "src/boot/boot_resource_pool_acquire_release.c"
}
```

Derive where possible:

- ROM start/end;
- VRAM;
- target size;
- section name;
- owner/chunk/row identity;
- overlay descriptor;
- original assembly path;
- expected retail bytes;
- source and original-assembly hashes;
- expected text hash; and
- normalized relocation records.

If a symbol address or link alias is genuinely needed, prefer a shared canonical symbol table over
duplicating it per target.

During migration, legacy metadata may remain behind an adapter until the new derived path proves
equivalent. Do not delete trusted metadata first and hope to reconstruct it later.

---

## Relocation Policy

Relocation equality is retained because the decomp is intended for source-level modification, not
only historical byte reproduction.

The verifier should derive normalized relocations from the accepted original owner/object and
compare them with the C object.

Do not manually maintain per-target relocation arrays once the derived comparison has been proven
equivalent.

If a target produces exact final bytes but relocation structure differs, report it explicitly.
Do not silently count it as fully mod-ready pure C.

---

## Commands

The normal human/agent interface should converge on:

```text
node tools/build.js
node tools/diff.js <symbol>
node tools/verify.js [--target <symbol>] [--require-pure]
node tools/status.js
node tools/audit.js
```

### `build`

Build the current source tree.

It may use legacy Phase 7/8 implementation libraries internally during migration. Historical
implementation names do not need to become user-facing concepts.

### `diff`

Fast per-target matching loop.

### `verify`

Normal exactness/ownership/source-policy gate.

### `status`

Derive current progress from the accepted model and source classifier.

At minimum report:

- exact `PURE_C` functions and bytes;
- exact `HYBRID_C` functions and bytes;
- assembly/non-C owners;
- nonmatching/experimental C if tracked separately; and
- full-ROM exact status.

Do not source these counts from prose documentation.

### `audit`

Heavy structural verification. See `docs/AUDIT.md`.

---

## Local Tool Paths

Tracked configuration owns expected tool identities/versions/hashes, not Joe-specific absolute
paths.

Machine-local paths should come from one ignored local config or documented environment variables
resolved by a shared helper.

Normal commands should not require users or agents to paste a long set of compiler/Splat/asm-differ
paths on every invocation.

Do not weaken tool identity checks merely to simplify path handling.

---

## Parallel Agents

Use normal Git worktrees/branches.

A worker:

```text
select target
→ write C
→ diff
→ verify target
→ commit
```

Integration:

```text
rebase/merge onto latest canonical
→ node tools/verify.js
→ accept if exact
```

No additional Highway/Lane/Lease/Checkpoint orchestration is part of decomp evidence.

---

## Modified Builds

Retail matching and mod behavior are different acceptance problems.

For a modification:

```text
exact retail baseline
→ intentional source change
→ build modified ROM
→ changed-byte/layout validation
→ emulator/runtime proof
```

Do not require a modified ROM to equal retail.

Do not use the existence of a matching baseline as proof that a modification behaves correctly.

---

## Nonmatching C

Nonmatching pure C can be useful for understanding a subsystem or prototyping a future modification,
but it is not part of the retail exact baseline unless the build explicitly supports such a mode.

Label it honestly.

Do not lower exact matching requirements merely because a source reconstruction is semantically
good.

---

## Progress Priority

The project should prefer decompilation that reduces LordlyCaliber's dependence on runtime hooks
and hard-coded workarounds.

Priority order:

1. code directly intercepted/patched by LordlyCaliber;
2. dependencies needed to replace those hooks with source-level changes;
3. code behind current editor limits;
4. foundational subsystem code that unlocks several future targets;
5. opportunistic easy matches.

Matching-function count is a status metric, not the optimization target.
