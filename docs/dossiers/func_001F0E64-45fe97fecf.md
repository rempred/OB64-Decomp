# func_001F0E64: bound-removal

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `45FE97FECF31A50B49B53621E0F45244A53FC3A63322DAF8A1B1B04D40F7FB95`
- Observation: `489891CC12E5EB14B3910C039BBCDEB9365DD3115CB854432F1748108220152B`
- Source: [exact C](../archive/matching-c-candidates/2026-09-09-func_001F0E64-45fe97fecf.c)
- Metadata: [curated observation](func_001F0E64-45fe97fecf.observation.json)

0E64 exact full-width source and binding-removal control; whole supplement remains pending.

## Source context

Single-binding removal control for the full-width working-selector source. It is compared with the exact hybrid context and the separate near-exact pure reference; no direct ancestry to the near-exact halfword source is asserted.

Remove the one register16 binding from the otherwise retained full-width working-selector implementation.

## Recorded observation

PURE_C; private248 bytes/frame32,24 differing bytes/16 words,5 candidate relocations. The source keeps the complete input domain and all C computations.

## Remaining failure

Nonexact allocation/bytes remain. This establishes necessity of the binding in this tested context, not a universal impossibility of pure C.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_001F0E64 --source docs/archive/matching-c-candidates/2026-09-09-func_001F0E64-45fe97fecf.c`. Check the metadata's expanded/header identities before interpreting its dumps.
