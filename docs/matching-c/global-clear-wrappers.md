# Global clear wrappers

The three functions below share the ordinary C shape already represented by
`src/lib/func_00201D24.c`: pass a global word to a helper, then clear that word.
Each retains its complete accepted 44-byte owner, including the load before the
stack-frame setup. No boundary, overlay, compiler, or ownership rule changes are
needed.

| Function | ROM range, end exclusive | Runtime start | Global | Helper |
| --- | --- | --- | --- | --- |
| `boot_resource_global_handle_release` | `0x7200..0x722C` | `0x80076E00` | `D_800AF0B0` | `func_00049aa0` at `0x80173BA0` |
| `func_0006e8a8` | `0x6E8A8..0x6E8D4` | `0x80197DB8` | `D_8019A798` | `resource_free` at `0x800712C4` |
| `func_00113C60` | `0x113C60..0x113C8C` | `0x801BF520` | `D_801F0CAC` | `resource_free` at `0x800712C4` |

## Boot global and loaded helper

The original words in `asm/original/rev0/boot/boot_resource_global_handle_release.s`
load a word from `0x800AF0B0`, call `0x80173BA0`, and store zero to the same word.
The neighboring `boot_resource_global_handle_slot_record_prepare.s` calls
`0x80173B60` at ROM `0x723C` and stores its return to the global at ROM `0x7248`.
The boot clear loop in `boot_entry_clear_bss.s` clears
`[0x800AEDB0,0x800E9C20)`, containing this four-byte slot at offset `0x300`.
This authenticates the address and storage width without inventing a new BSS
section or strengthening the existing release-like name.

The helper's address follows the existing `cold-boot-loader-00040e80` contract in
`config/phase7/conventional-build.json`. `early_boot_resource_loader.s` supplies
ROM `0x40E80`, destination `0x8016AF80`, and length `0x66E10 - 0x40E80` to the
copy helper at ROM `0x2470`. Thus ROM `0x49AA0` maps to `0x80173BA0`.
The calls back into this resident wrapper at ROM `0x4EBD8` and `0x4EC44` are
themselves in that same loaded slab; their runtime call sites are `0x80178CD8`
and `0x80178D44`. Their reference sources are `lib/func_0004ebcc.s` and
`lib/func_0004ec3c.s` under the original-assembly directory.

The boot wrapper is resident while its helper is in a loaded slab. The research
template checker's conservative same-region rule cannot establish that edge.
The existing loader contract and direct ROM call supply its address evidence;
the canonical linker and verifier remain the acceptance gates. No exception is
added to the research checker. This is not a proof that the helper is loaded on
every possible execution path, nor a stronger semantic claim about what it frees.

## Overlay globals

`config/overlays/us_rev0.json` places `D_8019A798` in descriptor 1's BSS
`[0x8019A790,0x8019A7A0)`, at offset 8. In
`asm/original/rev0/lib/func_0006e810.s`, the return from the call to `0x80070F30`
at ROM `0x6E848` is stored to that slot at ROM `0x6E85C`, then reloaded and
dereferenced. The descriptor's ROM/runtime mapping places the wrapper at the
address shown in the table.

`D_801F0CAC` is in descriptor 7's BSS `[0x801F0AD0,0x801F4030)`, at offset
`0x1DC`. `asm/original/rev0/lib/func_00113C28.s` stores the return from
`0x80070F30(0x800)` into it at ROM `0x113C48`. `func_00113C8C.s` later uses the
stored word for buffer addressing and stores. Numeric overlap with another
overlay's reservation does not identify a shared object or override this
same-overlay evidence.

The `s32` declarations preserve the existing donor's word-sized carrier. They do
not assert signed arithmetic, pointee layouts, gameplay meanings, or initialization
on every path. The symbols are address registrations, not additional storage
definitions.

## Evidence and matching acceptance

Static checks on 2026-09-23 authenticated normalized Rev 0 SHA-256
`571E83396BC81E70DA4C0A20313D82DBD7DFE685F2C37418C8E27F927E2CC67A` and compared the
cited assembly words and the two overlay descriptors directly with the ROM.
Generated details are in ignored `build/template-remaining/boot-binding.json`
and `build/template-remaining/data-ownership.json`. Runtime placement uses the
current accepted mappings; stale linear-address comments in overlay/slab
assembly listings are not placement evidence.

Each canonical linked diff produced `PURE_C` and all 44 bytes exact. The five
relocations from each actual compiled object were reviewed and recorded in
`config/matching-c-linkage.json`: the two global-address HI16/LO16 pairs and the
helper's R_MIPS_26 call. No compiler assembly rewriting was used.

One completed-wave `node tools/verify.js` passed on 2026-09-23 at 21:52 UTC. It
confirmed all three are `PURE_C`, each C object is the sole owner, placement and
relocations agree with the contracts, target bytes and the full ROM are exact,
and fresh compilation reproduces the verified objects. The full-ROM SHA-256 is
the canonical identity above. Generated reports are
`build/current/verification.json`, `build/current/fresh-compilation.json`, and
the compact `build/template-remaining/final-verification.json`; these remain
untracked. Acceptance applies to the exact source and configuration inputs
recorded by that verification.
