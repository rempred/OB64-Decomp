/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AF854..0x002AF884 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Read-before-write preamble @0x002AF854 (lui8019/lbu$v0,-0x3E7) folds into prologue addiu$sp,-0x18 @0x002AF85C; bne$v0 at 0x002AF860 reads $v0. Frees 0x1C54 buffer; jr$ra@0x002AF87C + delay addiu$sp,0x18@0x002AF880 = slice end. */
func_002AF854:
/* 0x002AF854 0x8031F454 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x002AF858 0x8031F458 0x9042FC19 */ .word 0x9042FC19 # lbu $v0, -0x3E7($v0)

/* function boundary candidate: func_002AF85C, size=40, kind=prologue */
func_002AF85C:
/* 0x002AF85C 0x8031F45C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002AF860 0x8031F460 0x14400005 */ .word 0x14400005 # bne $v0, $zero, 0x8031F478
/* 0x002AF864 0x8031F464 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002AF868 0x8031F468 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002AF86C 0x8031F46C 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002AF870 0x8031F470 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002AF874 0x8031F474 0x8C441C54 */ .word 0x8C441C54 # lw $a0, 0x1C54($v0)
/* 0x002AF878 0x8031F478 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002AF87C 0x8031F47C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AF880 0x8031F480 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
