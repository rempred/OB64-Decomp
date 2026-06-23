/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001D1000_001E1000.s
 * z64 range: 0x001DBF68..0x001DBF70 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pure-zero alignment island (8 bytes) between code parts; all words are 0x00000000.. */
/* 0x001DBF68 0x8024BB68 0x00000000 */ .word 0x00000000 # nop
/* 0x001DBF6C 0x8024BB6C 0x00000000 */ .word 0x00000000 # nop
