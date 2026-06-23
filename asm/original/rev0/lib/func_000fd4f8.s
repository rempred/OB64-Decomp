/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FD4F8..0x000FD524 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF: state toggle on +0x0($a0) (1->0->2, 2->FFFF); j 0x801B04DC internal; jr $ra@0x000FD51C. */
/* 0x000FD4F8 0x8016D0F8 0x94830000 */ .word 0x94830000 # lhu $v1, 0x0($a0)
/* 0x000FD4FC 0x8016D0FC 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x000FD500 0x8016D100 0x14620003 */ .word 0x14620003 # bne $v1, $v0, 0x8016D110
/* 0x000FD504 0x8016D104 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x000FD508 0x8016D108 0x0806C137 */ .word 0x0806C137 # j 0x801B04DC
/* 0x000FD50C 0x8016D10C 0xA4800000 */ .word 0xA4800000 # sh $zero, 0x0($a0)
/* 0x000FD510 0x8016D110 0x14620002 */ .word 0x14620002 # bne $v1, $v0, 0x8016D11C
/* 0x000FD514 0x8016D114 0x3402FFFF */ .word 0x3402FFFF # ori $v0, $zero, 0xFFFF
/* 0x000FD518 0x8016D118 0xA4820000 */ .word 0xA4820000 # sh $v0, 0x0($a0)
/* 0x000FD51C 0x8016D11C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FD520 0x8016D120 0x00000000 */ .word 0x00000000 # nop
