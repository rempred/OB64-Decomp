/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C0CC..0x0020C0E8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit12); jr$ra at C0E0/delay C0E4. */
/* 0x0020C0CC 0x8027BCCC 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BCE0
/* 0x0020C0D0 0x8027BCD0 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C0D4 0x8027BCD4 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C0D8 0x8027BCD8 0x00021302 */ .word 0x00021302 # srl $v0, $v0, 12
/* 0x0020C0DC 0x8027BCDC 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C0E0 0x8027BCE0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C0E4 0x8027BCE4 0x00000000 */ .word 0x00000000 # nop
