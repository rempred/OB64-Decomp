/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142D48..0x00142D50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 2 pure-zero words (pad before float pool). [name-token: zero_fill_2w_b]. */
/* 0x00142D48 0x801B2948 0x00000000 */ .word 0x00000000 # nop
/* 0x00142D4C 0x801B294C 0x00000000 */ .word 0x00000000 # nop
