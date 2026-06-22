/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E2D8..0x0004E2F4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue; jr $ra at 0x0004E2EC + delay 0x0004E2F0 */
/* function boundary candidate: func_0004E2D8, size=28, kind=prologue */
func_0004E2D8:
/* 0x0004E2D8 0x800BDED8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E2DC 0x800BDEDC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E2E0 0x800BDEE0 0x0C07503B */ .word 0x0C07503B # jal 0x801D40EC
/* 0x0004E2E4 0x800BDEE4 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E2E8 0x800BDEE8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E2EC 0x800BDEEC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E2F0 0x800BDEF0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
