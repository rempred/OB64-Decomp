# KMC COP1 uppercase-FPR-prefix correction evidence

Date: 2026-08-11 local / 2026-08-12 UTC

Worker status: the independent review's blocking grammar finding is corrected, and every assigned
focused, production, reproducibility, normal-verification, and heavyweight-audit gate passed. This
is still structural compiler-assembly work. A fresh independent critical review must pass before
the correction is accepted as canonical evidence or p3066 matching resumes.

## Scope and review basis

This is the focused follow-up to reviewed commit
`63cea9c0c238062f39c317d6f9a21743b64a6651`, whose parent is
`eedebbf2ae3b2cdb315d0ff0b47bda9a2804aa97`. The existing worker evidence and the supplied
independent-review report remain intact. The review verdict was `CORRECTION REQUIRED` because the
complete COP1 transfer regex used a regex-wide case-insensitive flag. That flag correctly made the
`mfc1` and `mtc1` mnemonics case-insensitive, but it also incorrectly made the operand prefix `$f`
case-insensitive.

Before editing, an independent direct adapter probe reproduced the defect for all four required
boundaries:

```text
mfc1 $0,$F0
mfc1 $31,$F31
mtc1 $0,$F0
mtc1 $31,$F31
```

Each returned a byte-identical result with zero total and per-rule transformations. That was the
expected reproduction of the review finding, not an acceptance result.

The starting `HEAD` was exactly
`63cea9c0c238062f39c317d6f9a21743b64a6651`. The only pre-existing untracked paths were
`.codex-remote-attachments/` and the supplied independent-review report. The attachment directory
remained untouched. The review report was preserved byte-identically and is included with this
correction record.

## Corrected matcher

The adapter change is one regex line. It removes the regex-wide `/i` flag and spells only the two
mnemonics with explicit ASCII case pairs:

```js
const numericCop1Transfer = /^([ \t]*)(?:[mM][fF][cC]1|[mM][tT][cC]1)([ \t]+)(\$(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*,[ \t]*)(\$f(?:0|[1-9]|[12][0-9]|3[01]))([ \t]*)$/;
```

Consequently:

- `mfc1` and `mtc1` retain their prior case-insensitive mnemonic behavior;
- the GPR remains canonical decimal `$0..$31`;
- the FPR remains canonical decimal `$f0..$f31` with an exactly lowercase `$f` prefix;
- a complete valid statement retains its original bytes and records zero transformations; and
- uppercase `$F`, named, malformed, labeled, extra-operand, out-of-range, COP0/control,
  doubleword, and `mov.*` forms do not enter this passthrough.

No parser label handling, mode tracking, move rule, `la`/direct-`jal` rule, relocation behavior,
source-class gate, or hybrid path changed. The proof schema remains 2, the dialect identity remains
`kmc-compiler-assembly-dialect-v2`, and the two ordered rule identities remain:

1. `move-numeric-gpr-gpr-to-addu-zero`;
2. `la-gpr4-undefined-c-linkage-identifier-direct-jal-c-linkage-identifier-delay-slot`.

A direct JSON comparison against the reviewed commit found all 37 active target entries unchanged
and the dialect manifest unchanged except for `implementationSha256`.

## Focused regression results

`node tests/compiler_assembly_dialect.js` passed with:

- 8,192 accepted canonical transfer statements: both mnemonics, every `0..31 x 0..31` GPR/FPR
  pair, and LF, CRLF, lone-CR, and missing-final-newline physical forms;
- byte-identical output and zero total and per-rule transformations for every accepted transfer;
- four separately accepted mixed-case mnemonic statements using lowercase `$f`;
- four focused uppercase-`$F` rejections covering `$F0` and `$F31` for both `mfc1` and `mtc1`;
- 11 other malformed-operand rejections;
- six symbolic, numeric-local, and whitespace-before-colon attached-label rejections;
- 72 named-register rejections;
- 12 out-of-range rejections;
- 25 COP/control/doubleword/`mov.*` exclusions; and
- 156 hostile rejections across the complete suite.

The existing move fixture still records two move transformations. The existing adjacent
`la`/direct-`jal` fixture still records one second-rule transformation. The deterministic test
proof SHA-256 remains
`05F0B5C9CA7FCEE315FBD4D7282384858BD74593FC62425120F339BD671C2389`.

The final test file is 22,683 bytes at SHA-256
`77356822CBB21BDD5B12D20D3FA740F00117114C90804A88C856487D5014C3DE`.

## Independent direct uppercase probe

The following read-only probe was run independently of the committed test file:

```powershell
@'
const { applyCompilerAssemblyDialect, DIALECT_RULE_IDS } = require('./tools/lib/compiler_assembly_dialect');
const canonical = [
  'MFC1 $0,$f0\n',
  'mFc1 $31,$f31\r\n',
  'MTC1 $0,$f31\r',
  'mTc1 $31,$f0',
];
const malformed = [
  'mfc1 $0,$F0\n',
  'mfc1 $31,$F31\n',
  'mtc1 $0,$F0\n',
  'mtc1 $31,$F31\n',
  'MFC1 $0,$F31\n',
  'mTc1 $31,$F0\n',
];
const accepted = canonical.map((source) => {
  const input = Buffer.from(source, 'utf8');
  const result = applyCompilerAssemblyDialect(input, 'PURE_C');
  if (!result.output.equals(input) || result.transformationCount !== 0
      || !DIALECT_RULE_IDS.every((ruleId) => result.ruleTransformations[ruleId] === 0)) {
    throw new Error(`canonical form changed or recorded a transformation: ${JSON.stringify(source)}`);
  }
  return source;
});
const rejected = malformed.map((source) => {
  try {
    applyCompilerAssemblyDialect(Buffer.from(source, 'utf8'), 'PURE_C');
  } catch (error) {
    if (!/numeric GPR and one numeric FPR operand/.test(error.message)) throw error;
    return source;
  }
  throw new Error(`uppercase FPR entered passthrough result path: ${source.trim()}`);
});
console.log(JSON.stringify({ status: 'pass', accepted: accepted.length, rejected: rejected.length }));
'@ | node -
```

It exited `0`. All four canonical mixed-case-mnemonic forms were byte-identical with zero total and
per-rule transformations. All six malformed uppercase forms threw the canonical numeric-operand
error before the adapter returned a result, so none could reach decision or proof generation.

## Ordinary-C probe

The pinned KMC compiler recompiled the prepared 126-byte ordinary-C probe using the production
flags:

```text
cc1.exe -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char -o C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\cop1-pure-probe.compiler.s C:\Users\Joe\.codex\ob64-p3066-pure-20260811\cop1-pure-probe.c
```

The compiled output matched the prepared compiler assembly byte-for-byte. A direct adapter gate
retained all 835 bytes, returned the same SHA-256, and recorded zero transformations under both
rules. GNU assembler then consumed the unchanged output with:

```text
.toolchains\gcc-toolchain-mips64-win64\bin\mips64-elf-as.exe -EB -mips3 -32 -o C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\cop1-pure-probe.o C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\cop1-pure-probe.dialect.s
```

| Probe artifact | Bytes | SHA-256 |
|---|---:|---|
| Source | 126 | `86AD9A9D911B0203C1893F8DC1DF475D4B782B60FA0C87A592D232286679D267` |
| Recompiled KMC assembly | 835 | `7A0086CA5648A9881D2635D3FD008E4939654E4C72A1A4B1EED9BF1F70AB44FA` |
| Adapted assembly | 835 | `7A0086CA5648A9881D2635D3FD008E4939654E4C72A1A4B1EED9BF1F70AB44FA` |
| GNU object | 1,364 | `C1ED38FE1AD23F93EBBB80C9A5ED4A3C1ABC6D205966CA4BC13C1DEECD992824` |
| GNU `.text` | 36 | `9CDBF616246E8A85A22CE643152BD5B7AAE6AB5D55AB349C74EB8B1FF0747AB1` |

The `.text` words include `0x44846000` (`mtc1 $4,$f12`) and `0x46806320`
(`cvt.s.w $f12,$f12`). The probe remains external evidence only and is not linked into the game.

## Authentication chain

| Artifact | Reviewed SHA-256 | Corrected SHA-256 |
|---|---|---|
| Adapter implementation | `B63E58E001972AAA90585FE3860815865F9C91DCD190184AC6445C7869A01DCA` | `2D836574E8BE28FFA2F6049B70431D4B63FCA7B402347BCE3DA7E5BB31E1CE63` |
| Dialect manifest | `65FAB2CBE178544FBB92294CA70AC6F45E44E096ED4E257250C163D8C2FE1784` | `F16E84F9754668C5FEBDF0094ED1C6A4AEF5954D6F7CEA8E9C49B05D707C1B37` |
| Active-target manifest with pin | `DC45002630BEE2E775FF90340578F5FB81BD15DDDF5BBC05927CD9E2C582A960` | `31886081D7E8191777B533FA37F894CF8AFFCD4A9C0DC95786AA70086FF6D59E` |

The preserved tool and policy identities are:

| Artifact | SHA-256 |
|---|---|
| KMC `cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| KMC reproduction manifest | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |
| GNU assembler 2.39 | `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697` |
| GNU toolchain config | `5A93298ED635C5FC6458C9DC1BBEB45A3EDCA7C4683D6E329BCE838E942B30FD` |
| Source-policy config | `C9373F7003A419CC8C1E9F6AF380134AFE2A56A0BFDDF575983AB651F5866F2A` |
| Phase 8 matching configuration | `5CBEA6E09F79E5B2253B0E03C3D154B4C066A79A3A148F42DB48E1BB64B1C626` |

The observed assembler version remained `GNU assembler (GNU Binutils) 2.39`, and production flags
remained `-EB -mips3 -32`. Compiler flags remained the pinned KMC `-O2`, big-endian, MIPS3,
gp32/fp32, `-G 0`, non-PIC, no-abicalls configuration.

## Two clean builds and strict recreation

The evidence root was absent before launch, and both clean output roots were absent:

```text
C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a
C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b
```

Each build used the same command except for `--output`:

```text
node tools\build_phase8_matching_c.js --output <clean-root> --phase7-output "C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Build A and build B each passed in 39.5 seconds. Each strict verifier used:

```text
node tools\verify_phase8_matching_c.js --output <clean-root> --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report <clean-root>\verification.json
```

Both strict verifiers passed in 34.7 seconds. `tests/phase8_matching_c.js` and
`tests/workflow_acceptance.js` passed against both roots. The A/B comparator command was:

```text
node tools\compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a" --right "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b" --report "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\reproducibility.json"
```

It exited `0` and matched all proofs, objects, compiler assemblies, dialect assemblies,
section-adjusted assemblies, target slices, relocations, reports, and major linked outputs.

| Artifact | Bytes | SHA-256 | A/B result |
|---|---:|---|---|
| Build report | 582,309 | `1677ECBC0F34051EE603F42095311D2E5D9AB7F33E0AF7E01CBD0985869DC102` | Identical |
| Strict verification | 216,782 | `F22640B859136002E57BD8EA2DAD49100A856E2DDF6BCE688ED66668B8949B5A` | Identical |
| Phase 8 ELF | 44,138,856 | `99301687400E68098B534E2844A3BB1BA566A022C60B89405DBCE282B206BCD8` | Identical |
| Link map | 7,052,114 | `673971907B1B473025A6ED679D184FD153137ABA93EA8FDF41DFED5E094C7DC0` | Identical |
| Layout | 5,423,901 | `96A9BA5804AFF5FBA0D5C5D8B3D53ABF021E3C3697E7AE7E7F165D8013D3F716` | Identical |
| Readelf report | 4,628,849 | `AB8A32B1DB3F17A0110476A89D629D1035F0D0C02AEEA45987FBA5A99528B641` | Identical |
| Object manifest | 36,453 | `B892C973B71313FFF19B3E4263C28E2D971BDE8CBBB3D2FE77E7EA00077DBCC7` | Identical |
| Full ROM | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Identical |
| Reproducibility report | 172,369 | `C9477A7BA0F43D9DFBA3C25B4262D361870A899FE96BDD180817CFA8A76A08E0` | Shared |

The ELF, map, layout, readelf report, object manifest, and ROM hashes are unchanged from the
reviewed commit's independently reproduced build. Only authentication-bearing reports changed.

## Production target preservation

Both clean roots and the canonical current build contain 37 verified target proofs: five
`PURE_C` and 32 `HYBRID_C`. They retain two transformed targets and 17 transformations, all under
the existing numeric move rule. The `la`/direct-`jal` rule remains at zero. All 32 hybrids remain
byte-identical with zero total and per-rule transformations.

| Target | Result | Placement / ownership | Preserved identities |
|---|---|---|---|
| p3063 / `func_0019554C` | Exact `PURE_C`; 14 move transformations; zero second-rule transformations; 32 normalized relocations | ROM `0x0019554C..0x001957D0`; VRAM `0x802150BC`; sole linked owner `objects/c/func_0019554C.o` | target `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B` |
| p3064 / `func_001957D0` | Exact `HYBRID_C`; zero transformations; raw/adapted byte-identical; 72 normalized relocations | ROM `0x001957D0..0x00195D9C`; VRAM `0x80215340`; sole linked owner `objects/c/func_001957D0.o` | raw/adapted `57A83F3F50A43AEE879082BD34EC02BC469B6977A17BCBF6CD6EA5D49ED58DCC`; target `E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B` |
| `func_0002CD70` | Exact `HYBRID_C`; zero transformations; raw/adapted byte-identical | ROM `0x0002CD70..0x0002CDA0`; VRAM `0x8009C970`; sole linked owner `objects/c/func_0002CD70.o` | raw/adapted `040B9057A3F11214D78D719ACD75E96621056A172A862C24120A9DC84DB66969`; target `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF` |

Direct big-endian ROM reads returned `0x00801025` at `func_0002CD70 + 0x004` and
`func_0002CD70 + 0x028`.

p3066 / `func_001960A8` remains absent from the 37-target C manifest. The production map retains
`.ob64.r3066` at ROM `0x001960A8`, VRAM `0x80215C18`, size `0x1690`, owned by
`objects/assembly/chunk_025.o`. Its untouched original assembly remains 111,239 bytes at SHA-256
`67AC5FF8BA0382C8D797F5765AC3B8F5FEF8195A1A73FECAEB1FAE850835FAE5`.

No `src/` or `asm/` path changed. No p3066 C source was created, activated, or edited.

## Normal verification and heavyweight audit

The final normal commands were:

```text
node tools\build.js
node tools\verify.js
node tools\audit.js
```

`build.js` passed in 40.4 seconds and produced an exact ROM. `verify.js` passed in 38.7 seconds with
exact ownership, placement, relocations, target bytes, and full-ROM bytes. `audit.js` passed in
392.7 seconds with `Structural protections: PASS`, `CURRENT exact ROM: PASS`, and
`RESULT: AUDIT PASS`.

The final current fingerprint is
`9E544D16D58AE1C1961AE095A95C84A9208D5B335BE05EB79D2DC6A26FA11D96`. Its output root is
`C:\Users\Joe\.codex\ob64-decomp-current\current\9e544d16d58ae1c1961ae095\build`.

| Generated evidence | Bytes | SHA-256 |
|---|---:|---|
| Active-target adapter report | 104,675 | `A8ABE10A333A2EE242561E4F662594D71D55751024A5A2FEBB841893D184A2EF` |
| Source-policy report | 135,523 | `A231B9F39FEA48D12416221AD0B2050B5FAF8F8B836E322044E2126F51C58E6E` |
| GNU binutils smoke report | 74,078 | `04516C158FE27BF27F537BDE1D7419219C4B9765200EEA38AF6BFFE70C16A640` |
| Structural setup report | 7,801 | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` |
| Current state | 1,106 | `90EA1A84C55AE1061B8D6B04761BC6F2DF380CD6F859258E0F5EA37FAE60D8E8` |
| Current strict verification | 216,782 | `F22640B859136002E57BD8EA2DAD49100A856E2DDF6BCE688ED66668B8949B5A` |
| Fresh compilation | 122,215 | `9AEC69948CACE9CC806FEA0123C065EAB3545339BFC090B452343260080DCAB5` |
| Final audit report | 2,197 | `E0B661519667E7BDC78B6140F4161E07D9BF478A525083CC8C9AD4843351F982` |

## Focused commands and results

Every final command below exited `0`:

```text
node --check tools\lib\compiler_assembly_dialect.js
node --check tests\compiler_assembly_dialect.js
node --check tests\binutils_smoke.js
node tests\compiler_assembly_dialect.js
node tests\active_targets.js
node tests\source_policy.js
node tools\source_policy.js
node tests\binutils_smoke.js
node tests\word_asm_smoke.js
node tools\build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a" --phase7-output "C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools\build_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b" --phase7-output "C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools\verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a\verification.json"
node tools\verify_phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b\verification.json"
node tests\phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a"
node tests\workflow_acceptance.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a"
node tests\phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b"
node tests\workflow_acceptance.js --output "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b"
node tools\compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-a" --right "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\clean-build-b" --report "C:\Users\Joe\.codex\ob64-cop1-uppercase-fpr-correction-20260811-r1\reproducibility.json"
node tools\build.js
node tools\verify.js
node tools\audit.js
git diff --check
```

The source-policy corpus retained five `PURE_C`, 32 `HYBRID_C`, zero `ASM`, and zero `UNKNOWN`
active targets. The GNU smoke suite retained the move encoding and `la`/direct-`jal` relocation
checks and the byte-identical numeric COP1 transfer smoke check. `word_asm_smoke` passed.

## Changed files and preservation

- `tools/lib/compiler_assembly_dialect.js` — scopes mnemonic case-insensitivity without relaxing
  the lowercase `$f` operand prefix.
- `tests/compiler_assembly_dialect.js` — adds the four uppercase boundary regressions, preserves
  mixed-case mnemonic acceptance, and expands exhaustive valid coverage to LF, CRLF, CR-only, and
  missing-final-newline corpora.
- `config/compiler-assembly-dialect.json` — refreshes the authenticated implementation SHA-256.
- `config/matching-c-targets.json` — refreshes the dialect-manifest SHA-256 pin.
- `docs/audit/2026-08-11-kmc-cop1-transfer-passthrough-independent-review.md` — supplied review
  record, added unchanged at 18,937 bytes and SHA-256
  `F54DD96724D57DE6BCF60B55D140B880CCBEFC331A026B789F30F385EF4F2CF8`.
- `docs/audit/2026-08-11-kmc-cop1-uppercase-fpr-prefix-correction-evidence.md` — this correction
  record.

The prior worker evidence remains unchanged at 18,683 bytes and SHA-256
`0F47F881CDE607536033798251609D8F2C7BD4D471384EE2E74C8498057552E4`.
`.codex-remote-attachments/` remains untracked and untouched.

No compiler, assembler, flags, source class, source target, ownership rule, placement, boundary,
segment, overlay, linker rule, or relocation policy changed.

## Failure and deviation record

The expected pre-correction direct probe accepted the four uppercase forms and reproduced the
review's blocking finding. After the one-line matcher correction, every final required test,
build, strict verifier, comparator, normal verifier, and heavyweight audit passed on its first
final invocation. No tracked-file diagnostic or production gate failed.

## Limits and review state

This correction proves only the narrow authenticated 32-bit numeric `mfc1`/`mtc1` passthrough.
Named registers, uppercase `$F`, labels, doubleword transfers, COP0/COP2/COP3 transfers,
control-register transfers, floating `mov.*` forms, and other unproven assembler modes and ABIs
remain outside the accepted domain.

Exact linked bytes do not prove the original source spelling. They prove that canonical lowercase
KMC compiler output can pass unchanged through the authenticated GNU 2.39 production path and
that malformed uppercase-FPR spellings do not enter that proof path.

The worker cannot independently accept this structural correction. A fresh independent critical
review must recheck the exact regex boundary, hostile probes, authentication chain, and exact
current build. p3066 must remain assembly-owned and paused until that review passes.
