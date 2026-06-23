/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x00100390..0x001003A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. 0x801B3E20-> lh +0x4CC; jr $ra/sltu $v0,$zero,$v0 at 0x0010039C-0x001003A0 (returns flag!=0). */
/* 0x00100390 0x8016FF90 0x3C02801B */ .word 0x3C02801B # lui $v0, 0x801B
/* 0x00100394 0x8016FF94 0x8C423E20 */ .word 0x8C423E20 # lw $v0, 0x3E20($v0)
/* 0x00100398 0x8016FF98 0x844204CC */ .word 0x844204CC # lh $v0, 0x4CC($v0)
/* 0x0010039C 0x8016FF9C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001003A0 0x8016FFA0 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
