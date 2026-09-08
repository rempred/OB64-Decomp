# OB64 Decomp — Agent Guide

## Purpose

This repository decompiles *Ogre Battle 64: Person of Lordly Caliber*, US Rev 0.

The matching baseline is successful when tracked source rebuilds the canonical normalized
Rev 0 ROM byte-for-byte. The project is also intended to become useful for source-level
modification, so matching output, source quality, structural evidence, and semantic evidence
must remain distinct.

Rev 1 is out of scope until the Rev 0 build and workflow are stable.

## Read Order

For normal work, read only what the task requires:

1. `AGENTS.md`
2. `docs/WORKFLOW.md`
3. `docs/SOURCE_POLICY.md`
4. `docs/NEXT_STEPS.md`
5. the relevant subsystem/research document

Read `docs/AUDIT.md` only for structural work or when explicitly assigned.

Do not require agents doing an ordinary function match to reconstruct historical Phase 5/6/7/8
program history, lane history, promotion history, or archived research chronology.

## Non-Negotiable Invariants

- The canonical comparison target is the verified US Rev 0 baserom normalized to z64.
- ROM binaries, savestates, objects, compiler output, rebuilt ROMs, maps, and generated proof
  reports remain untracked.
- The original assembly owner remains available as reference/fallback until replacement handling
  is proven by the canonical build.
- A function counts as **matching C** only when:
  - its source class is `PURE_C`;
  - the C object is the sole linked owner of the accepted target section;
  - the linked target bytes exactly equal the baserom bytes; and
  - the complete rebuilt ROM is byte-identical to the baserom.
- A `.c` file containing inline assembly is not `PURE_C`, even if it produces exact retail bytes.
- Structural claims and semantic claims are separate from matching claims.
- Do not strengthen a function/field/subsystem name beyond the available evidence.
- Ordinary matching tasks must not alter function boundaries, overlay descriptors, segmentation,
  executable extent, linker ownership rules, compiler identity, or other structural foundations.
- Generated status is authoritative for counts. Do not manually maintain matching-function counts
  in multiple documents.
- Git is the source-history and integration record. Do not create promotion/checkpoint/lane/lease
  evidence protocols for ordinary matches.

## Work Types

### 1. Normal matching work

Choose worker models by the actual assignment, including future continuations.
Use Sol High (`gpt-5.6-sol`, reasoning `high`) for retrieval/data-seeking or parsing-only work.
Use Astra Medium (`gpt-6-astra`, reasoning `medium`) for implementation or research requiring reasoning.
A mixed assignment containing implementation or substantive research reasoning uses Astra Medium.
This supersedes earlier worker model rules unless Joe gives a later explicit instruction.
Director and reviewer model assignments remain separate. Reuse existing eligible worker tasks.

Use internal agents for this decomp program. Work on one matching family at a time on `main`,
with one production source/build writer. Parent top-level task transport requirements do not apply.
Independent read-only research/review and explicitly disjoint documentation work may run alongside that writer.

Use the accepted structural owner as-is, reconstruct the function in C, and iterate with the linked diff.
Run the final full-ROM build and normal verifier only after the complete assigned wave is ready.

Ordinary matching-wave completion does not require independent review. The canonical verifier,
including every assigned target's `PURE_C` classification, ownership, placement, relocation,
target-byte, and complete-ROM gates, establishes matching acceptance for its exact inputs.
Structural, tooling/verification, and semantic changes retain their applicable review requirements.
Recording actual per-target relocations under existing linker rules is ordinary matching work;
reviewing that evidence does not require a separate reviewer.

If the boundary or overlay mapping appears wrong, stop treating the task as ordinary matching
work and open a structural task.

Ordinary matchers must not edit shared tooling. Route an independently justified representation defect
as a separate structural/tooling assignment with its applicable audit and independent review.
A remedy must preserve generic invariants and adversarial rejection. Passing one function does not
justify symbol-specific bypasses, fabricated bytes, or source-policy/compiler exceptions.

Independently derive readable C from the ROM and project evidence. Prefer structured control flow,
evidence-backed shared types, fields, and constants, then run an early linked diff.
Keep uncertain meanings explicit. Explain necessary compiler workarounds near the affected C.
Ordinary readability cleanup under existing contracts uses the normal wave gates; it adds no review ceremony.

Experiments need not improve the score at every step. Preserve the current best candidate while
allowing evidence-backed sequences of related source changes through temporary regressions.
An experiment that produces worse bytes, extent, frame size or allocation is not selected as
the current best; that result alone does not disprove its underlying structure. Eliminate a
hypothesis only when stronger evidence contradicts it, and state that evidence separately from
candidate selection. Final matching acceptance still requires every canonical gate.

### 2. Structural work

Structural work changes or validates boundaries, segments, overlays, linker layout, executable
classification, source ownership, or the compiler/toolchain contract.

Follow `docs/AUDIT.md`. Structural changes require the heavyweight audit and independent review.

### 3. Semantic/research work

Semantic work establishes what code means. Static evidence can support cautious structural names.
Runtime traces or controlled mutations are required when static evidence is not sufficient for a
behavioral claim.

Semantic uncertainty does not block a machine-code match. Keep `func_XXXXXXXX` when necessary.

### 4. Modified-game work

A modified ROM is expected to differ from retail. Modified-game acceptance therefore uses runtime
and changed-byte/layout tests, not the retail exact-ROM rule. Always preserve a known-exact
matching baseline from which modifications are derived.

### 5. Total Resolver work

Total Resolver is an intentional decomp-repository tool under `tools/total_resolver/`.
Project64 remains an external runtime dependency, and the ordinary build and verifier must remain
usable without it.

Before using or changing Total Resolver, read `tools/total_resolver/AGENTS.md`; it defines the
agent-safe query, capture, recovery, and verification workflow.

Tracked resolver source, configuration, schemas, documentation, tests, and bounded approved
fixtures belong in this repository. Session databases, RAM captures, screenshots, generated
resolver databases, caches, traces, and other bulk runtime evidence belong under ignored
`build/total-resolver/` paths by default.

Keep static, placement, execution, resource, field, and human-annotation evidence distinct. New
live observations begin as `live-unreviewed`; they do not silently alter accepted structural or
matching evidence. The frozen pre-R3 overlay and runtime atlases remain historical/reference inputs
and must not seed the clean R3 dynamic lane.

## Source Classes

The source-policy tool determines source class. Agents do not self-certify it.

- `PURE_C` — C source with no inline assembler mechanism or raw assembler injection.
- `HYBRID_C` — exact or nonexact C translation unit containing inline asm, register-asm bindings,
  naked/section tricks used to inject code, assembler includes, or another assembler escape hatch.
- `ASM` — assembly source.
- `UNKNOWN` — source policy could not be evaluated safely.

Only `PURE_C` contributes to the official matching-C count.

Legacy `HYBRID_C` sources may remain in the exact baseline. Do not rewrite them merely to satisfy
this policy unless pure-C conversion is the assigned task.

See `docs/SOURCE_POLICY.md`.

## Normal Matching Wave

The normal loop is:

```text
choose accepted target
→ write/adjust C
→ diff <symbol>
→ confirm mechanical PURE_C and exact relocation contract
→ record provisional candidate; continue with the next wave target
→ after the complete wave, run verify once on the combined result
→ confirm every wave target is PURE_C in that final report
→ completed-wave integration; verify changed integration inputs
```

Do not run `build.js`, `verify.js --target`, or equivalent full-ROM acceptance commands after each function.
The final verifier builds CURRENT when needed; do not precede it with a redundant final build.
An initial missing setup baseline may be built once. The linked diff remains a development check.
Provisional function commits are allowed under the assigned commit policy; they do not establish matching-C acceptance.
Do not split an assigned wave into single-function waves to preserve per-function full verification.
Use one final verification report for all wave targets. Existing accepted hybrid sources may remain hybrid.
Verify a changed integrated state at the completed-wave boundary; do not rerun solely for an unchanged commit or handoff.
Do not add an independent source-review gate or review-only verifier repeat to ordinary matching waves.
Structural audit and review requirements for changes outside ordinary matching remain applicable.
A function task is accepted only when its requested source class and the completed wave's full-ROM gates pass.

If exact output requires inline assembly, report `HYBRID_C exact` rather than calling the task
matching C.

Permission to use `HYBRID_C` allows an intermediate or fallback. It does not by itself change a
`PURE_C` assignment into a hybrid assignment. Treat an exact hybrid as the final result for an
assigned target only when one of these conditions is documented:

- the available evidence indicates that the function most likely requires assembly inherently;
  or
- a genuine pure-C attempt has reached a concrete blocker that cannot be resolved with the current
  tools and information.

Function size, compiler-scheduling difficulty, or exact hybrid bytes alone are not enough. State
the evidence or blocker before advancing to the next target. Even when this exception applies, the
result remains `HYBRID_C exact`; it is not matching C and does not count toward matching-C progress.

## Sequential Work

Do not create a Git branch or worktree unless Joe explicitly directs you to create it. A request to
parallelize work, delegate a task, make a commit, or continue autonomously is not authorization to
create either one. Work in the current checkout and branch by default.

Do not create or use concurrent development branches/worktrees for this decomp program.
Preserve historical worktrees and their evidence. They are read-only inputs unless Joe changes this direction.

Each worker owns one target at a time and uses focused linked-diff and source-policy checks within its assigned wave.
Small commits remain provisional until final wave verification passes; ordinary waves need no independent review.
Record the completed wave on `main`; verify changed combined integration inputs.

No Highway, Lane, Lease, Checkpoint, frozen-tree, promotion-receipt, or handoff protocol is
required.

## Clean-Room Boundary

Keep the existing clean-room separation from external personal/unlicensed decomp source.

External work may identify facts to independently verify, such as an address, boundary, library
identity, or behavior hypothesis. Do not copy external source expression, comments, config, or
documentation into the canonical repository merely because the resulting bytes can be verified.

Independently derive canonical source from the ROM and project evidence.

## Documentation Rules

- `AGENTS.md` contains durable rules only.
- `docs/WORKFLOW.md` contains the normal loop.
- `docs/SOURCE_POLICY.md` contains source-class rules.
- `docs/AUDIT.md` contains heavyweight structural verification.
- `docs/NEXT_STEPS.md` contains only the active queue and priority rules.
- Generated status owns changing counts and percentages.
- Historical evidence may remain in Git/history/archive, but it is not required reading for normal
  work.
- Do not update five documents merely because one more C function matched.

## Fail-Closed Rules

Stop and report rather than guessing when:

- the baserom identity is wrong;
- the pinned compiler/toolchain cannot be authenticated;
- the accepted structural owner cannot be resolved uniquely;
- C ownership in the linker map is ambiguous;
- the original assembly target may still be linked;
- target placement or target bytes differ;
- the complete retail rebuild differs;
- source classification is `UNKNOWN`; or
- a requested semantic claim exceeds the evidence.

A failed hypothesis is normal reverse engineering. A silently weakened verification rule is not.
