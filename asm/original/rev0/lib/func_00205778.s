/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00205778..0x00205794 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf clear-bits helper on byte at 0x801CEF00: lbu / nor $a0 / and / lui $at / jr$ra at 0x0020578C + delay (sb $v0,-0x1100($at)) at 0x00205790. */
/* 0x00205778 0x80275378 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020577C 0x8027537C 0x9042EF00 */ .word 0x9042EF00 # lbu $v0, -0x1100($v0)
/* 0x00205780 0x80275380 0x00042027 */ .word 0x00042027 # nor $a0, $zero, $a0
/* 0x00205784 0x80275384 0x00441024 */ .word 0x00441024 # and $v0, $v0, $a0
/* 0x00205788 0x80275388 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x0020578C 0x8027538C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00205790 0x80275390 0xA022EF00 */ .word 0xA022EF00 # sb $v0, -0x1100($at)
