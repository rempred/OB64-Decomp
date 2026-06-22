/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E19C..0x0004E1B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x0004E19C (40B); real func ends jr $ra at 0x0004E1B0 + delay 0x0004E1B4 */
/* function boundary candidate: func_0004E19C, size=40, kind=prologue */
func_0004E19C:
/* 0x0004E19C 0x800BDD9C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E1A0 0x800BDDA0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E1A4 0x800BDDA4 0x0C089B30 */ .word 0x0C089B30 # jal 0x80226CC0
/* 0x0004E1A8 0x800BDDA8 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E1AC 0x800BDDAC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E1B0 0x800BDDB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E1B4 0x800BDDB4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
