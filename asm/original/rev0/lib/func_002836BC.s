/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002836BC..0x002836C8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless getter leaf: ends jr$ra@0x002836C0 + lbu $v0,-0x5680($v0) (0x8023A980) delay. */
/* 0x002836BC 0x802F32BC 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002836C0 0x802F32C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002836C4 0x802F32C4 0x9042A980 */ .word 0x9042A980 # lbu $v0, -0x5680($v0)
