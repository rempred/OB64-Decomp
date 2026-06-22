/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045898..0x000458B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x458B0 */
func_00045898:
/* 0x00045898 0x800B5498 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x0004589C 0x800B549C 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000458A0 0x800B54A0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000458A4 0x800B54A4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000458A8 0x800B54A8 0x9042C425 */ .word 0x9042C425 # lbu $v0, -0x3BDB($v0)
/* 0x000458AC 0x800B54AC 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x000458B0 0x800B54B0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000458B4 0x800B54B4 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
