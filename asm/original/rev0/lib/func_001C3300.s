/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C3300..0x001C332C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_001C3300, size=44, kind=prologue */
func_001C3300:
/* 0x001C3300 0x80232F00 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001C3304 0x80232F04 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001C3308 0x80232F08 0x0C061884 */ .word 0x0C061884 # jal 0x80186210
/* 0x001C330C 0x80232F0C 0x24040021 */ .word 0x24040021 # addiu $a0, $zero, 0x21
/* 0x001C3310 0x80232F10 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x80232F20
/* 0x001C3314 0x80232F14 0x00000000 */ .word 0x00000000 # nop
/* 0x001C3318 0x80232F18 0x0C0886D7 */ .word 0x0C0886D7 # jal 0x80221B5C
/* 0x001C331C 0x80232F1C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C3320 0x80232F20 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001C3324 0x80232F24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001C3328 0x80232F28 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
