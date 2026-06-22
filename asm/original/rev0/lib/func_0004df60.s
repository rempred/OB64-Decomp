/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DF60..0x0004DF6C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, lui/jr $ra at 0x0004DF64/addiu delay; un-merged from parent 0x0004DF38 */
func_0004df60:
/* 0x0004DF60 0x800BDB60 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004DF64 0x800BDB64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DF68 0x800BDB68 0x2442FBB4 */ .word 0x2442FBB4 # addiu $v0, $v0, -0x44C
