/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x0029C19C..0x0029C1B8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (lb 0x801DFC70, bltz); jr@0x29C1B0 + delay 0x29C1B4=nop. */
/* 0x0029C19C 0x8030BD9C 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x0029C1A0 0x8030BDA0 0x8063FC70 */ .word 0x8063FC70 # lb $v1, -0x390($v1)
/* 0x0029C1A4 0x8030BDA4 0x04600002 */ .word 0x04600002 # bltz $v1, 0x8030BDB0
/* 0x0029C1A8 0x8030BDA8 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0029C1AC 0x8030BDAC 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x0029C1B0 0x8030BDB0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0029C1B4 0x8030BDB4 0x00000000 */ .word 0x00000000 # nop
