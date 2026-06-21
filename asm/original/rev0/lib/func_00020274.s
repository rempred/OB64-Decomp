/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00020274..0x000202BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00020274 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00020274:
/* 0x00020274 0x8008FE74 0x44850000 */ .word 0x44850000 # mtc1 $a1, $f0
/* 0x00020278 0x8008FE78 0x00000000 */ .word 0x00000000 # nop
/* 0x0002027C 0x8008FE7C 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x00020280 0x8008FE80 0xC4820044 */ .word 0xC4820044 # lwc1 $f2, 0x44($a0)
/* 0x00020284 0x8008FE84 0x468010A0 */ .word 0x468010A0 # cvt.s.w $f2, $f2
/* 0x00020288 0x8008FE88 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x0002028C 0x8008FE8C 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00020290 0x8008FE90 0xD422E870 */ .word 0xD422E870 # ldc1 $f2, -0x1790($at)
/* 0x00020294 0x8008FE94 0x46000021 */ .word 0x46000021 # cvt.d.s $f0, $f0
/* 0x00020298 0x8008FE98 0x46220003 */ .word 0x46220003 # div.d $f0, $f0, $f2
/* 0x0002029C 0x8008FE9C 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x000202A0 0x8008FEA0 0xD422E878 */ .word 0xD422E878 # ldc1 $f2, -0x1788($at)
/* 0x000202A4 0x8008FEA4 0x46220000 */ .word 0x46220000 # add.d $f0, $f0, $f2
/* 0x000202A8 0x8008FEA8 0x46200020 */ .word 0x46200020 # cvt.s.d $f0, $f0
/* 0x000202AC 0x8008FEAC 0x4600008D */ .word 0x4600008D # trunc.w.s $f2, $f0
/* 0x000202B0 0x8008FEB0 0x44021000 */ .word 0x44021000 # mfc1 $v0, $f2
/* 0x000202B4 0x8008FEB4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000202B8 0x8008FEB8 0x00000000 */ .word 0x00000000 # nop
