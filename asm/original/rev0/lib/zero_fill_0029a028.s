/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029A028..0x0029A030 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8 bytes all-zero between digit string and next pointer table.. */
/* 0x0029A028 0x80309C28 0x00000000 */ .word 0x00000000 # nop
/* 0x0029A02C 0x80309C2C 0x00000000 */ .word 0x00000000 # nop
