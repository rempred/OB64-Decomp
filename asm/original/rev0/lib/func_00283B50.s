/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283B50..0x00283B6C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: clears flag byte at 0x802319B8+0x1CB1; ends jr$ra@0x00283B64 + nop delay. */
/* 0x00283B50 0x802F3750 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x00283B54 0x802F3754 0x8C63A974 */ .word 0x8C63A974 # lw $v1, -0x568C($v1)
/* 0x00283B58 0x802F3758 0x90621CB1 */ .word 0x90621CB1 # lbu $v0, 0x1CB1($v1)
/* 0x00283B5C 0x802F375C 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x802F3764
/* 0x00283B60 0x802F3760 0xA0601CB1 */ .word 0xA0601CB1 # sb $zero, 0x1CB1($v1)
/* 0x00283B64 0x802F3764 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283B68 0x802F3768 0x00000000 */ .word 0x00000000 # nop
