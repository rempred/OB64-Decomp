/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004E2F4..0x0004E310 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue; jr $ra at 0x0004E308 + delay 0x0004E30C */
/* function boundary candidate: func_0004E2F4, size=28, kind=prologue */
func_0004E2F4:
/* 0x0004E2F4 0x800BDEF4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004E2F8 0x800BDEF8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004E2FC 0x800BDEFC 0x0C07504A */ .word 0x0C07504A # jal 0x801D4128
/* 0x0004E300 0x800BDF00 0x00000000 */ .word 0x00000000 # nop
/* 0x0004E304 0x800BDF04 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004E308 0x800BDF08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004E30C 0x800BDF0C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
