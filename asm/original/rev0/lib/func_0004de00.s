/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DE00..0x0004DE1C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x0004DE14 + delay 0x0004DE18 */
/* function boundary candidate: func_0004DE00, size=28, kind=prologue */
func_0004DE00:
/* 0x0004DE00 0x800BDA00 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DE04 0x800BDA04 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DE08 0x800BDA08 0x0C069645 */ .word 0x0C069645 # jal 0x801A5914
/* 0x0004DE0C 0x800BDA0C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DE10 0x800BDA10 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DE14 0x800BDA14 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DE18 0x800BDA18 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
