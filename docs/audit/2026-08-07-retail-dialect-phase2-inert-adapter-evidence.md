# Retail dialect Phase 2 inert-adapter evidence

Completed. Phase 2 adds an authenticated compiler-assembly adapter with zero current transformations. This preserves every active owner and the retail ROM. The Director must freeze this result and route independent review.

Review status: `pending`.

## Scope and provenance

- Assignment: `docs/Plans/prompts/ob64-retail-dialect-phase2-inert-adapter-20260807-r2.md`.
- Assignment SHA-256: `DDB927AF70BDAEDCDE374ED983A6DE5B16709E9BB8DFAA5BE83FD9F281896C72`.
- Launch ID: `1c3d7093d091473a85033743eb068a22`.
- Parent starting HEAD: `1ac946fae7fee8e601902da8c3234b8e3b8eef62`.
- Decomp starting HEAD: `39c4cc1a3bb5a62ed171032469362760a9a35c5c`.
- Phase 1 dependency: `eace7a5b63febfff0f3a53934e730cdedc4f33b6`.
- Branch: `main`.
- Inventory profile: `NORMAL`.
- Claim: `docs/Plans/task-logs/ob64-retail-dialect-phase2-r2-1c3d7093d091473a85033743eb068a22.claim.json`.
- Claim SHA-256: `07BC799EB8454EB680208DC5590102FEB37898900A6DEAFAF8C4CA948091243E`.

No file under `src/` or `asm/` changed during Phase 2. The pre-existing untracked
`src/lib/func_00195410.c` remained 1,901 bytes with SHA-256
`4E9A6866EAFD8CC3DBCF88556CCDD2474FBD8CA7DC19B7C93518761E9CF53876`.

## Adapter identity

| Artifact | SHA-256 | Evidence role |
|---|---|---|
| `config/compiler-assembly-dialect.json` | `FD87D6E56A9285D7D37A6FCFCE972787FDED7C7B5A4C8536EF50A5408F1D0331` | Authenticated dialect contract |
| `tools/lib/compiler_assembly_dialect.js` | `224E12F01B28E30C1402E0C6A6524529DA21C26E6BD62CDF953FF198A8229B12` | Target-blind implementation |
| KMC `cc1.exe` | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` | Pinned compiler executable |
| KMC reproduction manifest | `98C8ACC06A8FBF40DADBD25AE20C2539E8765E14EA12895158C37CC413D06C26` | Compiler provenance and flags |
| `config/toolchain.json` | `5A93298ED635C5FC6458C9DC1BBEB45A3EDCA7C4683D6E329BCE838E942B30FD` | GNU assembler contract |
| GNU assembler 2.39 | `D237475181458118BF964C369748ACF144394583C5DC24293F53F1C9119E8697` | Pinned assembler executable |
| `config/source-policy.json` | `C9373F7003A419CC8C1E9F6AF380134AFE2A56A0BFDDF575983AB651F5866F2A` | Classification contract |

The sole rule is `move $N,$M` to `addu $N,$M,$0`. Both operand registers must be numeric general-purpose registers from `$0` through `$31`.

The transformer API receives only assembly bytes and source class. It receives no symbol, address, expected byte, expected hash, or expected count.

`UNKNOWN` rejects before adaptation. `HYBRID_C` uses opaque byte passthrough. Only marker-free `PURE_C` enters the numeric move parser.

## Implementation identities

| Surface | SHA-256 |
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

The build retains raw compiler assembly, dialect assembly, section-adjusted assembly, object bytes, and a deterministic proof for each target.

The strict verifier recreates both derived assembly stages and every proof. It rejects stale schemas, missing artifacts, identity drift, count drift, and byte drift.

## Focused tests

Commands:

```text
node tests/compiler_assembly_dialect.js
node tests/active_targets.js
node tests/source_policy.js
node tests/binutils_smoke.js
node tests/phase8_matching_c.js --output C:\Users\Joe\AppData\Local\Temp\ob64-phase2-focused-upgrade-b18f1f302cd54b4585f6944247fbd9cf
node tests/workflow_acceptance.js --output C:\Users\Joe\AppData\Local\Temp\ob64-phase2-focused-upgrade-b18f1f302cd54b4585f6944247fbd9cf
node tests/workflow_parity.js --old-root C:\Users\Joe\.codex\ob64-workflow-migration-20260807-frozen-b28f3e0 --new-output C:\Users\Joe\AppData\Local\Temp\ob64-phase2-focused-upgrade-b18f1f302cd54b4585f6944247fbd9cf
node tests/diff_exactness.js
node tests/word_asm_smoke.js
```

All commands passed. The binutils smoke test proved GNU `move $2,$4` emits `0x00801025`.

The adapted `addu $2,$4,$0` form emitted `0x00801021`. This distinguishes the two machine encodings directly.

The workflow-acceptance suite rejected stale build and verification schemas, missing proofs, proof drift, hybrid hash drift, unknown classification, and stale fingerprints.

The focused Phase 8 suite reconstructed all 36 proofs. It found three `PURE_C` targets, 33 `HYBRID_C` targets, and zero transformations.

## Authentic hybrid fixtures

| Fixture | Bytes | SHA-256 | Marker evidence |
|---|---:|---|---|
| `func_0002CD70.compiler.s` | 998 | `040B9057A3F11214D78D719ACD75E96621056A172A862C24120A9DC84DB66969` | Five APP and four NO_APP markers |
| `func_0025C8A4.compiler.s` | 840 | `2F5732577B0A3F9D4B4BA470F90D6D8D6A1E5BBABF94AB50002B7F5CA2E4D095` | One APP and zero NO_APP markers |

Both fixtures passed as opaque `HYBRID_C` bytes. The unit suite rejected any hybrid mutation, hash mismatch, or nonzero transformation count.

Pure inputs with APP-only, NO_APP-only, balanced markers, or terminal APP state rejected before move parsing.

## Two clean external builds

The evidence root is:

`C:\Users\Joe\AppData\Local\Temp\ob64-phase2-clean-c7f73e9edae844dba52dfd331d4ff50d`

Exact command setup:

```powershell
$phase7 = 'C:\Users\Joe\.codex\ob64-decomp-current\baseline\38505f4e9dec810884884cf4\phase7'
$compiler = 'C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\toolchain\kmc-gcc-2.7.2\cc1.exe'
$splatPython = 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe'
$splatSplit = 'C:\Users\Joe\.codex\phase5b-splat-20260801-r4\splat-source\split.py'
$asmDiffer = 'C:\Users\Joe\Projects\OgreBattlel64\ModderResources\External Decomp Research\ogrebattle64-codeberg\tools\asm-differ'
$evidence = 'C:\Users\Joe\AppData\Local\Temp\ob64-phase2-clean-c7f73e9edae844dba52dfd331d4ff50d'
```

Exact build and verification commands:

```powershell
node tools/build_phase8_matching_c.js --output "$evidence\run-a" --phase7-output $phase7 --compiler $compiler --splat-python $splatPython --splat-split $splatSplit --asm-differ $asmDiffer
node tools/verify_phase8_matching_c.js --output "$evidence\run-a" --compiler $compiler --splat-python $splatPython --splat-split $splatSplit --asm-differ $asmDiffer --report "$evidence\run-a\verification.json"
node tools/build_phase8_matching_c.js --output "$evidence\run-b" --phase7-output $phase7 --compiler $compiler --splat-python $splatPython --splat-split $splatSplit --asm-differ $asmDiffer
node tools/verify_phase8_matching_c.js --output "$evidence\run-b" --compiler $compiler --splat-python $splatPython --splat-split $splatSplit --asm-differ $asmDiffer --report "$evidence\run-b\verification.json"
node tools/compare_phase8_reproducibility.js --left "$evidence\run-a" --right "$evidence\run-b" --report "$evidence\reproducibility.json"
```

Run A built in 245.9 seconds and verified in 151.5 seconds. Run B built in 261.2 seconds and verified in 182.2 seconds.

The comparator passed. It matched both reports, all 36 proofs, all 36 objects, all 36 linked targets, and all linked outputs.

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| Both `build-report.json` files | 504,371 | `7A7D8EDE7A7AB91B804319670A6E14D5E8D285234A3A36983E36412F4DE2FB2E` |
| Both `verification.json` files | 185,501 | `C753877C2FF156ABF39CB1A1BED032D65346A956F4B80A6A092BEF3CF22E0BC8` |
| `reproducibility.json` | 150,730 | `3079CDFE20EEF337AD8A674DC23951FD4C1BECF60E75D849811FCF8745ED187C` |
| `phase8.elf` | 44,138,012 | `D7D27A84287557F020B264D9F10D03CDE83CEFE0D9F930D6060EDFEC3F16F03B` |
| `phase8.map` | 7,032,523 | `56D405EB7C2050856394C9D6C73826D0E7A3F01B8AF6F33BAB90B0652662E427` |
| `layout.json` | 5,131,776 | `964AC5ACBFEDE2E499AA9A017FB845228B9C7D30A3C21387966FEFEB3A4A92BB` |
| `phase8.readelf.txt` | 4,627,202 | `5E9BACDDF3D562B98E872F20103D83B1B360B2F88B9EA462DCCF417F86F7E829` |
| `objects/manifest.json` | 36,155 | `ADBA23FAB2242F53EF21E7656157F68581CF21223F663328A6E0ADE09C495F48` |
| `phase8.us_rev0.z64` | 41,943,040 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |

Both builds reported 36 proofs, three pure targets, 33 hybrid targets, zero transformed targets, and zero transformations.

All 33 hybrid targets had identical raw and adapted bytes. Every object, target, placement, owner, symbol, size, and relocation remained exact.

## Mandatory OR regression

`func_0002CD70` remained `HYBRID_C`. Its linked target retained SHA-256
`9842231309587A8F054CE82E257F9DC0FD864608CF90266F53AFF570E37E1ADF`.

The target's big-endian words at function-relative offsets `+0x004` and `+0x028` remained
`0x00801025`. These correspond to z64 ROM offsets `0x0002CD74` and `0x0002CD98`.

Its run-A proof had SHA-256
`833F708E10695BAFB2E47A44BD3FBCE15795702069D329F4061CF56130BC8864`.

The proof recorded five APP markers, four NO_APP markers, two explicit OR statements, and zero transformations.

## Normal verification and heavyweight audit

Commands:

```text
node tools/verify.js
node tools/verify.js --target func_0002CD70
node tools/audit.js
```

The normal verifier passed in 619.6 seconds. It proved all 36 targets and the complete retail ROM.

The focused target verifier passed in 269 seconds. It preserved `HYBRID_C`, exact linked bytes, and exact full-ROM bytes.

The connected audit passed in 8,732.8 seconds. It reported structural protections and CURRENT exact-ROM verification as `PASS`.

| Audit artifact | Bytes | SHA-256 |
|---|---:|---|
| `build/setup/verify-setup-report.json` | 7,801 | `984BF75ED781E9E7D9C6B7A228D8AECDA22CBBC38911979157E0793004342D41` |
| `build/current/state.json` | 1,106 | `F31D3D941B314E038E35715F21B822B2C9B0C8851BEE6F6DB2AAD8B706071305` |
| `build/current/fresh-compilation.json` | 101,824 | `3435E6BB909E7D85450980C1107C7DFB21B0AA6E676CF39969AE8AB055CC40CD` |
| `build/current/verification.json` | 185,501 | `C753877C2FF156ABF39CB1A1BED032D65346A956F4B80A6A092BEF3CF22E0BC8` |
| `build/source-policy/report.json` | 120,049 | `D2201ACDB7DFF117586BF896D71FB88A3C9CFE7D8EC3FC34D708739D7AB095B4` |
| `build/audit/report.json` | 1,887 | `C51004FD892E19A7BC699AA60160B17AF674A3DE1D934C97F218303D19ED4CAE` |

The audit independently read the rebuilt ROM words for `func_0002CD70`. It also derived all dialect counts from verified target proofs.

## Preservation and attribution

The three overlapping files were compared with their supplied pre-Phase-2 copies.

| Path | Pre-Phase-2 SHA-256 | Preservation result |
|---|---|---|
| `config/README.md` | `DE70B0C5B1520DD0881E3E264AFB4B2C9BDCC9CF33F437332FBBE3FFC8F81BB3` | Only the adapter documentation was appended |
| `config/matching-c-targets.json` | `C7B09D281225D195CCF8F002580189071229D7E8160813B7D34D230632B4AB06` | Only schema 2 and one top-level manifest pin were added |
| `tools/lib/current_workflow.js` | `5229608481A550361D88073B19FE1EBE8847081B8F440642206305417BC70A72` | Only Phase 2 classification, fingerprint, proof, and schema logic changed |

The 36 target entries remained identical as parsed JSON. The Director must stage these three files by attributable hunk.

`config/toolchain.json` and `config/source-policy.json` remained unchanged. The dirty `config/phase8/matching-c.json` remained outside Phase 2 ownership.

Final static checks passed for 17 JavaScript files and both changed JSON contracts. Scoped `git diff --check` reported no whitespace errors.

## Failures and protocol deviations

A read-only helper exceeded its authority by running `node tests/active_targets.js`. That command wrote one ignored generated report under `build/workflow-migration/`.

The worker stopped, interrupted the helper, preserved the file, and reported the collision. The Director authorized resumption after confirming containment.

The first binutils smoke command reached a 60-second wrapper timeout. A connected rerun completed in 190.3 seconds and passed.

The first audit wrapper reached its 30-minute bound during structural reconstruction. Its detached child later exited without a new final report or verdict.

The second audit used a connected four-hour bound. It completed successfully and supplied the evidence above.

## Claims

### Claim 1

- Claim: The adapter is authenticated, deterministic, target-blind, and fail-closed.
- Evidence grade: `Verified`.
- Review status: `pending`.
- Scope and context: Current Phase 2 compiler-assembly outputs.
- Supporting artifacts: Manifest, module, unit suite, manifest mutation suite, and strict verifier.
- Independent corroboration: The verifier recreated every adapted file and proof.
- Competing interpretation: Hidden target metadata could select transformations.
- Falsifier: Any accepted forbidden option, identity drift, unsupported syntax, or proof mismatch.
- Known limits: The original retail assembler identity remains unknown.
- Product consequence: Later pure-C migrations can use one reviewable rewrite rule.

### Claim 2

- Claim: Every current hybrid target bypasses parsing with byte-identical output and zero transformations.
- Evidence grade: `Verified`.
- Review status: `pending`.
- Scope and context: All 33 active `HYBRID_C` targets.
- Supporting artifacts: Two clean builds, 33 hybrid proofs, strict verification, and audit counts.
- Independent corroboration: Reproducibility compared both raw and adapted files across two roots.
- Competing interpretation: APP-marker imbalance could make terminal compiler output invalid.
- Falsifier: Any hybrid byte or hash mismatch, parser entry, or nonzero transformation count.
- Known limits: Hybrid source remains outside the official matching-C count.
- Product consequence: Existing inline assembly cannot be silently rewritten.

### Claim 3

- Claim: Phase 2 preserves all active target semantics and the complete retail ROM.
- Evidence grade: `Verified`.
- Review status: `pending`.
- Scope and context: All 36 active source replacements on US Rev 0.
- Supporting artifacts: Two clean builds, normal verification, target verification, and heavyweight audit.
- Independent corroboration: Clean roots produced identical reports, objects, targets, proofs, and ROMs.
- Competing interpretation: Reused build state could hide a changed object.
- Falsifier: Any clean rebuild mismatch in ownership, placement, relocation, target, or ROM bytes.
- Known limits: This result does not test a nonzero adapter transformation in production.
- Product consequence: Phase 3 can start from an exact inert adapter boundary after review.

## Limits

Phase 2 does not change any C or assembly source. It does not migrate p3063 or resume the function queue.

Zero transformations are the observed inert result. They are not a permanent rule for eligible pure-C migrations.

This worker result does not accept itself. Independent critical review remains mandatory before Phase 3.
