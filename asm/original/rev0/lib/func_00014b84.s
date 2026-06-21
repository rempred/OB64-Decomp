/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014B84..0x00014B94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014B84 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014b84:
/* 0x00014B84 0x80084784 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014B88 0x80084788 0xA08200BC */ .word 0xA08200BC # sb $v0, 0xBC($a0)
/* 0x00014B8C 0x8008478C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014B90 0x80084790 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
