# resource_realloc: realloc-endpoint-locals

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `5E478AEE2D7768F7DE62E37BED522056474E570C98B83C7D8957D7AA6F0D9060`
- Observation: `5EF5888317A5AB8EAEACD3124F64106483D6FC89203630F4EAB212695D469E3A`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_realloc-5e478aee2d.c)
- Metadata: [curated observation](resource_realloc-5e478aee2d.observation.json)

Complete resource trees wave source evidence; private diagnostics are not matching acceptance.

## Source context

Full780+152 owner, original free/copy/resize paths, accepted ArenaNode types.

Initial readable reconstruction uses one named endpoint local in the three availability stores.

## Recorded observation

Complete932-byte census;13 nonrelocation word differences, largely endpoint allocation and mask/load schedule.

## Remaining failure

Nonmatching bytes remain.

Research role: pair-baseline; selected emitted best: false.

Replay: `node tools/match.js probe resource_realloc --source docs/archive/matching-c-candidates/2026-10-05-resource_realloc-5e478aee2d.c`. Check the metadata's expanded/header identities before interpreting its dumps.
