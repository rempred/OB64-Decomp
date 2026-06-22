/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004573C..0x00045754 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x4574C */
func_0004573c:
/* 0x0004573C 0x800B533C 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045740 0x800B5340 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045744 0x800B5344 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045748 0x800B5348 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004574C 0x800B534C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045750 0x800B5350 0x8042C41D */ .word 0x8042C41D # lb $v0, -0x3BE3($v0)
