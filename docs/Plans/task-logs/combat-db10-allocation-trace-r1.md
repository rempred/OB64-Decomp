# DB10 allocation trace R1

Completed. Isolated traces explain the first allocation divergence among the three retained DB10 candidates. All scalar homes arise during reload's initial ascending-pseudo traversal. The Director must obtain independent diagnostic review before reusing these causal findings. No matching acceptance changed.

## Scope and identity

Receiver `/root/db10_allocation_trace`; Director `/root`, local task `01a07dad-52c1-7cb0-9913-d9f7afa91281`. Assignment revision 1, launch `COMBAT-DB10-ALLOCATION-TRACE-20260907-01`. The permanent claim was created atomically and read back before other writes.

Starting main HEAD was `b01ce6743d107562578ba8bde126bc7b11f8ebc2`. Director commit `22fba854` changed coordination documents during this investigation. Existing W8 source/configuration changes and held Resolver tests were preserved. Production DB10 still hashes to the guarded candidate below.

Only the assigned claim, this report, and ignored `build/combat-db10-allocation-trace-r1/` were written. No canonical diff, full build, verifier, runtime, GUI, bridge, database, branch, staging, commit, or agent launch occurred.

## Inputs and output agreement

`inputs.json` binds authored source and mechanically expanded complete compiler inputs. Each source class was freshly derived as PURE_C through the existing source-policy API. This is classification, not matching acceptance.

| Candidate | Authored SHA-256 | Complete input SHA-256 | Frame |
|---|---|---|---|
| Current guarded dedup | `5BF6ACF3CEF8F4A229AA143CCEB76376AC333B455BB1EDA18E9296476D791FD3` | `08561F8CD28616666538499F3F86CD3BB4A58D38B608DB0872742DFF5DCC375D` | 552 |
| Older null-first peers | `A2CFD7EFF3CE04ABD178D5CB577F37B9E218ACBC4F312A95D6FE90C02DB19C61` | `E9280D970F8CFFE1CAB7AD40438903C8F7297FFEFDD53CA25E4112C597879268` | 552 |
| Failed distinct second latch | `CAFD07198E1132BCFAA44CE947427C6E3FCDADD9A2853688A64C305F9BEB43E5` | `EC9329F9CF58D8DFDAF3DDC788466234A15117A5AECE96041FED8519BA4EC80C` | 560 |

The pinned production compiler remains `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`. Its path and every invocation appear in the candidate command records.

The deployed build tree was copied into the owned ignored root. Existing bootstrap and allocator-diagnostic build commands supplied the x86 MSVC flags and original object link order. The current host reports Visual Studio 18.9.2; the original bootstrap reported 18.7.4. Therefore rebuilt-binary identity is not presumed.

The uninstrumented control rebuilds `function.c`, `reload1.c`, and `combine.c`, then links the copied remaining original objects. Its complete assembly equals pinned output byte-for-byte for every input. This is a three-unit rebuild control, not a fresh whole-toolchain bootstrap.

The instrumented compiler also produces byte-identical pinned assembly without `-da`. With `-da`, only the exact comment line containing `-funsigned-char -da -o` differs. All instructions, directives, labels, data, and frame declarations agree. Trace logs with and without `-da` are identical. Retained production snapshots agree after their `.file` metadata is excluded.

`agreement-control.json`, `agreement-traceplain.json`, and `agreement-trace.json` record these comparisons. Interpretation began only after agreement passed. No assembly rewriting enters production or these compiler invocations.

## Diagnostic delta

`function.c` logs every `assign_stack_local` request and result: function, mode, original size, requested alignment, effective alignment, rounded size, frame transition, endian correction, virtual-register state, and memory operand.

`reload1.c` tags each existing `alter_reg` call site. Its allocation branch logs pseudo, call path, source hard register, references, inherent size, requested total size, and final home. It changes no allocation condition, register choice, size, or alignment.

`combine.c` logs the existing death-note USE insertion branch. It records pseudo, emitted instruction UID, original comparison/branch UIDs, and the instruction where backward searching stopped. Logging uses stderr only. `print_rtl` changes diagnostic printer state; the output controls establish unchanged assembly for these inputs.

The three `.patch` files preserve the exact normalized diagnostic delta. `compiler-input-identities.json` binds all copied inputs and original hashes. Only those three source files and their rebuilt objects differ among original existing files. Relevant source files equal commit `43d1cdb67ed135879869b5266f01efaaada5e35a` after newline normalization. Its tree is `bbed133c38a1feffafe941c36b20d3b38ba47a33`.

## Allocation findings

Direct observation; evidence grade Verified at these complete candidate inputs; review pending.

All three runs first allocate six 72-byte BLK objects. Their local frame offset grows from zero to 432. Reload then allocates the scalar homes below. Every request uses SI mode, inherent/requested size four, alignment argument -1, effective alignment eight, and rounded size eight. Big-endian correction is four. Every call uses `from_reg=-1` through `reload-initial`; no subsequent allocation or reuse path adds a home.

Each table entry is `pseudo / physical stack offset`. Offsets are hexadecimal addresses relative to the function's stack pointer. They identify local storage, not ROM or global RAM addresses.

| Allocation ordinal | Older null-first peers | Current guarded dedup | Failed second latch |
|---|---|---|---|
| 1 | 72 / 1CC selector | 72 / 1CC selector | 72 / 1CC selector |
| 2 | 73 / 1D4 shared latch | 73 / 1D4 shared latch | 73 / 1D4 first latch |
| 3 | 860 / 1DC context pointer | 818 / 1DC USE only | 459 / 1DC second latch |
| 4 | 869 / 1E4 resource pointer | 861 / 1E4 context pointer | 861 / 1E4 context pointer |
| 5 | 1022 / 1EC USE only | 870 / 1EC resource pointer | 870 / 1EC resource pointer |
| 6 | 1023 / 1F4 USE only | 1024 / 1F4 USE only | 1023 / 1F4 USE only |
| 7 | 1025 / 1FC USE only | 1026 / 1FC USE only | 1024 / 1FC USE only |
| 8 | absent | absent | 1026 / 204 USE only |

The scalar frame transitions are 432, 440, 448, 456, 464, 472, 480, 488, and optionally 496. A final zero-size BLK alignment call leaves the extent unchanged. The emitted frames add 24 outgoing bytes and 40 saved-register bytes: 552 or 560.

The first allocation-role divergence is ordinal three. In the guarded candidate, pseudo818 precedes pointer861 numerically. In the older candidate, comparison1022 follows both pointers. The existing reload loop visits pseudos in ascending order, so the different identities directly explain the different home order. The guard changes ordering without increasing the seven-home count.

The failed latch candidate splits a real shared lifetime. Its extra pseudo459 receives an accessed home at stack offset1DC. It therefore reaches560 by adding a real spill, while retail's corresponding second-pass accesses remain at1D4. Its correct total frame remains a known failure.

## Comparison origins

The guarded candidate's pseudo818 is created in initial RTL by the explicit dedup entry test `index < count`: comparison UID2727, branch UID2728. The older corresponding entry comparison is pseudo1022, created during the first jump pass, after the pointer pseudos already exist.

The guarded trace records USE UID3689 from comparison/branch2727/2728, with backward search stopping at jump2683. The insertion-search comparison1024 produces USE3690, stopping at label3549. The final submission-loop comparison1026 produces USE3691, stopping at jump3094.

These events come from `combine.c`'s existing REG_DEAD redistribution branch. The adjacent source comment mentions a code label, but the actual loop also stops at jumps. The trace establishes the recorded stop kinds; the report does not replace them with the narrower comment.

All three comparison pseudos retain only standalone USE nodes with REG_DEAD at local allocation. At global/reload output, those operands become the recorded memory homes. Final assembly has no direct memory access or stack-address formation for those homes. The analyzer checks these facts and preserves matching RTL nodes through every retained pass.

The context/resource pointers remain real addresses `sp+5C` and `sp+A4`. Their stored homes move, while their address values retain the same array-copy roles. `allocation-analysis.json` preserves all selected pseudo nodes, actual allocator events, and emitted stack accesses.

## Limits and source follow-up

These are candidate allocation traces. No original retail compiler input, RTL, or allocation trace exists in this evidence. Retail's unaccessed positions cannot be labeled USE homes from these comparisons. No guaranteed exact-C recipe, original declaration, compiler defect, representation defect, or pure-C impossibility follows.

The new causal lead is narrower: source control-flow placement can change whether a real comparison pseudo is created before or after the pointer pseudos. Dead comparison bookkeeping then participates in the initial ascending allocation pass.

A later source worker can use this explicit diagnostic predicate for guided tests or reduction: preserve actual runtime operations, the selector/shared-latch homes1CC/1D4, and the pointer values/homes5C-at1E4 andA4-at1EC. Report every extra accessed spill separately. Frame560 alone must never count as success.

Two bounded follow-ups are justified:

1. Trace the already-failed guarded insertion/search and group-loop controls before repeating source spellings. Determine whether their comparison creation order moved a USE ahead of the pointers or merely replaced an existing comparison home.
2. Limit new source alternatives to the existing dedup, insertion-search, and submission-loop predicates. Compare real entry-guard and loop-test lifetimes using their originating comparisons and emitted accesses. Reject artificial variables, padding, or compiler-only references. Retaining an additional non-emitting home would be a candidate observation, not proof of retail history.

No new source experiment ran here. Existing failed guards and wrappers remain failures; these recommendations do not propose rerunning them without a new trace question. Source continuation retains the unresolved instruction-order differences and the complete owner comparison.

All fourteen W8 members and their single final complete-wave verifier remain required. Independent review here applies to reusable diagnostics, not ordinary matching acceptance.

## Reproduction and verification

All commands run from the canonical repository. The ignored scripts write only their own root. Start with a fresh assigned output root and copy the original compiler tree before running `prepare.js`.

```powershell
node build/combat-db10-allocation-trace-r1/prepare.js
# With the three original compiler source files present:
& build/combat-db10-allocation-trace-r1/build.cmd cc1-control.exe
node build/combat-db10-allocation-trace-r1/run.js control
node build/combat-db10-allocation-trace-r1/instrument.js
& build/combat-db10-allocation-trace-r1/build.cmd cc1-trace.exe
node build/combat-db10-allocation-trace-r1/run.js trace
node build/combat-db10-allocation-trace-r1/run.js traceplain
python build/combat-db10-allocation-trace-r1/analyze.py
```

Each candidate command JSON contains complete flags, binary identity, output path, exit status, and stdout. Build logs retain exact host diagnostics. `output-manifest.json` binds final evidence and this report. Compiler sources, binaries, and RTL remain ignored.

One instrumentation attempt failed before producing a usable compiler: newline-sensitive replacement missed `alter_reg`, and unavailable `print_rtl_single` caused a link error. The failure log is preserved. Normalizing copied source and using existing `print_rtl` resolved it. An initial comparison filter missed the exact `-da` comment; inspecting the full diff established the single allowed difference. The parser's first greedy regex captured only the final home; the corrected parser asserts every expected event and USE-only count. No conclusion relies on those failed outputs.

The required readings were completed. Some combined tool output truncated and was reread in bounded portions. No protocol deviation or canonical-document change is proposed. All writes are released at terminal handoff; the Director next routes independent review and ordinary W8 continuation.
