# func_001ADD4C: group-display-loop-address-order

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `B6409A2EF2660722DFF29BC9B65ACF5D4C4BE1D796E40130A8C651DDDA8BFA79`
- Observation: `0854B2E4DBB64D1CCDADF87681243F63733D68B937DB75C9A130189716880AC3`
- Source: [exact C](../archive/matching-c-candidates/2026-11-25-func_001ADD4C-b6409a2ef2.c)
- Metadata: [curated observation](func_001ADD4C-b6409a2ef2.observation.json)

Only the two source registers of the ADDU at ROM 0x1ADF60 differ in the control.

## Source context

The group display scans five member slots after loading its resources.

The control binds a pointer to the loop data before calculating the group address. The integrated source indexes the member field directly.

## Recorded observation

The control emits 892 text bytes. Against retail, 1 instruction words differ after resolving the native relocations; the first is at ROM 0x001ADF60.

## Remaining failure

Only the two source registers of the ADDU at ROM 0x1ADF60 differ in the control.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_001ADD4C --source docs/archive/matching-c-candidates/2026-11-25-func_001ADD4C-b6409a2ef2.c`. Check the metadata's expanded/header identities before interpreting its dumps.
