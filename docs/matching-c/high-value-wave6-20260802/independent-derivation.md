# Wave 6 independent derivation

## Status and result

Status: completed and review-pending. The C owner derives `func_0026B820` from
canonical assembly, overlay placement, and relocation evidence. This matters
because the result reproduces exact linked bytes in two fresh builds. No action
is required from Joe; independent Critical review remains pending.

## Scope and identities

| Artifact | Identity | Evidence role |
|---|---|---|
| Original assembly | `asm/original/rev0/lib/func_0026B820.s` | Direct instruction evidence |
| Original assembly SHA-256 | `C43334DEC069D6760B6A2D24E40FDB3C7F3518D63224BA8A021EEB9F8A84997D` | Source identity |
| C source | `src/overlays/descriptor_12/func_0026B820.c` | Derived implementation |
| C source SHA-256 | `12D34159C5CA16BE3AB3FEA6E0CF3380B4CC217B0BFBB65D175F04F4535ED900` | Candidate identity |
| Accepted owner row | `4836`, `.ob64.r4836`, chunk `038` | Placement identity |
| Overlay descriptor | `12` | Relocation class |
| Canonical linked section | `0x80216C70..0x8021711C` | Overlay link virtual range |
| Raw C object text SHA-256 | `C48C33CA6FBF76AFEEF6A19B3CF3709D83045EA82BEE78D4E23B6BA4F9FB814D` | Unlinked C object identity |
| Linked target text SHA-256 | `A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A` | Exact linked-byte result |

The source uses structural names. It does not claim gameplay meanings for the
selector, state fields, records, globals, or helper functions.

## Accepted evidence sources

| Source | Evidence supplied |
|---|---|
| `asm/original/rev0/lib/func_0026B820.s` | Instructions, calls, branches, and function extent |
| `asm/original/rev0/lib/func_0026B7E4.s` | Predecessor boundary |
| `asm/original/rev0/lib/func_0026BCCC.s` | Successor boundary |
| `config/phase8/matching-c.json` | Source identity, placement, aliases, and relocations |
| `config/overlays/us_rev0.json` | Descriptor 12 identity and overlay ranges |
| `config/splat/us_rev0.semantic.json` | Accepted section and linker inputs |
| `build/chunk_00261000-00271000_plan_base.json` | Function size, frame, and jump-table hazard |
| `build/setup/verify-setup-report.json` | Canonical setup, code, and ROM identities |

No external-derived implementation supplied source expressions, names, or
control flow. The C source was written from the listed canonical evidence.

## Entry, frame, and dispatch

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x000..0x034` | The function creates a `0xD0`-byte frame and saves `s0` through `s5`, `ra`, `f20`, and `f22`. | `frame_pad`, saved-register declarations, and floating-point registers preserve the accepted frame. |
| `0x018..0x03C` | The selector is masked with `0xFFFF`, then compared with seven. | `selector = selector_arg & 0xFFFF`; then `selector < 7`. |
| `0x044..0x050` | The code loads a table at runtime address `0x80220C40` and jumps through the selected entry. | `g_func_0026B820_dispatch_table[selector]` and computed `goto`. |
| `0x47C..0x4A8` | The result is moved to `v0`, saved registers restore, and the function returns. | `result` remains zero unless selector six assigns it. |

The source anchors seven case labels before the computed jump. These anchors
preserve the table's internal destinations without introducing secondary entry
points.

## Structural field layout

| Semantic field | Offset | Address space | Direct evidence |
|---|---:|---|---|
| `state->flags_08` | `0x08` | state structure field | Halfword clear after selector five |
| `state->argument_0C` | `0x0C` | state structure field | State field reserved for the owner model |
| `state->argument_10` | `0x10` | state structure field | Helper arguments in selectors three and four |
| `state->data` | `0x1C` | state structure field | `addiu s1,s4,0x1C` in the entry sequence |
| `data->base_00` | `0x00` | data structure field | Allocation, initialization, and cleanup |
| `data->count_04` | `0x04` | data structure field | Allocation count and loop bound |
| `data->flags_08` | `0x08` | data structure field | Halfword flag tests and updates |
| `data->records_0C` | `0x0C` | data structure field | Record base and `0x18`-byte strides |

The fields are structural. Their names describe observed offsets and use.

## Selector one, two, and six

| Selector | Owner-relative evidence | Direct observation | C derivation |
|---:|---|---|---|
| `1` | `0x058..0x08C` | Tests the count, walks records by `0x18`, and calls `func_00268798`. | Call the helper for each record. |
| `2` | `0x090..0x0E0` | Walks records, calls `func_00268800`, then frees base, flags, and records. | Call the helper, then call `func_000016C4` three times. |
| `6` | `0x0E4..0x0F4` | Loads a record pointer and returns the word reached through offset `0x04`. | `result = **(u32 **)(data->records_0C + 4)`. |

The free order follows the direct call order. It remains a structural
derivation and does not claim allocator ownership beyond observed calls.

## Selector zero allocation and initialization

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x0F8..0x10C` | Loads the relocated count, multiplies it by three, and shifts by three. | Allocate the base array using `(count * 3) << 3`. |
| `0x110..0x124` | Allocates a halfword flag array using count shifted by one. | Allocate `count << 1` bytes. |
| `0x128..0x140` | Allocates record storage using count multiplied by three and shifted by three. | Allocate `(count * 3) << 3` bytes. |
| `0x140..0x1B8` | Initializes each record, sets its flag to one, and writes six floating-point values. | Use `0x18` record strides, one flag, zero values, and one values. |
| `0x164..0x16C` | Loads the relocated value at `0x80221038` before the record helper call. | Pass `g_func_0026B820_value_38` to `func_00268678`. |

The source preserves the count in the data structure. This preserves the
observed allocation sequence and later loop loads.

## Selector five flag transition

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x1C0..0x1F0` | Tests flag bit `0x1` and excludes flag bit `0x8000`. | Continue only when bit `0x1` is set and bit `0x8000` is clear. |
| `0x204..0x210` | Loads entry words and calls `func_00268358`. | Pass the entry word and record value observed at the call site. |
| `0x214..0x220` | Sets flag bit `0x8000`. | OR `0x8000` into the selected flag. |
| `0x224..0x240` | Clears bit `0x4` in the state flags. | `state->flags_08 &= (u16)~4`. |

## Selector three propagation loops

Selector three contains four bounded loops. Each loop reloads the count and
advances records by `0x18`.

| Loop | Count-check offset | Direct helper | C derivation |
|---:|---:|---|---|
| `1` | `0x248` | `func_00267FD0` at `0x280` | Pass `state->argument_10`, record word one, and record word two. |
| `2` | `0x2A0` | `func_00028F60` at `0x2DC`, then `func_002136F4` at `0x2F4` | Build the scratch record and pass its two extracted words. |
| `3` | `0x314` | `func_0026A510` at `0x374` | Pass base floats, base word two, and the selected entry word. |
| `4` | `0x394` | `func_0026A630` at `0x3F4` | Pass the same structural fields to the second floating-point helper. |

The source uses compiler anchors for scratch arguments and floating-point
stores. These anchors preserve register and stack placement without changing
the observed data strides or call order.

## Selector four record check

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x410..0x440` | Tests flag bit `0x1` and reads a record halfword at offset `0x10`. | Continue only when the flag is set and that halfword is nonzero. |
| `0x448..0x460` | Loads state and record values before calling `func_00268F64`. | Pass `state->argument_10`, record word one, and record word three. |
| `0x464..0x478` | Increments the index and advances by `0x18`. | Use the same bounded record-loop shape. |

## Relocated globals and linked calls

| Semantic name | Game meaning | Address | Address space | Evidence role |
|---|---|---|---|---|
| `g_func_0026B820_dispatch_table` | Selector dispatch table | `0x80220C40` | overlay runtime virtual address | HI16 and LO16 relocations at `0x44` and `0x4C` |
| `g_func_0026B820_value_38` | Selector-zero helper value | `0x80221038` | overlay runtime virtual address | HI16 and LO16 relocations at `0x164` and `0x168` |
| `g_func_0026B820_count` | Selector-zero allocation count | `0x8022103C` | overlay runtime virtual address | HI16 and LO16 relocations at `0xF8` and `0xFC` |
| `func_00001330` | Allocation helper | `0x80070F30` | boot runtime virtual address | Three `R_MIPS_26` calls |
| `func_000016C4` | Cleanup helper | `0x800712C4` | boot runtime virtual address | Three `R_MIPS_26` calls |
| `func_00268798` | Selector-one helper | `0x80213BE8` | overlay runtime virtual address | `R_MIPS_26` at `0x6C` |
| `func_00268800` | Selector-two helper | `0x80213C50` | overlay runtime virtual address | `R_MIPS_26` at `0xA4` |
| `func_00268678` | Selector-zero record helper | `0x80213AC8` | overlay runtime virtual address | `R_MIPS_26` at `0x16C` |
| `func_00268358` | Selector-five helper | `0x802137A8` | overlay runtime virtual address | `R_MIPS_26` at `0x204` |
| `func_00267FD0` | Selector-three loop-one helper | `0x80213420` | overlay runtime virtual address | `R_MIPS_26` at `0x280` |
| `func_00028F60` | Selector-three scratch helper | `0x80098B60` | boot runtime virtual address | `R_MIPS_26` at `0x2DC` |
| `func_002136F4` | Selector-three scratch consumer | `0x802136F4` | overlay runtime virtual address | `R_MIPS_26` at `0x2F4` |
| `func_0026A510` | Selector-three floating-point helper | `0x80215960` | overlay runtime virtual address | `R_MIPS_26` at `0x374` |
| `func_0026A630` | Selector-three floating-point helper | `0x80215A80` | overlay runtime virtual address | `R_MIPS_26` at `0x3F4` |
| `func_00268F64` | Selector-four helper | `0x802143B4` | overlay runtime virtual address | `R_MIPS_26` at `0x460` |

The source does not apply the early-boot linear mapping to overlay symbols.
Every overlay runtime address uses the accepted descriptor-12 placement.

## Relocation derivation

The assembled object contains 29 `.rel.text` entries and one `.rel.pdr` entry.
The complete contract is recorded in `config/phase8/matching-c.json`.

| Relocation group | Owner-relative offsets | Evidence role |
|---|---|---|
| Dispatch table HI16 and LO16 | `0x44`, `0x4C` | Relocated table base |
| Selector-one and selector-two calls | `0x6C`, `0xA4` | Direct helper calls |
| Selector-two cleanup calls | `0xC4`, `0xCC`, `0xD4` | Three frees |
| Same-owner control-flow calls | `0x88`, `0xDC`, `0xF0`, `0x1B8`, `0x23C`, `0x410` | Internal jumps resolved by the owner section |
| Allocation count HI16 and LO16 | `0xF8`, `0xFC` | Relocated count |
| Allocation calls | `0x10C`, `0x11C`, `0x134` | Boot allocator |
| Selector-zero value HI16 and LO16 | `0x164`, `0x168` | Relocated helper value |
| Propagation and record calls | `0x16C`, `0x204`, `0x280`, `0x2DC`, `0x2F4`, `0x374`, `0x3F4`, `0x460` | Direct helper links |
| Function descriptor | `.rel.pdr` offset `0x00` | Owner symbol identity |

The linked target text SHA-256 is
`A88503EABEC9D4127CFBD75972F3F0465DC1A58B904DBDDE3B54BCFBA16B4E1A`.
The raw C object text SHA-256 is
`C48C33CA6FBF76AFEEF6A19B3CF3709D83045EA82BEE78D4E23B6BA4F9FB814D`.

## Claim and review state

### Claim

The C source independently derives the selected owner and reproduces its exact
linked bytes under the accepted compiler and relocation contract.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and limits

This derivation covers structural code behavior and byte reproduction. It does
not establish gameplay semantics, runtime safety, or independent acceptance.

### Falsifier

A source identity drift, relocation mismatch, linked-byte mismatch, or failed
fresh reproducibility build would falsify this derivation.
