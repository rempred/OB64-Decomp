/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020D434..0x0020D444 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf recovered from over-merge: lui/addu $v0; jr ra @0x20D43C + delay lbu @0x20D440. */
/* 0x0020D434 0x8027D034 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020D438 0x8027D038 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0020D43C 0x8027D03C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020D440 0x8027D040 0x9042FC8C */ .word 0x9042FC8C # lbu $v0, -0x374($v0)
