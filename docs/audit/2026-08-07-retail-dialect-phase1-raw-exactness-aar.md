# Retail dialect Phase 1 raw-exactness AAR

Completed. Phase 1 now prevents alias-equivalent machine-code differences from reporting `EXACT`. This protects later dialect work from false matches. The Director must freeze the result and route independent review before starting Phase 2.

Review status: `pending`.

## Outcome and scope

The worker completed the assigned raw-exactness correction. No C source, target metadata, placement, relocation contract, tool identity, source-policy rule, or queue state changed.

The corrected path compares one final linked ELF section against canonical baserom bytes. It validates section shape, runtime placement, and z64 ROM load placement.

Asm-differ remains an independent diagnostic. A zero score is necessary but no longer sufficient for `EXACT`.

## Claims and evidence grades

| Claim | Grade | Review |
|---|---|---|
| Zero-score alias differences cannot report `EXACT` | `Verified` | `pending` |
| Malformed or wrongly placed target sections fail closed | `Verified` | `pending` |
| Relocated targets use final linked bytes | `Verified` | `pending` |
| All 36 active owners remain exact | `Verified` | `pending` |
| The complete retail ROM remains exact | `Verified` | `pending` |

The evidence index contains artifact hashes and exact commands:

`docs/audit/2026-08-07-retail-dialect-phase1-raw-exactness-evidence.md`

## Changed surfaces

- `tools/lib/phase8_matching_c.js`
- `tools/diff.js`
- `tests/diff_exactness.js`
- `tests/fixtures/diff-exactness/move-alias.json`
- `tests/phase8_matching_c.js`
- `docs/WORKFLOW.md`
- `tests/README.md`
- `docs/Plans/task-logs/ob64-retail-dialect-phase1-r1-1ec4be4cc4e94a72a72736794da9f572.claim.json`
- `docs/Plans/task-logs/ob64-retail-dialect-phase1-r1-1ec4be4cc4e94a72a72736794da9f572.md`
- `docs/audit/2026-08-07-retail-dialect-phase1-raw-exactness-evidence.md`
- `docs/audit/2026-08-07-retail-dialect-phase1-raw-exactness-aar.md`

All changes remain uncommitted for Director intake.

## Verification summary

`node tests/diff_exactness.js` passed. It proved the combined exactness rule and fifteen fail-closed mutations.

The preserved pure p3063 proof has asm score `0 / 16100`. The corrected result reports fourteen differing bytes and `exact: false`.

`node tools/diff.js func_0002CD70` passed. It preserved the accepted exact `HYBRID_C` result and target hash.

`node tools/verify.js` passed all strict gates. It verified 36 active owners and the complete retail ROM.

The final ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

The focused Phase 8, workflow-acceptance, and active-target tests passed. Syntax checks and scoped whitespace checks passed.

## Failed paths and limits

The first malformed-range test reached the new load-placement guard before the byte-range guard. The fixture then preserved coherent load metadata and proved the byte-range rejection.

An initial read-only lookup used a current-build path without asm-differ proof files. The preserved diff output supplied the authenticated proof.

Neither failed path changed repository state or weakened a gate.

This phase did not implement the dialect adapter. It did not remove p3063's local macro.

## Worker self-check

A read-only helper found two gaps before handoff. The comparator lacked explicit load-header validation, and score validation accepted malformed values.

The worker added both checks. New hostile fixtures cover wrong ROM load placement, wrong load size, malformed rows, fractional scores, and out-of-range scores.

This self-check is not independent acceptance.

## Protocol deviations

None.

The Director confirmed the Phase 1 prompt and Director claim as expected coordination additions after the recorded dirty fingerprint.

## Canonical-document changes

`docs/WORKFLOW.md` now defines raw linked-byte exactness for the diff command. No further canonical-document change is proposed in Phase 1.

## Next action

The Director must inspect attribution and create the Phase 1 result commit. An independent reviewer must then evaluate the frozen commit.

Phase 2 must not start until the Director accepts that review. The function queue must remain paused.
