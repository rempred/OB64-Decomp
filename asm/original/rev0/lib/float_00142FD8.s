/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142FD8..0x00143000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Double const pool: 0x400921FB54442D18 (2*pi) repeated 4x, then 0x3FE00000 (0.5); trailing zero word at 0x142FFC. Const pool only. [name-token: float_pool_consts_e]. */
/* 0x00142FD8 0x801B2BD8 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00142FDC 0x801B2BDC 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x801BE040
/* 0x00142FE0 0x801B2BE0 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00142FE4 0x801B2BE4 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x801BE048
/* 0x00142FE8 0x801B2BE8 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00142FEC 0x801B2BEC 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x801BE050
/* 0x00142FF0 0x801B2BF0 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00142FF4 0x801B2BF4 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x801BE058
/* 0x00142FF8 0x801B2BF8 0x3FE00000 */ .word 0x3FE00000 # lui $zero, 0x0000
/* 0x00142FFC 0x801B2BFC 0x00000000 */ .word 0x00000000 # nop
