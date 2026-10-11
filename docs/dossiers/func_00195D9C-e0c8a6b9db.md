# func_00195D9C: Separate real presence-path definitions allow phase guard to create the missing compiler slot

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `E0C8A6B9DB3F64FB62BB7BDBBE7B5D7388BBA177FED0536AC467764DA1A578D9`
- Observation: `2E273EA73871796D85766A1574264B7FC1FA9D20DF5A574995DA3889163D79FA`
- Source: [exact C](../archive/matching-c-candidates/2026-10-11-func_00195D9C-e0c8a6b9db.c)
- Metadata: [curated observation](func_00195D9C-e0c8a6b9db.observation.json)

Historical private effect example: separate real count definitions and the joined phase guard create the compiler slot; the named-entry single-definition counterexample remains in the authored record. Preserve its original symbolic-object context. Later complete D9C acceptance is independently bound to source commit43119554/CURRENT A913A384 and does not promote this inexact intermediate.

## Source context

D9C best186B27EC/3360192A is PURE_C780/frame48 with all nonrelocated words outside18 frame fields and all six table addends recovered. Earlier D93 count-guard spill puts count-zero in the capacity delay slot, conflicting with retail. The complete780-byte body and24-byte coupled table stay in scope.

Initialize the actual construction count separately on the preset0-or-preset1 path and the preset2 path, joining at construction_entry. Initialize actual phase to0 in the join and use phase<capacity for the existing empty-capacity guard before the unchanged indexed phase loop. Since capacity consumes a u16 and phase is initially0, the guard preserves the observed machine behavior. No padding, artificial later reader or dummy operation is added.

## Recorded observation

CandidateE0C8A6B9 emits PURE_C784/frame56, with counter-zero in the preset bne delay70 and phase-zero in the capacity beq delay84. Probe979964BF proves FLOW78 phase84=0;81 p101=lt(phase84,capacity82);82 branch. COMBINE parks USE698(p101) at the joined label and keeps phase-zero as81. GREG homes USE698 at sp+20, yielding vars8/regs8/args16. The multiple initial count definitions prevent CSE from making the earlier count-zero the guard's class head. This is a concrete new mechanism beyond the single-count-definition controls. Follow-up577426BE uses normalized presets and an explicit cursor, giving776/frame56; real successive scalar unions73891A4C preserve primary-to-cursor and secondary-to-tertiary lifetimes. Explicit boolean OR16F626E5 restores780/frame56 and the six retail table addends, but still differs in allocation/scheduling.

## Remaining failure

The original split candidate loses cached preset masks and initializes indexed cursor at buffer+count; its table addends are retail+4. Later780/frame56 OR intermediate16F626E5 has95 raw differences, including24 unresolved text relocations and ordinary register/setup differences. Original indexed output counters67E84490 keep780/frame56 with83 raw differences. ControlE72672A9 keeps the same named joined entry but restores one count-zero definition before the presence test; it reverts to784/frame48 with the original extra slt, so the label alone is insufficient. No new source is selected as best. Neither worse scores nor the recovered slot establish or disprove full matching readiness; all diagnostics remain symbolic-object and no canonical activation or full-ROM acceptance is claimed.

Research role: effect-example; selected emitted best: false.

Replay: `node tools/match.js probe func_00195D9C --source docs/archive/matching-c-candidates/2026-10-11-func_00195D9C-e0c8a6b9db.c`. Check the metadata's expanded/header identities before interpreting its dumps.
