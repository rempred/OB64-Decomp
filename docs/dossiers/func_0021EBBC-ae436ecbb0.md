# func_0021EBBC: real-counter-storage-and-value-scopes-restore-register-pairs

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `AE436ECBB06D9C8C5280C6233C55227A7985234D803C061EE2CDF4E853C43200`
- Observation: `042E357436EF3D8E248BB300940D73CF9DAEAF80127B8AE3268C9E6D601EE195`
- Source: [exact C](../archive/matching-c-candidates/2026-10-10-func_0021EBBC-ae436ecbb0.c)
- Metadata: [curated observation](func_0021EBBC-ae436ecbb0.observation.json)

Unselected counter pointer/value phase example; actual register pairs and counter block length restored.

## Source context

Complete EBBC private source under03D1204B/E9E49D47; extends aggregate-base E7, selected13DA retained.

Cache each actual counter storage pointer, separate the two branch-local counter values from the later selector, and read the final lookup key once after the side query.

## Recorded observation

AE436ECB/source9C9160BF is PURE_C10240/frame744/203calls/native3E428A61/1054 absolute-offset differences,32 bytes short. Storage pointers1B550 remove eight bytes from the main counter block; lookup-key797E removes four bytes from the nested window. Separating counterValue/counterIndex then restores actual pointerA0/valueV1 pairs in both counter arms. The284-byte main20/31 window has only three differing common-exit branch immediates, with the remaining function32 bytes short; no branch operands were masked as relocations. Nested lookup is152 bytes/23 differences. Explicit side-arm definitions CB903 retain size and reduce two differences but move reset writes after selector/key reads. Current/next cursor21A85 retains a real copy but adds four bytes and rotates caller-register roles. The two opened D14C lessons motivated these real phase/cursor experiments; their original conclusions remain source-bound, not proof of transfer.

## Remaining failure

Unselected because extent regresses versus selected13DA. Remaining questions include ordered existing reset writes, final lookup cursor/key allocation, shared QI membership loads (GoldOx advisory2079), and two2267A8 tail merges. Test an ordered view of the existing resets without adding operations. Native diagnostics do not establish linked/table/ownership/full-ROM or complete-wave acceptance.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe func_0021EBBC --source docs/archive/matching-c-candidates/2026-10-10-func_0021EBBC-ae436ecbb0.c`. Check the metadata's expanded/header identities before interpreting its dumps.
