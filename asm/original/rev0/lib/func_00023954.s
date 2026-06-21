/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00023954..0x00023970 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00023954 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00023954:
/* 0x00023954 0x80093554 0xAFA40000 */ .word 0xAFA40000 # sw $a0, 0x0($sp)
/* 0x00023958 0x80093558 0xAFA50004 */ .word 0xAFA50004 # sw $a1, 0x4($sp)
/* 0x0002395C 0x8009355C 0xAFA60008 */ .word 0xAFA60008 # sw $a2, 0x8($sp)
/* 0x00023960 0x80093560 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00023964 0x80093564 0xAFA7000C */ .word 0xAFA7000C # sw $a3, 0xC($sp)
/* 0x00023968 0x80093568 0x00000000 */ .word 0x00000000 # nop
/* 0x0002396C 0x8009356C 0x00000000 */ .word 0x00000000 # nop
