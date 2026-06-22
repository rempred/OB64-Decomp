/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004DE60..0x0004DE7C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue+jal+jr $ra at 0x0004DE74, delay slot 0x0004DE78; parent missed label, starts at SLICE_START */
/* function boundary candidate: func_0004DE60, size=28, kind=prologue */
func_0004DE60:
/* 0x0004DE60 0x800BDA60 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004DE64 0x800BDA64 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0004DE68 0x800BDA68 0x0C06B249 */ .word 0x0C06B249 # jal 0x801AC924
/* 0x0004DE6C 0x800BDA6C 0x00000000 */ .word 0x00000000 # nop
/* 0x0004DE70 0x800BDA70 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0004DE74 0x800BDA74 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004DE78 0x800BDA78 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
