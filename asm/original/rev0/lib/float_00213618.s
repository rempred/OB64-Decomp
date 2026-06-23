/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213618..0x00213620 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): f64 const: 0x3F847AE147AE147B = 0.01.. */
/* 0x00213618 0x80283218 0x3F847AE1 */ .word 0x3F847AE1 # lui $a0, 0x7AE1
/* 0x0021361C 0x8028321C 0x47AE147B */ .word 0x47AE147B # c.0xB.fmt29 $f2, $f14
