/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010370..0x000103D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010370 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_normalize_to:
/* function boundary candidate: func_00010370, size=92, kind=prologue */
func_00010370:
/* 0x00010370 0x8007FF70 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x00010374 0x8007FF74 0xAFB10014 */ .word 0xAFB10014 # sw $s1, 0x14($sp)
/* 0x00010378 0x8007FF78 0x00808821 */ .word 0x00808821 # move $s1, $a0
/* 0x0001037C 0x8007FF7C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00010380 0x8007FF80 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x00010384 0x8007FF84 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x00010388 0x8007FF88 0x0C020040 */ .word 0x0C020040 # jal 0x80080100
/* 0x0001038C 0x8007FF8C 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00010390 0x8007FF90 0xC6060000 */ .word 0xC6060000 # lwc1 $f6, 0x0($s0)
/* 0x00010394 0x8007FF94 0x46003183 */ .word 0x46003183 # div.s $f6, $f6, $f0
/* 0x00010398 0x8007FF98 0xC6040004 */ .word 0xC6040004 # lwc1 $f4, 0x4($s0)
/* 0x0001039C 0x8007FF9C 0x46002103 */ .word 0x46002103 # div.s $f4, $f4, $f0
/* 0x000103A0 0x8007FFA0 0xC6020008 */ .word 0xC6020008 # lwc1 $f2, 0x8($s0)
/* 0x000103A4 0x8007FFA4 0x46001083 */ .word 0x46001083 # div.s $f2, $f2, $f0
/* 0x000103A8 0x8007FFA8 0x02201021 */ .word 0x02201021 # move $v0, $s1
/* 0x000103AC 0x8007FFAC 0xE6260000 */ .word 0xE6260000 # swc1 $f6, 0x0($s1)
/* 0x000103B0 0x8007FFB0 0xE6240004 */ .word 0xE6240004 # swc1 $f4, 0x4($s1)
/* 0x000103B4 0x8007FFB4 0xE6220008 */ .word 0xE6220008 # swc1 $f2, 0x8($s1)
/* 0x000103B8 0x8007FFB8 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x000103BC 0x8007FFBC 0x8FB10014 */ .word 0x8FB10014 # lw $s1, 0x14($sp)
/* 0x000103C0 0x8007FFC0 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x000103C4 0x8007FFC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000103C8 0x8007FFC8 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
/* 0x000103CC 0x8007FFCC 0x00000000 */ .word 0x00000000 # nop
