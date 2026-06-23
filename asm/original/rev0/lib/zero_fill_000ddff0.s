/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DDFF0..0x000DE000 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 4 consecutive 0x00000000 words padding the region tail up to the 0x000DE000 boundary. >=3 zero words => zero_fill.. */
/* 0x000DDFF0 0x8014DBF0 0x00000000 */ .word 0x00000000 # nop
/* 0x000DDFF4 0x8014DBF4 0x00000000 */ .word 0x00000000 # nop
/* 0x000DDFF8 0x8014DBF8 0x00000000 */ .word 0x00000000 # nop
/* 0x000DDFFC 0x8014DBFC 0x00000000 */ .word 0x00000000 # nop
