/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DE54..0x0004DE60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf accessor (lui+jr $ra+addiu returns global addr), un-merged from parent 0x0004DE38; ends slice */
func_0004de54:
/* 0x0004DE54 0x800BDA54 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004DE58 0x800BDA58 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DE5C 0x800BDA5C 0x2442FB8C */ .word 0x2442FB8C # addiu $v0, $v0, -0x474
