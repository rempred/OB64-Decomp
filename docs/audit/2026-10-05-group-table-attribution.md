# Compilation-group table attribution

Status: accepted after implementation tests, independent review and the changed-input
structural audit. No scheduler owner is activated by this repair.

## Reproduced limitation and approval

Sol and GoldOx explicitly agreed in Agent Mail 1241/1240 on per-payload attribution.
Astra approved the extension after the authenticated THREE-function diagnostic showed
two genuine table-producing members. The saved native object has SHA-256
`E65CDF39057E805C7CE1C408ABC15B68EBBC07DE66356CA1D2CE9784545ADDA2`.
Its 160-byte, 8-aligned read-only section contains two 76-byte tables at offsets 0 and 80,
with four native zero bytes after each. All 38 pointer relocations target the appropriate
member; each table has a reference pair originating in that member.

The single `auxiliary.memberSymbol` contract cannot represent both dispatchers. The approved
remedy requires `memberSymbol` on every `auxiliary.sections` payload and removes the top-level
default. Each payload's destinations and references must belong to its declared member.
Every member claims exactly its attributed subset. Fresh, cached and persisted object proofs
must independently enforce those relationships, including same-member HI16/LO16 pairing.

Native text boundaries, compiler flags/input, relocation anchors/addends, complete partitions,
padding rejection and original zero ownership remain unchanged. No constant-payload mode or
schema-2 group composition is added. The external p2551 double remains viable; hypothetical
original translation-unit boundaries are not established by alignment alone.

The existing `squad_supply_end` migration assigns both of its tables to `func_0012469C` without
changing any expected byte hash. Original zero rows remain ASM contributions. The scheduler
NINE source/interface work and full-wave acceptance remain separate and unfinished.

## Coordination and validation

Sol and Shop confirmed native-command drains in mail 1242/1244 before shared-input mutation.
Sol retains sole production source/config/build ownership. The tooling worker owns the generic
implementation and tests; the independent reviewer remains read-only.

The Director's pre-change snapshot authenticates 6,955 tracked source/configuration inputs and
the actual accepted ROM at CURRENT
`44C2FEA1FA4861B69FF10526AEB5213A8134BA955D9BA64BEF9549F9E23CBC35`.
The ROM SHA-256 is
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Composed member text evidence now uses schema 4, producer object evidence schema 7 and
nested composition evidence schema 2. Ordinary groups and standalone projection retain
their versions. Old singular contracts and composed proofs fail closed; implementation
and registry fingerprints invalidate old CURRENT/cache reuse.

- Real native fixtures cover the original one-member/two-table case and two distinct
  table-producing functions. Native/projected links, fresh source proofs, cache reconstruction
  and retained ASM accounting pass.
- Negatives cover missing/unknown/swapped attribution, incomplete bundles, exact discontiguous
  member subsets, table destinations/references in another member or padding, and stale schemas.
  Rehashed saved proofs still reject A/B/A misattribution, an intervening member's table,
  and cross-owner HI16/LO16 pairs. A genuinely changed PURE_C source remains a nonmatch.
- The required `node tools/test.js` manifest passed **33/33 suites in 139.6 seconds**, exit 0.
  Logs: `build/tests/group-attribution-focused.log` and `group-attribution-routine.log`.
- Independent implementation review found no material findings. Eight additional read-only
  checks inspected an actual native fixture, legacy/missing/unknown/swapped attribution,
  a nonauxiliary member claiming payloads and the exact production metadata migration.
  The reviewer did not recompile or repeat a canonical build.

Sol ran one `node tools/audit.js --profile` on the reviewed inputs, with no preceding full
build or verifier. It passed at `2026-10-05T12:23:09.840Z`. CURRENT is
`5B7C30E53EFD9DF3959BE815AD3ED81F68916C00004B16E40232F7AAF5D941A5`;
baseline remains `1C14E225B1650F78DB175CCF6933B950262A4F848215BC114149ACD3181B061F`.
The actual complete ROM retains the exact retail hash above.

The three accepted supply members remain PURE_C with sole C ownership, exact full owner
bytes and schemas 4/7/2 in verifier and fresh compilation evidence. Both 92-byte tables
retain their expected object/linked hashes and 23 actual pointer relocations each. Original
rows r2573/r2575 remain sole ASM contributions of four/twelve bytes, fully exact; native
padding checks cover four bytes in each. The final text owner's accepted four-byte native
tail is unchanged. Source, function extents, addresses, relocation contracts and byte hashes
did not change.

Director post-change authentication confirmed that among all 6,955 tracked source/configuration
inputs, only the group registry changed. Removing attribution fields from both registry
snapshots leaves identical contracts. Actual proof files match their recorded hashes, and
the new audit and CURRENT verification timestamps cover this change. No unchanged commit
or handoff triggers another build.

The profiled combined run took 1,260.390 seconds: 578.090 seconds ensuring CURRENT,
449.378 seconds verifying its output, and 112.634 seconds for fresh compilation, plus
preparation and structural checks. The complete profile is
`build/verification-profile/audit-20261005120209450-46448.json`.

After the scoped tooling commit, workers refresh affected private context and resume their
existing complete waves. Scheduler producer admission and source blockers remain open;
this repair accepts no new game function or semantic claim.

Ignored evidence: `build/multi-member-table-director-20261005/{before,after,accepted-evidence}.json`,
`build/matching/solsquad/scheduler-three-external-native-r1-{diagnostic,census}.json`,
`build/sol-five-family/group-table-attribution-audit-20261005-evidence.json`, and the audit
log beside that evidence file. Canonical reports are `build/audit/report.json` and
`build/current/{verification,fresh-compilation}.json`.
