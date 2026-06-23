/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x0028A8B8..0x0028A8C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny 3-word accessor: lui $at / jr $ra @0x0028A8BC / delay sb $a0 @0x0028A8C0. Separate frameless leaf. */
/* 0x0028A8B8 0x802FA4B8 0x3C018024 */ .word 0x3C018024 # lui $at, 0x8024
/* 0x0028A8BC 0x802FA4BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0028A8C0 0x802FA4C0 0xA024DF0C */ .word 0xA024DF0C # sb $a0, -0x20F4($at)
