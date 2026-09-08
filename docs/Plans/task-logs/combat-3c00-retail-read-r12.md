# 3C00: preserve an observed retail read with a hybrid operand

This stable R12 pair records a minimal HYBRID constraint under Joe's allowance for the three unresolved W8 targets. It is an explicit preservation of an otherwise redundant retail read, not recovery of the original C spelling. Both archived inputs remain inactive and nonexact; D037 remains the active pure-C reference.

## Controlled pair

| Source | Authored SHA-256 | Private result |
| --- | --- | --- |
| Companion size-opcode predecessor | `A85C417B387B0F820029669B4618666C1362F0A27969C700A301FB1C338F9A86` | 6736 bytes, frame 504, 1186 differing bytes / 337 words |
| Real tile-width input retained | `98795A9A6B3AAAA9D69C7E4746CCACD6C049FB0FDAE66BC8E193899950898C54` | 6740 bytes, frame 504, 300 differing bytes / 88 words |

Compiler-input SHA-256 values are `44D850A3A93B7445D92B47A8C1441AD176514A94BA2BE42FBD5476D7A5FE5DBD` and `5D9C75A0D33CFCB4D27D0562903853A81D8F5D242E330515E2113D557CFCEE82`. Each private object has 302 relocations, and each exact-input diagnostic agrees with the pinned compiler. These counts and diagnostic comparisons do not establish the canonical relocation contract or matching acceptance. Retrieve the pair through `node tools/match.js intake func_001F3C00 --limit 50 --json`.

The sole source change adds `"r" (tileBytes)` to the existing final tile's assembly input operands. Its original `(tileBytes / 8 & 511)` operand and assembly template remain unchanged. The new operand explicitly requires the actual input value at that boundary, even though the division result has been reused from an earlier calculation.

The compiler emits one read from the existing tileBytes home at stack offset `0x1BC` into register 10. No extra arithmetic or new stack home is introduced. The source names the real C value; it does not encode that stack offset or inject an instruction word. The additional read restores the original extent and the expected tag-register alternation in the nonzero branch. Its position is still later than retail's owner offset `0x1554`, and cursor/tag/ordering differences remain. Exact placement of the read requires further work.

## Why this remains hybrid

The operand is a deliberate compiler constraint preserving an observed machine operation. It is not evidence that the original programmer wrote this constraint, nor that the C computation needs an additional read. The existing template already contains a real LUI/OR pair, and the surrounding source contains other assembly constraints. Adding no explicit instruction to that template does not make the source PURE_C.

Earlier controls preserved the original division expression but first CSE reused its raw masked value and removed the zero-format reload. Replacing the named raw cache with a combined tile word still allowed reuse of an unnamed raw temporary. In a retained nonzero-path control, a sign-test/self-update temporary survived CSE cleanup, and later removal of that scaffold left a reload. That is candidate-specific compiler evidence, not a demonstrated explanation of the original retail history. The explicit hybrid operand permits matching work to continue while that pure-C source-recovery question remains open.

The immutable source/result pairs are under ignored `build/combat-draw-wave8-r12/3c00/companion-size-opcode/` and `3c00/companion-retail-tile-read/`; their authenticated diagnostics are under `build/combat-draw-wave8-r12/3c00-traces/` with the same labels. No compiler-output rewriting, synthetic data, target activation, canonical focused acceptance or full-wave verification is part of this pair. Remove the constraint if later source recovery makes it unnecessary; all fourteen W8 targets retain their final source-class, ownership, placement, relocation, target-byte and complete-ROM gates.
