/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000453E0..0x00045400 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (lw in delay) un-merged from parent 0x4501C; jr $ra at 0x453F8 */
func_000453e0:
/* 0x000453E0 0x800B4FE0 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000453E4 0x800B4FE4 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x000453E8 0x800B4FE8 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000453EC 0x800B4FEC 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000453F0 0x800B4FF0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000453F4 0x800B4FF4 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000453F8 0x800B4FF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000453FC 0x800B4FFC 0x8C22E6CC */ .word 0x8C22E6CC # lw $v0, -0x1934($at)
