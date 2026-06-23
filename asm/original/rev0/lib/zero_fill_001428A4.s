/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001428A4..0x001428A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single zero word separating two 0x801B6xxx pointer banks (isolated null pointer slot; sub-2-word). [name-token: zero_fill_ptr_gap_1]. */
/* 0x001428A4 0x801B24A4 0x00000000 */ .word 0x00000000 # nop
