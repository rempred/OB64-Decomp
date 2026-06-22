/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DF14..0x0004DF38 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue, jr $ra at 0x0004DF30 + delay 0x0004DF34 */
/* function boundary candidate: func_0004DF14, size=36, kind=prologue */
func_0004DF14:
/* 0x0004DF14 0x800BDB14 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DF18 0x800BDB18 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DF1C 0x800BDB1C 0x0C06A4A2 */ .word 0x0C06A4A2 # jal 0x801A9288
/* 0x0004DF20 0x800BDB20 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DF24 0x800BDB24 0x0C01CCDF */ .word 0x0C01CCDF # jal 0x8007337C
/* 0x0004DF28 0x800BDB28 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DF2C 0x800BDB2C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DF30 0x800BDB30 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DF34 0x800BDB34 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
