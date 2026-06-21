/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000B030_00011000.s
 * z64 range: 0x0000BF90..0x0000BFC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0000BF90, size=48, kind=prologue */
func_0000BF90:
/* 0x0000BF90 0x8007BB90 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0000BF94 0x8007BB94 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0000BF98 0x8007BB98 0x00803021 */ .word 0x00803021 # move $a2, $a0
/* 0x0000BF9C 0x8007BB9C 0x00A03821 */ .word 0x00A03821 # move $a3, $a1
/* 0x0000BFA0 0x8007BBA0 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x0000BFA4 0x8007BBA4 0x2484E30C */ .word 0x2484E30C # addiu $a0, $a0, -0x1CF4
/* 0x0000BFA8 0x8007BBA8 0x3C05800B */ .word 0x3C05800B # lui $a1, 0x800B
/* 0x0000BFAC 0x8007BBAC 0x0C024D50 */ .word 0x0C024D50 # jal 0x80093540
/* 0x0000BFB0 0x8007BBB0 0x24A5E31C */ .word 0x24A5E31C # addiu $a1, $a1, -0x1CE4
/* 0x0000BFB4 0x8007BBB4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0000BFB8 0x8007BBB8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000BFBC 0x8007BBBC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
