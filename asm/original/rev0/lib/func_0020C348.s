/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C348..0x0020C364 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit4); jr$ra at C35C/delay C360. */
/* 0x0020C348 0x8027BF48 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BF5C
/* 0x0020C34C 0x8027BF4C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C350 0x8027BF50 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C354 0x8027BF54 0x00021102 */ .word 0x00021102 # srl $v0, $v0, 4
/* 0x0020C358 0x8027BF58 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C35C 0x8027BF5C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C360 0x8027BF60 0x00000000 */ .word 0x00000000 # nop
