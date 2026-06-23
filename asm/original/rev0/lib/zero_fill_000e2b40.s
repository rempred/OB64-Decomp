/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000E1000_000F1000.s
 * z64 range: 0x000E2B40..0x000E2B50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 4 zero words; leading alignment/pad before first graphics block.. */
/* 0x000E2B40 0x80152740 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2B44 0x80152744 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2B48 0x80152748 0x00000000 */ .word 0x00000000 # nop
/* 0x000E2B4C 0x8015274C 0x00000000 */ .word 0x00000000 # nop
