/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DC04..0x0004DC20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x0004DC18 + delay slot 0x0004DC1C */
/* function boundary candidate: func_0004DC04, size=28, kind=prologue */
func_0004DC04:
/* 0x0004DC04 0x800BD804 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DC08 0x800BD808 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DC0C 0x800BD80C 0x0C07B9C6 */ .word 0x0C07B9C6 # jal 0x801EE718
/* 0x0004DC10 0x800BD810 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DC14 0x800BD814 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DC18 0x800BD818 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DC1C 0x800BD81C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
