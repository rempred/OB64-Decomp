/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014780..0x00014790 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014780 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014780:
/* 0x00014780 0x80084380 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014784 0x80084384 0xA08200B9 */ .word 0xA08200B9 # sb $v0, 0xB9($a0)
/* 0x00014788 0x80084388 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001478C 0x8008438C 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
