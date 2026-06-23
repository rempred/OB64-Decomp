/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00229928..0x00229930 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Float constant 0x40490000 (=3.140625, pi approximation) + nop.. */
/* 0x00229928 0x80299528 0x40490000 */ .word 0x40490000 # cop0_0x02
/* 0x0022992C 0x8029952C 0x00000000 */ .word 0x00000000 # nop
