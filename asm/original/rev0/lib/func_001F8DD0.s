/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F8DD0..0x001F8DDC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless flag get accessor: lui/jr$ra/lw (delay). 3 words. */
/* 0x001F8DD0 0x802689D0 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x001F8DD4 0x802689D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F8DD8 0x802689D8 0x8C4207CC */ .word 0x8C4207CC # lw $v0, 0x7CC($v0)
