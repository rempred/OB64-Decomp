/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x000105D0..0x00010610 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000105D0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_add_inplace:
/* function boundary candidate: func_000105D0, size=56, kind=leaf */
func_000105D0:
/* 0x000105D0 0x800801D0 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x000105D4 0x800801D4 0xC4460000 */ .word 0xC4460000 # lwc1 $f6, 0x0($v0)
/* 0x000105D8 0x800801D8 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x000105DC 0x800801DC 0xC4440004 */ .word 0xC4440004 # lwc1 $f4, 0x4($v0)
/* 0x000105E0 0x800801E0 0x46003180 */ .word 0x46003180 # add.s $f6, $f6, $f0
/* 0x000105E4 0x800801E4 0xC4A00004 */ .word 0xC4A00004 # lwc1 $f0, 0x4($a1)
/* 0x000105E8 0x800801E8 0xC4420008 */ .word 0xC4420008 # lwc1 $f2, 0x8($v0)
/* 0x000105EC 0x800801EC 0x46002100 */ .word 0x46002100 # add.s $f4, $f4, $f0
/* 0x000105F0 0x800801F0 0xC4A00008 */ .word 0xC4A00008 # lwc1 $f0, 0x8($a1)
/* 0x000105F4 0x800801F4 0x46001080 */ .word 0x46001080 # add.s $f2, $f2, $f0
/* 0x000105F8 0x800801F8 0xE4460000 */ .word 0xE4460000 # swc1 $f6, 0x0($v0)
/* 0x000105FC 0x800801FC 0xE4440004 */ .word 0xE4440004 # swc1 $f4, 0x4($v0)
/* 0x00010600 0x80080200 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010604 0x80080204 0xE4420008 */ .word 0xE4420008 # swc1 $f2, 0x8($v0)
/* 0x00010608 0x80080208 0x00000000 */ .word 0x00000000 # nop
/* 0x0001060C 0x8008020C 0x00000000 */ .word 0x00000000 # nop
