/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000461D4..0x000461F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x461F0, lbu in delay slot ends exactly at slice end 0x461F8 */
func_000461d4:
/* 0x000461D4 0x800B5DD4 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x000461D8 0x800B5DD8 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000461DC 0x800B5DDC 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000461E0 0x800B5DE0 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x000461E4 0x800B5DE4 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000461E8 0x800B5DE8 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000461EC 0x800B5DEC 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000461F0 0x800B5DF0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000461F4 0x800B5DF4 0x90225574 */ .word 0x90225574 # lbu $v0, 0x5574($at)
