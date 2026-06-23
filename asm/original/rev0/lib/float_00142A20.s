/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142A20..0x00142A30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two doubles: 0x3FD80000 00000000 (=0.375) and 0x3FE40000 00000000 (=0.625). 8-byte const pairs. [name-token: float_pool_doubles_a]. */
/* 0x00142A20 0x801B2620 0x3FD80000 */ .word 0x3FD80000 # lui $t8, 0x0000
/* 0x00142A24 0x801B2624 0x00000000 */ .word 0x00000000 # nop
/* 0x00142A28 0x801B2628 0x3FE40000 */ .word 0x3FE40000 # lui $a0, 0x0000
/* 0x00142A2C 0x801B262C 0x00000000 */ .word 0x00000000 # nop
