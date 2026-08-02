# Wave 7 evidence index

## Status and result

Status: historical evidence retained; candidate `func_00005FC0` is rejected and withdrawn from active matching C. Every material worker claim points to a canonical record or external report. This matters because the Director can preserve provenance while restoring the accepted seven-owner build. The Director must retain the original assembly fallback and keep proportional Critical review pending; no action is required from Joe.

| Material claim | Evidence artifact | Verification method | Grade and review |
|---|---|---|---|
| Active matching-C status | `config/phase8/matching-c.json`; withdrawal AAR | Seven configured targets remain, and `func_00005FC0` is absent | Rejected; withdrawn |
| The selected owner satisfies the Wave 7 size and control-path gates. | `target-selection.md` | Parent function database, symbol database, dossier, and canonical assembly | Supported; historical; rejected; withdrawn |
| The owner boundary covers exactly 1,508 bytes. | `target-selection.md`; `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | Predecessor, successor, secondary, and tail-entry checks | Supported; historical; rejected; withdrawn |
| The owner placement is `.ob64.r0056` at `0x80075BC0`. | Historical `config/phase8/matching-c.json`; prior Root A report | Phase 8 target and map placement | Supported; historical; rejected; withdrawn |
| The target text is exact. | Prior Root A and Root B `verification.json` | Phase 8 target text hash and asm-differ | Supported; historical; rejected; withdrawn |
| The target contains no unexpected relocations. | Prior Root A and Root B `build-report.json` | Target relocation array and object contract | Supported; historical; rejected; withdrawn |
| Earlier owners remain byte-exact. | Prior Root A and Root B `verification.json` | `acceptedRowsPreserved: 7242`; `acceptedSlicesPreserved: 7251` | Supported; historical; rejected; withdrawn |
| The full ROM and code region remain exact. | Prior Root A and Root B `verification.json`; setup report | ROM and code-region SHA-256 checks | Supported; historical; rejected; withdrawn |
| The two builds are path-independent. | Prior `run-a4/conventional/reproducibility.json` | `reportsIdentical: true` | Supported; historical; rejected; withdrawn |
| The setup inputs and tools are authenticated. | `reproduction-procedure.md`; `build/setup/verify-setup-report.json` | Accepted setup command and recorded hashes | Supported; historical; rejected; withdrawn |
| The semantic C derivation is independently recorded. | Historical `src/boot/boot_state_dispatch_loop_init.c`; `independent-derivation.md` | Structural model cross-checked against canonical assembly | Supported; historical; rejected; withdrawn; layout-anchor failure recorded |

## Final identities

| Artifact | Path | SHA-256 |
|---|---|---|
| Withdrawn C source (historical) | `src/boot/boot_state_dispatch_loop_init.c` | `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999` |
| Withdrawn matching-C config (historical) | `config/phase8/matching-c.json` | `855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444` |
| Current matching-C config | `config/phase8/matching-c.json` | `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C` |
| Original assembly | `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | `92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2` |
| Setup report | `build/setup/verify-setup-report.json` | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Historical candidate Root A build report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\build-report.json` | `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2` |
| Historical candidate Root B build report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional\build-report.json` | `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2` |
| Historical candidate verification report | Both historical final roots `verification.json` | `334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B` |
| Historical candidate reproducibility report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\reproducibility.json` | `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26` |
| Withdrawal Root A build report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-rejected-candidate-withdrawal-20260802\run-a\conventional\build-report.json` | `A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E` |
| Withdrawal Root B build report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-rejected-candidate-withdrawal-20260802\run-b\conventional\build-report.json` | `A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E` |
| Withdrawal verification report | Both withdrawal roots `verification.json` | `D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED` |
| Withdrawal reproducibility report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-rejected-candidate-withdrawal-20260802\run-a\conventional\reproducibility.json` | `D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48` |

## Changed canonical surfaces

| Surface | Purpose | Generated output status |
|---|---|---|
| `src/boot/boot_state_dispatch_loop_init.c` | Withdrawn C model and exact emitted owner layout | Removed; original assembly fallback remains |
| `config/phase8/matching-c.json` | Active seven-owner matching-C contracts | Row `56` target removed |
| `docs/matching-c/high-value-wave7-20260802/` | Selection, derivation, procedure, log, index, and AAR | Markdown evidence only |

No ROM, object, ELF, map, report, or bulk generated artifact was added to the
canonical evidence root. Generated outputs remain under the external Wave 7
root. The worker left all changes uncommitted and left all remotes untouched.

## Review handoff

The candidate result is historical `Supported` evidence. Independent Critical
review issued `Revision required`, and the candidate is now rejected and
withdrawn. Proportional Critical review of this withdrawal remains `pending`.

The worker AAR is [20260802-ob64-matching-c-high-value-wave7-aar.md](aar/20260802-ob64-matching-c-high-value-wave7-aar.md).

The withdrawal AAR is [20260802-ob64-matching-c-high-value-wave7-rejected-candidate-withdrawal-aar.md](withdrawal-20260802/aar/20260802-ob64-matching-c-high-value-wave7-rejected-candidate-withdrawal-aar.md).
