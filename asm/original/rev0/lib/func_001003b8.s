/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x001003B8..0x001003CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. 0x801B3E20-> lh +0x4E8; jr $ra/sltu $v0,$zero,$v0 at 0x001003C4-0x001003C8. LAST FUNCTION: ends exactly at 0x001003CC (data region follows). */
/* 0x001003B8 0x8016FFB8 0x3C02801B */ .word 0x3C02801B # lui $v0, 0x801B
/* 0x001003BC 0x8016FFBC 0x8C423E20 */ .word 0x8C423E20 # lw $v0, 0x3E20($v0)
/* 0x001003C0 0x8016FFC0 0x844204E8 */ .word 0x844204E8 # lh $v0, 0x4E8($v0)
/* 0x001003C4 0x8016FFC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001003C8 0x8016FFC8 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
