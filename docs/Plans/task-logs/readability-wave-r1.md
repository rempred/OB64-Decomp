# Readability wave R1

Completed. All three independently derived readability improvements pass the single final complete-wave verifier with PURE_C and exact full-ROM output. The Director can record the wave.
Task `readability-wave`, revision 1, launch `READABILITY-WAVE-20260906-01`, receiver `/root/boot_conversion_preparation`, host local.
The complete fresh claim was created atomically and read back before this write.
Canonical main starts at `8a530c83581eb06e561d7a40eff7c83399d1d7d1`; parent main is `f940a2825ac97453746d3e9cef9c5cabc60a8dd2`.
The unrelated existing untracked paths are the capture-input retrieval claim/log and selector-observer review claim.
Ownership covers only `src/lib/func_00044130.c`, `src/lib/func_00044238.c`, `src/lib/func_00044934.c`, necessary existing linkage evidence, and the assigned report/evidence outputs.
No other writer owns production source/build operations. Disjoint documentation and research writers remain active.

Plan: inspect each retail owner and shared class layout, simplify one target at a time, run early linked diffs, and preserve failed hypotheses.
The first two targets have explicit gotos and canceling arithmetic; the third has repeated raw address expressions.
Leading hypothesis: structured branches and evidence-backed field declarations can preserve exact output while improving comprehension.
Alternative: some constructs preserve KMC control-flow, scheduling or register choices. The linked diff will distinguish those cases.
All changes remain provisional until one final normal verifier covers the entire three-target wave with PURE_C and exact complete-ROM gates.
No external source/comparison excerpts, agents, tooling changes, staging, commits, branches/worktrees or push are allowed.

## Independent source/owner inspection

Accepted target sections are `.ob64.r0901`, `.ob64.r0902`, and `.ob64.r0907`, with 264, 264, and 184 bytes.
Their accepted RAM starts are `0x8016E230`, `0x8016E338`, and `0x8016EA34`.
The original assembly's per-instruction RAM comments use a historical mapping; accepted placement and actual encoded jumps determine these owners.
Original ASM paths are `asm/original/rev0/lib/<symbol>.s`; their z64 word ranges are the direct instruction evidence.
The first two functions select one of three byte fields and use the alternate class when the selected field is 0xFF.
The third selects a class through two ordered byte thresholds; all comparisons mask the supplied input to eight bits.
No stronger gameplay field names are inferred.
The existing shared header has only opaque storage for these bytes. It was inspected but is unchanged to avoid widening dependency scope.
Baseline source copies and parsed prior target proofs are preserved under `build/readability-wave-r1/`.

## Experiment 44130-1

Replaced the goto chain with nested `if`/`else` branches and removed the canceling result increment/decrement.
The data fields, numeric class-table base, masked indices, sentinel, and final return type remain unchanged.
The first diff invocation mistakenly supplied a path after boolean `--profile`; argument parsing rejected it before compilation.
Corrected command: `node tools/diff.js func_00044130`; log `func_00044130.structured.link.log`.
The linked result is pending.

44130-1 result: canonical diff rejected `.ob64.r0901` section shape before linking.
Read-only ELF section decoding showed 260 bytes instead of the accepted 264.
The untouched compiler assembly branches directly from the first sentinel check toward the common return, eliminating the retail intermediate jump.
No current linked-diff JSON was attributed to this failed command.
Candidate source SHA-256: `84EE16E2DED40265EC5891BCE74C2A4561D247CF934073EB4397E7CC5647FDDC`.
Compiler assembly is preserved as `func_00044130.structured.compiler.s`.

## Experiment 44130-2

Retained the structured if/else source and restored only the first branch's result increment/decrement pair.
This isolates the pair's control-flow effect from goto removal.
Command: `node tools/diff.js --profile func_00044130`.
Candidate and log: `func_00044130.structured-retain-pair.c` and `func_00044130.structured-retain-pair.log`.

44130-2 result: EXACT decoded instructions and raw linked bytes, zero differing bytes, PURE_C, relocation contract MATCH.
The linked target SHA-256 is `76D4B3D9CA195F4A2C914ED64455FED70A92496C9E50189AA84F722153D12E70`.
The diff JSON is preserved as `func_00044130.structured-retain-pair.diff.json`.
The diagnostic score is 45/6600 despite exact decoded rows and exact raw linked bytes; scalar score is not the acceptance criterion.
Added a source comment explaining the measured canceling-pair requirement after the exact diff; the final verifier will cover that comment's source identity.

## Experiment 44238-1

The retail second function has the same branch shape and uses adjacent class bytes 0x0C, 0x0E, and 0x10.
Applied the independently derived structured layout with the first function's measured canceling-pair workaround retained.
The local structure keeps the original byte offsets and 0x48 stride. No shared header or linkage change is needed.
Command: `node tools/diff.js --profile func_00044238`.
Candidate and log are preserved as `func_00044238.structured-retain-pair.c` and `.log`.

44238-1 result: EXACT decoded instructions and raw linked bytes, zero differing bytes, PURE_C, relocation contract MATCH.
Linked target SHA-256: `873D9895464FBA0A9196EED2B1CA5B262E6014752F46298AF7BAD3B6DC02F77D`.
Its preserved diff is `func_00044238.structured-retain-pair.diff.json`.
The pair-removal failure was measured in the identical first-function branch shape; no separate pair-removal failure is claimed for this target.

## Experiment 44934-1

Replaced the raw signed-byte pointer/address expressions with a local ClassEntry view at the existing class-table base.
The view exposes only byte fields 0x15 through 0x19 and preserves the 0x48 record stride.
Field names remain offset-based. The two threshold comparisons, short-circuit order, byte masks, and branch priority remain intact.
Removed the unused signed-byte typedef and explicit byte-offset local.
Command: `node tools/diff.js --profile func_00044934`.
Candidate and log: `func_00044934.typed-fields.c` and `.log`.

44934-1 result: canonical diff rejected owner section shape before linking; read-only ELF inspection found 180 bytes instead of 184.
The compiler retained the complete class-table base in a3 and shared it on the second threshold path.
That changed both the initial class-selection branch and the later addressing sequence.
Preserved untouched assembly: `func_00044934.typed-fields.compiler.s`.

## Experiment 44934-2

Retained the typed fields but restored explicit byte-offset calculation and repeated it in the second path, as retail does.
Removed the long-lived classes pointer to test whether its lifetime caused the new base-register allocation.
Command: `node tools/diff.js --profile func_00044934`.
Candidate and log: `func_00044934.typed-offset.c` and `.log`.

44934-2 result: EXACT decoded instructions and raw linked bytes, zero differing bytes, PURE_C, relocation contract MATCH.
Linked target SHA-256: `13533923F467D186945A7D05CAE734FEA8DF8DEB90A974CDF6082D7688825C0C`.
The preserved diff is `func_00044934.typed-offset.diff.json`.
Added a local comment explaining the measured byte-offset requirement; final verification covers the resulting source identity.
No further production source changes are planned. All three targets remain included in the final gate.

## Combined final verification

Running exactly one `node tools/verify.js` after the complete changed wave is ready.
No preceding build or per-target full verifier was run.
The final output log is `build/readability-wave-r1/final-verifier.log`.

## Source identities and retained changes

| Target | Before SHA-256 | Final SHA-256 |
|---|---|---|
| `func_00044130` | `A2C09AB7DB01FB541CA9F925118A05FAF3E5401D487D47A7ED8EABCD666DE024` | `F518357B809CD75A6DE70FAB2216CFF94C3C10FE14072F214A88F3D0153ED686` |
| `func_00044238` | `4ACC3FB997913F31C1CDA10821D6DCC710983A1A220721F745012B21DB578C34` | `A3A65624709A00E931D3E33842EE07F261AAB26E5D9CE446F36D088313F9202D` |
| `func_00044934` | `428C23B62192385F9C2426430959359EF0F0BC24B3461577638A6B43952E5927` | `D1E5D43527B1B7ED31477E6A5C5FFAF0C5ADF5217318D03036BB0637E8E374D3` |

The first two targets replace all goto labels with structured branches while retaining their required result-pair compiler shape.
The third replaces split raw addresses with an explicit class-record view and named offset fields.
All three preserve their parameter types, byte masking, selected/alternate-class rule, and return behavior.
No new semantic function name, field meaning, global alias, dependency, or shared declaration is introduced.
The class stride and offsets are directly established by the retail multiplication and byte loads.
Exact byte evidence establishes matching only; no new runtime or editor claim follows.

## Evidence index

All generated evidence remains ignored under `build/readability-wave-r1/`.
- `baseline-targets.json` preserves the inspected prior owners and relocation contracts.
- `func_<address>.before.c` preserves each starting source.
- Named experiment `.c`, `.log`, `.compiler.s`, and `.diff.json` files preserve attempts and exact results.
- `inspection-identities.json` records the inspected source, assembly, header, and configuration identities.
- `final-source-identities.json` binds the authored inputs for the final verifier.
- `final-verifier.log` records the single complete-wave command.
Final proof/state snapshots will be added after verification completes.

## Final result and handoff

Completed. The single normal verifier passed baserom, toolchain, source policy, sole C ownership, placement, relocations, target bytes, and complete-ROM equality.
Its exact final CURRENT fingerprint is `DB5D230370D66813C424F62AB2AC3AC9AACD0D83DC2D46097EB18952B5455CDF`.
Verified at `2026-09-07T01:08:55.601Z`.
The full 41,943,040-byte ROM SHA-256 is `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A`.

| Final evidence | SHA-256 |
|---|---|
| `final-build-report.json` | `6673E5ACE0459067F15633E43CE261644F4091500397308E174494BADA828D0B` |
| `final-verification.json` | `265DAFB0D3031DBA41D62545F9B3B976740A72A8B08DF5C8B44B49C4740A22AE` |
| `final-fresh-compilation.json` | `B42821CE7C2B96734EFB658CA0126D44E0F0C26E89A935AE511060B6A91DEECD` |
| `final-wave-evidence.json` | `48AAF0375590FEF2B02D1F0D48DD415F874C45ABCCE4B0EA4F7DFC61388AA5B7` |

The final state, policy report, per-target source-object proofs, and untouched compiler assembly are also preserved in the same ignored directory.
The final authored source identities match the table above, including the compiler-explanation comments.
All three final target records are `PURE_C`, have exact bytes, and have zero retained assembly slices.
Each linked owner remains `objects/c/<symbol>.o` in its original accepted section and placement.
The first two targets retain their three `.text` `R_MIPS_26` relocations at offsets 0x5C, 0x74, and 0xBC.
The third retains its `.text` `R_MIPS_26` relocation at offset 0x64.
No relocation contract edit was needed.

Scope checks confirm that only the three assigned C files changed in production.
Original assembly, the shared class header, registries, linkage configuration, and toolchain identities remain unchanged.
Main advanced through disjoint Director/documentation work to `bdf03d8aac7583f9ded491ac3e74b03cdcae41f3` during the run.
The committed production paths have no difference from launch main `8a530c8`; the final proof therefore covers unchanged integration inputs plus this wave.
`git diff --check` passes on all three sources. Report/log whitespace and evidence JSON parsing were checked.
No extra source-policy invocation was needed: each diff and the final verifier supplied mechanical classifications.
No ordinary independent source review, per-function full-ROM build, redundant final build, or verifier repeat occurred.

Failed methods are bounded to the recorded source variants: 44130-1 emitted 260 bytes; 44934-1 emitted 180 bytes.
The malformed initial CLI invocation stopped at argument parsing and was corrected without a setup or tooling change.
An optional guessed ELF-helper filename was absent; the actual object was inspected directly with read-only ELF decoding.
Neither failure justified weakening a gate.

No canonical semantic documentation change is proposed. The retained source comments explain only measured compiler behavior.
The result is ordinary verified readability work, with no new gameplay, runtime, editor, compiler, or structural claim.
Protocol deviations: no authority, source, tool, external-source, or verification boundary was crossed.
No agents, branches/worktrees, staging, commits, or push were used.
The Director `/root` can record this complete wave without an independent source-review gate or unchanged-input verifier repeat.
No blocker remains. All production source/build and report/evidence writes are released at terminal handoff.
