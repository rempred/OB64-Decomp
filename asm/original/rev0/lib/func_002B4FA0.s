/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B4FA0..0x002B4FB4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf accessor (over-merge in plan idx31). Reads -0x568C/0x1A4C, returns sltu flag. jr $ra at 0x4FAC + delay 0x4FB0. Ends before forward preamble 0x4FB4/0x4FB8 for next function. */
func_002B4FA0:
/* 0x002B4FA0 0x80324BA0 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002B4FA4 0x80324BA4 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002B4FA8 0x80324BA8 0x8C421A4C */ .word 0x8C421A4C # lw $v0, 0x1A4C($v0)
/* 0x002B4FAC 0x80324BAC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B4FB0 0x80324BB0 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
