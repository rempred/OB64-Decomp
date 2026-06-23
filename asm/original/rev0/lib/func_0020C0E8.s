/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C0E8..0x0020C104 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit9); jr$ra at C0FC/delay C100. */
/* 0x0020C0E8 0x8027BCE8 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BCFC
/* 0x0020C0EC 0x8027BCEC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C0F0 0x8027BCF0 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C0F4 0x8027BCF4 0x00021242 */ .word 0x00021242 # srl $v0, $v0, 9
/* 0x0020C0F8 0x8027BCF8 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C0FC 0x8027BCFC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C100 0x8027BD00 0x00000000 */ .word 0x00000000 # nop
