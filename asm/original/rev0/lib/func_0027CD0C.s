/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x0027CD0C..0x0027CD40 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small framed function (addiu $sp,-0x18). jal chain 0x80226980 / 0x801CBF44 / 0x802283C0, sign-extends result. jr $ra at 0x27CD38, delay 0x27CD3C. */
func_0027CD0C:
/* function boundary candidate: func_0027CD0C, size=52, kind=prologue */
func_0027CD0C:
/* 0x0027CD0C 0x802EC90C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0027CD10 0x802EC910 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0027CD14 0x802EC914 0x0C089A60 */ .word 0x0C089A60 # jal 0x80226980
/* 0x0027CD18 0x802EC918 0x00000000 */ .word 0x00000000 # nop
/* 0x0027CD1C 0x802EC91C 0x0C072FD1 */ .word 0x0C072FD1 # jal 0x801CBF44
/* 0x0027CD20 0x802EC920 0x00000000 */ .word 0x00000000 # nop
/* 0x0027CD24 0x802EC924 0x0C08A0F0 */ .word 0x0C08A0F0 # jal 0x802283C0
/* 0x0027CD28 0x802EC928 0x00000000 */ .word 0x00000000 # nop
/* 0x0027CD2C 0x802EC92C 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x0027CD30 0x802EC930 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0027CD34 0x802EC934 0x00021403 */ .word 0x00021403 # sra $v0, $v0, 16
/* 0x0027CD38 0x802EC938 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0027CD3C 0x802EC93C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
