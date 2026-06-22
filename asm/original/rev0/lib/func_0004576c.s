/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004576C..0x00045784 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x4577C */
func_0004576c:
/* 0x0004576C 0x800B536C 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045770 0x800B5370 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x00045774 0x800B5374 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00045778 0x800B5378 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004577C 0x800B537C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045780 0x800B5380 0x8042C41F */ .word 0x8042C41F # lb $v0, -0x3BE1($v0)
