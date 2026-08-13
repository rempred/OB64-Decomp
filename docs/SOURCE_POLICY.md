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
assembly byte-for-byte. The only permitted generated change is replacement of the sole `.text`
directive with the accepted target-section directive. The pinned GNU 2.6 assembler consumes that
section-adjusted file directly.

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
3. preprocess using the matching compiler/preprocessor and accepted include configuration;
4. inspect the preprocessed translation unit so assembler hidden in macros/headers is visible;
5. ignore comments and string contents when looking for C-level assembler keywords, while retaining
   enough context to report the responsible source location;
6. detect `asm`, `__asm`, `__asm__`, and equivalent accepted-compiler spellings;
7. detect register-asm bindings;
8. detect naked/section/alias mechanisms used to inject executable implementation;
9. detect assembler-source inclusion or equivalent raw-code escape hatches;
10. fail closed to `UNKNOWN` when preprocessing/classification cannot be completed.

The preprocessing identity contract pins every required executable by role, path, byte size, and
SHA-256. It also proves that the driver resolves the pinned preprocessing engine. A missing,
changed, or unbound executable rejects before preprocessing. Source-policy reports record the
complete executable identity set.

The checker may produce generated JSON under `build/`, but the classification must be reproducible
from tracked source and the pinned toolchain.

### Required regression fixtures

Tests must include at least:

- ordinary pure C → `PURE_C`;
- `asm("nop")` → `HYBRID_C`;
- `asm volatile(...)` → `HYBRID_C`;
- `register int x asm("$2")` → `HYBRID_C`;
- assembler introduced through a macro/header → `HYBRID_C`;
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
