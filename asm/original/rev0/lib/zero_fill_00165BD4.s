/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00161000_00171000.s
 * z64 range: 0x00165BD4..0x00165BE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Three consecutive 0x00000000 words (0x165BD4,0x165BD8,0x165BDC) separating the ASCII pool from the following string-pointer table.. */
/* 0x00165BD4 0x801D57D4 0x00000000 */ .word 0x00000000 # nop
/* 0x00165BD8 0x801D57D8 0x00000000 */ .word 0x00000000 # nop
/* 0x00165BDC 0x801D57DC 0x00000000 */ .word 0x00000000 # nop
