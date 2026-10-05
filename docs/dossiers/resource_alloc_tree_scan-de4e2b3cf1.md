# resource_alloc_tree_scan: scan-miss-count

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `DE4E2B3CF1BEA5F84F68F2A1430ABE0F4A19C7A8A951807DB41F5DDD558F5328`
- Observation: `6A0C154CD9CEEFC613E99E685DD92F55180D93FBF16831F0E5299D6938193BD3`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_alloc_tree_scan-de4e2b3cf1.c)
- Metadata: [curated observation](resource_alloc_tree_scan-de4e2b3cf1.observation.json)

Complete resource trees wave source evidence; private diagnostics are not matching acceptance.

## Source context

Full scan with separate aligned-size local and complete traversal body.

Keep scanned increment on the miss path.

## Recorded observation

Restores exact extent and control/operation order; only aligned size and iteration count saved registers remain swapped (12 nonrelocation words).

## Remaining failure

Saved-register permutation remains nonmatching.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe resource_alloc_tree_scan --source docs/archive/matching-c-candidates/2026-10-05-resource_alloc_tree_scan-de4e2b3cf1.c`. Check the metadata's expanded/header identities before interpreting its dumps.
