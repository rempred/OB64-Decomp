/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EA134..0x001EA158 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan: read-before-write preamble lui $a0,0x801C@0x001EA134 + lw $a0,-0x5950($a0)@0x001EA138 feeds prologue addiu$sp,-0x18@0x001EA13C; calls resource_free(0x800712C4); jr$ra@0x001EA150 + delay@0x001EA154. [adversarial: parent over-merge un-split]. */
func_001EA134:
/* 0x001EA134 0x80259D34 0x3C04801C */ .word 0x3C04801C # lui $a0, 0x801C
/* 0x001EA138 0x80259D38 0x8C84A6B0 */ .word 0x8C84A6B0 # lw $a0, -0x5950($a0)

/* function boundary candidate: func_001EA13C, size=720, kind=prologue */
func_001EA13C:
/* 0x001EA13C 0x80259D3C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001EA140 0x80259D40 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001EA144 0x80259D44 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x001EA148 0x80259D48 0x00000000 */ .word 0x00000000 # nop
/* 0x001EA14C 0x80259D4C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001EA150 0x80259D50 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001EA154 0x80259D54 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
