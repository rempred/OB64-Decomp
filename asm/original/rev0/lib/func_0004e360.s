/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E360..0x0004E36C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf getter (lui;jr $ra at 0x0004E364;addiu delay) un-merged from parent 0x0004E344 */
func_0004e360:
/* 0x0004E360 0x800BDF60 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004E364 0x800BDF64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E368 0x800BDF68 0x2442FC1C */ .word 0x2442FC1C # addiu $v0, $v0, -0x3E4
