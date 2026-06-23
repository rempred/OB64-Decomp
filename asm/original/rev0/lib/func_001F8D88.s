/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F8D88..0x001F8D94 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless flag get accessor: lui/jr$ra/lw (delay). 3 words. */
/* 0x001F8D88 0x80268988 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x001F8D8C 0x8026898C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F8D90 0x80268990 0x8C42EAB4 */ .word 0x8C42EAB4 # lw $v0, -0x154C($v0)
