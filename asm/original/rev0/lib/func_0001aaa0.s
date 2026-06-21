/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001AAA0..0x0001AAC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001AAA0, size=32, kind=prologue */
func_0001AAA0:
/* 0x0001AAA0 0x8008A6A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001AAA4 0x8008A6A4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001AAA8 0x8008A6A8 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x0001AAAC 0x8008A6AC 0x0C022C4C */ .word 0x0C022C4C # jal 0x8008B130
/* 0x0001AAB0 0x8008A6B0 0x2484A040 */ .word 0x2484A040 # addiu $a0, $a0, -0x5FC0
/* 0x0001AAB4 0x8008A6B4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001AAB8 0x8008A6B8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001AABC 0x8008A6BC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
