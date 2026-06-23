/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213608..0x00213618 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 16-byte all-zero gap between pointer table and following f64 constant.. */
/* 0x00213608 0x80283208 0x00000000 */ .word 0x00000000 # nop
/* 0x0021360C 0x8028320C 0x00000000 */ .word 0x00000000 # nop
/* 0x00213610 0x80283210 0x00000000 */ .word 0x00000000 # nop
/* 0x00213614 0x80283214 0x00000000 */ .word 0x00000000 # nop
