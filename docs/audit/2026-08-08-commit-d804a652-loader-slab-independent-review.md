# Commit `d804a652` cold-boot loader slab independent structural review

Completed. Technical verdict: **FAIL**.

Commit `d804a652827ed8c4dd6ba80ab1fa4ebe961cfe6c` correctly models the cold-boot
non-descriptor load slab and preserves the existing scenario slab, fixed descriptors, accepted
source owners, and inactive p0910 C draft. It is not approvable because the production Phase 7
ELF verifier accepts a `PT_LOAD` whose executable flags contradict the accepted slice model.

Review status: `correction-required`.

## Finding

### [P1] The production verifier does not validate `PT_LOAD.p_flags`

The linker-script generator emits each program header with the intended flags at
`tools/lib/phase7_conventional.js:531`:

```js
slice.executable ? 5 : 4
```

The ELF parser reads `p_flags` at `tools/lib/phase7_conventional.js:482`. The verifier checks the
section's `SHF_EXECINSTR` bit at `tools/lib/phase7_conventional.js:616`, then selects the associated
`PT_LOAD` only by VMA, LMA, file size, and memory size at
`tools/lib/phase7_conventional.js:617-618`. It never compares the selected header's `flags` field
with the slice's accepted executable state.

The two smallest falsifiers use the fresh Phase 7 ELF and change one big-endian word each:

| Slice | Program header | ELF `p_flags` offset | Mutation | Production result |
|---|---:|---:|---|---|
| executable tail `.ob64.r0810.s1` | 811 | `0x65AC` | `5` (`PF_R|PF_X`) to `4` (`PF_R`) | incorrectly accepted |
| non-executable head `.ob64.r0810.s0` | 810 | `0x658C` | `4` (`PF_R`) to `5` (`PF_R|PF_X`) | incorrectly accepted |

Both mutated ELFs pass `verifyElfAgainstModel()`. Removing `SHF_EXECINSTR` from the tail section is
correctly rejected, which isolates the defect to program-header validation.

The focused test asserts correct baseline program-header flags at
`tests/phase7_conventional_build.js:212-215`, but its executable-treatment mutation at
`tests/phase7_conventional_build.js:421-425` changes only the section header. It therefore cannot
detect this verifier gap.

This is an invariant violation, not a cosmetic coverage note. The accepted model says the p0810
head is `PF_R` and its executable tail is `PF_R|PF_X`; a production verifier that accepts the
opposite treatment cannot certify that claim. The review fails closed even though the generated
unmutated ELF is correct and every exact-ROM comparison passes.

### Smallest required correction

Keep the existing unique VMA/LMA/size lookup, then require the selected header to have exactly:

```js
const expectedFlags = slice.executable ? 5 : 4;
```

Reject `headers[0].flags !== expectedFlags` with a precise execution/program-header drift error.
Add two independent mutation tests: remove `PF_X` from `.ob64.r0810.s1`, and add `PF_X` to
`.ob64.r0810.s0`. Both must be rejected by production verification. Retain the existing section
flag mutation.

No slab metadata, fixed descriptor, source-owner record, p0910 source, matching-C target list, or
matching-C configuration needs to change for this correction.

## Frozen subject and review boundary

The reviewed commit is:

```text
d804a652827ed8c4dd6ba80ab1fa4ebe961cfe6c
Model cold-boot non-descriptor load slab
```

Its parent is `0178bc1657298adf55af593caaa3fcdb04dec5ff`.

The implementation tree was clean at the start and end of the technical review. All generated
builds, mutations, regenerated products, and audit state were kept in reviewer-owned external
roots. This report is the only repository change made after the review.

The review did not activate p0910 C, alter a source owner, alter a function boundary, alter the
matching-C configuration, or treat the implementing worker's PASS as approval.

## Fresh review roots

Reviewer root:

```text
C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656
```

| Purpose | Fresh path |
|---|---|
| detached source clone | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\source` |
| immediate-parent clone | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\parent-source` |
| fresh Splat output | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\fresh\splat` |
| fresh manual Phase 7 | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\fresh\phase7` |
| fresh manual Phase 8 | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\fresh\phase8` |
| regenerated overlay product | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\fresh\overlay` |
| heavyweight-audit Phase 7 | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\work\baseline\b75ef7c7220b0c55b21c8cb4\phase7` |
| heavyweight-audit Phase 8 | `C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656\work\current\f2acec1874959feb17000ab7\build` |

Baseline fingerprint:
`B75EF7C7220B0C55B21C8CB49EC6E76CBF06B7909CD4BB8839FB6281291FA100`.

Current fingerprint:
`F2ACEC1874959FEB17000AB7D75815A8F3B7A5C2AA5E6EACEE7DAEF7D9352F9B`.

No implementing-worker output root was reused as evidence.

## Passing evidence that does not cure the finding

### Cold-boot loader decode

Accepted assembly at `asm/original/rev0/boot/early_boot_resource_loader.s:94-101` constructs
destination start `0x8016AF80` and runtime end `0x80190F10`.
`asm/original/rev0/boot/early_boot_resource_loader.s:98-99` constructs ROM start
`0x00040E80`. Lines 120-126 construct ROM end `0x00066E10`, call `0x8009DA50`, and perform
`subu $a2,$a2,$s4` in the MIPS delay slot.

The independently decoded call is therefore:

```text
a0 = 0x00040E80
a1 = 0x8016AF80
a2 = 0x00066E10 - 0x00040E80 = 0x25F90
```

`asm/original/rev0/lib/func_0002de50.s:42-45` implements helper rounding as
`(length + 1) & ~1`. `asm/original/rev0/lib/func_0001a380.s:33-36` caps each transfer request at
`0x200` bytes. The even length remains `0x25F90`: 303 full `0x200` requests plus one final
`0x190` request, 304 requests total. The exact endpoints and mapping delta are:

```text
ROM:     0x00040E80..0x00066E10
VMA:     0x8016AF80..0x80190F10
length:  0x25F90 (155,536)
delta:   0x8012A100
```

### Slab records and fixed descriptors

`config/phase7/conventional-build.json:23-46` contains two generic `loader-dma` records. The
existing `scenario-loader-00195410` record is byte-identical to the parent. The new record is
`cold-boot-loader-00040e80` with the exact endpoints above and one slab-local executable range
`0x00040E80..0x00040E90`.

All 19 fixed descriptors retain their parent ROM ranges, runtime reservations, pins, and raw
records. The raw table at ROM `0x000387C0..0x00038AB8` has SHA-256:

```text
75C94248A58E59144D5DBE16E58BA5F5A6F81C46C4CEE69723553B95188486C5
```

The tracked, parent, and independently regenerated overlay configuration all have SHA-256:

```text
D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6
```

Regeneration returned 19 descriptors, 11 groups, and 11 pointers. Parent comparison passed.

The independent interval checks returned:

| Check | Result |
|---|---|
| fixed descriptor ROM versus fixed descriptor ROM | no overlaps |
| slab ROM versus slab ROM | no overlaps |
| slab ROM versus fixed descriptor ROM source | no overlaps |
| cold-boot slab runtime versus all fixed reservations | no overlaps |
| scenario slab runtime versus fixed reservations | descriptor IDs 9 and 12 only; preserved accepted temporal-runtime semantics |

The cold-boot slab ends at `0x80190F10`, `0x6C60` bytes below fixed descriptor 0's runtime start
at `0x80197B70`.

### Source-owner and placement conservation

The accepted model contains 7,242 unique, gap-free source owners covering 41,943,040 bytes and
7,252 unique, gap-free placement slices covering the same bytes. There are ten split owners. No
byte is omitted or multiply covered in either census.

p0810 remains one accepted primary source owner:

```text
row:          p0810
primary ID:   primary:4b3693504d495f021786
source class: data
ROM:          0x00040638..0x00040E90
bytes:        0x858 (2,136)
input:        tracked assembly, chunk_003.o
```

Only its placement is split:

| Slice | ROM/LMA | VMA | Size | Section flags | Accepted `PT_LOAD` |
|---|---|---|---:|---|---|
| `.ob64.r0810.s0` | `0x00040638..0x00040E80` | `0x00040638..0x00040E80` | `0x848` | `SHF_ALLOC` | index 810, `PF_R` |
| `.ob64.r0810.s1` | `0x00040E80..0x00040E90` | `0x8016AF80..0x8016AF90` | `0x10` | `SHF_ALLOC|SHF_EXECINSTR` | index 811, `PF_R|PF_X` |

The Phase 7 and Phase 8 linker maps each contain exactly one input contribution for each p0810
slice, both from `objects/assembly/chunk_003.o`.

The tail bytes at `asm/original/rev0/lib/data_00040638.s:542-545` are exactly:

```text
03E00008 00000000 03E00008 00000000
jr $ra; nop; jr $ra; nop
```

Canonical runtime pointers `0x8016AF80`, `0x8016AF88`, and `0x8016AF90` occur at
`asm/original/rev0/lib/data_00037480.s:1151-1153`. No new source owner or function boundary was
created for the executable tail.

p0811 through p1288 comprise 478 wholly contained owners: 456 code owners and 22 data owners,
covering `0x25F80` bytes. With the p0810 tail's `0x10` bytes, they exactly conserve the slab's
`0x25F90` bytes. Every contained byte uses `VMA = ROM + 0x8012A100`.

p1289 begins exactly at ROM `0x00066E10`, remains outside the slab, and remains in fixed
descriptor 0 at VMA `0x80197B70`.

### Accepted-assembly J/JAL target scan

The complete accepted-assembly scan covered p0811-p1266: 456 code owners, `0x1B378` bytes, and
27,870 unique parsed instruction words with no source/ROM mismatch or duplicate word.

| Instruction | Total | Internal | External |
|---|---:|---:|---:|
| `j` | 746 | 746 | 0 |
| `jal` | 697 | 266 | 431 |
| combined | 1,443 | 1,012 | 431 |

Every internal target was aligned, present, and executable. No internal target landed in data or
in the p0810 tail. The sorted internal-target evidence digest is:

```text
4DAAA4D5D53490141035BD5CA375FC3717741A35A3CA7D9E29633788D7CD52AE
```

### Generic validation mutation results

The committed Phase 7 test passed its baseline and rejected all 19 built-in mutations, including
malformed slab endpoints, duplicate slab IDs, overlapping slabs, fixed-descriptor overlap,
unequal ROM/VMA lengths, slab-count drift, malformed executable ranges, unaligned executable
range endpoints, out-of-slab ranges, duplicate executable-range IDs, overlapping executable
ranges, section-size drift, VMA drift, LMA drift, section executable-flag drift, and ROM padding.

Independent mutations also rejected redundant executable ranges, VMA drift, LMA drift, and
section executable-flag drift. The two program-header flag mutations in the finding were the only
accepted invariant violations.

### Fresh ELF, map, and linker evidence

Phase 7 and Phase 8 independently reproduced the following placements and flags:

| Row/slice | LMA | VMA | Size | Section | `PT_LOAD` index/flags |
|---|---:|---:|---:|---|---|
| p0810 head | `0x00040638` | `0x00040638` | `0x848` | `.ob64.r0810.s0`, `A` | 810 / `PF_R` |
| p0810 tail | `0x00040E80` | `0x8016AF80` | `0x10` | `.ob64.r0810.s1`, `AX` | 811 / `PF_R|PF_X` |
| p0811 | `0x00040E90` | `0x8016AF90` | `0xF8` | `.ob64.r0811`, `AX` | 812 / `PF_R|PF_X` |
| p0910 | `0x0004501C` | `0x8016F11C` | `0x3C4` | `.ob64.r0910`, `AX` | 911 / `PF_R|PF_X` |
| p1288 | `0x00066DB8` | `0x80190EB8` | `0x58` | `.ob64.r1288`, `A` | 1289 / `PF_R` |
| p1289 | `0x00066E10` | `0x80197B70` | `0x2CC` | `.ob64.r1289`, `AX` | 1290 / `PF_R|PF_X` |

The preserved scenario slab is identical in both phases:

| Row | LMA | VMA | Size | Treatment |
|---|---:|---:|---:|---|
| p3062 | `0x00195410` | `0x80214F80` | `0x13C` | executable |
| p3063 | `0x0019554C` | `0x802150BC` | `0x284` | executable |
| p3064 | `0x001957D0` | `0x80215340` | `0x5CC` | executable |
| p3065 | `0x00195D9C` | `0x8021590C` | `0x30C` | executable |
| p3066 | `0x001960A8` | `0x80215C18` | `0x1690` | executable |
| p3067 | `0x00197738` | `0x802172A8` | `0xA8` | non-executable |

### p0910 ownership and inactivity

Both fresh maps contain exactly one p0910 contribution:

```text
.ob64.r0910  VMA 0x8016F11C  size 0x3C4  LMA 0x0004501C
objects/assembly/chunk_004.o
```

Both Phase 7 and Phase 8 layouts classify it as `tracked-assembly`. Phase 8 contains no
`objects/c/func_0004501C.o` and no generated compiler assembly for p0910.

`func_0004501C` is absent from the target array in both `config/matching-c-targets.json` and
`config/phase8/matching-c.json`. The latter contains only an expected external symbol/relocation
reference from another active target at `config/phase8/matching-c.json:1233` and nearby relocation
records; that is not p0910 ownership or activation.

The inactive draft and accepted assembly identities are:

| Input | SHA-256 |
|---|---|
| `src/lib/func_0004501C.c` | `F71C6AF43EBBB0E492972FEE07E0032D97B2BED422C2889DB058450C207AE0AD` |
| `asm/original/rev0/lib/func_0004501c.s` | `27823BC6474FDEA48A798555B2DF393B09AFE29DE68C8D1F74C787B30AE65DB8` |

The C draft is byte-identical to the parent and is not modified by the reviewed commit. No
matching-C claim is made.

## Fresh artifact hashes

### Phase 7

| Artifact | SHA-256 |
|---|---|
| ELF | `19FD06C084CFDDF276CB39A83AFFC7D7741EBA5406B51701D2801FF33DA7892E` |
| map | `D25F47BAD5C726B34014CDFAEC3C67B9306D1BD9EFF4FA8CFEBF0BC291558596` |
| ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| layout | `B62F1F32F048C9599B4663CDFE6DD603439FA8EC37869A85274FF79CE997DDA5` |
| build report | `8561D34BDCEBAD54D7685C836BBBFA285CBBFA3A69557FD08B8BD734B5D43CFD` |
| object manifest | `D40A8A5EB223490B5C86B38643F71121F7294C28BC83E73542B0BEAFA1DE4031` |
| linker script | `588911B39242EF65FBABCE59155CFDA4D1CECDA35CE2C717AAD81192087437F6` |
| readelf report | `1D2E3D6F1031438F0DEC40C41BDC3EA3B6D8F1B3E4E6AD763E97E6F88CC153FD` |
| independent verification | `5208BE85967E633EA5812E9BF87539B7F31B53D7FD1FE76F14BFF9D98DA5D5DB` |

### Phase 8

| Artifact | SHA-256 |
|---|---|
| ELF | `99301687400E68098B534E2844A3BB1BA566A022C60B89405DBCE282B206BCD8` |
| map | `673971907B1B473025A6ED679D184FD153137ABA93EA8FDF41DFED5E094C7DC0` |
| ROM | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| layout | `96A9BA5804AFF5FBA0D5C5D8B3D53ABF021E3C3697E7AE7E7F165D8013D3F716` |
| build report | `5A31A49F0F4D2845D83BDD2DC0FFEBC14546C8754D72859D6EDC5426E7295A3D` |
| object manifest | `B892C973B71313FFF19B3E4263C28E2D971BDE8CBBB3D2FE77E7EA00077DBCC7` |
| linker script | `896431878506F4BCD4832FD5CB63F6B4E467951BA72FE210E08AD30243D6FD43` |
| readelf report | `AB8A32B1DB3F17A0110476A89D629D1035F0D0C02AEEA45987FBA5A99528B641` |
| independent verification | `5B3CA7CAFF0AB6BA2D9A9BADB89E2ECD596E5CE34E2D66AD43EFCA49EB410476` |

### Audit and regenerated products

| Artifact | SHA-256/result |
|---|---|
| heavyweight audit report | `E74940FB7E0BFFA3EC746BD014F602AE1E7446D84E3F46FF2E6C4C0DCDA620EB` |
| setup verification report | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` |
| code-region bytes | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| generated overlay config | `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6` |
| overlay verification report | `209D4FA5B5228F83CA42B82EE6F24F6C7D908123919C5A8D58ECD2D7752D00AA` |

## Command and result ledger

The paths below use these abbreviations:

```powershell
$R = 'C:\Users\Joe\.codex\ob64-structural-review-d804a65-20260808-222656'
$S = "$R\source"
$Splat = "$R\fresh\splat"
$P7 = "$R\fresh\phase7"
$P8 = "$R\fresh\phase8"
$Overlay = "$R\fresh\overlay"
```

Machine-local authenticated compiler, Splat, binutils, and asm-differ paths were supplied from the
existing local tool configuration. Generated roots were overridden to the reviewer root above.

| Command/check | Result |
|---|---|
| `git rev-parse HEAD` in the detached clone | `d804a652827ed8c4dd6ba80ab1fa4ebe961cfe6c` |
| `git status --short` before technical review | empty |
| `git diff --check 0178bc1657298adf55af593caaa3fcdb04dec5ff d804a652827ed8c4dd6ba80ab1fa4ebe961cfe6c` | pass |
| `node tools/verify_baserom.js --input baserom/authenticated.us_rev0.z64 --out build/baserom.us_rev0.z64 --report build/baserom.us_rev0.report.json` | pass; authenticated normalized Rev 0 identity |
| `node tools/run_phase7_splat.js --output $Splat --python <pinned-python> --split <pinned-split.py> --snapshot-root <pinned-snapshot>` | pass |
| first `node tools/build_phase7_conventional.js ...` | setup failure: clean clone lacked ignored `.toolchains`; no implementation evidence tested |
| create clone-local junction `.toolchains` to the authenticated canonical toolchain directory | setup correction only |
| `node tools/build_phase7_conventional.js --output $P7 --splat-output $Splat --splat-python <pinned-python> --splat-split <pinned-split.py> --asm-differ <pinned-checkout>` | pass; exact Phase 7 ROM |
| `node tools/verify_phase7_conventional.js --output $P7 --splat-python <pinned-python> --splat-split <pinned-split.py> --asm-differ <pinned-checkout> --report $P7\independent-verification.json` | pass |
| `node tests/phase7_conventional_build.js --output $P7` | pass; baseline verified; 19 committed mutations rejected |
| independent slab validation harness over malformed, overlapping, out-of-slab, redundant, VMA-drift, LMA-drift, and executable-flag mutations | all expected mutations rejected |
| independent p0810 tail `PT_LOAD` mutation, `p_flags` at `0x65AC`, `5 -> 4` | incorrectly accepted; finding reproduced |
| independent p0810 head `PT_LOAD` mutation, `p_flags` at `0x658C`, `4 -> 5` | incorrectly accepted; finding reproduced |
| `node tools/build_phase8_matching_c.js --output $P8 --phase7-output $P7 --compiler <pinned-cc1> --splat-python <pinned-python> --splat-split <pinned-split.py> --asm-differ <pinned-checkout>` | pass; exact Phase 8 ROM |
| `node tools/verify_phase8_matching_c.js --output $P8 --compiler <pinned-cc1> --splat-python <pinned-python> --splat-split <pinned-split.py> --asm-differ <pinned-checkout> --report $P8\independent-verification.json` | pass |
| first `node tests/workflow_acceptance.js --output $P8` | setup failure: clone had no machine-local configuration; no implementation evidence tested |
| rerun `node tests/workflow_acceptance.js --output $P8` with `OB64_LOCAL_TOOLS`/external work-root configuration | pass; 5 `PURE_C`, 32 `HYBRID_C`, no `UNKNOWN` or `ASM` |
| `node tests/phase8_matching_c.js --output $P8` | fail at stale Phase 2 aggregate gate; independently classified as pre-existing and orthogonal |
| immediate-parent target/source-policy scan in `$R\parent-source` | 37 active targets, 5 `PURE_C`, 32 `HYBRID_C`; same legacy test assumptions already stale; p0910 inactive |
| `node tools/generate_overlay_config.js --rom $S\build\baserom.us_rev0.z64 --manifest $S\asm\original\rev0\manifest.json --output $Overlay\us_rev0.generated.json` | pass; 19 descriptors, 11 groups, 11 pointers; output equals tracked config |
| `node tools/verify_overlay_config.js --rom $S\build\baserom.us_rev0.z64 --manifest $S\asm\original\rev0\manifest.json --config $Overlay\us_rev0.generated.json --parent-package <accepted-parent-package> --report $Overlay\verification.json` | pass, including parent comparison |
| independent source-owner and placement-slice census | pass: 7,242 owners, 7,252 slices, 41,943,040 bytes, no gaps or overlaps |
| independent p0811-p1288 containment census | pass: 478 owners, 155,520 bytes, 456 code and 22 data |
| independent slab/fixed ROM and runtime interval scan | pass with only preserved scenario temporal intersections 9 and 12 |
| independent accepted-assembly p0811-p1266 J/JAL scan | pass: 1,443 instructions, 1,012 internal targets, every internal target valid |
| `node tools/audit.js` with fresh external `OB64_WORK_ROOT=$R\work` | audit process completed and wrote status `pass`; wrapper timeout deviation described below |
| `node tools/verify.js` | pass; exact baseline; 5 `PURE_C` / 1,088 bytes and 32 `HYBRID_C` / 8,120 bytes |
| direct byte comparison of authenticated baserom, manual Phase 7, manual Phase 8, audit Phase 7, and audit Phase 8 | all 41,943,040 bytes; `firstDiff = null` for every output |

The heavyweight audit's setup report records all 16 nested setup commands as passed:
`verify_baserom`, `verify_overlay_config`, `verify_phase5b_production_config`,
`build_rom_coverage_ledger`, `audit_code_region`, `extract_original_mips`, `word_asm_smoke`,
`binutils_smoke`, `check_manifest`, `assemble_original_mips`, `extract_rom_segments`,
`rebuild_rom`, `build_full_source_manifest`, `extract_non_code_sources`,
`rebuild_from_source_manifest`, and the assembled-code `rebuild_rom`.

The setup report recorded `ok: true`, zero failed checks, 825 archived rows, zero unknown rows, and
108 accepted ambiguous overlaps. The final audit report records `status: pass`.

## Exact ROM comparison

| ROM | Bytes | SHA-256 | First differing byte versus authenticated baserom |
|---|---:|---|---|
| authenticated normalized Rev 0 | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | reference |
| fresh manual Phase 7 | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | none |
| fresh manual Phase 8 | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | none |
| heavyweight-audit Phase 7 | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | none |
| heavyweight-audit Phase 8 | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | none |

Exact ROM output is necessary but does not compensate for the verifier accepting a malformed
program-header permission contract.

## Legacy `tests/phase8_matching_c.js` failure

`tests/phase8_matching_c.js:81-87` hard-codes the old Phase 2 aggregate counts: 36 proof targets,
3 pure targets, 33 hybrid targets, zero transformed targets, and zero transformations. The
immediate parent already has 37 active targets, 5 pure targets, and 32 hybrid targets. The current
fresh Phase 8 report has two transformed targets and 17 transformations, with all 32 hybrid
outputs byte-identical and zero hybrid transformations.

The legacy test, target configuration, compiler-dialect configuration, source-policy
configuration, and Phase 8 implementation are unchanged between the parent and reviewed commit.
The failure is therefore pre-existing and orthogonal to this structural change. It was not
weakened, updated, or counted as the blocking finding. It should remain a separate maintenance
task.

## Review-protocol deviations and setup failures

Two setup failures were corrected without changing the implementation:

1. The clean clone did not contain the ignored `.toolchains` directory. A clone-local junction to
   the already authenticated canonical toolchain directory was added before rerunning the build.
2. The first workflow-acceptance invocation lacked machine-local configuration. The rerun supplied
   the existing authenticated local-tools configuration and reviewer-owned external work root.

One protocol deviation remains disclosed: the shell wrapper around `node tools/audit.js` timed out
after approximately 604 seconds, while the audit child process continued. The same process was
monitored through setup, fresh Phase 7, fresh Phase 8, verification, and source recompilation until
it exited and wrote `build/audit/report.json` with `status: pass`. Because the wrapper had already
timed out, its final process exit code was not captured. The generated report, setup report,
fingerprints, fresh roots, exact artifacts, and normal verifier were inspected independently.

No other unresolved ambiguity was found.

## Final disposition

Do not approve commit `d804a652827ed8c4dd6ba80ab1fa4ebe961cfe6c` as reviewed.

The slab geometry, ownership, descriptors, overlap treatment, p0810 split, p0910 inactivity, and
exact ROMs pass. Approval requires the smallest production-verifier correction described in the
finding, adversarial tests for both directions of `PT_LOAD.p_flags` drift, fresh Phase 7 and Phase
8 outputs, a fresh heavyweight audit, a normal verifier pass, exact authenticated-ROM comparison,
and another independent structural review.
