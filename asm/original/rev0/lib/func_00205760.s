/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00205760..0x00205778 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf set-bits helper on byte at 0x801CEF00: lbu / or $v0,$a0 / lui $at / jr$ra at 0x00205770 + delay (sb $v0,-0x1100($at)) at 0x00205774. */
/* 0x00205760 0x80275360 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00205764 0x80275364 0x9042EF00 */ .word 0x9042EF00 # lbu $v0, -0x1100($v0)
/* 0x00205768 0x80275368 0x00441025 */ .word 0x00441025 # or $v0, $v0, $a0
/* 0x0020576C 0x8027536C 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x00205770 0x80275370 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00205774 0x80275374 0xA022EF00 */ .word 0xA022EF00 # sb $v0, -0x1100($at)
