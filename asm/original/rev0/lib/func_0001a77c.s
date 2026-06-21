/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A77C..0x0001A7A4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A77C, size=40, kind=prologue */
func_0001A77C:
/* 0x0001A77C 0x8008A37C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A780 0x8008A380 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A784 0x8008A384 0x3C04800F */ .word 0x3C04800F # lui $a0, 0x800F
/* 0x0001A788 0x8008A388 0x24849BF0 */ .word 0x24849BF0 # addiu $a0, $a0, -0x6410
/* 0x0001A78C 0x8008A38C 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0001A790 0x8008A390 0x0C024DB8 */ .word 0x0C024DB8 # jal 0x800936E0
/* 0x0001A794 0x8008A394 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x0001A798 0x8008A398 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A79C 0x8008A39C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A7A0 0x8008A3A0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
