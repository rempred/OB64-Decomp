# Allocator return / owner-load ordering study

Status: bounded diagnostic study completed on 2026-09-04. No new matching-C
candidate was found, and no active source was changed.

## Result

The repeated three-instruction residual is a deterministic KMC GCC 2.7.2
ordering result, not an unexplained linker difference. All five observed sites
in the four archived `PURE_C` baselines reach the same final-scheduler choice:

1. the allocator result has already been copied from `v0` into its long-lived
   destination;
2. the `D_801CE8BC` owner load follows it in forward RTL order;
3. after the `D_801CE8C0` context load is selected, the owner load and return
   save have equal priority;
4. the context load has a `REG_DEP_ANTI` link to the return save, but the MIPS
   `ADJUST_COST` rule changes anti/output cost to zero;
5. `insn_cost` normalizes that adjusted cost to the free cost `1`, so
   `rank_for_schedule` assigns both candidates class 3; and
6. original LUID is therefore the deciding clause. The later owner-load LUID
   is selected first while scheduling backward, preserving return-save before
   owner-load in the final forward instruction stream.

This confirms the stable-order hypothesis only in that precise sense: after
priority and effective dependence class tie, original LUID deterministically
preserves the incoming forward order. The mere presence of an anti-dependence
does **not** put the return save in class 2 on this backend.

The three bounded source-shape probes did not produce exact linked bytes. This
falsifies those named hypotheses for the smallest site; it does not establish
that a `PURE_C` expression is impossible.

## Reproduction

The harness requires a clean copy of the reviewed compiler source at commit
`43d1cdb67ed135879869b5266f01efaaada5e35a`. The path is explanatory input;
the authenticated project compiler remains the compiler used for every
candidate.

From the repository root in PowerShell:

```powershell
$env:OB64_KMC_GCC_SOURCE = 'C:\path\to\mips-gcc-2.7.2'
node tests/matching_studies.js
node tools/matching_studies/allocator_owner_order.js list
node tools/matching_studies/allocator_owner_order.js run
```

The equivalent one-shot form is:

```powershell
node tools/matching_studies/allocator_owner_order.js run --compiler-source 'C:\path\to\mips-gcc-2.7.2'
```

Generated evidence is confined to
`build/matching-studies/allocator-owner-order/`. The aggregate record is
`report.json`; each experiment is under `runs/<experiment-id>/`. The harness
does not use the shared `build/matching/` cache.

The default focused sweep is fixed at three variants. `--max-focused 0..3`,
repeatable `--variant <id>`, and `--skip-focused` permit narrower reproduction
without expanding the search. A zero-variant run reports
`baseline-only-no-focused-experiments`; it does not claim that any source
hypothesis was falsified. An exact small result is an early stop and may
proceed immediately through that target's normal canonical diff and verifier.
Propagation to all family sites and both holdouts is required before claiming
that the shape generalizes, not before target-local verification.

## Authenticated study contract

The completed run recorded these compiler flags verbatim:

```text
-quiet -O2 -meb -mips3 -mgp32 -mfp32 -G 0
-fno-PIC -mno-abicalls -fno-builtin -funsigned-char
```

It authenticated the compiler executable as SHA-256
`F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`
and recorded the assembler, linker, manifest, accepted ELF, source-policy
preprocessor, harness, target, and candidate identities in the generated
report. The explanatory compiler checkout is pinned by commit and by hashes of
`sched.c`, `calls.c`, and `config/mips/mips.h`; tracked changes to those files
make the run fail closed.

The pinned `PURE_C` inputs are:

| Symbol | Source SHA-256 |
| --- | --- |
| `func_002158E4` | `C59E098C0633E9DE88F4ABB550A6CB124BC315584D254776C4ACE4AEDAFB91A1` |
| `func_002159D0` | `0069119A8570AB793446B1B77DB688871707BAF9B95516862C25D41A2285407D` |
| `func_00215CF0` | `D1E9A5915BD38286869DC4FF67DF0EFD25932B3276B4E2CBF49828967A0A58B0` |
| `func_00217BA8` | `00168420BDA77475FA8045AB47DA8695508AD1C6F9B8D017CA2BD6CD30331A99` |
| `func_00047a94` control | `E76473D7CC3200AF6F0B26A68E8D1FFEE427316F5DFD7F6379E8DBFA694F12B4` |
| `func_0021C3B0` control | `BE8E96C64511E82F3674FAC8A94BC4C23F6B82C7217E7F130F81F4099D90732E` |

For each experiment the harness records:

- hypothesis, predicted compiler effect, source origin, and source SHA-256;
- source-policy classification and exact compiler/tool identities and flags;
- canonical object words, relocation records, their separate hashes, and a
  combined emitted-state hash;
- raw and alpha-canonicalized RTL identities for RTL, combine, schedule1,
  local allocation, global allocation, schedule2, and delay-slot passes;
- semantic allocator-call, return-save, owner-load, context-load, dependency,
  register-destination, and ready-list observations;
- instruction-level and contiguous-region residuals; and
- an isolated diagnostic link outcome with an explicit non-acceptance marker.

Dump-only `.file` provenance and compiler-command comments are excluded when
checking that dump flags leave compiler assembly unchanged. UIDs, pseudo
register numbers, and scratch paths are alpha-normalized for pass comparison;
operation order, hard registers, dependencies, priorities, object words, and
relocations remain significant.

## Baseline and control reproduction

All archived baselines classified as `PURE_C`, retained their accepted
extent, and reproduced exactly the residuals recorded in their dossiers.

| Symbol | Bytes | Observed residual | Decisive schedule2 evidence |
| --- | ---: | --- | --- |
| `func_002158E4` | 236 | `0x18..0x23` (12 bytes) | T-42, priorities 1/1, classes 3/3, original LUID |
| `func_002159D0` | 800 | `0x34..0x3F` (12 bytes) | T-42, priorities 1/1, classes 3/3, original LUID |
| `func_00215CF0` site 1 | 3400 | `0x4AC..0x4B7` (12 bytes) | T-45, priorities 3/3, classes 3/3, original LUID |
| `func_00215CF0` site 2 | 3400 | `0xC4C..0xC57` (12 bytes) | T-41, priorities 1/1, classes 3/3, original LUID |
| `func_00217BA8` | 1032 | `0x1C4..0x1CF` (12 bytes) | T-43, priorities 1/1, classes 3/3, original LUID |

The exact active owners for those four symbols remain `HYBRID_C`. They were
used only as exact object/link oracles and reproduced their target bytes; that
does not change their source class.

Two unrelated `PURE_C` controls established that the diagnostic compiler and
link path could reproduce exact output in the same run:

| Control | Bytes | Source class | Isolated linked bytes |
| --- | ---: | --- | --- |
| `func_00047a94` | 836 | `PURE_C` | exact |
| `func_0021C3B0` | 512 | `PURE_C` | exact |

For `func_00215CF0`, the stronger archived candidate includes the restored
ten-argument ABI setup. Its exact extent and two remaining local residuals
confirm that the earlier 164-byte structural deficit is closed; changing the
function boundary or argument contract is not justified by this scheduling
study.

## Focused source hypotheses

The sweep began from the 236-byte `func_002158E4` baseline.

| Variant | Prediction tested | Observed emitted state | Outcome |
| --- | --- | --- | --- |
| `do-while-late-transfer` | A constant-folded one-iteration scope might delay the long-lived return transfer or create a useful dependency. | New state `30D1EAA445D0F491313CE4621EA9F0F34774348DA9FBAD01F85885B36CBA79EA`; 236 bytes, 27 relocations. | Non-exact. It introduced a true dependence and removed the decisive tie, but retained the original 12-byte residual and added 8 bytes of residual at `0x2C`. |
| `inline-two-result-helper` | An inline helper returning the allocation while writing the owner might change call-result integration. | New state `DEF880615EE6A235C2B424655F5C0E0F7A80478A248E54C3A9A2B38EC3CE6722`; 240 bytes, 27 relocations. | Non-exact. The same class-3/original-LUID choice remained, extent grew by 4 bytes, and 54 instructions differed. |
| `one-shot-loop-carrier` | A genuine one-iteration region might change allocation weight or dependency release. | Same final object/relocation-state hash as `do-while-late-transfer`. | Deduplicated only at final emission and has the same regressed residual. Its initial RTL and delay-slot pass hashes remain distinct; combine through schedule2 converges and is still recorded. |

All three sources classified as `PURE_C`. None improved the archived baseline,
so no new candidate was archived and none is ready for canonical verification.

## Evidence boundary and holdouts

The diagnostic linker resolves undefined symbols at addresses read from the
current exact ELF and compares the isolated target section with accepted target
bytes. This is useful for instruction and relocation-sensitive experiments,
but it is deliberately marked `acceptanceEligible: false`.

It does not prove sole C ownership, canonical relocation handling, linked
target ownership, or complete-ROM equality. Only the normal verifier can make
those claims. No matching-C count or active-source status changes as a result
of this study.

`func_00219A14` and `func_0021A5C8` remain untouched holdouts. Each contains
the same retail owner-load prefix, but each accepted owner has a
read-before-prologue boundary caveat and no reviewed `PURE_C` candidate. The
fixed protocol therefore does not reconstruct or tune them unless an exact
small family shape first emerges.

## Next discriminating experiment

Build a separate research-only compiler from the pinned source and add
stderr-only logging at `rank_for_schedule` for the two semantic candidates.
For each decisive event, record `INSN_UID`, `INSN_LUID`, priority, link kind,
raw cost, post-`ADJUST_COST` cost, effective class, and the selected
`ready[0]`. Also log the `calls.c` return-copy emission point relative to the
owner-load RTL creation.

Run the four pinned baselines and the two distinct focused emitted states.
Require the instrumented compiler's assembly and object/relocation state to
equal the authenticated compiler's output; use only its stderr trace as
explanatory evidence. That closes the remaining inference between dump order
and internal LUID/cost values and tells the next source experiment whether it
must target earlier owner-load creation or a genuinely non-free dependency.
Output from the research compiler must never be used as a matching candidate.
