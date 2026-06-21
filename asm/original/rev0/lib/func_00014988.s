/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014988..0x0001499C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014988 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014988:
/* 0x00014988 0x80084588 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x0001498C 0x8008458C 0xA08000D2 */ .word 0xA08000D2 # sb $zero, 0xD2($a0)
/* 0x00014990 0x80084590 0xA08200D3 */ .word 0xA08200D3 # sb $v0, 0xD3($a0)
/* 0x00014994 0x80084594 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014998 0x80084598 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
