# 6098 allocation trace R1

Completed. The frozen 6098 candidate allocates 23 scalar homes, all with emitted accesses, and no compiler-only USE homes. The unchanged reviewed tracer preserves pinned assembly for this complete input. The Director can return this bounded evidence to the source worker; retail's extra 48 bytes remain unexplained.

## Scope and identity

Receiver `/root/db10_allocation_trace`; Director `/root`, local task `01a07dad-52c1-7cb0-9913-d9f7afa91281`. Assignment revision1, launch `COMBAT-DRAW-6098-ALLOCATION-TRACE-20260907-01`. The fresh permanent claim was created atomically and read back before other writes.

Starting main HEAD was `c8c7998458eccc09a0ba26a88d976de90727aff0`; the prompt's preceding coordination base was `7d88a481`. Existing W8 R1/R2 source and configuration changes and held Resolver files were preserved. Production ownership stayed with `/root/combat_draw_continuation`.

The governing guides were reused from the same session; canonical guide/workflow/source-policy files had no intervening Git changes. The complete accepted DB10 report/review and relevant W8 and older6098 preparation records were read. Their older candidate identities were not transferred here.

Own only this report, its assigned claim, and ignored `build/combat-draw-6098-allocation-trace-r1/`. No production edit, instrumentation change, source trial, canonical diff/build/verifier, runtime, GUI, bridge, database, agent launch, or Git mutation occurred.

## Authentication and agreement

The frozen authored source is `func_001F6098.distinct-half-widths.c`, SHA-256 `D76444B2C4AF7AD44E40DA2F68456E894355AA9F1B6BF4D44F4B792DC10097E1`.

Its complete retained compiler input is 18,208 bytes, SHA-256 `DDD67BBE5FC0CD363CED8B62EB65E12105AB36A55B1CE69029FBD4E5065A4BA6`. The retained policy binds that source and input. No new preprocessing or classification was claimed; current mutable headers were not substituted.

The copied binaries have these SHA-256 identities:

| Binary | SHA-256 |
|---|---|
| Pinned compiler | `F3F1C99A322F5B3D8C108C2A44AF1D6D084DD27575C5D60BF0F0D33FFF34B1C6` |
| Reviewed uninstrumented control | `50B51DCD5EBF9BB8EB1202398BE24DDF30CF64EC6F4C0689910222B3FB96EAB6` |
| Reviewed tracer | `457429BD4F33D7E841961AA1E76F238BB58117B8D0AEB7B1CA14908D2B7113A6` |

The reviewed manifest was authenticated before copying. Only copied executables were invoked, and every output stayed inside the new root. No compiler build occurred.

Pinned, control, and tracer-without-dumps assembly agree byte-for-byte. With `-da`, only the exact option-comment insertion differs. Traces with and without `-da` agree byte-for-byte. Fresh diagnostic assembly and all thirteen retained pass dumps equal the frozen comparable package byte-for-byte. The older native assembly agrees after `.file` metadata is excluded.

These checks passed before trace interpretation. `agreement.json`, `commands.json`, `inputs.json`, and `analysis.json` preserve their exact results. Agreement applies only to this complete input; it does not qualify the tracer as a production compiler.

## Actual frame allocations

Direct candidate observations, using the previously reviewed method. No new reusable-method or game-semantic claim is made.

Five BLK allocations request36/64/8/18/16 bytes. Eight-byte alignment rounds them to40/64/8/24/16, totaling152 local bytes. They correspond to the decoded record, matrix, interpolated output, interpolation input, and blend aggregate.

All23 scalar allocations use `reload-initial`, `from_reg=-1`, SI mode, four-byte inherent/requested size, eight-byte effective alignment, and eight rounded bytes. Big-endian correction is four. The local frame extent grows152→336. A final zero-size alignment call leaves336 unchanged. No later allocator path adds or reuses a home in this run.

The emitted frame is336 local +32 outgoing +40 saved-register bytes =408. The23 scalar homes are listed below. Offsets are hexadecimal bytes relative to the adjusted function stack pointer. Pseudo numbers identify this complete input only.

| Pseudo | Stack home | Directly identified source role / initial RTL evidence |
|---|---|---|
| 76 | BC | Item `index`; zero at UID684, later increment2130 |
| 77 | C4 | `actor = object->actor`; UID17 loads object field40 |
| 78 | CC | `pose = object + 44`; UID31 |
| 79 | D4 | `poseId = object->field4E`; narrowed result UID22 |
| 80 | DC | `firstId`, actor word48; UID25 |
| 81 | E4 | `secondId`, actor word4C; UID28 |
| 82 | EC | `variant`, helper's unsigned-halfword result; UID39 |
| 83 /84 /85 | F4 /FC /104 | Persistent `red` /`green` /`blue`; initial selected-component results393/398/403 |
| 86 | 10C | `factor`; division-by255 result UID58 |
| 87 | 114 | `secondaryOffset`; initial byte conversion433, followed by its actual scale expression |
| 102 | 11C | `top = -decoded.field_08`; UID1021 |
| 103 | 124 | `right = decoded.field_0C + x0`; UID1026 |
| 104 | 12C | Full `flags = decoded.field_14`; UID1029 |
| 105 | 134 | `accumulated = 0`; UID1106, then row updates |
| 106 | 13C | `image`, image-helper result; UID785 |
| 109 /110 | 144 /14C | Narrowed `left` /`leftU`; UIDs1178/1181 |
| 111 /112 | 154 /15C | Narrowed `rightVertex` /`rightU`; UIDs1188/1191 |
| 127 | 164 | `sourceY = -top`; UID1193 |
| 856 | 16C | Real decoded-record address `sp+20`; CSE UID2239, hoisted loop UID2267 |

Every home has at least two emitted direct stack accesses in the complete pinned assembly. No home is supported only by metadata. `analysis.json` retains every access and matching pseudo node across all passes.

The full flags home12C and right-coordinate home124 are current-candidate facts. The older frame report's partial-flags and differently ordered right-coordinate counterparts belong to its different source.

## Vertex branches and texture-row loop

No `COMBINE_USE` event occurs in this compilation. Across all thirteen passes, standalone USE nodes refer only to the stack pointer or return register. None has a memory home. Thus there is no current comparison-only home to attribute to either vertex branch or the texture-row loop.

The following directly identifiable nodes locate the relevant predicates and coordinate lifetimes. Source lines refer to the frozen authored file copied into this package.

| Source location | Initial RTL identity | Observed candidate association |
|---|---|---|
| Line231, `if (!(flags & 2))` | Mask483 at UID1199; branch1201 | Selects the two vertex-call sequences; no scalar home for483 |
| Lines232–240, first vertex branch | `y`484 at1205; `nextY`486 at1248; `bottomY`485 at1257 | Branch-local coordinate units; none receives a stack home |
| Lines242–251, second vertex branch | `y`520 at1324; `nextY`522 at1387; `bottomY`521 at1396 | Separate branch-local units; none receives a stack home |
| Lines289–290, remaining update |119 at2071, then118 at2074 | Actual add-one/subtract-strip update; no scalar home for either unit |
| Line291, `remaining < 2` | Comparison828 at2077; branch2078 | Texture-row termination test; no comparison-only home |
| Line294, `strip >= remaining` | Inverted comparison829 at2087; branch2088 | Next-strip selection; no comparison-only home |

Local-allocation metadata assigns each branch's full-y/next-y/bottom-y units to register17 at their distinct lifetimes. That observation is not a numeric allocation-cause claim. Shared narrowed x/u values109–112 are actual accessed homes used by both vertex branches. Shared top102, flags104, and accumulated105 are also accessed state.

The texture packets use the actual image106, sourceY127, and secondaryOffset87 homes, among the listed shared state. Remaining118, strip116, row122, and full x0125 are absent from the home-event list. Their absence is specific to this input, not evidence that equivalent retail values could not spill.

The older allocation report's two-instruction comparability limitation is not transferred here. This run uses the exact named-update input and reproduces its complete retained pass package.

## Limits and handoff

Retail's measured frame remains456 versus this candidate's408. The older frame account identifies six unaccessed retail lattice positions, but this trace supplies no retail allocation history. It cannot label those positions USE homes, missing variables, deleted spills, branch-local coordinates, or texture-loop constants.

The bounded answer is negative for the suggested current-candidate mechanism: neither vertex branch nor texture-row loop has a compiler-only allocated home. No source recipe, extra storage, comparison change, instrumentation expansion, impossibility claim, or matching verdict is proposed.

All fourteen W8 targets and their single final complete-wave verifier remain required. Applying this reviewed diagnostic adds no ordinary matching review gate. Broader causal or semantic work requires separate routing.

Reproduce from the canonical repository with:

```powershell
node build/combat-draw-6098-allocation-trace-r1/run.js
python build/combat-draw-6098-allocation-trace-r1/analyze.py
```

`run.js` checks frozen identities, copies inputs/binaries, and records four invocations. `analyze.py` checks23 accessed homes, zero comparison-USE events, and exact retained-pass agreement. No failed compiler run or protocol deviation occurred. No canonical-document change is proposed.

`output-manifest.json` binds all final outputs, this report, and the permanent claim. All commands finished. All assigned writes are released at direct collaboration handoff; prior and current terminal records remain frozen afterward.
