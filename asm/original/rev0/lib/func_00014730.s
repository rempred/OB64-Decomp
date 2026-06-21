/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014730..0x00014740 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014730 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014730:
/* 0x00014730 0x80084330 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x00014734 0x80084334 0xA08000D5 */ .word 0xA08000D5 # sb $zero, 0xD5($a0)
/* 0x00014738 0x80084338 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001473C 0x8008433C 0xAC800068 */ .word 0xAC800068 # sw $zero, 0x68($a0)
