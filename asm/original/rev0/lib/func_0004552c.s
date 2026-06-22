/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004552C..0x00045544 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x4553C */
func_0004552c:
/* 0x0004552C 0x800B512C 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045530 0x800B5130 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045534 0x800B5134 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045538 0x800B5138 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004553C 0x800B513C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045540 0x800B5140 0x9442C414 */ .word 0x9442C414 # lhu $v0, -0x3BEC($v0)
