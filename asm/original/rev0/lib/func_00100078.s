/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x00100078..0x00100080 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. Two-instruction setter: jr $ra/sw $a1,0x50($a0). */
/* 0x00100078 0x8016FC78 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0010007C 0x8016FC7C 0xAC850050 */ .word 0xAC850050 # sw $a1, 0x50($a0)
