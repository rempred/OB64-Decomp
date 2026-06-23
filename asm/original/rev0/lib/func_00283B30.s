/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283B30..0x00283B50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: sets flag byte at 0x802319B8+0x1CB1; ends jr$ra@0x00283B48 + nop delay. */
/* 0x00283B30 0x802F3730 0x3C038023 */ .word 0x3C038023 # lui $v1, 0x8023
/* 0x00283B34 0x802F3734 0x8C63A974 */ .word 0x8C63A974 # lw $v1, -0x568C($v1)
/* 0x00283B38 0x802F3738 0x90621CB1 */ .word 0x90621CB1 # lbu $v0, 0x1CB1($v1)
/* 0x00283B3C 0x802F373C 0x14400002 */ .word 0x14400002 # bne $v0, $zero, 0x802F3748
/* 0x00283B40 0x802F3740 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00283B44 0x802F3744 0xA0621CB1 */ .word 0xA0621CB1 # sb $v0, 0x1CB1($v1)
/* 0x00283B48 0x802F3748 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283B4C 0x802F374C 0x00000000 */ .word 0x00000000 # nop
