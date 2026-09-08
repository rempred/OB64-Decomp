# Guided upstream permuter trial — terminal, pending Material review

Actual upstream decomp-permuter enumerated two bounded, coordinated searches through the unchanged pinned KMC compiler and assembler. Neither improves the retained 6098 best. Recommend optional manual permutation searches when independently supported source alternatives need combination testing. This demonstrates compatibility and enumeration, not reduced matching iterations or a solution to the frame residual.

Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`; release `1b5ae9ea976a342266b08997e9ad7540649aee41`. Fresh claim was created atomically and read back. Evidence root **R**: `build/combat-guided-permuter-trial-r1/`. Prior evidence is unchanged. The complete fourteen-target W8 and later families remain unresolved; this is not matching acceptance. Independent Material review is required before this adapter/research becomes a matching dependency.

## Upstream and adapter

The [upstream repository](https://github.com/simonlindholm/decomp-permuter) documents manual `PERM_GENERAL` choices and a custom `compile.sh input.c -o output.o`. Revision `059609d4aec73eb0650726772954e1ad575825f8` was downloaded as archive SHA256 `AD0BED6DBC1B1EB0C858848243570FAE6F85F9CD6D37CC1403A2723412C864B2`. `disassembly-and-upstream-audit.json` verifies all 255 archive files remain unchanged. No upstream repair, custom enumerator, remote service or source/ROM upload occurred.

Python 3.11.15, an R-local venv and `toml==0.10.2` run the actual upstream CLI. Optional Levenshtein/PyNaCl were not installed; scoring uses upstream difflib. Git Bash invokes the adapter. Windows subprocess did not resolve a batch `cpp` shim, so an R-local C# executable forwards arguments unchanged to the existing companion MIPS preprocessor. Source, launcher/compiler identities, build command and dependency freeze are retained. The first missing-cpp debug log was overwritten by the successful rerun; no original raw failure log is claimed.

`pins.json` binds tools, flags and accepted address map. KMC cc1 SHA256 is `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`; flags are `-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0 -fno-PIC -mno-abicalls -fno-builtin -funsigned-char`. GNU 2.6 assembler SHA256 is `0831D410AD140F2D2225382273219ACB418EF6EC1E986A3309F034D2A8350A5C`; linker SHA256 is `48944635BC840256BC2FBA86D2701A4CA59B2424B924AC8B9F4853D4E1DA609F`. Every adapter compile reauthenticates these tools. No compiler/assembler flags or binaries changed.

`adapter.js` SHA256 `83BE4B2C273DC36299AC5DEE084BBA594B0C12CA75324E2B646251B4F291B58E` applies existing section-assignment metadata, assembles, records actual relocations and performs a **private one-owner link** at the accepted address. Calls/data resolve against accepted model addresses; extra nonempty allocated input sections are rejected. Complete section bytes are compared with retail. This is a diagnostic scoring object, not canonical ownership verification or a general import adapter. Only these single-owner/no-extra-data inputs were tested.

Two linker setup errors were caught: location-counter alignment moved the target start, and mapping into `.text` appended alignment padding. Failed scripts/objects/logs remain. Mapping to the exact accepted named section at its explicit address fixed both without changing instructions. Authenticated retail words form separate scoring targets; they never replace candidate output.

GNU 2.6 objdump's old format produced **zero parsed upstream instructions and vacuous zero scores**. Rejected debug logs/settings remain under `*-gnu26-rejected`. Scoring alone now uses existing GNU 2.39 objdump SHA256 `72A5E02C22B6826A46400AD17E64F0FFB612F0A55F02F3A731D61BB0C4FE853E`, with `-Drz -m mips:4000 -j ACCEPTED_SECTION`. `-D` decodes the retail word symbols as code; explicit MIPS III handles branch-likely instructions despite legacy object flags. No output rewrite occurs. Final audit proves consecutive disassembly words reproduce all **50 tested objects** and contain no undecoded word mnemonic. Upstream strips trailing nops (one in BFF8); the full-byte checks retain them.

## Baseline fidelity

`roundtrip-validation.json` binds expanded input, upstream-rendered C, raw text, complete linked text and exact actual relocation equality. Frozen object hashes are authenticated. Source whitespace/file directives and unrelated ELF metadata are not claimed identical.

| Input | Bytes | Frame | Relocations | Complete differing bytes / words | Upstream score |
|---|---:|---:|---:|---:|---:|
| Exact BFF8 | 28 | 0 | 0 | 0 / 0 | 0 |
| Exact 205230, accepted W5 | 164 | 80 | 2 | 0 / 0 | 0 |
| 6098 best D764 | 4148 | 408 | 162 | 56 / 46 | 1314 |
| 6098 R5 alternate 98ECDD | 4148 | 408 | 162 | 82 / 53 | 1494 |

Best authored/expanded hashes: `D76444B2C4AF7AD44E40DA2F68456E894355AA9F1B6BF4D44F4B792DC10097E1` / `DDD67BBE5FC0CD363CED8B62EB65E12105AB36A55B1CE69029FBD4E5065A4BA6`. Alternate: `98ECDD9366294C0A97EF64A647E37C7D0D14082BEE58515A9B9A6FB3869B6C6B` / `7318E042B5ED4B25BC8BB0A2E17B47E4262D93800370070E10EDBCE1B3FBA68E`. Both reproduce frozen raw text and all 162 relocation entries. R5's alternate **49 native non-relocation word differences** is a different metric from the 53 complete relocated differences above. 205230 uses the complete frozen W5 compiler chain. The proposed 34B0 control was not used because its freeze lacked expanded/object files.

A deliberately incorrect private BFF8 `>> 9` control produces score 5 and one differing byte/word, preserving extent. It is a negative test, not a source candidate. Both 6098 targets decode all 1,037 words and 205230 all 41. Exact-control zero scores are therefore nonvacuous. Scores are heuristic, not byte or semantic acceptance.

## Search A: eager signed predicates

Read-only guidance identified a new expression-placement question: materialize existing signed `nextColor < 256` just before that component's low branch, **after all three existing float-to-int conversions**. Each local block declares `int below256`, assigns that comparison, keeps the low test and uses `else if (!below256)`. The in-range case retains the old component. No float comparison, skipped conversion, outer guard, dummy reference or storage-only operation was introduced. The clamp relation is preserved for valid existing conversion inputs; no broader float-conversion domain is claimed.

Three independent original/eager `PERM_GENERAL` choices on each complete seed produce **8 iterations per seed**, zero errors, about **3.156 seconds per seed**. The worse seed and all combinations remain eligible; no greedy pruning or random mutation occurred. All nine compiler invocations per seed (base plus eight iterations), including unselected sources, are preserved. `results.json` maps each source to choices and upstream scores; a subsequent call to the unchanged upstream Scorer corroborates the CLI.

| Seed | Eager red | Green/blue | Score | Complete differences bytes / words |
|---|---|---|---:|---:|
| D764 | no | all four choices | 1314 | 56 / 46 |
| D764 | yes | all four choices | 1339 | 60 / 50 |
| Alternate | no | all four choices | 1494 | 82 / 53 |
| Alternate | yes | all four choices | 1519 | 86 / 57 |

All sixteen sources mechanically classify `PURE_C`; every output remains 4148 bytes/frame 408 with unchanged actual relocation entries. Green/blue choices produce identical bytes within each red choice. Eager red changes four words at function offsets `0x6E0`, `0x6F8`, `0x6FC`, `0x708`: `44032000→44022000`, `04610003→04410003`, `28620100→28430100`, `14400003→14600003`. These change red-result/predicate register uses from the seed's retail-equal words. This is an emitted source-form observation, not allocator causation. `final-checks.json` binds the exact correspondence.

## Search B: coordinated zero-or-one representation

Director requested a supported next dimension rather than stopping at worse placement scores. A signed comparison yields exactly zero or one, so replacing each newly named predicate's `int` with `unsigned char` preserves its value. With **all three predicates eager**, another three independent int/unsigned-char choices run on both seeds: eight iterations each, zero errors, about **3.187 and 3.140 seconds**. The all-int worse anchor remains included. Clamp-local lifetimes, signed comparisons, calls and conversions are unchanged; distinct predicate names identify the choices and do not add uses.

Every narrowed predicate retains an emitted `andi ...,0x00ff` after its signed comparison, adding one instruction. All output frames remain 408 and relocation counts remain 162; later relocation offsets move with inserted instructions. No extra frame or improvement is observed. `results.json` preserves every input/score/extent; `final-checks.json` records actual relocation equality or inequality and full offset-based differences.

| Unsigned-char components | D764 scores | Alternate scores | Bytes |
|---|---|---|---:|
| none | 1339 | 1519 | 4148 |
| blue / green / red | 1461 / 1464 / 1502 | 1641 / 1644 / 1682 | 4152 |
| two, any combination | 1564–1602 | 1744–1782 | 4156 |
| all three | 1702 | 1882 | 4160 |

All sixteen generated sources classify `PURE_C`. The large complete offset-based differences in longer candidates include displacement of later instructions; they are not that many independent semantic changes. This is a bounded slice, not the complete placement/type Cartesian product. Selective placement with other representations/lifetimes remains untested. These results do not eliminate these structures in future supported multi-step trajectories. No compiler tracing or new USE-home claim was made.

## Reproduction and release

In a newly assigned private copy, use the retained venv with `run-upstream.py CASE debug` for `exact`, `exact-reloc`, `best`, `alternate`, `negative-shift`; use `run-upstream.py CASE manual` for `best-guided`, `alternate-guided`, `best-representation`, `alternate-representation`. Commands/cwd/timing/exit codes are in `upstream-runs/*/command.json`. Use retained final settings: historical setup scripts preserve failed stages and are not an idempotent installer. `validate-roundtrip.js`, `summarize.py`, `final-checks.js`, `audit-disassembly.py` reproduce bounded checks. Do not rerun into this frozen root without new ownership. Future use must reauthenticate inputs/tools and check nonempty scoring coverage; this adapter does not make the upstream heuristic a verifier.

The four finite runs cost about 12.6 seconds, but choosing valid alternatives and setting up Windows/legacy-tool compatibility dominate this small trial. No matching-iteration reduction is demonstrated. No shared integration or ordinary source-review gate is introduced.

`final-checks.json` confirms all fourteen production sources and six shared inputs still match the R5 terminal index `47D8B0BE5D0622771662B5AF52853A893CE90797AA0806B4CD5A97FB8092F656`. Held Resolver work is untouched. No production, canonical build/verifier, runtime, Git or shared-tool mutation occurred. All commands finished; no trial process/session is live. **All trial writes and processes are released to Director `/root`; independent Material review remains pending.** R/manifest.json binds the final evidence and this report.
