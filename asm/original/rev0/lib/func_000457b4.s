/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000457B4..0x000457CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x457C4 */
func_000457b4:
/* 0x000457B4 0x800B53B4 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000457B8 0x800B53B8 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000457BC 0x800B53BC 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x000457C0 0x800B53C0 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000457C4 0x800B53C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000457C8 0x800B53C8 0x8042C422 */ .word 0x8042C422 # lb $v0, -0x3BDE($v0)
