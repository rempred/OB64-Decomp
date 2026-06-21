/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00011F08..0x00011F60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00011F08, size=88, kind=leaf */
func_00011F08:
/* 0x00011F08 0x80081B08 0x14800003 */ .word 0x14800003 # bne $a0, $zero, 0x80081B18

/* function boundary candidate: func_00011F0C, size=84, kind=prologue */
func_00011F0C:
/* 0x00011F0C 0x80081B0C 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00011F10 0x80081B10 0x080206D6 */ .word 0x080206D6 # j 0x80081B58
/* 0x00011F14 0x80081B14 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00011F18 0x80081B18 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x00011F1C 0x80081B1C 0x3C07800B */ .word 0x3C07800B # lui $a3, 0x800B
/* 0x00011F20 0x80081B20 0x8CE71804 */ .word 0x8CE71804 # lw $a3, 0x1804($a3)
/* 0x00011F24 0x80081B24 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00011F28 0x80081B28 0x8C63180C */ .word 0x8C63180C # lw $v1, 0x180C($v1)
/* 0x00011F2C 0x80081B2C 0x18E00009 */ .word 0x18E00009 # blez $a3, 0x80081B54
/* 0x00011F30 0x80081B30 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00011F34 0x80081B34 0x8C620044 */ .word 0x8C620044 # lw $v0, 0x44($v1)
/* 0x00011F38 0x80081B38 0x24C60001 */ .word 0x24C60001 # addiu $a2, $a2, 0x1
/* 0x00011F3C 0x80081B3C 0x00441026 */ .word 0x00441026 # xor $v0, $v0, $a0
/* 0x00011F40 0x80081B40 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x00011F44 0x80081B44 0x00A22821 */ .word 0x00A22821 # addu $a1, $a1, $v0
/* 0x00011F48 0x80081B48 0x00C7102A */ .word 0x00C7102A # slt $v0, $a2, $a3
/* 0x00011F4C 0x80081B4C 0x1440FFF9 */ .word 0x1440FFF9 # bne $v0, $zero, 0x80081B34
/* 0x00011F50 0x80081B50 0x2463013C */ .word 0x2463013C # addiu $v1, $v1, 0x13C
/* 0x00011F54 0x80081B54 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x00011F58 0x80081B58 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00011F5C 0x80081B5C 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
