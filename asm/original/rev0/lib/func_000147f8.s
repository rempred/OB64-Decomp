/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000147F8..0x00014808 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000147F8 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000147f8:
/* 0x000147F8 0x800843F8 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x000147FC 0x800843FC 0xA08200D6 */ .word 0xA08200D6 # sb $v0, 0xD6($a0)
/* 0x00014800 0x80084400 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014804 0x80084404 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
