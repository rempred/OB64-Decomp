/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C2D8..0x0020C2F4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit5); jr$ra at C2EC/delay C2F0. */
/* 0x0020C2D8 0x8027BED8 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BEEC
/* 0x0020C2DC 0x8027BEDC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C2E0 0x8027BEE0 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C2E4 0x8027BEE4 0x00021142 */ .word 0x00021142 # srl $v0, $v0, 5
/* 0x0020C2E8 0x8027BEE8 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C2EC 0x8027BEEC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C2F0 0x8027BEF0 0x00000000 */ .word 0x00000000 # nop
