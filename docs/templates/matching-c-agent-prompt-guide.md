# Ordinary Matching-C Agent Prompt Guide

Use this guide to brief a private source worker in Joe's assigned program.
Contributors working in their own forks use [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Before Writing the Prompt

Give the worker a resolved task, not a target-selection problem. Include:

- repository path, symbol, complete wave target list, and wave identifier;
- assigned scratch root, candidate source path and exact guarded command for its selected inputs/tools;
- accepted assembly/disassembly owner;
- only the relevant dossier or subsystem notes;
- files already dirty that must be preserved;
- current Director identity, tested native route and any program-specific overrides;
- the [recorded runtime evidence guidance](../WORKFLOW.md#use-recorded-runtime-evidence-when-useful)
  and Director route for concrete decision or tool-assistance needs; and
- the required result: exact `PURE_C`, exploratory C, or analysis only.

For a `PURE_C` assignment, avoid a target already known to require secondary
entries, hand-authored instructions, or another assembler-only mechanism.

## Keep the Worker on the Matching Loop

Give the worker the game behavior or caller that consumes the target. Include
one relevant worked example from the [matching study](../research/how-matching-works-20261117.md)
and a first comparison that can distinguish two explanations. Follow the
[matching approach](../WORKFLOW.md#worker-matching-approach-addendum).

```text
Worker: read target intake and assembly, then generate or resume the candidate in the assigned root.
Worker: compare early, test the first meaningful difference, and preserve useful source and evidence.
Worker: finish the complete assigned wave and send the handoff to the Director.
Integrator: reconcile the wave, check linked bytes, relocations and source class, then run the final verifier.
```

Compiler assembly, object dumps, and small probes are useful when explaining a
specific mismatch. They should not replace the diff loop or become a long attempt
to predict the compiler before the first build. Manual byte equality is diagnostic
only; it is not acceptance.

Supply the commands that passed preflight for the worker's complete roster.
The [private workbench](../WORKFLOW.md#private-candidate-workers) gives examples
for live inputs. The [selected-input instructions](../WORKFLOW.md#complete-wave-preparation-and-immutable-private-tool-selection)
specify the supported commands and launcher for each tool version.

Do not prescribe register allocation, exact C syntax, or a guessed semantic name
unless evidence makes it necessary. Let the worker use the diff to discover the
required C shape.

## When the Work Is Right but the Registers Differ

The old compiler chooses CPU registers partly from how C variables are divided
and how long each value is needed. Two pieces of C that do the same work can
therefore produce different registers.

Before register tuning, confirm that the accepted owner and placement are
correct. Candidate and retail instruction extents, CFG, opcode families, stack
frame, calls, prototypes, ABI slots, relocations, and linked jump targets must
already agree or have one bounded local difference. Fix any larger mismatch
first. `docs/KMC_GCC_MATCHING_NOTES.md` contains the full checklist and evidence
labels.

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

The private workbench compares the candidate with the authenticated inputs.
Raw-object `j`/`jal` words may not resolve until linking. Check the relocation
before treating a different address as evidence for a source change.

## Completion and Stop Conditions

The worker keeps the best recoverable candidate and its comparison for each
target. At the complete-wave handoff, the integrator owns source activation,
relocation records, linked diffs, mechanical source classification, and final
whole-ROM verification. [Integration and verification](../WORKFLOW.md#6-verify-the-complete-wave)

The worker must stop and report the exact evidence if:

- the accepted boundary, placement, or owner appears wrong;
- exact output appears to require an assembler escape hatch;
- the baserom or pinned toolchain cannot be authenticated; or
- a canonical command is blocked by the host environment.

Do not authorize bypassing a verification gate. A diagnostic manual compile may
help explain a blocker, but it must not be reported as a verified match.

## Copyable Prompt

```text
Prepare PURE_C candidates for <complete wave roster> in <assigned checkout>.
Your private root is <path>. Start with <symbol>, owned by <assembly path and ROM range>.
Its consumer is <caller or game behavior>. Relevant prior evidence is <tracked paths>.
Use <worked example> to distinguish <two plausible causes> at <first difference>.

Use <preflighted launcher and commands, with exact root and input/tool selection>.
Read the current intake. Check the initial or resumed C against every required body
and the full disassembly. Compile early and use the first meaningful instruction
or relocation difference to choose the next experiment. Keep the best candidate,
useful comparisons and your cursor in your assigned private root.

Read AGENTS.md, docs/SOURCE_POLICY.md and the Worker matching approach addendum
in docs/WORKFLOW.md. Follow <program-specific staffing instructions> and the workflow
section "Use recorded runtime evidence when useful". Check caller compatibility under
its "C interface consistency at the complete-wave boundary" section, including body-only
changes. Tooling review follows AGENTS.md, "tooling-review"; it is not routine source review.
Use <tested native message route and exact Director chat> for a complete handoff,
a blocker needing a decision, a shared-input coordination need, or a requested
answer. Keep routine experiments in your cursor. Send a decision request with its
evidence before stopping. Follow the workflow's “When matching ideas run out”
procedure for a plateau. Preserve unrelated work and the accepted structural owners.

When the complete wave is ready, send the Director the roster, recoverable source
paths and comparison evidence. The dedicated integrator owns tracked changes,
canonical linked checks and the full-ROM verifier.
```
