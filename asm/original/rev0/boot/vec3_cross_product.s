/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x000102E0..0x00010334 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000102E0 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_cross_product:
/* function boundary candidate: func_000102E0, size=84, kind=leaf */
func_000102E0:
/* 0x000102E0 0x8007FEE0 0xC4AE0004 */ .word 0xC4AE0004 # lwc1 $f14, 0x4($a1)
/* 0x000102E4 0x8007FEE4 0xC4C60008 */ .word 0xC4C60008 # lwc1 $f6, 0x8($a2)
/* 0x000102E8 0x8007FEE8 0x46067202 */ .word 0x46067202 # mul.s $f8, $f14, $f6
/* 0x000102EC 0x8007FEEC 0xC4CA0004 */ .word 0xC4CA0004 # lwc1 $f10, 0x4($a2)
/* 0x000102F0 0x8007FEF0 0xC4A40008 */ .word 0xC4A40008 # lwc1 $f4, 0x8($a1)
/* 0x000102F4 0x8007FEF4 0x46045302 */ .word 0x46045302 # mul.s $f12, $f10, $f4
/* 0x000102F8 0x8007FEF8 0xC4C20000 */ .word 0xC4C20000 # lwc1 $f2, 0x0($a2)
/* 0x000102FC 0x8007FEFC 0x46041102 */ .word 0x46041102 # mul.s $f4, $f2, $f4
/* 0x00010300 0x8007FF00 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x00010304 0x8007FF04 0x46060182 */ .word 0x46060182 # mul.s $f6, $f0, $f6
/* 0x00010308 0x8007FF08 0x00000000 */ .word 0x00000000 # nop
/* 0x0001030C 0x8007FF0C 0x460A0002 */ .word 0x460A0002 # mul.s $f0, $f0, $f10
/* 0x00010310 0x8007FF10 0x460C4201 */ .word 0x460C4201 # sub.s $f8, $f8, $f12
/* 0x00010314 0x8007FF14 0x460E1082 */ .word 0x460E1082 # mul.s $f2, $f2, $f14
/* 0x00010318 0x8007FF18 0x46062101 */ .word 0x46062101 # sub.s $f4, $f4, $f6
/* 0x0001031C 0x8007FF1C 0x46020001 */ .word 0x46020001 # sub.s $f0, $f0, $f2
/* 0x00010320 0x8007FF20 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x00010324 0x8007FF24 0xE4480000 */ .word 0xE4480000 # swc1 $f8, 0x0($v0)
/* 0x00010328 0x8007FF28 0xE4440004 */ .word 0xE4440004 # swc1 $f4, 0x4($v0)
/* 0x0001032C 0x8007FF2C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00010330 0x8007FF30 0xE4400008 */ .word 0xE4400008 # swc1 $f0, 0x8($v0)
