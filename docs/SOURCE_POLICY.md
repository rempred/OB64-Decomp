# OB64 Decomp — Source Policy

## Purpose

Exact retail bytes prove output equivalence. They do not prove that a `.c` file is genuinely
decompiled C.

This policy prevents assembly from being hidden inside a C translation unit and then counted as
matching C.

The policy is intentionally strict and mechanical.

---

## Source Classes

### `PURE_C`

A translation unit is `PURE_C` when the function implementation is expressed through C/compiler
semantics rather than assembler escape hatches.

`PURE_C` may use awkward C required for historical compiler matching, including:

- `volatile`;
- unusual casts;
- redundant temporaries;
- `goto`;
- strange loop shapes;
- explicit integer widths;
- carefully ordered expressions;
- compiler optimization flags; and
- ordinary C declarations/macros.

`PURE_C` must not contain an assembler mechanism after preprocessing.

### `HYBRID_C`

A translation unit is `HYBRID_C` when it is compiled as C but contains an assembler escape hatch
or explicit machine-code injection technique.

Examples include:

- `asm(...)`;
- `asm volatile(...)`;
- `__asm(...)`, `__asm__(...)`, or equivalent compiler spellings;
- register variables bound with `asm("$N")`;
- inline blocks containing MIPS instructions;
- raw `.word`, `.byte`, `.insn`, or similar assembler directives reached through inline asm;
- inclusion of assembler source into a C translation unit;
- naked-function techniques whose implementation is supplied manually;
- explicit section/alias tricks used to inject the target's executable bytes instead of having the
  compiler generate them; and
- macros or included headers that expand to any of the above.

A `HYBRID_C` function may be byte-exact and useful. It does not count as matching C.

### `ASM`

The active implementation is assembly source.

### `UNKNOWN`

The policy checker could not safely classify the translation unit.

`UNKNOWN` fails closed for any task requiring `PURE_C`.

## Compiler-Assembly Handling

Source classification is complete before compilation and does not change during assembly.
`UNKNOWN` and `ASM` are not accepted matching-compiler inputs.

For both `PURE_C` and `HYBRID_C`, the production path preserves the authenticated KMC compiler
assembly byte-for-byte. Ordinarily the only generated change is replacement of the sole `.text`
directive with the accepted target-section directive. A target-specific reviewed linkage contract
may additionally assign the exact `.text` regions and one compiler-emitted read-only switch-table
`.rodata` region per target to accepted output sections. A reviewed multi-function text contract
may describe compiler-emitted local functions only when their exact offsets and sizes gaplessly
partition the single accepted text owner; it cannot export a new symbol or split source ownership.
The auxiliary contract fixes the section's
read-only `PROGBITS` shape, alignment, size, hashes, relocations, placement, and ownership. The
assignment changes section directives only; it does not rewrite instructions, labels, table
entries, or relocations. Any preserved assembly remainder uses a uniquely named read-only
`PROGBITS` input section under the same exact placement and ownership contract; `.data`, `.bss`,
writable, executable, or uncontracted tail sections reject. The pinned GNU 2.6 assembler consumes
the section-assigned file directly.

When target-specific `.rodata` fragments share one accepted auxiliary row, C and explicit retained
original-ASM contributions must cover the complete row in linker order without gaps or overlaps.
Only the first fragment may retain an exterior prefix; only the final fragment may retain the single exact assembly tail.
A noninitial fragment may declare its immediately preceding original-ASM interval through `preservedInteriorBefore`.
Multiple interiors require separate contracts, with exact original-source identity, bytes, ROM/RAM placement, and explicit empty relocation evidence.
The existing same-chunk, accepted-row, alignment, compiler-occurrence, and source-object-prefix restrictions remain unchanged.
This representation neither changes the accepted data boundary nor creates independent structural owners.

Retained interiors support literal original data only.
The whole original row must have no nonempty REL/RELA sections targeting it, including relocations outside the retained interval.
Generated retained objects must also contain no actual relocations or named non-section symbols.
Their interval sections remain allocated, read-only `PROGBITS` with alignment one; relocations are never silently stripped or fabricated.
Retained bytes remain `ASM`, distinct from compiler alignment padding, and never increase matching-C accounting.
See [the accepted retained-interior contract](AUXILIARY_INTERIOR_ASSEMBLY.md) for the complete producer and verification requirements.
Acceptance of this tooling does not activate production ownership or accept an unfinished matching wave.

Source-to-object proof verifies the untouched compiler-assembly hash, section-adjusted hash,
assembler identity and flags, raw object identity, target bytes, and load-relevant relocations.
No downstream assembly rewrite can make a hybrid source pure: any `#APP`/`#NO_APP` content or other
assembler escape hatch was already detected mechanically in the source-policy step.

---

## No Inline-Assembly Exception for `PURE_C`

There is intentionally no “small enough” inline-assembly exception.

One MIPS instruction is enough to classify the translation unit as `HYBRID_C`.

This avoids subjective rules such as “assembly is allowed if it is only compiler coercion” and
prevents an agent from gradually moving an entire original function into inline asm while preserving
a `PURE_C` label.

If exact output currently requires a register binding, barrier, instruction, secondary-entry trick,
or other assembler construct, keep the exact source as `HYBRID_C` and continue pure-C work later.

Some historical functions may legitimately remain hybrid for a long time.

---

## What Is Not a Violation

The following do not make source hybrid merely because they are ugly or compiler-specific C:

- volatile accesses;
- pointer/integer casts;
- temporary variables chosen to influence register allocation;
- unusual control flow;
- macro-expanded C expressions;
- function prototypes;
- standard linkage declarations; and
- compiler flags selected globally by the matching toolchain.

A compiler intrinsic or unusual attribute that can directly control emitted machine instructions
should be reported by the checker for review even when it is not automatically classified as asm.

Do not expand this exception list casually.

---

## Classifier Requirements

The source-policy tool must classify source automatically. Agents do not declare themselves pure.

Recommended interface:

```text
node tools/source_policy.js
node tools/source_policy.js --target <symbol>
```

The implementation should use a small deterministic lexer rather than naive substring matching so
comments and ordinary string literals do not create false positives.

### Required checks

For each active C target:

1. inspect the raw source;
2. authenticate every executable in the preprocessing chain before invoking the preprocessor;
3. preprocess once using the accepted include configuration while emitting an authenticated
   dependency file from that same invocation;
4. retain the exact preprocessor stdout bytes as the only input supplied to the matching KMC
   compiler, and inspect those same bytes so assembler hidden in macros/headers is visible;
5. ignore comments and string contents when looking for C-level assembler keywords, while retaining
   enough context to report the responsible source location;
6. detect `asm`, `__asm`, `__asm__`, and equivalent accepted-compiler spellings;
7. detect register-asm bindings;
8. detect naked/section/alias mechanisms used to inject executable implementation;
9. detect assembler-source inclusion or equivalent raw-code escape hatches;
10. fail closed to `UNKNOWN` when preprocessing/classification or dependency authentication cannot
    be completed.

The preprocessing identity contract pins every required executable by role, path, byte size, and
SHA-256. It also proves that the driver resolves the pinned preprocessing engine. A missing,
changed, or unbound executable rejects before preprocessing. Source-policy reports record the
complete executable identity set.

The authored `.c` identity, repository-local header identities, and final compilation-input
identity are separate evidence. Every depfile entry must resolve to a regular, nonsymlink file
inside the repository. Missing, changed, duplicated, external, or escaping dependencies reject.
The exact preprocessed bytes and dependency set participate in CURRENT, diff-cache, and workbench
reuse identities; changing a header therefore invalidates every translation unit that consumed it
even when its authored `.c` file is unchanged.

The checker may produce generated JSON under `build/`, but the classification must be reproducible
from tracked source and the pinned toolchain.

### Required regression fixtures

Tests must include at least:

- ordinary pure C → `PURE_C`;
- `asm("nop")` → `HYBRID_C`;
- `asm volatile(...)` → `HYBRID_C`;
- `register int x asm("$2")` → `HYBRID_C`;
- assembler introduced through a macro/header → `HYBRID_C`;
- a repository-local header edit changes dependency, compilation-input, and CURRENT identities;
- an external or escaping header dependency → `UNKNOWN`;
- the word `asm` inside a comment → still `PURE_C`;
- the word `asm` inside an ordinary string literal → still `PURE_C`;
- a prohibited naked/section injection case → `HYBRID_C`;
- preprocessing/classification failure → `UNKNOWN`.

Do not attempt to calculate a subjective “percent C” score.

---

## Acceptance Behavior

### Existing sources

Migration must first classify every currently active `.c` replacement.

Do not make the exact baseline fail merely because an existing source is discovered to be hybrid.

Instead report:

```text
Exact PURE_C ........  N functions / X bytes
Exact HYBRID_C ......  M functions / Y bytes
```

The official matching-C count becomes the `PURE_C` count.

### New matching-C work

A task whose goal is “matching C” is accepted only when:

- source policy is `PURE_C`;
- output target is exact;
- C linker ownership is proven; and
- the complete ROM is exact.

If output is exact but source policy is `HYBRID_C`, report **MATCHING HYBRID**, not matching C.

For ordinary matching waves, perform mechanical source classification and the
canonical linked diff per function. Keep those results provisional until the
complete wave passes final verification. A single successful final wave report
can supply the complete-ROM and ownership evidence for every included target.
Every wave target must be present and `PURE_C` in that run's authoritative report.
Ordinary matching acceptance requires no independent reviewer after these canonical gates pass.
Source classification alone or a successful ROM build alone does not establish acceptance.
Do not run full-ROM verification separately for each target to establish source class.
The existing accepted baseline may contain hybrid sources; they remain separate
from the wave's required pure-C results. See [WORKFLOW.md](WORKFLOW.md) for timing.

### Pure-C cleanup tasks

When converting a legacy hybrid:

1. preserve the current exact hybrid as the starting reference;
2. remove all assembler escape hatches from the target translation unit;
3. reach `PURE_C`;
4. regain exact target and exact ROM output; and
5. then allow the target to move into the official matching-C count.

---

## Secondary Entries and Difficult Compiler Cases

Some original owners may have secondary entry points, unusual hand-written assembly, compiler
artifacts, or control-flow structures that are difficult or impossible to express as exact pure C
without first improving the structural split.

Do not fake success with inline assembly.

Allowed outcomes are:

- leave the original owner as `ASM`;
- keep an exact `HYBRID_C` intermediate;
- open a structural task if the accepted owner boundary is probably wrong; or
- maintain a nonmatching pure-C research reconstruction outside the exact baseline.

Correct classification is more valuable than an inflated matching-C percentage.

---

## Reporting

`tools/status.js` should derive and report source class automatically.

Example:

```text
OB64 Rev 0 decomp status

Retail ROM ............... EXACT
PURE_C exact ............. 12 functions / 3,412 bytes
HYBRID_C exact ........... 22 functions / 7,905 bytes
ASM/other ................ remaining accepted owners
```

Do not call `PURE_C + HYBRID_C` “matching C.”

If desired, call the combined set “exact source replacements,” but keep the classes visible.

## Native text and source class

Native assembler alignment is representation evidence, independent of source classification. A generated inline-assembly fixture remains HYBRID_C even when its full ROM is exact. A native PURE_C match still requires sole C ownership, exact complete owner bytes including its tail, accepted relocations, and an exact complete retail ROM.

## Compilation groups

A compilation group is one C producer for several existing function targets. The version-1 registry is `config/matching-c-compilation-groups.json`. A grouped target uses `{ "symbol": "func_XXXXXXXX", "compilationGroup": "group_id" }` instead of a standalone source record. The registry remains empty until a separately assigned complete source wave activates all members together.

The group record fixes its source, ordered public functions, accepted owner rows, native text shape/hash, terminal alignment bytes and complete group-relative relocation semantics. Owner placement and fallback identities come from the accepted structural model. The initial mode admits contiguous single-function owners in one placement context, with optional native terminal padding only in the final owner. It cannot combine art-native, continuation, local-function or auxiliary contracts.

The pinned compiler assembly is unchanged. A separate ELF metadata projection copies native text into existing owner sections. It preserves instruction bytes, encoded addends, public function symbols and the group-base section anchor. Projected alignment is derived from native alignment and owner offset; exact ROM/RAM equations prohibit fill or movement. All members link from one C object and retain individual acceptance results.

The raw and projected objects admit exactly one pinned `.reginfo`: type `0x70000006`, flags `2`, size `24`, alignment `4`, address/link/info zero and entry size `1`. Its payload identity must agree across projection. Only its unnamed local section symbol is allowed; relocation targets or references reject. The existing pinned ancillary-removal sequence removes it before linking. Stripped and linked evidence must show no `.reginfo`, with unchanged owner bytes, public functions and load relocations. Other uncontracted allocation and nonzero COMMON reject.

Classification uses the complete authenticated translation unit once per producer. Every member inherits its class. An assembler escape in any part makes the whole group HYBRID_C; UNKNOWN rejects. Group producers and native padding never increase the function count. Member results count only after all complete-wave and full-ROM gates pass.
