/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101CC8..0x00101CD4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Continuation of the FLOAT64 const pool: 0x3FF921FB_54442D18 = pi/2 (repeat), then 0x40040000_00000000 = 2.5. Big-endian doubles. [name-token: float_double_const_pool2]. */
/* 0x00101CC8 0x801718C8 0x3FF921FB */ .word 0x3FF921FB # lui $t9, 0x21FB
/* 0x00101CCC 0x801718CC 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8017CD30
/* 0x00101CD0 0x801718D0 0x40040000 */ .word 0x40040000 # mfc0 $a0, $0
