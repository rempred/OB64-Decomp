/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DA40..0x0004DA5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4DA54 + delay 0x4DA58. */
/* function boundary candidate: func_0004DA40, size=28, kind=prologue */
func_0004DA40:
/* 0x0004DA40 0x800BD640 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DA44 0x800BD644 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DA48 0x800BD648 0x0C067552 */ .word 0x0C067552 # jal 0x8019D548
/* 0x0004DA4C 0x800BD64C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DA50 0x800BD650 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DA54 0x800BD654 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DA58 0x800BD658 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
