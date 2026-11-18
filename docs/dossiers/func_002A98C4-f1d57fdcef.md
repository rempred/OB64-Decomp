# func_002A98C4: pose-query-tests-decoder-low-byte

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `F1D57FDCEF69B3CF32186F9DF4EF90D262DB42140960CB3DA10095F349637AEF`
- Observation: `E0F74557160A58627FA4EECEC0C0BFFE346C41CAA1C336C72F61DF187C40C871`
- Source: [exact C](../archive/matching-c-candidates/2026-11-18-func_002A98C4-f1d57fdcef.c)
- Metadata: [curated observation](func_002A98C4-f1d57fdcef.observation.json)

Preserve the word-test counterexample for decoder result masking. The query and decoder retain their respective word return types.

## Source context

Complete word-returning pose query uses the established word-returning decoder. The control compares all three decoder results as full words.

Narrow each decoder result to u8 at its token test, while preserving both callable interfaces.

## Recorded observation

The word-test control keeps the folded scene lookup and emits 260 bytes. At ROM 2A9914 it copies v0 directly into v1 instead of masking the low byte. The three explicit token casts produce the full 268-byte retail extent and all five relocations.

## Remaining failure

The control changes the token semantics and omits the retail masks.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_002A98C4 --source docs/archive/matching-c-candidates/2026-11-18-func_002A98C4-f1d57fdcef.c`. Check the metadata's expanded/header identities before interpreting its dumps.
