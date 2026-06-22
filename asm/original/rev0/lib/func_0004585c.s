/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004585C..0x00045878 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45870 */
func_0004585c:
/* 0x0004585C 0x800B545C 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045860 0x800B5460 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045864 0x800B5464 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045868 0x800B5468 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004586C 0x800B546C 0x9042C425 */ .word 0x9042C425 # lbu $v0, -0x3BDB($v0)
/* 0x00045870 0x800B5470 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045874 0x800B5474 0x00021182 */ .word 0x00021182 # srl $v0, $v0, 6
