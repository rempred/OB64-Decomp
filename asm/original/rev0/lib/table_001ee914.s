/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001EE914..0x001EE930 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 7-word RAM pointer table. Values 0x800EB0B0, 0x800EB100, 0x800EB150, 0x800EB1A0, 0x800EB1F0, 0x800EB240, 0x800EB290 — RAM pointers in the 0x800E (0x800/0x801/0x802) band, contiguous even stride 0x50, all word-aligned. Likely a 7-entry table of pointers to per-row glyph/graphic sub-blocks for the BGM-selection list.. */
/* 0x001EE914 0x8025E514 0x800EB0B0 */ .word 0x800EB0B0 # lb $t6, -0x4F50($zero)
/* 0x001EE918 0x8025E518 0x800EB100 */ .word 0x800EB100 # lb $t6, -0x4F00($zero)
/* 0x001EE91C 0x8025E51C 0x800EB150 */ .word 0x800EB150 # lb $t6, -0x4EB0($zero)
/* 0x001EE920 0x8025E520 0x800EB1A0 */ .word 0x800EB1A0 # lb $t6, -0x4E60($zero)
/* 0x001EE924 0x8025E524 0x800EB1F0 */ .word 0x800EB1F0 # lb $t6, -0x4E10($zero)
/* 0x001EE928 0x8025E528 0x800EB240 */ .word 0x800EB240 # lb $t6, -0x4DC0($zero)
/* 0x001EE92C 0x8025E52C 0x800EB290 */ .word 0x800EB290 # lb $t6, -0x4D70($zero)
