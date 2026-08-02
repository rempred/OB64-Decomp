# After-action report: wave 7 rejected matching-C candidate withdrawal

Status: completed and review-pending. The rejected `func_00005FC0` candidate is removed from active matching C, and two fresh fallback builds reproduce the seven-owner accepted set. This matters because the rejected candidate no longer contributes a source owner or configured matching-C target. The Director must route the proportional Critical review; no action is required from Joe.

## Mission and authority

This correction assignment withdrew the rejected wave 7 matching-C candidate identified by the independent review. The assignment allowed changes in the canonical `OB64 Decomp` repository and its worker-owned evidence. It prohibited commits, pushes, publication, acceptance, and edits to the independent-review AAR.

The canonical repository started at `main` commit `07bd06e9add63bacd45136b67e1684f004567d0a`. The parent research repository remained read-only at `main` commit `0884f427dcc8b8104531a93755cdfec626a8abad`. The separate integration repository remained read-only at `main` commit `b22815518f060425519c08df19b617af8b5099a7`.

## Withdrawal actions

The active C source was removed:

- `src/boot/boot_state_dispatch_loop_init.c`
- Historical SHA-256: `BFEB371935DCA921472E44FA2AF6FF002459008DF47DA415B39CA2B1B785B999`
- Historical size: `18,683` bytes

The single `func_00005FC0` target object was removed from `config/phase8/matching-c.json`. The configuration had seven remaining target objects after removal. Its historical pre-withdrawal SHA-256 was `855E14C889788DBB708F0D02CEAEF225E3EE7642A2A77FF3819C886588ADA444`. Its current post-withdrawal SHA-256 is `3FA55971AF36908D2CA0A44460F36BB9156DEF8DF71FA0630583B5AC2C01D07C`.

The original assembly fallback remains unchanged:

- `asm/original/rev0/boot/boot_state_dispatch_loop_init.s`
- SHA-256: `92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2`

The unattributed temporary compiler artifact was first recorded, then removed:

- `-.s`
- Size: `691` bytes
- SHA-256: `DE115996A5C8D4B54307FDF02E0225223872B8910F40232009CBF9E85DB79160`

The temporary artifact was attributable to the blocked maintainable-C correction. Its provenance and removal are recorded in the blocked correction AAR and task log. No rejected candidate evidence was discarded.

## Active surface proof

The post-withdrawal configuration contains seven target objects. A text search finds zero `func_00005FC0` target entries. The removed C source is absent, and the original assembly fallback remains present with its preserved SHA-256.

The active surface therefore retains the seven-owner accepted configuration and assembly fallback. It does not retain the rejected candidate as a source owner or configured matching-C target.

## Evidence and review status

The worker AAR, target-selection record, evidence index, task log, consistency-correction AAR, and blocked maintainable-C correction AAR now identify `func_00005FC0` as rejected and withdrawn. The independent-review AAR remains unchanged and records the original `Revision required` result for `W7-MC-01`.

The blocked maintainable-C correction remains historical evidence for an unresolved compiler-backend question. It does not establish a maintainable-C implementation. The withdrawal does not claim that a different compiler or source model can match the target.

The withdrawal AAR has a pending proportional Critical review. This report does not issue an acceptance verdict.

## Verification gates

Both fresh builds passed with the seven active targets:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-rejected-candidate-withdrawal-20260802\run-a\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-rejected-candidate-withdrawal-20260802\run-b\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Both builds reported `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` for the full ROM. Each build reported code-region SHA-256 `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`. Each build reported seven matching-C owners and three original-assembly fallbacks.

The two verification commands passed. Each report recorded seven exact asm-differ target results, `fullRomExact: true`, `acceptedRowsPreserved: 7242`, `acceptedSlicesPreserved: 7251`, `overlayDescriptorsPreserved: 19`, and `originalAssemblyTargetsNotLinked: true`. The reproducibility comparison also passed with seven target records.

The generated identities were path-independent:

- Build report SHA-256: `A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E`
- Verification report SHA-256: `D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED`
- Reproducibility report SHA-256: `D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48`
- ELF SHA-256: `AFBCE8B6A5C6D43FC0BDA6A3F9386603DC89D839F76CDB9C159C3D2DBE1EFCF5`
- Map SHA-256: `350B31BF8D51070A5039AFFA67ED2703F33C397EBF42873DBC3BF4CB92E075E2`

The final absence checks passed. `src/boot/boot_state_dispatch_loop_init.c` and `-.s` are absent. The preserved original assembly fallback still hashes to `92D12F3BAC341DCC418030610B2BFA6A6A0BFA4170FA0E48EF01E47455DA1AC2`.

## Changed surfaces and provenance

The source removal and configuration-row removal are attributable to this correction. The original assembly file is preserved. Worker-owned evidence was updated to make the rejection and withdrawal state explicit. The independent-review AAR and canonical domain documents were not modified.

No commit, push, publication, or acceptance action was performed. The Director owns intake, commit boundaries, and final review routing.

## Evidence grade and review state

Withdrawal evidence grade: `Supported`. Direct source, configuration, fallback, build, verification, and reproducibility evidence supports the withdrawal. The historical candidate evidence remains preserved for audit and backend research.

Review state: `pending`. The original independent review rejected the maintainable-C claim with `Revision required`. The withdrawal itself awaits proportional Critical review. This report does not issue an acceptance verdict.

## Director handoff

The Director can intake the uncommitted withdrawal changes because the fresh gates passed. Preserve the historical worker and review records, keep `func_00005FC0` excluded from active matching C, and route the withdrawal AAR for proportional Critical review. Route any future compiler-backend investigation separately from the accepted seven-owner matching-C surface.
