/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A9280..0x001A9290 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 4 trailing pure-zero words (0x1A9280..0x1A928C) trailing alignment padding; the next owner func_001A9290 begins at 0x1A9290.. */
/* 0x001A9280 0x80218E80 0x00000000 */ .word 0x00000000 # nop
/* 0x001A9284 0x80218E84 0x00000000 */ .word 0x00000000 # nop
/* 0x001A9288 0x80218E88 0x00000000 */ .word 0x00000000 # nop
/* 0x001A928C 0x80218E8C 0x00000000 */ .word 0x00000000 # nop
