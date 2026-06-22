/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DDA0..0x0004DDBC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x0004DDB4 + delay 0x0004DDB8 */
/* function boundary candidate: func_0004DDA0, size=28, kind=prologue */
func_0004DDA0:
/* 0x0004DDA0 0x800BD9A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DDA4 0x800BD9A4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DDA8 0x800BD9A8 0x0C069033 */ .word 0x0C069033 # jal 0x801A40CC
/* 0x0004DDAC 0x800BD9AC 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DDB0 0x800BD9B0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DDB4 0x800BD9B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DDB8 0x800BD9B8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
