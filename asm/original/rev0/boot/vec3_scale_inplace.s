/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010590..0x000105D0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010590 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_scale_inplace:
/* function boundary candidate: func_00010590, size=52, kind=leaf */
func_00010590:
/* 0x00010590 0x80080190 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x00010594 0x80080194 0xC4460000 */ .word 0xC4460000 # lwc1 $f6, 0x0($v0)
/* 0x00010598 0x80080198 0x44852000 */ .word 0x44852000 # mtc1 $a1, $f4
/* 0x0001059C 0x8008019C 0x00000000 */ .word 0x00000000 # nop
/* 0x000105A0 0x800801A0 0x46043182 */ .word 0x46043182 # mul.s $f6, $f6, $f4
/* 0x000105A4 0x800801A4 0xC4420004 */ .word 0xC4420004 # lwc1 $f2, 0x4($v0)
/* 0x000105A8 0x800801A8 0x46041082 */ .word 0x46041082 # mul.s $f2, $f2, $f4
/* 0x000105AC 0x800801AC 0xC4400008 */ .word 0xC4400008 # lwc1 $f0, 0x8($v0)
/* 0x000105B0 0x800801B0 0x46040002 */ .word 0x46040002 # mul.s $f0, $f0, $f4
/* 0x000105B4 0x800801B4 0xE4460000 */ .word 0xE4460000 # swc1 $f6, 0x0($v0)
/* 0x000105B8 0x800801B8 0xE4420004 */ .word 0xE4420004 # swc1 $f2, 0x4($v0)
/* 0x000105BC 0x800801BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000105C0 0x800801C0 0xE4400008 */ .word 0xE4400008 # swc1 $f0, 0x8($v0)
/* 0x000105C4 0x800801C4 0x00000000 */ .word 0x00000000 # nop
/* 0x000105C8 0x800801C8 0x00000000 */ .word 0x00000000 # nop
/* 0x000105CC 0x800801CC 0x00000000 */ .word 0x00000000 # nop
