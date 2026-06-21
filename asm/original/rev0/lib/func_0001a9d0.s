/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A9D0..0x0001AA00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A9D0, size=44, kind=prologue */
func_0001A9D0:
/* 0x0001A9D0 0x8008A5D0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A9D4 0x8008A5D4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A9D8 0x8008A5D8 0x0C022E08 */ .word 0x0C022E08 # jal 0x8008B820
/* 0x0001A9DC 0x8008A5DC 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x0001A9E0 0x8008A5E0 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x0001A9E4 0x8008A5E4 0xAC204B30 */ .word 0xAC204B30 # sw $zero, 0x4B30($at)
/* 0x0001A9E8 0x8008A5E8 0x0C022E08 */ .word 0x0C022E08 # jal 0x8008B820
/* 0x0001A9EC 0x8008A5EC 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x0001A9F0 0x8008A5F0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A9F4 0x8008A5F4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A9F8 0x8008A5F8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0001A9FC 0x8008A5FC 0x00000000 */ .word 0x00000000 # nop
