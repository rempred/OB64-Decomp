/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142378..0x00142380 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8-byte tail of two pure-zero words (0x00000000 @0x142378 and @0x14237C). Alignment/zero padding closing the region.. */
/* 0x00142378 0x801B1F78 0x00000000 */ .word 0x00000000 # nop
/* 0x0014237C 0x801B1F7C 0x00000000 */ .word 0x00000000 # nop
