/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049A30..0x00049A40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui/sb), jr $ra at 0x49A38; un-merged from parent 0x499CC */
func_00049a30:
/* 0x00049A30 0x800B9630 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049A34 0x800B9634 0xA020F481 */ .word 0xA020F481 # sb $zero, -0xB7F($at)
/* 0x00049A38 0x800B9638 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049A3C 0x800B963C 0xA0800000 */ .word 0xA0800000 # sb $zero, 0x0($a0)
