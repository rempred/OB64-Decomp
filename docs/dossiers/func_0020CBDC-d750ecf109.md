# func_0020CBDC: conditional-cursor-step

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `D750ECF1091D2474F0EAC83F9CEA179E0A1C4C995F812CE02123C2366E17B4E8`
- Observation: `7C494B16C1BD94595F0A926B9C0B0D125F3F016631240F59F5BBFA73779CC048`
- Source: [exact C](../archive/matching-c-candidates/2026-09-09-func_0020CBDC-d750ecf109.c)
- Metadata: [curated observation](func_0020CBDC-d750ecf109.observation.json)

Measured cursor-update pair: useful allocation recovery through a worse intermediate; not matching acceptance.

## Source context

CBDC loop source pair. Complete source retained; this measured allocation improvement remains an intermediate with a worse score. Compiler-source reasoning supplied the hypothesis but does not prove pass-level identities.

Move the single common slot-cursor update into each real mode branch; each executed path still advances once. Retain the common table and count updates.

## Recorded observation

Private PURE_C result: 2184 bytes/frame 80, 1346 differing bytes/412 words, 81 candidate relocations. Removes the extra derived secondary-slot pointer and recovers retail s0 through s8 loop roles, including constant 2 in s8, despite a worse aggregate score. Branch fallthrough/frame/layout remain nonexact.

## Remaining failure

Target remains nonexact with wrong extent, loop allocation and instruction-order differences. No canonical ownership or completed-wave acceptance. This is a candidate-specific pair, not a general source rule.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe func_0020CBDC --source docs/archive/matching-c-candidates/2026-09-09-func_0020CBDC-d750ecf109.c`. Check the metadata's expanded/header identities before interpreting its dumps.
