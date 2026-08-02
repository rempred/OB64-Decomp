# Wave 5 target selection

## Status and result

Status: completed and review-pending. The selected owner is `func_0026B360`, a
1,156-byte overlay dispatcher that now matches the original linked bytes. This
matters because it adds a larger resource and state control path. No action is
required from Joe during worker intake.

## Mission identity

| Item | Recorded value |
|---|---|
| Assignment | `ob64-decomp-matching-c-high-value-function-wave5-20260802`, revision 1 |
| Worker role | Research and implementation worker |
| Canonical repository | `C:\Users\Joe\Projects\OgreBattlel64\OB64 Decomp` |
| Canonical branch and starting HEAD | `main`, `c81a897f4f6b7b65ddd84d23fa6b3012e45025e8` |
| Parent repository starting HEAD | `db51d5de60fbe67599553565fd97dc3dd5282e3f`; read-only |
| Prompt parent baseline | `9f3b3ce95fc71074a1045785cbd9febdf36eedfe` |
| Integration evidence baseline | `b22815518f060425519c08df19b617af8b5099a7`; read-only |
| Phase 5A product root | `C:\Users\Joe\Projects\OB64-Decomp-Hijs-Integration\docs\external-intake\phase5-boundary-segment-reconciliation-static-20260731` |
| Canonical ROM SHA-256 | `571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` |
| Canonical code-region SHA-256 | `40D4E7875BA50F005788611C63CF9C42D9154339B36793556BF045C25B64B409` |
| Setup report | `build/setup/verify-setup-report.json`; `B0E9FA404B81A92CA0EB23C75A3F1A534964AEB815771EE0D00CA5008F351F8D` |

The prompt parent baseline differs from the observed read-only parent HEAD.
The parent was not modified, so this difference did not change the mission.

## Selection requirements

| Requirement | Result | Evidence |
|---|---|---|
| Exactly one owner | PASS | This record selects only `func_0026B360`. |
| More than 808 z64 ROM bytes | PASS | The owner spans 1,156 bytes. |
| At most 1,280 z64 ROM bytes | PASS | The owner ends after 1,156 bytes. |
| Preferred control path | PASS | The owner dispatches resource records, state flags, allocations, and cleanup. |
| Five meaningful structural features | PASS | It has an indirect table, seven cases, five loops, allocations, frees, and 17 direct calls. |
| Proven boundary | PASS | The owner ends at `jr $ra` plus its delay slot before `func_0026B7E4`. |
| Proven overlay placement | PASS | Row `4834` and descriptor `12` identify one linked overlay slice. |
| Exact relocations | PASS | The manifest records 30 relocations for the C object. |
| Earlier owners preserved | PASS | The Phase 8 preservation report keeps all five earlier owners exact. |

## Selected owner and boundaries

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `func_0026B360` | Selector-indexed resource and state dispatcher | `0x0026B360..0x0026B7E4` | z64 ROM range, end exclusive | Selected owner and exact byte slice |
| `func_0026B360` | Relocated owner placement | `0x802167B0..0x80216C34` | overlay runtime virtual range, end exclusive | Linked section `.ob64.r4834` |
| `func_0026B32C` | Predecessor function | `0x0026B32C..0x0026B360` | z64 ROM range | Boundary predecessor, 52 bytes |
| `func_0026B7E4` | Successor function | `0x0026B7E4..0x0026B820` | z64 ROM range | Boundary successor, 60 bytes |
| `g_func_0026B360_dispatch_table` | Seven-entry case pointer table | `0x80220C20` | overlay runtime virtual address | Indirect dispatch source |
| `g_func_0026B360_count` | Allocation count input | `0x8022103C` | overlay runtime virtual address | Selector-zero allocation source |
| `g_func_0026B360_value_38` | Selector-zero helper value | `0x80221038` | overlay runtime virtual address | Selector-zero helper argument |

The final return instruction is at z64 ROM address `0x0026B7DC`. Its stack
restore delay slot is at `0x0026B7E0`. The exclusive end is therefore
`0x0026B7E4`.

Overlay descriptor `12` maps the target through the validated overlay mapping.
Its raw descriptor SHA-256 is
`998FF913EC9C6AC3D5BDD3C3C24F78D0225D8C70D3F64AF0CC100CCAAA3BFBAA`.
The target row is `4834`, section `.ob64.r4834`, chunk `038`, and primary ID
`primary:8665aebe04f0e5851dd9`.

The custom boundary scan found 37 internal branch or jump targets. It found 17
direct external call targets. These observations establish one executable
owner and no unbounded secondary entry.

## Dispatch structure

The selector is masked to 16 bits. Values below seven index the relocated
dispatch table. The table rows resolve to these case starts:

| Selector | Case label | Target | Address space | Owner-relative offset |
|---:|---|---:|---|---:|
| `0` | `func_0026B360_case_0` | `0x0026B450` | z64 ROM address | `0x0F0` |
| `1` | `func_0026B360_case_1` | `0x0026B3B0` | z64 ROM address | `0x050` |
| `2` | `func_0026B360_case_2` | `0x0026B3E8` | z64 ROM address | `0x088` |
| `3` | `func_0026B360_case_3` | `0x0026B578` | z64 ROM address | `0x218` |
| `4` | `func_0026B360_case_4` | `0x0026B758` | z64 ROM address | `0x3F8` |
| `5` | `func_0026B360_case_5` | `0x0026B4F4` | z64 ROM address | `0x194` |
| `6` | `func_0026B360_case_6` | `0x0026B43C` | z64 ROM address | `0x0DC` |

The corresponding table pointer values are in the overlay runtime address
space. They are `0x802168A0`, `0x80216800`, `0x80216838`, `0x802169C8`,
`0x80216BA8`, `0x80216944`, and `0x8021688C` for selectors zero through six.

## Structural value

Direct assembly shows these features:

1. A 0x80-byte stack frame preserves five saved registers and `ra`.
2. A masked selector performs an indirect seven-entry dispatch.
3. Selector zero allocates three arrays from a relocated count.
4. Selector two frees all three arrays after a record loop.
5. Selector three contains five bounded record loops.
6. Records use 0x18-byte strides, flags use halfword indexing, and base entries use 0x40-byte strides.
7. The owner links 17 direct external call targets and three relocated globals.
8. Selector four checks a record halfword before calling a helper.

These are structural observations. They do not prove gameplay meanings for the
selector, state fields, records, or helper functions.

## Rejected candidates

The candidate scan covered executable owners larger than 808 and no larger than
1,280 bytes. These candidates were rejected before the final selection:

| Candidate | Size | Rejection reason |
|---|---:|---|
| `func_000022B0` | 1,256 | Its unaligned load and store pattern created a higher matching-risk slice. |
| `func_0026CE74` | 1,248 | Its floating-point-heavy body offered weaker integer control-path leverage. |
| `func_0026A6E4` | 1,252 | Its callback and floating-point mix created a less bounded derivation. |
| `func_00259480` | 1,156 | Its floating-point message path had weaker resource and state value. |

The selected owner has a bounded integer data model. Its table, arrays, loops,
allocations, cleanup, and direct calls provide stronger matching leverage.

## Selection evidence inputs

| Input | SHA-256 | Evidence role |
|---|---|---|
| `asm/original/rev0/lib/func_0026B360.s` | `2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73` | Original byte source |
| `asm/original/rev0/lib/func_0026B32C.s` | `8C5C56C204A9DF8C2149E954AAAFA32C1A02D041F0201850D92904A6C741D6B9` | Boundary predecessor |
| `asm/original/rev0/lib/func_0026B7E4.s` | `C8A4BD63107F978B7C3C96C7FC2EC1A8C04B4C22ADB608E13BF56CA5DF1BE039` | Boundary successor |
| `config/overlays/us_rev0.json` | `D4F1FB177822334EB748D6D62B342FB813D8825FEDD912057CF651EB616A5FB6` | Overlay mapping |
| `config/splat/us_rev0.semantic.json` | `1BC788145E625600756004CF53673A322616C4FEBFC5102788ACDEFA0F050574` | Semantic linker input |
| Context JSON | `49619787B75DDF3A179274D3332783144A4B2F6D7A701CF8F54DF23331B7E256` | Independent target context |
| Context Markdown | `65734665FB555A9E73B7CAC455BD3B7FAE8186170E8261AED9DBB6AF104D9D39` | Human-readable context |

## Claim record

### Claim

`func_0026B360` is an eligible and independently bounded Wave 5 target.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and limits

This record covers static target selection and byte-oriented placement. It does
not establish gameplay semantics or accept the worker result.

### Falsifier

An accepted boundary correction, relocation mismatch, or linked-byte mismatch
would invalidate this selection.

### Product consequence

The owner is suitable for one fresh Critical review slice. No editor change is
authorized by this worker result.
