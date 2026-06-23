/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019C754..0x0019C760 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Trailing pure-zero/nop words (3 words) padding to 0x19C760, where code region 2 begins.. */
/* 0x0019C754 0x8020C354 0x00000000 */ .word 0x00000000 # nop
/* 0x0019C758 0x8020C358 0x00000000 */ .word 0x00000000 # nop
/* 0x0019C75C 0x8020C35C 0x00000000 */ .word 0x00000000 # nop
