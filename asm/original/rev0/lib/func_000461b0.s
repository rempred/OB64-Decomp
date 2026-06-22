/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000461B0..0x000461D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x461CC */
func_000461b0:
/* 0x000461B0 0x800B5DB0 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x000461B4 0x800B5DB4 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000461B8 0x800B5DB8 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000461BC 0x800B5DBC 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000461C0 0x800B5DC0 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000461C4 0x800B5DC4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000461C8 0x800B5DC8 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000461CC 0x800B5DCC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000461D0 0x800B5DD0 0x90225593 */ .word 0x90225593 # lbu $v0, 0x5593($at)
