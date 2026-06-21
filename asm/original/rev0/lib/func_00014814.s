/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014814..0x00014824 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014814 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014814:
/* 0x00014814 0x80084414 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00014818 0x80084418 0xA08200D7 */ .word 0xA08200D7 # sb $v0, 0xD7($a0)
/* 0x0001481C 0x8008441C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014820 0x80084420 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
