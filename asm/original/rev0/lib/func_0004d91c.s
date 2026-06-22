/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D91C..0x0004D938 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4D930 + delay 0x4D934. */
/* function boundary candidate: func_0004D91C, size=28, kind=prologue */
func_0004D91C:
/* 0x0004D91C 0x800BD51C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004D920 0x800BD520 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004D924 0x800BD524 0x0C066CB8 */ .word 0x0C066CB8 # jal 0x8019B2E0
/* 0x0004D928 0x800BD528 0x00000000 */ .word 0x00000000 # nop
/* 0x0004D92C 0x800BD52C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004D930 0x800BD530 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D934 0x800BD534 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
