/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00151F34..0x00151F40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Three nop words (alignment padding) between func_00151C30 epilogue and the frameless leaf at 0x151F40. Not executed.. */
/* 0x00151F34 0x801C1B34 0x00000000 */ .word 0x00000000 # nop
/* 0x00151F38 0x801C1B38 0x00000000 */ .word 0x00000000 # nop
/* 0x00151F3C 0x801C1B3C 0x00000000 */ .word 0x00000000 # nop
