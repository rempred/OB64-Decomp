/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142B50..0x00142B58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single double 0x3FD00000 00000000 (=0.25). [name-token: float_double_0_25_b]. */
/* 0x00142B50 0x801B2750 0x3FD00000 */ .word 0x3FD00000 # lui $s0, 0x0000
/* 0x00142B54 0x801B2754 0x00000000 */ .word 0x00000000 # nop
