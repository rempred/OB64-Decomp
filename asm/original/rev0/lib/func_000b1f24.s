/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B1F24..0x000B1F4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless/leaf split at jr $ra boundary; overlay-relocated (linear RAM column is wrong map). */
/* function boundary candidate: func_000B1F24, size=40, kind=prologue */
func_000B1F24:
/* 0x000B1F24 0x80121B24 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000B1F28 0x80121B28 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000B1F2C 0x80121B2C 0x308200FF */ .word 0x308200FF # andi $v0, $a0, 0x00FF
/* 0x000B1F30 0x80121B30 0x30A600FF */ .word 0x30A600FF # andi $a2, $a1, 0x00FF
/* 0x000B1F34 0x80121B34 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x000B1F38 0x80121B38 0x0C07153B */ .word 0x0C07153B # jal 0x801C54EC
/* 0x000B1F3C 0x80121B3C 0x00402821 */ .word 0x00402821 # move $a1, $v0
/* 0x000B1F40 0x80121B40 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000B1F44 0x80121B44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B1F48 0x80121B48 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
