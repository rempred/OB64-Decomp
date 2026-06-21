/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_0000F22C_00011000.s
 * z64 range: 0x00010270..0x000102E0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00010270 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
vec3_distance:
/* function boundary candidate: func_00010270, size=100, kind=leaf */
func_00010270:
/* 0x00010270 0x8007FE70 0xC4820000 */ .word 0xC4820000 # lwc1 $f2, 0x0($a0)
/* 0x00010274 0x8007FE74 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x00010278 0x8007FE78 0x46001081 */ .word 0x46001081 # sub.s $f2, $f2, $f0
/* 0x0001027C 0x8007FE7C 0xC4840004 */ .word 0xC4840004 # lwc1 $f4, 0x4($a0)
/* 0x00010280 0x8007FE80 0xC4A00004 */ .word 0xC4A00004 # lwc1 $f0, 0x4($a1)
/* 0x00010284 0x8007FE84 0x46021082 */ .word 0x46021082 # mul.s $f2, $f2, $f2
/* 0x00010288 0x8007FE88 0x46002101 */ .word 0x46002101 # sub.s $f4, $f4, $f0
/* 0x0001028C 0x8007FE8C 0xC4A60008 */ .word 0xC4A60008 # lwc1 $f6, 0x8($a1)
/* 0x00010290 0x8007FE90 0xC4800008 */ .word 0xC4800008 # lwc1 $f0, 0x8($a0)
/* 0x00010294 0x8007FE94 0x46042102 */ .word 0x46042102 # mul.s $f4, $f4, $f4
/* 0x00010298 0x8007FE98 0x46060001 */ .word 0x46060001 # sub.s $f0, $f0, $f6
/* 0x0001029C 0x8007FE9C 0x46000002 */ .word 0x46000002 # mul.s $f0, $f0, $f0
/* 0x000102A0 0x8007FEA0 0x46041080 */ .word 0x46041080 # add.s $f2, $f2, $f4
/* 0x000102A4 0x8007FEA4 0x46001300 */ .word 0x46001300 # add.s $f12, $f2, $f0
/* 0x000102A8 0x8007FEA8 0x46006004 */ .word 0x46006004 # sqrt.s $f0, $f12
/* 0x000102AC 0x8007FEAC 0x46000032 */ .word 0x46000032 # c.0x2.s $f0, $f0

/* function boundary candidate: func_000102B0, size=36, kind=prologue */
func_000102B0:
/* 0x000102B0 0x8007FEB0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000102B4 0x8007FEB4 0x00000000 */ .word 0x00000000 # nop
/* 0x000102B8 0x8007FEB8 0x45010003 */ .word 0x45010003 # bc1t 0x8007FEC8
/* 0x000102BC 0x8007FEBC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x000102C0 0x8007FEC0 0x0C0241F8 */ .word 0x0C0241F8 # jal 0x800907E0
/* 0x000102C4 0x8007FEC4 0x00000000 */ .word 0x00000000 # nop
/* 0x000102C8 0x8007FEC8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000102CC 0x8007FECC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000102D0 0x8007FED0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x000102D4 0x8007FED4 0x00000000 */ .word 0x00000000 # nop
/* 0x000102D8 0x8007FED8 0x00000000 */ .word 0x00000000 # nop
/* 0x000102DC 0x8007FEDC 0x00000000 */ .word 0x00000000 # nop
