/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BFA4..0x0020BFE4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf addiu$sp,-0x18; j 0x801C8B48 tail + jr$ra at BFDC/delay BFE0. */
/* function boundary candidate: func_0020BFA4, size=172, kind=prologue */
func_0020BFA4:
/* 0x0020BFA4 0x8027BBA4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020BFA8 0x8027BBA8 0x14800003 */ .word 0x14800003 # bne $a0, $zero, 0x8027BBB8
/* 0x0020BFAC 0x8027BBAC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020BFB0 0x8027BBB0 0x080722D2 */ .word 0x080722D2 # j 0x801C8B48
/* 0x0020BFB4 0x8027BBB4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020BFB8 0x8027BBB8 0x0C0722E1 */ .word 0x0C0722E1 # jal 0x801C8B84
/* 0x0020BFBC 0x8027BBBC 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BFC0 0x8027BBC0 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x0020BFC4 0x8027BBC4 0x246376E8 */ .word 0x246376E8 # addiu $v1, $v1, 0x76E8
/* 0x0020BFC8 0x8027BBC8 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x8027BBD0
/* 0x0020BFCC 0x8027BBCC 0x2463FFF4 */ .word 0x2463FFF4 # addiu $v1, $v1, -0xC
/* 0x0020BFD0 0x8027BBD0 0x90620001 */ .word 0x90620001 # lbu $v0, 0x1($v1)
/* 0x0020BFD4 0x8027BBD4 0x30420002 */ .word 0x30420002 # andi $v0, $v0, 0x0002
/* 0x0020BFD8 0x8027BBD8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020BFDC 0x8027BBDC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BFE0 0x8027BBE0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
