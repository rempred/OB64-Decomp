/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001AB30..0x0001AB58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_0001AB30, size=40, kind=prologue */
func_0001AB30:
/* 0x0001AB30 0x8008A730 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001AB34 0x8008A734 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0001AB38 0x8008A738 0x8C85000C */ .word 0x8C85000C # lw $a1, 0xC($a0)
/* 0x0001AB3C 0x8008A73C 0x8CA20000 */ .word 0x8CA20000 # lw $v0, 0x0($a1)
/* 0x0001AB40 0x8008A740 0x8C440000 */ .word 0x8C440000 # lw $a0, 0x0($v0)
/* 0x0001AB44 0x8008A744 0x0C025A60 */ .word 0x0C025A60 # jal 0x80096980
/* 0x0001AB48 0x8008A748 0x24A50004 */ .word 0x24A50004 # addiu $a1, $a1, 0x4
/* 0x0001AB4C 0x8008A74C 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0001AB50 0x8008A750 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001AB54 0x8008A754 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
