/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145DF8..0x00145E04 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: lui $at; jr $ra at 0x00145DFC + delay sw $a0,-0x25E0($at) at 0x00145E00. Global setter. */
/* 0x00145DF8 0x801B59F8 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00145DFC 0x801B59FC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145E00 0x801B5A00 0xAC24DA20 */ .word 0xAC24DA20 # sw $a0, -0x25E0($at)
