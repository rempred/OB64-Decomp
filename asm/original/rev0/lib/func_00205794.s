/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00205794..0x002057A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless 3-word getter: lui $v0,0x801D / jr$ra at 0x00205798 + delay (lbu $v0,-0x1100($v0)) at 0x0020579C returning the 0x801CEF00 byte. */
/* 0x00205794 0x80275394 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00205798 0x80275398 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020579C 0x8027539C 0x9042EF00 */ .word 0x9042EF00 # lbu $v0, -0x1100($v0)
