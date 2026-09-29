# func_001FFE80: early-duplicate-copy-collapses-in-first-cse

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `3E31ABB9B38A0761FBA00567F9A87FF847EB1D4D7F6C1E976F9FBD31A83D1E0D`
- Observation: `60970D9BD5B15122CB0FBBC02E9A142A4D96AA8D4580AB033782CEF077D0B2BE`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_001FFE80-3e31abb9b3.c)
- Metadata: [curated observation](func_001FFE80-3e31abb9b3.observation.json)

First CSE folds the pre-sum duplicate assignment and loses the copy

## Source context

The 796-byte F2 PURE_C candidate retains the original-position copy only when the copy follows the signed sum and the sum guard has a late join. This bounded trial instead defines the same copy in two frame-controlled arms before the sum.

Assign the original position to temp_a2_122 in both arms of a condition on the already loaded frame before computing the signed position-plus-offset sum; retain the F2 late sum guard.

## Recorded observation

Current-run workbench watch classified PURE_C and compiled a 792-byte owner (198 instructions), missing one instruction relative to the 796-byte retail owner. Authenticated compiler probes show two a2 copies and their condition in the jump dump, but the first CSE dump has already folded the arms to one a2 copy before the sum. The later object again lacks the needed move. This refutes the proposed pre-sum identical-arm lifetime barrier for this candidate.

## Remaining failure

The source is not an exact linked candidate and cannot be accepted as matching C. The F2 parent retains the best observed owner length and relocation match with a six-word linked residual.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_001FFE80 --source docs/archive/matching-c-candidates/2026-09-29-func_001FFE80-3e31abb9b3.c`. Check the metadata's expanded/header identities before interpreting its dumps.
