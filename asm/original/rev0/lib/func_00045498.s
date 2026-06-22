/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045498..0x000454B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x454A8 */
func_00045498:
/* 0x00045498 0x800B5098 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x0004549C 0x800B509C 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000454A0 0x800B50A0 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000454A4 0x800B50A4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000454A8 0x800B50A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000454AC 0x800B50AC 0x9042C428 */ .word 0x9042C428 # lbu $v0, -0x3BD8($v0)
