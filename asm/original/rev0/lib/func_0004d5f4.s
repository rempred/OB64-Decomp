/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D5F4..0x0004D600 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf: lui $v0; jr $ra at 0x4D5F8 + delay addiu $v0. Un-merged from parent file 86. */
func_0004d5f4:
/* 0x0004D5F4 0x800BD1F4 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004D5F8 0x800BD1F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D5FC 0x800BD1FC 0x2442FAF8 */ .word 0x2442FAF8 # addiu $v0, $v0, -0x508
