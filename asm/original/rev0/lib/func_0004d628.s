/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D628..0x0004D634 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: lui $v0; jr $ra at 0x4D62C + delay addiu $v0. Un-merged from parent file 87. */
func_0004d628:
/* 0x0004D628 0x800BD228 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004D62C 0x800BD22C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D630 0x800BD230 0x2442FB0C */ .word 0x2442FB0C # addiu $v0, $v0, -0x4F4
