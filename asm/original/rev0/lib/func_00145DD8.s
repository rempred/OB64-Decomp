/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x00145DD8..0x00145DE4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: lui $at; jr $ra at 0x00145DDC + delay sw $a0,-0x25E4($at) at 0x00145DE0. Global setter. */
/* 0x00145DD8 0x801B59D8 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x00145DDC 0x801B59DC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00145DE0 0x801B59E0 0xAC24DA1C */ .word 0xAC24DA1C # sw $a0, -0x25E4($at)
