/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018E84..0x00018ED4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00018E84 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00018e84:
/* 0x00018E84 0x80088A84 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00018E88 0x80088A88 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)
/* 0x00018E8C 0x80088A8C 0x44840000 */ .word 0x44840000 # mtc1 $a0, $f0
/* 0x00018E90 0x80088A90 0x00000000 */ .word 0x00000000 # nop
/* 0x00018E94 0x80088A94 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x00018E98 0x80088A98 0xC4420040 */ .word 0xC4420040 # lwc1 $f2, 0x40($v0)
/* 0x00018E9C 0x80088A9C 0x468010A0 */ .word 0x468010A0 # cvt.s.w $f2, $f2
/* 0x00018EA0 0x80088AA0 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x00018EA4 0x80088AA4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00018EA8 0x80088AA8 0xD422E5F0 */ .word 0xD422E5F0 # ldc1 $f2, -0x1A10($at)
/* 0x00018EAC 0x80088AAC 0x46000021 */ .word 0x46000021 # cvt.d.s $f0, $f0
/* 0x00018EB0 0x80088AB0 0x46220003 */ .word 0x46220003 # div.d $f0, $f0, $f2
/* 0x00018EB4 0x80088AB4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00018EB8 0x80088AB8 0xD422E5F8 */ .word 0xD422E5F8 # ldc1 $f2, -0x1A08($at)
/* 0x00018EBC 0x80088ABC 0x46220000 */ .word 0x46220000 # add.d $f0, $f0, $f2
/* 0x00018EC0 0x80088AC0 0x46200020 */ .word 0x46200020 # cvt.s.d $f0, $f0
/* 0x00018EC4 0x80088AC4 0x4600008D */ .word 0x4600008D # trunc.w.s $f2, $f0
/* 0x00018EC8 0x80088AC8 0x44021000 */ .word 0x44021000 # mfc1 $v0, $f2
/* 0x00018ECC 0x80088ACC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00018ED0 0x80088AD0 0x00000000 */ .word 0x00000000 # nop
