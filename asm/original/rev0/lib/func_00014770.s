/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014770..0x00014780 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014770 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014770:
/* 0x00014770 0x80084370 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00014774 0x80084374 0xA08200B7 */ .word 0xA08200B7 # sb $v0, 0xB7($a0)
/* 0x00014778 0x80084378 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001477C 0x8008437C 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
