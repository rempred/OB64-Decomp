/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001ED888..0x001ED8D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF: fall-through entry after func_001ED490's jr $ra delay slot. No addiu $sp; reads $a1/$a0 (lui $a1,0x801C / lw $a1 / lbu $a0,0x7E($a1)) before any frame setup, increments byte at 0x7E with two clamp branches. Uses $ra directly. Ends jr $ra @0x001ED8CC + delay nop @0x001ED8D0. */
/* 0x001ED888 0x8025D488 0x3C05801C */ .word 0x3C05801C # lui $a1, 0x801C
/* 0x001ED88C 0x8025D48C 0x8CA5A6D0 */ .word 0x8CA5A6D0 # lw $a1, -0x5930($a1)
/* 0x001ED890 0x8025D490 0x90A4007E */ .word 0x90A4007E # lbu $a0, 0x7E($a1)
/* 0x001ED894 0x8025D494 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001ED898 0x8025D498 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x001ED89C 0x8025D49C 0x14620008 */ .word 0x14620008 # bne $v1, $v0, 0x8025D4C0
/* 0x001ED8A0 0x8025D4A0 0x24020004 */ .word 0x24020004 # addiu $v0, $zero, 0x4
/* 0x001ED8A4 0x8025D4A4 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x001ED8A8 0x8025D4A8 0xA0A2007E */ .word 0xA0A2007E # sb $v0, 0x7E($a1)
/* 0x001ED8AC 0x8025D4AC 0x3C05801C */ .word 0x3C05801C # lui $a1, 0x801C
/* 0x001ED8B0 0x8025D4B0 0x8CA5A6D0 */ .word 0x8CA5A6D0 # lw $a1, -0x5930($a1)
/* 0x001ED8B4 0x8025D4B4 0x90A4007E */ .word 0x90A4007E # lbu $a0, 0x7E($a1)
/* 0x001ED8B8 0x8025D4B8 0x24020004 */ .word 0x24020004 # addiu $v0, $zero, 0x4
/* 0x001ED8BC 0x8025D4BC 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x001ED8C0 0x8025D4C0 0x14620002 */ .word 0x14620002 # bne $v1, $v0, 0x8025D4CC
/* 0x001ED8C4 0x8025D4C4 0x24820001 */ .word 0x24820001 # addiu $v0, $a0, 0x1
/* 0x001ED8C8 0x8025D4C8 0xA0A2007E */ .word 0xA0A2007E # sb $v0, 0x7E($a1)
/* 0x001ED8CC 0x8025D4CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001ED8D0 0x8025D4D0 0x00000000 */ .word 0x00000000 # nop
