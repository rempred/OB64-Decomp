/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BF2A8..0x001BF2E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: scans the 4-entry 0x8023A4E0 table (stride 0x5C) for the first zero slot, returns its index or 0. jr$ra at 0x1BF2D8 + delay nop 0x1BF2DC. */
func_001BF2A8:
/* 0x001BF2A8 0x8022EEA8 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x001BF2AC 0x8022EEAC 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x001BF2B0 0x8022EEB0 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x001BF2B4 0x8022EEB4 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x001BF2B8 0x8022EEB8 0x8C42A4E0 */ .word 0x8C42A4E0 # lw $v0, -0x5B20($v0)
/* 0x001BF2BC 0x8022EEBC 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x8022EED8
/* 0x001BF2C0 0x8022EEC0 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001BF2C4 0x8022EEC4 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x001BF2C8 0x8022EEC8 0x28820004 */ .word 0x28820004 # slti $v0, $a0, 0x4
/* 0x001BF2CC 0x8022EECC 0x1440FFF8 */ .word 0x1440FFF8 # bne $v0, $zero, 0x8022EEB0
/* 0x001BF2D0 0x8022EED0 0x2463005C */ .word 0x2463005C # addiu $v1, $v1, 0x5C
/* 0x001BF2D4 0x8022EED4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x001BF2D8 0x8022EED8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BF2DC 0x8022EEDC 0x00000000 */ .word 0x00000000 # nop
