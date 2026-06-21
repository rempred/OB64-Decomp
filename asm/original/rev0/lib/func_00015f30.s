/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00015F30..0x00015F5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00015F30, size=160, kind=prologue */
func_00015F30:
/* 0x00015F30 0x80085B30 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x00015F34 0x80085B34 0x10C00006 */ .word 0x10C00006 # beq $a2, $zero, 0x80085B50
/* 0x00015F38 0x80085B38 0x24C2FFFF */ .word 0x24C2FFFF # addiu $v0, $a2, -0x1
/* 0x00015F3C 0x80085B3C 0x2403FFFF */ .word 0x2403FFFF # addiu $v1, $zero, -0x1
/* 0x00015F40 0x80085B40 0xA0850000 */ .word 0xA0850000 # sb $a1, 0x0($a0)
/* 0x00015F44 0x80085B44 0x2442FFFF */ .word 0x2442FFFF # addiu $v0, $v0, -0x1
/* 0x00015F48 0x80085B48 0x1443FFFD */ .word 0x1443FFFD # bne $v0, $v1, 0x80085B40
/* 0x00015F4C 0x80085B4C 0x24840001 */ .word 0x24840001 # addiu $a0, $a0, 0x1
/* 0x00015F50 0x80085B50 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x00015F54 0x80085B54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00015F58 0x80085B58 0x00000000 */ .word 0x00000000 # nop
