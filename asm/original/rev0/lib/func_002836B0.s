/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002836B0..0x002836BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless setter leaf: ends jr$ra@0x002836B4 + sb $a0,-0x3E7($at) (0x8018FC19) delay. */
/* 0x002836B0 0x802F32B0 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x002836B4 0x802F32B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002836B8 0x802F32B8 0xA024FC19 */ .word 0xA024FC19 # sb $a0, -0x3E7($at)
