/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E004..0x0004E010 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, lui/jr $ra at 0x0004E008/addiu delay; un-merged from parent 0x0004DFE8 */
func_0004e004:
/* 0x0004E004 0x800BDC04 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004E008 0x800BDC08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E00C 0x800BDC0C 0x2442FBC8 */ .word 0x2442FBC8 # addiu $v0, $v0, -0x438
