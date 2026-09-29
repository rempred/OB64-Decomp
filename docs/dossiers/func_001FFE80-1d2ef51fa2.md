# func_001FFE80: corrected-two-argument-four-word-residual

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `1D2EF51FA26B8F766C430D2297CEF567765BDBF6B5518F09FC8BF027793286A9`
- Observation: `CBC101C74BDAC3D3F0C86F5056162BAE0B4F7AF89B8D88F99BB026DFC3CF9A3A`
- Source: [exact C](../archive/matching-c-candidates/2026-09-29-func_001FFE80-1d2ef51fa2.c)
- Metadata: [curated observation](func_001FFE80-1d2ef51fa2.observation.json)

Corrected two-argument helper interface leaves only the a2/a3 four-word linked residual

## Source context

The prior near matches inherited a four-argument func_001F0E64 declaration from an m2c draft. The accepted callee and two other accepted callers establish a two-argument record/selector interface; the retail FFE80 call only sets a0 and a1. Correcting that interface removes a phantom signed-short argument conversion and exposes a closer pure-C source form.

Declare and call func_001F0E64 with record and u32 selector only; type the preserved original-position local as s16, cast the signed position into it before the separate sum, and order the entry copy, original-position copy, saved offset and sum while retaining the two previously measured compiler-shaping joins.

## Recorded observation

Current-run source policy classified PURE_C. The canonical focused linked diff accepted the 796-byte sole C owner and exact 54-relocation contract. Four linked instruction words/four bytes differ at z64 0x00200028, 0x0020002C, 0x00200048 and 0x00200054: the candidate allocates the entry pointer to a2 and original position to a3, opposite retail. Every other owner word matches. No complete-ROM verifier was run because linked target bytes are nonexact.

## Remaining failure

The a2/a3 allocation swap remains. Moving the reset-base load after the two zero stores fixes register allocation in a scratch compile but changes retail instruction order and introduces a load hazard; moving the entry copy before the guard places its move too early. Neither is an exact replacement. The current production source remains the exact HYBRID_C fallback.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_001FFE80 --source docs/archive/matching-c-candidates/2026-09-29-func_001FFE80-1d2ef51fa2.c`. Check the metadata's expanded/header identities before interpreting its dumps.
