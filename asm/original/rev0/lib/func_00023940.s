/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023940..0x00023954 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023940 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00023940:
/* 0x00023940 0x80093540 0xAFA40000 */ .word 0xAFA40000 # sw $a0, 0x0($sp)
/* 0x00023944 0x80093544 0xAFA50004 */ .word 0xAFA50004 # sw $a1, 0x4($sp)
/* 0x00023948 0x80093548 0xAFA60008 */ .word 0xAFA60008 # sw $a2, 0x8($sp)
/* 0x0002394C 0x8009354C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00023950 0x80093550 0xAFA7000C */ .word 0xAFA7000C # sw $a3, 0xC($sp)
