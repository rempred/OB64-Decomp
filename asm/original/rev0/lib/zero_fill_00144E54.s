/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00144E54..0x00144E58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single zero word separating pointer sub-tables. [name-token: zero_fill_1w_h]. */
/* 0x00144E54 0x801B4A54 0x00000000 */ .word 0x00000000 # nop
