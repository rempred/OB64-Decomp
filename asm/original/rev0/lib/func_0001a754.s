/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A754..0x0001A77C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A754, size=40, kind=prologue */
func_0001A754:
/* 0x0001A754 0x8008A354 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A758 0x8008A358 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A75C 0x8008A35C 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x0001A760 0x8008A360 0x24849BF0 */ .word 0x24849BF0 # addiu $a0, $a0, -0x6410
/* 0x0001A764 0x8008A364 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0001A768 0x8008A368 0x0C024E04 */ .word 0x0C024E04 # jal 0x80093810
/* 0x0001A76C 0x8008A36C 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x0001A770 0x8008A370 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A774 0x8008A374 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A778 0x8008A378 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
