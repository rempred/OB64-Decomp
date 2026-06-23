/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00290810..0x00290820 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless accessor: lui/lw 0x8023DE30, jr$ra@0x290818 + delay sb $a0,0x23C($v0)@0x29081C (flag setter). */
/* 0x00290810 0x80300410 0x3C028024 */ .word 0x3C028024 # lui $v0, 0x8024
/* 0x00290814 0x80300414 0x8C42DE30 */ .word 0x8C42DE30 # lw $v0, -0x21D0($v0)
/* 0x00290818 0x80300418 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029081C 0x8030041C 0xA044023C */ .word 0xA044023C # sb $a0, 0x23C($v0)
