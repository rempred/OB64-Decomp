/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EF60..0x0004EF7C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue frame 0x18, jr $ra at 0x0004EF74 + delay 0x0004EF78 */
/* function boundary candidate: func_0004EF60, size=28, kind=prologue */
func_0004EF60:
/* 0x0004EF60 0x800BEB60 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004EF64 0x800BEB64 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004EF68 0x800BEB68 0x0C05E41F */ .word 0x0C05E41F # jal 0x8017907C
/* 0x0004EF6C 0x800BEB6C 0x24040100 */ .word 0x24040100 # addiu $a0, $zero, 0x100
/* 0x0004EF70 0x800BEB70 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004EF74 0x800BEB74 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EF78 0x800BEB78 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
