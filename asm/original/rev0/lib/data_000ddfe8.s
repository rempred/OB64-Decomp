/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DDFE8..0x000DDFF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Trailer of the packed blob: 0x00000000 then 0x0000FFFF. 2 words, mixed (not a pure zero_fill). Likely an end sentinel/terminator for the 0xDDF60 blob.. */
/* 0x000DDFE8 0x8014DBE8 0x00000000 */ .word 0x00000000 # nop
/* 0x000DDFEC 0x8014DBEC 0x0000FFFF */ .word 0x0000FFFF # dsra32 $ra, $zero, 31
