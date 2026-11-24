/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C32C..0x0020C348 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit1); jr$ra at C340/delay C344. */
/* 0x0020C32C 0x8027BF2C 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BF40
/* 0x0020C330 0x8027BF30 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C334 0x8027BF34 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C338 0x8027BF38 0x00021042 */ .word 0x00021042 # srl $v0, $v0, 1
/* 0x0020C33C 0x8027BF3C 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C340 0x8027BF40 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C344 0x8027BF44 0x00000000 */ .word 0x00000000 # nop
