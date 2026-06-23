/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x00299F80..0x00299FA4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): ASCII string: '    ( Scene Replay: Left Button(not)' (bytes 20 20 20 20 28 ... 6E 29), 0-terminated within word @0x299F9C. (includes trailing null/alignment word @0x299FA0).. */
/* 0x00299F80 0x80309B80 0x20202020 */ .word 0x20202020 # addi $zero, $at, 0x2020
/* 0x00299F84 0x80309B84 0x20285363 */ .word 0x20285363 # addi $t0, $at, 0x5363
/* 0x00299F88 0x80309B88 0x656E6520 */ .word 0x656E6520 # daddiu $t6, $t3, 0x6520
/* 0x00299F8C 0x80309B8C 0x5265706C */ .word 0x5265706C # beql $s3, $a1, 0x80325D40
/* 0x00299F90 0x80309B90 0x61793A20 */ .word 0x61793A20 # daddi $t9, $t3, 0x3A20
/* 0x00299F94 0x80309B94 0x4C656674 */ .word 0x4C656674 # op_0x13
/* 0x00299F98 0x80309B98 0x20427574 */ .word 0x20427574 # addi $v0, $v0, 0x7574
/* 0x00299F9C 0x80309B9C 0x746F6E29 */ .word 0x746F6E29 # op_0x1D
/* 0x00299FA0 0x80309BA0 0x00000000 */ .word 0x00000000 # nop
