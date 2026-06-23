/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142850..0x00142858 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Single double 0x3FD00000 00000000 (=0.25). 8-byte const. [name-token: float_double_0_25]. */
/* 0x00142850 0x801B2450 0x3FD00000 */ .word 0x3FD00000 # lui $s0, 0x0000
/* 0x00142854 0x801B2454 0x00000000 */ .word 0x00000000 # nop
