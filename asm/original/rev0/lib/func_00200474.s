/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x00200474..0x00200480 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny 3-word frameless getter: lui $v0,0x801D / jr$ra@0x00200478 / delay lw $v0,0x770($v0) -- reads global 0x801D0770. Split out of over-merged idx66 (real separate leaf accessor). */
/* 0x00200474 0x80270074 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00200478 0x80270078 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020047C 0x8027007C 0x8C420770 */ .word 0x8C420770 # lw $v0, 0x770($v0)
