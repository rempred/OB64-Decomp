/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00143264..0x00143268 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single zero word separating uniform pointer tables. [name-token: zero_fill_1w_f]. */
/* 0x00143264 0x801B2E64 0x00000000 */ .word 0x00000000 # nop
