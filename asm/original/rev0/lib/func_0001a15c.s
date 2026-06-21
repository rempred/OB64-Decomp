/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A15C..0x0001A17C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A15C, size=32, kind=prologue */
func_0001A15C:
/* 0x0001A15C 0x80089D5C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A160 0x80089D60 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A164 0x80089D64 0x24047F00 */ .word 0x24047F00 # addiu $a0, $zero, 0x7F00
/* 0x0001A168 0x80089D68 0x0C02273E */ .word 0x0C02273E # jal 0x80089CF8
/* 0x0001A16C 0x80089D6C 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0001A170 0x80089D70 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A174 0x80089D74 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A178 0x80089D78 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
