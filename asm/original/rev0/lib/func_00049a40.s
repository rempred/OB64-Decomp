/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049A40..0x00049A50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lbu/lui), jr $ra at 0x49A48; un-merged from parent 0x499CC */
func_00049a40:
/* 0x00049A40 0x800B9640 0x90820000 */ .word 0x90820000 # lbu $v0, 0x0($a0)
/* 0x00049A44 0x800B9644 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049A48 0x800B9648 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049A4C 0x800B964C 0xA022F481 */ .word 0xA022F481 # sb $v0, -0xB7F($at)
