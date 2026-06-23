/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x002104AC..0x002104E8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (reverse byte copy). jr$ra@0x002104E0 + delay nop@0x002104E4. */
/* 0x002104AC 0x802800AC 0x00862021 */ .word 0x00862021 # addu $a0, $a0, $a2
/* 0x002104B0 0x802800B0 0x00A62821 */ .word 0x00A62821 # addu $a1, $a1, $a2
/* 0x002104B4 0x802800B4 0x24C6FFFF */ .word 0x24C6FFFF # addiu $a2, $a2, -0x1
/* 0x002104B8 0x802800B8 0x2402FFFF */ .word 0x2402FFFF # addiu $v0, $zero, -0x1
/* 0x002104BC 0x802800BC 0x10C20008 */ .word 0x10C20008 # beq $a2, $v0, 0x802800E0
/* 0x002104C0 0x802800C0 0x00000000 */ .word 0x00000000 # nop
/* 0x002104C4 0x802800C4 0x2403FFFF */ .word 0x2403FFFF # addiu $v1, $zero, -0x1
/* 0x002104C8 0x802800C8 0x24A5FFFF */ .word 0x24A5FFFF # addiu $a1, $a1, -0x1
/* 0x002104CC 0x802800CC 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x002104D0 0x802800D0 0x2484FFFF */ .word 0x2484FFFF # addiu $a0, $a0, -0x1
/* 0x002104D4 0x802800D4 0x24C6FFFF */ .word 0x24C6FFFF # addiu $a2, $a2, -0x1
/* 0x002104D8 0x802800D8 0x14C3FFFB */ .word 0x14C3FFFB # bne $a2, $v1, 0x802800C8
/* 0x002104DC 0x802800DC 0xA0820000 */ .word 0xA0820000 # sb $v0, 0x0($a0)
/* 0x002104E0 0x802800E0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002104E4 0x802800E4 0x00000000 */ .word 0x00000000 # nop
