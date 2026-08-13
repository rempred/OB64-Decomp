# GNU Binutils 2.6 independent-review correction evidence

Date: 2026-08-13

Correction base: `6a4db1a10c83e2ca4ea8324f19139e30c2658056`

Implementation branch: `codex/gnu-binutils-2.6-migration`

Status: `GB26-IR-001` and `GB26-IR-002` corrected; structural acceptance remains pending
proportional re-review by a different independent reviewer

## Result

This focused successor corrects only the two findings in
`2026-08-13-gnu-binutils-2.6-toolchain-migration-independent-review.md`.

- `GB26-IR-001`: the first-tracked-chunk smoke case now creates its case output directory before
  its first object or binary write. The evidence target, flags, source parts, expected range, and
  exact-byte comparison are unchanged.
- `GB26-IR-002`: source-policy preprocessing now authenticates the complete production executable
  chain before preprocessing. The tracked contract pins both the `mips64-elf-cpp.exe` driver and
  its selected `cc1.exe` engine by role, path, byte size, and SHA-256; the resolver also verifies
  that the driver selects the pinned engine.

No source owner, accepted placement, hybrid implementation, relocation rule, linker rule,
`PT_LOAD` rule, compiler identity, GNU 2.6 production-bundle identity, or modified-game behavior
changed. The result remains five exact `PURE_C` targets / 1,088 bytes and 32 exact `HYBRID_C`
targets / 8,120 bytes. p3066 remains inactive.

This record does not accept the structural migration. A different independent reviewer must
perform the proportional re-review described below.

## GB26-IR-001 correction

`verifyFirstTrackedChunk` in `tests/binutils_smoke.js` now creates
`build/toolchain-smoke/first_tracked_chunk` once, before entering the part loop and before the
first assembly or binary write. The loop still assembles the same tracked source parts and
compares the same 65,536-byte ROM interval.

The standalone smoke test was launched after the existing smoke root had been moved intact to:

`build/toolchain-smoke.pre-correction-7dd35fdc5fd74c5d932a10e0db66f67b`

`Test-Path build/toolchain-smoke` returned false before launch. The command was:

```powershell
node tests\binutils_smoke.js
```

All 13 checks passed, including `firstTrackedChunkExact`. The recreated report is 5,568 bytes
with SHA-256:

`5A4EB9B42006625FB09E02323CAFD18958E16A080BB3E91F1CD48866751C1E9D`

The final heavyweight audit was also launched with the complete `build/` directory absent. It
recreated `build/toolchain-smoke` and produced the same smoke-report hash.

## GB26-IR-002 correction

### Independently observed executable closure

The production driver was queried with `-v` and `-print-prog-name=cc1`. For preprocessing with the
accepted `-P -undef -nostdinc` flags, verbose output showed one invoked companion executable:
`libexec/gcc/mips64-elf/12.2.0/cc1.exe`.

That observation was falsified against a minimal external tree containing only these two files:

`C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813\closure-minimal-0074f42efc9a4c8ebe00fd44fc63e067`

The proof command was:

```powershell
$minimal = 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813\closure-minimal-0074f42efc9a4c8ebe00fd44fc63e067'
$repo = 'C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp'
& "$minimal\bin\mips64-elf-cpp.exe" -v -P -undef -nostdinc "-I$repo\include" "$repo\tests\fixtures\source-policy\ordinary.c"
```

It exited 0, emitted the expected preprocessed ordinary-C fixture, and the verbose command line
named the `cc1.exe` inside that minimal tree. A recursive file inventory contained exactly the
two executable files in the table below.

### Pinned identities

| Role | Tracked path | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| Driver | `.toolchains/gcc-toolchain-mips64-win64/bin/mips64-elf-cpp.exe` | 1,225,728 | `56D276AE66F2F499FAD2454663E8B5B82B20D5D7C44A4116349C096780FFF927` |
| Preprocessing engine | `.toolchains/gcc-toolchain-mips64-win64/libexec/gcc/mips64-elf/12.2.0/cc1.exe` | 21,875,200 | `40B1F1C1A2476FD1E286EDAFDEF6E352C188A722CF6E4AD9D58ED80C96F50A84` |

The driver reports `mips64-elf-cpp.exe (GCC) 12.2.0`. Its verbose output identifies the engine as
GCC 12.2.0. These executables classify source only. The matching compiler remains the separately
authenticated Windows KMC GCC 2.7.2 `cc1.exe`, SHA-256
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`.

### Fail-closed and reporting contract

`config/source-policy.json` is now schema 2 and declares the driver size plus a
`requiredExecutables` set. Configuration loading rejects malformed identities, duplicate roles,
duplicate paths, or a missing `preprocessing-engine`/`cc1` binding.

Before any source is preprocessed, `resolvePreprocessor` now:

1. authenticates the existing matching-compiler manifest and contract;
2. requires the driver to exist as a file and match its pinned byte size and SHA-256;
3. requires every declared companion executable to exist as a file and match its pinned byte size
   and SHA-256;
4. asks the authenticated driver to resolve each declared `driverProgram` and compares real paths,
   proving that the driver selects the pinned companion; and
5. verifies the driver version.

Individual-source classification returns `UNKNOWN` without a preprocessor identity if resolution
fails. Active-target classification throws and therefore cannot continue to preprocessing or
acceptance. Source-policy result digests and both generated report paths now bind and report the
complete executable identity set, in addition to the matching-compiler identity.

Focused regression coverage rejects all of these cases before preprocessing:

- missing driver;
- driver byte-size drift;
- driver SHA-256 drift with unchanged size;
- missing preprocessing engine;
- preprocessing-engine byte-size drift;
- preprocessing-engine SHA-256 drift with unchanged size; and
- a byte-identical engine at a path the authenticated driver does not select.

For every case, individual classification returned `UNKNOWN` with no preprocessor record, and
active-target classification threw the expected identity error.

## Changed files

- `config/README.md`
- `config/source-policy.json`
- `docs/SOURCE_POLICY.md`
- `docs/TOOLCHAIN.md`
- `tests/binutils_smoke.js`
- `tests/source_policy.js`
- `tools/lib/source_policy.js`
- `tools/source_policy.js`
- this successor evidence record

The frozen worker evidence report and the independent-review report were not edited. The
independent-review report remains untracked and unstaged. The unrelated
`.codex-remote-attachments/` directory remains untracked, unedited, and unstaged.

## Verification environment

The isolated verification checkout was detached at the correction base and then populated with
the eight correction files. All eight were byte-compared with the canonical working tree before
the final audit. Ignored local-tool configuration was supplied separately, and the ignored
`.toolchains` path was a read-only junction to the authenticated canonical tool roots.

```powershell
$repo = 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813-736038da\clean-repo'
$env:OB64_LOCAL_TOOLS = "$repo\config\local-tools.json"
$env:OB64_PARENT_ROOT = 'C:\Users\Joe\Projects\OgreBattlel64'
$runtime = 'C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\pinned-windows-runtime'
$env:WINDIR = $runtime
$env:DEVPATH = "$runtime\System32\WindowsPowerShell\v1.0"
```

Runner identities used by the correction verification were:

| Runner | Bytes | SHA-256 |
| --- | ---: | --- |
| Node.js `v24.13.1` | 91,406,496 | `E3BE0545990C90995D7BF3A7AF5D64AF1F2E0FC1BBD9B79C27F7ABC1E9676E50` |
| Pinned PowerShell `5.1.26100.8972` | 454,656 | `7600FFE12DA441FE89D035B13801E8E91D064BC544A27B19A5CF49F6AB8B18F5` |
| Pinned `System.Management.Automation.dll` | 6,670,848 | `13FB07233112F765DE69AE4CDE6728AF672442DC9C5D7C9412C830E27FC1FC26` |
| GNU 2.6 MSYS runner, `msys-2.0.dll` | 3,367,041 | `D9BB385834F1A235009F0962B7BDA7E1832FB12E53D832F1DC389C3144E03D44` |

The GNU 2.6 smoke report reauthenticated the unchanged `as`, `ld`, `objcopy`, `objdump`, `nm`,
`size`, `strings`, `strip`, and MSYS runner identities from the migration evidence.

## Commands and results

### Source-policy and focused regressions

```powershell
node tests\source_policy.js
node tools\source_policy.js
node tests\active_targets.js
node --check tests\binutils_smoke.js
node --check tests\source_policy.js
node --check tools\lib\source_policy.js
node --check tools\source_policy.js
```

Results:

- source-policy fixture and identity-drift suite: PASS;
- active target inventory: PASS, 37 targets;
- active source-policy classification: PASS, 5 `PURE_C`, 32 `HYBRID_C`, 0 `ASM`, 0
  `UNKNOWN`; and
- syntax checks: PASS.

The final audit source-policy report is 161,145 bytes with SHA-256
`90FF2FE7469F22E7CACD1CB300187D807293C682D68EDE5A112CD32143AFA6B5`.

### Fresh normal build and strict verification

The reusable current-state directory and an earlier setup-only `complete-work` directory were
moved intact to unique backup paths. Both the current-state path and this output root were absent
before the accepted run:

`C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813-736038da\complete-work`

```powershell
$env:OB64_WORK_ROOT = 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813-736038da\complete-work'
node tools\build.js
node tools\verify.js
```

The build created a new baseline and current output. The strict verifier passed baserom identity,
toolchain, source policy, C linker ownership, target placement, relocations, target bytes, and the
full ROM. Output root:

`C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813-736038da\complete-work\current\6a56b729830c3da941ebc250\build`

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| Build report | 554,271 | `3264CE24B1C34AF1B514E094ADF45638A36E8CEA3138AFA9A85BE9FF1B9FE6E9` |
| Phase 8 ELF | 100,536,566 | `AFA3A43D2241F0EEC9923DC463FA14B2B85B0058485A3C83713C73F345EC3D32` |
| Normalized Rev 0 ROM | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

### Heavyweight audit from clean generated state

Immediately before the final audit, the isolated worktree's complete `build/` directory was moved
intact to a unique backup and this audit work root did not exist:

`C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813-736038da\audit-final-work`

```powershell
$env:OB64_WORK_ROOT = 'C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813-736038da\audit-final-work'
node tools\audit.js --phase5a-root 'C:\Users\Joe\.codex\ob64-matching-c-worktrees\outputs\lane-c\row565-phase5b-sol-correction-r1\phase5a-cumulative-successor'
```

Result: `AUDIT PASS`. Structural protections and current exact-ROM verification both passed. The
audit rebuilt the complete 6,184-owner assembly/data baseline and recreated all generated
verification state. Its current output is:

`C:\Users\Joe\.codex\ob64-gnu-binutils-2.6-correction-20260813-736038da\audit-final-work\current\6a56b729830c3da941ebc250\build`

Final audit evidence:

| Evidence | Result |
| --- | --- |
| `build/audit/report.json` | PASS; SHA-256 `50036725594E91C99ABBE4C3C8901BD5822EE5447849FD7B2D58284EE018C853` |
| `build/current/verification.json` | EXACT BASELINE; SHA-256 `BBB1558AE9123CB0D6B460436B356B5CA3FEEEF1E459BCF6DB6F480B1FCCC23B` |
| Normalized ROM | 41,943,040 bytes; SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Active classifications | 5 `PURE_C`, 32 `HYBRID_C`, 0 `ASM`, 0 `UNKNOWN` |
| Active replacements | 37 exact targets; sole C ownership and accepted placement retained |
| ELF load structure | 7,268 load headers retained |
| Relocations | 408 load-relevant, 0 ancillary, 0 active `.pdr`; 38 retired `.pdr` records retained as evidence |
| KMC assembly rewrites | 0 |
| p3066 | inactive |

No hybrid source was rewritten by this correction. No relocation-policy rule changed.

## Proportional independent re-review route

Structural acceptance remains pending a different independent reviewer. The proportional review
should start from this focused correction commit and the original independent-review report, then:

1. reproduce `GB26-IR-001` by removing or moving `build/toolchain-smoke`, running the standalone
   smoke suite, and confirming the exact first-tracked-chunk evidence still passes;
2. independently query the production preprocessing driver with `-v` and
   `-print-prog-name=cc1`, and reproduce the two-executable minimal-tree falsifier;
3. authenticate both preprocessing executable paths, byte sizes, and SHA-256 values;
4. inspect the fail-before-preprocessing control flow and repeat all seven negative identity
   cases, including an exact-but-unbound `cc1.exe`;
5. confirm generated source-policy reports and result digests bind both executable identities;
6. run a clean heavyweight audit and strict exact-ROM verification; and
7. confirm the correction commit contains only these two corrections and this successor evidence,
   with the prior independent-review report unchanged.

The reviewer should issue a new independent verdict. This worker record is implementation
evidence, not independent acceptance.
