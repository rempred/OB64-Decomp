/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000154C0..0x000154D8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000154C0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000154c0:
/* 0x000154C0 0x800850C0 0x24020006 */ .word 0x24020006 # addiu $v0, $zero, 0x6
/* 0x000154C4 0x800850C4 0xA082001C */ .word 0xA082001C # sb $v0, 0x1C($a0)
/* 0x000154C8 0x800850C8 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x000154CC 0x800850CC 0x244299D8 */ .word 0x244299D8 # addiu $v0, $v0, -0x6628
/* 0x000154D0 0x800850D0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000154D4 0x800850D4 0xAC820020 */ .word 0xAC820020 # sw $v0, 0x20($a0)
