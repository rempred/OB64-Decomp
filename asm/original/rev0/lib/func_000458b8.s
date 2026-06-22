/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000458B8..0x000458D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x458CC */
func_000458b8:
/* 0x000458B8 0x800B54B8 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000458BC 0x800B54BC 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000458C0 0x800B54C0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000458C4 0x800B54C4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000458C8 0x800B54C8 0x9042C425 */ .word 0x9042C425 # lbu $v0, -0x3BDB($v0)
/* 0x000458CC 0x800B54CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000458D0 0x800B54D0 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
