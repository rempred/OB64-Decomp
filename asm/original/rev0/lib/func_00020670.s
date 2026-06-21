/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00020670..0x00020690 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00020670, size=32, kind=prologue */
func_00020670:
/* 0x00020670 0x80090270 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00020674 0x80090274 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x00020678 0x80090278 0x00802821 */ .word 0x00802821 # move $a1, $a0
/* 0x0002067C 0x8009027C 0x0C024183 */ .word 0x0C024183 # jal 0x8009060C
/* 0x00020680 0x80090280 0x27A40010 */ .word 0x27A40010 # addiu $a0, $sp, 0x10
/* 0x00020684 0x80090284 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x00020688 0x80090288 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002068C 0x8009028C 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
