/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x00188B08..0x00188B10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 2 pure-zero words (0x00000000, 0x00000000) at 0x188B08 and 0x188B0C — padding between the 0x8021Dxxx pointer table and the following double const pool.. */
/* 0x00188B08 0x801F8708 0x00000000 */ .word 0x00000000 # nop
/* 0x00188B0C 0x801F870C 0x00000000 */ .word 0x00000000 # nop
