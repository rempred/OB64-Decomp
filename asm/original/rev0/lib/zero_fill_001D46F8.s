/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001D1000_001E1000.s
 * z64 range: 0x001D46F8..0x001D4700 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pure-zero alignment island (8 bytes) between code parts; all words are 0x00000000.. */
/* 0x001D46F8 0x802442F8 0x00000000 */ .word 0x00000000 # nop
/* 0x001D46FC 0x802442FC 0x00000000 */ .word 0x00000000 # nop
