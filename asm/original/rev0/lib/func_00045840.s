/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045840..0x0004585C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45854 */
func_00045840:
/* 0x00045840 0x800B5440 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045844 0x800B5444 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045848 0x800B5448 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004584C 0x800B544C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045850 0x800B5450 0x9042C424 */ .word 0x9042C424 # lbu $v0, -0x3BDC($v0)
/* 0x00045854 0x800B5454 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045858 0x800B5458 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
