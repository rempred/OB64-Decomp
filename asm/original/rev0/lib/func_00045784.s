/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045784..0x0004579C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45794 */
func_00045784:
/* 0x00045784 0x800B5384 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045788 0x800B5388 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x0004578C 0x800B538C 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045790 0x800B5390 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00045794 0x800B5394 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045798 0x800B5398 0x8042C420 */ .word 0x8042C420 # lb $v0, -0x3BE0($v0)
