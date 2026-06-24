/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00421000_00431000.s
 * z64 range: 0x00423FD4..0x00423FF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Pre-header alignment padding (7 words) before the N64 PtrTablesV2 directory header. parsed (all-zero).. */
/* 0x00423FD4 0x80493BD4 0x00000000 */ .word 0x00000000 # nop
/* 0x00423FD8 0x80493BD8 0x00000000 */ .word 0x00000000 # nop
/* 0x00423FDC 0x80493BDC 0x00000000 */ .word 0x00000000 # nop
/* 0x00423FE0 0x80493BE0 0x00000000 */ .word 0x00000000 # nop
/* 0x00423FE4 0x80493BE4 0x00000000 */ .word 0x00000000 # nop
/* 0x00423FE8 0x80493BE8 0x00000000 */ .word 0x00000000 # nop
/* 0x00423FEC 0x80493BEC 0x00000000 */ .word 0x00000000 # nop
