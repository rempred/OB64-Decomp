# KMC COP1 transfer passthrough correction evidence

Date: 2026-08-11 local / 2026-08-12 UTC

Worker status: the focused implementation and every assigned verification gate passed. This is a
structural compiler-assembly contract change, so independent critical review remains required
before the correction is accepted as canonical evidence or p3066 matching resumes.

## Scope and starting state

The starting repository state was commit
`eedebbf2ae3b2cdb315d0ff0b47bda9a2804aa97` on `main`, ahead of `origin/main` by 18 commits. The
only pre-existing unrelated worktree path was untracked `.codex-remote-attachments/`; it remained
untouched.

The current schema-2 PURE_C parser rejected every mnemonic matching `d?m[ft]c[0-3]`. That broad
prohibition included ordinary KMC GCC output such as `mtc1 $4,$f12`, so ordinary floating-point C
could fail before GNU assembly. The prepared minimal C probe reproduced the rejection with
`PURE_C compiler assembly contains unsupported move syntax: mtc1`.

This correction changes no compiler, assembler, flag, source class, active target, owner, placement,
segment, boundary, relocation policy, or linker rule. It does not add or edit a p3066 C source. The
p3066 assembly owner remains active and its source SHA-256 remains
`67AC5FF8BA0382C8D797F5765AC3B8F5FEF8195A1A73FECAEB1FAE850835FAE5`.

## Corrected target-blind contract

For authenticated `PURE_C` compiler output, the parser now recognizes only complete `mfc1` and
`mtc1` statements with this operand domain:

```text
general-purpose register: $0 through $31, canonical decimal spelling
floating-point register: $f0 through $f31, canonical decimal spelling
operand order:            $N,$fN
attached label:           prohibited
extra operand:            prohibited
```

Whitespace and a trailing assembler comment may be present. Once validated, the original line
body and original LF, CRLF, CR, or absent terminal line ending are emitted unchanged. No rewrite
rule counter is incremented, so accepted transfers record zero total and zero per-rule
transformations.

The narrow validator runs before the existing broad move-family prohibition. Malformed `mfc1` and
`mtc1` operands reject. Named GPRs, named or malformed FPRs, attached labels, missing operands,
reversed operands, extra operands, and registers outside 0 through 31 reject. `mfc0`/`mtc0`, COP2
and COP3 transfers, all `cfc*`/`ctc*` control-register transfers, all tested `dmfc*`/`dmtc*`
doubleword forms, and `mov.s`/`mov.d`/`mov.ps` remain rejected.

The shared label lexer now recognizes both symbolic labels and GNU numeric local labels, including
optional whitespace before the colon. This closes attached forms such as `1: mtc1 $4,$f12` without
changing either existing rewrite rule.

The dialect identity remains `kmc-compiler-assembly-dialect-v2`, proof schema remains 2, and the
two ordered transformation rules remain unchanged:

1. `move-numeric-gpr-gpr-to-addu-zero`;
2. `la-gpr4-undefined-c-linkage-identifier-direct-jal-c-linkage-identifier-delay-slot`.

`HYBRID_C` still bypasses parsing as opaque byte-identical data with zero transformations. Test
input containing labeled, named, out-of-range, extra-operand, and doubleword COP1 syntax confirmed
that the hybrid path remains opaque.

## Authenticated identities

| Artifact | Starting SHA-256 | Corrected SHA-256 |
|---|---|---|
| Adapter implementation | `74EBB644F3B9A659C3AD91F179EB70CE531E2373714686D110C7FC42B3C5C74C` | `B63E58E001972AAA90585FE3860815865F9C91DCD190184AC6445C7869A01DCA` |
| Dialect manifest | `1F79D759E80CA4670811787C0DAE4EC2CC1D572E4E63EEF4AB6EBF82ED39A3C2` | `65FAB2CBE178544FBB92294CA70AC6F45E44E096ED4E257250C163D8C2FE1784` |
| Active-target manifest with pin | `385DE62C7FBD887081F71254FA90508E4F4CC2787ED84D6B9F984F4565FBB7AE` | `DC45002630BEE2E775FF90340578F5FB81BD15DDDF5BBC05927CD9E2C582A960` |

The KMC compiler remains SHA-256
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`, its reproduction
manifest remains `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26`, and GNU assembler
2.39 remains `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697` with `-EB -mips3 -32`.

`tests/compiler_assembly_dialect.js` is 21,341 bytes at SHA-256
`19939192B294E53CD033A9A84D6C34D5A21E217B937515BC8E0E2EBDCD7CE3D5`. The GNU smoke test is
12,777 bytes at SHA-256
`2242C8994518D7145D2DFC5EB8EDC6A8BBA6CBAC285CBED2174288160BB2BD34`.

## Minimal ordinary-C probe

The supplied probe source is 126 bytes at SHA-256
`86AD9A9D911B0203C1893F8DC1DF475D4B782B60FA0C87A592D232286679D267`. It contains no assembler
mechanism and converts an `int` to `float` before calling a declared consumer.

Recompilation with the pinned KMC executable and production flags reproduced the supplied
835-byte compiler assembly byte-for-byte at SHA-256
`7A0086CA5648A9881D2635D3FD008E4939654E4C72A1A4B1EED9BF1F70AB44FA`. Direct adapter application
returned the same 835 bytes and the same SHA-256 with zero total transformations and zero under
both ordered rules.

GNU assembler accepted the unchanged compiler output. The resulting object is 1,364 bytes at
SHA-256 `C1ED38FE1AD23F93EBBB80C9A5ED4A3C1ABC6D205966CA4BC13C1DEECD992824`. Its `.text` is 36 bytes
and contains `0x44846000` (`mtc1 $4,$f12`) followed by GNU reorder-mode hazard handling and
`0x46806320` (`cvt.s.w $f12,$f12`). This object is probe evidence only and is not linked into the
game.

A direct decode of the untouched 1,444-word retail p3066 owner found 16 ordinary COP1 transfers:
10 `mtc1` and six `mfc1`. No p3066 source, target activation, or matching experiment was resumed.

## Dialect and adversarial tests

`node tests/compiler_assembly_dialect.js` passed and reported:

- 4,096 accepted transfer statements: both mnemonics across every 32-by-32 GPR/FPR pair under LF
  and CRLF;
- byte-identical output and zero total and per-rule transformations for every accepted transfer;
- 11 malformed-operand rejections;
- six attached-label rejections covering symbolic, numeric-local, and whitespace-before-colon
  labels;
- 72 named-register rejections;
- 12 out-of-range rejections;
- 25 excluded COP/control/doubleword/`mov.*` rejections; and
- 152 hostile rejections across the complete suite.

The existing move fixture still records two move transformations, the adjacent `la`/`jal` fixture
still records one second-rule transformation, and the deterministic proof SHA-256 remains
`05F0B5C9CA7FCEE315FBD4D7282384858BD74593FC62425120F339BD671C2389`. The two authenticated
hybrid fixtures pass in synthesized LF and CRLF forms without byte changes.

The new fixtures are:

| Fixture | Bytes | SHA-256 |
|---|---:|---|
| `pure-cop1-transfers.s` | 110 | `A936EF2FCDC060591788C3A20D9E9BBDB985387CA99D5425599416BDCB05EDEA` |
| `hostile-cop1-control-transfer.s` | 20 | `C71E2F85D875F397205D747EB1D183EE0495E358E8504066505757F57B9FBC95` |
| `hostile-cop1-doubleword.s` | 22 | `80B98131F8DE86CD54F532B66B6D03283C7AF1165A21A8B7D64AFB26B82291A5` |
| `hostile-cop1-extra-operand.s` | 24 | `E415352572F17835F3D172041BB624248FCE98B1E9DD96CEB2DB8078D295E313` |
| `hostile-cop1-labeled.s` | 30 | `E932FEF4BF98E1E3B3B9A568D9F351C3FFBB85CF04A120BF4763938B4221FD2C` |
| `hostile-cop1-named-register.s` | 22 | `1F91EC4A49B6FB5E9611992D9816109D675895335D61E7FE96A2C1DF2F0CAD7E` |
| `hostile-cop1-numeric-label.s` | 23 | `CD59CDD97CF8E1C18621F689BF1543654DF72312B2BEF91BAB2315EE0A36E90F` |
| `hostile-cop1-out-of-range.s` | 22 | `440DA5FFD8580DBEA5C690A5C26E87D36CC3DD805E4F6676D203E536106F3FD4` |

The GNU smoke gate independently assembled raw and adapted `mtc1`/`mfc1` input. Both assembly
inputs share SHA-256 `13FEFCF113EB3E3D50D218979B4E71D94542605C17985BB33C9029571F2F7CB4`; both `.text` outputs
share SHA-256 `A88332B015EE65ABD002A379CA01FFDF8BE10F7268A39653917B3855D6722643` and words
`0x44846000 0x44053000 0x00000000`. The final smoke report is 74,078 bytes at SHA-256
`04516C158FE27BF27F537BDE1D7419219C4B9765200EEA38AF6BFFE70C16A640`.

## Production preservation

Both clean production roots contain 37 verified target proofs: five `PURE_C` and 32 `HYBRID_C`.
They report two transformed targets and 17 total transformations, all under the existing numeric
move rule. The `la`/direct-`jal` rule remains at zero. All 32 hybrid raw/adapted pairs remain
byte-identical with zero transformations.

| Target | Class | Transformations | Raw/adapted result | Linked target SHA-256 |
|---|---|---:|---|---|
| p3063 / `func_0019554C` | `PURE_C` | 14 move, 0 `la`/`jal` | Only the accepted moves differ | `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B` |
| p3064 / `func_001957D0` | `HYBRID_C` | 0 | Byte-identical at `57A83F3F50A43AEE879082BD34EC02BC469B6977A17BCBF6CD6EA5D49ED58DCC` | `E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B` |
| `func_0002CD70` | `HYBRID_C` | 0 | Byte-identical at `040B9057A3F11214D78D719ACD75E96621056A172A862C24120A9DC84DB66969` | `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF` |

The p3063 proof records exactly 14 transformations under
`move-numeric-gpr-gpr-to-addu-zero`. The p3064 proof records zero transformations and byte-identical
raw/adapted assembly. Direct C-object, linked-target, and rebuilt-ROM reads for `func_0002CD70`
return `0x00801025` at both function-relative offsets `+0x004` and `+0x028`.

## Two clean production builds

The two output roots were absent before launch:

```text
C:\Users\Joe\.codex\ob64-cop1-adapter-correction-20260811-r2\clean-build-a
C:\Users\Joe\.codex\ob64-cop1-adapter-correction-20260811-r2\clean-build-b
```

Both `build_phase8_matching_c.js` runs passed in 54.2 seconds. The independent
`verify_phase8_matching_c.js` runs passed in 52.7 and 52.6 seconds. Both phase-8 regression suites and both
workflow-acceptance suites passed. The reproducibility comparator matched every proof, object,
compiler assembly, dialect assembly, section-adjusted assembly, target, report, and major linked
output.

| Clean artifact | Bytes | SHA-256 | A/B result |
|---|---:|---|---|
| Build report | 582,309 | `708EE8C0610CF86B2BD1F52B5F243AD63AB3AFA838DE136B9CBF1B78EF3F595D` | Identical |
| Strict verification | 216,782 | `DBD5E7D1BF54F09EAA68FE6CE318C3019A5FB04400819891EE3AFE1140986C79` | Identical |
| Phase 8 ELF | 44,138,856 | `99301687400E68098B534E2844A3BB1BA566A022C60B89405DBCE282B206BCD8` | Identical |
| Link map | 7,052,114 | `673971907B1B473025A6ED679D184FD153137ABA93EA8FDF41DFED5E094C7DC0` | Identical |
| Layout | 5,423,901 | `96A9BA5804AFF5FBA0D5C5D8B3D53ABF021E3C3697E7AE7E7F165D8013D3F716` | Identical |
| Readelf report | 4,628,849 | `AB8A32B1DB3F17A0110476A89D629D1035F0D0C02AEEA45987FBA5A99528B641` | Identical |
| Object manifest | 36,453 | `B892C973B71313FFF19B3E4263C28E2D971BDE8CBBB3D2FE77E7EA00077DBCC7` | Identical |
| Full ROM | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Identical |
| Reproducibility report | 172,369 | `2399079967CB58CC185A83F8C885A145CD894C98ACA16326F2DD62A195053094` | Shared report |

## Normal verifier and heavyweight audit

`node tools/verify.js` passed in 78.1 seconds. It reported exact ownership, placement, relocations,
target bytes, and full-ROM bytes, with five exact `PURE_C` targets / 1,088 bytes and 32 exact
`HYBRID_C` targets / 8,120 bytes.

The corrected current fingerprint is
`66810C464AB8E6787321D86B923C7EAE66A7B71E962B84AB56DE7A5EBCABA4BF`. The canonical current output
is `C:\Users\Joe\.codex\ob64-decomp-current\current\66810c464ab8e6787321d86b\build`. Its build
report matches both clean roots at SHA-256
`708EE8C0610CF86B2BD1F52B5F243AD63AB3AFA838DE136B9CBF1B78EF3F595D`, and its ROM retains the
required SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

`node tools/audit.js` passed in 359.5 seconds with `Structural protections: PASS`, `CURRENT exact
ROM: PASS`, and `RESULT: AUDIT PASS`.

| Generated evidence | Bytes | SHA-256 |
|---|---:|---|
| Active-target adapter report | 104,675 | `6E729011457534767912A6D2297408635EFB719C0D8BCF28939EF945B94E7098` |
| Final source-policy report | 135,523 | `9BC333F2A823AE5944B2E6C3B541F4DED5C6A8D67326C3AE452612FE2BAC01AF` |
| Current strict verification | 216,782 | `DBD5E7D1BF54F09EAA68FE6CE318C3019A5FB04400819891EE3AFE1140986C79` |
| Fresh-compilation report | 122,215 | `913EBAA48360FFDB3135C912F05E7CF3F64735189848EA1126E97117D7674C0B` |
| Structural setup report | 7,801 | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` |
| Final audit report | 2,197 | `DA6AE79AE67E876D457E6A59F6D10EA1EA357AA3D84FADA4B32070CF13D0A27B` |

## Commands and exit results

Every final command below exited `0`:

```text
node --check tools\lib\compiler_assembly_dialect.js
node --check tests\compiler_assembly_dialect.js
node --check tests\binutils_smoke.js
node tests\compiler_assembly_dialect.js
node tests\active_targets.js
node tests\source_policy.js
node tests\binutils_smoke.js
node tests\word_asm_smoke.js
```

The probe was recompiled with:

```text
cc1.exe -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char -o <probe-output> C:\Users\Joe\.codex\ob64-p3066-pure-20260811\cop1-pure-probe.c
```

An inline read-only Node gate compared the prepared and recompiled compiler assembly, applied
`applyCompilerAssemblyDialect(..., 'PURE_C')`, and asserted byte identity, zero total
transformations, and zero counts under both rules. GNU assembler then consumed the unchanged
compiler assembly with `-EB -mips3 -32`.

The production commands differed only by their `clean-build-a` and `clean-build-b` output roots:

```text
node tools\build_phase8_matching_c.js --output <clean-root> --phase7-output C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7 --compiler C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe --splat-python C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe --splat-split C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools\verify_phase8_matching_c.js --output <clean-root> --compiler C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe --splat-python C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe --splat-split C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report <clean-root>\verification.json
node tests\phase8_matching_c.js --output <clean-root>
node tests\workflow_acceptance.js --output <clean-root>
```

The remaining final commands were:

```text
node tools\compare_phase8_reproducibility.js --left <clean-build-a> --right <clean-build-b> --report <evidence-root>\reproducibility.json
node tools\verify.js
node tools\audit.js
git diff --check
```

## Changed files

- `tools/lib/compiler_assembly_dialect.js` — narrow numeric COP1 transfer validator and
  byte-identical PURE_C passthrough.
- `config/compiler-assembly-dialect.json` — corrected implementation hash.
- `config/matching-c-targets.json` — corrected manifest hash pin.
- `tests/compiler_assembly_dialect.js` — exhaustive LF/CRLF acceptance and malformed/excluded
  matrices, hybrid preservation, and fixture gates.
- `tests/binutils_smoke.js` — raw/adapted GNU instruction-word identity.
- `tests/fixtures/compiler-assembly-dialect/pure-cop1-transfers.s` and seven focused hostile COP1
  fixtures.
- `tests/README.md` — current dialect-suite coverage.
- `docs/WORKFLOW.md`, `docs/SOURCE_POLICY.md`, `docs/TOOLCHAIN.md`, and `docs/AUDIT.md` — current
  validated passthrough boundary and audit expectation.
- `docs/audit/2026-08-11-kmc-cop1-transfer-passthrough-correction-evidence.md` — this focused
  structural record.

No C target source, original assembly, source class, target list, owner, placement, segmentation,
compiler/assembler identity, compile/assemble flag, relocation policy, or linker rule changed.

## Failure and deviation record

The expected pre-change probe rejection was recorded before editing.

After the first complete verification pass, a final adversarial review found that the shared label
lexer did not recognize GNU numeric local labels. Before commit, the lexer and hostile matrix were
hardened, all authenticated hashes were refreshed, and every production, verification,
reproducibility, and audit gate was rerun in new absent r2 roots. No r1 build or proof is used as
final evidence.

The first post-change GNU smoke run failed only because the new test expected two output words.
GNU reorder mode correctly appended a hazard `nop` after the terminal `mfc1`, producing three
identical raw/adapted words. The test expectation was corrected to include `0x00000000`, and the
final smoke gate passed. Adapter output was byte-identical even in the failed test run.

One PowerShell byte-comparison diagnostic attempted to call an unavailable `Byte.AsSpan()` method.
The compiler and assembly hashes already matched; a corrected Node `Buffer.equals()` comparison
then proved exact byte identity. One initial p3066 decoder diagnostic used an anchored `.word`
regular expression that did not account for leading decode comments; the corrected read-only scan
found all 1,444 words and the expected 16 transfers. Neither diagnostic changed a tracked file or
supplied an acceptance claim before correction.

No production build, strict verifier, reproducibility comparator, normal verifier, or heavyweight
audit gate failed.

## Limits and review state

The accepted passthrough domain is intentionally limited to 32-bit `mfc1` and `mtc1` with canonical
numeric registers. This work does not authenticate named-register spellings, labels on transfer
statements, doubleword transfers, COP0/COP2/COP3 transfers, control-register transfers, floating
`mov.*` forms, or other assembler modes and ABIs.

Exact adapter bytes and exact retail output do not prove which assembler spelling original game
developers wrote. They prove only that ordinary authenticated KMC compiler output in this narrow
domain can reach the unchanged GNU production assembler without being falsely rejected.

The worker cannot independently accept this structural change. Independent critical review must
recheck the grammar boundary, its hostile falsifiers, the implementation/manifest/pin identity
chain, and exact current build. p3066 matching remains paused until that review is accepted.
