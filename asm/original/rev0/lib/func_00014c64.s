/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014C64..0x00014CA0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014C64 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014c64:
/* 0x00014C64 0x80084864 0x90A20000 */ .word 0x90A20000 # lbu $v0, 0x0($a1)
/* 0x00014C68 0x80084868 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00014C6C 0x8008486C 0xD422E4E0 */ .word 0xD422E4E0 # ldc1 $f2, -0x1B20($at)
/* 0x00014C70 0x80084870 0x44820000 */ .word 0x44820000 # mtc1 $v0, $f0
/* 0x00014C74 0x80084874 0x00000000 */ .word 0x00000000 # nop
/* 0x00014C78 0x80084878 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x00014C7C 0x8008487C 0x46000021 */ .word 0x46000021 # cvt.d.s $f0, $f0
/* 0x00014C80 0x80084880 0x46220002 */ .word 0x46220002 # mul.d $f0, $f0, $f2
/* 0x00014C84 0x80084884 0xC4820070 */ .word 0xC4820070 # lwc1 $f2, 0x70($a0)
/* 0x00014C88 0x80084888 0x46200020 */ .word 0x46200020 # cvt.s.d $f0, $f0
/* 0x00014C8C 0x8008488C 0x46001082 */ .word 0x46001082 # mul.s $f2, $f2, $f0
/* 0x00014C90 0x80084890 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
/* 0x00014C94 0x80084894 0xE480006C */ .word 0xE480006C # swc1 $f0, 0x6C($a0)
/* 0x00014C98 0x80084898 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014C9C 0x8008489C 0xE4820024 */ .word 0xE4820024 # swc1 $f2, 0x24($a0)
