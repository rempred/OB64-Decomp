/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014824..0x00014830 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014824 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014824:
/* 0x00014824 0x80084424 0xA08000D7 */ .word 0xA08000D7 # sb $zero, 0xD7($a0)
/* 0x00014828 0x80084428 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001482C 0x8008442C 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
