/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213290..0x002132A8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): f64 const pool: 0x3FF199999999999A = 1.1 (three copies).. */
/* 0x00213290 0x80282E90 0x3FF19999 */ .word 0x3FF19999 # lui $s1, 0x9999
/* 0x00213294 0x80282E94 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
/* 0x00213298 0x80282E98 0x3FF19999 */ .word 0x3FF19999 # lui $s1, 0x9999
/* 0x0021329C 0x80282E9C 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
/* 0x002132A0 0x80282EA0 0x3FF19999 */ .word 0x3FF19999 # lui $s1, 0x9999
/* 0x002132A4 0x80282EA4 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
