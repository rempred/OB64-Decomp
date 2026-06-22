/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049A50..0x00049A60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lui/lbu), jr $ra at 0x49A58; un-merged from parent 0x499CC */
func_00049a50:
/* 0x00049A50 0x800B9650 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00049A54 0x800B9654 0x9042F481 */ .word 0x9042F481 # lbu $v0, -0xB7F($v0)
/* 0x00049A58 0x800B9658 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049A5C 0x800B965C 0xA0820000 */ .word 0xA0820000 # sb $v0, 0x0($a0)
