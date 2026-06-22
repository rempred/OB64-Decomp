/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DD4C..0x0004DD58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf accessor (lui+jr $ra+addiu returns global addr), un-merged from parent 0x0004DD20 */
func_0004dd4c:
/* 0x0004DD4C 0x800BD94C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004DD50 0x800BD950 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DD54 0x800BD954 0x2442FB64 */ .word 0x2442FB64 # addiu $v0, $v0, -0x49C
