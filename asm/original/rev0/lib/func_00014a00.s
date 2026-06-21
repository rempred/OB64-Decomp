/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014A00..0x00014A0C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014A00 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014a00:
/* 0x00014A00 0x80084600 0xAC800084 */ .word 0xAC800084 # sw $zero, 0x84($a0)
/* 0x00014A04 0x80084604 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014A08 0x80084608 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
