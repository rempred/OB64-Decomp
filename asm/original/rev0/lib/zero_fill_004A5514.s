/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_004A1000_004B1000.s
 * z64 range: 0x004A5514..0x004A5528 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (5 words) between Section A audio sample objects. parsed (all-zero).. */
/* 0x004A5514 0x80515114 0x00000000 */ .word 0x00000000 # nop
/* 0x004A5518 0x80515118 0x00000000 */ .word 0x00000000 # nop
/* 0x004A551C 0x8051511C 0x00000000 */ .word 0x00000000 # nop
/* 0x004A5520 0x80515120 0x00000000 */ .word 0x00000000 # nop
/* 0x004A5524 0x80515124 0x00000000 */ .word 0x00000000 # nop
