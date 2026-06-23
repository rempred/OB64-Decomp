/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A2BD0..0x001A2BE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Inline data island D1 part 3: 4 words of zero-fill / alignment padding before the pointer table.. */
/* 0x001A2BD0 0x802127D0 0x00000000 */ .word 0x00000000 # nop
/* 0x001A2BD4 0x802127D4 0x00000000 */ .word 0x00000000 # nop
/* 0x001A2BD8 0x802127D8 0x00000000 */ .word 0x00000000 # nop
/* 0x001A2BDC 0x802127DC 0x00000000 */ .word 0x00000000 # nop
