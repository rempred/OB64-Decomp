/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142DE4..0x00142DE8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single zero word separating two 0x801D03xx pointer banks. [name-token: zero_fill_1w_a]. */
/* 0x00142DE4 0x801B29E4 0x00000000 */ .word 0x00000000 # nop
