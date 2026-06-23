/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00241000_00251000.s
 * z64 range: 0x00243F40..0x00243F4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 words 0x1733281E,0x18342832,0x00000000; packed byte/halfword parameters preceding float pool (looks like paired 16-bit values + zero pad).. */
/* 0x00243F40 0x802B3B40 0x1733281E */ .word 0x1733281E # bne $t9, $s3, 0x802BDBBC
/* 0x00243F44 0x802B3B44 0x18342832 */ .word 0x18342832 # blez $at, 0x802BDC10
/* 0x00243F48 0x802B3B48 0x00000000 */ .word 0x00000000 # nop
