# Independent derivation record

Status: completed and review-pending. This record maps every material behavior
and constant in `func_00269470` to accepted Rev 0 assembly evidence. It matters
because the matching C source must remain independently derived. No action is
required from Joe; Critical independent review remains pending.

## Scope and identities

Original assignment: `ob64-decomp-matching-c-high-value-function-wave4-20260802`, revision 1.

The target is `func_00269470`. Its z64 ROM range is
`0x00269470..0x00269798`, end exclusive. Its size is 808 bytes.

| Artifact | Identity | Evidence role |
|---|---|---|
| Original assembly | `asm/original/rev0/lib/func_00269470.s` | Direct instruction evidence |
| Original assembly SHA-256 | `8A11B4BE872A6ABABA1F9EE8FF5C3108CBD81B18C45A21653D3FBE49BAA2B7EB` | Source identity |
| C source | `src/overlays/descriptor_12/func_00269470.c` | Derived implementation |
| C source SHA-256 | `366C3F0D312711E71DB34900B7DBB2D75B59D4DCF36745EF2C80B397C60F40F2` | Candidate identity |
| Accepted owner row | `4801`, `.ob64.r4801`, chunk `38` | Placement identity |
| Overlay descriptor | `12` | Relocation class |
| Linked runtime range | `0x802148C0..0x80214BE8` | Overlay virtual-address range |
| Linked target SHA-256 | `C4F2DD8D5281054D1F0266ECDEDC6832CF669DA331AC4C4F0A92B6A7D134EF02` | Exact linked-byte result |

The assembly addresses below are z64 ROM addresses. Owner-relative offsets use
the target start `0x00269470`. Runtime addresses identify relocated overlay data.

## Accepted evidence sources

The primary source is the original Rev 0 assembly split. The accepted model
supplies the owner row, section, boundary, chunk, and target placement.

| Source | Evidence supplied |
|---|---|
| `asm/original/rev0/lib/func_00269470.s` | Instructions, call targets, branch targets, and boundary |
| `asm/original/rev0/lib/func_00269798.s` | Boundary successor after the target |
| `config/phase8/matching-c.json` | Row, section, range, placement, aliases, and relocations |
| `config/overlays/us_rev0.json` | Overlay descriptor 12 mapping |
| `config/splat/us_rev0.semantic.json` | Accepted semantic linker inputs |
| `build/setup/verify-setup-report.json` | Exact Rev 0 setup and ROM identity |
| `docs/matching-c/high-value-wave4-20260802/target-selection.md` | Candidate selection and rejected candidates |

No external-derived implementation supplied C expressions, names, or control
flow. Runtime semantics remain unverified by this static record.

## Direct observations and derived meanings

### Entry, frame, and dispatch

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x000..0x028` | The function subtracts `0x30` from the stack and saves `s0`, `s1`, `s2`, and `ra`. | `frame_pad` preserves the accepted 48-byte frame under KMC. |
| `0x008` | The second argument becomes the state base. | `state = state_arg`. |
| `0x018` | The fields subobject begins 28 bytes after the state base. | `fields = &state->fields`. |
| `0x01C..0x024` | The selector is masked with `0xFFFF`. Values below `7` continue. | `selector = selector_arg & 0xFFFF`; `selector < 7`. |
| `0x02C..0x03C` | The code indexes a table at runtime address `0x80220BA0` and jumps through it. | `g_func_00269470_dispatch_table[selector]` and computed `goto`. |
| `0x310..0x327` | The function returns `s2` after restoring saved registers. | `return result`; the default result is zero. |

The dispatch table is an overlay runtime object. Its address is not an early
boot linear mapping. The table base explains the relocation pair at owner
offsets `0x030` and `0x038`.

The seven dispatch entries target these owner-relative case starts:

| Selector | Case label | Owner-relative start | Assembly evidence |
|---:|---|---:|---|
| `0` | `func_00269470_case_0` | `0x0D0` | `0x00269540` |
| `1` | `func_00269470_case_1` | `0x044` | `0x002694B4` |
| `2` | `func_00269470_case_2` | `0x07C` | `0x002694EC` |
| `3` | `func_00269470_case_3` | `0x20C` | `0x0026967C` |
| `4` | `func_00269470_case_4` | `0x26C` | `0x002696DC` |
| `5` | `func_00269470_case_5` | `0x1EC` | `0x0026965C` |
| `6` | `func_00269470_case_6` | `0x0C0` | `0x00269530` |

### State and field layout

The C structs express offsets established by direct loads and stores. These
names remain structural. They do not assert gameplay meanings.

| Semantic field | Offset | Address space | Direct evidence |
|---|---:|---|---|
| `state->flags_08` | `0x08` | state-subobject field | `lhu` and `sh` at owner offsets `0x1FC..0x208` |
| `state->flags_0A` | `0x0A` | state-subobject field | `lhu` and `andi 0x1000` at `0x240..0x248` |
| `state->value_0C` | `0x0C` | state-subobject field | `lw a2,0xC(s1)` at `0x258` |
| `state->value_10` | `0x10` | state-subobject field | `lw a0,0x10(s1)` at `0x20C` and `0x2B8` |
| `fields->value_40` | `0x40` | fields-subobject field | `swc1` at `0x1D0` and `lw a2,0x40(s0)` at `0x284` |
| `fields->flags_4A` | `0x4A` | fields-subobject field | `lhu` and flag masks across all cases |
| `fields->work_4C` | `0x4C` | fields-subobject field | Helper target argument at delay slots `0x070`, `0x0A4`, `0x0B4`, `0x148`, and `0x160` |
| `fields->record_50` | `0x50` | fields-subobject field | `lw` at `0x0C0`, `0x180`, and `0x1EC` |
| `fields->value_54` | `0x54` | fields-subobject field | `lw` at `0x218`, `0x230`, and `0x280` |
| `fields->value_58` | `0x58` | fields-subobject field | `lw` at `0x188`, `0x1F0`, and `0x234` |
| `fields->value_5C` | `0x5C` | fields-subobject field | `lhu` at `0x290` |
| `fields->value_64` | `0x64` | fields-subobject field | `lhu` at `0x090` and global copy at `0x0E8..0x0F0` |
| `fields->value_66` | `0x66` | fields-subobject field | `lhu` at `0x094` and global copy at `0x0F4..0x0FC` |
| `fields->value_68` | `0x68` | fields-subobject field | `lw` at `0x09C` and global copy at `0x100..0x108` |
| `fields->value_6C` | `0x6C` | fields-subobject field | `lw` at `0x08C` and global copy at `0x110..0x120` |
| `fields->callback_70` | `0x70` | fields-subobject field | Callback loads at `0x54`, `0x1D4`, and `0x2F0`; `jalr` at `0x64` and `0x304` |

The assembly uses `s0` for the fields subobject and `s1` for the state base.
The source preserves those offsets through explicit padding arrays.

### Relocated globals

| Semantic name | Game meaning | Address | Address space | Direct evidence |
|---|---|---|---|---|
| `g_func_00269470_dispatch_table` | Selector dispatch table | `0x80220BA0` | overlay runtime virtual address | `lui 0x8022`, `lw 0xBA0` at `0x02C..0x03C` |
| `g_func_00269470_flags` | Initialization flags | `0x80221038` | overlay runtime virtual address | `lui`, `lhu`, `sh` at `0x0D0..0x0D8` |
| `g_func_00269470_callback` | Initialization callback | `0x80221040` | overlay runtime virtual address | `lui`, `lw`, `sw` at `0x0DC..0x0E4` |
| `g_func_00269470_value_44` | Initialization halfword | `0x80221044` | overlay runtime virtual address | `lui`, `lhu`, `sh` at `0x0E8..0x0F0` |
| `g_func_00269470_value_46` | Initialization halfword | `0x80221046` | overlay runtime virtual address | `lui`, `lhu`, `sh` at `0x0F4..0x0FC` |
| `g_func_00269470_value_48` | Initialization pointer | `0x80221048` | overlay runtime virtual address | `lui`, `lw`, `sw` at `0x100..0x108` |
| `g_func_00269470_value_4C` | Selector-0 pointer value | `0x8022104C` | overlay runtime virtual address | `lui`, `lw`, `sw` at `0x110..0x120` |
| `g_func_00269470_value_3C` | Helper pointer value | `0x8022103C` | overlay runtime virtual address | `lui`, `lw` at `0x128..0x12C` and `0x154..0x158` |

These globals use accepted overlay relocation aliases. The source does not
apply the early-boot `ROM + 0x8006FC00` rule to them.

### Callback behavior

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x044..0x070` | Tests `flags_4A & 0x1`, loads callback field `0x70`, and calls with `1`, fields, and zero. | Selector 1 callback reason `1`. |
| `0x1C8..0x1D8` | Tests `flags_4A & 0x1`, loads callback field, and calls with zero, fields, and zero. | Selector 0 callback reason `0`. |
| `0x2E0..0x30C` | Tests `flags_4A & 0x1`, loads callback field, and passes state value `0x10` with reason `2`. | Selector 4 callback reason `2`. |

The callback pointer is checked for zero before each indirect call. The callback
field is a structural pointer. Its gameplay meaning remains unverified.

### Selector 0: initialization and transition

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x0D0..0x108` | Copies global flags, callback, two halfwords, and one pointer. | Assign `flags_4A`, `callback_70`, `value_64`, `value_66`, and `value_68`. |
| `0x110..0x120` | Loads global pointer `value_4C`, tests `flags_4A & 0x4`, and stores field `value_6C`. | Assign `fields->value_6C = g_func_00269470_value_4C`. |
| `0x120..0x14C` | Loads `value_66`, `value_3C`, `value_64`, `value_68`, and `value_6C`; calls `func_00268890`. | Call `func_00268890(work_4C, value_3C, value_64, value_68, value_66, value_6C)`. |
| `0x11C` branch and `0x14C` jump | The set-bit path skips `func_00268678`; the clear-bit path calls it. | Mask `0x4` selects `func_00268890`; clear selects `func_00268678`. |
| `0x154..0x160` | Loads `value_3C` and calls `func_00268678` with `work_4C`. | Call `func_00268678(work_4C, value_3C)`. |
| `0x164..0x1B0` | Derives a halfword from flags `0x10` and `0x20`; scans an array. | The inline loop preserves the exact original encoding. |
| `0x1B4..0x1D0` | Calls `func_00028C40`, loads `0x3F800000`, and stores it at field `0x40`. | Call helper, then assign `value_40.as_float = 1.0f`. |

The two branch constants are structural control-flow values. The source binds
the conditional branch to the compiler-local pre-call label. The source binds
the skip jump to a local assembler label after `func_00268678`.

### Selector 0: pointer-array loop

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x164..0x174` | Tests flag `0x10`, converts it to `0` or `1`, then tests flag `0x20`. | `mask = (flags_4A & 0x10) != 0`; add `0x2` when `flags_4A & 0x20`. |
| `0x180..0x18C` | Loads record pointer, reads count at record offset `0x4`, and loads entry pointer. | `count = record_50[1]`; `entry = (u32 **)value_58`. |
| `0x194..0x1A0` | Reads `entry[index]`, tests for zero, and writes halfword `0x18` when nonzero. | `if (entry[index] != 0) entry[index][0x18] = mask`. |
| `0x1A0..0x1B0` | Reloads count, increments index, compares unsigned, and advances by four bytes. | Bounded loop over `count` pointers. |

The loop has a zero-count exit. It also has a nonzero-entry skip path. These
two exits explain the exact branch sequence and the `bnel` instruction.

### Selector 1, 2, 5, and 6

| Selector | Owner-relative evidence | Direct observation | C derivation |
|---:|---|---|---|
| `1` | `0x044..0x074` | Optional callback reason `1`, then helper call. | `func_00268798(work_4C)`. |
| `2` | `0x07C..0x0BC` | Tests flag `0x4`; calls one of two helpers. | `func_00268AD8(work_4C, value_64, value_68, value_66, value_6C)` or `func_00268800(work_4C)`. |
| `5` | `0x1EC..0x208` | Uses record count and value pointer; clears state flag `0x4`. | `func_00268358(record_50[1], value_58)`; `flags_08 &= ~4`. |
| `6` | `0x0C0..0x0CC` | Loads the first record word into the return register. | `return record_50[0]`. |

The selector-2 halfword and pointer order follows the observed argument
registers. It is not inferred from helper names.

### Selector 3

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x20C..0x21C` | Passes state value `0x10`, record pointer, and value `0x54`. | Call `func_00267FD0(value_10, record_50, value_54)`. |
| `0x21C..0x238` | Passes fields, record pointer, and value `0x54`. | Call `func_002682A4(fields, record_50, value_54)`. |
| `0x22C..0x23C` | Passes record count, value `0x54`, and value `0x58`. | Call `func_00268400(record_50[1], value_54, value_58)`. |
| `0x240..0x268` | Tests state flag `0x1000`; conditionally passes value `0x0C`. | Call `func_002677D0(record_50[1], value_58, value_0C)` when set. |

### Selector 4

| Owner-relative evidence | Direct observation | C derivation |
|---|---|---|
| `0x26C..0x2FC` | Tests field flag `0x2`; passes record count, value `0x54`, and raw field word `0x40`. | Call `func_00268478(record_50[1], value_54, value_40.as_u32)` when set. |
| `0x290..0x298` | Exits when field `0x5C` is zero. | `if (value_5C != 0)` guards the next dispatch. |
| `0x29C..0x2D8` | Tests field flag `0x4` and selects one of two helpers. | Call `func_0026909C(value_10, record_50, value_58, value_66, value_6C)` or `func_00268F64(value_10, record_50, value_58)`. |

## Matching-only controls

These controls explain exact compilation. They do not add gameplay claims.

| Control | Evidence | Purpose |
|---|---|---|
| KMC flags | `config/phase8/matching-c.json` and build report | Preserve accepted ABI, ISA, endianness, and optimization settings |
| Top-level `move` macro | Original words use `addu` move encodings | Select the assembler spelling that reproduces those words |
| Frame padding expression | Original frame is `0x30` bytes | Preserve KMC frame allocation without emitted bytes |
| Fixed-register loop assembly | Original loop uses registers matching the accepted object | Preserve branch-likely, pointer increment, and store encodings |
| Local branch labels | Original skip path reaches the post-helper point | Preserve branch and jump relocation structure |

## Evidence interpretation

### Direct observations

The assembly directly establishes instruction words, field offsets, branch masks,
call targets, callback reasons, loop exits, and constants listed above.

### Interpretations

The C field names describe stable offsets. The helper names describe call-target
identity. The phrase “state handler” describes control flow, not gameplay.

### Uncertainty

The record does not establish the gameplay meaning of the state object, fields,
callbacks, helper routines, or selector values. Runtime tests were not required.

### Falsifier

An accepted assembly correction, relocation mismatch, source hash drift, or
independent linked-byte mismatch would falsify this derivation record.

## Claim record

### Claim

The C body of `func_00269470` is independently derived from accepted Rev 0
assembly and accepted placement evidence.

### Evidence grade

`Supported` before independent review.

### Review status

`pending`.

### Scope and context

This record covers static code derivation for one 808-byte overlay function. It
does not prove runtime gameplay semantics or editor readiness.

### Supporting artifacts

- `asm/original/rev0/lib/func_00269470.s`
- `asm/original/rev0/lib/func_00269798.s`
- `config/phase8/matching-c.json`
- `config/overlays/us_rev0.json`
- `config/splat/us_rev0.semantic.json`
- `docs/matching-c/high-value-wave4-20260802/evidence-index.md`
- `docs/matching-c/high-value-wave4-20260802/aar/20260802-ob64-matching-c-high-value-wave4-aar.md`

### Independent corroboration

The accepted Phase 8 build linked `.ob64.r4801` at
`0x802148C0..0x80214BE8`. Its target bytes matched the original fallback in
both fresh external roots.

### Competing interpretation

The function may be a display or resource state handler rather than a general
scheduler. That distinction does not alter the static byte derivation.

### Known limits

No runtime mutation, cold-boot behavior, or callback consumer semantics are
claimed here. The candidate remains review-pending.

### Product consequence

This record supports Critical review of the matching-C candidate. It does not
authorize editor changes or canonical semantic promotion.
