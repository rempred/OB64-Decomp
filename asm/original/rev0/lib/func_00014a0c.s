/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014A0C..0x00014A14 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014A0C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014a0c:
/* 0x00014A0C 0x8008460C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014A10 0x80084610 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
