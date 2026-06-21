/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000B030_00011000.s
 * z64 range: 0x0000BFC0..0x0000BFF4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0000BFC0, size=52, kind=prologue */
func_0000BFC0:
/* 0x0000BFC0 0x8007BBC0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0000BFC4 0x8007BBC4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0000BFC8 0x8007BBC8 0x00803821 */ .word 0x00803821 # move $a3, $a0
/* 0x0000BFCC 0x8007BBCC 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x0000BFD0 0x8007BBD0 0x2484E30C */ .word 0x2484E30C # addiu $a0, $a0, -0x1CF4
/* 0x0000BFD4 0x8007BBD4 0x3C05800B */ .word 0x3C05800B # lui $a1, 0x800B
/* 0x0000BFD8 0x8007BBD8 0x24A5E324 */ .word 0x24A5E324 # addiu $a1, $a1, -0x1CDC
/* 0x0000BFDC 0x8007BBDC 0x3C06800B */ .word 0x3C06800B # lui $a2, 0x800B
/* 0x0000BFE0 0x8007BBE0 0x0C024D50 */ .word 0x0C024D50 # jal 0x80093540
/* 0x0000BFE4 0x8007BBE4 0x24C6E334 */ .word 0x24C6E334 # addiu $a2, $a2, -0x1CCC
/* 0x0000BFE8 0x8007BBE8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0000BFEC 0x8007BBEC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000BFF0 0x8007BBF0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
