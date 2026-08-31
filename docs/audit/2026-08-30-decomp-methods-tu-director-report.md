# Decompilation methods and intended translation-unit recovery — Director report

Date: 2026-08-30

Director branch: `codex/decomp-methods-tu-director`

Base commit: `ee6151458d789cab3d1242637b873ae0da5b2cee`
Final implementation commit before this report: `c5e38cac145e5711a084da546590346dfb982102`

The exact branch HEAD after committing this report is recorded in the Director handoff. A commit cannot contain its own hash; the implementation hash above is the exact reviewed and verified code state.

## Decision summary

Keep m2c, through the current `tools/match.js` workbench, as the default candidate generator. Do not add asmlift as a product provider yet: on the 34-target corpus it emitted one candidate and explicitly refused 33. Do not fork m2c for KMC source-shape search. Keep observed KMC transformations in the workbench, and change m2c itself only when a reproduced defect belongs to its parser, CFG, IR, or type recovery.

Multi-function input did not materially improve lifting on this pilot. Compiling ordinary functions together did not change any tested function text after relocation. It did expose shared prototype/type problems and changed scratch object packaging, alignment, and section-relative data addends.

The repository has not broadly split logical functions too finely. It has likely split source translation units more finely than the original organization, but the exact original TU boundaries remain unproven. The first real intended-TU reconstruction should investigate the `0x00283DF0..0x002866E4` parser/resource/scanner region, with `func_00284288` and the three logical functions inside accepted owner `func_002861C8` at its center. That should be a later dedicated structural task, not a canonical regrouping in this pilot.

This branch implements two bounded workbench improvements only:

1. a scratch-specific, fail-closed KMC compilation path that safely scores exact, shorter, longer, and diagnostic `.rodata` candidates without weakening canonical compilation; and
2. a schema-v2, evidence-bearing mismatch classifier with exact byte/instruction counts, bounded multi-label guidance, and conservative relocation identity.

It does not implement a provider abstraction, asmlift integration, a TU manifest, grouped canonical objects, or target reconstruction.

## Scope and vocabulary

The investigation kept these concepts separate:

- A **logical function** is a callable routine or a proven multi-entry routine.
- An **accepted owner** is the exact ROM/runtime range and linked-byte owner recognized by this repository.
- A **translation unit** is one or more logical functions plus file-local data compiled into one object.

One TU can contain many valid logical functions. One accepted owner can exceptionally contain several compiler functions, as with `func_002861C8`. One logical function can exceptionally cross preservation owners, as with `func_002A0EF0`. None of those facts licenses arbitrary merging.

## Repository state, branches, and worktrees

At task start, local `main` was clean at `ee6151458d789cab3d1242637b873ae0da5b2cee` and was 57 commits ahead of `origin/main`. The requested branch and path did not exist, and the path was free. The Director created:

| Role | Path | Branch | Start |
|---|---|---|---|
| Clean local base, read-only | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` | `main` | `ee6151458d789cab3d1242637b873ae0da5b2cee` |
| Director integration worktree | `C:\Users\Joe\Projects\OB64-Decomp-decomp-methods-tu-director` | `codex/decomp-methods-tu-director` | `ee6151458d789cab3d1242637b873ae0da5b2cee` |

No other Git branch or worktree was created or used for integration. Agents shared the Director checkout and wrote only ignored benchmark/scratch artifacts or their assigned tracked evidence. The pre-existing `codex/cutscene-func-002861c8` and `codex/cutscene-func-002a0ef0` worktrees were treated as read-only. Nothing was merged from them. No push occurred.

Director commits before this report:

| Commit | Purpose |
|---|---|
| `6d9ee58` | Preserve bounded benchmark, Hijs mapping, TU-pilot tables, and the research checkpoint. |
| `b16eb2e` | Restore fail-closed scratch candidate compilation. |
| `eaecb16` | Add schema-v2 MIPS mismatch classification and bounded output. |
| `c5e38ca` | Resolve independent-review defects in relocation identity, scratch symbol ownership, BC1 polarity, and scheduling guidance. |

Files shared with active target-specific tasks: **none**. No target source, target linkage row, owner boundary, overlay descriptor, or active target worktree was changed.

## Baseline inventory

The clean-base `node tools/verify.js` result was:

| State | Functions/owners | Bytes |
|---|---:|---:|
| Exact `PURE_C` | 387 | 18,992 |
| Exact `HYBRID_C` | 64 | 35,228 |
| Assembly owners remaining | 5,733 | 6,456,224 |
| `UNKNOWN` source class | 0 | — |

The accepted model contained 4,851 function targets, 4,848 ordinary targets, and 4,400 targets without an active C owner. These function-target counts are not the assembly-owner count.

The normalized US Rev-0 z64 ROM is 41,943,040 bytes:

- SHA-256 `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`
- SHA-1 `9CD0CFB50B883EDB068E0C30D213193B9CF89895`

Historical parent-repository m2c “success” was only exit code zero, nonempty stdout, and no literal `Decompilation failure` marker. The old 3,077/3,374 result (91.2%) was an emission rate over an older interval model. It did not prove parsing, KMC compilation, semantics, instruction equality, relocations, linked ownership, or an exact ROM.

## Tool identities and reproducible command contracts

### External and pinned tools

| Tool | Version/commit | Reproducibility identity |
|---|---|---|
| m2c | `0.1.0`, master `3478473441a1e6da75d6bf07629452f410390ef4`, tree `3943f2fb966096365ca19d888a85f7a0386aac17` | Python 3.11.15 |
| asmlift | `0.5.0`, main `be9f44add56c0bdcbda2134b836c6c1158f76051`, describe `v0.5.0-89-gbe9f44a` | built CLI SHA-256 `81B28C5E165D3D6F764D35E901B1174B563CE6E9B8CEE5074FEFA475F6CEA223`; lock SHA-256 `FB4E421FD21AC9E85CB5FC55C3321634E0846DC4E0CECEF8813E19EC69B1D08C`; Node 24.13.1; pnpm 9.14.4; `objdiff-wasm` 3.7.3 |
| KMC cc1 | GNU C 2.7.2, source `43d1cdb67ed135879869b5266f01efaaada5e35a` | SHA-256 `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| GNU assembler | 2.6 KMC target, source `54514ded39ceb32165a125ddba04ca5b551773a2` | SHA-256 `0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C` |
| GNU linker | same 2.6 bundle | SHA-256 `48944635BC840256BC2FBA86D2701A4CA59B2424B924AC8B9F4853D4E1DA609F` |
| GNU objdump | same 2.6 bundle | SHA-256 `5F5B5822691BFAD87E628BCE4C781459902E4124AB7ED6604CA2DB62075D9816` |
| GNU objcopy | same 2.6 bundle | SHA-256 `9C3C821BE67C96AF204CC9B49FA1E285506E6E986B853AB898DFF48DC8B6F1AE` |

The authoritative invocation record is [provider-reproduction.jsonl](evidence/2026-08-30-decomp-methods-tu/provider-reproduction.jsonl), SHA-256 `999EF83859589047E975AC2EF81CB44384BCB3E7F238C5178B3536F86EBE4C59`. Its first record maps stable path tokens to the exact paths at execution time and records tool identities. The remaining records map all 204 benchmark rows to 145 run records; each of the 68 workbench suite records expands to its three exact child-provider launches. The records include exact argument arrays, cwd, inherited-environment status and deliberate overrides, ordered inputs and hashes, output hashes, all eight workbench products, every normalized asmlift input, and every ordered multi-function member list. The 25 non-applicable multi-function rows are explicit. Raw output is shared by its two postprocessing rows.

Three bounded input implementations are also tracked: [raw-m2c-input-emitter.js](evidence/2026-08-30-decomp-methods-tu/raw-m2c-input-emitter.js), [asmlift-input-adapter.mjs](evidence/2026-08-30-decomp-methods-tu/asmlift-input-adapter.mjs), and [asmlift-switch-asmdata.mjs](evidence/2026-08-30-decomp-methods-tu/asmlift-switch-asmdata.mjs). Generated assembly, C, objects, compiler output, and ROM data remain ignored. Per-target accepted ranges and classification are in [corpus.json](evidence/2026-08-30-decomp-methods-tu/corpus.json), SHA-256 `889C6739D549DA837535AC54A23E65767AE7E50ABE3160E767CE187790ADEBD6`.

### Raw one-function m2c

```text
C:\Users\Joe\.codex\phase5b-splat-20260801-r4\venv\Scripts\python.exe
  C:\Users\Joe\Projects\OgreBattlel64\tools\m2c\m2c.py
  <raw-one-function.s>
```

Input contract: one accepted logical function decoded to mnemonic assembly with direct internal labels only; no adjacent functions, jump tables, delay-slot guard, prototypes, types, relocation records, strings, or project context. The raw adapter row reused the same stdout and applied only the current `compilableM2cSource` syntax adapter.

### Current workbench

```text
node tools/match.js prepare <symbol>
node tools/match.js prepare <symbol> --with-context
```

The underlying fixed m2c template was:

```text
<python> <m2c.py>
  --target mips-gcc-c
  --function <symbol>
  --globals used
  <configured variant arguments>
  [--context <generated-context.c>]
  <prepared-single-function.s>
```

`emitM2cAssembly` supplies direct internal labels, bounded discovered jump tables, and the existing guarded delay-slot normalization. `--with-context` also supplies inferred primitive prototypes and field facts. The eight observed workbench families were `structured`, `structured-abi-gaps`, `structured-load-first`, `structured-return-flow`, `structured-cursor-steps`, `structured-masked-local`, `gotos`, and `stack`; common source outputs shared three underlying m2c launches.

### Multi-function m2c

```text
<python> <m2c.py>
  --target mips-gcc-c
  --function <scored-symbol>
  --globals used
  --valid-syntax
  --deterministic-vars
  <cluster-function-1.s> ... <cluster-function-N.s>
```

Inputs were multiple current `emitM2cAssembly` products in accepted order, including each member's bounded discovered `.rdata` jump table. They contained no canonical C or project headers. The exact commands, the three selected cluster IDs, all ordered members and per-member hashes, and the nine scored projections are durable in `provider-reproduction.jsonl`; they no longer depend on the ignored raw manifest.

### asmlift

The input adapter command was:

```text
node <convert-ob64-word-asm-to-objdump.mjs>
  <accepted-word-assembly.s>
  <normalized-objdump-input.txt>
  <symbol>
```

The retained adapter SHA-256 is `58040C05A2D36DF96F90C0968B681EDCCF7EAD6BEC2DB06C8D4A0069CEA488AF`. It converted accepted `.word` plus decode-comment assembly into documented objdump-shaped input and normalized only dialect spellings. For the two accepted switch controls, the retained bounded accepted-table generator, SHA-256 `A6F47AACE2AD6B11390DB33E1BB00AF50534673016C6180F578A3A62A2EC64FC`, generated provider `--asm-data`.

```text
node <asmlift.mjs>
  <normalized-objdump-input.txt>
  --target gcc2.7.2kmc
  --name <symbol>
  [--asm-data <accepted-switch.asmdata.txt>]
  --strict
```

All 34 accepted-assembly hashes, adapter commands, normalized-input hashes, provider commands, and output hashes are in the tracked invocation record. For example, `func_0012E950` normalized to `897BAA7C74A626AB70EEB05A5E093C8095982217582318A3C7567DDA0A8266A7`; the `func_00283E14` and `func_002827EC` switch side-data hashes are `255B4A1DB3E98BFE70B68D66D6451227EE9453CDFF4FCE87F7FFD63EFA0E9632` and `513E0A5974271DD9843F3FBB76BA7B9076FF60CE35C317CC0CA493E26D985A13`. The installed CLI also lifted three upstream KMC fixtures, so the 33 refusals were not an installation failure.

### KMC scratch compilation

```text
<cc1.exe>
  -quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0
  -fno-PIC -mno-abicalls -fno-builtin -funsigned-char
  -o <candidate.compiler.s> <candidate.c>

<mips-kmc-elf-as.exe>
  -G 0 -mips3 -mabi=32 -force-n64align -EB
  -o <candidate.o> <candidate.adjusted.s>
```

The new scratch contract parses the ELF directly; it does not reuse or relax canonical `compileTarget` placement and ownership checks.

## Benchmark design and fairness correction

The frozen corpus has 34 targets: 19 exact `PURE_C` controls, six exact `HYBRID_C` controls, and nine unresolved assembly targets. `func_002A0EF0` was excluded because its active two-owner structural problem is not an ordinary lifter/TU case.

Candidate generation did not open canonical matched C and no candidate was manually edited. That made execution blind, but it was **not a holdout evaluation** of the pre-existing workbench ensemble. Two exact-control transformations were developed and validated before this pilot on the same functions:

- `structured-return-flow` on `func_0012E950`; and
- `structured-cursor-steps` on `func_000143dc`.

Those rows demonstrate retention of known capability, not generalization. The current-workbench default therefore has three exact controls in total, but only one out-of-sample exact baseline (`strlen`). The context run's sole exact row is the in-sample `func_0012E950`. Raw m2c, the adapter's `strlen` exact result, multi-function m2c, and asmlift are unaffected by this correction.

The complete machine-readable benchmark table has one row for every target and method: [benchmark-rows.csv](evidence/2026-08-30-decomp-methods-tu/benchmark-rows.csv), 204 rows, SHA-256 `39A8D34C9997D917016D60857ABF6F0E841776822A8ED7CBB873F0905C19FBC9`. It separately records lift/refusal, candidates, compiler exit, object assembly, scratch-contract acceptance, scoreability, exact bytes, mismatch counts, relocation counts, linked proof, full-ROM proof, time, and failure class.

## Lifter benchmark results

| Method | Lifted | Refused | Candidates | Scoreable targets | Exact scratch, all | Exact excluding pre-calibrated controls | Canonical linked/full-ROM proof, all / holdout |
|---|---:|---:|---:|---:|---:|---:|---:|
| Raw one-function m2c | 29/34 | 5 | 29 | 0 | 0 | 0 | 0 / 0 |
| Raw m2c + current syntax adapter | 29/34 | 5 | 29 | 3 | 1 | 1 | 0 / 0 |
| Current `match.js`, default | 34/34 | 0 | 104 | 24 | 3 | 1 | 3 / 1 |
| Current `match.js --with-context` | 34/34 | 0 | 103 | 23 | 1 | 0 | 1 / 0 |
| Multi-function m2c | 9 applicable | 0 | 9 | 6 | 0 | 0 | 0 / 0 |
| asmlift | 1/34 | 33 | 1 | 1 | 0 | 0 | 0 / 0 |

Key findings:

- Current `match.js` had complete generation coverage, the most scoreable objects, and the only exact current-workbench outcomes.
- Raw m2c emitted 29 files, but none of its unadapted C compiled. The syntax adapter made three objects scoreable and made `strlen` exact at scratch-body level.
- Current inferred context was net harmful: exact controls fell from 3 to 1 (from 1 to 0 after excluding calibrated rows), 11 scoreable targets worsened, and one lost compilation; only `func_0001489c` improved meaningfully.
- asmlift emitted only `func_0012E950`. Its first refusal classes were 17 unsupported MIPS calls, nine branch-likely operations, five COP1 stores, one COP1 branch, and one unrecovered indirect jump.
- Multi-function m2c changed one of nine owner-level sources and produced no exact result. In the corrected three-function `func_002861C8` supplement, combined context changed zero of three structured sources and improved zero of three best results.

Therefore asmlift is a useful explicit-refusal research tool, not a competitive OB64 candidate provider at this commit. A general provider interface would add maintenance and provenance surface without adding a demonstrated productive provider.

## Required target results

| Target | Accepted status | Single-function/workbench result | Multi-function result | asmlift | TU/structure conclusion |
|---|---|---|---|---|---|
| `func_00284288` | ASM, 8,000 bytes | Three candidates; compile-type failure. Raw m2c hit the label-before-delay-slot limitation. | Source changed but remained compile-type failure; no measured improvement. | Refused branch-likely. | One large logical function: one `0x78` frame, one return, no interior external entry or owner-crossing edge. |
| `func_002861C8` accepted owner | exact `HYBRID_C`, 636 bytes | Owner-level `match.js` produced three candidates but malformed one-glabel input failed syntax. Correct logical slices scored 43.10, 39.32, 37.70; none exact. | Correct three-function context changed 0/3 sources and improved 0/3. Grouped compilation left the closest pure candidate's six `$t2/$t3` words unchanged. | Refused indirect jump for primary and branch-likely for both helpers. | One owner/TU containing three ordinary logical functions with independent returns; not one multi-entry function. |
| `func_00283E14` | exact `PURE_C`, 404 bytes + 32-byte table | Workbench lifted but inferred types did not compile. | Lifted but same compile-type failure. | Refused MIPS call. | Ordinary function. Grouped compilation preserved text and the exact eight-entry table. |
| `func_002827EC` | exact `PURE_C`, 1,900 bytes + table/pad contract | Scoreable length mismatch: score 15.09, 473 differing instructions, 1,765 differing bytes. | Identical score and source; no benefit. | Refused MIPS call. | Ordinary function; its row-5130 table/padding contract is a separate, weaker TU lead. |

The corrected `func_002861C8` 15-row table is [func-002861c8-logical-supplement.csv](evidence/2026-08-30-decomp-methods-tu/func-002861c8-logical-supplement.csv).

The six exact hybrid controls were `func_002861C8`, `func_002a3198`, `func_002A0B14`, `func_001957D0`, `func_000bc984`, and `func_001390F0`. Default `match.js` made `func_002A0B14` and `func_000bc984` scoreable length mismatches; the other four remained compile/input failures. asmlift refused all six. No current hybrid was promoted to `PURE_C`.

## Hijs source and object organization

Inspected read-only:

- URL `https://codeberg.org/hijsje/ogrebattle64`
- branch `main`
- commit `511c8ca0fb0fdcabd72b4c023a644e900f3b9112`
- supplied archive SHA-256 `B4F8D0148F2CA10F6CD045C11AC32B87632FDB1F466E6ABF0A86BD519DC82743`
- 119/119 archive files matched the inspected Git blobs
- expected ROM SHA-1 `9CD0CFB50B883EDB068E0C30D213193B9CF89895`

Hijs is exact-ROM-oriented: its Makefile has a ROM SHA-1 check. In the mapped region it uses `INCLUDE_ASM`/`INCLUDE_RODATA` preservation wrappers, not semantic C implementations. The Makefile compiles each wrapper `.c` to one object, so the representation is **many separately named routines and included data fragments compiled as one object**. It is neither one giant multi-entry function nor one-function-per-object.

The inspected Makefile's build assumptions are:

```text
CROSS = mips-linux-gnu-
AS/LD/OBJDUMP/OBJCOPY = $(CROSS){as,ld,objdump,objcopy}
CC = COMPILER_PATH=tools/gcc_kmc tools/gcc_kmc/gcc
ABIFLAG = -mabi=32 -mgp32 -mfp32
CFLAGS = $(ABIFLAG) -mno-abicalls -nostdinc -fno-PIC -G 0
         -Wa,-force-n64align -funsigned-char -w -mips2 -EB -O2 -fno-builtin
MACROS = -D_LANGUAGE_C -D_MIPS_SZLONG=32 -D_MIPS_SZINT=32 -D_MIPS_SZLONG=32
         -D__USE_ISOC99 -DF3DEX_GBI_2 -DNDEBUG -D_FINALROM
IINC = -I include -I assets -I lib/ultralib/include -I lib/ultralib/include/PR
       -I lib/libmus/include/PR -I lib/libmus/src -I lib/f3dex2/PR
CC_CHECK_FLAGS = -MMD -MP -fno-builtin -fsyntax-only -fdiagnostics-color
                 -std=gnu89 -m32 -DNON_MATCHING -DAVOID_UB -DCC_CHECK=1
ASFLAGS = -G 0 -I include -mips3 -mabi=32 $(GRUCODE_ASFLAGS)
```

Source `.c` rules first run the separate Clang GNU89 syntax check above with `IINC`, `MACROS`, and per-source/build-directory includes. They then preprocess with the KMC driver using `-E -fno-asm`, the same macro/include context, convert UTF-8 output to Shift-JIS with `iconv`, and compile stdin with the KMC driver using `-x c ... -fno-asm -c`. Assembly rules run `cpp -P`, the same Shift-JIS conversion, and `mips-linux-gnu-as`. The link rule uses `mips-linux-gnu-ld` with the generated main script, hardware-register script, four undefined-symbol/function scripts, `--no-check-sections`, map output, and `-lmus -lultra`; `mips-linux-gnu-objcopy -O binary` produces the ROM checked by SHA-1.

The dependency gitlinks are `lib/libmus@123a807db6f23e2e3f1c2f0245ff586bc2aaef38` from `https://github.com/cdlewis/libmus.git`, `lib/ultralib@00cdfa3c80d9d32f10c71ba24116ca3fbda62a44` from `https://github.com/cdlewis/ultralib.git`, and `tools/asm-differ@093360aa31f90e67216ed1971c4087516cc7b940` from `https://github.com/simonlindholm/asm-differ.git`.

An independent Hijs build was not established. `tools/gcc_kmc` is generated, not a gitlink: `tools/Makefile` downloads unchecksummed `latest/download` archives for decompals GCC 2.7.2 and binutils 2.6. The ordinary assembly/link rules additionally depend on unversioned system `mips-linux-gnu-*` tools. Hijs's grouping is therefore an exact-commit research lead, not a reproducible compiler/toolchain proof or evidence of original retail TU boundaries/source expression.

The complete 44-row mapping is [hijs-segment14-mapping.csv](evidence/2026-08-30-decomp-methods-tu/hijs-segment14-mapping.csv), SHA-256 `3B8D672185B2E924E9A6BB3F4A5781FDC2E9F0D971A4C6AD8F3095A432EBC72F`.

### Relevant Hijs-to-accepted mapping

All entries below are separate `INCLUDE_ASM` routines in `src/segment_14/283DF0.c`, compiled into `build/src/segment_14/283DF0.o`, except the final auxiliary row.

| Order | Hijs symbol/label | Our logical symbol | ROM range | Runtime range | Boundary/data evidence |
|---:|---|---|---|---|---|
| 1 | `func_segment_14_80227E20_283DF0` | `func_00283DF0` | `0x283DF0..0x283E14` | `0x80227E20..0x80227E44` | ordinary function |
| 2 | `func_segment_14_80227E44_283E14` | `func_00283E14` | `0x283E14..0x283FA8` | `0x80227E44..0x80227FD8` | ordinary switch; shared aux row 5131 |
| 3 | `func_segment_14_80227FD8_283FA8` | `func_00283FA8` | `0x283FA8..0x284150` | `0x80227FD8..0x80228180` | ordinary function |
| 4 | `func_segment_14_80228180_284150` | `func_00284150` | `0x284150..0x284184` | `0x80228180..0x802281B4` | ordinary function |
| 5 | `func_segment_14_802281B4_284184` | `func_00284184` | `0x284184..0x2841CC` | `0x802281B4..0x802281FC` | ordinary function |
| 6 | `func_segment_14_802281FC_2841CC` | `func_002841CC` | `0x2841CC..0x284210` | `0x802281FC..0x80228240` | ordinary function |
| 7 | `func_segment_14_80228240_284210` | `func_00284210` | `0x284210..0x28422C` | `0x80228240..0x8022825C` | ordinary function |
| 8 | `func_segment_14_8022825C_28422C` | `func_0028422C` | `0x28422C..0x284288` | `0x8022825C..0x802282B8` | ordinary function |
| 9 | `func_segment_14_802282B8_284288` | `func_00284288` | `0x284288..0x2861C8` | `0x802282B8..0x8022A1F8` | one large function; one frame/return; no interior entry found |
| 10 | `func_segment_14_8022A1F8_2861C8` | `func_002861C8` | `0x2861C8..0x2862FC` | `0x8022A1F8..0x8022A32C` | primary compiler function; independent return; shared aux row 5131 |
| 11 | `func_segment_14_8022A32C_2862FC` | `func_002861C8_scan` | `0x2862FC..0x2863F8` | `0x8022A32C..0x8022A428` | internal-call-only compiler function; independent return |
| 12 | `func_segment_14_8022A428_2863F8` | `func_002861C8_find` | `0x2863F8..0x286444` | `0x8022A428..0x8022A474` | fixed-address-call compiler function; independent return |
| 13 | `func_segment_14_8022A474_286444` | `func_00286444` | `0x286444..0x2864F8` | `0x8022A474..0x8022A528` | ordinary function |
| 14 | `func_segment_14_8022A528_2864F8` | `func_002864F8` | `0x2864F8..0x286524` | `0x8022A528..0x8022A554` | ordinary function |
| 15 | `func_segment_14_8022A554_286524` | `func_00286524` | `0x286524..0x286544` | `0x8022A554..0x8022A574` | ordinary function |
| 16 | `func_segment_14_8022A574_286544` | `func_00286544` | `0x286544..0x286620` | `0x8022A574..0x8022A650` | ordinary function |
| 17 | `func_segment_14_8022A650_286620` | `func_00286620` | `0x286620..0x2866E4` | `0x8022A650..0x8022A714` | ordinary function; 12 bytes alignment follow |
| data | YAML `.rodata` at `0x286B90` | row 5131 | `0x286B90..0x286BD0` | `0x8022ABC0..0x8022AC00` | 32-byte `00283E14` table + 24-byte `002861C8` table + 8-byte preserved tail |

`src/segment_14/281860.c` similarly contains 25 separately named routines in one object. Its order-24 routine maps to `func_002827EC`, ROM `0x2827EC..0x282F58`, runtime `0x8022681C..0x80226F88`; YAML associates its `.rodata` with row 5130 at ROM `0x286B50..0x286B90`.

No mapped boundary above showed cross-boundary fallthrough or shared stack state. The three `002861C8` routines have separate returns. Hijs's grouping supports a TU hypothesis, not logical-function merging.

## Intended-TU evidence audit

### Candidate clusters

| Candidate cluster | Confidence | Positive evidence | Limits |
|---|---|---|---|
| Three functions inside accepted owner `func_002861C8` | High likelihood | Gapless compiler functions; primary calls scan; scan is internal-only; find has a fixed-address call from parser; three independent returns; current exact source already compiles them together. | Original static/global spelling is stripped. |
| `func_00284288` plus the three `002861C8` functions | Medium-high | Text adjacency; parser is the only direct caller of primary/find; internal-only scanner helper; common parser/scanner role; Hijs groups them in one object. | No shared private data proves the exact boundary. |
| `0x283DF0..0x2866E4` parser/resource/scanner region | Medium | Hijs one-object grouping; source order; ordered row-5131 tables; concentrated data references near `0x8022A950..0x8022A95C`; common private declarations and helper calls. | Exact TU start/end and original linkage remain unproven. |
| Seven exact controls `func_00283E14..func_0028422C` | Medium original-TU confidence; strong compiler pilot | Adjacent resource helpers, exact C, common state operations, ordered table. | Reconciled grouped source has incompatible declaration/volatile warnings; not a sound canonical fixture. |
| Sixteen exact accessors `func_0004573c..func_000458d4` | Medium source-module confidence; strongest clean fixture | Contiguous exact accessors, no rodata, shared record model, some internal-only calls from `func_00044aa4`. | The 16-function tail alone is not proven to be the whole original TU. |
| Character module `func_00044aa4..func_000458d4` | Medium-high source-module confidence | Common record types, ordering, internal accessor calls. | Six middle functions remain ASM; canonical grouped ownership must reject this mixed state. |
| `func_002827EC` and nearby resource helpers | Medium separate lead | Switch table, calls, Hijs `281860.c` grouping. | Row 5130 has distinct compiler padding and a 24-byte preserved tail; weaker evidence for joining the parser TU. |
| `func_002A05EC..func_002A08C0` | Low-medium | Contiguous and share `D_8022A974`. | Mostly adjacency/call/global evidence; insufficient alone. |

Weak evidence was not promoted: adjacency, same subsystem, one function calling another, shared global structures, or extraction-chunk membership alone did not define a TU.

### Logical-function and multi-entry findings

- `func_00284288` is one valid 8,000-byte logical function, not many missed ordinary functions.
- Accepted owner `func_002861C8` contains three ordinary functions, not one multi-entry/shared-tail function.
- `func_002A0EF0` is one proven logical function across two accepted owners: one prologue, one return, five non-call seam-crossing edges, and a branch/delay-slot owner seam. This is a preserved multi-owner issue, not a TU issue.
- The historical `func_0028A7B0/func_0028A7E4` over-split was already corrected because a direct internal branch crossed the old boundary.
- No newly evaluated current parser, switch, or control boundary showed fallthrough, one shared frame, a shared epilogue, or cross-boundary jump-table destinations.

## Grouped-TU compilation pilot

The complete 26-row per-function table is [phase2-function-results.csv](evidence/2026-08-30-decomp-methods-tu/phase2-function-results.csv), SHA-256 `FCD527E5FEDFB60310A4DAE6670B412EC72059117CBC172465591D39BBDFBF7D`.

| Pilot | Functions | Separate vs grouped function text | Relocations/data | Result |
|---|---:|---|---|---|
| Exact accessor controls | 16 | 436/436 accepted function bytes identical; same registers, frames, masks, scheduling, symbols, and order | no relocations or rodata | Grouping only reduced raw object packaging/alignment overhead; no ROM-layout claim. |
| Exact parser/resource controls | 7 | all functions identical after relocation; four raw words differed only by section-relative call/jump addends | 32-byte `func_00283E14` table exact in bytes, order, alignment, and relocations | No codegen benefit; warnings exposed unresolved shared types/volatile views, so not an acceptable fixture. |
| `func_002861C8` three-function owner | 3 | all slices unchanged; closest pure scan candidate retained same six `$t2/$t3` words | 24-byte table exact | No `PURE_C` promotion and no allocator improvement. |
| Identical-literal probe | 2 per probe | float text unchanged; later double reference changed only section-relative addend | identical doubles remained two entries; grouped `.rodata` removed separate alignment tail | KMC did not pool identical doubles across ordinary functions. |

Empirical compiler answer: under the pinned KMC compiler, grouping the tested ordinary functions did **not** change function instructions after relocation. It did not improve registers, stack layout, scheduling, switch lowering, jump tables, or difficult parser/scanner code.

Observed benefits were source understanding and object packaging:

- one compilation scope exposes incompatible prototypes and storage views;
- static/private helper visibility can be represented naturally;
- one object naturally expresses function order and file-local data order;
- raw object alignment and section-relative addends change.

No accepted string-placement improvement was measured. Jump tables were already exact. Constant pooling did not improve. Raw padding reduction did not prove accepted-ROM padding improvement. Grouping did not promote any hybrid to `PURE_C`.

## KMC-specific transformation priorities

This ordering is based on already accepted exact OB64 cases and observed near matches. Counts describe historical/in-sample exact wins, not holdout generalization.

1. **Preserve missing GPR ABI argument slots** — approximately 12 historical exact wins. This is the strongest repeated KMC/ABI source-shape rule.
2. **Direct conditional returns and widened narrow returns** — three historical wins; changes branch/return form without random restructuring.
3. **Load a cursor byte before a zero store** — two historical wins; targeted statement-order/lifetime effect.
4. **Spell byte cursor increments explicitly** — two historical wins; targeted addressing/scheduling effect.
5. **Materialize a masked comparison temporary** — one historical win.
6. **Condition polarity, early-return versus nested-if, declaration point, signedness/width, and expression grouping** — search only when the classifier reports matching CFG/opcode prerequisites.
7. **Localized loop/index/store ordering** — use block-order evidence, not unrestricted statement permutations.
8. **Evidence-backed stack aggregates/local ordering** — use only for a stack-offset family mismatch; do not add dummy padding blindly.
9. **Real symbol-plus-offset expressions** — use normalized relocation identity and accepted symbol evidence; never infer exactness from masks alone.
10. **Bounded temporary-lifetime separation** — use only for register-normalized pockets after length, CFG, opcode, stack, and relocations agree.

The workbench should not search register permutations while length/CFG/opcodes differ, scheduler permutations while stack/data widths differ, or function/TU boundary changes from an instruction mismatch alone.

## Mismatch taxonomy

The schema-v2 classifier reports ordered labels with `high`, `moderate`, or `low` likelihood, measured evidence, relevant search families, and families to avoid until prerequisites are resolved. Labels are diagnostic, never ownership or semantic proof.

| Category | Meaning | Example/evidence | Relevant next search |
|---|---|---|---|
| `exact` | supplied scratch byte buffers equal | exact controls | canonical link, sole owner, full ROM |
| `length` | emitted instruction extents differ | many default candidates; `func_002827EC` | missing/extra behavior, return/loop/prologue form |
| `relocation-mask-compatible` | raw differences fit safely maskable operands, but identity is incomplete | MIPS REL records without explicit addends | symbol/section/addend recovery and canonical link |
| `relocation-records-identical` | normalized records match; confidence depends on explicit addends | grouped local calls/tables | canonical linked bytes; no allocator search |
| `cfg-shape` | bounded block/control signatures differ | eight default best candidates | branch inversion, early return, goto/loop form |
| `branch-polarity` | aligned inverse branch pair | BEQ/BNE, REGIMM, and BC1F/BC1T tests | invert condition/fallthrough only |
| `secondary-entry-or-delay-slot-uncertainty` | low-confidence structural heuristic | internal call targets or delay-slot target shapes | inspect accepted boundary and incoming edges; never auto-merge |
| `register-allocation` | register-normalized form agrees or register fields differ after prerequisites | six `$t2/$t3` words in `func_002861C8_scan` | temporary lifetime/scope/declaration order |
| `scheduling-or-block-order` | matching word/opcode multisets occur in a different order | synthetic order-control test | bounded statement order and scheduler dumps |
| `load-store-width-or-signedness` | aligned memory op width/sign role differs | signed/unsigned load unit control | field width, casts, prototypes |
| `stack-layout-or-offset-family` | frame/stack-relative facts differ | synthetic frame-size control | aggregate layout and local order |
| `constant-or-immediate-construction` | aligned opcode with different immediate | benchmark immediate/signedness case | constants, signedness, grouping, relocation form |
| `opcode-or-expression` | narrower classes do not explain remaining opcode changes | default opcode/expression case | types, casts, expression form, missing behavior |
| `mixed-or-unknown` | bounded heuristics cannot isolate a family | residual case | first divergent block; no random permutation |

Exact differing instruction and byte counts include excess length. Unknown relocation kinds and out-of-range records never mask a mismatch. `relocation-identity-proven` now requires complete equal normalized records **and explicit equal addends for every mask-bearing record**; ordinary MIPS REL records without that evidence remain `relocation-mask-compatible`.

Default CLI/history output keeps only three top labels, bounded evidence samples, compact frame facts, and compact relocation facts. Full details remain opt-in.

## Implemented infrastructure

### Scratch compiler

The new scratch path runs pinned cc1, adjusts only the scratch section model, assembles with pinned GNU 2.6, and parses the ELF. It requires:

- exactly one nonempty executable, nonwritable target section;
- exactly one requested global/default-visible `STT_FUNC` at offset zero;
- a positive, aligned emitted symbol size, which can be shorter or longer than the accepted target for diagnosis;
- zero bounded tail bytes only;
- no additional function;
- no writable or unexpected allocated section;
- no unexpected global/local data, TLS, ABS object, or `SHN_COMMON` ownership;
- only contracted diagnostic read-only `.rodata`, benign compiler metadata, required undefined externals, and bounded local labels;
- text relocations that remain inside the emitted primary function.

Canonical `compileTarget`, source classification, accepted size, placement, owner census, fallback, auxiliary sections, linker map, and full-ROM checks were not changed.

### Mismatch classifier

The classifier adds exact mismatch counts, ordered multi-label evidence, normalized expected/actual relocation records, conservative addend identity, BC1 polarity support, real scheduling-order prerequisites, and bounded public summaries. It does not claim semantics or promote candidates.

### Deferred infrastructure

- **Candidate-provider interface:** deferred because no second provider demonstrated value. The current m2c provider remains deterministic and supported.
- **asmlift provider:** deferred; one candidate from 34 is insufficient.
- **m2c fork:** deferred for KMC source-shape rules; only a reproduced parser/IR defect should be considered upstream/fork work.
- **Experimental TU manifest/grouped objects:** deferred because grouped codegen gave no benefit, no multi-owner grouped object received production ownership/full-ROM proof, and the most interesting parser control source has incompatible declarations.

## Independent review

The research methodology review was independent and read-only. A second senior review covered the committed evidence and implementation, then re-reviewed the fixes. Confirmed findings and resolutions:

| Finding | Resolution |
|---|---|
| Scratch compiler reused a stale canonical metadata path and rejected useful length diagnostics. | Implemented scratch-specific compilation with exact/shorter/longer tests and no canonical relaxation. |
| Owner-level `func_002861C8` input conflated three logical functions. | Preserved the owner-level result only as current behavior; added the fixed 15-row logical-function supplement. |
| Seven-function parser pilot had incompatible declarations/warnings. | Rejected it as an accepted fixture; retained it only as evidence of a shared-source-model problem. |
| Benchmark `compileSuccess` conflated object scoreability with contract success. | Replaced with explicit compiler/object/contract/score/canonical/full-ROM fields. |
| Relocation masking did not prove identity. | Added normalized records and conservative mask-compatible classification. Final review found implicit REL addends could still be overstated; `c5e38ca` now requires explicit addend identity. |
| Scratch validation missed `SHN_COMMON` writable storage. | Added a symbol-ownership census and referenced/unreferenced COMMON regression probes. |
| Benchmark evidence lived only in ignored paths. | Committed bounded corpus, result, mapping, and TU tables; excluded ROMs, objects, generated source, compiler output, and bulk reports. |
| Hijs build reproducibility was overstated. | Recorded the exact commit/archive, relevant Makefile compiler/macro/include/preprocess/assembly/link assumptions, full gitlink hashes, and the generated unchecksummed compiler/system-binutils limit. |
| Two exact workbench rows were pre-calibrated controls. | Labeled execution-blind but not holdout; report exact counts both including and excluding them. |
| Tracked evidence lacked exact command/input contracts. | Added the 350-record `provider-reproduction.jsonl`: all 204 result rows resolve to exact versioned provider commands, cwd/environment contracts, ordered input/member hashes, and 145 run records, including three child launches in each workbench suite. Retained the raw emitter and both asmlift adapters as tracked source. |
| BC1 polarity and scheduling heuristics gave false guidance. | Fixed BC1/REGIMM polarity handling and require actual word/opcode order change; added negative tests. |

The follow-up reviewer reported no remaining confirmed code finding and no new defect in `c5e38ca`. A final documentation follow-up validated all 350 provenance records, 204 benchmark-row mappings, 145 referenced run records, 201 retained input hashes, 34 accepted source hashes, retained scripts, and manifest hashes; its final low Hijs-detail finding was resolved by recording the macro, include, and Clang-check configuration above.

## Verification and audit

Passed on the final implementation state:

- syntax checks for every changed JavaScript file;
- `git diff --check`;
- `tests/matching_workbench_integration.js`, including exact, shorter, longer, diagnostic `.rodata`, malformed symbol, secondary function, repeat cache, and COMMON rejection;
- `tests/active_targets.js`;
- `tests/compiler_text_functions.js`;
- `tests/func_002861C8_structure.js`;
- `tests/func_002A0EF0_structure.js`;
- `tests/source_policy.js`;
- `tests/local_tools.js`;
- final `node tools/verify.js`:
  - baserom identity PASS;
  - toolchain PASS;
  - source policy PASS;
  - C linker ownership PASS;
  - placement PASS;
  - relocations PASS;
  - target bytes EXACT;
  - full ROM EXACT;
  - 387 exact `PURE_C` / 18,992 bytes;
  - 64 exact `HYBRID_C` / 35,228 bytes;
- `$env:OB64_PARENT_ROOT='C:\Users\Joe\Projects\OgreBattlel64'; node tools/audit.js`:
  - structural protections PASS;
  - current exact ROM PASS;
  - `RESULT: AUDIT PASS`.

`tests/matching_workbench.js` executes all new classifier tests successfully and then reaches a pre-existing hard-coded target-ID assertion. The same failure reproduces on the clean base: expected `8C8CA226...`, current accepted model `C4C13EF4...`. This branch did not alter that assertion or target identity. The integration and independent direct probes cover the new behavior despite that unrelated base failure.

## Recommended next tasks

1. **Add a warning-free holdout corpus and benchmark split.** Freeze targets not used to develop any existing rule; report calibrated controls, validation controls, and unresolved targets separately.
2. **Mine and implement only classifier-directed KMC rules.** Start with width/signedness, branch polarity/return shape, statement ordering, and real relocation expressions; require per-rule regression controls.
3. **Improve context quality before quantity.** Reconcile prototypes, volatility, aliases, field widths, and private storage views; the current inferred context is net harmful.
4. **Investigate the m2c label-before-delay-slot limitation as a parser/IR task.** Reproduce it independently on `func_00284288`; do not broaden into a general fork unless the missing capability belongs inside m2c.
5. **Use the 16 accessors as the first warning-free grouped-object infrastructure fixture.** Any future opt-in TU model must preserve per-function owners, relocations, fallback, order, placement, and full-ROM proof and reject mixed C/ASM state.
6. **Open a dedicated `0x283DF0..0x2866E4` intended-TU reconstruction.** Derive one compatible declaration/storage model and prove all functions/data. Begin as lifting/source-context work; activate grouped compilation only if it demonstrates an exact ownership or layout benefit.
7. **Revisit a provider interface only when a second provider clears a minimum value gate.** Require reproducible provenance, isolated failure, multiple scoreable OB64 candidates, and at least one improvement not already supplied by m2c.
8. **Repair the pre-existing matching-workbench target-ID fixture** in a separate maintenance task tied to the accepted-model contract change that caused the drift.

## Explicit mission answers

- **Should m2c remain the default candidate generator?** Yes. It had complete current-workbench coverage and the best measured compile/score results.
- **Should asmlift or another provider be added?** Not now. asmlift emitted 1/34 and improved no target. No other provider established a stronger reproducible result.
- **Should m2c itself be forked?** Not for KMC source-shape search. Keep KMC rules and mismatch-directed search in the workbench. Consider parser/IR work only for a reproduced lifter-internal limitation.
- **Does multi-function lifting materially help?** Not in this corpus. It improved zero corrected `func_002861C8` logical functions and produced no exact result.
- **Did we split logical functions too finely?** Mostly no. `func_00284288` remains one function; `func_002861C8` contains three real functions; no new arbitrary merge is justified. `func_002A0EF0` is the separate proven cross-owner exception.
- **Did we split translation units too finely?** Probably, especially around `0x283DF0`, but exact original boundaries are not proven.
- **Does TU grouping improve code generation, data layout, or only source understanding?** It did not improve tested function code. It improved source/type/helper visibility and changed scratch object alignment/data addends. Accepted string, constant, jump-table, padding, and ROM-layout improvements were not demonstrated.
- **Which cluster should receive the first real intended-TU reconstruction?** The `0x283DF0..0x2866E4` parser/resource/scanner region, centered on `func_00284288` and the three `func_002861C8` logical functions. Use the 16-accessor cluster first only as a clean infrastructure fixture.
- **Which special contracts might a recovered TU replace?** Potentially row 5131's two-C-fragment plus assembly-tail arrangement, possibly row 5130's compiler-padding/tail arrangement, and the ad hoc one-owner/three-compiler-function representation of `func_002861C8`. It must never replace accepted logical ranges, per-function relocation proof, assembly fallback, sole ownership, full-ROM verification, or `func_002A0EF0`'s multi-owner contract.
- **Which claims remain unproven?** Exact retail TU boundaries; whether Hijs reconstructed the original retail TU rather than choosing a later grouping; an independently reproducible Hijs build; useful string/private-data placement changes; benefit from correct rich private types; asmlift quality on a substantially supported OB64 subset; `PURE_C` promotion of the parser/scanner hybrid; and any grouped multi-owner canonical exact-ROM implementation.

## Final handoff condition

The Director branch contains no canonical regrouping and no target reconstruction. Experimental features are inactive because no provider/TU feature was added. The final handoff records the post-report HEAD, clean `git status`, and confirms no push.
