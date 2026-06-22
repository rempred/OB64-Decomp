/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045754..0x0004576C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45764 */
func_00045754:
/* 0x00045754 0x800B5354 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045758 0x800B5358 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x0004575C 0x800B535C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045760 0x800B5360 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045764 0x800B5364 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045768 0x800B5368 0x8042C41E */ .word 0x8042C41E # lb $v0, -0x3BE2($v0)
