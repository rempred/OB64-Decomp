# Wave 7 evidence index

## Status and result

Status: evidence package complete and review-pending. Every material worker
claim points to a canonical record or external report. This matters because the
Director can intake the result without reconstructing the build history. The
Director must route Critical review; no action is required from Joe.

| Material claim | Evidence artifact | Verification method | Grade and review |
|---|---|---|---|
| The selected owner satisfies the Wave 7 size and control-path gates. | `target-selection.md` | Parent function database, symbol database, dossier, and canonical assembly | Supported; pending |
| The owner boundary covers exactly 1,508 bytes. | `target-selection.md`; `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | Predecessor, successor, secondary, and tail-entry checks | Supported; pending |
| The owner placement is `.ob64.r0056` at `0x80075BC0`. | `config/phase8/matching-c.json`; Root A verification report | Phase 8 target and map placement | Supported; pending |
| The target text is exact. | Root A and Root B `verification.json` | Phase 8 target text hash and asm-differ | Supported; pending |
| The target contains no unexpected relocations. | Root A and Root B `build-report.json` | Target relocation array and object contract | Supported; pending |
| Earlier owners remain byte-exact. | Root A and Root B `verification.json` | `acceptedRowsPreserved: 7242`; `acceptedSlicesPreserved: 7251` | Supported; pending |
| The full ROM and code region remain exact. | Root A and Root B `verification.json`; setup report | ROM and code-region SHA-256 checks | Supported; pending |
| The two builds are path-independent. | `run-a4/conventional/reproducibility.json` | `reportsIdentical: true` | Supported; pending |
| The setup inputs and tools are authenticated. | `reproduction-procedure.md`; `build/setup/verify-setup-report.json` | Accepted setup command and recorded hashes | Supported; pending |
| The semantic C derivation is independently recorded. | `src/boot/boot_state_dispatch_loop_init.c`; `independent-derivation.md` | Structural model cross-checked against canonical assembly | Supported; pending; layout-anchor limitation disclosed |

## Final identities

| Artifact | Path | SHA-256 |
|---|---|---|
| C source | `src/boot/boot_state_dispatch_loop_init.c` | `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999` |
| Matching-C config | `config/phase8/matching-c.json` | `855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444` |
| Original assembly | `asm/original/rev0/boot/boot_state_dispatch_loop_init.s` | `92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2` |
| Setup report | `build/setup/verify-setup-report.json` | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |
| Root A build report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\build-report.json` | `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2` |
| Root B build report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional\build-report.json` | `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2` |
| Verification report | Both final roots `verification.json` | `334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B` |
| Reproducibility report | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional\reproducibility.json` | `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26` |

## Changed canonical surfaces

| Surface | Purpose | Generated output status |
|---|---|---|
| `src/boot/boot_state_dispatch_loop_init.c` | C model and exact emitted owner layout | Tracked source only |
| `config/phase8/matching-c.json` | One target contract for row `56` | Tracked configuration |
| `docs/matching-c/high-value-wave7-20260802/` | Selection, derivation, procedure, log, index, and AAR | Markdown evidence only |

No ROM, object, ELF, map, report, or bulk generated artifact was added to the
canonical evidence root. Generated outputs remain under the external Wave 7
root. The worker left all changes uncommitted and left all remotes untouched.

## Review handoff

The result is `Supported` before review. Independent Critical review remains
`pending`. The reviewer must assess the static-inline C model and the disclosed
exact-layout anchor against the maintainable-C requirement.

The worker AAR is [20260802-ob64-matching-c-high-value-wave7-aar.md](aar/20260802-ob64-matching-c-high-value-wave7-aar.md).
