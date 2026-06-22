/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D8F8..0x0004D91C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4D914 + delay 0x4D918. */
/* function boundary candidate: func_0004D8F8, size=36, kind=prologue */
func_0004D8F8:
/* 0x0004D8F8 0x800BD4F8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004D8FC 0x800BD4FC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004D900 0x800BD500 0x0C05CD84 */ .word 0x0C05CD84 # jal 0x80173610
/* 0x0004D904 0x800BD504 0x00000000 */ .word 0x00000000 # nop
/* 0x0004D908 0x800BD508 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004D90C 0x800BD50C 0x2442FB20 */ .word 0x2442FB20 # addiu $v0, $v0, -0x4E0
/* 0x0004D910 0x800BD510 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004D914 0x800BD514 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D918 0x800BD518 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
