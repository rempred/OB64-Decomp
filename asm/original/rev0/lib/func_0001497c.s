/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001497C..0x00014988 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001497C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_0001497c:
/* 0x0001497C 0x8008457C 0xA08000D2 */ .word 0xA08000D2 # sb $zero, 0xD2($a0)
/* 0x00014980 0x80084580 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014984 0x80084584 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
