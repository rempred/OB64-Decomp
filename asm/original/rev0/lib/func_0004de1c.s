/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DE1C..0x0004DE38 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x0004DE30 + delay 0x0004DE34 */
/* function boundary candidate: func_0004DE1C, size=28, kind=prologue */
func_0004DE1C:
/* 0x0004DE1C 0x800BDA1C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DE20 0x800BDA20 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DE24 0x800BDA24 0x0C06968D */ .word 0x0C06968D # jal 0x801A5A34
/* 0x0004DE28 0x800BDA28 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DE2C 0x800BDA2C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DE30 0x800BDA30 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DE34 0x800BDA34 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
