/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00144C50..0x00144C58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Double 0xC01921FB 54442D18 (= -pi, -3.14159), embedded mid pointer-region as an 8-byte const. [name-token: float_double_neg_pi]. */
/* 0x00144C50 0x801B4850 0xC01921FB */ .word 0xC01921FB # ll $t9, 0x21FB($zero)
/* 0x00144C54 0x801B4854 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x801BFCB8
