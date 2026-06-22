/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00071000_00081000.s
 * z64 range: 0x00074738..0x00074748 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from parent file 11: lbu $v0,0x14($a0) / andi 0x7F / jr $ra at 0x74740 / sb $v0,0x14($a0) delay slot. Next word 0x74748 is a preamble for the following framed function. */
func_00074738:
/* 0x00074738 0x800E4338 0x90820014 */ .word 0x90820014 # lbu $v0, 0x14($a0)
/* 0x0007473C 0x800E433C 0x3042007F */ .word 0x3042007F # andi $v0, $v0, 0x007F
/* 0x00074740 0x800E4340 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00074744 0x800E4344 0xA0820014 */ .word 0xA0820014 # sb $v0, 0x14($a0)
