/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012408..0x00012414 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012408 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012408:
/* 0x00012408 0x80082008 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x0001240C 0x8008200C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012410 0x80082010 0xAC241838 */ .word 0xAC241838 # sw $a0, 0x1838($at)
