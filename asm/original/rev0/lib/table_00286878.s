/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00286878..0x00286898 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table: 7 ptrs 0x800EB0B0,0x800EB100,0x800EB150,0x800EB1A0,0x800EB1F0,0x800EB240,0x800EB290 (stride 0x50) + 1 trailing zero word. Value type: RAM ptr 0x80xxxxxx.. */
/* 0x00286878 0x802F6478 0x800EB0B0 */ .word 0x800EB0B0 # lb $t6, -0x4F50($zero)
/* 0x0028687C 0x802F647C 0x800EB100 */ .word 0x800EB100 # lb $t6, -0x4F00($zero)
/* 0x00286880 0x802F6480 0x800EB150 */ .word 0x800EB150 # lb $t6, -0x4EB0($zero)
/* 0x00286884 0x802F6484 0x800EB1A0 */ .word 0x800EB1A0 # lb $t6, -0x4E60($zero)
/* 0x00286888 0x802F6488 0x800EB1F0 */ .word 0x800EB1F0 # lb $t6, -0x4E10($zero)
/* 0x0028688C 0x802F648C 0x800EB240 */ .word 0x800EB240 # lb $t6, -0x4DC0($zero)
/* 0x00286890 0x802F6490 0x800EB290 */ .word 0x800EB290 # lb $t6, -0x4D70($zero)
/* 0x00286894 0x802F6494 0x00000000 */ .word 0x00000000 # nop
