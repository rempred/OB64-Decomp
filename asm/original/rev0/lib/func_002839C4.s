/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002839C4..0x002839E8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: lw 0x8018FC10; j 0x80227A10 overlay tail-jump internal; ends jr$ra@0x002839E0 + nop delay. */
/* 0x002839C4 0x802F35C4 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x002839C8 0x802F35C8 0x8C42FC10 */ .word 0x8C42FC10 # lw $v0, -0x3F0($v0)
/* 0x002839CC 0x802F35CC 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x802F35DC
/* 0x002839D0 0x802F35D0 0x00000000 */ .word 0x00000000 # nop
/* 0x002839D4 0x802F35D4 0x08089E84 */ .word 0x08089E84 # j 0x80227A10
/* 0x002839D8 0x802F35D8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x002839DC 0x802F35DC 0x84420000 */ .word 0x84420000 # lh $v0, 0x0($v0)
/* 0x002839E0 0x802F35E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002839E4 0x802F35E4 0x00000000 */ .word 0x00000000 # nop
