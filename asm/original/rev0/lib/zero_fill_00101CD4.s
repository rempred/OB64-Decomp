/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00101000_00111000.s
 * z64 range: 0x00101CD4..0x00101CE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Three trailing zero words (0x00000000 x3) padding the const pool out to the region end at 0x101CE0. [name-token: zero_fill_tail]. */
/* 0x00101CD4 0x801718D4 0x00000000 */ .word 0x00000000 # nop
/* 0x00101CD8 0x801718D8 0x00000000 */ .word 0x00000000 # nop
/* 0x00101CDC 0x801718DC 0x00000000 */ .word 0x00000000 # nop
