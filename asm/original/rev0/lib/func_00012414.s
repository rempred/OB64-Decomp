/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012414..0x00012420 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012414 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012414:
/* 0x00012414 0x80082014 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00012418 0x80082018 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001241C 0x8008201C 0xAC24183C */ .word 0xAC24183C # sw $a0, 0x183C($at)
