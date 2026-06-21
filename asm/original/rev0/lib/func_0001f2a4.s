/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001F2A4..0x0001F2B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001F2A4 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001f2a4:
/* 0x0001F2A4 0x8008EEA4 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0001F2A8 0x8008EEA8 0x50A20001 */ .word 0x50A20001 # beql $a1, $v0, 0x8008EEB0
/* 0x0001F2AC 0x8008EEAC 0xAC860000 */ .word 0xAC860000 # sw $a2, 0x0($a0)
/* 0x0001F2B0 0x8008EEB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001F2B4 0x8008EEB4 0x00001021 */ .word 0x00001021 # move $v0, $zero
