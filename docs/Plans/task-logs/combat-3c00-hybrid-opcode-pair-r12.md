# 3C00: recover separate C tails through the real opcode history

This stable R12 record preserves two connected HYBRID_C intermediates under Joe's 2026-09-08 minimal-assembly allowance for the three unresolved W8 targets. Both remain inactive, nonexact research sources. The active pure-C reference remains D037; the complete fourteen-target wave and final full-ROM verifier are still required.

## Exact source pair

| Source | Authored SHA-256 | Private result |
| --- | --- | --- |
| Optional row-mask predecessor | `2BCE57E2B341AF4C01CD5723E1EFFEB7F234A5FF29ACEC86474C9585D6399D8A` | 6736 bytes, frame 504, 1357 differing bytes / 392 words |
| Primary opcode point | `E91A123F5B908611DE29073AAD43EA392FD3E9CA6C40BAEE613C9B63C269468E` | 6740 bytes, frame 504, 792 differing bytes / 243 words |

The corresponding compiler-input hashes are `7486AA090DB0D222AFC51F8B01EEA6924EABBD3E9A66EE3A0D1C6A45524282CD` and `15AA8C45A1D19E10BD4F3E1E1B4D2A1DFDFFE8DED664CC48B1EE1565425F4A4D`. Both exact-input diagnostics agree with the pinned compiler. Both private objects contain 302 relocations; that count is not a canonical relocation-contract proof. Retrieve the archived pair through `node tools/match.js intake func_001F3C00 --limit 50 --json`.

The predecessor includes a connected series of companion, endpoint, row and opcode constraints. It is related to the existing [D037 reference](../../dossiers/func_001F3C00-519474319f.md), not a one-change causal comparison with it. D037 remains 6740 bytes/frame 504 with 770 differing bytes/261 words. The hybrid child improves particular regions while having a larger aggregate byte difference than D037; it has not replaced that active source.

## Isolated child change

Only the primary F200 word construction changes between the two archived sources. After publishing the next command cursor, an empty volatile tied constraint places the real `0xF2000000` value in register 2 and provides a memory ordering boundary. Ordinary C then ORs that value into the existing `rowField` and stores the word. This mirrors the already tested optional-branch construction.

The added constraint emits no explicit assembly instruction. The complete pair already contains other hybrid interventions, including one real `addu`, two real `andi` operations and register/ordering constraints. It must not be described as an assembly-free or PURE_C implementation.

The child's corrected primary opcode history retains separate optional and primary final C OR operations, recovering the missing four bytes and the original 6740-byte extent. Keeping those ORs in C leaves them available for normal jump delay-slot scheduling. In the child, the optional packet region matches apart from the three-word cursor/line ordering residual at owner offsets `0x12C0..0x12C8`. Two earlier tag-store register differences and primary-packet differences remain. Full target bytes are nonexact.

## Why the ordering matters

The preceding controls distinguish suffix sharing from register choice. An explicit assembly OR prevented sharing but could not fill the normal delay slot. A hard constraint on reload register 11 changed other register choices. The retained compiler's `reorg.c` stops its backward delay-slot search at any assembly operand, including an empty template, so putting a new identity after a C OR would block that OR's scheduling. Applying a constraint at the actual primary opcode construction addresses the observed value history while leaving the final OR as C.

These are input-specific compiler observations, not proof of the original source spelling or a general register-allocation recipe. The aggregate comparison also changes when the missing instruction shifts later bytes and branch targets; use the exact regional evidence when extending the experiment.

The immutable sources and private results are under ignored `build/combat-draw-wave8-r12/3c00/optional-row-mask/` and `3c00/primary-opcode-point/`. Corresponding authenticated diagnostics are under `build/combat-draw-wave8-r12/3c00-traces/` with the same labels. Neither archived input has a canonical focused or completed-wave acceptance claim. Source selection, structural evidence, target exactness and matching-C accounting remain distinct.
