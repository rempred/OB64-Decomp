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

Use the accepted structural owner as-is, reconstruct the function in C, iterate with the diff
tool, and run the normal verifier.

If the boundary or overlay mapping appears wrong, stop treating the task as ordinary matching
work and open a structural task.

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

## Normal Function Task

The normal loop is:

```text
choose accepted target
→ write/adjust C
→ diff <symbol>
→ verify --target <symbol> --require-pure
→ commit
```

A function task is done only when the requested acceptance class is achieved.

If exact output requires inline assembly, report `HYBRID_C exact` rather than calling the task
matching C.

## Parallel Work

Use ordinary Git branches/worktrees.

Each worker owns one target at a time, verifies against its current base, commits a small result,
then integrates onto the newest canonical branch. Re-run normal verification after integration.

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
