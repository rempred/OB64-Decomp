/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001B070..0x0001B0A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001B070, size=48, kind=prologue */
func_0001B070:
/* 0x0001B070 0x8008AC70 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001B074 0x8008AC74 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0001B078 0x8008AC78 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x0001B07C 0x8008AC7C 0x24040208 */ .word 0x24040208 # addiu $a0, $zero, 0x208
/* 0x0001B080 0x8008AC80 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0001B084 0x8008AC84 0x0C02273E */ .word 0x0C02273E # jal 0x80089CF8
/* 0x0001B088 0x8008AC88 0x02002821 */ .word 0x02002821 # move $a1, $s0
/* 0x0001B08C 0x8008AC8C 0xAE020008 */ .word 0xAE020008 # sw $v0, 0x8($s0)
/* 0x0001B090 0x8008AC90 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0001B094 0x8008AC94 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0001B098 0x8008AC98 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001B09C 0x8008AC9C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
