/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029A0B8..0x0029A0C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Scalar/packed pair: 0x161C2200 then 0x00000000; small count/flag record preceding the large pointer table.. */
/* 0x0029A0B8 0x80309CB8 0x161C2200 */ .word 0x161C2200 # bne $s0, $gp, 0x803124BC
/* 0x0029A0BC 0x80309CBC 0x00000000 */ .word 0x00000000 # nop
