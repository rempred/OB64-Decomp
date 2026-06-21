/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001B510..0x0001B530 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001B510, size=28, kind=prologue */
func_0001B510:
/* 0x0001B510 0x8008B110 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001B514 0x8008B114 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001B518 0x8008B118 0x0C0255F4 */ .word 0x0C0255F4 # jal 0x800957D0
/* 0x0001B51C 0x8008B11C 0x8C84000C */ .word 0x8C84000C # lw $a0, 0xC($a0)
/* 0x0001B520 0x8008B120 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001B524 0x8008B124 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001B528 0x8008B128 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0001B52C 0x8008B12C 0x00000000 */ .word 0x00000000 # nop
