/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x0025EEF8..0x0025EF78 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN folded forward: frameless FP block at 0x0025EEF8 (lwc1 $f6,4($a0); lwc1 $f0,8($a1); mul.s; lwc1 $f2,4($a1); lwc1 $f0,8($a0); mul.s; sub.s $f6) computes the X component of a vec3 cross product into $f6, then falls through into prologue addiu $sp,-0x10 at 0x0025EF14 which reads $f6 (swc1 $f6,0($sp)) before writing it and computes the Y/Z components. Single cross-product function; true entry is 0x0025EEF8. jr $ra at 0x0025EF70 + delay addiu $sp,0x10 at 0x0025EF74. */
func_0025EEF8:
/* 0x0025EEF8 0x802CEAF8 0xC4860004 */ .word 0xC4860004 # lwc1 $f6, 0x4($a0)
/* 0x0025EEFC 0x802CEAFC 0xC4A00008 */ .word 0xC4A00008 # lwc1 $f0, 0x8($a1)
/* 0x0025EF00 0x802CEB00 0x46003182 */ .word 0x46003182 # mul.s $f6, $f6, $f0
/* 0x0025EF04 0x802CEB04 0xC4A20004 */ .word 0xC4A20004 # lwc1 $f2, 0x4($a1)
/* 0x0025EF08 0x802CEB08 0xC4800008 */ .word 0xC4800008 # lwc1 $f0, 0x8($a0)
/* 0x0025EF0C 0x802CEB0C 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x0025EF10 0x802CEB10 0x46003181 */ .word 0x46003181 # sub.s $f6, $f6, $f0

/* function boundary candidate: func_0025EF14, size=100, kind=prologue */
func_0025EF14:
/* 0x0025EF14 0x802CEB14 0x27BDFFF0 */ .word 0x27BDFFF0 # addiu $sp, $sp, -0x10
/* 0x0025EF18 0x802CEB18 0xE7A60000 */ .word 0xE7A60000 # swc1 $f6, 0x0($sp)
/* 0x0025EF1C 0x802CEB1C 0xC4840008 */ .word 0xC4840008 # lwc1 $f4, 0x8($a0)
/* 0x0025EF20 0x802CEB20 0xC4A00000 */ .word 0xC4A00000 # lwc1 $f0, 0x0($a1)
/* 0x0025EF24 0x802CEB24 0x46002102 */ .word 0x46002102 # mul.s $f4, $f4, $f0
/* 0x0025EF28 0x802CEB28 0xC4A20008 */ .word 0xC4A20008 # lwc1 $f2, 0x8($a1)
/* 0x0025EF2C 0x802CEB2C 0xC4800000 */ .word 0xC4800000 # lwc1 $f0, 0x0($a0)
/* 0x0025EF30 0x802CEB30 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x0025EF34 0x802CEB34 0x46002101 */ .word 0x46002101 # sub.s $f4, $f4, $f0
/* 0x0025EF38 0x802CEB38 0xE7A40004 */ .word 0xE7A40004 # swc1 $f4, 0x4($sp)
/* 0x0025EF3C 0x802CEB3C 0xC4840000 */ .word 0xC4840000 # lwc1 $f4, 0x0($a0)
/* 0x0025EF40 0x802CEB40 0xC4A00004 */ .word 0xC4A00004 # lwc1 $f0, 0x4($a1)
/* 0x0025EF44 0x802CEB44 0x46002102 */ .word 0x46002102 # mul.s $f4, $f4, $f0
/* 0x0025EF48 0x802CEB48 0xC4A20000 */ .word 0xC4A20000 # lwc1 $f2, 0x0($a1)
/* 0x0025EF4C 0x802CEB4C 0xC4800004 */ .word 0xC4800004 # lwc1 $f0, 0x4($a0)
/* 0x0025EF50 0x802CEB50 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x0025EF54 0x802CEB54 0x46002101 */ .word 0x46002101 # sub.s $f4, $f4, $f0
/* 0x0025EF58 0x802CEB58 0xE7A40008 */ .word 0xE7A40008 # swc1 $f4, 0x8($sp)
/* 0x0025EF5C 0x802CEB5C 0xE4C60000 */ .word 0xE4C60000 # swc1 $f6, 0x0($a2)
/* 0x0025EF60 0x802CEB60 0xC7A00004 */ .word 0xC7A00004 # lwc1 $f0, 0x4($sp)
/* 0x0025EF64 0x802CEB64 0xE4C00004 */ .word 0xE4C00004 # swc1 $f0, 0x4($a2)
/* 0x0025EF68 0x802CEB68 0xC7A00008 */ .word 0xC7A00008 # lwc1 $f0, 0x8($sp)
/* 0x0025EF6C 0x802CEB6C 0xE4C00008 */ .word 0xE4C00008 # swc1 $f0, 0x8($a2)
/* 0x0025EF70 0x802CEB70 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0025EF74 0x802CEB74 0x27BD0010 */ .word 0x27BD0010 # addiu $sp, $sp, 0x10
