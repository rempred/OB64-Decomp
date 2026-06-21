/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0002035C..0x00020370 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002035C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0002035c:
/* 0x0002035C 0x8008FF5C 0x00000000 */ .word 0x00000000 # nop
/* 0x00020360 0x8008FF60 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00020364 0x8008FF64 0xAC800000 */ .word 0xAC800000 # sw $zero, 0x0($a0)
/* 0x00020368 0x8008FF68 0x00000000 */ .word 0x00000000 # nop
/* 0x0002036C 0x8008FF6C 0x00000000 */ .word 0x00000000 # nop
