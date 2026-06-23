/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00281ED0..0x00281F10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf; ends jr $ra 0x00281F08 + delay 0x00281F0C. The 4 words at 0x00281F10 start the next function's read-before-write preamble and are carved off. */
/* function boundary candidate: func_00281ED0, size=64, kind=prologue */
func_00281ED0:
/* 0x00281ED0 0x802F1AD0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00281ED4 0x802F1AD4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00281ED8 0x802F1AD8 0x0C022684 */ .word 0x0C022684 # jal 0x80089A10
/* 0x00281EDC 0x802F1ADC 0x00000000 */ .word 0x00000000 # nop
/* 0x00281EE0 0x802F1AE0 0x0C08BC68 */ .word 0x0C08BC68 # jal 0x8022F1A0
/* 0x00281EE4 0x802F1AE4 0x00000000 */ .word 0x00000000 # nop
/* 0x00281EE8 0x802F1AE8 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00281EEC 0x802F1AEC 0x8C42F1A4 */ .word 0x8C42F1A4 # lw $v0, -0xE5C($v0)
/* 0x00281EF0 0x802F1AF0 0x14400002 */ .word 0x14400002 # bne $v0, $zero, 0x802F1AFC
/* 0x00281EF4 0x802F1AF4 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x00281EF8 0x802F1AF8 0x3402FFFE */ .word 0x3402FFFE # ori $v0, $zero, 0xFFFE
/* 0x00281EFC 0x802F1AFC 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x00281F00 0x802F1B00 0xA4224C26 */ .word 0xA4224C26 # sh $v0, 0x4C26($at)
/* 0x00281F04 0x802F1B04 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00281F08 0x802F1B08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00281F0C 0x802F1B0C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
