/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049730..0x0004973C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, lui $v0,0x8019 / jr $ra at 0x00049734 + delay addiu 0x00049738 (returns global ptr). Un-merged from parent idx67. */
func_00049730:
/* 0x00049730 0x800B9330 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00049734 0x800B9334 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049738 0x800B9338 0x2442F360 */ .word 0x2442F360 # addiu $v0, $v0, -0xCA0
