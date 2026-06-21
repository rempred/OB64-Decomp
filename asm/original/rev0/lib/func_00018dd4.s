/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018DD4..0x00018DEC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00018DD4 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00018dd4:
/* 0x00018DD4 0x800889D4 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00018DD8 0x800889D8 0x8C639E54 */ .word 0x8C639E54 # lw $v1, -0x61AC($v1)
/* 0x00018DDC 0x800889DC 0x8C62002C */ .word 0x8C62002C # lw $v0, 0x2C($v1)
/* 0x00018DE0 0x800889E0 0xAC820000 */ .word 0xAC820000 # sw $v0, 0x0($a0)
/* 0x00018DE4 0x800889E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00018DE8 0x800889E8 0xAC64002C */ .word 0xAC64002C # sw $a0, 0x2C($v1)
