/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00143178..0x00143180 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Double 0x3FD00000 00000000 (=0.25). 8-byte const. [name-token: float_double_0_25_c]. */
/* 0x00143178 0x801B2D78 0x3FD00000 */ .word 0x3FD00000 # lui $s0, 0x0000
/* 0x0014317C 0x801B2D7C 0x00000000 */ .word 0x00000000 # nop
