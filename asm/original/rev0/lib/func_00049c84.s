/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00049C84..0x00049CBC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue leaf, jr $ra at 0x49CB4 */
/* function boundary candidate: func_00049C84, size=56, kind=prologue */
func_00049C84:
/* 0x00049C84 0x800B9884 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00049C88 0x800B9888 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00049C8C 0x800B988C 0x3C108019 */ .word 0x3C108019 # lui $s0, 0x8019
/* 0x00049C90 0x800B9890 0x8E10FDC0 */ .word 0x8E10FDC0 # lw $s0, -0x240($s0)
/* 0x00049C94 0x800B9894 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00049C98 0x800B9898 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049C9C 0x800B989C 0x0C0602F7 */ .word 0x0C0602F7 # jal 0x80180BDC
/* 0x00049CA0 0x800B98A0 0xAC24FDC0 */ .word 0xAC24FDC0 # sw $a0, -0x240($at)
/* 0x00049CA4 0x800B98A4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00049CA8 0x800B98A8 0xAC30FDC0 */ .word 0xAC30FDC0 # sw $s0, -0x240($at)
/* 0x00049CAC 0x800B98AC 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00049CB0 0x800B98B0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00049CB4 0x800B98B4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00049CB8 0x800B98B8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
