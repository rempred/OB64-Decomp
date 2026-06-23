/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00157EE8..0x00157F2C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (starts lui $a0,0x8021 / lw $a0,0x3778, no addiu $sp). jr $ra 0x00157F24 + delay 0x00157F28. Parent over-merged into idx47. */
/* 0x00157EE8 0x801C7AE8 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x00157EEC 0x801C7AEC 0x8C843778 */ .word 0x8C843778 # lw $a0, 0x3778($a0)
/* 0x00157EF0 0x801C7AF0 0x8082005E */ .word 0x8082005E # lb $v0, 0x5E($a0)
/* 0x00157EF4 0x801C7AF4 0x00021880 */ .word 0x00021880 # sll $v1, $v0, 2
/* 0x00157EF8 0x801C7AF8 0x00621821 */ .word 0x00621821 # addu $v1, $v1, $v0
/* 0x00157EFC 0x801C7AFC 0x00031840 */ .word 0x00031840 # sll $v1, $v1, 1
/* 0x00157F00 0x801C7B00 0x00641821 */ .word 0x00641821 # addu $v1, $v1, $a0
/* 0x00157F04 0x801C7B04 0x90650605 */ .word 0x90650605 # lbu $a1, 0x605($v1)
/* 0x00157F08 0x801C7B08 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x00157F0C 0x801C7B0C 0x54430005 */ .word 0x54430005 # bnel $v0, $v1, 0x801C7B24
/* 0x00157F10 0x801C7B10 0xA08005D8 */ .word 0xA08005D8 # sb $zero, 0x5D8($a0)
/* 0x00157F14 0x801C7B14 0x000510C0 */ .word 0x000510C0 # sll $v0, $a1, 3
/* 0x00157F18 0x801C7B18 0x00821021 */ .word 0x00821021 # addu $v0, $a0, $v0
/* 0x00157F1C 0x801C7B1C 0x9042035C */ .word 0x9042035C # lbu $v0, 0x35C($v0)
/* 0x00157F20 0x801C7B20 0xA08205D8 */ .word 0xA08205D8 # sb $v0, 0x5D8($a0)
/* 0x00157F24 0x801C7B24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00157F28 0x801C7B28 0x00000000 */ .word 0x00000000 # nop
