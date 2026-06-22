/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00045400..0x00045420 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x45418 */
func_00045400:
/* 0x00045400 0x800B5000 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00045404 0x800B5004 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00045408 0x800B5008 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004540C 0x800B500C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00045410 0x800B5010 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00045414 0x800B5014 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00045418 0x800B5018 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004541C 0x800B501C 0x9022E6D0 */ .word 0x9022E6D0 # lbu $v0, -0x1930($at)
