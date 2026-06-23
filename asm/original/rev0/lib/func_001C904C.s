/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C904C..0x001C9074 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small overlapping parent mini-cluster kept as one code part: label candidates at 0x1C904C and 0x1C9050, with returns at 0x1C9064 and 0x1C906C. Not data. */
/* function boundary candidate: func_001C904C, size=32, kind=leaf */
func_001C904C:
/* 0x001C904C 0x80238C4C 0x00000000 */ .word 0x00000000 # nop

/* function boundary candidate: func_001C9050, size=36, kind=prologue */
func_001C9050:
/* 0x001C9050 0x80238C50 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001C9054 0x80238C54 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001C9058 0x80238C58 0x0C088534 */ .word 0x0C088534 # jal 0x802214D0
/* 0x001C905C 0x80238C5C 0x00000000 */ .word 0x00000000 # nop
/* 0x001C9060 0x80238C60 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001C9064 0x80238C64 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001C9068 0x80238C68 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x001C906C 0x80238C6C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001C9070 0x80238C70 0x00000000 */ .word 0x00000000 # nop
