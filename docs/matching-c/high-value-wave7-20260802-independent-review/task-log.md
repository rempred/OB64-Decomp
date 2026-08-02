# Wave 7 independent review task log

Status: review complete. Verdict: `Revision required`.

| Date | Event | Evidence or result |
|---|---|---|
| 2026-08-02 | Read governing instructions and the ready review assignment. | Reviewer role, Critical level, `PROTECTED` inventory, read-only frozen subject, and permitted verdicts confirmed. |
| 2026-08-02 | Recorded repository identities. | Parent current `main` HEAD `ebe54a7fd7065a61183e30baadb01da4d8228790`; canonical `main` HEAD `1872b09872b50202341c0e9c097ac24951dedea5`; integration `main` HEAD `b22815518f060425519c08df19b617af8b5099a7`. |
| 2026-08-02 | Checked review-surface ownership. | Reviewer surface was absent, so no competing writer was found. The canonical tree was clean at the frozen subject. |
| 2026-08-02 | Inspected the frozen commit and evidence package. | Commit `1872b09872b50202341c0e9c097ac24951dedea5` contains nine allowed files and no generated binary artifact. |
| 2026-08-02 | Recomputed the target bytes independently. | The assembly contains 377 words and 1,508 bytes. Its SHA-256 is `08B5A10F4A00B892D8CBE99A62BC7F823FBB7A6B4EB9FB488D1BC2EFC341B50B`. |
| 2026-08-02 | Compared target bytes with rebuilt and normalized master ROM slices. | All three slices match at z64 ROM range `0x00005FC0..0x000065A4`; first difference is none. |
| 2026-08-02 | Ran an independent Phase 8 build. | Build passed in `C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802\conventional`; full-ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`. |
| 2026-08-02 | Ran the independent Phase 8 verifier. | The first attempt used a mistyped `split.py` path and failed before verification. The corrected command passed with verification SHA-256 `334399C94C61A50EBB0BF6AF2E19C958E866B4E9BC36ECD9F8614E791751782B`. |
| 2026-08-02 | Checked placement and preservation. | `.ob64.r0056` links at fixed boot RAM `0x80075BC0`, size `0x5E4`, with zero relocations. The verifier reports 7,242 preserved rows, 7,251 preserved slices, 19 preserved overlay reservations, and no linked fallback targets. |
| 2026-08-02 | Compared the reviewer build with the worker build. | The comparison passed with `reportsIdentical: true`; report SHA-256 is `B1E0E72EAD3E43571167407F74FD71F0741CA8002B35D8FAF8DCEDBD96DE7F26`. |
| 2026-08-02 | Tested the maintainable-C gate. | The source has 377 inline `.word` directives. The compiler output contains no C-model symbol and emits the full target through the anchor. |
| 2026-08-02 | Classified the material finding. | `W7-MC-01` is an admissible in-scope finding. It requires a worker correction and proportional Critical re-review. |
| 2026-08-02 | Created the reviewer AAR and evidence index. | The review remains uncommitted for Director intake. |

## Review commands

The reviewer used these authenticated commands:

```text
node tools/build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802\conventional" --phase7-output "C:\Users\Joe\.codex\ob64-phase8-matching-c-20260801\run-a\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802\conventional" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802\conventional\verification.json"
node tools/compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802\conventional" --right "C:\Users\Joe\.codex\ob64-matching-c-wave7-20260802\run-a4\conventional" --report "C:\Users\Joe\.codex\ob64-matching-c-wave7-review-20260802\reproducibility-vs-worker.json"
```

The reviewer also parsed the original `.word` stream and swapped the master
`.v64` bytes into z64 order. Those checks were read-only and wrote no canonical
artifact.
