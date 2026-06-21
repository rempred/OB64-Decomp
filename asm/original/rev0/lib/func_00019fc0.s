/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00019FC0..0x00019FE4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00019FC0, size=36, kind=prologue */
func_00019FC0:
/* 0x00019FC0 0x80089BC0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00019FC4 0x80089BC4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00019FC8 0x80089BC8 0x3C01800C */ .word 0x3C01800C # lui $at, 0x800C
/* 0x00019FCC 0x80089BCC 0xAC204BD8 */ .word 0xAC204BD8 # sw $zero, 0x4BD8($at)
/* 0x00019FD0 0x80089BD0 0x0C0226F9 */ .word 0x0C0226F9 # jal 0x80089BE4
/* 0x00019FD4 0x80089BD4 0x24040001 */ .word 0x24040001 # addiu $a0, $zero, 0x1
/* 0x00019FD8 0x80089BD8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00019FDC 0x80089BDC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00019FE0 0x80089BE0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
