/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00086954..0x00086968 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Zero-fill / uninitialized-data image: 5 all-zero words (20 bytes) separating the preceding record/blob data from the following bytecode records.. */
/* 0x00086954 0x800F6554 0x00000000 */ .word 0x00000000 # nop
/* 0x00086958 0x800F6558 0x00000000 */ .word 0x00000000 # nop
/* 0x0008695C 0x800F655C 0x00000000 */ .word 0x00000000 # nop
/* 0x00086960 0x800F6560 0x00000000 */ .word 0x00000000 # nop
/* 0x00086964 0x800F6564 0x00000000 */ .word 0x00000000 # nop
