/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DC3E8..0x000DC3F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): HYPOTHESIS: 4-word small-int index block 0x00000002,0x00000001,0x00000004,0x00000003 (a small permutation/index, not pointers).. */
/* 0x000DC3E8 0x8014BFE8 0x00000002 */ .word 0x00000002 # srl $zero, $zero, 0
/* 0x000DC3EC 0x8014BFEC 0x00000001 */ .word 0x00000001 # special_0x01
/* 0x000DC3F0 0x8014BFF0 0x00000004 */ .word 0x00000004 # sllv $zero, $zero, $zero
/* 0x000DC3F4 0x8014BFF4 0x00000003 */ .word 0x00000003 # sra $zero, $zero, 0
