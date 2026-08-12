# KMC COP1 transfer passthrough independent critical review

Date: 2026-08-11 local / 2026-08-12 UTC

Verdict: `CORRECTION REQUIRED`.

Commit `63cea9c0c238062f39c317d6f9a21743b64a6651` is not accepted over parent
`eedebbf2ae3b2cdb315d0ff0b47bda9a2804aa97`. One independently discovered lexical case violates
the documented parser boundary. All ordinary lowercase KMC forms, production preservation checks,
two clean builds, strict verifiers, reproducibility checks, and the authenticated heavyweight
audit otherwise pass.

p3066 remains assembly-owned and paused. This review did not create a p3066 C source, activate a
p3066 target, or resume p3066 matching.

## Blocking finding

### The case-insensitive validator accepts a noncanonical FPR token

`tools/lib/compiler_assembly_dialect.js:287` declares the complete COP1 transfer regex with the
case-insensitive `i` flag. That flag applies not only to the `mfc1`/`mtc1` mnemonic but also to the
literal `$f` FPR prefix.

As a result, each of these malformed/noncanonical operands is accepted by the adapter:

```asm
MFC1 $0,$F31
mTc1 $31,$F0
```

Direct adapter application returned byte-identical output, zero total transformations, and zero
transformations under both ordered rules. Production GNU assembler 2.39 then rejected uppercase
`$F31` as an invalid operand. This means the complete build remains fail-closed, but the parser
itself does not satisfy the committed claim that it accepts only canonical `$f0..$f31` spellings
and rejects malformed FPR operands.

This is a structural contract issue, not a retail-byte mismatch. The fix should scope
case-insensitivity to the mnemonic only, keep the `$f` operand prefix exact, and add direct hostile
tests for at least `$F0` and `$F31`. The correction then needs the focused dialect checks and normal
structural acceptance gates rerun. No reviewed file was changed by this review.

## Frozen subject and delta

The worktree began at the exact subject commit. Its parent was the requested parent, and the only
pre-existing untracked path was `.codex-remote-attachments/`, which remained untouched.

The commit changes 19 paths: the adapter implementation, its manifest and active-target hash pins,
tests/fixtures, four live policy/toolchain documents, and the worker evidence report. It changes no
`src/` or `asm/` path, no target list, no Phase 7/8 structural configuration, and no compiler,
assembler, linker, segment, overlay, placement, or boundary configuration.

The active target arrays are byte-equivalent as JSON across parent and subject. The dialect
manifest differs only in `implementationSha256`; its schema, dialect ID, rule definitions,
compiler/assembler identities, and flags remain unchanged.

## Independent grammar probes

A reviewer-owned probe loaded the parent adapter directly from Git and the subject adapter from the
worktree. It did not call the committed unit test.

The accepted matrix contained 8,192 statements:

- `mfc1` and `mtc1`;
- every GPR/FPR pair in `0..31 × 0..31`;
- LF, CRLF, lone CR, and absent-final-newline corpora; and
- spaces, tabs, and trailing assembler comments.

Every canonical lowercase transfer remained byte-identical. Every decision recorded zero total
and zero per-rule transformations. The four accepted-corpus SHA-256 values were:

| Physical form | SHA-256 |
|---|---|
| LF | `CC0C0F175CB16A79AE0A8F1CA21C613F01EEBA3E4153A1269B780C2862B3E678` |
| CRLF | `C333EDAD6121C46EEF09EAD6937703B30D5AB5972656DFF1DFBFC65117E68BC2` |
| CR | `6A14AAA8B6C51856165F6DB13EEAE8C7DD9558BE4EB729B2FDFF9B405EB26B85` |
| No final line ending | `5EBC46650ECB0031B9FF0FD273B3F3A7454D3A96054D706D8CDC30BAFAE67963` |

The independent hostile matrix also checked:

- 12 signed, out-of-range, hexadecimal, and leading-zero register boundaries;
- 82 named or malformed GPR/FPR aliases;
- 24 missing, reversed, comma, punctuation, and extra-operand forms;
- 24 symbolic, dot/dollar, multiple, and numeric attached-label forms;
- all required COP0/COP2/COP3, `cfc*`/`ctc*`, `dmfc*`/`dmtc*`, and
  `mov.s`/`mov.d`/`mov.ps` exclusions; and
- `#APP`/`#NO_APP`, macro/configuration, `UNKNOWN`, and `ASM` fail-closed gates.

All required cases rejected except the uppercase `$F` spelling described above. Separate symbolic
and numeric label lines remained valid; attached symbolic and numeric labels rejected.

The probe report passed at SHA-256
`7BD59B5A822FFBF5FC35FB9016E0E92F45F89930177DF44252E6BA7F990AC76F`.
The generated reviewer script was SHA-256
`D18D844269AC33C451684439171F75E1BD85AE53CD3867E85D92102EA086201F`.

## Existing dialect behavior

The parent/subject differential checks covered 2,048 complete numeric `move` statements across LF
and CRLF and 14 focused `la`/direct-`jal` eligibility, exclusion, mode, label, expression, register,
and intervention cases. Their adapted bytes and decision records were identical.

The shared numeric-label recognition intentionally tightens one previously under-recognized case:
`1: move $2,$4` passed unchanged under the parent but now rejects as a labeled move. A numeric label
on its own line followed by `move` still performs exactly one move transformation. Numeric labels
attached to `la` or `jal` remain unchanged exclusions. This tightening is consistent with the
already documented complete-unlabeled move rule and is not the blocking finding.

`mfc1.s` and `mtc10` remain byte-identical parser passthrough under both parent and subject, then
fail in GNU 2.39 as unknown opcodes. This pre-existing fail-later behavior is not attributable to
the correction, but it reinforces that adapter acceptance and complete-toolchain acceptance must
not be conflated.

Three hostile `HYBRID_C` inputs, including LF, CRLF, malformed COP syntax, and non-UTF-8 bytes,
remained opaque byte-identical passthroughs with zero transformations. The authenticated hybrid
fixtures and source-policy classifier suite also passed.

## Ordinary-C and GNU assembler evidence

The 126-byte ordinary-C probe retained SHA-256
`86AD9A9D911B0203C1893F8DC1DF475D4B782B60FA0C87A592D232286679D267`.
Independent compilation with the pinned KMC compiler reproduced 835 bytes of compiler assembly at
SHA-256 `7A0086CA5648A9881D2635D3FD008E4939654E4C72A1A4B1EED9BF1F70AB44FA`.
The adapter output had the same byte count and hash and zero transformations.

GNU assembler 2.39 produced an object at SHA-256
`C1ED38FE1AD23F93EBBB80C9A5ED4A3C1ABC6D205966CA4BC13C1DEECD992824`.
Its 36-byte `.text` section had SHA-256
`9CDBF616246E8A85A22CE643152BD5B7AAE6AB5D55AB349C74EB8B1FF0747AB1` and included
`0x44846000` (`mtc1 $4,$f12`). Its normalized relocations were an `R_MIPS_26` to
`consume_float` at `+0x10` and an `R_MIPS_32` `.pdr` record for `cop1_pure_probe`.

The committed GNU smoke suite independently passed raw/adapted numeric transfer assembly with
identical words `0x44846000 0x44053000 0x00000000`. Existing move encoding and
HI16/MIPS26/LO16 `la`/direct-`jal` relocation checks also passed. GNU assembler remained the
production assembler; no historical assembler entered the build.

## Authentication chain

| Artifact | SHA-256 |
|---|---|
| KMC `cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| KMC reproduction manifest | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` |
| GNU assembler 2.39 | `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697` |
| GNU toolchain config | `5A93298ED635C5FC6458C9DC1BBEB45A3EDCA7C4683D6E329BCE838E942B30FD` |
| Source-policy config | `C9373F7003A419CC8C1E9F6AF380134AFE2A56A0BFDDF575983AB651F5866F2A` |
| Corrected dialect implementation | `B63E58E001972AAA90585FE3860815865F9C91DCD190184AC6445C7869A01DCA` |
| Corrected dialect manifest | `65FAB2CBE178544FBB92294CA70AC6F45E44E096ED4E257250C163D8C2FE1784` |
| Active-target manifest with pin | `DC45002630BEE2E775FF90340578F5FB81BD15DDDF5BBC05927CD9E2C582A960` |

The assembler version was `GNU assembler (GNU Binutils) 2.39`; production flags remained
`-EB -mips3 -32`. Compiler flags remained the pinned KMC `-O2`, big-endian, MIPS3, gp32/fp32,
`-G 0`, non-PIC, no-abicalls configuration.

## Two reviewer-owned clean builds

The review root did not exist before launch:

```text
C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1
```

Two independent builds and strict verifications passed. The comparator matched all 37 proofs,
objects, raw compiler assemblies, dialect assemblies, section-adjusted assemblies, target slices,
relocation sets, reports, and major linked outputs.

| Artifact | Bytes | SHA-256 | A/B |
|---|---:|---|---|
| Build report | 582,309 | `708EE8C0610CF86B2BD1F52B5F243AD63AB3AFA838DE136B9CBF1B78EF3F595D` | Identical |
| Strict verification | 216,782 | `DBD5E7D1BF54F09EAA68FE6CE318C3019A5FB04400819891EE3AFE1140986C79` | Identical |
| Phase 8 ELF | 44,138,856 | `99301687400E68098B534E2844A3BB1BA566A022C60B89405DBCE282B206BCD8` | Identical |
| Link map | 7,052,114 | `673971907B1B473025A6ED679D184FD153137ABA93EA8FDF41DFED5E094C7DC0` | Identical |
| Layout | 5,423,901 | `96A9BA5804AFF5FBA0D5C5D8B3D53ABF021E3C3697E7AE7E7F165D8013D3F716` | Identical |
| Readelf report | 4,628,849 | `AB8A32B1DB3F17A0110476A89D629D1035F0D0C02AEEA45987FBA5A99528B641` | Identical |
| Object manifest | 36,453 | `B892C973B71313FFF19B3E4263C28E2D971BDE8CBBB3D2FE77E7EA00077DBCC7` | Identical |
| Full ROM | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Identical |
| Reproducibility report | 172,369 | `2399079967CB58CC185A83F8C885A145CD894C98ACA16326F2DD62A195053094` | Shared |

Both roots report five exact `PURE_C` targets, 32 exact `HYBRID_C` targets, 17 move-rule
transformations, zero `la`/direct-`jal` transformations, and zero hybrid transformations. Normal
`node tools/verify.js` also passed ownership, placement, relocations, target bytes, and full ROM.

## Required target regressions

| Target | Independently observed result |
|---|---|
| p3063 / `func_0019554C` | Exact `PURE_C`; 14 move transformations, zero second-rule transformations; sole owner `objects/c/func_0019554C.o`; `0x0019554C..0x001957D0`; VRAM `0x802150BC`; 32 normalized relocations; target SHA-256 `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`. |
| p3064 / `func_001957D0` | Source unchanged from parent; exact `HYBRID_C`; zero transformations; raw/adapted SHA-256 `57A83F3F50A43AEE879082BD34EC02BC469B6977A17BCBF6CD6EA5D49ED58DCC`; target SHA-256 `E05EF7BF474667F4586C0674C4F55DCEF161A2D0E0070BA2D46A870EB79D146B`. |
| `func_0002CD70` | Exact `HYBRID_C`; zero transformations; C-object and linked-ROM reads both returned `0x00801025` at `+0x004` and `+0x028`; target SHA-256 `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`. |
| p3066 / `func_001960A8` | Not an active C target; `.ob64.r3066` remains owned by `objects/assembly/chunk_025.o` at VRAM `0x80215C18`, ROM `0x001960A8`, size `0x1690`; source SHA-256 `67AC5FF8BA0382C8D797F5765AC3B8F5FEF8195A1A73FECAEB1FAE850835FAE5`. |

Direct p3063 raw/adapted comparison found only the 14 accepted moves at logical lines
`25, 27, 29, 31, 104, 121, 130, 161, 175, 184, 203, 220, 280, 292`. Their raw and adapted hashes
were `291C3F051CF0263FFA881399836C94082738F0AC974F1D4D3FF09EDB6938EBC7` and
`5CE7979849B8EC8D0FCC29E146C46538ABBA8E8A014D27F402E4F8976E9C0FBE`.

Direct p3066 decoding counted 1,444 words, six `mfc1`, and ten `mtc1`. This was a read-only owner
check, not resumed matching work.

## Heavyweight audit authentication

The reported heavyweight audit was not repeated because its evidence was sufficient and fully
authenticated.

- Current fingerprint recomputation:
  `66810C464AB8E6787321D86B923C7EAE66A7B71E962B84AB56DE7A5EBCABA4BF`.
- Baseline fingerprint:
  `2BB2A732D8CEA5495220ADEB911D6EE7664BA38F0DE54F5B9DE87376E95A5252`.
- Audit report SHA-256:
  `DA6AE79AE67E876D457E6A59F6D10EA1EA357AA3D84FADA4B32070CF13D0A27B`.
- Structural report SHA-256:
  `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41`.
- Audit/current strict verification SHA-256:
  `DBD5E7D1BF54F09EAA68FE6CE318C3019A5FB04400819891EE3AFE1140986C79`.

The audit completed at `2026-08-12T01:04:13.516Z`, after its structural report and strict current
verification. Its dialect manifest/implementation identities match the subject, its current build
report and linked outputs match both reviewer roots, and its protected memset words match direct
reviewer reads. The structural report passed ROM identity, coverage, executable extent, overlay
model, source ownership, GNU production assembly, and exact baseline reconstruction.

The independent artifact authenticator passed at SHA-256
`A335CB162B4AFF8A71D7DAD3809E0483A238537528DC70F0ABBEEEC7D8038514`.
Its generated script was SHA-256
`E9BCA53BCD28A92750A24DFD803269B968656B06EBDED8336B83E70F123CDBD9`.

## Exact commands

Repository and delta inspection:

```powershell
git status --short --branch
git rev-parse HEAD
git rev-parse 63cea9c0c238062f39c317d6f9a21743b64a6651^
git diff --stat eedebbf2ae3b2cdb315d0ff0b47bda9a2804aa97 63cea9c0c238062f39c317d6f9a21743b64a6651
git diff --name-status eedebbf2ae3b2cdb315d0ff0b47bda9a2804aa97 63cea9c0c238062f39c317d6f9a21743b64a6651
git diff --check eedebbf2ae3b2cdb315d0ff0b47bda9a2804aa97 63cea9c0c238062f39c317d6f9a21743b64a6651
```

Independent and committed focused checks:

```powershell
node build\audit\2026-08-11-cop1-independent-probe.js
node build\audit\2026-08-11-cop1-independent-artifact-auth.js
node --check tools\lib\compiler_assembly_dialect.js
node --check tests\compiler_assembly_dialect.js
node --check tests\binutils_smoke.js
node tests\compiler_assembly_dialect.js
node tests\active_targets.js
node tests\source_policy.js
node tests\binutils_smoke.js
node tests\word_asm_smoke.js
node tools\source_policy.js --target func_0019554C
node tools\source_policy.js --target func_001957D0
node tools\verify.js
```

The two clean builds differed only by output root:

```powershell
node tools\build_phase8_matching_c.js --phase7-output "C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --output "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-a"
node tools\build_phase8_matching_c.js --phase7-output "C:\Users\Joe\.codex\ob64-structural-correction-d804a65-pflags-20260808-234545\audit-work\baseline\2bb2a732d8cea5495220adeb\phase7" --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --output "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-b"
```

Strict verification and comparison:

```powershell
node tools\verify_phase8_matching_c.js --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --output "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-a" --report "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-a\verification.json"
node tools\verify_phase8_matching_c.js --compiler "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" --splat-python "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe" --splat-split "C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py" --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --output "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-b" --report "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-b\verification.json"
node tools\compare_phase8_reproducibility.js --left "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-a" --right "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-b" --report "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\reproducibility.json"
node tests\phase8_matching_c.js --output "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-a"
node tests\workflow_acceptance.js --output "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\clean-build-b"
```

Ordinary-C probe recompilation:

```powershell
& "C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe" -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char -o "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\cop1-pure-probe.compiler.s" "C:\Users\Joe\.codex\ob64-p3066-pure-20260811\cop1-pure-probe.c"
& ".toolchains\gcc-toolchain-mips64-win64\bin\mips64-elf-as.exe" -EB -mips3 -32 -o "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\cop1-pure-probe.o" "C:\Users\Joe\.codex\ob64-cop1-independent-review-63cea9c0-r1\cop1-pure-probe.dialect.s"
```

## Reviewer setup deviations

The first reproducibility-comparator invocation exited before comparison because the reviewer put
strict reports at the review-root level while the comparator expects `verification.json` inside
each build root. Strict verification had passed; the reports were regenerated at the conventional
paths, after which comparison passed.

One initial hash query named `readelf.txt` instead of `phase8.readelf.txt`. One generated p3063
line counter initially split CRLF into two records. Both reviewer-only diagnostics were corrected
before any acceptance claim. One relocation helper call omitted its required target-normalization
argument; the corrected read returned the two expected probe relocations. None changed a tracked
reviewed file or indicated a subject failure.

## Required route

Do not accept commit `63cea9c0c238062f39c317d6f9a21743b64a6651` as the canonical COP1 parser
correction in its current form. Keep p3066 assembly-owned and paused. After the FPR-prefix grammar
is made canonical and the missing hostile cases are added, rerun focused independent review plus
the normal structural acceptance gates.
