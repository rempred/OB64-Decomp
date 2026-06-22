/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DA78..0x0004DA84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: lui $v0; jr $ra at 0x4DA7C + delay addiu $v0. Un-merged from parent file 96. */
func_0004da78:
/* 0x0004DA78 0x800BD678 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004DA7C 0x800BD67C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DA80 0x800BD680 0x2442FB38 */ .word 0x2442FB38 # addiu $v0, $v0, -0x4C8
