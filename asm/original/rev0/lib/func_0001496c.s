/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001496C..0x0001497C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001496C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001496c:
/* 0x0001496C 0x8008456C 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00014970 0x80084570 0xA08200D2 */ .word 0xA08200D2 # sb $v0, 0xD2($a0)
/* 0x00014974 0x80084574 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014978 0x80084578 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
