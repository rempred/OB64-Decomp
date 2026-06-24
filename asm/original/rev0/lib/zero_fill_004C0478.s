/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_004B1000_004C1000.s
 * z64 range: 0x004C0478..0x004C0488 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (4 words) between Section A audio sample objects. parsed (all-zero).. */
/* 0x004C0478 0x80530078 0x00000000 */ .word 0x00000000 # nop
/* 0x004C047C 0x8053007C 0x00000000 */ .word 0x00000000 # nop
/* 0x004C0480 0x80530080 0x00000000 */ .word 0x00000000 # nop
/* 0x004C0484 0x80530084 0x00000000 */ .word 0x00000000 # nop
