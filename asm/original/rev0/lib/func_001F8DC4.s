/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F8DC4..0x001F8DD0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless flag get accessor: lui/jr$ra/lw (delay). 3 words. */
/* 0x001F8DC4 0x802689C4 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x001F8DC8 0x802689C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F8DCC 0x802689CC 0x8C42079C */ .word 0x8C42079C # lw $v0, 0x79C($v0)
