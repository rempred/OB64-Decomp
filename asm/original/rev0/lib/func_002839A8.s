/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002839A8..0x002839C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: lw 0x8018FC10, set byte; ends jr$ra@0x002839BC + nop delay. */
/* 0x002839A8 0x802F35A8 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x002839AC 0x802F35AC 0x8C63FC10 */ .word 0x8C63FC10 # lw $v1, -0x3F0($v1)
/* 0x002839B0 0x802F35B0 0x10600002 */ .word 0x10600002 # beq $v1, $zero, 0x802F35BC
/* 0x002839B4 0x802F35B4 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x002839B8 0x802F35B8 0xA0620007 */ .word 0xA0620007 # sb $v0, 0x7($v1)
/* 0x002839BC 0x802F35BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002839C0 0x802F35C0 0x00000000 */ .word 0x00000000 # nop
