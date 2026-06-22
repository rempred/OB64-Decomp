/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DD58..0x0004DD74 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x0004DD6C + delay 0x0004DD70 */
/* function boundary candidate: func_0004DD58, size=28, kind=prologue */
func_0004DD58:
/* 0x0004DD58 0x800BD958 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DD5C 0x800BD95C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DD60 0x800BD960 0x0C068E7C */ .word 0x0C068E7C # jal 0x801A39F0
/* 0x0004DD64 0x800BD964 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DD68 0x800BD968 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DD6C 0x800BD96C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DD70 0x800BD970 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
