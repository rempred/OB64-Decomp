# func_0022D14C: branch-local-real-result-removes-equivalence-but-keeps-cursor-and-adds-delay-slot-diffs

Preservation does not change current source ownership or establish matching acceptance.

- Candidate: `B4BA17E5DA766F246D9FD86AA1BCE46421EBEC2600231D75B5948FE0F587B7F2`
- Observation: `907E7FFC136E69324C15487CC3A118C027C402FE064BA4C1B78E0E06FBE0D69C`
- Source: [exact C](../archive/matching-c-candidates/2026-10-10-func_0022D14C-b4ba17e5da.c)
- Metadata: [curated observation](func_0022D14C-b4ba17e5da.observation.json)

Real result timing changes reuse and delay-slot scheduling while all allocation choices remain best-identical.

## Source context

Complete17 W6 under unchanged accepted W8 CURRENT7ED689CD. Astra2148 released observational reload diagnostic cd40f851 after independent review and parity; Gold2150 withdrew retail-history restrictions. Candidate traces cannot reconstruct retail.

Move the existing sp1E4 = temp_v0_1409 assignment from before the mode3 result test into its nonzero consumer arm. The zero arm retains the per-iteration sp1E4=0 initialization. No extra operation, call, guard, ABI argument or assembler mechanism.

## Recorded observation

B4BA17E5 is PURE_C6844/frame616/177 textR/131 calls with unchanged actual text relocations and64-byte table. It has71 masked differences: the original68 plus a three-word rotation at1428/142C/1430 moving the V0->484(sp) store out of the branch delay slot. NativeB5E56E29. Reviewed candidate observer focused-ovCo2s passes pinned/off/on whole-native parity, matches workbench text hash, and authenticates source850E8BFE/expandedDEA61775. All121 allocation descriptor/assigned-register/cursor sequences equal the best despite removing its UID3456 V0 equivalence event (8->7 successes);4 inheritance and0 failures/retries persist. Metadata allocation85 UID3468 still selectsT4 with cursor0->1. Eliminating this equivalence query alone neither advances nor resets the cursor.

## Remaining failure

Unselected scheduling regression; retain718B best68. This counterexample closes only branch-local timing of this real result assignment, not other earlier-history or late-transformation source hypotheses. No canonical activation, linked acceptance or full-wave gate.

Research role: counterexample; selected emitted best: false.

Replay: `node tools/match.js probe func_0022D14C --source docs/archive/matching-c-candidates/2026-10-10-func_0022D14C-b4ba17e5da.c`. Check the metadata's expanded/header identities before interpreting its dumps.
