/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A9A0..0x0001A9D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A9A0, size=48, kind=prologue */
func_0001A9A0:
/* 0x0001A9A0 0x8008A5A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A9A4 0x8008A5A4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A9A8 0x8008A5A8 0x0C022E08 */ .word 0x0C022E08 # jal 0x8008B820
/* 0x0001A9AC 0x8008A5AC 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x0001A9B0 0x8008A5B0 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x0001A9B4 0x8008A5B4 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0001A9B8 0x8008A5B8 0xAC234B30 */ .word 0xAC234B30 # sw $v1, 0x4B30($at)
/* 0x0001A9BC 0x8008A5BC 0x0C022E08 */ .word 0x0C022E08 # jal 0x8008B820
/* 0x0001A9C0 0x8008A5C0 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x0001A9C4 0x8008A5C4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A9C8 0x8008A5C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A9CC 0x8008A5CC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
