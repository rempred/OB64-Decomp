# resource_alloc_tree_scan: scan-positive-guard

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `94E010132EE2A778B99D5E6FF6AF3028C817D1402208B319A011DA3D4C512A05`
- Observation: `A974475BDBC84893CD65DB49EC9802AC119A63CF8F53629843028C9060F4979A`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_alloc_tree_scan-94e010132e.c)
- Metadata: [curated observation](resource_alloc_tree_scan-94e010132e.observation.json)

Complete resource trees wave source evidence; private diagnostics are not matching acceptance.

## Source context

Outer aligned-size guard is byte-neutral relative to scan-miss-count.

Test iterations>0 instead of the real scanned<iterations entry comparison.

## Recorded observation

Loses the comparison home and reduces frame48 to40; complete684-byte extent remains, but original stack offsets differ.

## Remaining failure

Not selected; this does not disprove the overall loop structure.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe resource_alloc_tree_scan --source docs/archive/matching-c-candidates/2026-10-05-resource_alloc_tree_scan-94e010132e.c`. Check the metadata's expanded/header identities before interpreting its dumps.
