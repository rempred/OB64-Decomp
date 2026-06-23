/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00229A2C..0x00229A60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII format-string pool: "%s became %s.\x00", "%s fled.\x00", "%s has regenerated.\x00".. */
/* 0x00229A2C 0x8029962C 0x25732062 */ .word 0x25732062 # addiu $s3, $t3, 0x2062
/* 0x00229A30 0x80299630 0x6563616D */ .word 0x6563616D # daddiu $v1, $t3, 0x616D
/* 0x00229A34 0x80299634 0x65202573 */ .word 0x65202573 # daddiu $zero, $t1, 0x2573
/* 0x00229A38 0x80299638 0x2E000000 */ .word 0x2E000000 # sltiu $zero, $s0, 0x0
/* 0x00229A3C 0x8029963C 0x25732066 */ .word 0x25732066 # addiu $s3, $t3, 0x2066
/* 0x00229A40 0x80299640 0x6C65642E */ .word 0x6C65642E # ldr $a1, 0x642E($v1)
/* 0x00229A44 0x80299644 0x00000000 */ .word 0x00000000 # nop
/* 0x00229A48 0x80299648 0x25732068 */ .word 0x25732068 # addiu $s3, $t3, 0x2068
/* 0x00229A4C 0x8029964C 0x61732072 */ .word 0x61732072 # daddi $s3, $t3, 0x2072
/* 0x00229A50 0x80299650 0x6567656E */ .word 0x6567656E # daddiu $a3, $t3, 0x656E
/* 0x00229A54 0x80299654 0x65726174 */ .word 0x65726174 # daddiu $s2, $t3, 0x6174
/* 0x00229A58 0x80299658 0x65642E00 */ .word 0x65642E00 # daddiu $a0, $t3, 0x2E00
/* 0x00229A5C 0x8029965C 0x00000000 */ .word 0x00000000 # nop
