/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00211D20..0x00211D5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Two NUL-terminated ASCII strings "%s has changed class." @0x211D20 and "Supportive Attack" @0x211D38, plus trailing NUL alignment padding to 0x211D5C.. */
/* 0x00211D20 0x80281920 0x25732068 */ .word 0x25732068 # addiu $s3, $t3, 0x2068
/* 0x00211D24 0x80281924 0x61732063 */ .word 0x61732063 # daddi $s3, $t3, 0x2063
/* 0x00211D28 0x80281928 0x68616E67 */ .word 0x68616E67 # ldl $at, 0x6E67($v1)
/* 0x00211D2C 0x8028192C 0x65642063 */ .word 0x65642063 # daddiu $a0, $t3, 0x2063
/* 0x00211D30 0x80281930 0x6C617373 */ .word 0x6C617373 # ldr $at, 0x7373($v1)
/* 0x00211D34 0x80281934 0x2E000000 */ .word 0x2E000000 # sltiu $zero, $s0, 0x0
/* 0x00211D38 0x80281938 0x53757070 */ .word 0x53757070 # beql $k1, $s5, 0x8029DAFC
/* 0x00211D3C 0x8028193C 0x6F727469 */ .word 0x6F727469 # ldr $s2, 0x7469($k1)
/* 0x00211D40 0x80281940 0x76652041 */ .word 0x76652041 # op_0x1D
/* 0x00211D44 0x80281944 0x74746163 */ .word 0x74746163 # op_0x1D
/* 0x00211D48 0x80281948 0x6B000000 */ .word 0x6B000000 # ldl $zero, 0x0($t8)
/* 0x00211D4C 0x8028194C 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D50 0x80281950 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D54 0x80281954 0x00000000 */ .word 0x00000000 # nop
/* 0x00211D58 0x80281958 0x00000000 */ .word 0x00000000 # nop
