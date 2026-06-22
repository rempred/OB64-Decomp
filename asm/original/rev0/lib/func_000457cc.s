/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000457CC..0x000457E4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x457DC */
func_000457cc:
/* 0x000457CC 0x800B53CC 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000457D0 0x800B53D0 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000457D4 0x800B53D4 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000457D8 0x800B53D8 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000457DC 0x800B53DC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000457E0 0x800B53E0 0x8042C423 */ .word 0x8042C423 # lb $v0, -0x3BDD($v0)
