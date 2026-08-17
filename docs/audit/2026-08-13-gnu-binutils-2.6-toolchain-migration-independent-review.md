# GNU Binutils 2.6 structural migration independent review

Verdict: Revision required

Material result: The rebuilt tools, ROMs, ownership, relocations, and load structure are exact. Two admissible acceptance defects remain.

Why it matters: A clean checkout cannot pass the required smoke and audit path. One required source-policy executable also lacks authenticated identity.

Required next action: An implementation worker must correct findings `GB26-IR-001` and `GB26-IR-002`. A different independent reviewer must then perform proportional re-review.

Actor responsible: Joe routes the correction. The implementation worker owns the correction. The later independent reviewer owns acceptance.

## Frozen subject and eligibility

The reviewed repository is:

`C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp`

The frozen implementation commit is:

`6a4db1a10c83e2ca4ea8324f19139e30c2658056`

Its sole parent is the assigned parent:

`c1e36b1ebf7c49dadfc7f133d286d76f7e0f1ad0`

The canonical repository began clean at the implementation commit. The reviewer did not contribute to the implementation.

The Decompals checkout began clean and detached at:

`54514ded39ceb32165a125ddba04ca5b551773a2`

Its tree is `11e8e8159fee67193ec21a92cf1d708159b7150b`. Local tag `v0.3` points at that commit.

The upstream Decompals tag also resolved to that commit through:

```powershell
git ls-remote https://github.com/decompals/mips-binutils-2.6.git 'refs/tags/v0.3' 'refs/tags/v0.3^{}'
```

No governing `AGENTS.md` existed in the Decompals checkout. The required upstream build workflow was read before source inspection.

The source identifies BFD, GAS, and Binutils as version `2.6`. Both reviewer-built bundles report GNU 2.6 versions.

The migration plan is absent from the parent commit. Its committed SHA-256 is:

`E3ADBA1289622271C24196BA55379FA73087326033DBB11ABB47B3852D7383E1`

That hash matches the worker-recorded hash. Git does not independently prove the plan's pre-implementation contents.

The frozen subject was therefore identifiable. Review eligibility passed.

## Material result

Two fresh source builds produced the same nine production files. Every production file matched the tracked size and SHA-256.

Two fresh canonical copies then used the two reviewer-built bundles. Their Phase 7 and Phase 8 artifacts were mutually byte-identical.

Both Phase 7 and Phase 8 ROMs were 41,943,040 bytes. All four ROM artifacts had SHA-256:

`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`

Both strict normal verifiers passed. All 37 active replacements retained exact bytes, placement, classification, and sole C ownership.

The independent relocation census found 408 active load-relevant records. All matched their accepted normalized contracts.

The independent ancillary census found zero active ancillary relocations. It found 38 retired records, all in `.rel.pdr`.

All 7,268 nonempty allocated sections matched exactly one `PT_LOAD`. All 7,252 accepted layout slices matched exact load addresses and flags.

The clean smoke and heavyweight audit commands did not pass. Their shared output-directory defect is finding `GB26-IR-001`.

The source-policy preprocessor invokes an unpinned companion compiler executable. That identity defect is finding `GB26-IR-002`.

## Admissible findings

### GB26-IR-001

Finding ID: `GB26-IR-001`

Finding: The standalone GNU 2.6 smoke test does not create `build/toolchain-smoke/first_tracked_chunk` before writing its adjusted source.

Failed assigned claim or gate: The affected regressions and `node tools/audit.js` must pass from fresh reviewer-owned state.

Frozen subject: `6a4db1a10c83e2ca4ea8324f19139e30c2658056`

Direct observation: `node tests\binutils_smoke.js` exited 1 in fresh review copy `ra`.

The failure was `ENOENT` at `tests/binutils_smoke.js:266`. The missing file was `first_tracked_chunk\boot_entry_clear_bss.s`.

The test creates directories for earlier primitive cases. `verifyFirstTrackedChunk` never creates its own directory.

The clean heavyweight audit repeated the same failure. `tools/verify_setup.js` invokes the smoke test directly.

Pre-creating only that ignored output directory made the smoke suite pass. The diagnostic heavyweight audit then passed all structural checks.

Reachable producer path: A fresh accepted checkout running either documented command reaches the failure without any hostile input.

Material consequence: The assigned regression and heavyweight-audit gates are not independently reproducible. A stale local directory can mask the defect.

Supporting evidence:

- Clean smoke command: exit 1 with `ENOENT`.
- Clean audit command: exit 1 with the same `ENOENT`.
- Diagnostic smoke report: `5A4EB9B42006625FB09E02323CAFD18958E16A080BB3E91F1CD48866751C1E9D`.
- Diagnostic audit report: `573F486A19AC2875D45429E9EACA660274D89C8024B863ACC5A498F86E4BDB69`.

Smallest correction boundary: Create the per-case directory inside `verifyFirstTrackedChunk` before its first write. Re-run smoke and audit from absent output roots.

Admissibility classification: **Acceptance test**.

The assigned gate was the documented standalone regression and audit path. A fresh checkout is its ordinary producer.

The command is the smallest useful falsifier. It stays inside the approved structural evidence grade and threat model.

The pre-created-directory reruns were **diagnostic tests**. Their success does not erase the clean acceptance failure.

### GB26-IR-002

Finding ID: `GB26-IR-002`

Finding: Source-policy preprocessing depends on a companion `cc1.exe` whose identity is absent from the tracked contract and verification reports.

Failed assigned claim or gate: Material claim 4 requires every required build input and tool to fail closed on identity drift.

Frozen subject: `6a4db1a10c83e2ca4ea8324f19139e30c2658056`

Direct observation: The tracked contract authenticates `mips64-elf-cpp.exe` only.

That driver has SHA-256 `56D276AE66F2F499FAD2454663E8B5B82B20D5D7C44A4116349C096780FFF927`.

Actual preprocessing requires this companion:

`C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\.toolchains\gcc-toolchain-mips64-win64\libexec\gcc\mips64-elf\12.2.0\cc1.exe`

The companion is 21,875,200 bytes. Its observed SHA-256 is:

`40B1F1C1A2476FD1E286EDAFDEF6E352C188A722CF6E4AD9D58ED80C96F50A84`

That hash has zero tracked references outside ignored tool directories. `resolvePreprocessor` checks and reports only the driver.

A fresh copy containing the authenticated driver but not its companion passed `--version`. Real preprocessing then failed with `cannot execute 'cc1'`.

Copying the complete local GCC installation made source classification and both complete builds pass. The successful path still did not authenticate `cc1.exe`.

Reachable producer path: Every ordinary build and verifier preprocesses active target sources. The authenticated driver delegates that work to the ignored companion.

Material consequence: An unreviewed executable contributes to the five `PURE_C` and 32 `HYBRID_C` classifications.

Build and verification both reuse the same companion. Their agreement does not establish that executable's identity.

Supporting evidence:

- `config/source-policy.json` pins only `mips64-elf-cpp.exe`.
- `tools/lib/source_policy.js` verifies only that file's hash and version.
- The source-policy report records the driver, not the companion.
- The successful ordinary build directly invokes the companion through the driver.
- No accepted per-target source-policy digest is independently pinned before classification.

Smallest correction boundary: Pin, validate, and report the actual preprocessing engine and any required executable identity closure.

The likely worker-owned files are `config/source-policy.json`, `tools/lib/source_policy.js`, focused tests, and affected documentation.

Admissibility classification: **Acceptance test** based on direct dependency and identity inspection.

The supported producer is ordinary source classification. The tested state is the actual successful production path, not a hostile construction.

The missing-companion run was a **diagnostic test**. No arbitrary byte mutation or forged evidence supports this finding.

## Claims reviewed

| # | Material claim | Review result |
| ---: | --- | --- |
| 1 | Commit `54514ded...` is authenticated GNU Binutils 2.6 source. | Confirmed. Checkout, tree, tag, upstream tag, source versions, and tool versions agree. |
| 2 | The tracked recipe reproducibly builds the complete production bundle. | Confirmed from two fresh work and output roots. |
| 3 | The bundle contains eight `mips-kmc-elf-*` utilities and `msys-2.0.dll`. | Confirmed; both bundles contained exactly those nine files. |
| 4 | Every required input, patch, runner, compiler, and production tool fails closed on identity drift. | Not accepted. See `GB26-IR-002`. |
| 5 | The Windows KMC GCC 2.7.2 compiler is unchanged. | Confirmed. Parent and current contracts are equal; executable hash is unchanged. |
| 6 | The complete assembly and data baseline rebuilds exactly through GNU 2.6. | Confirmed. Both Phase 7 ROMs and the 6,184-owner audit reconstruction were exact. |
| 7 | Placement, overlays, slabs, sections, and load headers remain exact. | Confirmed by independent section, layout, and `PT_LOAD` cross-matching. |
| 8 | KMC compiler assembly changes only by target-section adjustment. | Confirmed for all 37 compiler assemblies. |
| 9 | All six GNU 2.6 hybrid rewrites remain exact and `HYBRID_C`. | Confirmed by source diff, classification, target hashes, and linked bytes. |
| 10 | All 37 active replacements retain exact bytes, placement, and sole C ownership. | Confirmed by direct map and verification-report inspection. |
| 11 | Five `PURE_C` and 32 `HYBRID_C` claims remain accurate. | Byte and classifier results confirm the census. Identity acceptance remains blocked by `GB26-IR-002`. |
| 12 | Acceptance uses source-to-object and load-relevant relocation evidence. | Confirmed in all 37 proof files and strict recompilation. |
| 13 | All 408 active load-relevant relocations remain exact. | Confirmed by independent proof aggregation and parity. |
| 14 | The 38 `.rel.pdr` records are retired, not active. | Confirmed; all 38 retired records were `.rel.pdr`, with zero active `.pdr` records. |
| 15 | `func_0000A1F8` uses only narrow self-relocation normalization. | Confirmed from raw symbols and normalization code. Offsets and types remain exact. |
| 16 | Exactly three symbolic call relocations were added. | Confirmed at the three assigned offsets and symbols. |
| 17 | No prior load-relevant relocation was removed. | Confirmed by rerunning frozen-workflow parity after independent builds existed. |
| 18 | GNU 2.39 and the retired adapter cannot enter active production. | Confirmed by active-file search and cutover regression. Only negative tests name them. |
| 19 | p3063 remains exact `PURE_C`. | Confirmed at SHA-256 `5985A5DF...A5E2B`. |
| 20 | p3064 and `func_0002CD70` remain exact `HYBRID_C`. | Confirmed at their accepted hashes. |
| 21 | Both protected `func_0002CD70` words remain `0x00801025`. | Confirmed directly from the rebuilt ROM at target offsets `+0x004` and `+0x028`. |
| 22 | p3066 remains inactive. | Confirmed. No active target uses row 3066. |
| 23 | Modified-game behavior and acceptance rules remain unchanged. | Confirmed within the assigned preservation boundary. The tracked rules section is identical. |
| 24 | Two fresh builds reproduce normalized Rev 0 exactly. | Confirmed. ROMs, ELFs, layouts, ELF reports, and build reports were mutually identical. |

The clean regression and audit gate is separate from those 24 claims. It failed under `GB26-IR-001`.

No other admissible findings exist.

## Independent review method

The review used the worker report only as an evidence index before independent reproduction.

The reviewer then performed these phases:

1. Recorded both repository identities and statuses.
2. Completed all assigned policy, plan, report, workflow, and source reading.
3. Authenticated the source checkout and upstream tag.
4. Built the complete nine-file tool bundle twice from fresh work roots.
5. Compared every tool artifact by name, size, and SHA-256.
6. Created two fresh long-path-safe repository copies at the frozen implementation commit.
7. Populated each copy with one independently built GNU 2.6 bundle.
8. Reproduced Phase 7 and Phase 8 twice in separate external work roots.
9. Ran strict verification in both copies.
10. Ran the affected normal target, status, regression, parity, and audit checks.
11. Independently aggregated all source-object proofs, ownership rows, and program headers.
12. Compared the worker's frozen parity control only after independent builds passed.

## Test admissibility

The normal builds, verifiers, source-policy checks, parity check, smoke command, and audit command were ordinary acceptance tests.

The built-in malformed-report and placement mutations were acceptance tests. Accepted generators and configuration inputs can produce those states.

The clean smoke failure is an acceptance result. It arose through the documented command in a fresh checkout.

Pre-creating the missing smoke directory was diagnostic. It identified the correction boundary and could not affect the verdict.

The incomplete preprocessor copy was diagnostic. It exposed the driver's real executable dependency.

The initial wrong-parent audit launch was a reviewer setup failure. The corrected launch set `OB64_PARENT_ROOT` to the read-only parent ROM location.

Long-path checkout failures and incomplete reviewer tool copies were excluded setup failures. Their outputs were not used for acceptance.

No excluded hostile construction created a finding. No internal byte forgery, verifier change, schema change, race, or symlink test was used.

## Tests and results

| Test | Result |
| --- | --- |
| Canonical initial identity and status | `6a4db1a...`; clean. |
| Decompals initial identity and status | `54514ded...`; clean. |
| Plan SHA-256 | Matched `E3ADBA12...383E1`; absent from parent. |
| Tool build A | PASS in 73.7 seconds. |
| Tool build B | PASS in 73.2 seconds. |
| Tool bundle comparison | Nine files each; all byte-identical. |
| Complete build A | PASS; exact ROM. |
| Complete build B | PASS; exact ROM. |
| Cross-build artifacts | Phase 7/8 ROMs, ELFs, layouts, ELF reports, and build reports were identical. |
| Full `tools/verify.js`, copy A | PASS; 5 `PURE_C`, 32 `HYBRID_C`. |
| Full `tools/verify.js`, copy B | PASS; same result. |
| p3063 `--require-pure` | PASS and reported `MATCHING C`. |
| `func_0002CD70 --require-pure` | Expected exit 1 after all exactness gates passed. |
| `tools/diff.js func_0019554C` | Exact bytes, zero differing bytes, accepted target hash. |
| `tools/status.js` | Exact ROM; 5/1,088 pure bytes and 32/8,120 hybrid bytes. |
| `tests/active_targets.js` | PASS, 37 targets. |
| `tests/source_policy.js` | PASS. |
| Clean `tests/binutils_smoke.js` | FAIL; `GB26-IR-001`. |
| Diagnostic smoke after directory creation | PASS all 13 checks. |
| `tests/word_asm_smoke.js` | PASS. |
| `tests/diff_exactness.js` | PASS; all 15 negative mutations rejected. |
| `tests/overlay_config.js` | PASS. |
| Phase 5B capture/configuration checks | PASS. |
| `tests/phase7_conventional_build.js` | PASS; all 21 structural mutations rejected. |
| `tests/phase8_matching_c.js` | PASS; all 37 proofs exact. |
| `tests/workflow_acceptance.js` | PASS; stale schemas and proofs rejected. |
| `tests/workflow_parity.js` | PASS against the frozen control after independent reproduction. |
| Clean `tools/audit.js` | FAIL; repeated `GB26-IR-001`. |
| Diagnostic audit after directory creation | PASS; 6,184 tracked assembly files rebuilt exactly. |
| JavaScript syntax | 81 files checked; zero failures. |
| Independent proof census | 37 proofs, 408 active relocations, zero mismatches, 38 retired `.rel.pdr`. |
| Independent ownership scan | 37 exact targets; zero ownership or map-contribution failures. |
| Independent `PT_LOAD` scan | 7,268 sections and 7,268 loads; zero mapping failures. |

## Exact commands

The tool builds used:

```powershell
node tools\build_gnu_binutils_2_6.js --source 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\mips-binutils-2.6-pristine' --msys-root 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\msys64' --work 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\tool-a-work' --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\tool-a-bundle'
node tools\build_gnu_binutils_2_6.js --source 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\mips-binutils-2.6-pristine' --msys-root 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\msys64' --work 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\tool-b-work' --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\tool-b-bundle'
```

Each canonical build used this environment. `OB64_WORK_ROOT` selected `repro-a-work` or `repro-b-work`.

```powershell
$env:OB64_LOCAL_TOOLS = 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp\config\local-tools.json'
$env:OB64_WORK_ROOT = 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\repro-a-work'
$env:OB64_ROM_INPUT = 'C:\Users\Joe\Projects\OgreBattlel64\Ogre Battle 64 - Person of Lordly Caliber (U) [!].v64'
$env:OB64_PARENT_ROOT = 'C:\Users\Joe\Projects\OgreBattlel64'
$env:WINDIR = 'C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\pinned-windows-runtime'
$env:DEVPATH = "$env:WINDIR\System32\WindowsPowerShell\v1.0"
node tools\build.js
node tools\verify.js
```

The second build replaced `repro-a-work` with `repro-b-work` and ran from reviewer copy `rb`.

The normal interface checks were:

```powershell
node tools\diff.js func_0019554C
node tools\verify.js --target func_0019554C --require-pure
node tools\verify.js --target func_0002CD70 --require-pure
node tools\status.js
```

The affected regressions were:

```powershell
node tests\active_targets.js
node tests\source_policy.js
node tests\binutils_smoke.js
node tests\word_asm_smoke.js
node tests\diff_exactness.js
node tests\overlay_config.js
node tests\phase5b_capture_binding.js
node tests\verify_setup_phase5a_root.js
node tests\phase5b_production_config.js --phase5a-root 'C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor'
node tests\phase7_conventional_build.js --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\repro-b-work\baseline\e1ef0555efdc90f06df52244\phase7'
node tests\phase8_matching_c.js --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\repro-b-work\current\97a6a14ee75bbd3290f81551\build'
node tests\workflow_acceptance.js --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\repro-b-work\current\97a6a14ee75bbd3290f81551\build'
node tests\workflow_parity.js --old-root 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\frozen-parity-root' --new-output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2\repro-b-work\current\97a6a14ee75bbd3290f81551\build'
```

The clean heavyweight command was:

```powershell
node tools\audit.js --phase5a-root 'C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor'
```

It failed under `GB26-IR-001`. The diagnostic rerun first executed:

```powershell
New-Item -ItemType Directory -Path '.\build\toolchain-smoke\first_tracked_chunk' -Force
```

The diagnostic audit then used the same audit command and passed.

Patch applicability used:

```powershell
git apply --check <each-tracked-patch>
```

All four patches applied cleanly to the pristine source. Their hashes matched the tracked manifest.

Independent aggregation read the reviewer Phase 8 ELF report, layout, map, 37 proof files, and source-policy report.

The aggregation matched these exact predicates:

- one matching `PT_LOAD` per nonempty allocated section;
- exact section VMA, file offset, size, memory size, and flags;
- exact layout-slice VMA, LMA, size, and execute flag;
- one `objects/c/<symbol>.o` map contribution per active target;
- normalized relocations equal accepted relocations for every proof;
- compiler assembly equals section-adjusted assembly after only the accepted directive replacement.

## Independently observed identities and hashes

### Production bundle

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `mips-kmc-elf-as.exe` | 559,236 | `0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C` |
| `mips-kmc-elf-ld.exe` | 458,490 | `48944635BC840256BC2FBA86D2701A4CA59B2424B924AC8B9F4853D4E1DA609F` |
| `mips-kmc-elf-nm.exe` | 322,802 | `47BF09DC0E559C7D0D8B9E145977715D03FC06E8F3294D76AED3597CD5AF45CF` |
| `mips-kmc-elf-objcopy.exe` | 304,282 | `9C3C821BE67C96AF204CC9B49FA1E285506E6E986B853AB898DFF48DC8B6F1AE` |
| `mips-kmc-elf-objdump.exe` | 340,623 | `5F5B5822691BFAD87E628BCE4C781459902E4124AB7ED6604CA2DB62075D9816` |
| `mips-kmc-elf-size.exe` | 290,591 | `C79E77F51D0B3EC30B694A448CB85C30C864CA5FF3D3E0174B73334384251A12` |
| `mips-kmc-elf-strings.exe` | 288,949 | `D95DA29B12432F5CBD62DFE7FAE204C675C47235667A6CBD3C6C2A08E061B6DB` |
| `mips-kmc-elf-strip.exe` | 304,282 | `D1C7AA9E8B28EECB7942C58250246BA0AB0ECC071AF2655D5BEC703800730564` |
| `msys-2.0.dll` | 3,367,041 | `D9BB385834F1A235009F0962B7BDA7E1832FB12E53D832F1DC389C3144E03D44` |

Tool build reports differ only through path-bearing provenance. Their hashes are:

- Tool A: `AE9EC358DAA60B5BA52F08A0255BDDB42E81E52EAB4A657C0B768183F9B8AF02`.
- Tool B: `7542C7965E3D2152C4A843C83AC5C8D795CE060171E198C513B9C3D8AC49E67F`.

### Runtime and compiler inputs

| Input | Observed identity |
| --- | --- |
| Node | `v24.13.1`; `E3BE0545...E9676E50` |
| Pinned Windows PowerShell | `5.1.26100.8972`; `7600FFE1...B18F5` |
| `System.Management.Automation.dll` | `13FB0723...C1FC26` |
| Splat Python | `Python 3.11.15`; `4CCA2027...10F` |
| Splat `split.py` | `EED41D3C...544E` |
| asm-differ | commit `093360aa...`; `diff.py` hash `D69AA591...2211` |
| KMC GCC 2.7.2 `cc1.exe` | 2,204,672 bytes; `F3F1C99A...B1C6` |
| Source-policy driver | 1,225,728 bytes; `56D276AE...F927` |
| Unpinned source-policy companion | 21,875,200 bytes; `40B1F1C1...0A84` |

### Reproduced artifacts

| Artifact | Bytes | SHA-256 | Cross-build result |
| --- | ---: | --- | --- |
| Phase 7 ROM | 41,943,040 | `571E8339...CC67A` | Identical |
| Phase 8 ROM | 41,943,040 | `571E8339...CC67A` | Identical |
| Phase 7 ELF | 100,531,079 | `71AB57DB...F0A2` | Identical |
| Phase 8 ELF | 100,536,566 | `AFA3A43D...3D32` | Identical |
| Phase 7 ELF report | 14,384,425 | `482E1681...0559` | Identical |
| Phase 8 ELF report | 14,426,134 | `F3884B36...D95F` | Identical |
| Phase 7 layout | 5,405,846 | `B62F1F32...DDA5` | Identical |
| Phase 8 layout | 5,423,901 | `96A9BA58...F716` | Identical |
| Phase 7 build report | 9,950 | `92DE3026...38AE` | Identical |
| Phase 8 build report | 528,832 | `47A0CAA4...7589` | Identical |

The reviewer verification report is 196,308 bytes with SHA-256:

`3BD24C6D862933C6DC6DCF6F61A1A82F7E41C1CB12C7660ACAABB7D7E7222719`

### Structural counts

| Evidence | Independent result |
| --- | ---: |
| Active replacements | 37 |
| Exact `PURE_C` | 5 functions / 1,088 bytes |
| Exact `HYBRID_C` | 32 functions / 8,120 bytes |
| Compiler-assembly rewrites | 0 |
| Active load-relevant relocations | 408 |
| Active ancillary relocations | 0 |
| Retired `.rel.pdr` relocations | 38 |
| Nonempty allocated sections | 7,268 |
| `PT_LOAD` headers | 7,268 |
| Accepted layout slices | 7,252 |
| Accepted overlay descriptors | 19 |
| Tracked assembly files rebuilt in audit | 6,184 |

## Reused frozen evidence

The review reused these accepted external inputs:

- The read-only Rev 0 master ROM.
- The pinned MSYS2 root used by the source-build recipe.
- The KMC GCC 2.7.2 compiler.
- The Splat runtime and snapshot.
- The asm-differ checkout.
- The pinned Windows PowerShell runtime.
- The accepted Phase 5A evidence root required by the heavyweight audit.

The Phase 5A provenance-manifest hash was `EDE5DF7B...0060A`. Its conservation report hash was `AD06779B...D502`.

The worker's frozen GNU 2.39 parity root was used only after both independent GNU 2.6 builds passed.

Its frozen Phase 8 ROM had the canonical hash. Its Phase 8 build-report hash was `1677ECBC...C102`.

No worker GNU 2.6 tool bundle, Phase 7 output, Phase 8 output, or audit report served as independent reproduction evidence.

The worker report was compared after independent results. Its material artifact hashes agreed with the independent results.

## Fresh reviewer output roots

The unique reviewer evidence root is:

`C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-independent-review-20260813-8f37c1a2`

Primary fresh roots are:

- `tool-a-work` and `tool-a-bundle`;
- `tool-b-work` and `tool-b-bundle`;
- repository copy `ra` with `repro-a-work`;
- repository copy `rb` with `repro-b-work`.

Failed reviewer setup copies remain preserved under the same root. They were excluded from acceptance evidence.

## Evidence limits

The MSYS2 installation was not reconstructed from its base archive. The review authenticated its pinned package cache and reproduced every final tool byte twice.

The build recipe records a base-archive hash. It does not independently prove every installed host file against that archive.

That host-installation limit did not create another finding. Exact output hashes fail closed for the nine production artifacts.

The modified-game review checked unchanged rules and unchanged tracked behavior boundaries. It did not build or execute a new modified ROM.

The diagnostic audit pass is not a substitute for the failed clean audit. It only proves the remaining structural checks pass after `GB26-IR-001`.

The parity result depends on the assigned frozen GNU 2.39 control. It was used only after independent GNU 2.6 reproduction.

The HJIS checkout was not inspected. No HJIS game-source expression, comments, configuration, or documentation entered the review.

The pristine Decompals checkout remained read-only and clean.

The `.codex-remote-attachments\` directory was not read, edited, enumerated, staged, or removed.

No branch was created or switched. No commit, push, publication, or pull request occurred.

## Documentation consequences

The migration must remain structurally pending. It cannot enter accepted canonical history at this frozen commit.

The worker evidence report is frozen and must not be edited. A correction needs a successor correction record.

The source-policy contract must name every executable needed to establish classification identity.

No accepted-count or canonical-status documentation should be advanced until proportional independent re-review passes.

## Required next route

1. Joe assigns an implementation worker a correction based on `6a4db1a10c83e2ca4ea8324f19139e30c2658056`.
2. The worker corrects `GB26-IR-001` without changing the smoke test's evidence target.
3. The worker corrects `GB26-IR-002` without weakening source-policy identity or classification gates.
4. The worker runs smoke and audit from output roots where `build/toolchain-smoke` is absent.
5. The worker reruns source policy, the complete current build, strict verification, and affected identity-drift regressions.
6. A different independent reviewer performs proportional re-review against the new frozen correction commit.

The next reviewer may keep unaffected tool-build and BFD structural evidence only after proving the correction cannot alter those inputs.

Canonical acceptance remains blocked until both findings are closed by that re-review.
