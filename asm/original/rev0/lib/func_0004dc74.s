/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DC74..0x0004DC80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf accessor (lui+jr $ra+addiu returns global addr), un-merged from parent 0x0004DC20 */
func_0004dc74:
/* 0x0004DC74 0x800BD874 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004DC78 0x800BD878 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DC7C 0x800BD87C 0x2442FB50 */ .word 0x2442FB50 # addiu $v0, $v0, -0x4B0
