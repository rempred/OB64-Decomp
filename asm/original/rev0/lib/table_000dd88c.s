/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DD88C..0x000DD8C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Continuation of the same 0x801Exxxx pointer table across two embedded single-word null entries (0x00000000 at 0xDD88C and 0xDD8C4 — each only 1 word, below the >=3 zero_fill threshold, so treated as null table slots not zero_fill). 14 words total spanning the two nulls.. */
/* 0x000DD88C 0x8014D48C 0x00000000 */ .word 0x00000000 # nop
/* 0x000DD890 0x8014D490 0x801E8860 */ .word 0x801E8860 # lb $s8, -0x77A0($zero)
/* 0x000DD894 0x8014D494 0x801E8B14 */ .word 0x801E8B14 # lb $s8, -0x74EC($zero)
/* 0x000DD898 0x8014D498 0x801E8B14 */ .word 0x801E8B14 # lb $s8, -0x74EC($zero)
/* 0x000DD89C 0x8014D49C 0x801E8B14 */ .word 0x801E8B14 # lb $s8, -0x74EC($zero)
/* 0x000DD8A0 0x8014D4A0 0x801E8B14 */ .word 0x801E8B14 # lb $s8, -0x74EC($zero)
/* 0x000DD8A4 0x8014D4A4 0x801E8B14 */ .word 0x801E8B14 # lb $s8, -0x74EC($zero)
/* 0x000DD8A8 0x8014D4A8 0x801E8B14 */ .word 0x801E8B14 # lb $s8, -0x74EC($zero)
/* 0x000DD8AC 0x8014D4AC 0x801E8B14 */ .word 0x801E8B14 # lb $s8, -0x74EC($zero)
/* 0x000DD8B0 0x8014D4B0 0x801E8878 */ .word 0x801E8878 # lb $s8, -0x7788($zero)
/* 0x000DD8B4 0x8014D4B4 0x801E88C8 */ .word 0x801E88C8 # lb $s8, -0x7738($zero)
/* 0x000DD8B8 0x8014D4B8 0x801E8878 */ .word 0x801E8878 # lb $s8, -0x7788($zero)
/* 0x000DD8BC 0x8014D4BC 0x801E88B4 */ .word 0x801E88B4 # lb $s8, -0x774C($zero)
/* 0x000DD8C0 0x8014D4C0 0x801E888C */ .word 0x801E888C # lb $s8, -0x7774($zero)
/* 0x000DD8C4 0x8014D4C4 0x00000000 */ .word 0x00000000 # nop
