/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_004A1000_004B1000.s
 * z64 range: 0x004B0230..0x004B0248 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill alignment (6 words) between Section A audio sample objects. parsed (all-zero).. */
/* 0x004B0230 0x8051FE30 0x00000000 */ .word 0x00000000 # nop
/* 0x004B0234 0x8051FE34 0x00000000 */ .word 0x00000000 # nop
/* 0x004B0238 0x8051FE38 0x00000000 */ .word 0x00000000 # nop
/* 0x004B023C 0x8051FE3C 0x00000000 */ .word 0x00000000 # nop
/* 0x004B0240 0x8051FE40 0x00000000 */ .word 0x00000000 # nop
/* 0x004B0244 0x8051FE44 0x00000000 */ .word 0x00000000 # nop
