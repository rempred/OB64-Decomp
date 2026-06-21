/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010500..0x0001054C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010500 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_magnitude_checked:
/* function boundary candidate: func_00010500, size=76, kind=leaf */
func_00010500:
/* 0x00010500 0x80080100 0xC4840000 */ .word 0xC4840000 # lwc1 $f4, 0x0($a0)
/* 0x00010504 0x80080104 0x46042102 */ .word 0x46042102 # mul.s $f4, $f4, $f4
/* 0x00010508 0x80080108 0xC4820004 */ .word 0xC4820004 # lwc1 $f2, 0x4($a0)
/* 0x0001050C 0x8008010C 0x46021082 */ .word 0x46021082 # mul.s $f2, $f2, $f2
/* 0x00010510 0x80080110 0xC4800008 */ .word 0xC4800008 # lwc1 $f0, 0x8($a0)
/* 0x00010514 0x80080114 0x46000002 */ .word 0x46000002 # mul.s $f0, $f0, $f0
/* 0x00010518 0x80080118 0x46022100 */ .word 0x46022100 # add.s $f4, $f4, $f2
/* 0x0001051C 0x8008011C 0x46002300 */ .word 0x46002300 # add.s $f12, $f4, $f0
/* 0x00010520 0x80080120 0x46006004 */ .word 0x46006004 # sqrt.s $f0, $f12
/* 0x00010524 0x80080124 0x46000032 */ .word 0x46000032 # c.0x2.s $f0, $f0

/* function boundary candidate: func_00010528, size=96, kind=prologue */
func_00010528:
/* 0x00010528 0x80080128 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0001052C 0x8008012C 0x00000000 */ .word 0x00000000 # nop
/* 0x00010530 0x80080130 0x45010003 */ .word 0x45010003 # bc1t 0x80080140
/* 0x00010534 0x80080134 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00010538 0x80080138 0x0C0241F8 */ .word 0x0C0241F8 # jal 0x800907E0
/* 0x0001053C 0x8008013C 0x00000000 */ .word 0x00000000 # nop
/* 0x00010540 0x80080140 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00010544 0x80080144 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010548 0x80080148 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
