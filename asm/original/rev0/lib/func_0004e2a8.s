/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E2A8..0x0004E2D8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue; jr $ra at 0x0004E2D0 + delay 0x0004E2D4 */
/* function boundary candidate: func_0004E2A8, size=48, kind=prologue */
func_0004E2A8:
/* 0x0004E2A8 0x800BDEA8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E2AC 0x800BDEAC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E2B0 0x800BDEB0 0x0C07502C */ .word 0x0C07502C # jal 0x801D40B0
/* 0x0004E2B4 0x800BDEB4 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E2B8 0x800BDEB8 0x24030064 */ .word 0x24030064 # addiu $v1, $zero, 0x64
/* 0x0004E2BC 0x800BDEBC 0x14430003 */ .word 0x14430003 # bne $v0, $v1, 0x800BDECC
/* 0x0004E2C0 0x800BDEC0 0x3402FFFD */ .word 0x3402FFFD # ori $v0, $zero, 0xFFFD
/* 0x0004E2C4 0x800BDEC4 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0004E2C8 0x800BDEC8 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x0004E2CC 0x800BDECC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E2D0 0x800BDED0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E2D4 0x800BDED4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
