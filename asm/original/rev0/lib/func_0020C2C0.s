/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C2C0..0x0020C2D8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless flag getter (obj+0x40 bit0); jr$ra at C2D0/delay C2D4. */
/* 0x0020C2C0 0x8027BEC0 0x50800003 */ .word 0x50800003 # beql $a0, $zero, 0x8027BED0
/* 0x0020C2C4 0x8027BEC4 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x0020C2C8 0x8027BEC8 0x8C820040 */ .word 0x8C820040 # lw $v0, 0x40($a0)
/* 0x0020C2CC 0x8027BECC 0x30420001 */ .word 0x30420001 # andi $v0, $v0, 0x0001
/* 0x0020C2D0 0x8027BED0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C2D4 0x8027BED4 0x00000000 */ .word 0x00000000 # nop
