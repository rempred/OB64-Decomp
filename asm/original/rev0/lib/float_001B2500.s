/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001B2500..0x001B2518 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Double-precision IEEE constant pool, 3 doubles: 0x3F91DE69AD42C3CA = 0.0174532925 (pi/180, degrees->radians), 0x3F91EB851EB851EC = 0.0175, 0x4013333333333333 = 4.8.. */
/* 0x001B2500 0x80222100 0x3F91DE69 */ .word 0x3F91DE69 # lui $s1, 0xDE69
/* 0x001B2504 0x80222104 0xAD42C3CA */ .word 0xAD42C3CA # sw $v0, -0x3C36($t2)
/* 0x001B2508 0x80222108 0x3F91EB85 */ .word 0x3F91EB85 # lui $s1, 0xEB85
/* 0x001B250C 0x8022210C 0x1EB851EC */ .word 0x1EB851EC # bgtz $s5, 0x802368C0
/* 0x001B2510 0x80222110 0x40133333 */ .word 0x40133333 # mfc0 $s3, $6
/* 0x001B2514 0x80222114 0x33333333 */ .word 0x33333333 # andi $s3, $t9, 0x3333
