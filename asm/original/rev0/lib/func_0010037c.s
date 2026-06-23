/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x0010037C..0x00100390 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. 0x801B3E20-> lh +0x4CC; jr $ra/sltiu $v0,$v0,0x1 at 0x00100388-0x0010038C (returns flag==0). */
/* 0x0010037C 0x8016FF7C 0x3C02801B */ .word 0x3C02801B # lui $v0, 0x801B
/* 0x00100380 0x8016FF80 0x8C423E20 */ .word 0x8C423E20 # lw $v0, 0x3E20($v0)
/* 0x00100384 0x8016FF84 0x844204CC */ .word 0x844204CC # lh $v0, 0x4CC($v0)
/* 0x00100388 0x8016FF88 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0010038C 0x8016FF8C 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
