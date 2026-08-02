# Wave 5 independent derivation

## Status and result

Status: completed and review-pending. The C owner derives `func_0026B360` from
the canonical assembly, table placement, and linked relocation evidence. This
matters because the result remains independently reproducible. No action is
required from Joe; independent Critical review remains pending.

## Scope and identities

| Artifact | Identity | Evidence role |
|---|---|---|
| Original assembly | `asm/original/rev0/lib/func_0026B360.s` | Direct instruction evidence |
| Original assembly SHA-256 | `2DE06BCC819A1176A23E31A6F1FB7C7267702F99F3A7D52EB4757BCEF609AC73` | Source identity |
| C source | `src/overlays/descriptor_12/func_0026B360.c` | Derived implementation |
| C source SHA-256 | `A83A9A2FB003C77D861ECDA7897D0E28A93D5DCB9093E16291E35A6CD27F8DB8` | Candidate identity |
| Accepted owner row | `4834`, `.ob64.r4834`, chunk `038` | Placement identity |
| Overlay descriptor | `12` | Relocation class |
| Raw object text SHA-256 | `09E0856A4F0881FE2D495FA4A2C291A889DB3BFCB784FC7D7623B8AE639F1249` | Unlinked C object identity |
| Linked target text SHA-256 | `5342CBA0C83FCFE9E4825BEF64B50DDFFAAF359ABF9D470CDE1E7D517825DBFC` | Exact linked-byte result |

The source uses structural names. It does not claim gameplay meanings for the
selector, state fields, records, globals, or helper functions.

## Accepted evidence sources

| Source | Evidence supplied |
|---|---|
| `asm/original/rev0/lib/func_0026B360.s` | Instructions, calls, branches, and function extent |
| `asm/original/rev0/lib/func_0026B32C.s` | Predecessor boundary |
| `asm/original/rev0/lib/func_0026B7E4.s` | Successor boundary |
| `config/phase8/matching-c.json` | Source hash, placement, aliases, and relocations |
| `config/overlays/us_rev0.json` | Descriptor 12 placement |
| `config/splat/us_rev0.semantic.json` | Accepted overlay linker inputs |
| `build/context/rev0-function-context-0026B360-0026B7E4.json` | Boundary and caller context |
| `build/setup/verify-setup-report.json` | Canonical setup and ROM identity |

No external-derived implementation supplied source expressions, names, or
control flow. The C source was written from the listed canonical evidence.

## Entry, frame, and dispatch

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x000..0x04C` | The function creates a `0x80`-byte frame and saves `s0` through `s5` and `ra`. | `frame_pad` preserves the accepted frame under KMC. |
| `0x008..0x018` | Argument one becomes the state base. The data subobject begins at offset `0x1C`. | `state = state_arg`; `data = &state->data`. |
| `0x01C..0x024` | The selector is masked with `0xFFFF`. Values below seven continue. | `selector = selector_arg & 0xFFFF`; then `selector < 7`. |
| `0x02C..0x044` | The code loads a table at runtime address `0x80220C20` and jumps through the selected entry. | `g_func_0026B360_dispatch_table[selector]` and computed `goto`. |
| `0x045C..0x0480` | The result register is zero unless selector six assigns a value. Saved registers are restored before return. | `result = 0`; `return result`. |

The frame local and inline anchors preserve compiler placement. They do not
represent a gameplay object or a persistent state field.

## Structural field layout

| Semantic field | Offset | Address space | Direct evidence |
|---|---:|---|---|
| `state->flags_08` | `0x08` | state structure field | Halfword store in selector five and case dispatch context |
| `state->flags_0A` | `0x0A` | state structure field | Halfword load in selector-three fourth loop |
| `state->argument_0C` | `0x0C` | state structure field | Helper argument in selector-three fourth loop |
| `state->argument_10` | `0x10` | state structure field | Helper argument in selectors three and four |
| `state->data` | `0x1C` | state structure field | `addiu s1,s4,0x1C` in entry sequence |
| `data->base_00` | `0x00` | data structure field | Base allocation and selector-two cleanup |
| `data->count_04` | `0x04` | data structure field | Loop bounds and allocation count |
| `data->flags_08` | `0x08` | data structure field | Halfword flag tests and updates |
| `data->records_0C` | `0x0C` | data structure field | Record base and record-stride loops |

The fields are structural. Their names describe observed offsets and use.

## Selector one, two, and six

| Selector | Owner-relative evidence | Direct observation | C derivation |
|---:|---|---|---|
| `1` | `0x050..0x080` | Tests `data->count_04`, walks records by `0x18`, and calls `func_00268798`. | Call `func_00268798(data->records_0C + offset)`. |
| `2` | `0x088..0x0E8` | Walks records, calls `func_00268800`, then frees base, flags, and records. | Call the helper for each record, then call `func_000016C4` three times. |
| `6` | `0x0DC..0x0EC` | Loads the word at record-base offset `0x4` and dereferences it once. | `result = **(u32 **)(data->records_0C + 4)`. |

The free order follows the direct call order. It remains a structural derivation
and does not claim allocator ownership beyond the observed calls.

## Selector zero allocation and initialization

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x0F0..0x104` | Loads the relocated count, shifts it by six, and calls the allocator. | `data->count_04 = g_func_0026B360_count`; allocate `count << 6`. |
| `0x108..0x118` | Allocates a halfword flag array using count shifted by one. | Allocate `data->count_04 << 1` bytes. |
| `0x11C..0x130` | Allocates record storage using count multiplied by three and shifted by three. | Allocate `(data->count_04 * 3) << 3` bytes. |
| `0x138..0x17C` | Initializes each record, sets its flag to one, and calls the base helper. | Call `func_00268678`, store one, then call `func_00028C40`. |
| `0x138..0x184` | Record offsets advance by `0x18`. Base offsets advance by `0x40`. | Use `offset += 0x18`; use `index << 6` for base entries. |

The source preserves the count as a nonvolatile field. This preserves the
observed allocation sequence and the later loop loads.

## Selector five flag transition

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x194..0x1B8` | Tests flag bit `0x1` and excludes flag bit `0x8000`. | Continue only when `(flags & 1) != 0` and `(flags & 0x8000) == 0`. |
| `0x1BC..0x1F0` | Loads entry words, calls `func_00268358`, then sets flag bit `0x8000`. | Call with `entry[1]` and `record[3]`; then OR `0x8000`. |
| `0x1F4..0x210` | Clears bit `0x4` in `state->flags_08`. | `state->flags_08 &= (u16)~4`. |

## Selector three propagation loops

Selector three contains five bounded loops. Each loop reloads the same count
and advances records by `0x18`.

| Loop | Owner-relative call | Direct arguments | C derivation |
|---:|---|---|---|
| `1` | `0x254` | `state->argument_10`, `record[1]`, `record[2]` | `func_00267FD0(state->argument_10, (u32 *)record[1], (void *)record[2])` |
| `2` | `0x2B4` | `data->base_00 + (index << 6)`, `record[1]`, `record[2]` | `func_002682A4((u8 *)base + base_offset, (u32 *)record[1], (void *)record[2])` |
| `3` | `0x310` | `entry[1]`, `record[2]`, `record[3]` | `func_00268400(entry[1], (void *)record[2], (void *)record[3])` |
| `4` | `0x37C` | `entry[1]`, `record[3]`, `state->argument_0C` | Call `func_002677D0` only when state bit `0x1000` is set. |
| `5` | `0x3D4` | `state->argument_10`, `record[1]`, `record[2]` | `func_0026A078(state->argument_10, (u32 *)record[1], (void *)record[2])` |

The source uses local labels around the count reloads. These labels preserve
the original branch destinations without changing the C loop conditions.

## Selector four record check

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x3F8..0x428` | Tests flag bit `0x1` and reads a record halfword at offset `0x10`. | Continue when the flag is set and `*(u16 *)((u8 *)record + 0x10) != 0`. |
| `0x42C..0x448` | Loads entry words and calls `func_00268F64`. | Call with `state->argument_10`, `record[1]`, and `record[3]`. |
| `0x448..0x45C` | Increments index and advances by `0x18`. | Use the same bounded record loop shape. |

## Relocated globals and linked calls

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `g_func_0026B360_dispatch_table` | Selector dispatch table | `0x80220C20` | overlay runtime virtual address | HI16 and LO16 relocations at owner offsets `0x3C` and `0x44` |
| `g_func_0026B360_value_38` | Selector-zero helper value | `0x80221038` | overlay runtime virtual address | HI16 and LO16 relocations at `0x148` and `0x14C` |
| `g_func_0026B360_count` | Selector-zero allocation count | `0x8022103C` | overlay runtime virtual address | HI16 and LO16 relocations at `0xF0` and `0xF4` |
| `func_00001330` | Allocation helper | `0x80070F30` | boot runtime virtual address | Three `R_MIPS_26` call relocations |
| `func_000016C4` | Cleanup helper | `0x800712C4` | boot runtime virtual address | Three `R_MIPS_26` call relocations |
| `func_00028C40` | Selector-zero base helper | `0x80098840` | boot runtime virtual address | `R_MIPS_26` at owner offset `0x170` |
| `func_00268798` | Selector-one helper | `0x80213BE8` | overlay runtime virtual address | `R_MIPS_26` at `0x64` |
| `func_00268800` | Selector-two helper | `0x80213C50` | overlay runtime virtual address | `R_MIPS_26` at `0x9C` |
| `func_00268678` | Selector-zero record helper | `0x80213AC8` | overlay runtime virtual address | `R_MIPS_26` at `0x150` |
| `func_00268358` | Selector-five helper | `0x802137A8` | overlay runtime virtual address | `R_MIPS_26` at `0x1D8` |
| `func_00267FD0` | Selector-three loop-one helper | `0x80213420` | overlay runtime virtual address | `R_MIPS_26` at `0x254` |
| `func_002682A4` | Selector-three loop-two helper | `0x802136F4` | overlay runtime virtual address | `R_MIPS_26` at `0x2B4` |
| `func_00268400` | Selector-three loop-three helper | `0x80213850` | overlay runtime virtual address | `R_MIPS_26` at `0x310` |
| `func_002677D0` | Selector-three loop-four helper | `0x80212C20` | overlay runtime virtual address | `R_MIPS_26` at `0x37C` |
| `func_0026A078` | Selector-three loop-five helper | `0x802154C8` | overlay runtime virtual address | `R_MIPS_26` at `0x3D4` |
| `func_00268F64` | Selector-four helper | `0x802143B4` | overlay runtime virtual address | `R_MIPS_26` at `0x440` |

The source does not apply the early-boot linear mapping to overlay symbols.
Every runtime address above uses the accepted descriptor-12 placement.

## Relocation derivation

The assembled object contains 29 `.rel.text` entries and one `.rel.pdr` entry.
The complete contract is recorded in `config/phase8/matching-c.json`.

| Relocation group | Owner-relative offsets | Evidence role |
|---|---|---|
| Dispatch table HI16 and LO16 | `0x3C`, `0x44` | Relocated table base |
| Selector-one and selector-two calls | `0x64`, `0x9C` | Direct helper calls |
| Selector-two cleanup calls | `0xBC`, `0xC4`, `0xCC` | Three frees |
| Local text jumps | `0x80`, `0xD4`, `0xE8`, `0x18C`, `0x210`, `0x3F0` | Same-owner control flow |
| Allocation count HI16 and LO16 | `0xF0`, `0xF4` | Relocated count |
| Allocation calls | `0xFC`, `0x10C`, `0x124` | Three allocations |
| Selector-zero value HI16 and LO16 | `0x148`, `0x14C` | Relocated helper value |
| Remaining direct calls | `0x150`, `0x170`, `0x1D8`, `0x254`, `0x2B4`, `0x310`, `0x37C`, `0x3D4`, `0x440` | Helper call sites |
| Procedure descriptor | `0x00000000` | `func_0026B360` in `.rel.pdr` |

The linked target resolves every recorded relocation and matches the original
target slice. The raw object differs at relocation words before linking.

## Compiler anchors

The source contains a small macro for the assembler's `move` spelling. It emits
the target `addu` encoding under the accepted assembler. The source also uses
register declarations and local labels for exact frame, call, and branch shape.
These anchors preserve observed bytes. They do not introduce new behavior.

## Claim record

### Claim

The C owner independently derives the target's observed control flow, field
offsets, calls, relocation aliases, and linked placement.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and limits

This derivation covers static byte matching. It does not establish gameplay
semantics, runtime correctness outside the canonical linked slice, or acceptance.

### Falsifier

An independent source audit, relocation mismatch, or linked-byte mismatch would
invalidate the derivation.
