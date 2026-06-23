/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F09DC..0x001F09F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 20-byte all-zero gap before the final RAM-pointer table.. */
/* 0x001F09DC 0x802605DC 0x00000000 */ .word 0x00000000 # nop
/* 0x001F09E0 0x802605E0 0x00000000 */ .word 0x00000000 # nop
/* 0x001F09E4 0x802605E4 0x00000000 */ .word 0x00000000 # nop
/* 0x001F09E8 0x802605E8 0x00000000 */ .word 0x00000000 # nop
/* 0x001F09EC 0x802605EC 0x00000000 */ .word 0x00000000 # nop
