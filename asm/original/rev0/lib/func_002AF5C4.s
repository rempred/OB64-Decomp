/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AF5C4..0x002AF5F4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Read-before-write preamble @0x002AF5C4 (lui8023/lw$v0,-0x568C) folds into prologue addiu$sp,-0x18 @0x002AF5CC; lw 0x19B4($v0) in jal delay slot reads $v0. Clears 0x19B4 then jr$ra@0x002AF5EC + delay addiu$sp,0x18@0x002AF5F0. */
func_002AF5C4:
/* 0x002AF5C4 0x8031F1C4 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002AF5C8 0x8031F1C8 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)

/* function boundary candidate: func_002AF5CC, size=40, kind=prologue */
func_002AF5CC:
/* 0x002AF5CC 0x8031F1CC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002AF5D0 0x8031F1D0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002AF5D4 0x8031F1D4 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002AF5D8 0x8031F1D8 0x8C4419B4 */ .word 0x8C4419B4 # lw $a0, 0x19B4($v0)
/* 0x002AF5DC 0x8031F1DC 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002AF5E0 0x8031F1E0 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002AF5E4 0x8031F1E4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002AF5E8 0x8031F1E8 0xAC4019B4 */ .word 0xAC4019B4 # sw $zero, 0x19B4($v0)
/* 0x002AF5EC 0x8031F1EC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AF5F0 0x8031F1F0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
