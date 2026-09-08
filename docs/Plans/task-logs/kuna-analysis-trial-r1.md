# Kuna second-decompiler trial

Completed. Recommendation for independent review: **adopt Kuna as an optional second decompiler for manual comparison beside m2c**. No shared integration occurred.
Kuna preserves a real packet-pointer distinction that the fresh raw m2c draft loses in the drawing function.
That result supports occasional second-opinion use. The current project source already preserves the distinction, so no matching improvement or fewer iterations was demonstrated.
The Director must route the frozen research result for independent focused review before propagating adoption guidance.

Worker `/root/db10_allocation_trace`, Astra Medium; Director `/root`; activation `7fcfae38`; launch `KUNA-ANALYSIS-TRIAL-20260907-01`.
The claim was created atomically and read back before other task writes.
`R` below means ignored `build/kuna-analysis-trial-r1/`.
All new claims have review status pending. Their evidence is static output comparison and exact instruction correspondence, not game execution.

## Main benefit: retain the two drawing cursors

The selected drawing region has a retained sync/render pointer and a separately loaded next-size pointer.
Kuna's default output preserves both. Its shared stores use `v19[2]` and `v19[3]`, then retain `v18` for size-row and final-payload stores.
Fresh context-free m2c instead writes the shared tile words through the current global cursor.
This is an address-relation discrepancy in that raw draft, not merely different variable names.

| Evidence name | Meaning | Address | Address space | Role |
|---|---|---|---|---|
| Sync/render pointer loads | Retain s1 before publishing its successors | 1500/1504 or 1670/1674 | 3C00 owner offsets, hexadecimal | Two predecessor definitions |
| Cursor publication | Publish retained render pointer plus 16 | 1538 or 16A8 | 3C00 owner offsets | Global now differs from retained render value |
| Next-size pointer loads | Independently load s0 after WIDTH | 1564/1568 or 16CC/16D0 | 3C00 owner offsets | Separate value history |
| Shared tile stores | Store at retained s1 plus 8 and 12 | 16D8/16DC | 3C00 owner offsets | Decisive comparison |
| Size uses | Publish successor, write row, retain final payload destination | 16E0–16E8, 16F4, 171C | 3C00 owner offsets | Preserve s0 across another call |
| Packet cursor global | Source of both distinct loaded values | 800E9BA0 | Runtime virtual address | Mutable global, not a constant pointer |

`analysis/shared-cursor-retail.json` binds the exact instructions and words.
`analysis/3c00-default-selected-lines.json` joins relevant output lines to Kuna's instruction mappings.
Those line mappings can group or omit individual loads; the complete disassembly establishes the load history independently.
Kuna's `v19` and `v18` have other redefinitions elsewhere. Their names do not establish original C variables or a longer shared lifetime.

The raw m2c discrepancy is at `R/m2c/001F3C00-code.c:616` and the following store.
Both predecessors publish `render + 16`, call WIDTH, then reach stores through the current global plus 8 and 12.
Consider an illustrative admissible WIDTH call that returns normally without changing that global.
Retail and Kuna store at `P+8/P+12`; the raw m2c draft implies `P+24/P+28`.
This conditional address example does not claim actual callee purity. It demonstrates why the printed relation cannot substitute for the retained-pointer instructions.

The concrete reconstruction step is to preserve a separate render pointer across this shared tail.
The current D037 source already does that. Its remaining register-allocation residual therefore receives no new source trial from this result.
No dummy references, padding, assembly escapes or compiler experiments were introduced.

## Function-level results

| Sample | Default result and comparison | Classification |
|---|---|---|
| BFF8 null/bit query | Correct ternary: null returns zero; non-null reads the word at offset 40 and extracts bit 8. Fresh m2c expresses the same guard. | Correct rediscovery; useful independent check of a likely-branch delay slot. |
| 34B0 two loops | Two loops retain bounds 16/10, per-iteration global/pointer reads, explicit call arguments and the final size C0. Void return agrees with accepted C. | Correct selected structure; no new project fact or callee-effect inference. |
| 197C switch, code only | The bounded selector is visible, but missing table data becomes a computed-call return. | Unresolved dispatch, clearly marked `jump-as-call`; not a complete reconstruction. |
| 197C with accepted table | Recovers the switch, nine occupied outgoing argument slots, byte-output uses, remainder loop and nullable output termination stores. | Correct selected assisted structure. Table words/location are supplied, not discovered. |
| CF0 actor dispatcher | Produces 364 lines with allocator-result variables, later copies, and floating single-to-double comparisons. It retains no novel dependency that resolves the known scheduler tie. | Mostly rediscovery in reviewed regions; full semantics and unknown calls remain unverified. |
| 3C00 drawing function | Preserves distinct render/size cursors, separate companion/primary packed endpoints, signed correction before shift, masks and row updates. | Concrete second-opinion benefit over the raw m2c cursor draft; current C already contains the relevant correction. |

The 197C table-assisted output uses a six-byte array for the third byte-output local, while only its first byte is evidenced here.
Do not infer an original array capacity from that declaration.
CF0 default prints a float-argument bit pattern as an integer and infers an extra entry argument used at that call.
Neither output establishes the original prototype. No supplied callee types were used to make inference appear successful.

For 3C00, companion packing is retained separately from newly computed primary packing.
The signed tile-byte path preserves the negative test, conditional plus seven, arithmetic shift and mask 511.
The row update retains ordinary versus flipped paths, the signed clamp, remaining-count update and cap to the remaining count.
These agree with the independently prepared reference questions, but they were already represented by project evidence and m2c expressions.
No unrestricted loop termination, divisor validity, callee mutation behavior or original scalar type is proved.

The current source's D037 identity is `D03797FD04EEE60592E0644A837E09308568D3E82448883997A10A85DA7F91F5`.
It remains nonexact; the prior focused result has frame 504, native 209 and 261 differing words.
This trial neither reran that comparison nor changed matching acceptance.

## Default and alternate configurations

The [official option catalog](https://github.com/Noelo-Lab/kuna/blob/v1.355/docs/options.md) documents configurable structuring and processor selection is documented by the CLI.
Alternatives addressed observed shared-tail/goto structure and the physical-register versus pointer-width distinction.
No general configuration sweep or decompiler repair occurred.

| Run | Reason | Result |
|---|---|---|
| Default automatic target | Baseline for all five samples | All five emit code; 197C needs its table for complete switch recovery. |
| `regionstructure off`, CF0 and 3C00 | Compare the alternate collapse structurer on shared tails and gotos | Code hashes unchanged for both functions. No new lifetime hypothesis. |
| `MIPS:BE:64:64-32addr:o32`, BFF8 | Check documented 64-bit registers with 32-bit addressing/O32 | Emits the same bit relation with a wider inferred argument. |
| Same explicit target, table-assisted 197C | Check ABI/stack and switch under that representation | Loses switch recovery and stack-argument reconstruction; emits stack/register scaffolding. |
| Same explicit target, CF0 and 3C00 | Test the architecture distinction on actual larger inputs | Both exit 1 with heritage index-out-of-bounds errors, preserved below. |

The CF0 error is `LOSS-131`, heritage.rs:3411, length 9/index 16.
The 3C00 error is `LOSS-131`, heritage.rs:3410, length 9/index 2292.
They are failures of these explicit-target runs, not evidence that the default output fails identically.
No engine or processor spec was patched to suppress them.

## Inputs, assistance and fidelity

| Sample | ROM interval | Runtime start | Owner bytes | Status |
|---|---|---|---:|---|
| BFF8 | 20BFF8–20C014 | 801C8B68 | 28 | completed-wave PURE_C |
| 34B0 | 1F34B0–1F3540 | 801B0020 | 144 | completed-wave PURE_C |
| 197C | 1F197C–1F1D5C | 801AE4EC | 992 | completed-wave PURE_C |
| CF0 | 215CF0–216A38 | 801D2A20 | 3400 | accepted HYBRID_C, PURE_C blocker retained |
| 3C00 | 1F3C00–1F5654 | 801B0770 | 6740 | accepted owner; current PURE_C candidate nonexact |

The normalized baserom SHA256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.
The 3C00 retail slice is `458A6CB397B154CCC0CBE12CAEF4456A711C676E6B269F32A8DEE2490522925A`.
The other four frozen slices and raw m2c outputs are reused from the preceding angr trial without modification.
Fresh raw m2c for 3C00 was generated locally, with no context, prototype or source transformations.
The existing read-only assembly emitter inserted no analysis guards for this input.

Six analysis-only ELF32 big-endian files contain the five code samples and one separate 197C table-assisted variant.
They declare MIPS III/O32 flags, accepted entry/extent and a neutral function symbol.
Only exact code/table byte intervals are loaded; ELF headers and alignment gaps are not mapped as executable padding.
The optional table contains the accepted 88 bytes at runtime 801CFD48; incompatible overlays were never combined.
No relocation entries are invented: these are already relocated retail words at their accepted addresses.

`make_inputs.py` validates all written load bytes and intervals.
`validate_and_freeze.py` independently checks them with pyelftools, including section and function-symbol extents.
Kuna disassembly readback covers all 2,826 words, with exact bytes and addresses and no reported invalid words.
The initial 3C00 disassembly stopped at the CLI's 1,024-instruction cap; explicit `--bytes 6740 --count 1685` completed it.
The first scoring assertion caught that truncation. It was an inspection-limit correction, not a byte or decompiler change.

Automatic ELF target selection is supported by the pinned release source's `loadimage-object.rs:1326` and the shipped language/spec files.
It selects `MIPS:BE:32:default:default`, using mips32be.sla, mips32.pspec and mips32be.cspec.
The ELF's MIPS III flag does not make that automatic model a complete VR4300 emulator.
The alternate explicit target uses the shipped 64-register/32-address O32 specification instead.
Big-endian word decoding, the selected likely branch and static FP expressions were checked; full physical-register/FCSR/runtime equivalence was not.
CP0, hardware, DMA, arbitrary external effects and live overlays remain outside this static trial.

The new 3C00 oracle was frozen before the reference worker saw any Kuna output.
Its SHA256 is `9A49D9B08DE46B569CB21700BBD0CD7DC7A411621FD79920C2A83B340EB9ED6E`.
Initial default/alternate outputs froze before the executor read it, in `initial-outputs-before-oracle.json`.
That manifest's SHA256 is `200978C34AAB9E4AC34A157C400B6B6E39D7CF3B4826170541A372FDDC3E3F15`.
The four earlier case answers were already known from the angr task; this is not a blind human evaluation of those cases.
No oracle source, accepted edge, prototype or expected answer was supplied to Kuna.

## Setup, cost and replay

The [official release](https://github.com/Noelo-Lab/kuna/releases/tag/v1.355) supplies the Windows CLI and separate compiled-spec archive.
The [official repository](https://github.com/Noelo-Lab/kuna) and [site](https://kuna.noelo.org/) were browsed as requested.
All computation used the local CLI; no binary or ELF was uploaded.

`kuna --version` reports 1.355.
The executable SHA256 is `C14FCE2F93FDF56B8C9B4B3E1742C2319937D65A1C192D02F1A95699778179EA`.
Windows ZIP SHA256 is `1446186128B890293E50AC4389727B3BAAB0ED2903D710A12DEB7D0C3F8CC88A`.
Specs archive SHA256 is `72D030BA0F9617C866C914DB5870F7D624D3FAA8AE2E80549B255A573AE69648`.
Both archive hashes agree with GitHub's recorded release digests.
No dependency installation, source build, system configuration or alternate runtime was needed.

The measured Windows download/extraction took 0.93 seconds; the separate specs download/extraction also completed successfully.
Default decompilations took approximately 0.10–0.38 seconds each; fresh 3C00 m2c took 0.575 seconds.
All runs had 60-second wall limits; none timed out.
Elapsed investigation and evidence preparation took roughly fifteen minutes, beyond raw tool execution.
Existing source changes in Total Resolver were observed at intake and left alone.

Replay uses the downloaded executable, `--sleighpath R/specs`, and one validated ELF:

```text
kuna.exe decompile inputs/001F3C00-code.elf func_001F3C00 --json --sleighpath <absolute R>/specs
kuna.exe decompile inputs/001F3C00-code.elf func_001F3C00 --option regionstructure off --json --sleighpath <absolute R>/specs
```

`outputs/*/command.json` records exact absolute executable/spec paths, arguments, elapsed time and exit status.
`analysis/summary.json` compares output hashes, including unchanged alternate structuring and failed architecture runs.
`validation.json` authenticates release assets, input mappings, reference manifests and unchanged earlier m2c outputs.
The task-local `m2c_3c.cjs` uses the existing pinned m2c checkout; no canonical wrapper output was changed.

Manual second-opinion use has low setup cost here, but it requires a validated loader and instruction checks for consequential differences.
Do not automatically compile its inferred types or treat variable merging as original source history.
No maintained integration is proposed by this assignment. Future manual use can remain optional and bounded to an ambiguous function region.

## Freeze and release

Evidence manifest: `build/kuna-analysis-trial-r1/manifest.json`, 968 files.
SHA256: `983F2913ED08DEFC4F96B007DC52C4A58C356FE6B747DADC5A3CBB45C7A47B26`.
It includes exact downloaded binaries/specs, docs/source references, scripts, analysis ELFs, outputs and validation; temporary files are excluded.

Only this fresh report, claim and ignored R were written. All predecessor reports and roots remain unchanged.
No production source, shared tool/compiler/configuration, runtime/Resolver, Git mutation or canonical build/diff/verifier operation occurred.
No compiler candidate was justified because the useful pointer reconstruction already exists in current source.
Writes are complete and released. Independent review is the Director's next action; ordinary matching gains no additional review gate.
