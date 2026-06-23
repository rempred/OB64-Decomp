/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280B3C..0x00280B44 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless leaf: jr $ra @0x00280B3C + nop delay @0x00280B40 (empty stub). */
/* 0x00280B3C 0x802F073C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00280B40 0x802F0740 0x00000000 */ .word 0x00000000 # nop
