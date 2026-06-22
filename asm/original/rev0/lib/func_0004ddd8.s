/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DDD8..0x0004DDE4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf accessor (lui+jr $ra+addiu returns global addr), un-merged from parent 0x0004DDBC */
func_0004ddd8:
/* 0x0004DDD8 0x800BD9D8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004DDDC 0x800BD9DC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DDE0 0x800BD9E0 0x2442FB78 */ .word 0x2442FB78 # addiu $v0, $v0, -0x488
