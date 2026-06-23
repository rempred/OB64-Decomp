/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BFF8..0x0020C014 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit8); jr$ra at C00C/delay C010 nop. */
/* 0x0020BFF8 0x8027BBF8 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BC0C
/* 0x0020BFFC 0x8027BBFC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C000 0x8027BC00 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C004 0x8027BC04 0x00021202 */ .word 0x00021202 # srl $v0, $v0, 8
/* 0x0020C008 0x8027BC08 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C00C 0x8027BC0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C010 0x8027BC10 0x00000000 */ .word 0x00000000 # nop
