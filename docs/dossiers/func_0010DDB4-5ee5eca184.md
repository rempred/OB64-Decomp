# func_0010DDB4: DDB4 baseline: real return handle, pointer-word dependence and late negative-offset fold

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `5EE5ECA1841C9DBBDEC9DA7522F272276478C94437DF1BDD5338FD33981E9D31`
- Observation: `D0343EF04335DB55F6F936D367539E25F2AB5DCF6E87FE6D53D47730E1352C25`
- Source: [exact C](../archive/matching-c-candidates/2026-10-15-func_0010DDB4-5ee5eca184.c)
- Metadata: [curated observation](func_0010DDB4-5ee5eca184.observation.json)

Bounded Q6 compiler source pair; recorded native context and limitations remain explicit. Canonical acceptance is separate.

## Source context

The same function already has exact case02 and case2D instruction ordering; the remaining frame and case15 scheduling differ.

Keep the actual case02 helper return handle, the existing four-byte pointer-word view, and the two-stage unsigned negative offset: in-place shift, negate, then base minus negative offset. These operate on real consumed values and introduce no extra storage or fake pressure.

## Recorded observation

The indexed halfword MEM/s and fixed existing pointer-word MEM/s retain the F500 dependency while allowing the message halfword store to move. The separate NEG/MINUS survives CSE, then COMBINE cancels it to base-plus-index using the original pseudo. Case2D reaches96/96 diagnostic skeleton words; frame remains152.

## Remaining failure

Frame must still reach168 and case15 must regain retail scheduling/register roles. This source is a compiler counterpoint, not a linked/full-ROM acceptance claim.

Research role: pair-baseline; selected emitted best: false.

Replay: `node tools/match.js probe func_0010DDB4 --source docs/archive/matching-c-candidates/2026-10-15-func_0010DDB4-5ee5eca184.c`. Check the metadata's expanded/header identities before interpreting its dumps.
