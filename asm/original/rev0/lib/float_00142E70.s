/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142E70..0x00142E80 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Doubles: 0x401921FB54442D18 (pi) and 0x3FF00000 00000000 (1.0). 8-byte const pairs. [name-token: float_pool_pi_1_0]. */
/* 0x00142E70 0x801B2A70 0x401921FB */ .word 0x401921FB # mfc0 $t9, $4
/* 0x00142E74 0x801B2A74 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x801BDED8
/* 0x00142E78 0x801B2A78 0x3FF00000 */ .word 0x3FF00000 # lui $s0, 0x0000
/* 0x00142E7C 0x801B2A7C 0x00000000 */ .word 0x00000000 # nop
