/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x001003A4..0x001003B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. 0x801B3E20-> lh +0x4E8; jr $ra/sltiu $v0,$v0,0x1 at 0x001003B0-0x001003B4. */
/* 0x001003A4 0x8016FFA4 0x3C02801B */ .word 0x3C02801B # lui $v0, 0x801B
/* 0x001003A8 0x8016FFA8 0x8C423E20 */ .word 0x8C423E20 # lw $v0, 0x3E20($v0)
/* 0x001003AC 0x8016FFAC 0x844204E8 */ .word 0x844204E8 # lh $v0, 0x4E8($v0)
/* 0x001003B0 0x8016FFB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001003B4 0x8016FFB4 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
