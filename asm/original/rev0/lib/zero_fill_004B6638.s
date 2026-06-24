/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_004B1000_004C1000.s
 * z64 range: 0x004B6638..0x004B6648 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (4 words) between Section A audio sample objects. parsed (all-zero).. */
/* 0x004B6638 0x80526238 0x00000000 */ .word 0x00000000 # nop
/* 0x004B663C 0x8052623C 0x00000000 */ .word 0x00000000 # nop
/* 0x004B6640 0x80526240 0x00000000 */ .word 0x00000000 # nop
/* 0x004B6644 0x80526244 0x00000000 */ .word 0x00000000 # nop
