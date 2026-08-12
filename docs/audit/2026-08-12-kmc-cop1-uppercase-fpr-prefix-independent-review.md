# KMC COP1 uppercase-FPR-prefix fresh independent structural review

Date: 2026-08-12 local

Verdict: `ACCEPTED WITH NOTES`.

Correction commit `c3ee729802d22f1d99c1b5d04ce7cba3ae4e109e` is accepted over parent
`63cea9c0c238062f39c317d6f9a21743b64a6651`. No material grammar, authentication, ownership,
placement, relocation, toolchain, or exact-ROM finding remains.

The note is a reviewer-host setup deviation: Windows servicing advanced the installed PowerShell
engine after the worker audit. The repository's unmodified fail-closed check rejected that drift.
Reviewer builds therefore used an isolated copy of the still-present pinned engine from the Windows
component store. The final build reports authenticate the required PowerShell executable hash and
version, and PowerShell is used only for that runtime-identity check. The KMC compiler and GNU 2.39
production assembler were unchanged.

p3066 remained assembly-owned and paused for the complete review. This review created, edited,
activated, and tested no p3066 C match. Because the correction is accepted, the project owner may
now unpause p3066. This report itself does not unpause or begin that work.

## Frozen subject and exact delta

The reviewed worktree began at the exact subject commit. Its first parent was the requested parent.
The only pre-existing untracked path was `.codex-remote-attachments/`; it remained untouched.

The commit changes exactly six paths:

- `tools/lib/compiler_assembly_dialect.js` — one matcher line;
- `tests/compiler_assembly_dialect.js` — focused uppercase-prefix, mnemonic-case, and physical-form
  coverage;
- `config/compiler-assembly-dialect.json` — implementation hash only;
- `config/matching-c-targets.json` — dialect-manifest hash pin only;
- `docs/audit/2026-08-11-kmc-cop1-transfer-passthrough-independent-review.md` — the supplied rejected
  review record; and
- `docs/audit/2026-08-11-kmc-cop1-uppercase-fpr-prefix-correction-evidence.md` — the worker correction
  record.

`git diff --check` passed. No `src/` or `asm/` path changed. Parsed parent/subject JSON comparison
found all 37 active target entries identical. The dialect manifest changed only
`implementationSha256`; the active-target manifest changed only the containing dialect-manifest
pin.

| Subject artifact | SHA-256 |
|---|---|
| Adapter implementation | `2D836574E8BE28FFA2F6049B70431D4B63FCA7B402347BCE3DA7E5BB31E1CE63` |
| Dialect manifest | `F16E84F9754668C5FEBDF0094ED1C6A4AEF5954D6F7CEA8E9C49B05D707C1B37` |
| Active-target manifest | `31886081D7E8191777B533FA37F894CF8AFFCD4A9C0DC95786AA70086FF6D59E` |
| Dialect test | `77356822CBB21BDD5B12D20D3FA740F00117114C90804A88C856487D5014C3DE` |
| Prior independent review | `F54DD96724D57DE6BCF60B55D140B880CCBEFC331A026B789F30F385EF4F2CF8` |
| Worker correction evidence | `640F7B4DFC8CD3DD498F2393629A9A734EADD7C421DECB2906F0184A3640FB34` |

The manifest pins exactly match the implementation and dialect-manifest files.

## Correction inspection

The implementation delta removes the regex-wide case-insensitive flag and explicitly scopes ASCII
case folding to the two mnemonics:

```js
const numericCop1Transfer = /^([ \t]*)(?:[mM][fF][cC]1|[mM][tT][cC]1)([ \t]+)(\$(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*,[ \t]*)(\$f(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*)$/;
```

The complete matcher therefore retains all ASCII case spellings of `mfc1` and `mtc1`, while the
FPR prefix remains exactly lowercase `$f`. Both register numbers retain the canonical decimal
`0..31` grammar. The surrounding parser still rejects an attached symbolic or numeric label before
testing the matcher and returns the original complete line body and physical line ending unchanged
for a valid transfer.

No label lexer, mode tracker, move rule, `la`/direct-`jal` rule, relocation path, source-class gate,
proof schema, or hybrid branch changed.

## Independent grammar probe

The reviewer-owned probe did not import the committed test matrix. It loaded the parent adapter
directly from Git, loaded the subject adapter from the worktree, generated independent corpora,
and compared decisions and bytes.

| Probe artifact | Bytes | SHA-256 |
|---|---:|---|
| `build/audit/2026-08-12-cop1-uppercase-fpr-independent-probe.js` | 17,003 | `DAFA251AD7C16706400CF25B6708B7439F0D18C54F21ED4265253D543CCA2BDB` |
| Probe report | 3,283 | `06013B924367735532AA88E74FDD2C18F21A5E112D64A43EC3177E9A85C6ABCB` |

### Canonical acceptance

The probe exercised 8,192 complete canonical statements: both mnemonics, every
`0..31 × 0..31` GPR/FPR pair, varied spaces/tabs/comments, and four physical forms. Every input was
byte-identical after adaptation and recorded zero total and per-rule transformations. A repeated
application returned the same result.

| Physical form | Statements | Input/output SHA-256 |
|---|---:|---|
| LF | 2,048 | `4655C625881D1F128EAF5DAC156A86F004B0A93431D2CF77C0D9758515BBD286` |
| CRLF | 2,048 | `36D5AEF90A9C80859846C4501C06360983CA60D97C6AC69AA69ED39C7958D074` |
| CR-only | 2,048 | `46F1BD33FB1A979E6DF48FFA17906D03F3C5337AF5C217BD30B6858C2A225183` |
| Missing final newline | 2,048 | `9E6FBF752863910C0BC27419D0BED839AE62EC565DB914F663324213BAB305B0` |

All 16 distinct ASCII case spellings of `mfc1`/`mtc1` accepted lowercase `$f` at both operand
boundaries under all four physical forms. This supplied 256 independent mixed-case acceptance
cases.

### Uppercase-prefix falsifier

The probe combined all 16 mnemonic spellings with GPR boundaries `0` and `31`, uppercase FPR
boundaries `$F0` and `$F31`, and all four physical forms. The parent returned a zero-transformation
result for all 256 cases, independently reproducing the rejected defect. The subject threw the
canonical numeric-operand error for all 256 before returning any decision; none could reach proof
generation.

### Hostile and excluded forms

The independent matrix observed:

- 76 invalid or noncanonical operand rejections, including signed, hexadecimal, leading-zero,
  Unicode-digit, named-GPR, named-FPR, uppercase-`$F`, missing-prefix, and type-reversed forms;
- 38 missing, reversed, punctuation, semicolon, and extra-operand rejections;
- 18 attached symbolic, dot/dollar, multiple, and numeric-label rejections;
- four separate-label controls retained byte identity, including numeric labels;
- 27 COP0/COP2/COP3, control-register, doubleword, and `mov.s`/`mov.d`/`mov.ps` rejections;
- three `#APP`/`#NO_APP` rejections plus `UNKNOWN`, `ASM`, and invalid-UTF-8 fail-closed gates; and
- three malformed/non-UTF-8 `HYBRID_C` inputs retained byte identity with zero transformations.

Token-distinct generic mnemonics such as `mfc1.s` and `mtc10` retain the parent's generic
fail-later behavior. They do not enter the exact `mfc1`/`mtc1` validation branch, and GNU rejects
them if presented to the complete toolchain. This pre-existing parser policy is outside the
correction.

### Preserved dialect behavior

Parent/subject differential probing compared 4,096 complete numeric `move` statements across the
same four physical forms. Every output and decision matched. It also compared 20 positive,
excluded, labeled, numeric-labeled, mode, symbol, register, expression, and intervening-statement
`la`/direct-`jal` cases. Every success, rejection, output byte, and transformation count matched.
Three hybrid inputs also matched parent behavior exactly.

## Committed focused gates

The committed suites independently passed after the out-of-suite probe:

- dialect syntax checks and `tests/compiler_assembly_dialect.js`;
- `tests/active_targets.js` with 37 authenticated targets;
- `tests/source_policy.js`, including `PURE_C`, `HYBRID_C`, `ASM`, and `UNKNOWN` fixtures;
- GNU binutils smoke tests, including numeric move encoding, `la`/direct-`jal` logical
  relocations, and byte-identical COP1 transfers; and
- `tests/word_asm_smoke.js`.

The committed dialect suite reported 8,192 canonical transfers, four uppercase-prefix
rejections, 156 total hostile rejections, unchanged move and `la`/`jal` fixtures, and deterministic
proof SHA-256 `05F0B5C9CA7FCEE315FBD4D7282384858BD74593FC62425120F339BD671C2389`.

The full source-policy corpus retained five `PURE_C`, 32 `HYBRID_C`, zero `ASM`, and zero `UNKNOWN`
active targets. Focused classification returned p3063 as `PURE_C` and p3064 as `HYBRID_C`.

## Ordinary-C and GNU assembler probe

The reviewer independently recompiled the existing 126-byte ordinary-C probe with the pinned KMC
compiler and production flags. The adapter retained the compiler output byte-for-byte with zero
total and per-rule transformations. GNU assembler then consumed the unchanged assembly with
`-EB -mips3 -32`.

| Probe artifact | Bytes | SHA-256 |
|---|---:|---|
| C source | 126 | `86AD9A9D911B0203C1893F8DC1DF475D4B782B60FA0C87A592D232286679D267` |
| KMC compiler assembly | 835 | `7A0086CA5648A9881D2635D3FD008E4939654E4C72A1A4B1EED9BF1F70AB44FA` |
| Adapted assembly | 835 | `7A0086CA5648A9881D2635D3FD008E4939654E4C72A1A4B1EED9BF1F70AB44FA` |
| GNU object | 1,364 | `C1ED38FE1AD23F93EBBB80C9A5ED4A3C1ABC6D205966CA4BC13C1DEECD992824` |
| GNU `.text` | 36 | `9CDBF616246E8A85A22CE643152BD5B7AAE6AB5D55AB349C74EB8B1FF0747AB1` |

The object contains `0x44846000` (`mtc1 $4,$f12`) and the expected
`R_MIPS_26 consume_float` and `.rel.pdr` `R_MIPS_32 cop1_pure_probe` relocations. This external
probe was not linked into the game and did not test a p3066 C match.

## Authentication and production toolchain

| Contract item | Independently observed value |
|---|---|
| KMC `cc1.exe` SHA-256 | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| KMC reproduction manifest | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |
| Compiler flags | `-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char` |
| GNU assembler SHA-256 | `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697` |
| GNU assembler version | `GNU assembler (GNU Binutils) 2.39` |
| GNU assembler flags | `-EB -mips3 -32` |
| Source-policy config | `C9373F7003A419CC8C1E9F6AF380134AFE2A56A0BFDDF575983AB651F5866F2A` |
| Phase-8 matching config | `5CBEA6E09F79E5B2253B0E03C3D154B4C066A79A3A148F42DB48E1BB64B1C626` |

GNU 2.39 remained the production assembler. No historical assembler entered either build.

## Two reviewer-owned clean builds

The reviewer root did not exist before launch:

```text
C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1
```

Both production builds and both strict verifiers passed. Phase-8 regression and workflow-acceptance
suites passed against both roots. The reproducibility comparator matched all 37 proofs, objects,
raw compiler assemblies, dialect assemblies, section-adjusted assemblies, linked target slices,
normalized relocation sets, reports, and major linked artifacts.

| Clean artifact | Bytes | SHA-256 | A/B result |
|---|---:|---|---|
| Build report | 582,309 | `1677ECBC0F34051EE603F42095311D2E5D9AB7F33E0AF7E01CBD0985869DC102` | Identical |
| Strict verification | 216,782 | `F22640B859136002E57BD8EA2DAD49100A856E2DDF6BCE688ED66668B8949B5A` | Identical |
| Phase-8 ELF | 44,138,856 | `99301687400E68098B534E2844A3BB1BA566A022C60B89405DBCE282B206BCD8` | Identical |
| Link map | 7,052,114 | `673971907B1B473025A6ED679D184FD153137ABA93EA8FDF41DFED5E094C7DC0` | Identical |
| Layout | 5,423,901 | `96A9BA5804AFF5FBA0D5C5D8B3D53ABF021E3C3697E7AE7E7F165D8013D3F716` | Identical |
| Readelf report | 4,628,849 | `AB8A32B1DB3F17A0110476A89D629D1035F0D0C02AEEA45987FBA5A99528B641` | Identical |
| Object manifest | 36,453 | `B892C973B71313FFF19B3E4263C28E2D971BDE8CBBB3D2FE77E7EA00077DBCC7` | Identical |
| Full ROM | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Identical |
| Reproducibility report | 172,369 | `C9477A7BA0F43D9DFBA3C25B4262D361870A899FE96BDD180817CFA8A76A08E0` | Shared |

The reviewer artifact authenticator is 16,090 bytes at SHA-256
`C89B58B59FE4AAAD5023267D4F499AE1CEAD326954363B27115323D1926490C5`. Its final report is 5,880
bytes at SHA-256 `B5C9B758C2B3CD5390D3D201195AACB354DFDF314398EBAAC62159DCC83FEA96`.

## Target, ownership, placement, and relocation preservation

Both builds report 37 proofs, five pure targets, 32 hybrid targets, two transformed targets, and 17
transformations. All 17 transformations belong to the existing numeric-move rule; the
`la`/direct-`jal` rule remains at zero. Every hybrid raw/adapted pair is byte-identical and records
zero total and per-rule transformations.

| Target | Result | Placement and owner | Preserved identity |
|---|---|---|---|
| p3063 / `func_0019554C` | Exact `PURE_C`; exactly 14 move transformations; 32 normalized relocations | ROM `0x0019554C..0x001957D0`; VRAM `0x802150BC`; `objects/c/func_0019554C.o` | `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B` |
| p3064 / `func_001957D0` | Exact `HYBRID_C`; zero transformations; 72 normalized relocations | ROM `0x001957D0..0x00195D9C`; VRAM `0x80215340`; `objects/c/func_001957D0.o` | raw/adapted `57A83F3F50A43AEE879082BD34EC02BC469B6977A17BCBF6CD6EA5D49ED58DCC`; target `E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B` |
| `func_0002CD70` | Exact `HYBRID_C`; zero transformations | ROM `0x0002CD70..0x0002CDA0`; `objects/c/func_0002CD70.o` | `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF` |
| p3066 / `func_001960A8` | `tracked-assembly`; absent from active C targets | ROM `0x001960A8..0x00197738`; VRAM `0x80215C18`; `objects/assembly/chunk_025.o` | assembly `67AC5FF8BA0382C8D797F5765AC3B8F5FEF8195A1A73FECAEB1FAE850835FAE5` |

Direct GNU object-section extraction and direct rebuilt-ROM reads returned `0x00801025` at
`func_0002CD70 + 0x004` and `+0x028` in both builds. The 48-byte object target and ROM slice were
identical at SHA-256 `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

The exact commit delta, unchanged layout/map/ELF hashes relative to the reviewed parent state,
strict ownership checks, and authenticated structural audit show no ownership, placement,
boundary, segmentation, overlay, compiler, assembler, linker, or relocation-policy change.

## Normal verification and heavyweight audit authentication

`node tools/build.js` passed and reused the corrected current fingerprint. `node tools/verify.js`
then independently recompiled every active source and passed baserom identity, authenticated
toolchain, source policy, sole C ownership, placement, relocations, target bytes, and complete-ROM
bytes.

The independently recomputed current fingerprint is
`9E544D16D58AE1C1961AE095A95C84A9208D5B335BE05EB79D2DC6A26FA11D96`; the accepted baseline
fingerprint is `2BB2A732D8CEA5495220ADEB911D6EE7664BA38F0DE54F5B9DE87376E95A5252`.

The worker's heavyweight audit was not repeated because its evidence was sufficient and fully
authenticated:

- audit report SHA-256 `E0B661519667E7BDC78B6140F4161E07D9BF478A525083CC8C9AD4843351F982`;
- structural report SHA-256 `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41`;
- strict current verification SHA-256
  `F22640B859136002E57BD8EA2DAD49100A856E2DDF6BCE688ED66668B8949B5A`;
- corrected implementation and manifest identities embedded in the audit report;
- both protected words embedded in the audit report; and
- every audit/current major linked artifact byte-identical to both reviewer builds.

The audit reports `Structural protections: PASS`, `CURRENT exact ROM: PASS`, and
`RESULT: AUDIT PASS` for the corrected fingerprint. Repeating it would exercise the same structural
falsifiers and exact linked artifacts already authenticated here.

## Claim/falsifier matrix

| Material claim | Smallest concrete falsifier | Result |
|---|---|---|
| Mnemonics remain case-insensitive | Any of 16 ASCII spellings rejects with lowercase `$f` | Not observed; 256 boundary/physical-form cases passed |
| Only canonical numeric operands enter the COP1 branch | Any named, signed, hexadecimal, leading-zero, Unicode-digit, reversed, missing, extra, out-of-range, or uppercase-`$F` form returns a result | Not observed |
| Uppercase `$F0`/`$F31` is fixed | Any required mnemonic/case/operand/line-ending combination returns a decision | Not observed; all 256 threw before result |
| Valid statements are true passthrough | Any valid corpus changes a byte or increments a total/per-rule counter | Not observed across 8,192 statements |
| Attached labels reject | Any symbolic or numeric attached label returns a result | Not observed across 18 cases |
| COP/control/doubleword/`mov.*` remains excluded | Any excluded mnemonic returns a supported-transfer result | Not observed across 27 cases |
| Move and `la`/`jal` behavior is preserved | Any parent/subject output, error, or decision differs outside uppercase `$F` | Not observed across 4,096 moves and 20 `la`/`jal` cases |
| `HYBRID_C` remains opaque | Any hybrid raw/adapted pair differs or records a transformation | Not observed in hostile probes or all 32 production hybrids |
| Authentication chain is valid | Implementation, dialect-manifest, or active-target pin differs | Not observed |
| Production toolchain is preserved | Compiler/assembler identity or flags differ, or GNU 2.39 is not used | Not observed |
| Ownership/placement/relocations are preserved | Strict verifier failure, wrong map owner, layout drift, or relocation drift | Not observed |
| p3063 and p3064 regressions are preserved | Class, count, relocation, raw/adapted, or target hash drift | Not observed |
| Protected OR words are preserved | Either object or ROM word differs from `0x00801025` | Not observed in either build |
| Complete build remains retail exact | Either clean ROM differs from the canonical hash | Not observed |
| p3066 remains paused and assembly-owned | Active target/source appears or map owner differs | Not observed |

## Exact commands

Repository and delta inspection:

```powershell
git status --short --branch
git rev-parse HEAD
git rev-parse c3ee729802d22f1d99c1b5d04ce7cba3ae4e109e^
git diff --name-status 63cea9c0c238062f39c317d6f9a21743b64a6651 c3ee729802d22f1d99c1b5d04ce7cba3ae4e109e
git diff --check 63cea9c0c238062f39c317d6f9a21743b64a6651 c3ee729802d22f1d99c1b5d04ce7cba3ae4e109e
git diff --name-only 63cea9c0c238062f39c317d6f9a21743b64a6651 c3ee729802d22f1d99c1b5d04ce7cba3ae4e109e -- src asm
```

Independent and focused probes:

```powershell
node --check build\audit\2026-08-12-cop1-uppercase-fpr-independent-probe.js
node build\audit\2026-08-12-cop1-uppercase-fpr-independent-probe.js
node --check tools\lib\compiler_assembly_dialect.js
node --check tests\compiler_assembly_dialect.js
node --check tests\binutils_smoke.js
node tests\compiler_assembly_dialect.js
node tests\active_targets.js
node tests\source_policy.js
node tests\binutils_smoke.js
node tests\word_asm_smoke.js
node tools\source_policy.js
node tools\source_policy.js --target func_0019554C
node tools\source_policy.js --target func_001957D0
```

Ordinary-C probe:

```powershell
& "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char -o "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\cop1-pure-probe.compiler.s" "C:\Users\Joe\.codex\ob64-p3066-pure-20260811\cop1-pure-probe.c"
& ".toolchains\gcc-toolchain-mips64-win64\bin\mips64-elf-as.exe" -EB -mips3 -32 -o "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\cop1-pure-probe.o" "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\cop1-pure-probe.dialect.s"
& ".toolchains\gcc-toolchain-mips64-win64\bin\mips64-elf-objcopy.exe" -O binary -j .text "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\cop1-pure-probe.o" "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\cop1-pure-probe.text.bin"
& ".toolchains\gcc-toolchain-mips64-win64\bin\mips64-elf-readelf.exe" -r "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1\cop1-pure-probe.o"
```

The adapter equality/zero-count check was an inline Node `Buffer.equals()` gate using
`applyCompilerAssemblyDialect(..., 'PURE_C')` and both exported rule IDs.

Reviewer runtime environment used for final production commands:

```powershell
$reviewRoot = 'C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-independent-review-c3ee7298-r1'
$env:WINDIR = "$reviewRoot\pinned-windows-runtime"
$env:DEVPATH = "$env:WINDIR\System32\WindowsPowerShell\v1.0"
& "$env:WINDIR\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -Command '$PSVersionTable.PSVersion.ToString(); [System.Management.Automation.PSObject].Assembly.Location'
```

That isolated runtime contains the unchanged pinned `powershell.exe` and the component-store
`10.0.26100.8972` `System.Management.Automation.dll`; its reviewer-local
`powershell.exe.config` adds only:

```xml
<developmentMode developerInstallation="true" />
```

The two build commands differed only by `clean-build-a` and `clean-build-b`:

```powershell
node tools\build_phase8_matching_c.js --output "$reviewRoot\clean-build-a" --phase7-output "C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools\build_phase8_matching_c.js --output "$reviewRoot\clean-build-b" --phase7-output "C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Strict verification, regression, comparison, and normal gates:

```powershell
node tools\verify_phase8_matching_c.js --output "$reviewRoot\clean-build-a" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "$reviewRoot\clean-build-a\verification.json"
node tools\verify_phase8_matching_c.js --output "$reviewRoot\clean-build-b" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "$reviewRoot\clean-build-b\verification.json"
node tests\phase8_matching_c.js --output "$reviewRoot\clean-build-a"
node tests\workflow_acceptance.js --output "$reviewRoot\clean-build-a"
node tests\phase8_matching_c.js --output "$reviewRoot\clean-build-b"
node tests\workflow_acceptance.js --output "$reviewRoot\clean-build-b"
node tools\compare_phase8_reproducibility.js --left "$reviewRoot\clean-build-a" --right "$reviewRoot\clean-build-b" --report "$reviewRoot\reproducibility.json"
node tools\build.js
node tools\verify.js
node --check build\audit\2026-08-12-cop1-uppercase-fpr-independent-artifact-auth.js
node build\audit\2026-08-12-cop1-uppercase-fpr-independent-artifact-auth.js
git diff --check
```

## Setup deviations and limits

- The first production-build launch stopped before compilation with `Windows PowerShell version
  drift`: the serviced host reported `5.1.26100.9168`, while the pinned contract requires
  `5.1.26100.8972`. The executable SHA-256 still matched the pin. The failed launch created only an
  empty build-A directory. Final builds used the isolated pinned engine described above and passed
  the unmodified check.
- An initial isolated launch still resolved the serviced GAC engine. Enabling .NET development
  probing only in the reviewer-local copied configuration and setting `DEVPATH` selected the
  component-store `8972` assembly. Its SHA-256 is
  `13FB07233112F765DE69AE4CDE6728AF672442DC9C5D7C9412C830E27FC1FC26`.
- The first review-root creation command used an unsupported `New-Item -LiteralPath` parameter. It
  created nothing; retrying with `-Path` created the intended root.
- A PowerShell byte-comparison diagnostic attempted unavailable `Byte.AsSpan()` and failed after
  the ordinary-C compile and assembly had already succeeded. A Node `Buffer.equals()` comparison
  then proved byte identity. No output was rebuilt or accepted from the failed diagnostic.
- A broad read-only `rg` search over the large assembly corpus timed out. A narrowed file-list
  search found the p3066 owner without changing any file.
- The first artifact-authenticator run compared a zero-padded map address as text and rejected a
  correct owner line. Numeric address normalization fixed the reviewer script; the final report
  passed.
- The heavyweight audit was authenticated, not repeated. Its corrected fingerprint, identities,
  strict report, structural report, linked outputs, and protected words all match independent
  reviewer evidence.
- Exact output proves the accepted compiler-assembly and retail-byte contracts. It does not prove
  which source spelling the original developers used.

No failed final grammar probe, committed suite, production build, strict verifier, reproducibility
comparison, normal verifier, artifact authenticator, ownership check, relocation check, or exact-ROM
gate remains.

## Admissible findings

None.

## Route

The project owner may accept correction commit
`c3ee729802d22f1d99c1b5d04ce7cba3ae4e109e` and unpause p3066. Any later implementation,
manifest, active-target array, source, toolchain, placement, relocation, target, protected-word, or
ROM hash drift falsifies this acceptance and requires p3066 to pause again.
