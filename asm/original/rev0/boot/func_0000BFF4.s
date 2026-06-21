/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000B030_00011000.s
 * z64 range: 0x0000BFF4..0x0000C024 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0000BFF4, size=48, kind=prologue */
func_0000BFF4:
/* 0x0000BFF4 0x8007BBF4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0000BFF8 0x8007BBF8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0000BFFC 0x8007BBFC 0x00803021 */ .word 0x00803021 # move $a2, $a0
/* 0x0000C000 0x8007BC00 0x00A03821 */ .word 0x00A03821 # move $a3, $a1
/* 0x0000C004 0x8007BC04 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x0000C008 0x8007BC08 0x2484E30C */ .word 0x2484E30C # addiu $a0, $a0, -0x1CF4
/* 0x0000C00C 0x8007BC0C 0x3C05800B */ .word 0x3C05800B # lui $a1, 0x800B
/* 0x0000C010 0x8007BC10 0x0C024D50 */ .word 0x0C024D50 # jal 0x80093540
/* 0x0000C014 0x8007BC14 0x24A5E324 */ .word 0x24A5E324 # addiu $a1, $a1, -0x1CDC
/* 0x0000C018 0x8007BC18 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0000C01C 0x8007BC1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000C020 0x8007BC20 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
