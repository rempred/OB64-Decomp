# resource_realloc: realloc-fold-endpoints

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `D7CEC3971C08ECDA74D42AF4EBBC8E1C648BF6AD8DBC4D2D1D23773331784F54`
- Observation: `57FB89AA082B3392474154492D9DAF0EA690FA251344E0C158CBB27A4BE3ED82`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_realloc-d7cec3971c.c)
- Metadata: [curated observation](resource_realloc-d7cec3971c.observation.json)

Complete resource trees wave source evidence; private diagnostics are not matching acceptance.

## Source context

Same full realloc, original accesses and helper body.

Fold the real endpoint expressions directly into availability stores.

## Recorded observation

Leaves exactly two nonrelocation words: mask constant and old-size load at0x13C/0x140 are swapped.

## Remaining failure

Two adjacent instructions still differ; supported probes retain scheduler evidence.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe resource_realloc --source docs/archive/matching-c-candidates/2026-10-05-resource_realloc-d7cec3971c.c`. Check the metadata's expanded/header identities before interpreting its dumps.
