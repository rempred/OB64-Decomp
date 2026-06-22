/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00046374..0x0004639C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (sll index math, sb store), jr $ra at 0x46394 + delay 0x46398 */
func_00046374:
/* 0x00046374 0x800B5F74 0x00041040 */ .word 0x00041040 # sll $v0, $a0, 1
/* 0x00046378 0x800B5F78 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0004637C 0x800B5F7C 0x000210C0 */ .word 0x000210C0 # sll $v0, $v0, 3
/* 0x00046380 0x800B5F80 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00046384 0x800B5F84 0x3C038019 */ .word 0x3C038019 # lui $v1, 0x8019
/* 0x00046388 0x800B5F88 0x246371F2 */ .word 0x246371F2 # addiu $v1, $v1, 0x71F2
/* 0x0004638C 0x800B5F8C 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00046390 0x800B5F90 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00046394 0x800B5F94 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00046398 0x800B5F98 0xA0460000 */ .word 0xA0460000 # sb $a2, 0x0($v0)
