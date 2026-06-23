/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EF030..0x001EF034 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Trailing constant scalar word 0x00000014 (decimal 20), an apparent count/terminator following the pointer table.. */
/* 0x001EF030 0x8025EC30 0x00000014 */ .word 0x00000014 # dsllv $zero, $zero, $zero
