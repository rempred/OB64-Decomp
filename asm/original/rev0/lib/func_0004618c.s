/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004618C..0x000461B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf, jr $ra at 0x461A8 */
func_0004618c:
/* 0x0004618C 0x800B5D8C 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00046190 0x800B5D90 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046194 0x800B5D94 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x00046198 0x800B5D98 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004619C 0x800B5D9C 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x000461A0 0x800B5DA0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000461A4 0x800B5DA4 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000461A8 0x800B5DA8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000461AC 0x800B5DAC 0x90225572 */ .word 0x90225572 # lbu $v0, 0x5572($at)
