/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00004C34_00011000.s
 * z64 range: 0x00004C34..0x00004C5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00004C34, size=40, kind=prologue */
func_00004C34:
/* 0x00004C34 0x80074834 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00004C38 0x80074838 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00004C3C 0x8007483C 0x0C01D3E7 */ .word 0x0C01D3E7 # jal 0x80074F9C
/* 0x00004C40 0x80074840 0x00000000 */ .word 0x00000000 # nop
/* 0x00004C44 0x80074844 0x3C043708 */ .word 0x3C043708 # lui $a0, 0x3708
/* 0x00004C48 0x80074848 0x0C01D2FC */ .word 0x0C01D2FC # jal 0x80074BF0
/* 0x00004C4C 0x8007484C 0x34841383 */ .word 0x34841383 # ori $a0, $a0, 0x1383
/* 0x00004C50 0x80074850 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00004C54 0x80074854 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00004C58 0x80074858 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
