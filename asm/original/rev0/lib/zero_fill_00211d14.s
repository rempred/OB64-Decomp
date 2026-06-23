/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00211D14..0x00211D20 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 3 all-zero align words (00000000 x3) preceding the string pool.. */
/* 0x00211D14 0x80281914 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D18 0x80281918 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D1C 0x8028191C 0x00000000 */ .word 0x00000000 # nop
