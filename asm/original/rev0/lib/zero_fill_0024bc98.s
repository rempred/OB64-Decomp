/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x0024BC98..0x0024BCA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): All-zero padding, 2 words (8 bytes) at end of region before separately-owned CODE leaf at 0x0024BCA0.. */
/* 0x0024BC98 0x802BB898 0x00000000 */ .word 0x00000000 # nop
/* 0x0024BC9C 0x802BB89C 0x00000000 */ .word 0x00000000 # nop
