/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000B1F00..0x000B1F24 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless/leaf split at jr $ra boundary; overlay-relocated (linear RAM column is wrong map). */
/* function boundary candidate: func_000B1F00, size=36, kind=prologue */
func_000B1F00:
/* 0x000B1F00 0x80121B00 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000B1F04 0x80121B04 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000B1F08 0x80121B08 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x000B1F0C 0x80121B0C 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x000B1F10 0x80121B10 0x0C07153B */ .word 0x0C07153B # jal 0x801C54EC
/* 0x000B1F14 0x80121B14 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x000B1F18 0x80121B18 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000B1F1C 0x80121B1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000B1F20 0x80121B20 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
