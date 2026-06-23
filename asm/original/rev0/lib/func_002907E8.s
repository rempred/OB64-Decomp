/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002907E8..0x002907F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless accessor: lui/lw 0x8023DE30, jr$ra@0x2907F0 + delay sb $a0,0x23B($v0)@0x2907F4 (store-in-delay-slot setter). */
/* 0x002907E8 0x803003E8 0x3C028024 */ .word 0x3C028024 # lui $v0, 0x8024
/* 0x002907EC 0x803003EC 0x8C42DE30 */ .word 0x8C42DE30 # lw $v0, -0x21D0($v0)
/* 0x002907F0 0x803003F0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002907F4 0x803003F4 0xA044023B */ .word 0xA044023B # sb $a0, 0x23B($v0)
