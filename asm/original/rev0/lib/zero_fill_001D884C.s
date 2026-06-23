/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001D1000_001E1000.s
 * z64 range: 0x001D884C..0x001D8850 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pure-zero alignment island (4 bytes) between code parts; all words are 0x00000000.. */
/* 0x001D884C 0x8024844C 0x00000000 */ .word 0x00000000 # nop
