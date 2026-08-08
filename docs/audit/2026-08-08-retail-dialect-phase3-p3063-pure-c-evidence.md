# Phase 3 p3063 pure-C migration evidence

Completed. Removing p3063's local `move` macro produced exact `PURE_C` output through fourteen authenticated adapter rewrites. The result proves the first production use of the retail compiler dialect. The Director must intake this result and route independent critical review.

## Assignment and baseline

- Task ID: `ob64-retail-dialect-phase3-p3063-pure-c`.
- Assignment revision: `1`.
- Launch ID: `bdd8a3caac774cf5af0e78182a5680a3`.
- Parent starting HEAD: `1ac946fae7fee8e601902da8c3234b8e3b8eef62`.
- Decomp starting HEAD: `8b35468b82f2e0b0afd7aa9729926b064b9ba328`.
- Accepted Phase 2 worker commit: `4fc51f3590004fba670b2e3b679d4602bcee2313`.
- Assignment SHA-256: `0E9F64442D3167284AF9D9CCDCEA714809BFA9EE41D0B6016D3DA8EF01E76D58`.
- Claim SHA-256: `9479429840750B9AAA63BC1AA1B34E5B6F878994F11A6C65D8D1273362158D3D`.
- Accepted Phase 2 review SHA-256: `97008650A257791CBB7A6570B75885469A7EE2609A65A81DF792CBBD3E6BEAA4`.

The starting p3063 source SHA-256 was `284DC9EC2BF1ACBC31DE8E81F33B85393B89CEBE15309B162A39540C5302DA5D`.

The final p3063 source SHA-256 is `4FBF235DB64C85E84A2AD7DF7118346749587FBB2986EE00DF613EF9C8D3E121`.

## Authorized source change

The tracked source diff removes only this translation-unit-local assembler macro statement:

```diff
-asm(".macro move dst,src\n"
-    "addu \\dst,\\src,$0\n"
-    ".endm\n");
-
```

`git diff --check -- src/lib/func_0019554C.c` returned no error.

`git diff --name-only -- src asm` returned only `src/lib/func_0019554C.c`.

The pre-existing untracked p3062 source remained 1,901 bytes. Its SHA-256 remains `4E9A6866EAFD8CC3DBCF88556CCDD2474FBD8CA7DC19B7C93518761E9CF53876`.

## Source-policy evidence

The worker ran this command before and after the source edit:

```text
node tools/source_policy.js --target func_0019554C
```

Before the edit, source policy reported `HYBRID_C`. One raw and one preprocessed `asm` token caused that classification.

The pre-edit generated report had SHA-256 `ED0516ACA6EA781081348CFC94C033FFC4CBE978A50346AF82ED7A0045AFBF85`.

After the edit, source policy reported `PURE_C`. The reasons list was empty.

The post-edit target digest is `2C6797CC30FD718E72CD967FB82C312366586F31C99F20E4B21C4241646FF7D4`.

The focused post-edit report had SHA-256 `A932BF0CFDBDE7834F1BF61C49B7ECDC3988A2328734660C4AB19317173ACF76`.

The final corpus report is `build/source-policy/report.json`. It is 119,722 bytes with SHA-256 `5B1E9F5D7ADF7F21F0F0D2D9749879D2E3E246F62B40D0B47A7F0044E7C0D012`.

The final report records four `PURE_C`, 32 `HYBRID_C`, zero `ASM`, and zero `UNKNOWN` targets.

The final report records 772 pure-C bytes and 6,952 hybrid-C bytes.

## Authenticated tool identities

| Tool or contract | SHA-256 | Evidence role |
|---|---|---|
| KMC `cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` | Compiles the accepted C dialect |
| KMC reproduction manifest | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` | Pins compiler origin and flags |
| GNU assembler 2.39 | `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697` | Assembles adapted MIPS source |
| Source-policy configuration | `C9373F7003A419CC8C1E9F6AF380134AFE2A56A0BFDDF575983AB651F5866F2A` | Defines source classes |
| Dialect manifest | `FD87D6E56A9285D7D37A6FCFCE972787FDED7C7B5A4C8536EF50A5408F1D0331` | Authenticates the single rewrite rule |
| Dialect implementation | `224E12F01B28E30C1402E0C6A6524529DA21C26E6BD62CDF953FF198A8229B12` | Implements numeric `move` adaptation |

The accepted rule is `move $N,$M` to `addu $N,$M,$0`. Both operands must be numeric general-purpose registers.

## p3063 placement and ownership

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---:|---|---|
| p3063 ROM start | First byte of the migrated function | `0x0019554C` | z64 ROM offset | Pins placement start |
| p3063 ROM end | First byte after the migrated function | `0x001957D0` | z64 ROM offset | Pins 644-byte extent |
| p3063 runtime entry | Function entry after slab relocation | `0x802150BC` | RAM virtual address | Pins runtime placement |
| memset OR word one | First protected OR encoding | `+0x004` | Function-relative offset | Detects unintended dialect rewriting |
| memset OR word two | Second protected OR encoding | `+0x028` | Function-relative offset | Detects unintended dialect rewriting |

The target section remains `.ob64.r3063`. Its sole linked owner remains `objects/c/func_0019554C.o`.

The map contribution is `.ob64.r3063 0x00000000802150bc 0x284 objects/c/func_0019554C.o`.

The linked symbol is `func_0019554C`. The target contains 644 bytes.

The target SHA-256 is `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B`.

The linked fallback does not own p3063. The comparison fallback remains available only as evidence.

The fallback object SHA-256 is `49666CECBC84B5EDAA8327169FD1B248A657D588B07F94915B0D998A6EB07F36`.

The pruned assembly object SHA-256 is `7F3AF70E4FB9B5CEEFDDA195B8B416369C8C92FD3A9FB44CE4D6AC22AA2AB928`.

The pruned object preserved 69 other target sections from its assembly chunk.

The C object retains 32 relocations. They contain 31 `.rel.text` records and one `.rel.pdr` record.

The dialect proof records every relocation offset, type, and symbol. Its SHA-256 is `AE89C021855AEEF35A986D8ABA3F46B794AD94733B0E54B2D0DE05C4E4097718`.

Referenced symbols include the five p3063 globals, six external functions, `.text`, and `func_0019554C`.

## Focused exactness

The focused command was:

```text
node tools/diff.js func_0019554C
```

It passed in 118.9 seconds. The result was `PURE_C`, score `0 / 16100`, and exact raw linked bytes.

The focused report is `build/diff/func_0019554C.json`. It is 7,565 bytes with SHA-256 `0A6A3EB97D7A74DDB4C87DF0C8EF6C286B3AB3C98F0217830A87D7D1FD0850E3`.

The focused external root was `C:\Users\Joe\.codex\ob64-decomp-current\diff\func_0019554C-1786172362494-8bccc4`.

The required target verifier command was:

```text
node tools/verify.js --target func_0019554C --require-pure
```

It passed in 607 seconds. Ownership, placement, relocations, target bytes, and full-ROM bytes were exact.

## Independent assembly comparison

The worker compared the retained compiler and dialect files without calling the adapter.

The comparison found fourteen differences at lines `25, 27, 29, 31, 104, 121, 130, 161, 175, 184, 203, 220, 280, 292`.

Each raw line was a numeric-register `move`. Each matching dialect line was the required `addu` form.

The six explicit OR statements were at lines `39, 166, 194, 214, 223, 254`.

Every explicit OR statement remained byte-identical. Every other assembly line also remained byte-identical.

The final read-only comparison used this command:

```powershell
$env:PHASE3_CLEAN_A='C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-a'
@'
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const root = process.env.PHASE3_CLEAN_A;
const rawPath = path.join(root, 'generated', 'c', 'func_0019554C.compiler.s');
const dialectPath = path.join(root, 'generated', 'c', 'func_0019554C.dialect.s');
const rawBuffer = fs.readFileSync(rawPath);
const dialectBuffer = fs.readFileSync(dialectPath);
const raw = rawBuffer.toString('utf8').trimEnd().split(/\r?\n/);
const dialect = dialectBuffer.toString('utf8').trimEnd().split(/\r?\n/);
if (raw.length !== dialect.length) throw new Error('line-count drift');
const differences = [];
for (let i = 0; i < raw.length; i += 1) if (raw[i] !== dialect[i]) differences.push(i);
if (differences.length !== 14) throw new Error('difference-count drift');
for (const i of differences) {
  const match = raw[i].match(/^(\s*)move\s+\$(\d+),\$(\d+)\s*$/);
  if (!match) throw new Error(`unsupported raw difference at line ${i + 1}`);
  const expected = `${match[1]}addu $${match[2]},$${match[3]},$0`;
  if (dialect[i].replace(/\s+/g, ' ').trim() !== expected.replace(/\s+/g, ' ').trim()) throw new Error('adaptation drift');
}
const explicitOr = raw.map((line, i) => ({line, i})).filter(({line}) => /^\s*or\s+\$\d+,\$\d+,\$\d+\s*$/.test(line));
if (explicitOr.length !== 6) throw new Error('explicit-or count drift');
for (const {line, i} of explicitOr) if (dialect[i] !== line) throw new Error('explicit OR changed');
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
console.log({ differences: differences.length, explicitOr: explicitOr.length, raw: sha(rawBuffer), dialect: sha(dialectBuffer) });
'@ | node -
```

## Retained p3063 artifacts

Both clean roots retained these byte-identical artifacts:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| Raw compiler assembly | 4,925 | `291C3F051CF0263FFA881399836C94082738F0AC974F1D4D3FF09EDB6938EBC7` |
| Dialect assembly | 4,967 | `5CE7979849B8EC8D0FCC29E146C46538ABBA8E8A014D27F402E4F8976E9C0FBE` |
| Section-adjusted assembly | 4,996 | `73ACF3C7203D158CA4B7CBAAAB1093123206A453C32FB44CF95CA9F091FC0345` |
| Dialect proof | 8,141 | `AE89C021855AEEF35A986D8ABA3F46B794AD94733B0E54B2D0DE05C4E4097718` |
| C object | 2,620 | `7A9E9A3F34FDA43AB7C3D1D86267F8285FF294DD22E864A9DD7B3CB107AFC9A6` |
| C-object target section | 644 | `BC0FE46D706BEB4ACFE1EC94456DD35B9B1536DD545BAEB828BBD369661A7AE0` |
| asm-differ proof | 80,536 | `A59947E02BC309BCB91B0981E9B2DD2117E05A0D940F51AE067DEB2EFF18D2B7` |
| Resolved proof object | 234,496 | `761FD584EBC392152AFA6EDC8459D6312E2175B4A06882A063AADD86A66FD3B2` |
| Linked target | 644 | `5985A5DFC866D4EFFB58C0E412AA76A8E0AE8DA0EF19BB8E44A6BF278C2A5E2B` |

The proof reports fourteen transformations, zero markers, six explicit OR statements, and zero unsupported forms.

## Mandatory memset regression

The regression command was:

```text
node tools/verify.js --target func_0002CD70
```

It passed in 301.2 seconds. The target remained `HYBRID_C` with zero transformations.

Its raw and dialect assembly share SHA-256 `040B9057A3F11214D78D719ACD75E96621056A172A862C24120A9DC84DB66969`.

Its linked target remains SHA-256 `9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

Its dialect proof remains SHA-256 `833F708E10695BAFB2E47A44BD3FBCE15795702069D329F4061CF56130BC8864`.

A direct big-endian ROM read confirmed `0x00801025` at both protected function-relative offsets.

The connected heavyweight audit independently repeated this read.

## Two clean external builds

The fresh evidence root was absent before launch:

`C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5`

The build commands differed only by the final output directory:

```text
node tools/build_phase8_matching_c.js --output C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-a --phase7-output C:\Users\Joe\.codex\ob64-decomp-current\baseline\38505f4e9dec810884884cf4\phase7 --compiler C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe --splat-python C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe --splat-split C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
node tools/build_phase8_matching_c.js --output C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-b --phase7-output C:\Users\Joe\.codex\ob64-decomp-current\baseline\38505f4e9dec810884884cf4\phase7 --compiler C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe --splat-python C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe --splat-split C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ"
```

Build A passed in 274.4 seconds. Build B passed in 292.3 seconds.

The strict verification commands were:

```text
node tools/verify_phase8_matching_c.js --output C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-a --compiler C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe --splat-python C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe --splat-split C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-a\verification.json
node tools/verify_phase8_matching_c.js --output C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-b --compiler C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe --splat-python C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe --splat-split C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py --asm-differ "C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ" --report C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-b\verification.json
```

Strict verification A passed in 179.5 seconds. Strict verification B passed in 191.8 seconds.

The comparison command was:

```text
node tools/compare_phase8_reproducibility.js --left C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-a --right C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\run-b --report C:\Users\Joe\AppData\Local\Temp\ob64-phase3-clean-e3f4795a61a64f8889d1b8669224f1f5\reproducibility.json
```

The comparator passed all 36 targets and 36 asm-differ records. It reported byte-identical build and verification reports.

| Clean artifact | Bytes | SHA-256 | A/B result |
|---|---:|---|---|
| Build report | 503,980 | `F9A211F3E15BC483149D92BB71E342BED4082AAF9E8D3E19BAC22EB90F3799C5` | Identical |
| Verification report | 185,503 | `9BAEB36BDBB588EB99C765BC9D4352A7E585BC85DD1A500C042AAF5E45199813` | Identical |
| Phase 8 ELF | 44,138,012 | `D7D27A84287557F020B264D9F10D03CDE83CEFE0D9F930D6060EDFEC3F16F03B` | Identical |
| Link map | 7,032,523 | `56D405EB7C2050856394C9D6C73826D0E7A3F01B8AF6F33BAB90B0652662E427` | Identical |
| Layout | 5,131,776 | `964AC5ACBFEDE2E499AA9A017FB845228B9C7D30A3C21387966FEFEB3A4A92BB` | Identical |
| readelf report | 4,627,202 | `5E9BACDDF3D562B98E872F20103D83B1B360B2F88B9EA462DCCF417F86F7E829` | Identical |
| Object manifest | 36,155 | `ADBA23FAB2242F53EF21E7656157F68581CF21223F663328A6E0ADE09C495F48` | Identical |
| Full ROM | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` | Identical |
| Reproducibility report | 150,730 | `AB0FCA84A0FF26D49F3D9580F2E4A644B63465F76F4A9D91707AD7A352E833FD` | Shared report |

The report compares every proof, object, linked target, relocation set, and major linked output.

Both builds report 36 proofs, four pure targets, 32 hybrid targets, and one transformed target.

Both builds report fourteen transformations. All 32 hybrid raw and dialect files remain byte-identical.

## Full verifier and connected audit

The canonical full verifier command was:

```text
node tools/verify.js
```

It passed in 332.6 seconds. Baserom, toolchain, source policy, ownership, placement, and relocations passed.

The verifier reported exact target bytes and an exact full ROM.

The heavyweight audit command was:

```text
node tools/audit.js
```

It remained connected for 10,703.2 seconds and passed. Structural protections and current exact-ROM verification both passed.

| Final audit artifact | Bytes | SHA-256 |
|---|---:|---|
| Audit report | 1,888 | `B3D02E36F29247A96289549139609655C59B23282E6AC36ECD4312373334FA22` |
| Structural report | 7,801 | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` |
| Current state | 1,106 | `6AA4C05668E4E5C3DF800985563B46AC3A501EF53A7DF784F664EC8D09DBC61C` |
| Current verification | 185,503 | `9BAEB36BDBB588EB99C765BC9D4352A7E585BC85DD1A500C042AAF5E45199813` |
| Fresh compilation | 101,787 | `2D75E864AC09E21C90E51ACEAC6CCAAFE7B98D8A9018C415DF55C944BB04219D` |
| Final source policy | 119,722 | `5B1E9F5D7ADF7F21F0F0D2D9749879D2E3E246F62B40D0B47A7F0044E7C0D012` |
| Current build report | 503,980 | `F9A211F3E15BC483149D92BB71E342BED4082AAF9E8D3E19BAC22EB90F3799C5` |
| Current full ROM | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

The current fingerprint is `F344A83DD10D3002966172C7F179EA1D8A88B8ED2A5A331003DFDDF44A75005F`.

The accepted baseline fingerprint is `38505F4E9DEC810884884CF4AC1709B72011C7E16CE57D3EFA2891A0DF794DA9`.

The current output root is `C:\Users\Joe\.codex\ob64-decomp-current\current\f344a83dd10d3002966172c7\build`.

The structural stage assembled 6,184 tracked real-assembly owners. The assembled code SHA-256 is `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409`.

The audit reports one transformed target and fourteen transformations. It reports 32 byte-identical hybrid passthrough targets.

The audit independently records both protected memset words as `0x00801025`.

## Preservation and attribution

The final dirty-path inventory matches the recorded baseline plus the assigned Phase 3 paths.

No configuration, infrastructure, placement, ownership, relocation, queue, or other source file changed for this task.

The accepted adapter implementation identities remained unchanged:

| Preserved surface | SHA-256 |
|---|---|
| `config/matching-c-targets.json` | `2ACF81D5DD6DF7BD0032C59AF24AF3001BD0AB7FE276DADE47AD084D3058A343` |
| `tools/lib/active_targets.js` | `AEAED0DB44C18949B7E486EE152B1C310CF97D24A96300C92D34F562ECB07FC8` |
| `tools/lib/source_policy.js` | `C6DA9A25C437A26F0C4985E4766B7299815AEE19435FC7C96AD73CB772709987` |
| `tools/lib/phase8_matching_c.js` | `C80641EA4A6088C17A6AB4ACB4432046722A6168FD59C3F2F57432EC92F00A58` |
| `tools/build_phase8_matching_c.js` | `B8B103607B674A9993A58D51C67DC5796530175D47499D9737C3BD929F2D76C5` |
| `tools/verify_phase8_matching_c.js` | `F6A5EEC2208D5E86F76027556F3E048C7A40511C1BE2842624C8458DBC265DDD` |
| `tools/lib/current_workflow.js` | `DA0EC791A8825D570D259E6F905F7A742544C16057A1F0FDD8647D4B2B47A8C8` |
| `tools/compare_phase8_reproducibility.js` | `FB591241A14F5507C8DA8D51294F353904FB4BE6B685026D76FDDDBE0CE745F5` |
| `tools/diff.js` | `E83E7F2AD4F81AB3E68FB629111287D05466918F26141819356187EE430881FD` |
| `tools/audit.js` | `1F2F29148B5183511623FC5F7750BD735F2AB1DD7D9EBF79A002E13649272B9D` |

The external p3063 permuters remained outside this task. The worker did not inspect or control them.

## Failure and deviation record

One read-only diagnostic error occurred.

A PowerShell big-endian decoder truncated the protected words to their low byte. It changed no file and supplied no evidence claim.

A direct Node `Buffer.readUInt32BE()` check produced both required `0x00801025` values.

No required build, verifier, comparator, or audit gate failed.

No protocol deviation or concurrent-actor collision occurred.

## Claims and review state

| Claim | Evidence grade | Independent review |
|---|---|---|
| p3063 is `PURE_C` with no assembler mechanism | `Verified` | `pending` |
| Exactly fourteen supported numeric moves are adapted | `Verified` | `pending` |
| Every explicit OR statement remains unchanged | `Verified` | `pending` |
| Placement, ownership, symbols, relocations, and bytes remain exact | `Verified` | `pending` |
| Every hybrid target remains byte-identical with zero transformations | `Verified` | `pending` |
| Two clean roots reproduce all required artifacts | `Verified` | `pending` |
| The full verifier and heavyweight audit pass | `Verified` | `pending` |

## Residual limits and falsifiers

The worker cannot independently accept its own result. Critical independent review remains required.

Exact retail bytes prove output equivalence. They do not prove which pseudoinstruction spelling the original developers wrote.

Any later source, proof, tool identity, relocation, target, or ROM hash drift falsifies this result.

The function queue remains paused until the Director records accepted independent review.
