/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002836A4..0x002836B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless reset leaf: ends jr$ra@0x002836A8 + sw $zero,-0x5670($at) delay. */
/* 0x002836A4 0x802F32A4 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002836A8 0x802F32A8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002836AC 0x802F32AC 0xAC20A990 */ .word 0xAC20A990 # sw $zero, -0x5670($at)
