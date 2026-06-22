/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DF38..0x0004DF54 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x0004DF38 (52B); real func ends jr $ra at 0x0004DF4C + delay 0x0004DF50 */
/* function boundary candidate: func_0004DF38, size=52, kind=prologue */
func_0004DF38:
/* 0x0004DF38 0x800BDB38 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DF3C 0x800BDB3C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DF40 0x800BDB40 0x0C06A712 */ .word 0x0C06A712 # jal 0x801A9C48
/* 0x0004DF44 0x800BDB44 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DF48 0x800BDB48 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DF4C 0x800BDB4C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DF50 0x800BDB50 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
