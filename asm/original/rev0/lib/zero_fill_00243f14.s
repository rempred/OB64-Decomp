/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00243F14..0x00243F20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 align nop words (all-zero) preceding the pointer table.. */
/* 0x00243F14 0x802B3B14 0x00000000 */ .word 0x00000000 # nop
/* 0x00243F18 0x802B3B18 0x00000000 */ .word 0x00000000 # nop
/* 0x00243F1C 0x802B3B1C 0x00000000 */ .word 0x00000000 # nop
