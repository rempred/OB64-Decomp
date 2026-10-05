# resource_largest_free_block: largest-early-scan

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `796BB4EF7CB0A173305BAD86BAB04B79834EE939896A80BE2DE7053CE9861CE4`
- Observation: `1C7CBC411526229C18D29AD0AF1DB2BAAFB7A7133E49AA51B2094EF177A4623C`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_largest_free_block-796bb4ef7c.c)
- Metadata: [curated observation](resource_largest_free_block-796bb4ef7c.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Complete resource_largest_free_block physical owner compiled under the pinned native toolchain. Evidence from largest-watch-1.json is symbolic-object diagnostic evidence because the original ASM owner remains active.

Initialize scanned with its declaration before the mode-selection branch; reuse one count variable for selection and modulo.

## Recorded observation

Emits232 bytes but removes the expected eight-byte frame and adds an explicit initial SLT instead of BLEZ; its loop registers differ. Equal size does not establish coverage or bytes.

## Remaining failure

Actual external bindings, sole C ownership, placement, exact linked target bytes and one complete seven-owner full-ROM verifier remain required.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe resource_largest_free_block --source docs/archive/matching-c-candidates/2026-10-05-resource_largest_free_block-796bb4ef7c.c`. Check the metadata's expanded/header identities before interpreting its dumps.
