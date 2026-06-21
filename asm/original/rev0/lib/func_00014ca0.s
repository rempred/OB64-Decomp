/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014CA0..0x00014CB0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014CA0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014ca0:
/* 0x00014CA0 0x800848A0 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014CA4 0x800848A4 0xA08200D4 */ .word 0xA08200D4 # sb $v0, 0xD4($a0)
/* 0x00014CA8 0x800848A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014CAC 0x800848AC 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
