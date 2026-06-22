/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045544..0x0004555C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45554 */
func_00045544:
/* 0x00045544 0x800B5144 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045548 0x800B5148 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x0004554C 0x800B514C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045550 0x800B5150 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045554 0x800B5154 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045558 0x800B5158 0x8042C41C */ .word 0x8042C41C # lb $v0, -0x3BE4($v0)
