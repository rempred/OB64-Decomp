# Allocator scheduler trace

Status: completed research-only compiler experiment on 2026-09-04.

This experiment closes the remaining scheduler inference from
`allocator-owner-order-study.md`. At all five pinned baseline sites, the
instrumented GCC directly reported the same decision:

1. `calls.c` copied the allocator result out of hard register `v0` before the
   owner-load RTL was created;
2. after the context load was scheduled in schedule2, the return save and
   owner load had equal priority;
3. the return save had `REG_DEP_ANTI` link kind 14, with base cost 1;
4. MIPS `ADJUST_COST` changed that cost to 0 and `insn_cost` normalized it to
   effective cost 1;
5. both candidates were consequently class 3;
6. the owner load had the later original LUID, won `rank_for_schedule`, and
   was the actual `ready[0]` selection.

The trace compiler produced exactly the same assembly, adjusted assembly, raw
object, function bytes, and relocations as the authenticated compiler for all
six inputs. Only its stderr trace is evidence. None of its code output is a
matching candidate or acceptance artifact.

## Scope and provenance

The harness is `tools/matching_studies/allocator_scheduler_trace.js`. It
authenticates the production compiler, bootstrap result, explanatory compiler
checkout, target definitions, and each pinned source before it creates an
isolated source copy under ignored `build/scheduler-trace/`.

The explanatory GCC input was:

- source commit `43d1cdb67ed135879869b5266f01efaaada5e35a`;
- source tree `bbed133c38a1feffafe941c36b20d3b38ba47a33`;
- authenticated production `cc1.exe` SHA-256
  `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6`;
- isolated instrumentation identity
  `6EDFDE806E62D97C9B6A7C085B94832D9420234B02CBDC87C898954D7EFBF7F1`;
- isolated research `cc1-trace.exe` SHA-256
  `F675E352B9C9505AB821ED358755E5329BE01D8A6B50ADE57C07DE50F5A4447F`.

The build copied the configured compiler tree without `.git`, changed only
the copied `emit-rtl.c`, `calls.c`, and `sched.c`, rebuilt those three objects,
and linked the existing configured object census. The original source checkout
and authenticated production binary were read-only. The generated build
manifest records the exact host `cl.exe`, `link.exe`, and `vcvarsall.bat`
paths and hashes, flags, object list, log, patched-source hashes, and research
compiler hash.

Instrumentation is deliberately narrow:

- `emit-rtl.c` registers only exact symbol RTL for `func_80070F30`,
  `D_801CE8BC`, and `D_801CE8C0`, then records the UIDs of instructions that
  mention them. It also records a simple `v0`-to-pseudo return save.
- `calls.c` records the precise result-copy instruction returned by
  `emit_move_insn` or `copy_to_reg`.
- `sched.c` records relevant `insn_cost` inputs and cache state, the raw and
  post-`ADJUST_COST` costs, the effective cost, both comparator operands,
  priorities, links, classes, LUIDs, winning clause, preferred UID, and actual
  selected `ready[0]`.

The trace is enabled only through `OB64_SCHED_TRACE` on the isolated compiler.
The harness runs the production compile without that variable, then runs the
research compile at the same source and output paths. It rejects any assembly,
adjusted-assembly, raw-object, function-byte, or relocation difference before
interpreting the trace.

## Exact output parity

The four archived `PURE_C` baselines and the two distinct focused emitted
states all passed every parity gate:

| Input | Role | Emitted-state SHA-256 | Assembly / object / relocations |
| --- | --- | --- | --- |
| `func_002158E4` | pinned baseline | `7AB4A8AFA47CB78EB730FAF409263BDB76EA77055DD20A5C144B3AB4AAD67F75` | exact |
| `func_002159D0` | pinned baseline | `29F4106E8C25FD168F29CB853BE2CD696DAD69A9DDD37BE074FD0E721EF91265` | exact |
| `func_00215CF0` | pinned baseline, two sites | `07A2E15FEF8125920C5043FD31D359CA4949B4546D1FF651AEDB2E0FD49F07A3` | exact |
| `func_00217BA8` | pinned baseline | `60EB04DF88C14C77621E23ABB423B877073F4A86B0F44D2549BA16A71AD9C2DE` | exact |
| `do-while-late-transfer` | focused state | `30D1EAA445D0F491313CE4621EA9F0F34774348DA9FBAD01F85885B36CBA79EA` | exact |
| `inline-two-result-helper` | focused state | `DEF880615EE6A235C2B424655F5C0E0F7A80478A248E54C3A9A2B38EC3CE6722` | exact |

“Exact” here means equality between production and research compiler output,
not equality with retail. The two focused states retain the non-exact outcomes
documented by the preceding study.

## Direct creation-order observations

Each source-level allocator site produces two internal raw instruction
creation events before the linked instruction is retained. The `calls.c`
marker disambiguates the linked result copy. At every site it identifies the
second return-save UID, and that event precedes the first owner-load creation.

| Input | Site | Linked allocator UID | Return-save UID | `calls.c` path | Creation sequence: call, save, copy, owner |
| --- | ---: | ---: | ---: | --- | --- |
| `func_002158E4` | 1 | 11 | 13 | `target-move` | 2, 4, 5, 6 |
| `func_002159D0` | 1 | 27 | 29 | `target-move` | 4, 6, 7, 8 |
| `func_00215CF0` | 1 | 767 | 769 | `target-move` | 47, 49, 50, 51 |
| `func_00215CF0` | 2 | 2208 | 2210 | `target-move` | 168, 170, 171, 172 |
| `func_00217BA8` | 1 | 259 | 261 | `target-move` | 29, 31, 32, 33 |
| `do-while-late-transfer` | 1 | 11 | 13 | `target-move` | 2, 4, 5, 6 |
| `inline-two-result-helper` | 1 | 12 | 14 | `target-move` | 2, 4, 5, 6 |

This is direct logging from `make_call_insn_raw`, `make_insn_raw`, and the
ordinary result-copy branch in `calls.c`; it is not reconstructed from final
dump order. Both focused source forms leave the relevant call-expansion order
unchanged.

## Direct schedule2 decision

The following values are the internal comparator and cost values, not values
inferred from dump syntax. `save link` is the link from the last-scheduled
context load to the return save. The owner has no corresponding link.

| Input | Site | Context UID | Save UID / LUID | Owner UID / LUID | Priority | Save link | Cost: base -> adjusted -> effective | Classes save / owner | Winner and selected UID |
| --- | ---: | ---: | --- | --- | ---: | --- | --- | --- | --- |
| `func_002158E4` | 1 | 19 | 13 / 18 | 16 / 20 | 1 | `REG_DEP_ANTI` (14) | 1 -> 0 -> 1 | 3 / 3 | owner 16 |
| `func_002159D0` | 1 | 35 | 29 / 2 | 32 / 4 | 1 | `REG_DEP_ANTI` (14) | 1 -> 0 -> 1 | 3 / 3 | owner 32 |
| `func_00215CF0` | 1 | 777 | 769 / 6 | 775 / 8 | 3 | `REG_DEP_ANTI` (14) | 1 -> 0 -> 1 | 3 / 3 | owner 775 |
| `func_00215CF0` | 2 | 2218 | 2210 / 1 | 2216 / 3 | 1 | `REG_DEP_ANTI` (14) | 1 -> 0 -> 1 | 3 / 3 | owner 2216 |
| `func_00217BA8` | 1 | 267 | 261 / 4 | 264 / 6 | 1 | `REG_DEP_ANTI` (14) | 1 -> 0 -> 1 | 3 / 3 | owner 264 |

For all five rows, the trace reports `clause=luid`, identifies the later
owner-load LUID as `preferred`, and subsequently reports that same UID as
`selected` in `ready[0]`. The MIPS adjustment really does execute: its
post-adjust value is 0, after which `insn_cost` sets the link-free cache and
returns effective cost 1. The prior study's class-3 interpretation is now
directly verified.

## Focused-state distinction

The focused states explain two different outcomes:

- `inline-two-result-helper` retains the baseline mechanism. At schedule2 its
  save UID 14 and owner UID 15 have priority 1 and LUIDs 22 and 24. The save's
  cost is 1 -> 0 -> 1, both candidates are class 3, `clause=luid` prefers owner
  15, and `ready[0]` selects owner 15.
- `do-while-late-transfer` has no owner/save comparator event because the two
  instructions are never ready together. The trace directly records a
  non-free true dependency from owner UID 20 to context UID 36 with
  `REG_DEP_TRUE` kind 0 and cost 3 -> 3 -> 3. At clock 45 the context releases
  owner 20 as the only ready instruction; at clock 46 owner 20 releases return
  save 13 as the only ready instruction. This removes the LUID tie but, as the
  prior object study showed, retains the original residual and adds another
  one.

The do-while result is important negative evidence: merely replacing the
class-3 tie with a real dependency does not guarantee retail order or a better
emitted state.

## Direct evidence versus inference

Direct observations from the trace are:

- the call, return-save, `calls.c` result-copy, and owner-load creation order;
- schedule2 UIDs, LUIDs, priorities, link kinds, raw costs, adjusted costs,
  cache state, effective classes, comparator clause and result; and
- the actual selected `ready[0]` after sorting/selecting.

The remaining source-level conclusion is an inference constrained by those
observations. A successful source change must influence the compiler no later
than one of two points:

1. call/tree expansion, early enough to change semantic RTL creation before
   the ordinary `calls.c` result-copy point; or
2. dependency/priority formation before schedule2, strongly enough to create
   a useful non-free distinction without the do-while state's extra emitted
   cost.

Later spelling changes that converge on the same creation order, links,
priorities, and LUIDs cannot affect this scheduler decision.

Two bounded next hypotheses remain evidence-backed:

1. Test one semantics-justified enclosing inline-expression form that must
   materialize the owner read before the allocator result copy. Stop as soon as
   the creation trace remains unchanged. Do not assume the read can move across
   the allocator call without separate semantic evidence.
2. Use the do-while trace to derive one narrower lifetime form that preserves a
   non-free dependency but avoids its added transfer/emitted residual. Stop if
   the direct dependency or emitted state is unchanged or regresses.

These are discriminating experiments, not a source-shape sweep. Neither is
evidence that a `PURE_C` solution must exist.

## Reproduction

From the repository root in PowerShell:

```powershell
$env:OB64_KMC_GCC_SOURCE = 'C:\Users\Joe\.codex\ob64-phase6-kmc-20260801\clean-d\source\mips-gcc-2.7.2'
node tests/allocator_scheduler_trace.js
node tools/matching_studies/allocator_scheduler_trace.js prepare
node tools/matching_studies/allocator_scheduler_trace.js build
node tools/matching_studies/allocator_scheduler_trace.js run
```

The aggregate result is `build/scheduler-trace/report.json`. Per-input
production and research assembly/object snapshots and raw trace logs are under
`build/scheduler-trace/r/b1` through `b4`, then `v1` and `v2`. Generated
compiler source, binaries, logs, assemblies, objects, and reports remain
ignored.

This workflow is diagnostic only. It does not alter source ownership, source
class, compiler acceptance, function boundaries, matching-C counts, or the
canonical exact-ROM verification requirement.
