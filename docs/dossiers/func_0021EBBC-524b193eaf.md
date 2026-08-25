# func_0021EBBC: Preserved Matching-Workbench Candidate

## Status

This source is a research candidate. The original assembly remains the accepted owner.

- Candidate: `524B193EAF4C346079CFE777500DC8C451997B12230E9BC648E391488AA6C2E1`
- Target: `func_0021EBBC` at ROM `0x21EBBC`
- Source: `docs/archive/matching-c-candidates/2026-08-25-func_0021EBBC-524b193eaf.c`
- Source SHA-256: `8997D7FBE8F2A6B991DF7A2C7BDB15AB6F819C35585C4BBB2FD2EC4DBCD8C3F3`
- Latest scratch class: `length-mismatch`
- Latest scratch score: `22.22`

## Preservation reason

Best maintainable PURE_C hypothesis after correcting three address-exposed stack buffers to 0xF8, 0xF8, and 0x50 bytes using Total Resolver-backed ownership and jump-table evidence; nonexact, no canonical promotion. Exact-offset aggregate experiments reduced the size gap further but worsened aliasing, frame allocation, and maintainability.

## Evidence boundary

Scratch object comparison does not prove canonical linker ownership, relocation resolution, target bytes, or full-ROM identity. Resume through the normal diff and verification workflow.

## First recorded difference

```json
{
  "actual": "lui $a0, 0x801D",
  "actualWord": "0x3C04801D",
  "expected": "addiu $sp, $sp, -0x2E8",
  "expectedWord": "0x27BDFD18",
  "index": 0,
  "offset": 0,
  "pc": 2223036
}
```

## Corrected accepted owner

The workbench originally truncated this target at the 64-KiB source split `0x00221000`.
The accepted function is the contiguous pair:

- `asm/original/rev0/lib/func_0021EBBC.s`, beginning at ROM `0x0021EBBC`;
- `asm/original/rev0/lib/func_0021EBBC_chunk34tail.s`, ending at ROM `0x002213DC`.

The corrected target is therefore 10,272 bytes / 2,568 instructions with a 744-byte frame,
678 blocks, 1,148 edges, 205 direct calls, three indirect jumps, and floating-point work.
The matching-workbench target model now composes only explicitly named, adjacent head/tail parts
after validating contiguous ROM, VRAM, placement, and ownership. The tail is no longer exposed as
a separate function target.

## Total Resolver and jump-table evidence

Total Resolver places the live entry at `0x801DB8EC` under the accepted runtime delta
`+0x7FFBCD30`. Existing evidence observes 1,340 instructions across two sessions, 190 call
relationships, and 2,885 exact edges. That placement plus canonical ROM bytes resolves all three
runtime jump tables:

| Live table | ROM table | Entries |
| --- | --- | ---: |
| `0x801E6C48` | `0x00229F18` | 44 |
| `0x801E6CF8` | `0x00229FC8` | 63 |
| `0x801E6DF8` | `0x0022A0C8` | 5 |

All 112 entries, representing 66 distinct destinations, remain inside the accepted function.
These tables and labels were supplied only to ignored analysis input; accepted assembly and source
ownership were not changed.

## Ruleset coverage and recovered types

The complete configured eight-ruleset ensemble was attempted. The structured baseline and its five
calibrated variants converge on one source because their transforms are inapplicable. The stack
shape initially emits identical object bytes. The goto-only shape fails because pinned upstream
m2c emits `switch (expr);` followed by top-level `case` labels for this multi-switch body, which is
invalid C.

The first compilable draft treated stack objects at `sp58`, `sp150`, and `sp250` as four-byte
unknown scalars. Their call sizes and accepted offsets instead establish buffers of `0xF8`, `0xF8`,
and `0x50` bytes. Correcting those types yields this preserved candidate:

- 10,104 bytes / 2,526 instructions;
- 728-byte generated frame versus retail's 744;
- score `22.22` and source class `PURE_C`.

An exact-offset aggregate experiment reached 10,208 bytes / 2,552 instructions, but broad aliasing
inflated the compiler frame to 776 bytes and worsened register allocation. It is documented as a
type/layout experiment, not preferred source.

## Remaining blocker

The gap is distributed across aggregate allocation, long-lived register coloring, branch-likely
lowering, nested switch topology, and delay-slot scheduling throughout the 2,568-instruction state
machine. No bounded residual region can be replaced honestly. An exact hybrid would require broad
function wrapping, so no hybrid or canonical promotion was attempted.
