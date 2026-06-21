/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000192FC..0x00019308 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000192FC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000192fc:
/* 0x000192FC 0x80088EFC 0x3C02800F */ .word 0x3C02800F # lui $v0, 0x800F
/* 0x00019300 0x80088F00 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00019304 0x80088F04 0x24428B4C */ .word 0x24428B4C # addiu $v0, $v0, -0x74B4
