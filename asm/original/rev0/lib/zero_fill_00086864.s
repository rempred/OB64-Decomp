/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00086864..0x0008687C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill / uninitialized-data image: 6 all-zero words (24 bytes) at table boundary between the 0x801A6Exx pointer table and the following record data.. */
/* 0x00086864 0x800F6464 0x00000000 */ .word 0x00000000 # nop
/* 0x00086868 0x800F6468 0x00000000 */ .word 0x00000000 # nop
/* 0x0008686C 0x800F646C 0x00000000 */ .word 0x00000000 # nop
/* 0x00086870 0x800F6470 0x00000000 */ .word 0x00000000 # nop
/* 0x00086874 0x800F6474 0x00000000 */ .word 0x00000000 # nop
/* 0x00086878 0x800F6478 0x00000000 */ .word 0x00000000 # nop
