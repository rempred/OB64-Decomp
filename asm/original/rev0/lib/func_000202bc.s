/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000202BC..0x00020308 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000202BC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000202bc:
/* 0x000202BC 0x8008FEBC 0x44850000 */ .word 0x44850000 # mtc1 $a1, $f0
/* 0x000202C0 0x8008FEC0 0x00000000 */ .word 0x00000000 # nop
/* 0x000202C4 0x8008FEC4 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x000202C8 0x8008FEC8 0xC4820044 */ .word 0xC4820044 # lwc1 $f2, 0x44($a0)
/* 0x000202CC 0x8008FECC 0x468010A0 */ .word 0x468010A0 # cvt.s.w $f2, $f2
/* 0x000202D0 0x8008FED0 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x000202D4 0x8008FED4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000202D8 0x8008FED8 0xD422E880 */ .word 0xD422E880 # ldc1 $f2, -0x1780($at)
/* 0x000202DC 0x8008FEDC 0x46000021 */ .word 0x46000021 # cvt.d.s $f0, $f0
/* 0x000202E0 0x8008FEE0 0x46220003 */ .word 0x46220003 # div.d $f0, $f0, $f2
/* 0x000202E4 0x8008FEE4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000202E8 0x8008FEE8 0xD422E888 */ .word 0xD422E888 # ldc1 $f2, -0x1778($at)
/* 0x000202EC 0x8008FEEC 0x46220000 */ .word 0x46220000 # add.d $f0, $f0, $f2
/* 0x000202F0 0x8008FEF0 0x46200020 */ .word 0x46200020 # cvt.s.d $f0, $f0
/* 0x000202F4 0x8008FEF4 0x4600008D */ .word 0x4600008D # trunc.w.s $f2, $f0
/* 0x000202F8 0x8008FEF8 0x44031000 */ .word 0x44031000 # mfc1 $v1, $f2
/* 0x000202FC 0x8008FEFC 0x2402FFF0 */ .word 0x2402FFF0 # addiu $v0, $zero, -0x10
/* 0x00020300 0x8008FF00 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00020304 0x8008FF04 0x00621024 */ .word 0x00621024 # and $v0, $v1, $v0
