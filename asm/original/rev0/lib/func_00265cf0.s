/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00265CF0..0x00265D10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Tiny wrapper: jal 0x80210E78 with addiu$a0,0x14; jr$ra@0x00265D08 + delay@0x00265D0C. */
/* function boundary candidate: func_00265CF0, size=32, kind=prologue */
func_00265CF0:
/* 0x00265CF0 0x802D58F0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00265CF4 0x802D58F4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00265CF8 0x802D58F8 0x0C08439E */ .word 0x0C08439E # jal 0x80210E78
/* 0x00265CFC 0x802D58FC 0x24840014 */ .word 0x24840014 # addiu $a0, $a0, 0x14
/* 0x00265D00 0x802D5900 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00265D04 0x802D5904 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00265D08 0x802D5908 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00265D0C 0x802D590C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
