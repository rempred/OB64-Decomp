/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049C4C..0x00049C84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x49C7C */
/* function boundary candidate: func_00049C4C, size=56, kind=prologue */
func_00049C4C:
/* 0x00049C4C 0x800B984C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00049C50 0x800B9850 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00049C54 0x800B9854 0x3C108019 */ .word 0x3C108019 # lui $s0, 0x8019
/* 0x00049C58 0x800B9858 0x8E10FDC0 */ .word 0x8E10FDC0 # lw $s0, -0x240($s0)
/* 0x00049C5C 0x800B985C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00049C60 0x800B9860 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049C64 0x800B9864 0x0C06107D */ .word 0x0C06107D # jal 0x801841F4
/* 0x00049C68 0x800B9868 0xAC24FDC0 */ .word 0xAC24FDC0 # sw $a0, -0x240($at)
/* 0x00049C6C 0x800B986C 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049C70 0x800B9870 0xAC30FDC0 */ .word 0xAC30FDC0 # sw $s0, -0x240($at)
/* 0x00049C74 0x800B9874 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00049C78 0x800B9878 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00049C7C 0x800B987C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049C80 0x800B9880 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
