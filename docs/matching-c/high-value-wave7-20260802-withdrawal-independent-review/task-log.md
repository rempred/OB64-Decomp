# Wave 7 withdrawal independent-review task log

Status: completed. Verdict: Accepted.

This review judged canonical decomp commit ef653540848407c24915bf51b1df497cae0acc43. It reviewed the rejected func_00005FC0 withdrawal under Critical correction-review rules.

Director task: 019fba30-9100-72c3-bdd2-8758a7fab9c6.

## Start gate

- The assignment was ready, active, and assigned to an independent reviewer.
- The resolved inventory profile was PROTECTED.
- Canonical decomp HEAD was ef653540848407c24915bf51b1df497cae0acc43 on main.
- Integration evidence HEAD was b22815518f060425519c08df19b617af8b5099a7 on main.
- Parent workspace HEAD was 099523a1913db97a0178ad0e929a9f1f61919612 on main.
- The prompt records parent baseline 0884f427dcc8b8104531a93755cdfec626a8abad.
- The parent HEAD drift was recorded and did not affect this review.
- No parent research files or protected integration descendants were used.
- The review surface did not exist before this review.
- The frozen result and worker evidence remained read-only.

The canonical commit parent was 07bd06e9add63bacd45136b67e1684f004567d0a. The accepted seven-owner predecessor was e153585d7d1cb860d82ea8a905e4831a7b197a7c.

## Causal review scope

The earlier independent review issued Revision required for W7-MC-01. The maintainable-C correction reached its accepted-backend stop condition. The withdrawal removed the candidate source and configuration entry while preserving assembly fallback.

W7-MC-01 is Replace under correction-review rules. The withdrawal did not technically correct maintainable C. It removed the affected active claim, so the rejected candidate has no active acceptance target.

Earlier accepted checks were handled as follows:

| Earlier check | Correction status | Reason |
|---|---|---|
| Candidate boundary, target bytes, placement, and relocation evidence | Keep | The original assembly fallback stayed byte-identical and retained the historical evidence. |
| Seven earlier C owners and preservation | Run again | The active configuration changed and required fresh build evidence. |
| Full-ROM identity and verification | Run again | The withdrawal changed the active build surface. |
| Build reproducibility | Run again | The withdrawal changed the active build surface. |
| Evidence consistency and provenance | Run again | The worker package changed and required direct inspection. |
| Frozen file set and generated-artifact absence | Run again | The frozen withdrawal commit required a new file-set check. |
| W7-MC-01 maintainable-C finding | Replace | Withdrawal replaces the active candidate claim with a rejected, withdrawn disposition. |

## Review method

The review used direct frozen-commit inspection, independent configuration checks, fresh authenticated builds, fresh verification, and fresh reproducibility comparison.

The generated review outputs used this reviewer-owned root:

    C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\

The review did not inspect external-derived implementations. It used only the accepted local compiler, Splat runtime, split script, Phase 7 output, and asm-differ checkout named by the withdrawal evidence.

## Exact review commands

Frozen commit and evidence checks:

~~~powershell
git diff-tree --no-commit-id --name-status -r ef653540848407c24915bf51b1df497cae0acc43
git diff --check 07bd06e9add63bacd45136b67e1684f004567d0a ef653540848407c24915bf51b1df497cae0acc43 -- config/phase8/matching-c.json src/boot/boot_state_dispatch_loop_init.c docs/matching-c/high-value-wave7-20260802/
~~~

Fresh build commands:

~~~powershell
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-a\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-b\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
~~~

Fresh verification commands:

~~~powershell
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-a\conventional\verification.json"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-b\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-b\conventional\verification.json"
~~~

Reproducibility command:

~~~powershell
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-a\conventional" --right "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-b\conventional" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-withdrawal-review-20260802\run-a\conventional\reproducibility.json"
~~~

## Results

- Both fresh builds passed.
- Both builds listed exactly seven matching-C owners.
- Both builds listed three original-assembly fallbacks.
- Both built the same full-ROM SHA-256: 571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A.
- Both built the same code-region SHA-256: 40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409.
- Both fresh verifications passed.
- Each verification preserved 7,242 primary rows, 7,251 link slices, and 19 overlay reservations.
- Each verification reported fullRomExact true and originalAssemblyTargetsNotLinked true.
- Each verification reported seven exact asm-differ target results.
- Reproducibility passed with reportsIdentical true.
- Fresh build-report SHA-256 was A74706081DBF38D2024A7BF2C8BC4E9906A290C1470E6CE635904DBB2C124A1E.
- Fresh verification-report SHA-256 was D265EAEE4A07FC30F204460D8D100C2F6290A785B1B1A7D5968F66F604FD9AED.
- Fresh reproducibility-report SHA-256 was D99C32C68DA6D665793A36E3CDC3207088FF2857D529FE36D95F942BA73EAA48.

## Terminal state

The frozen result remained unchanged. The reviewer did not stage or commit files. Reviewer records remain uncommitted for Director intake.
