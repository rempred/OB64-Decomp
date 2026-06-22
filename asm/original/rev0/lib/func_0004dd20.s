/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DD20..0x0004DD4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn, jr $ra at 0x0004DD44 + delay 0x0004DD48; trailing accessor un-merged at 0x0004DD4C */
/* function boundary candidate: func_0004DD20, size=56, kind=prologue */
func_0004DD20:
/* 0x0004DD20 0x800BD920 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DD24 0x800BD924 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DD28 0x800BD928 0x0C05C1E5 */ .word 0x0C05C1E5 # jal 0x80170794
/* 0x0004DD2C 0x800BD92C 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x0004DD30 0x800BD930 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x800BD940
/* 0x0004DD34 0x800BD934 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DD38 0x800BD938 0x0C0686B5 */ .word 0x0C0686B5 # jal 0x801A1AD4
/* 0x0004DD3C 0x800BD93C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DD40 0x800BD940 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DD44 0x800BD944 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DD48 0x800BD948 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
