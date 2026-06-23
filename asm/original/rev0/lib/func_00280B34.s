/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280B34..0x00280B3C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny frameless leaf: jr $ra @0x00280B34 + nop delay @0x00280B38 (empty stub). */
/* 0x00280B34 0x802F0734 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00280B38 0x802F0738 0x00000000 */ .word 0x00000000 # nop
