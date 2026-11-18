# func_00289780: chapter-render-clipped-x-control

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `ACF8DDE5EFF1A298984691BEFE7871173105BF17595BD7F86E8484AE8A04090E`
- Observation: `01E8DBC370CCBBF5CAD24C867B66DAB40533A311BA87EB9CD0C995A1A903373F`
- Source: [exact C](../archive/matching-c-candidates/2026-11-18-func_00289780-acf8dde5ef.c)
- Metadata: [curated observation](func_00289780-acf8dde5ef.observation.json)

Clipped X operand order control

## Source context

The selector 1073 renderer packs clipped signed fixed-point X into the upper part of the texture rectangle word.

Use the shared E300 command scalar for E100 and order the independent cursor address assignments as in the original. Retain the combined clipped-X and Y expression.

## Recorded observation

The 1,412-byte body has one projected word difference at +0x3e8. KMC emits and v1,v1,t1 where retail uses and v1,t1,v1. The canonical source stages mask, shift and Y pack in the clipped-X scalar.

## Remaining failure

The bitwise AND operands remain reversed in the emitted rectangle pack.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_00289780 --source docs/archive/matching-c-candidates/2026-11-18-func_00289780-acf8dde5ef.c`. Check the metadata's expanded/header identities before interpreting its dumps.
