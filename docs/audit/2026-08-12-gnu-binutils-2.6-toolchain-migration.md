# GNU Binutils 2.6 production-toolchain migration evidence

Date: 2026-08-12 through 2026-08-13

Starting canonical commit: `c1e36b1ebf7c49dadfc7f133d286d76f7e0f1ad0`

Implementation branch: `codex/gnu-binutils-2.6-migration`

Status: implementation gates pass; independent structural review remains required

## Result

The Rev 0 production build now uses an authenticated, source-built GNU Binutils 2.6 chain for
assembly, linking, binary extraction, and inspection. The authenticated Windows KMC GCC 2.7.2
compiler remains unchanged. KMC compiler assembly is preserved byte-for-byte as a generated
artifact, receives only the accepted target-section adjustment, and is assembled directly by GNU
2.6. The active GNU 2.39 and compiler-dialect-adapter paths have been removed.

Two fresh complete builds produced byte-identical Phase 7 and Phase 8 reports and artifacts. Both
complete ROMs are 41,943,040 bytes with SHA-256:

`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`

All 37 active C replacements retain accepted placement, exact linked target bytes, and sole C
ownership: five `PURE_C` functions / 1,088 bytes and 32 `HYBRID_C` functions / 8,120 bytes. No
fallback assembly owner remains active for a replacement. The 6,510,444-byte tracked assembly code
baseline is exact with SHA-256
`40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

This report does not declare the structural migration accepted. The independent-review gate in
the migration plan is still open.

## Scope and preserved invariants

- The canonical target remains normalized US Rev 0.
- No function boundary, accepted row, overlay descriptor, non-descriptor load slab, segmentation,
  ROM/VMA placement, executable extent, or accepted ownership metadata changed.
- The original assembly owners remain tracked as reference/fallback but are excluded from every
  active C replacement in the exact production link.
- p3066 remains inactive.
- p3063 remains `PURE_C` and exact at target SHA-256
  `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.
- p3064 remains exact `HYBRID_C`, target SHA-256
  `E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B`.
- `func_0002CD70` remains exact `HYBRID_C`, target SHA-256
  `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`;
  the protected words at target offsets `+0x004` and `+0x028` are both `0x00801025`.
- Modified-game behavior and its acceptance rules were not changed.
- The user-owned migration plan was preserved and added unchanged. Its SHA-256 is
  `E3ADBA1289622271C24196BA55379FA73087326033DBB11ABB47B3852D7383E1`.
- The unrelated `.codex-remote-attachments/` directory was not read, edited, staged, or removed.
- The HJIS checkout was read-only comparative evidence. No HJIS game-source expression, comments,
  configuration, or documentation were copied into this repository.

## Source, build recipe, and runtime identity

### GNU Binutils 2.6 source and recipe

| Item | Identity |
| --- | --- |
| Decompals source commit | `54514ded39ceb32165a125ddba04ca5b551773a2` |
| v0.3 release archive | `5A612CD28344E5B410C3344EC5DCFB92D9D03947756F190CD12404055B4A624D` |
| v0.3 release assembler | `AE891FB014E2F959E278BC51AE2FD47256B36955F752BBE4A38790EA4381139D` |
| Build recipe, `tools/build_gnu_binutils_2_6.js` | `406EC91524FD862BAB743DC680DB18024EA719F56D25DEA9A79BBFA11439F1F3` |
| Build-provenance manifest | `6B5C9B582F95B546E9AEDFD44A76E4F4D756AD0DF658D02EA96CCF503CEB1BD7` |
| Production toolchain manifest | `EC642F5AEB318853BE699010E3B2BB43F186EE13C9761B5DB4A668A1BE9D0015` |
| MSYS2 base archive | `A2D047E8EE213C6A49A8DE427EB1069DF12207C0422FF1B3CBB5C905C34221` |

The build recipe authenticates the installed version and cached archive SHA-256 of every one of
the 17 required MSYS2 packages. The complete package/version/archive ledger is authoritative in
`config/gnu-binutils-2.6-build.json`.

Four tracked patches are applied to the pinned source:

| Patch | SHA-256 | Reviewed purpose |
| --- | --- | --- |
| `gnu-binutils-2.6-msys2-host.patch` | `A85BFAF00589DBFF883E3EC33FFBE51267AF7D125EABA109A9ECAB65AFC86D71` | Modern-host build compatibility only: `stdarg`, Flex buffer API, and Cygwin `sys_siglist`. |
| `gnu-binutils-2.6-ob64-load-segments.patch` | `CB1B310B38F6B45A44E690BA1B7A00A7528E7886BC4BAC7E74CAC69E2A84D997` | Opt-in exact output-section LMA recovery, one `PT_LOAD` per nonempty allocated section, and dynamic program-header storage. |
| `gnu-binutils-2.6-ob64-binary-lma.patch` | `3CFB1E09F41E3335BDE2BE1CDC38ACF06DF6D49E8F81D103CC1F0D70DDC277CF` | Opt-in binary extraction by LMA for fixed ROM loads and overlapping runtime overlays. |
| `gnu-binutils-2.6-ob64-hi16-pairing.patch` | `3C1F6F51AAC2268ADDF4E2B6B2BD3AC5BD39313F2ACE5D0A623A7CC995A9E480` | Opt-in symbol-matched KMC `HI16`/forward `LO16` pairing across intervening relocations. |

### Production executables and runners

| File or runner | Bytes | SHA-256 |
| --- | ---: | --- |
| `mips-kmc-elf-as.exe` | 559,236 | `0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C` |
| `mips-kmc-elf-ld.exe` | 458,490 | `48944635BC840256BC2FBA86D2701A4CA59B2424B924AC8B9F4853D4E1DA609F` |
| `mips-kmc-elf-objcopy.exe` | 304,282 | `9C3C821BE67C96AF204CC9B49FA1E285506E6E986B853AB898DFF48DC8B6F1AE` |
| `mips-kmc-elf-objdump.exe` | 340,623 | `5F5B5822691BFAD87E628BCE4C781459902E4124AB7ED6604CA2DB62075D9816` |
| `mips-kmc-elf-nm.exe` | 322,802 | `47BF09DC0E559C7D0D8B9E145977715D03FC06E8F3294D76AED3597CD5AF45CF` |
| `mips-kmc-elf-size.exe` | 290,591 | `C79E77F51D0B3EC30B694A448CB85C30C864CA5FF3D3E0174B73334384251A12` |
| `mips-kmc-elf-strings.exe` | 288,949 | `D95DA29B12432F5CBD62DFE7FAE204C675C47235667A6CBD3C6C2A08E061B6DB` |
| `mips-kmc-elf-strip.exe` | 304,282 | `D1C7AA9E8B28EECB7942C58250246BA0AB0ECC071AF2655D5BEC703800730564` |
| GNU 2.6 MSYS runner, `msys-2.0.dll` | 3,367,041 | `D9BB385834F1A235009F0962B7BDA7E1832FB12E53D832F1DC389C3144E03D44` |
| KMC GCC 2.7.2 `cc1.exe` | 2,204,672 | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Node.js `v24.13.1` runner | — | `E3BE0545990C90995D7BF3A7AF5D64AF1F2E0FC1BBD9B79C27F7ABC1E9676E50` |
| Pinned PowerShell `5.1.26100.8972` | — | `7600FFE12DA441FE89D035B13801E8E91D064BC544A27B19A5CF49F6AB8B18F5` |
| Pinned `System.Management.Automation.dll` | — | `13FB07233112F765DE69AE4CDE6728AF672442DC9C5D7C9412C830E27FC1FC26` |
| Splat Python `3.11.15` | — | `4CCA2027319C08DCA5CC4B64C9BA415CC89205152202CB6805081277C43B610F` |
| Splat `split.py`, commit `999c792fdda1002f29926717d2b7197bb90480a9` | — | `EED41D3C36AFA4A980A3B22BC76C371569696CADFEF925DBB63606BFB081544E` |
| asm-differ `diff.py`, commit `093360aa31f90e67216ed1971c4087516cc7b940` | — | `D69AA5916DA99A9D88D3B3156C4ABB1C656E425205644B3DB4726204DC7C2211` |

Reported versions are GNU assembler 2.6/BFD 2.6, GNU ld 2.6/BFD 2.6, GNU objcopy
2.6, and GNU objdump 2.6. The production root is the ignored local directory
`.toolchains/gnu-binutils-2.6-mips-kmc-elf-msys2`; every invocation fails closed on the
manifest, provenance, executable, and runner identities above.

The release/native move probe object is
`493E0D0CE79954A6BE0E60F85C85224D75FE067773FDCADD3E7259DDB227FF83`.
The inactive p3066 section probe is
`27FC53BED43B38EC19F92883F2636D4DAE5103AED98F73C363CC6E8141ADEADE`.

## Tool-build reproducibility

The final two tool builds used fresh work and output directories:

```powershell
$root = 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812'
$source = "$root\mips-binutils-2.6-pristine"
$msys = "$root\msys64"
node tools\build_gnu_binutils_2_6.js --source $source --msys-root $msys --work "$root\repro-f-work" --output "$root\repro-f-bundle"
node tools\build_gnu_binutils_2_6.js --source $source --msys-root $msys --work "$root\repro-g-work" --output "$root\repro-g-bundle"
```

All nine production files in the F and G bundles are byte-identical and have the hashes in the
preceding table. The path-bearing build reports necessarily differ:

- F build report: `D7301C3A575C4951715344FA60FEDF57643D43071BF06C90D443AFB326FD125C`.
- G build report: `BE0E40AE2531CB1DF32F3537D9176197C0E828F089C04ABD0A5D123B2EEBFD7B`.

An earlier fresh `repro-e` build was a useful failed falsifier: `ld.exe` differed because checkout
timestamps allowed either the checked-in Bison 1.24 `ldgram.c` or regeneration by host Bison 3.8.
The recipe now runs `make -C ld -W ldgram.y ldgram.c` immediately after configure, forcing the
same parser-generation decision. Fresh builds F and G then reproduced all tool bytes.

## Production implementation

### Assembly/data baseline and link structure

The Phase 7 path now:

1. assembles every assembly/code owner and generated BSS/data object with GNU 2.6;
2. emits byte-oriented data assembly where GNU 2.6 syntax requires it;
3. removes ancillary object sections before linking;
4. uses a GNU-2.6-compatible linker script without `PHDRS` syntax;
5. validates the generated ELF structurally in project code;
6. requires one `PT_LOAD` per nonempty allocated output section with exact VMA, LMA, file size,
   memory size, and execute/write flags; and
7. extracts the 40 MiB ROM by LMA through the authenticated GNU 2.6 `objcopy`.

The audit-only 6,184-file tracked-assembly reconstruction applies the same target-section
adjustment and groups each parent chunk into one custom section. GNU 2.6 therefore cannot add its
ordinary `.text` end padding between tracked owners. That independent reconstruction is exact.

The old GNU 2.39 objdump assumptions in the asm-differ path are isolated behind a compatibility
shim for display/scoring only. Acceptance remains based on raw final linked bytes plus structural
ELF and map evidence.

### Direct KMC source-to-object path

The production C path records and verifies, per target:

- source classification and source hash;
- KMC compiler identity and compile flags;
- untouched KMC compiler-assembly hash;
- section-adjusted assembly hash;
- GNU 2.6 assembler identity and flags;
- source object and final object hashes;
- target-section hash; and
- normalized load-relevant relocation records.

Every one of the 37 proofs states `compilerAssemblyRewritten: false`. The adapter proof,
transformation counts, dialect assembly, and active adapter configuration have been removed.

## Hybrid migration ledger

All six initial GNU-2.6-incompatible targets were rebuilt and remain honestly classified
`HYBRID_C`:

| Target | Source | GNU 2.6 rewrite | Final result |
| --- | --- | --- | --- |
| `func_0002CD70` | `src/lib/memset_0002cd70.c` | Defines the local KMC `move` macro with explicit `or`, preserving the two retail OR encodings. | Exact, C-owned `HYBRID_C` |
| `func_0000BC8C` | `src/boot/boot_resource_record_resolve_load.c` | Restores the retail slow-path branch/delay-slot and byte-load source shape compatible with GNU 2.6. | Exact, C-owned `HYBRID_C` |
| `func_0015DF10` | `src/lib/func_0015DF10.c` | Makes the final call explicitly noreorder and supplies the retail trailing delay-slot `nop`. | Exact, C-owned `HYBRID_C` |
| `func_0002DE10` | `src/lib/mod_s64_tail.c` | Replaces two GNU-2.39-specific numeric absolute calls with `func_0002DBB4` and `func_0002DAB8` symbolic calls. | Exact, C-owned `HYBRID_C` |
| `func_00269798` | `src/lib/func_00269798.c` | Replaces the GNU-2.39-specific numeric absolute call with symbolic `func_0020D778`. | Exact, C-owned `HYBRID_C` |
| `func_0000B29C` | `src/boot/boot_resource_archive_load_one.c` | Re-expresses the incompatible inline macro conditional in GNU 2.6 syntax without changing retail words. | Exact, C-owned `HYBRID_C` |

No migration backlog or active fallback remains.

## Relocation-policy migration

The old `.pdr`-dependent contract has been replaced with source-to-object, target-section, and
load-relevant relocation evidence:

- 408 active load-relevant relocations are compared by section, offset, type, and normalized
  symbol identity.
- GNU 2.6 emits zero ancillary relocations in the active source objects.
- Thirty-eight legacy `.rel.pdr` records remain visible as retired ancillary metadata; zero are
  part of the active acceptance contract.
- `func_0000A1F8` self references are normalized to `.text` only when the relocation names that
  exact target definition at value zero in the target section, or is an `STT_SECTION` symbol at
  value zero for that exact target section. Offset and type remain exact. There is no broad
  symbol-name exception.
- The two numeric-call hybrid rewrites intentionally add modification-relevant symbolic call
  relocations: one `R_MIPS_26` at `func_00269798+0x2C` to `func_0020D778`, and two `R_MIPS_26`
  records at `func_0002DE10+0x0C/+0x28` to `func_0002DBB4`/`func_0002DAB8`.

`tests/workflow_parity.js` compares the frozen GNU 2.39 objects with GNU 2.6. It proves that no
old load-relevant relocation was removed, allows exactly the three symbolic-call additions above,
requires every new relocation list to equal the accepted per-target contract, and rejects any
other delta. It also requires identical linked addresses, sizes, target bytes, original-owner
exclusion, sole C ownership, KMC compiler identity/flags, and complete ROM bytes.

## Exact clean-build commands and outputs

The following environment and commands were used for both final runs, with `$name` set first to
`exact-c-final` and then to `exact-d-final`:

```powershell
$root = 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812'
$python = 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe'
$split = 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py'
$snapshot = 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source'
$asmDiffer = 'C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ'
$compiler = 'C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe'
$reviewRoot = 'C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1'
$env:WINDIR = "$reviewRoot\pinned-windows-runtime"
$env:DEVPATH = "$env:WINDIR\System32\WindowsPowerShell\v1.0"
$run = "$root\$name"

node tools\run_phase7_splat.js --output "$run\splat" --python $python --split $split --snapshot-root $snapshot
node tools\build_phase7_conventional.js --output "$run\phase7" --splat-output "$run\splat" --splat-python $python --splat-split $split --asm-differ $asmDiffer
node tools\verify_phase7_conventional.js --output "$run\phase7" --splat-python $python --splat-split $split --asm-differ $asmDiffer
node tools\build_phase8_matching_c.js --output "$run\phase8" --phase7-output "$run\phase7" --compiler $compiler --splat-python $python --splat-split $split --asm-differ $asmDiffer
node tools\verify_phase8_matching_c.js --output "$run\phase8" --compiler $compiler --splat-python $python --splat-split $split --asm-differ $asmDiffer --report "$run\phase8\verification.json"
```

Output roots:

- `C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\exact-c-final`
- `C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\exact-d-final`

Reproducibility comparisons:

```powershell
node tools\compare_phase7_reproducibility.js --left "$root\exact-c-final\phase7\build-report.json" --right "$root\exact-d-final\phase7\build-report.json" --report "$root\phase7-reproducibility-cd-final.json"
node tools\compare_phase8_reproducibility.js --left "$root\exact-c-final\phase8" --right "$root\exact-d-final\phase8" --report "$root\phase8-reproducibility-cd-final.json"
```

| Evidence | Result and SHA-256 |
| --- | --- |
| Phase 7 C/D build reports | Identical, `92DE30265353B8C10408AE78D3F6E0B4D6976B7E529358DCE27C8432801938AE` |
| Phase 7 reproducibility report file | PASS, `AD3FEED19EFA910A838334D9548C07E8777AB76F7495398A2E93C99A40631838` |
| Phase 8 C/D build reports | Identical, `47A0CAA4D96D511DD67C896A0FC5ED3E82BC8157E80BD3DD118BA5CFBF475F89` |
| Phase 8 C/D verification reports | Identical, `3BD24C6D862933C6DC6DCF6F61A1A82F7E41C1CB12C7660ACAABB7D7E7222719` |
| Phase 8 reproducibility report file | PASS, `85666C4273B4564BBBF18EBECB5D1818CCBFF0E5E898AA04398540EA5F2C67E2` |
| Phase 7 ELF | 100,531,079 bytes, `71AB57DB23CC8A0655472D22B4C31942F29A56D0095A92738314196F69CDF0A2` |
| Phase 8 ELF | 100,536,566 bytes, `AFA3A43D2241F0EEC9923DC463FA14B2B85B0058485A3C83713C73F345EC3D32` |
| Phase 7 ROM | Exact, canonical Rev 0 hash |
| Phase 8 ROM | Exact, canonical Rev 0 hash |

## Verification and regression commands

The final production and audit commands used the pinned PowerShell environment shown above.

```powershell
node tests\active_targets.js
node tests\source_policy.js
node tests\binutils_smoke.js
node tests\word_asm_smoke.js
node tests\diff_exactness.js
node tests\overlay_config.js
node tests\phase5b_capture_binding.js
node tests\phase5b_production_config.js --phase5a-root 'C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor'
node tests\phase7_conventional_build.js --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\exact-c-final\phase7'
node tests\phase8_matching_c.js --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\exact-c-final\phase8'
node tests\verify_setup_phase5a_root.js
node tests\workflow_acceptance.js --output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\exact-c-final\phase8'
node tests\workflow_parity.js --old-root 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\frozen-parity-root' --new-output 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-migration-20260812\exact-c-final\phase8'
node tools\verify_setup.js --phase5a-root 'C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor'
node tools\build.js
node tools\verify.js
node tools\diff.js func_0019554C
node tools\verify.js --target func_0019554C --require-pure
node tools\verify.js --target func_0002CD70 --require-pure
node tools\status.js
node tools\audit.js --phase5a-root 'C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor'
```

Results:

- All positive commands passed.
- The `func_0002CD70 --require-pure` command exited 1 as required and reported
  `NOT MATCHING C (HYBRID_C)` after all byte, ownership, relocation, and ROM gates passed.
- `tests/phase7_conventional_build.js` passed the baseline and rejected all 21 structural
  mutations.
- `tests/diff_exactness.js` passed and rejected all 15 malformed/raw-exactness mutations.
- A syntax pass checked all 81 JavaScript files under `tools/` and `tests/` with `node --check`.
- `tools/verify_setup.js` rebuilt all 6,184 tracked assembly owners through GNU 2.6 and passed the
  complete source-manifest/ROM setup gates.
- `tools/audit.js` returned `AUDIT PASS`; `build/audit/report.json` has SHA-256
  `B612F8FED33CE4BDB9E75C2EDAD84672269AC8295A5999D52C2C2C9AFEA7750D`.
- Frozen-workflow parity passed; `build/workflow-migration/parity.json` has SHA-256
  `8837F969E3B16951F7993CB7DC0C0248FB59EE655F058B451485D22D56AABD00`.
- The normal current output is
  `C:\Users\Joe\.codex\ob64-decomp-current\current\97a6a14ee75bbd3290f81551\build`.

The GNU 2.6 smoke suite authenticates the complete bundle and covers big-endian MIPS3/O32 flags,
real instructions, reorder/noreorder and delay slots, numeric and named-register `move`, protected
OR words, ordinary-C COP1 forms and the uppercase-prefix rejection, `la`/direct-`jal` behavior,
numeric and symbolic calls, macros and conditionals, section adjustment, one-section `PT_LOAD`
structure, LMA binary extraction, one exact tracked chunk, and rejection of active GNU 2.39 or
adapter dependencies.

## File-change ledger

### Added

- `config/gnu-binutils-2.6-build.json`
- `docs/Plans/ob64-gnu-binutils-2.6-toolchain-migration-20260812.md`
- `docs/audit/2026-08-12-gnu-binutils-2.6-toolchain-migration.md`
- `tools/build_gnu_binutils_2_6.js`
- `tools/toolchain/gnu-binutils-2.6-msys2-host.patch`
- `tools/toolchain/gnu-binutils-2.6-ob64-binary-lma.patch`
- `tools/toolchain/gnu-binutils-2.6-ob64-hi16-pairing.patch`
- `tools/toolchain/gnu-binutils-2.6-ob64-load-segments.patch`

### Modified

- `config/README.md`
- `config/matching-c-targets.json`
- `config/phase7/conventional-build.json`
- `config/phase8/matching-c.json`
- `config/toolchain.json`
- `docs/AUDIT.md`
- `docs/NEXT_STEPS.md`
- `docs/SOURCE_POLICY.md`
- `docs/TOOLCHAIN.md`
- `docs/WORKFLOW.md`
- `src/boot/boot_resource_archive_load_one.c`
- `src/boot/boot_resource_record_resolve_load.c`
- `src/lib/func_0015DF10.c`
- `src/lib/func_00269798.c`
- `src/lib/memset_0002cd70.c`
- `src/lib/mod_s64_tail.c`
- `tests/README.md`
- `tests/active_targets.js`
- `tests/binutils_smoke.js`
- `tests/diff_exactness.js`
- `tests/phase8_matching_c.js`
- `tests/source_policy.js`
- `tests/workflow_acceptance.js`
- `tests/workflow_parity.js`
- `tools/README.md`
- `tools/assemble_original_mips.js`
- `tools/audit.js`
- `tools/build_phase7_conventional.js`
- `tools/build_phase8_matching_c.js`
- `tools/compare_phase8_reproducibility.js`
- `tools/diff.js`
- `tools/lib/active_targets.js`
- `tools/lib/current_workflow.js`
- `tools/lib/phase7_conventional.js`
- `tools/lib/phase8_matching_c.js`
- `tools/lib/real_mips_toolchain.js`
- `tools/verify_phase7_conventional.js`
- `tools/verify_phase8_matching_c.js`
- `tools/verify_setup.js`

### Removed active adapter material

- `config/compiler-assembly-dialect.json`
- `tools/lib/compiler_assembly_dialect.js`
- `tests/compiler_assembly_dialect.js`
- `tests/compiler_assembly_dialect_candidate.js`
- `tests/fixtures/compiler-assembly-dialect/func_0002CD70.compiler.s`
- `tests/fixtures/compiler-assembly-dialect/func_0025C8A4.compiler.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-conditional.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-cop1-control-transfer.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-cop1-doubleword.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-cop1-extra-operand.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-cop1-labeled.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-cop1-named-register.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-cop1-numeric-label.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-cop1-out-of-range.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-coprocessor-move.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-floating-move.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-macro.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-named-register.s`
- `tests/fixtures/compiler-assembly-dialect/hostile-semicolon.s`
- `tests/fixtures/compiler-assembly-dialect/hybrid-balanced.s`
- `tests/fixtures/compiler-assembly-dialect/pure-cop1-transfers.s`
- `tests/fixtures/compiler-assembly-dialect/pure-numeric.s`
- `tests/fixtures/compiler-assembly-dialect/pure-zero.s`

## Independent review still required

The implementation has no known migration backlog, but acceptance still requires an independent
structural reviewer. The reviewer should, from a fresh external root:

1. authenticate commit `54514ded39ceb32165a125ddba04ca5b551773a2`, the MSYS2 package archives,
   all four patches, and the resulting nine-file bundle;
2. adversarially inspect the opt-in BFD changes for `PT_LOAD` count/flags, LMA recovery, binary
   extraction order, and symbol-matched `HI16`/`LO16` behavior;
3. reproduce both the tool bundle and two complete exact builds;
4. verify that GNU 2.39 and the compiler dialect adapter cannot be selected by active production
   code or configuration;
5. inspect all six hybrid rewrites and the exact three symbolic-call relocation additions;
6. falsify the `.pdr` retirement and the precise `func_0000A1F8` self-relocation normalization;
7. recheck sole ownership, original-owner exclusion, every target placement/byte contract, all
   7,268 load headers, and the complete ROM hash; and
8. confirm p3066 remains inactive and modified-game behavior is unchanged.

Until that review passes, the correct status is **implementation exact; structural acceptance
pending independent review**.
