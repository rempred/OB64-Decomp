/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010334..0x00010370 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010334 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_dot_product:
/* 0x00010334 0x8007FF34 0x00000000 */ .word 0x00000000 # nop
/* 0x00010338 0x8007FF38 0x00000000 */ .word 0x00000000 # nop
/* 0x0001033C 0x8007FF3C 0x00000000 */ .word 0x00000000 # nop
/* 0x00010340 0x8007FF40 0xC4860000 */ .word 0xC4860000 # lwc1 $f6, 0x0($a0)
/* 0x00010344 0x8007FF44 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x00010348 0x8007FF48 0x46003182 */ .word 0x46003182 # mul.s $f6, $f6, $f0
/* 0x0001034C 0x8007FF4C 0xC4840004 */ .word 0xC4840004 # lwc1 $f4, 0x4($a0)
/* 0x00010350 0x8007FF50 0xC4A00004 */ .word 0xC4A00004 # lwc1 $f0, 0x4($a1)
/* 0x00010354 0x8007FF54 0x46002102 */ .word 0x46002102 # mul.s $f4, $f4, $f0
/* 0x00010358 0x8007FF58 0xC4A20008 */ .word 0xC4A20008 # lwc1 $f2, 0x8($a1)
/* 0x0001035C 0x8007FF5C 0xC4800008 */ .word 0xC4800008 # lwc1 $f0, 0x8($a0)
/* 0x00010360 0x8007FF60 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x00010364 0x8007FF64 0x46043180 */ .word 0x46043180 # add.s $f6, $f6, $f4
/* 0x00010368 0x8007FF68 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001036C 0x8007FF6C 0x46003000 */ .word 0x46003000 # add.s $f0, $f6, $f0
