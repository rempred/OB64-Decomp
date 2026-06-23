/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0A2C..0x001F0A30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Trailing 4-byte zero word terminating the table block; code resumes at 0x001F0A30.. */
/* 0x001F0A2C 0x8026062C 0x00000000 */ .word 0x00000000 # nop
