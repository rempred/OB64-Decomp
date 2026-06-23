/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x000FBED4..0x000FBF00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF: indexes 0x801B3E20 table by $a0*5*4, writes +0x214/+0x218/+0x208; jr $ra@0x000FBEF8. */
/* 0x000FBED4 0x8016BAD4 0x3C02801B */ .word 0x3C02801B # lui $v0, 0x801B
/* 0x000FBED8 0x8016BAD8 0x8C423E20 */ .word 0x8C423E20 # lw $v0, 0x3E20($v0)
/* 0x000FBEDC 0x8016BADC 0x00041880 */ .word 0x00041880 # sll $v1, $a0, 2
/* 0x000FBEE0 0x8016BAE0 0x00641821 */ .word 0x00641821 # addu $v1, $v1, $a0
/* 0x000FBEE4 0x8016BAE4 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x000FBEE8 0x8016BAE8 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x000FBEEC 0x8016BAEC 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x000FBEF0 0x8016BAF0 0xAC400214 */ .word 0xAC400214 # sw $zero, 0x214($v0)
/* 0x000FBEF4 0x8016BAF4 0xAC450218 */ .word 0xAC450218 # sw $a1, 0x218($v0)
/* 0x000FBEF8 0x8016BAF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000FBEFC 0x8016BAFC 0xA4430208 */ .word 0xA4430208 # sh $v1, 0x208($v0)
