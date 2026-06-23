/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0148..0x001F0150 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Trailing ASCII fragment, 2 words / 8 bytes: 0x20202020 0x20206279 = "      by" (spaces then "by"; start of a credits/label string continuing past region end).. */
/* 0x001F0148 0x8025FD48 0x20202020 */ .word 0x20202020 # addi $zero, $at, 0x2020
/* 0x001F014C 0x8025FD4C 0x20206279 */ .word 0x20206279 # addi $zero, $at, 0x6279
