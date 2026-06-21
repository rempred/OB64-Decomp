/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014960..0x0001496C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014960 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014960:
/* 0x00014960 0x80084560 0xA08000CE */ .word 0xA08000CE # sb $zero, 0xCE($a0)
/* 0x00014964 0x80084564 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014968 0x80084568 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
