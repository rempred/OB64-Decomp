/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x001427D0..0x001427E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Doubles: 0x3FF00000 00000000 (=1.0) then 0x401921FB 54442D18 (=pi, 3.14159). IEEE-754 double const pool, 8-byte pairs. [name-token: float_pool_double_1_0_pi]. */
/* 0x001427D0 0x801B23D0 0x3FF00000 */ .word 0x3FF00000 # lui $s0, 0x0000
/* 0x001427D4 0x801B23D4 0x00000000 */ .word 0x00000000 # nop
/* 0x001427D8 0x801B23D8 0x401921FB */ .word 0x401921FB # mfc0 $t9, $4
/* 0x001427DC 0x801B23DC 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x801BD840
