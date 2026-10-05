# resource_free: free-pointer-boundary

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `0CC339A223EE94642A5BDE2214C4B68CC786EFB19EB9B2F029B915FB3A8E6E19`
- Observation: `7C69C820C826349FCFF18D19BBC312CE8B6EA31D11F1CAA6190560D99B10BB9B`
- Source: [exact C](../archive/matching-c-candidates/2026-10-05-resource_free-0cc339a223.c)
- Metadata: [curated observation](resource_free-0cc339a223.observation.json)

Complete arena wave: source-bound compiler experiment; see authored observation for measured effect and remaining gates.

## Source context

Complete resource_free physical owner compiled under the pinned native toolchain. Evidence from free-watch-4.json is symbolic-object diagnostic evidence because the original ASM owner remains active.

Express the used-region endpoint as a byte pointer: (u8*)node + (node->used +32), then subtract its address from next.

## Recorded observation

The ADDU at0xA0 uses node as the first operand, preserving the complete296-byte extent; all bytes agree outside unresolved relocations.

## Remaining failure

Actual external bindings, sole C ownership, placement, exact linked target bytes and one complete seven-owner full-ROM verifier remain required.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe resource_free --source docs/archive/matching-c-candidates/2026-10-05-resource_free-0cc339a223.c`. Check the metadata's expanded/header identities before interpreting its dumps.
