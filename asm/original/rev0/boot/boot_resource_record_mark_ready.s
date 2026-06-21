/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000AF7C_00011000.s
 * z64 range: 0x0000AF7C..0x0000AFAC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0000AF7C, size=48, kind=prologue */
func_0000AF7C:
/* 0x0000AF7C 0x8007AB7C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0000AF80 0x8007AB80 0x00802821 */ .word 0x00802821 # move $a1, $a0
/* 0x0000AF84 0x8007AB84 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0000AF88 0x8007AB88 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x0000AF8C 0x8007AB8C 0x2484F320 */ .word 0x2484F320 # addiu $a0, $a0, -0xCE0
/* 0x0000AF90 0x8007AB90 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x0000AF94 0x8007AB94 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0000AF98 0x8007AB98 0x0C024E04 */ .word 0x0C024E04 # jal 0x80093810
/* 0x0000AF9C 0x8007AB9C 0xA0A20008 */ .word 0xA0A20008 # sb $v0, 0x8($a1)
/* 0x0000AFA0 0x8007ABA0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0000AFA4 0x8007ABA4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000AFA8 0x8007ABA8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
