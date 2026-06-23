/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00131000_00141000.s
 * z64 range: 0x0013C49C..0x0013C4A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Leading 2 pure-zero words (0x00000000 x2) trailing the prior function's epilogue; pad before the LUT.. */
/* 0x0013C49C 0x801AC09C 0x00000000 */ .word 0x00000000 # nop
/* 0x0013C4A0 0x801AC0A0 0x00000000 */ .word 0x00000000 # nop
