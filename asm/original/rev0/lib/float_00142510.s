/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142510..0x00142530 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8 words = four identical IEEE-754 single-float pairs 0x3F947AE1 / 0x47AE147B (approx 1.1601 / 89000.96), repeated 4x. Const pool, not pointers/ascii. [name-token: float_pool_pair_repeat]. */
/* 0x00142510 0x801B2110 0x3F947AE1 */ .word 0x3F947AE1 # lui $s4, 0x7AE1
/* 0x00142514 0x801B2114 0x47AE147B */ .word 0x47AE147B # c.0xB.fmt29 $f2, $f14
/* 0x00142518 0x801B2118 0x3F947AE1 */ .word 0x3F947AE1 # lui $s4, 0x7AE1
/* 0x0014251C 0x801B211C 0x47AE147B */ .word 0x47AE147B # c.0xB.fmt29 $f2, $f14
/* 0x00142520 0x801B2120 0x3F947AE1 */ .word 0x3F947AE1 # lui $s4, 0x7AE1
/* 0x00142524 0x801B2124 0x47AE147B */ .word 0x47AE147B # c.0xB.fmt29 $f2, $f14
/* 0x00142528 0x801B2128 0x3F947AE1 */ .word 0x3F947AE1 # lui $s4, 0x7AE1
/* 0x0014252C 0x801B212C 0x47AE147B */ .word 0x47AE147B # c.0xB.fmt29 $f2, $f14
