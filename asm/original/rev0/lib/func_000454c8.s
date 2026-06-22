/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000454C8..0x000454E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x454D8 */
func_000454c8:
/* 0x000454C8 0x800B50C8 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000454CC 0x800B50CC 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000454D0 0x800B50D0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000454D4 0x800B50D4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000454D8 0x800B50D8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000454DC 0x800B50DC 0x9042C410 */ .word 0x9042C410 # lbu $v0, -0x3BF0($v0)
