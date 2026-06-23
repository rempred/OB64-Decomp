/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00280D48..0x00280D5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 20-byte alignment/leading zero-fill (5 zero words) preceding the small-int LUT.. */
/* 0x00280D48 0x802F0948 0x00000000 */ .word 0x00000000 # nop
/* 0x00280D4C 0x802F094C 0x00000000 */ .word 0x00000000 # nop
/* 0x00280D50 0x802F0950 0x00000000 */ .word 0x00000000 # nop
/* 0x00280D54 0x802F0954 0x00000000 */ .word 0x00000000 # nop
/* 0x00280D58 0x802F0958 0x00000000 */ .word 0x00000000 # nop
