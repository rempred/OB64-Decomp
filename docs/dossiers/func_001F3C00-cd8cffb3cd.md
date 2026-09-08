# func_001F3C00: r7-int-local

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `CD8CFFB3CD5811164BE045B7B09C78FC2D2BEB76B071AB0A0579B1BE623D9E93`
- Observation: `9934A8D358A7966E26E06D07248D98C26A16BE5B7D76A05614BA97E62D0DE867`
- Source: [exact C](../archive/matching-c-candidates/2026-09-08-func_001F3C00-cd8cffb3cd.c)
- Metadata: [curated observation](func_001F3C00-cd8cffb3cd.observation.json)

Reusable exact source context for the bounded R7 pair and D037 transfer study.

## Source context

Same R7 E1/P1/T0 integer endpoint context as r7-int-shared; this exact pair differs only in outer completion declarations/store placement.

Move three outer size locals and their final second-word store into the optional/primary branches; keep integer endpoint.

## Recorded observation

Frozen trace: frame504 and29 accessed homes; integer endpoint927 has no home. Localization permits integer endpoint without the baseline spill in this source context.

## Remaining failure

Extent6716 and nonexact allocation/bytes; no current-best selection or general source recipe.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe func_001F3C00 --source docs/archive/matching-c-candidates/2026-09-08-func_001F3C00-cd8cffb3cd.c`. Check the metadata's expanded/header identities before interpreting its dumps.
