/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045460..0x00045480 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45478 */
func_00045460:
/* 0x00045460 0x800B5060 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045464 0x800B5064 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00045468 0x800B5068 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004546C 0x800B506C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00045470 0x800B5070 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00045474 0x800B5074 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00045478 0x800B5078 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004547C 0x800B507C 0x9022E6D5 */ .word 0x9022E6D5 # lbu $v0, -0x192B($at)
