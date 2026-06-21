/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012524..0x00012530 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012524 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012524:
/* 0x00012524 0x80082124 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00012528 0x80082128 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001252C 0x8008212C 0xAC241840 */ .word 0xAC241840 # sw $a0, 0x1840($at)
