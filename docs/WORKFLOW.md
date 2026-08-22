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

### Compiler assembly and source-to-object evidence

The build classifies every active target before compilation. `UNKNOWN` and `ASM` reject before the
matching compiler runs. The source class is unchanged by later toolchain stages.

The authenticated Windows KMC GCC 2.7.2 compiler emits `<symbol>.compiler.s`. The build preserves
that file untouched. It derives `<symbol>.s` only by replacing the sole `.text` directive with the
accepted target-section directive, then passes that file directly to the pinned GNU 2.6
assembler. There is no compiler-assembly rewrite or target-specific parser between the compiler
and assembler.

Each active target retains these reviewable artifacts:

1. untouched compiler assembly in `<symbol>.compiler.s`;
2. section-adjusted assembly in `<symbol>.s`;
3. a raw GNU 2.6 source object containing load-relevant relocation evidence;
4. a link input object with discarded ancillary sections removed; and
5. a deterministic `<symbol>.source-object-proof.json` record.

Strict verification independently recreates the section adjustment and proof. The proof records
the source-policy result, compiler and assembler identities/flags, artifact hashes, target-section
bytes, load-relevant relocations, visible ancillary differences, linked bytes, and final owner.
It explicitly records that compiler assembly was not rewritten.

GNU 2.6 omits the procedure-descriptor relocation emitted by the former production assembler.
Procedure metadata is discarded before the final link, so the historical records are retained as
retired ancillary evidence rather than silently compared as active relocations. Every relocation
against the accepted target section remains mandatory by offset, type, and normalized
symbol/value semantics.

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

`EXACT` requires a nonempty pairwise decoded-instruction match and equal final linked bytes. Raw
linked-byte comparison is authoritative; decoded output is a development aid. Missing, duplicate,
malformed, or wrong-sized linked sections fail with `ERROR`.

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

Historical ancillary metadata may remain recorded while the active contract derives load-relevant
facts from GNU 2.6 source objects. Do not delete trusted evidence before the derived replacement has
been proven equivalent.

---

## Relocation Policy

Relocation equality is retained because the decomp is intended for source-level modification, not
only historical byte reproduction.

The verifier derives normalized load-relevant relocations from the GNU 2.6 source object and
compares them with the reviewed accepted contract. Discarded ancillary metadata remains visible in
the source-to-object report but is not treated as a ROM or modification-relevant relocation.

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

`config/local-tools.json` must set `powershellRuntimeRoot` to the root of the authenticated pinned
Windows PowerShell runtime. That root contains
`System32/WindowsPowerShell/v1.0/powershell.exe` and
`System.Management.Automation.dll`. `OB64_POWERSHELL_RUNTIME_ROOT` is the environment override.
Normal commands pass this path through every build and verification layer and isolate the child
PowerShell version check with the matching `WINDIR` and `DEVPATH`; they do not depend on the
machine's ambient, updateable PowerShell installation.

Normal commands should not require users or agents to paste a long set of compiler/Splat/asm-differ
paths on every invocation.

Do not weaken tool identity checks merely to simplify path handling.

---

## Parallel Agents

Work in the current checkout and branch unless Joe explicitly directs creation of
a branch or worktree.

Use `docs/templates/matching-c-agent-prompt-guide.md` when assigning an ordinary
one-function matching task, especially to a worker that benefits from a short,
explicit diff-and-verify loop.

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
