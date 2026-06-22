/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004D8B0..0x0004D8DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue addiu $sp,-0x18; jr $ra at 0x4D8D4 + delay 0x4D8D8. */
/* function boundary candidate: func_0004D8B0, size=44, kind=prologue */
func_0004D8B0:
/* 0x0004D8B0 0x800BD4B0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004D8B4 0x800BD4B4 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0004D8B8 0x800BD4B8 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0004D8BC 0x800BD4BC 0x0C05B205 */ .word 0x0C05B205 # jal 0x8016C814
/* 0x0004D8C0 0x800BD4C0 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x0004D8C4 0x800BD4C4 0x0C072227 */ .word 0x0C072227 # jal 0x801C889C
/* 0x0004D8C8 0x800BD4C8 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x0004D8CC 0x800BD4CC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0004D8D0 0x800BD4D0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0004D8D4 0x800BD4D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004D8D8 0x800BD4D8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
