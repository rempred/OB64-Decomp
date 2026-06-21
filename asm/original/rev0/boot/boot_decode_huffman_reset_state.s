/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000B030_00011000.s
 * z64 range: 0x0000D994..0x0000D9B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0000D994, size=36, kind=prologue */
func_0000D994:
/* 0x0000D994 0x8007D594 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0000D998 0x8007D598 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0000D99C 0x8007D59C 0x0C01F10E */ .word 0x0C01F10E # jal 0x8007C438
/* 0x0000D9A0 0x8007D5A0 0x00000000 */ .word 0x00000000 # nop
/* 0x0000D9A4 0x8007D5A4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x0000D9A8 0x8007D5A8 0xA420F3C6 */ .word 0xA420F3C6 # sh $zero, -0xC3A($at)
/* 0x0000D9AC 0x8007D5AC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0000D9B0 0x8007D5B0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000D9B4 0x8007D5B4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
