/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00224790..0x002247CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed (addiu $sp,-0x18). Reads 0x8019:76E8 table flag, conditional jal 0x801E14FC. jr$ra at 0x002247C4 + delay (addiu $sp,0x18) at 0x002247C8. Plan idx28 over-merged this with the following frameless leaf; un-merged at the jr+delay. */
/* function boundary candidate: func_00224790, size=208, kind=prologue */
func_00224790:
/* 0x00224790 0x80294390 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00224794 0x80294394 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00224798 0x80294398 0x244276E8 */ .word 0x244276E8 # addiu $v0, $v0, 0x76E8
/* 0x0022479C 0x8029439C 0x14800002 */ .word 0x14800002 # bne $a0, $zero, 0x802943A8
/* 0x002247A0 0x802943A0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002247A4 0x802943A4 0x2442FFF4 */ .word 0x2442FFF4 # addiu $v0, $v0, -0xC
/* 0x002247A8 0x802943A8 0x90420001 */ .word 0x90420001 # lbu $v0, 0x1($v0)
/* 0x002247AC 0x802943AC 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x002247B0 0x802943B0 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x802943C0
/* 0x002247B4 0x802943B4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002247B8 0x802943B8 0x0C07853F */ .word 0x0C07853F # jal 0x801E14FC
/* 0x002247BC 0x802943BC 0x00000000 */ .word 0x00000000 # nop
/* 0x002247C0 0x802943C0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002247C4 0x802943C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002247C8 0x802943C8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
