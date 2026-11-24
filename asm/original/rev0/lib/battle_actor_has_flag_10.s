/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C034..0x0020C050 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit10); jr$ra at C048/delay C04C. */
/* 0x0020C034 0x8027BC34 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BC48
/* 0x0020C038 0x8027BC38 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C03C 0x8027BC3C 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C040 0x8027BC40 0x00021282 */ .word 0x00021282 # srl $v0, $v0, 10
/* 0x0020C044 0x8027BC44 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C048 0x8027BC48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C04C 0x8027BC4C 0x00000000 */ .word 0x00000000 # nop
