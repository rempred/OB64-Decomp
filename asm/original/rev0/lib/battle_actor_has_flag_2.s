/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C310..0x0020C32C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit2); jr$ra at C324/delay C328. */
/* 0x0020C310 0x8027BF10 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BF24
/* 0x0020C314 0x8027BF14 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C318 0x8027BF18 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C31C 0x8027BF1C 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x0020C320 0x8027BF20 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C324 0x8027BF24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C328 0x8027BF28 0x00000000 */ .word 0x00000000 # nop
