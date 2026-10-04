# func_0022D14C: Direct count guard loses a compiler comparison spill slot

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `EBAF8896CFD2E021090FC8D625032532692B0CDC435193FD239899F73B34555A`
- Observation: `5879586B5266B0BDC4AD43A2F8CC3EBB0D4317ED32B2C2AB6B6FC95809A7AD8B`
- Source: [exact C](../archive/matching-c-candidates/2026-10-04-func_0022D14C-ebaf8896cf.c)
- Metadata: [curated observation](func_0022D14C-ebaf8896cf.observation.json)

Measured ordinary C lifetime research; nonexact, canonical ASM retained

## Source context

Sol owns all D14C regions/private solmode. Corrected single output stride and original capacities/interfaces retained. Canonical ASM/table and accepted inputs unchanged; no full-ROM verifier or audit run.

Place actual main setup inside count>0 and use a do/while for the original body; retain source reads, calls and loop updates.

## Recorded observation

SourceDD5CAF1F/candidateEBAF8896 restores all23 main setup forms and6844-byte extent/177 relocations/131 ordered calls, but frame is608 versusretail616. Fresh authenticated probeB3A3BF41 compared with21823F67: original entry comparison993 becomes USE4632 and stack540 in GREG; direct count guard lacks this USE. All original real spilled variables76..96 remain, so this is not loss of a required body field. Five versus six USE-only comparison pseudos remain. Guarded-whileC82AAC2F keeps the608 frame and adds two redundant predicate instructions, so is unselected.

## Remaining failure

Frame608 and shifted compiler spill offsets remain nonexact. Source comparison lifetime, not a missing required body or tooling defect. No linked/ROM/whole-best/wave acceptance.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0022D14C --source docs/archive/matching-c-candidates/2026-10-04-func_0022D14C-ebaf8896cf.c`. Check the metadata's expanded/header identities before interpreting its dumps.
