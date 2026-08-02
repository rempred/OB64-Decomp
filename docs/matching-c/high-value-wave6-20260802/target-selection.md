# Wave 6 target selection

## Status and result

Status: completed and review-pending. The selected owner is `func_0026B820`, a
1,196-byte descriptor-backed resource and state dispatcher. This matters because
it adds a larger control path while preserving the canonical ROM. No action is
required from Joe during worker intake.

## Mission identity

| Item | Recorded value |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave6-20260802`, revision 1 |
| Worker role | Research and implementation worker |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and starting HEAD | `main`, `3b8b950d654848d5178c3f8bcdbbc00ca493accf` |
| Parent repository starting HEAD | `a77c56c125d284ad71b8511b5642da1ae649725a`; read-only |
| Prompt parent baseline | `e595013a15663a114b1d8692badea3738652b3bf` |
| Integration repository starting HEAD | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Setup report | `build/setup/verify-setup-report.json`; `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

The observed parent HEAD differs from the prompt baseline. The parent remained
read-only, so this difference did not change the mission.

## Selection requirements

| Requirement | Result | Evidence |
|---|---|---|
| Exactly one owner | PASS | This record selects only `func_0026B820`. |
| More than 1,156 z64 ROM bytes | PASS | The owner spans 1,196 bytes. |
| At most 1,600 z64 ROM bytes | PASS | The owner ends after 1,196 bytes. |
| Preferred control path | PASS | The owner dispatches records, state flags, allocations, and helper calls. |
| Six meaningful structural features | PASS | It has indirect dispatch, seven cases, three allocations, cleanup, four propagation loops, flag transitions, and two floating-point update loops. |
| Proven boundary | PASS | The owner ends after `jr $ra` and its delay slot before `func_0026BCCC`. |
| Proven overlay placement | PASS | Row `4836` and descriptor `12` identify one linked overlay slice. |
| Proven secondary-entry status | PASS | The accepted function model lists no secondary entries. |
| Exact relocations | PASS | The C object contains 29 `.rel.text` entries and one `.rel.pdr` entry. |
| Earlier owners preserved | PASS | Both fresh Phase 8 builds retain the six earlier owners byte-exact. |

## Selected owner and boundaries

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_0026B820` | Selector-indexed resource and state dispatcher | `0x0026B820..0x0026BCCC` | z64 ROM range, end exclusive | Selected owner and exact byte slice |
| `func_0026B820` | Relocated owner placement | `0x80216C70..0x8021711C` | overlay link virtual range, end exclusive | Linked section `.ob64.r4836` |
| `func_0026B7E4` | Predecessor function | `0x0026B7E4..0x0026B820` | z64 ROM range | Boundary predecessor |
| `func_0026BCCC` | Successor function | `0x0026BCCC..` | z64 ROM range | Boundary successor |
| `g_func_0026B820_dispatch_table` | Seven-entry case pointer table | `0x80220C40` | overlay runtime virtual address | Indirect dispatch source |
| `g_func_0026B820_value_38` | Selector-zero helper value | `0x80221038` | overlay runtime virtual address | Initialization helper argument |
| `g_func_0026B820_count` | Selector-zero allocation count | `0x8022103C` | overlay runtime virtual address | Allocation and loop bound |

The final return instruction is at z64 ROM address `0x0026BCC4`. Its restore
delay slot is at `0x0026BCC8`. The exclusive end is therefore `0x0026BCCC`.

The original split comments annotate another relocated execution address,
`0x802DB420`. The accepted Phase 5/7 link model places this slice at
`0x80216C70`. The evidence uses the validated link placement, not a guessed
ROM-to-RAM subtraction.

Overlay descriptor `12` identifies the target's relocation class. Its raw
descriptor SHA-256 is
`998FF913EC9C6AC3D5BDD3C3C24F78D0225D8C70D3F64AF0CC100CCAAA3BFBAA`.
The target row is `4836`, section `.ob64.r4836`, chunk `038`, and primary ID
`primary:3c25abac34d57e6d87f8`.

The custom boundary plan records no secondary entry. The successor begins
immediately after the target's return delay slot. The frame is `0xD0` bytes.

## Structural value

Direct assembly shows these features:

1. A `0xD0`-byte stack frame preserves five saved registers, two floating-point registers, and `ra`.
2. A masked selector performs an indirect seven-entry dispatch.
3. Selector zero loads a relocated count and allocates three arrays.
4. Selector zero initializes records, flags, and floating-point base entries.
5. Selector two walks records and frees three arrays.
6. Selector five tests flags, calls a helper, sets a high flag, and clears a state bit.
7. Selector three contains four bounded record propagation loops.
8. Selector four tests a flag and record halfword before calling a helper.
9. The owner links 15 named external symbols and four same-owner control-flow relocations.

These are structural observations. They do not prove gameplay meanings for the
selector, state fields, records, globals, or helper functions.

## Rejected candidate

The first candidate was `func_00213E30`, a 1,172-byte combat character-state
owner. Its ROM-only canonical placement could not resolve runtime `R_MIPS_26`
calls without changing the target bytes. The worker added no source or config
row for that candidate.

The replacement target is descriptor-backed and uses the validated overlay
link placement. It satisfies the same size gate and has no secondary entry.

## Selection evidence inputs

| Input | SHA-256 | Evidence role |
|---|---|---|
| `asm/original/rev0/lib/func_0026B820.s` | `C43334DEC069D6760B6A2D24E40FDB3C7F3518D63224BA8A021EEB9F8A84997D` | Original instruction and boundary evidence |
| `asm/original/rev0/lib/func_0026B7E4.s` | recorded in canonical assembly manifest | Boundary predecessor |
| `asm/original/rev0/lib/func_0026BCCC.s` | recorded in canonical assembly manifest | Boundary successor |
| `config/overlays/us_rev0.json` | `D4F1FB177822334EB748D6D62B342BF813D8825FEDD912057CF651EB616A5FB6` | Descriptor placement and identity |
| `config/splat/us_rev0.semantic.json` | accepted Phase 5/7 input | Section and link-slice identity |
| `build/chunk_00261000-00271000_plan_base.json` | accepted canonical build input | Function extent and jump-table hazard |
| `build/setup/verify-setup-report.json` | `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` | Canonical setup and ROM identity |

## Claim record

### Claim

`func_0026B820` is an eligible and independently bounded Wave 6 target.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and limits

This record covers static target selection, boundary proof, and byte-oriented
placement. It does not establish gameplay semantics or accept the worker result.

### Falsifier

An accepted boundary correction, relocation mismatch, or linked-byte mismatch
would invalidate this selection.

### Product consequence

The owner is suitable for one fresh Critical review slice. No editor change is
authorized by this worker result.
