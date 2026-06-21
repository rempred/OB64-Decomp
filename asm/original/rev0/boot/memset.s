/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x0000F8B0..0x0000F8E4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0000F8B0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
memset:
/* function boundary candidate: func_0000F8B0, size=192, kind=prologue */
func_0000F8B0:
/* 0x0000F8B0 0x8007F4B0 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x0000F8B4 0x8007F4B4 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x0000F8B8 0x8007F4B8 0x00403821 */ .word 0x00403821 # move $a3, $v0
/* 0x0000F8BC 0x8007F4BC 0x10C00006 */ .word 0x10C00006 # beq $a2, $zero, 0x8007F4D8
/* 0x0000F8C0 0x8007F4C0 0x24C3FFFF */ .word 0x24C3FFFF # addiu $v1, $a2, -0x1
/* 0x0000F8C4 0x8007F4C4 0x2404FFFF */ .word 0x2404FFFF # addiu $a0, $zero, -0x1
/* 0x0000F8C8 0x8007F4C8 0xA0E50000 */ .word 0xA0E50000 # sb $a1, 0x0($a3)
/* 0x0000F8CC 0x8007F4CC 0x2463FFFF */ .word 0x2463FFFF # addiu $v1, $v1, -0x1
/* 0x0000F8D0 0x8007F4D0 0x1464FFFD */ .word 0x1464FFFD # bne $v1, $a0, 0x8007F4C8
/* 0x0000F8D4 0x8007F4D4 0x24E70001 */ .word 0x24E70001 # addiu $a3, $a3, 0x1
/* 0x0000F8D8 0x8007F4D8 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x0000F8DC 0x8007F4DC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0000F8E0 0x8007F4E0 0x00000000 */ .word 0x00000000 # nop
