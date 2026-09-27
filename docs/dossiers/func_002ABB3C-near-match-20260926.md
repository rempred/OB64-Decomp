# func_002ABB3C: Director roster placement, near-match candidate (2026-09-26)

Preservation does not change current source ownership or establish matching acceptance.

- Source: [candidate C](../archive/matching-c-candidates/2026-09-26-func_002ABB3C-near-match.c)
- Target: ROM 0x002ABB3C..0x002ABF64 (1064 bytes, 266 instructions), VRAM 0x8023C3DC
- Status: PURE_C, 262 decoded rows against 266 retail (188 non-relocation differences, 14 aligned relocation rows, frame 136 vs retail 144 in the archived candidate), rows 27..88 exact, structure of the whole body reproduced. Not accepted; no target record, no relocation contract. (Wording corrected 2026-09-27; an earlier draft said "same instruction count".)

Replay: `node tools/match.js watch func_002abb3c --source docs/archive/matching-c-candidates/2026-09-26-func_002ABB3C-near-match.c`.

## What the candidate establishes

- Signature `s32 func_002ABB3C(s32 leaderClass, s32 memberClass, s32 flagC)`, returns 0 after `func_002AB574()`.
- The two class filters are copied into a memory pair (`want[2]` at sp+0x30/0x34) and re-read into `a`/`b` at the top of each of the 20 unit iterations. Plain parameters give 8-byte reload slots and the wrong spill order; only a front-end memory object gives the adjacent 4-byte slots.
- Unit walk: `D_801CE8BC + 0x1C4 + i * 0xF8`, class word at +0x48 tested first through a temporary (re-read after the `a`/`b` loads), 20 iterations, `i` in `$s7`, the strength-reduced offset in `$s8`.
- The eight-way filter chain (`-1`, `-2`, `0`, class match through `func_00045e5c`) compiles exactly as an if/else-if ladder ending in `skip == 1`.
- The empty 28-count loop before `memset_0002cd70` is `for (j = 0; j < 28; j++) { flip = j; }` (a dead register assignment). A truly empty loop is reversed into a count-down by loop.c; a dead assignment keeps the count-up form the retail bytes show.
- The scenario check is the plain six-way `||` chain (`0x3D9, 0x21F, 0xC6, 0xF5, 0x1E4, 0x1E5`); fold pairs it exactly as the bytes show.
- Inner do-while over the slot list with three `func_002A9364` shapes; `volatile s32 slots[4]` reproduces the retail double load of `*cursor` (one for the actor lookup, one for the call argument).
- `mode` (`s32` copy of `D_8022AC80`) spills to sp+0x44 and the `mode == -9` boolean hoists to sp+0x5C only when `isNine` is an explicit local computed before the loop and `mode == -6` stays inline.

## Remaining differences (all compiler-heuristic level)

1. Prologue: retail hoists `&slots[0]` out of the outer loop into a spilled pseudo (sp+0x64) and reloads it as the cursor each iteration; every candidate either keeps `addiu $s1,$sp,0x20` inside the loop or (with an explicit `base` local) allocates its slot before `isNine`.
2. Two continue branches (`skip == 1`, `func_002AD574(unit) == 1`) and the `slots[0] == -1` branch use `beql` with the annulled `addiu $s7` copied from the loop tail in retail; the candidate fills them from the fall-through path. reorg's `mostly_true_jump` treats these as likely in retail; loop shape variants (`for`, do-while, goto-next) did not change this.
3. `flagC == 0` and the following `and` are hoisted out of the inner loop by the candidate but computed inside it in retail (loop.c savings threshold, which depends on the inner loop's insn count).
4. Callee-saved assignment of `flip`/`cursor`/`actor` swaps between `$s0`/`$s1` depending on the items above.

## Notes for the next attempt

- Use the scratchpad loop `cc1 -> mips-kmc-elf-as -> index-aligned objdump compare` for sub-minute iterations; the workbench run is only needed for the final check.
- Items 1 and 3 are both loop.c movable decisions; item 2 follows from the insn order at the branch fall-through, so fixing 1 and 3 may resolve 2.
