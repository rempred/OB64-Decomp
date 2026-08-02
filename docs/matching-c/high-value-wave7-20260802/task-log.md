# Wave 7 task log

| Time | Event | Evidence or result |
|---|---|---|
| 2026-08-02 | Read the parent rules, worker workflow, ready assignment, nested decomp rules, canonical platform docs, build workflow, toolchain, and overlay guidance. | Mission is one matching-C owner; role is worker; inventory profile is `PROTECTED`; parent and integration surfaces are read-only. |
| 2026-08-02 | Recorded authorized repository baselines. | Parent `main` at `ac9c21eb498cfef3009b0df6c62e3bf090f394c5`; canonical decomp `main` at `e153585d7d1cb860d82ea8a905e4831a7b197a7c`; integration `main` at `b22815518f060425519c08df19b617af8b5099a7`. |
| 2026-08-02 | Confirmed the canonical decomp tracked tree was clean before edits. | `git status --short --untracked-files=no` returned no output. |
| 2026-08-02 | Independently screened eligible parent function owners. | `scripts/ob64_functions.json` yielded valid owners between 1,197 and 1,700 bytes; `func_00005FC0` was selected for its permanent boot state-dispatch and task-loop shape. |
| 2026-08-02 | Inspected the canonical target assembly and boot dossier. | The selected range is z64 `0x00005FC0..0x000065A4`, with local secondary entry `0x00006550` and local leaves at `0x00006588` and `0x00006594`. |
| 2026-08-02 | Created the target-selection record. | `target-selection.md`; review status remains pending. |
| 2026-08-02 | Derived the structural C model from the target assembly, boot dossier, and symbol/access records. | The model names callback pointers, task records, status values, result routing, polling, cleanup, pop, push, high-bit transitions, and local selector dispatch. |
| 2026-08-02 | Added the target source and Phase 8 contract. | `src/boot/boot_state_dispatch_loop_init.c`; row `56`; primary ID `primary:32e7dec3aabd26f874d3`; section `.ob64.r0056`; source SHA-256 `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999`; config SHA-256 `855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444`. |
| 2026-08-02 | Ran a focused KMC compile, assembly, extraction, and comparison for the selected slice. | 1,508 object bytes matched the z64 ROM slice exactly; target text SHA-256 `08B5A10F4A00B892D8CBE99A62BC7F823FBB7A6B4EB9FB488D1BC2EFC341B50B`. |
| 2026-08-02 | Ran the initial setup command with a two-minute timeout. | The command timed out before reporting, but `build/setup/verify-setup-report.json` recorded `ok: true`; the final rerun used a longer bound. |
| 2026-08-02 | Corrected the compiler-source grammar after the first Phase 8 attempt. | The compiler output needed one standalone `.text` marker; the final source preserved one compiler `.text` and no compiler `.section` drift. |
| 2026-08-02 | Built final root A. | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional`; build passed; build-report SHA-256 `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2`. |
| 2026-08-02 | Built final root B. | `C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-b3\conventional`; build passed; build-report SHA-256 `0BEA7BD4DB191849EA0481A3836E326809E9C2095624AE43D27F2A04E27C39C2`. |
| 2026-08-02 | Verified both final builds. | Both reports passed with ROM SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`. |
| 2026-08-02 | Compared final build roots. | Reproducibility passed with `reportsIdentical: true`; reproducibility report SHA-256 `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26`. |
| 2026-08-02 | Reran the authenticated setup gate against the final source and configuration. | `OB64 Decomp setup verification: PASS`; report SHA-256 `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D`. |
| 2026-08-02 | Completed the scoped end-of-session checks. | Final changes are limited to the selected source, Phase 8 configuration, and this evidence root; changes remain uncommitted. |
| 2026-08-02 | Created the required worker AAR. | `aar/20260802-ob64-matching-c-high-value-wave7-aar.md`; SHA-256 `B9717BF6F0FD183F01EF5838098BACDC44AA05919F2012523BEF72B1EE8BBE31`; review remains pending. |
| 2026-08-02 | Reran scoped checks after AAR creation. | `git diff --check` passed; the configuration contains one `func_00005FC0` target with 1,508 bytes, the exact ROM interval, and no relocations; the evidence root contains Markdown evidence only. |
| 2026-08-02 | Applied the evidence-consistency correction. | The reproducibility report is SHA-256 `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26`; the worker AAR now states six pre-correction Markdown evidence records; post-correction worker AAR SHA-256 `15FAF16F9BCB748AD60D330FB4B54D4A23A5E27E7D0DA575CF6C127D6E37A5EC`; correction AAR SHA-256 `7A9CFEB21CB4B0F3F485D0980EC19132BCF9B4A1029C3FA5C8081731A5BE7EBF`; source/configuration hashes remain unchanged. |
| 2026-08-02 | Recorded the blocked correction probe provenance before withdrawal. | Canonical `-.s` was 691 bytes with SHA-256 `DE115996A5C8D4B54307FDF02E0225223872B8910F40232009CBF9E85DB79160`; it was generated by the maintainable-C standard-input probe. |
| 2026-08-02 | Removed the rejected candidate from the active build. | Deleted `src/boot/boot_state_dispatch_loop_init.c` and its row-56 `func_00005FC0` configuration entry; the original assembly fallback remains unchanged. |
| 2026-08-02 | Removed the attributable generated probe artifact. | Deleted canonical `-.s` after hash verification; the path is absent after withdrawal. |
| 2026-08-02 | Marked the candidate rejected and withdrawn. | Updated the target-selection record, worker AAR, evidence index, consistency correction AAR, and blocked correction AAR; proportional Critical review remains pending. |
| 2026-08-02 | Re-ran two fresh fallback builds after withdrawal. | `C:\Users\Joe\.codex\ob64-matching-c-wave7-rejected-candidate-withdrawal-20260802\run-a\conventional` and `run-b\conventional` passed with seven matching-C owners; both ROMs are `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. |
| 2026-08-02 | Verified both fresh fallback builds. | Both reports passed with code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`, seven exact asm-differ target results, `acceptedRowsPreserved: 7242`, `acceptedSlicesPreserved: 7251`, and `overlayDescriptorsPreserved: 19`. |
| 2026-08-02 | Compared the two fresh fallback roots. | Reproducibility passed with `reportsIdentical: true`; build-report SHA-256 `A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E`; verification-report SHA-256 `D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED`; reproducibility-report SHA-256 `D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48`. |
| 2026-08-02 | Completed the withdrawal end-of-session checks. | Configuration has seven targets and zero `func_00005FC0` entries; the rejected source and `-.s` are absent; the original assembly fallback remains `92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2`; `git diff --check` passed. |
| 2026-08-02 | Wrote the withdrawal AAR. | `withdrawal-20260802/aar/20260802-ob64-matching-c-high-value-wave7-rejected-candidate-withdrawal-aar.md`; SHA-256 `FFA76A08D0D0E66C143FBE5DBD325E6819BD03B782BC36DB5882543BF7DABC60`; proportional Critical review remains pending. |

## Technical plan

1. Derive the C owner from the canonical assembly and structural dossier.
2. Preserve the local secondary entry and both local leaf tails explicitly.
3. Add only the matching-C source and one Phase 8 target contract.
4. Compile the target with the authenticated KMC compiler.
5. Iterate only within the source and target contract until focused bytes match.
6. Run the accepted setup, Phase 8 build, verifier, and reproducibility gates.
7. Authenticate inputs and outputs in the evidence index and worker AAR.

## Leading interpretation and alternative

The leading interpretation is that the owner is a boot task/status dispatcher
with callback-table initialization and a small task stack.

The plausible alternative is that the owner is a generic resource-state service
loop whose callback pointers encode unrelated subsystem services.

The same instruction sequence supports both structural interpretations. A
runtime semantic claim would require controlled execution evidence, which this
assignment does not authorize.

## Predicted observables and falsifiers

| Interpretation | Predicted observable | Falsifier within this assignment |
|---|---|---|
| Boot task/status dispatcher | C derivation requires callback-table setup, status polling, task push/pop, and local selector dispatch. | Canonical instructions do not reproduce those operations or linked bytes. |
| Generic resource-state service loop | C derivation still preserves callback/result routing and status transitions without gameplay names. | The accepted owner boundary or relocation contract excludes the local entries or required state accesses. |

## Scope and mutation ledger

The parent repository, integration working tree, master ROM, editor, emulator,
RAM, controller input, and savestates remain read-only.

Canonical writes are limited to the selected C owner, its Phase 8 configuration
entry, and this task's evidence root. Generated outputs remain outside Git under
`C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\`.

No helper agent, commit, stage, push, publication, or acceptance verdict is used.

The selected source contains an independently derived static-inline C model and
an explicit exact-layout anchor. The anchor is a documented backend limitation,
not an acceptance claim. Independent Critical review remains the done-gate for
this worker result.
