/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000192F0..0x000192FC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000192F0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000192f0:
/* 0x000192F0 0x80088EF0 0x3C02800F */ .word 0x3C02800F # lui $v0, 0x800F
/* 0x000192F4 0x80088EF4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000192F8 0x80088EF8 0x24428B14 */ .word 0x24428B14 # addiu $v0, $v0, -0x74EC
