/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00181000_00191000.s
 * z64 range: 0x001820A4..0x001820B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: lui $v0,0x8022@0x1820A4, jr $ra@0x1820A8 + delay lbu $v0,-0x50FC($v0)@0x1820AC. Returns the byte at -0x50FC($8022). */
/* 0x001820A4 0x801F1CA4 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x001820A8 0x801F1CA8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001820AC 0x801F1CAC 0x9042AF04 */ .word 0x9042AF04 # lbu $v0, -0x50FC($v0)
