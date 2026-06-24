/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B7D28..0x002B7D50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED tiny frameless accessor leaf: lhu/sh wrap counter @0x80($a0). jr$ra@0x2B7D48 + delay@0x2B7D4C (nop). */
func_002B7D28:
/* 0x002B7D28 0x80327928 0x94820080 */ .word 0x94820080 # lhu $v0, 0x80($a0)
/* 0x002B7D2C 0x8032792C 0x3C030040 */ .word 0x3C030040 # lui $v1, 0x0040
/* 0x002B7D30 0x80327930 0x24420002 */ .word 0x24420002 # addiu $v0, $v0, 0x2
/* 0x002B7D34 0x80327934 0xA4820080 */ .word 0xA4820080 # sh $v0, 0x80($a0)
/* 0x002B7D38 0x80327938 0x00021400 */ .word 0x00021400 # sll $v0, $v0, 16
/* 0x002B7D3C 0x8032793C 0x0062102A */ .word 0x0062102A # slt $v0, $v1, $v0
/* 0x002B7D40 0x80327940 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x80327948
/* 0x002B7D44 0x80327944 0xA4800080 */ .word 0xA4800080 # sh $zero, 0x80($a0)
/* 0x002B7D48 0x80327948 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B7D4C 0x8032794C 0x00000000 */ .word 0x00000000 # nop
