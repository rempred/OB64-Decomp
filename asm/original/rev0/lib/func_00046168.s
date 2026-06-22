/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046168..0x0004618C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x46184 */
func_00046168:
/* 0x00046168 0x800B5D68 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x0004616C 0x800B5D6C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046170 0x800B5D70 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00046174 0x800B5D74 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046178 0x800B5D78 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0004617C 0x800B5D7C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00046180 0x800B5D80 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x00046184 0x800B5D84 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046188 0x800B5D88 0x90225571 */ .word 0x90225571 # lbu $v0, 0x5571($at)
