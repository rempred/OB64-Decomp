/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001D1000_001E1000.s
 * z64 range: 0x001D140C..0x001D143C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_001D140C, size=48, kind=prologue */
func_001D140C:
/* 0x001D140C 0x8024100C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001D1410 0x80241010 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001D1414 0x80241014 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x001D1418 0x80241018 0x24040398 */ .word 0x24040398 # addiu $a0, $zero, 0x398
/* 0x001D141C 0x8024101C 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x001D1420 0x80241020 0x3C01801C */ .word 0x3C01801C # lui $at, 0x801C
/* 0x001D1424 0x80241024 0xAC22A6F8 */ .word 0xAC22A6F8 # sw $v0, -0x5908($at)
/* 0x001D1428 0x80241028 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x001D142C 0x8024102C 0x24050398 */ .word 0x24050398 # addiu $a1, $zero, 0x398
/* 0x001D1430 0x80241030 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001D1434 0x80241034 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001D1438 0x80241038 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
