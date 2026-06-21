/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001499C..0x000149B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001499C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001499c:
/* 0x0001499C 0x8008459C 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x000149A0 0x800845A0 0x00021042 */ .word 0x00021042 # srl $v0, $v0, 1
/* 0x000149A4 0x800845A4 0xA08200BD */ .word 0xA08200BD # sb $v0, 0xBD($a0)
/* 0x000149A8 0x800845A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000149AC 0x800845AC 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
