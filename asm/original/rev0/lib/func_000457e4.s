/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000457E4..0x00045800 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x457F8 */
func_000457e4:
/* 0x000457E4 0x800B53E4 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000457E8 0x800B53E8 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000457EC 0x800B53EC 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000457F0 0x800B53F0 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000457F4 0x800B53F4 0x9042C424 */ .word 0x9042C424 # lbu $v0, -0x3BDC($v0)
/* 0x000457F8 0x800B53F8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000457FC 0x800B53FC 0x00021182 */ .word 0x00021182 # srl $v0, $v0, 6
