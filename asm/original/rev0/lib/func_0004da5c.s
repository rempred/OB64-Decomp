/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DA5C..0x0004DA78 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4DA70 + delay 0x4DA74. Un-merged from parent file 96 which over-ran into following frameless leaf. */
/* function boundary candidate: func_0004DA5C, size=40, kind=prologue */
func_0004DA5C:
/* 0x0004DA5C 0x800BD65C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DA60 0x800BD660 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DA64 0x800BD664 0x0C066DB6 */ .word 0x0C066DB6 # jal 0x8019B6D8
/* 0x0004DA68 0x800BD668 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DA6C 0x800BD66C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DA70 0x800BD670 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DA74 0x800BD674 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
