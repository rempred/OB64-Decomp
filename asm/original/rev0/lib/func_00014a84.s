/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014A84..0x00014A94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014A84 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014a84:
/* 0x00014A84 0x80084684 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014A88 0x80084688 0xA08200CA */ .word 0xA08200CA # sb $v0, 0xCA($a0)
/* 0x00014A8C 0x8008468C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014A90 0x80084690 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
