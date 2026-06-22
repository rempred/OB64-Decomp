/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DE38..0x0004DE54 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue fn, jr $ra at 0x0004DE4C + delay 0x0004DE50; trailing accessor un-merged at 0x0004DE54 */
/* function boundary candidate: func_0004DE38, size=40, kind=prologue */
func_0004DE38:
/* 0x0004DE38 0x800BDA38 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DE3C 0x800BDA3C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DE40 0x800BDA40 0x0C069643 */ .word 0x0C069643 # jal 0x801A590C
/* 0x0004DE44 0x800BDA44 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DE48 0x800BDA48 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DE4C 0x800BDA4C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DE50 0x800BDA50 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
