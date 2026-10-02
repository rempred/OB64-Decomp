# Combat W5 and shared-table closure

SilentCrane accepted this changed production state on 2026-10-02 after the single
structural audit and independent final review. All eight completion/controller W5
members pass together: `func_0021824C`, `func_0021840C`, `func_00218B58`,
`func_0021B0A0`, `func_0021B438`, `func_0021B770`, `func_0021B894`, and
`func_002224F4`. Each is `PURE_C`, the sole accepted code owner, with exact placement,
actual relocations, linked bytes, independent fresh compilation and complete-ROM equality.

B438's complete 824-byte C body uses actual individual case bodies and branch-local
signed halves to recover retail allocation. Its 21 text and 120 table relocations
match. B894's accepted source and 44-byte table remain unchanged. The shared rows
retain their original boundaries, load mappings and whole original ASM fallbacks:

| Original row | Accepted ordered contributions |
|---|---|
| `table_00229ab0` / row4156 | 240 ASM + 240 B438 C + 240 B438 C + 44 B894 C + 4 ASM |
| `table_00239ec0` / row4248 | 40 B06C C + 64 ASM + 32 EF50 C + 1112 ASM |

B06C's complete 392-byte body has 18 text and 10 table relocations. EF50's complete
876-byte body has 29 text and seven table relocations; direct selection-arm
publication replaces the archived opaque OR/AND expressions. Its table contains
28 entry bytes and four genuine native alignment bytes. F580's 12-byte initializer
at z64 `[0x00239F44,0x00239F50)` remains exact across those four C alignment bytes
and eight retained ASM bytes; later dispatch tables remain preserved. The retained
objects are sole read-only owners. Both current partitions pass focused coverage
controls, including rejection of ten invalid ownership cases. No tooling changed.

Audit PASS: `2026-10-02T06:11:09.912Z`. CURRENT fingerprint:
`4A8EFA0DF8F052A344844035E322A414A17BD19901C4EB34E0659397930ADBCF`.
The 41,943,040-byte baseline and CURRENT ROMs retain SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
Ignored `build/sol-five-family/combat-table-closure-final-evidence.json`, SHA-256
`3F825B18C8BA47682DA12585F2CF3396BB1F51CE3CFCC56C964B02D5DBF929E1`,
binds all eight W5 gates, the table contribution/relocation proofs, 1469 canonical
input identities and the independently reviewed reports: audit `FF5268E3...9409DC1`,
verification `1929AA6F...96A7729`, fresh compilation `A1879EC0...9B931A`.
Inputs and reports remained unchanged through final Director acceptance; no verifier
was repeated for review or commit. Generated reports own changing counts.

The table-specific hold on the twelve W6 donors is released for ordinary matching
continuation. Historical donor exactness requires current proof. B06C/EF50's accepted
structural partition does not complete the seventeen-member W6: B1F4/D14C remain
nonexact and F2BC's `D_801CE8F8` linkage prerequisite remains open. A later D14C C table
must replace the retained 64-byte interval with applicable structural approval,
audit and review. Protected/later interfaces, selector runtime provenance and
the broader five-family obligations remain open. This decision authorizes no push.
