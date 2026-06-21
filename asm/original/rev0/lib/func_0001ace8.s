/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001ACE8..0x0001AD10 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001ACE8, size=32, kind=prologue */
func_0001ACE8:
/* 0x0001ACE8 0x8008A8E8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001ACEC 0x8008A8EC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001ACF0 0x8008A8F0 0x8C82000C */ .word 0x8C82000C # lw $v0, 0xC($a0)
/* 0x0001ACF4 0x8008A8F4 0x0C025B98 */ .word 0x0C025B98 # jal 0x80096E60
/* 0x0001ACF8 0x8008A8F8 0x8C440000 */ .word 0x8C440000 # lw $a0, 0x0($v0)
/* 0x0001ACFC 0x8008A8FC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001AD00 0x8008A900 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001AD04 0x8008A904 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x0001AD08 0x8008A908 0x00000000 */ .word 0x00000000 # nop
/* 0x0001AD0C 0x8008A90C 0x00000000 */ .word 0x00000000 # nop
