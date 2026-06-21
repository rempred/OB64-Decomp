/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001A908..0x0001A928 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001A908, size=32, kind=prologue */
func_0001A908:
/* 0x0001A908 0x8008A508 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001A90C 0x8008A50C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001A910 0x8008A510 0x8C84000C */ .word 0x8C84000C # lw $a0, 0xC($a0)
/* 0x0001A914 0x8008A514 0x0C0228E9 */ .word 0x0C0228E9 # jal 0x8008A3A4
/* 0x0001A918 0x8008A518 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0001A91C 0x8008A51C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001A920 0x8008A520 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001A924 0x8008A524 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
