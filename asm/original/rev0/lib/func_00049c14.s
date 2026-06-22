/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049C14..0x00049C4C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x49C44 */
/* function boundary candidate: func_00049C14, size=56, kind=prologue */
func_00049C14:
/* 0x00049C14 0x800B9814 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00049C18 0x800B9818 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00049C1C 0x800B981C 0x3C108019 */ .word 0x3C108019 # lui $s0, 0x8019
/* 0x00049C20 0x800B9820 0x8E10FDC0 */ .word 0x8E10FDC0 # lw $s0, -0x240($s0)
/* 0x00049C24 0x800B9824 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00049C28 0x800B9828 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049C2C 0x800B982C 0x0C05FD24 */ .word 0x0C05FD24 # jal 0x8017F490
/* 0x00049C30 0x800B9830 0xAC24FDC0 */ .word 0xAC24FDC0 # sw $a0, -0x240($at)
/* 0x00049C34 0x800B9834 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049C38 0x800B9838 0xAC30FDC0 */ .word 0xAC30FDC0 # sw $s0, -0x240($at)
/* 0x00049C3C 0x800B983C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00049C40 0x800B9840 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00049C44 0x800B9844 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049C48 0x800B9848 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
