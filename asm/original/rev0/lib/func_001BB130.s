/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB130..0x001BB150 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny framed leaf: addiu $sp,-0x18; jal 0x80093380(a1=0x38); jr $ra(0x1BB148)+delay addiu $sp,0x18(0x1BB14C). Returns v0=1. */
func_001BB130:
/* function boundary candidate: func_001BB130, size=32, kind=prologue */
func_001BB130:
/* 0x001BB130 0x8022AD30 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001BB134 0x8022AD34 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001BB138 0x8022AD38 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x001BB13C 0x8022AD3C 0x24050038 */ .word 0x24050038 # addiu $a1, $zero, 0x38
/* 0x001BB140 0x8022AD40 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001BB144 0x8022AD44 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001BB148 0x8022AD48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB14C 0x8022AD4C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
