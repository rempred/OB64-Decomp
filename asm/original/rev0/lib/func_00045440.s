/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045440..0x00045460 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45458 */
func_00045440:
/* 0x00045440 0x800B5040 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045444 0x800B5044 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00045448 0x800B5048 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004544C 0x800B504C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00045450 0x800B5050 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00045454 0x800B5054 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00045458 0x800B5058 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004545C 0x800B505C 0x9022E6D4 */ .word 0x9022E6D4 # lbu $v0, -0x192C($at)
