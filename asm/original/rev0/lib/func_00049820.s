/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049820..0x0004982C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, lui $v0,0x8019 / jr $ra at 0x00049824 + delay addiu 0x00049828 (returns global ptr). Un-merged from parent idx69. */
func_00049820:
/* 0x00049820 0x800B9420 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00049824 0x800B9424 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049828 0x800B9428 0x2442F380 */ .word 0x2442F380 # addiu $v0, $v0, -0xC80
