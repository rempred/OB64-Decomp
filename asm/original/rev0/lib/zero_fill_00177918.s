/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00177918..0x00177928 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Four pure-zero words (alignment/padding) after the byte-index map, before the 0x15-band index block.. */
/* 0x00177918 0x801E7518 0x00000000 */ .word 0x00000000 # nop
/* 0x0017791C 0x801E751C 0x00000000 */ .word 0x00000000 # nop
/* 0x00177920 0x801E7520 0x00000000 */ .word 0x00000000 # nop
/* 0x00177924 0x801E7524 0x00000000 */ .word 0x00000000 # nop
