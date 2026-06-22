/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EF34..0x0004EF50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue frame 0x18, jr $ra at 0x0004EF48 + delay 0x0004EF4C */
/* function boundary candidate: func_0004EF34, size=44, kind=prologue */
func_0004EF34:
/* 0x0004EF34 0x800BEB34 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004EF38 0x800BEB38 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004EF3C 0x800BEB3C 0x0C05E4EB */ .word 0x0C05E4EB # jal 0x801793AC
/* 0x0004EF40 0x800BEB40 0x00000000 */ .word 0x00000000 # nop
/* 0x0004EF44 0x800BEB44 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004EF48 0x800BEB48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EF4C 0x800BEB4C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
