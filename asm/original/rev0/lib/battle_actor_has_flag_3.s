/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C2F4..0x0020C310 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit3); jr$ra at C308/delay C30C. */
/* 0x0020C2F4 0x8027BEF4 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BF08
/* 0x0020C2F8 0x8027BEF8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C2FC 0x8027BEFC 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C300 0x8027BF00 0x000210C2 */ .word 0x000210C2 # srl $v0, $v0, 3
/* 0x0020C304 0x8027BF04 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C308 0x8027BF08 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C30C 0x8027BF0C 0x00000000 */ .word 0x00000000 # nop
