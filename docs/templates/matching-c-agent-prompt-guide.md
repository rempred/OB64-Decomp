# Ordinary Matching-C Agent Prompt Guide

Use this guide when assigning one accepted function to a worker for an exact
`PURE_C` match. Structural corrections, semantic research, and subsystem-wide
reconstruction need their own prompts.

## Before Writing the Prompt

Give the worker a resolved task, not a target-selection problem. Include:

- repository path and symbol;
- intended C source path;
- accepted assembly/disassembly owner;
- only the relevant dossier or subsystem notes;
- files already dirty that must be preserved;
- whether the worker should commit; and
- the required result: exact `PURE_C`, exploratory C, or analysis only.

For a `PURE_C` assignment, avoid a target already known to require secondary
entries, hand-authored instructions, or another assembler-only mechanism.

## Keep the Worker on the Matching Loop

Ask for the simplest plausible C reconstruction, then an early canonical diff.
The normal loop is:

```text
inspect accepted target
→ write plausible C
→ node tools/diff.js <symbol>
→ change C in response to the concrete diff
→ verify the exact result
```

Compiler assembly, object dumps, and small probes are useful when explaining a
specific mismatch. They should not replace the diff loop or become a long attempt
to predict the compiler before the first build. Manual byte equality is diagnostic
only; it is not acceptance.

The repository also has an optional matching workbench. It can prepare a first
draft and recover earlier experiments without making canonical source changes:

```text
node tools/match.js inspect <symbol>
node tools/match.js prepare <symbol>
node tools/match.js best <symbol>
```

Let the worker use it when useful; do not turn every command into a mandatory
ritual. A scratch result labeled `exact-bytes` still needs to be deliberately
adapted into `src/` and pass the normal linked diff and verifiers. For a close
hard case, `family`, `context`, and `probe` can answer a specific question.

Do not prescribe register allocation, exact C syntax, or a guessed semantic name
unless evidence makes it necessary. Let the worker use the diff to discover the
required C shape.

## When the Work Is Right but the Registers Differ

The old compiler chooses CPU registers partly from how C variables are divided
and how long each value is needed. Two pieces of C that do the same work can
therefore produce different registers.

If the instructions already do the right work but use the wrong registers:

- keep independent reads and writes in the order suggested by the retail code;
- write comparisons in the direction that gives the retail branch layout;
- give separate reads or stages separate local variables when the compiler is
  keeping one value alive for too long;
- reuse a local when the retail code clearly reuses one register; and
- use an ordinary temporary and separate statements when the compiler combines
  arithmetic in the wrong order.

Change one of these things at a time and run the diff again. Do not force the
answer with inline assembly or fixed-register declarations.

`func_000135a0` is the accepted example. Source-order and comparison changes
first matched its loop and branch layout. Giving its three successive stream
reads three cursor variables then fixed the remaining register choices. A
signed arithmetic temporary and two separate statements fixed the last two
instructions. Its complete example, experiment record, and the limits of the
lesson are recorded in
`docs/dossiers/func-000135a0.md`.

Its experiments also provide two narrow type clues: a `u16` local can expose a
16-bit truncation after arithmetic, and a `u8` value can expose a byte mask
before an unsigned comparison. Use these only when the retail instructions show
the corresponding operation.

For a difficult close match, `docs/KMC_GCC_MATCHING_NOTES.md` records additional
scoped experiments with the pinned compiler. It distinguishes reproduced
observations from explanations that were not established. Read it for possible
experiments, not as a recipe for predicting register allocation.

An ignored scratch compile-and-word-compare loop may shorten focused experiments
if it uses the authenticated compiler, exact production flags, accepted section
adjustment, and pinned assembler. It remains diagnostic. Raw-object `j`/`jal`
words may not resolve until linking, and only the canonical linked diff and
verifiers can accept the target.

For a newly activated target, `tools/diff.js` may report that its relocation
contract is `MISSING` and print a candidate. That is expected discovery output,
not a verifier failure. Review the candidate, add the smallest exact entry to
`config/matching-c-linkage.json` (including an explicit empty list when there
are no load-relevant relocations), and rerun the canonical diff and verifier.
Never create a target record in the frozen `config/phase8/matching-c.json`.

## Completion and Stop Conditions

An exact `PURE_C` task is complete only after all of these pass:

```text
node tools/diff.js <symbol>
node tools/source_policy.js --target <symbol>
node tools/verify.js --target <symbol> --require-pure
node tools/verify.js
```

The worker must stop and report the exact evidence if:

- the accepted boundary, placement, or owner appears wrong;
- exact output appears to require an assembler escape hatch;
- the baserom or pinned toolchain cannot be authenticated; or
- a canonical command is blocked by the host environment.

Do not authorize bypassing a verification gate. A diagnostic manual compile may
help explain a blocker, but it must not be reported as a verified match.

## Copyable Prompt

```text
Match `<symbol>` as exact `PURE_C` in:

`<absolute repository path>`

Target context:
- C source: `<source path>`
- Accepted assembly/disassembly: `<owner path>`
- Relevant evidence: `<specific paths, or "none">`
- Preserve these existing changes: `<paths, or "working tree is clean">`
- Commit policy: `<commit after verification / do not commit>`

Read `AGENTS.md`, `docs/WORKFLOW.md`, and `docs/SOURCE_POLICY.md`, followed only
by the target-specific evidence above. For a difficult compiler-output match,
also read `docs/KMC_GCC_MATCHING_NOTES.md` and
`docs/dossiers/func-000135a0.md`. Inspect Git status before editing. Do not create
a branch or worktree.

This is an ordinary function match. Preserve the accepted function boundary,
placement, overlay/segment model, linker ownership rules, and toolchain. Keep the
implementation genuinely `PURE_C`: no inline assembly, register-asm bindings,
raw instruction injection, or section tricks.

Work directly toward a match:
1. Inspect the accepted target and nearby calling context. You may use
   `node tools/match.js inspect <symbol>` and `prepare <symbol>` to recover a
   bounded first draft and earlier research.
2. Write the simplest plausible C reconstruction.
3. Run `node tools/diff.js <symbol>` early.
4. Iterate from the concrete instruction/byte diff. Inspect compiler assembly or
   use small ignored probes only when they answer a specific mismatch.
5. Once exact, run:
   - `node tools/source_policy.js --target <symbol>`
   - `node tools/verify.js --target <symbol> --require-pure`
   - `node tools/verify.js`
   - `git diff --check`
   - `git status --short --branch`

Do not claim success from a manual compile or partial byte comparison. If a
structural issue, tool-identity failure, or apparent need for assembly blocks the
task, stop and report the exact command, output, and smallest concrete blocker.
Do not weaken the canonical verification path or treat a manually reproduced
pipeline as a substitute for it.

Keep changes limited to the target source and the smallest required target
configuration update. Preserve unrelated work. In the final report, state the
result, files changed, canonical command results, and any remaining uncertainty.
```
