# func_000bd60c: default-equipment-result-width

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `BB371C7E3B38F98FB17A5AD8AAFD8A75B482E93EDE57C27B8A7C9C374B55911A`
- Observation: `4A898F8703E2CEF1FC1A5DEB68ADAD5A842725BC07F2A8DF45125D93DB7CFC46`
- Source: [exact C](../archive/matching-c-candidates/2026-11-25-func_000bd60c-bb371c7e3b.c)
- Metadata: [curated observation](func_000bd60c-bb371c7e3b.observation.json)

The single word at +0x254 isolates the cost of narrowing the class-equipment result before the common conversion.

## Source context

The preview loop passes a class-equipment callback result through a conditional replacement, then converts the item ID to a halfword. Both sources have a 696-byte text owner.

In this control the inlined default-equipment helper returns u16 directly to the preview selection. The exact source keeps the u32 callback result until the common halfword conversion.

## Recorded observation

With relocation fields masked, the control differs only at text +0x254. KMC emits andi a0,v0,0xffff there. The retail instruction and the full-width result are move a0,v0.

## Remaining failure

The single extra narrowing operation remains in this control.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_000bd60c --source docs/archive/matching-c-candidates/2026-11-25-func_000bd60c-bb371c7e3b.c`. Check the metadata's expanded/header identities before interpreting its dumps.
