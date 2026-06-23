/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x00213528..0x00213560 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): f64 const pool: 0x4066800000000000 = 180.0; 0x400921FB54442D18 = pi (x2); 0x3F747AE147AE147B = 0.005; 0x3FE0000000000000 = 0.5; 0x3FF199999999999A = 1.1. Includes interspersed 0.0 pad words. [note: pool holds 180.0 x2 + pi x2].. */
/* 0x00213528 0x80283128 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x0021352C 0x8028312C 0x00000000 */ .word 0x00000000 # nop
/* 0x00213530 0x80283130 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00213534 0x80283134 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8028E598
/* 0x00213538 0x80283138 0x40668000 */ .word 0x40668000 # cop0_0x03
/* 0x0021353C 0x8028313C 0x00000000 */ .word 0x00000000 # nop
/* 0x00213540 0x80283140 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x00213544 0x80283144 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8028E5A8
/* 0x00213548 0x80283148 0x3F747AE1 */ .word 0x3F747AE1 # lui $s4, 0x7AE1
/* 0x0021354C 0x8028314C 0x47AE147B */ .word 0x47AE147B # c.0xB.fmt29 $f2, $f14
/* 0x00213550 0x80283150 0x3FE00000 */ .word 0x3FE00000 # lui $zero, 0x0000
/* 0x00213554 0x80283154 0x00000000 */ .word 0x00000000 # nop
/* 0x00213558 0x80283158 0x3FF19999 */ .word 0x3FF19999 # lui $s1, 0x9999
/* 0x0021355C 0x8028315C 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
