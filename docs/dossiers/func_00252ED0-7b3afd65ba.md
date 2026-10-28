# func_00252ED0: da10-caller-consumes-preserved-object-return

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `7B3AFD65BAEAE546228AD28B9C9B42C101D7C082A956930505E6C18AF0C66D12`
- Observation: `69122D45CDFE78A23DE130B0CFBCC126C906A1EC7A7599A007C16A8E46E22FA9`
- Source: [exact C](../archive/matching-c-candidates/2026-10-28-func_00252ED0-7b3afd65ba.c)
- Metadata: [curated observation](func_00252ED0-7b3afd65ba.observation.json)

P01 source-bound observation for da10-caller-consumes-preserved-object-return. Preserve the exact source pair and context; private diagnostics do not establish canonical acceptance.

## Source context

Original52ED0 stores -300/-400 at returned V0+0x0C at ROM253034/253048 after calls toDA10. Tracked legacy HYBRID_C DA10 declares void and ignores its final legacy func_001F85C0 return. That legacy symbol is bound to RAM801F85C0, the accepted physical mapping of ROM func_0024D180; D180 tail atROM24D404 explicitly returns s0-0x1C. The private52ED0 source represents only the returned pointer and uncertain offset0C field and is PURE_C500 with rawRelocationMaskedExact=true. This records the pre-integration producer context; the referenced DA10/E490 snapshots retain the exact bytes displaced by the approved interface correction. Original observation359B94503AF258F4FD35412DA24D117968234010B21D43822623B7B02E5CF084 is historical and fails current-reference authentication after that correction.

Required integration reconciliation, approved through the current native Director route: production writer may correct DA10 return/body and compatible declarations, including the legacy callee declaration in E490 and P01 callers that ignore the return. Preserve DA10 u32 first-argument ABI, accepted bytes, relocations and source classes. Do not broaden object meaning or convert DA10/E490 toPURE_C under P01; their full conversion remains E08.

## Recorded observation

The caller's actual return use and the mapped producer's explicit return establish the incomplete C interface. No canonical input has changed. Director authorized this narrow ordinary dependency correction during the whole-P01 drained integration; focused checks cover all affected producers, followed by the one P01 complete-wave verifier.

## Remaining failure

Production writer still must perform the approved interface correction and focused checks. P01 private symbolic-object evidence is not canonical acceptance.

Research role: emitted-best; selected emitted best: true.

Replay: `node tools/match.js probe func_00252ED0 --source docs/archive/matching-c-candidates/2026-10-28-func_00252ED0-7b3afd65ba.c`. Check the metadata's expanded/header identities before interpreting its dumps.
