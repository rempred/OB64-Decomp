/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018ED4..0x00018F30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00018ED4 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00018ed4:
/* 0x00018ED4 0x80088AD4 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00018ED8 0x80088AD8 0x8C429E54 */ .word 0x8C429E54 # lw $v0, -0x61AC($v0)
/* 0x00018EDC 0x80088ADC 0x44840000 */ .word 0x44840000 # mtc1 $a0, $f0
/* 0x00018EE0 0x80088AE0 0x00000000 */ .word 0x00000000 # nop
/* 0x00018EE4 0x80088AE4 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x00018EE8 0x80088AE8 0xC4420040 */ .word 0xC4420040 # lwc1 $f2, 0x40($v0)
/* 0x00018EEC 0x80088AEC 0x468010A0 */ .word 0x468010A0 # cvt.s.w $f2, $f2
/* 0x00018EF0 0x80088AF0 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x00018EF4 0x80088AF4 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00018EF8 0x80088AF8 0xD422E600 */ .word 0xD422E600 # ldc1 $f2, -0x1A00($at)
/* 0x00018EFC 0x80088AFC 0x46000021 */ .word 0x46000021 # cvt.d.s $f0, $f0
/* 0x00018F00 0x80088B00 0x46220003 */ .word 0x46220003 # div.d $f0, $f0, $f2
/* 0x00018F04 0x80088B04 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00018F08 0x80088B08 0xD422E608 */ .word 0xD422E608 # ldc1 $f2, -0x19F8($at)
/* 0x00018F0C 0x80088B0C 0x46220000 */ .word 0x46220000 # add.d $f0, $f0, $f2
/* 0x00018F10 0x80088B10 0x46200020 */ .word 0x46200020 # cvt.s.d $f0, $f0
/* 0x00018F14 0x80088B14 0x4600008D */ .word 0x4600008D # trunc.w.s $f2, $f0
/* 0x00018F18 0x80088B18 0x44031000 */ .word 0x44031000 # mfc1 $v1, $f2
/* 0x00018F1C 0x80088B1C 0x2402FFF0 */ .word 0x2402FFF0 # addiu $v0, $zero, -0x10
/* 0x00018F20 0x80088B20 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00018F24 0x80088B24 0x00621024 */ .word 0x00621024 # and $v0, $v1, $v0
/* 0x00018F28 0x80088B28 0x00000000 */ .word 0x00000000 # nop
/* 0x00018F2C 0x80088B2C 0x00000000 */ .word 0x00000000 # nop
