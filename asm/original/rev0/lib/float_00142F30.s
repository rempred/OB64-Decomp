/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00142F30..0x00142F38 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 single-float pair 0x3F847AE1 / 0x47AE147B. 8 bytes. [name-token: float_single_pair_a]. */
/* 0x00142F30 0x801B2B30 0x3F847AE1 */ .word 0x3F847AE1 # lui $a0, 0x7AE1
/* 0x00142F34 0x801B2B34 0x47AE147B */ .word 0x47AE147B # c.0xB.fmt29 $f2, $f14
