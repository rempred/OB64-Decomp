/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001AAC0..0x0001AAE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001AAC0, size=32, kind=prologue */
func_0001AAC0:
/* 0x0001AAC0 0x8008A6C0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001AAC4 0x8008A6C4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001AAC8 0x8008A6C8 0x3C04800B */ .word 0x3C04800B # lui $a0, 0x800B
/* 0x0001AACC 0x8008A6CC 0x0C022C74 */ .word 0x0C022C74 # jal 0x8008B1D0
/* 0x0001AAD0 0x8008A6D0 0x2484A040 */ .word 0x2484A040 # addiu $a0, $a0, -0x5FC0
/* 0x0001AAD4 0x8008A6D4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001AAD8 0x8008A6D8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001AADC 0x8008A6DC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
