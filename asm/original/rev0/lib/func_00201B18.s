/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201B18..0x00201B38 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. sltiu/beq bounds check then lui/addu/lbu; jr$ra@0x00201B30 + delay nop@0x00201B34. */
func_00201B18:
/* 0x00201B18 0x80271718 0x2C8200A0 */ .word 0x2C8200A0 # sltiu $v0, $a0, 0xA0
/* 0x00201B1C 0x8027171C 0x10400004 */ .word 0x10400004 # beq $v0, $zero, 0x80271730
/* 0x00201B20 0x80271720 0x24020064 */ .word 0x24020064 # addiu $v0, $zero, 0x64
/* 0x00201B24 0x80271724 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00201B28 0x80271728 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201B2C 0x8027172C 0x9042EE14 */ .word 0x9042EE14 # lbu $v0, -0x11EC($v0)
/* 0x00201B30 0x80271730 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201B34 0x80271734 0x00000000 */ .word 0x00000000 # nop
