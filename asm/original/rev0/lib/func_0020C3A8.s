/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C3A8..0x0020C3B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: xori$v0,$a0,0xC; jr$ra at C3AC/delay C3B0 sltiu. */
/* 0x0020C3A8 0x8027BFA8 0x3882000C */ .word 0x3882000C # xori $v0, $a0, 0x000C
/* 0x0020C3AC 0x8027BFAC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C3B0 0x8027BFB0 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
