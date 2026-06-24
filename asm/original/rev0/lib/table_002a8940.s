/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002A8940..0x002A8958 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): RAM-pointer table: 6 words 0x80237830,0x80238004,0x80238530,0x80238820,0x80237830,0x80237830 (0x80237xxx/0x80238xxx data targets, with duplicates).. */
/* 0x002A8940 0x80318540 0x80237830 */ .word 0x80237830 # lb $v1, 0x7830($at)
/* 0x002A8944 0x80318544 0x80238004 */ .word 0x80238004 # lb $v1, -0x7FFC($at)
/* 0x002A8948 0x80318548 0x80238530 */ .word 0x80238530 # lb $v1, -0x7AD0($at)
/* 0x002A894C 0x8031854C 0x80238820 */ .word 0x80238820 # lb $v1, -0x77E0($at)
/* 0x002A8950 0x80318550 0x80237830 */ .word 0x80237830 # lb $v1, 0x7830($at)
/* 0x002A8954 0x80318554 0x80237830 */ .word 0x80237830 # lb $v1, 0x7830($at)
