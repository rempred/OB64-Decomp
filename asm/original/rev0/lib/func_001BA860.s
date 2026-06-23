/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BA860..0x001BA87C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny framed leaf (~28B). addiu sp,-0x18; jal 0x80093380 (a1=0x38). jr ra at 0x001BA874 + delay (addiu sp,0x18) at 0x001BA878. */
func_001BA860:
/* function boundary candidate: func_001BA860, size=28, kind=prologue */
func_001BA860:
/* 0x001BA860 0x8022A460 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001BA864 0x8022A464 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001BA868 0x8022A468 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x001BA86C 0x8022A46C 0x24050038 */ .word 0x24050038 # addiu $a1, $zero, 0x38
/* 0x001BA870 0x8022A470 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001BA874 0x8022A474 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BA878 0x8022A478 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
