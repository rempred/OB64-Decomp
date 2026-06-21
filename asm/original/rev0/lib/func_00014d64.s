/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014D64..0x00014D70 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014D64 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014d64:
/* 0x00014D64 0x80084964 0xA48000AC */ .word 0xA48000AC # sh $zero, 0xAC($a0)
/* 0x00014D68 0x80084968 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014D6C 0x8008496C 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
