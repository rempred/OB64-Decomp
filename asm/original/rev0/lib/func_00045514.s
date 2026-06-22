/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045514..0x0004552C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45524 */
func_00045514:
/* 0x00045514 0x800B5114 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045518 0x800B5118 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x0004551C 0x800B511C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045520 0x800B5120 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045524 0x800B5124 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045528 0x800B5128 0x9042C412 */ .word 0x9042C412 # lbu $v0, -0x3BEE($v0)
