/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00267750..0x00267788 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small leaf: addiu $sp,-0x8; loop over $a1 array with bnel; jr $ra at 0x00267780 + nop delay. */
/* function boundary candidate: func_00267750, size=56, kind=prologue */
func_00267750:
/* 0x00267750 0x802D7350 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00267754 0x802D7354 0x18800009 */ .word 0x18800009 # blez $a0, 0x802D737C
/* 0x00267758 0x802D7358 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0026775C 0x802D735C 0x24060001 */ .word 0x24060001 # addiu $a2, $zero, 0x1
/* 0x00267760 0x802D7360 0x8CA20000 */ .word 0x8CA20000 # lw $v0, 0x0($a1)
/* 0x00267764 0x802D7364 0x54400001 */ .word 0x54400001 # bnel $v0, $zero, 0x802D736C
/* 0x00267768 0x802D7368 0xAC46000C */ .word 0xAC46000C # sw $a2, 0xC($v0)
/* 0x0026776C 0x802D736C 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00267770 0x802D7370 0x0064102A */ .word 0x0064102A # slt $v0, $v1, $a0
/* 0x00267774 0x802D7374 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x802D7360
/* 0x00267778 0x802D7378 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0026777C 0x802D737C 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x00267780 0x802D7380 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00267784 0x802D7384 0x00000000 */ .word 0x00000000 # nop
