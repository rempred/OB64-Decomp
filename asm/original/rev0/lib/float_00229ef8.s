/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x00229EF8..0x00229F18 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Float/double constant pool: 0x3FB99999_9999999A (=0.1 double), 0x3F000000 (=0.5), 0x3F800000 (=1.0), 0x42340000 (=45.0), 0x41700000 (=15.0), with nop padding.. */
/* 0x00229EF8 0x80299AF8 0x3FB99999 */ .word 0x3FB99999 # lui $t9, 0x9999
/* 0x00229EFC 0x80299AFC 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
/* 0x00229F00 0x80299B00 0x00000000 */ .word 0x00000000 # nop
/* 0x00229F04 0x80299B04 0x3F000000 */ .word 0x3F000000 # lui $zero, 0x0000
/* 0x00229F08 0x80299B08 0x3F800000 */ .word 0x3F800000 # lui $zero, 0x0000
/* 0x00229F0C 0x80299B0C 0x42340000 */ .word 0x42340000 # cop0_0x11
/* 0x00229F10 0x80299B10 0x41700000 */ .word 0x41700000 # cop0_0x0B
/* 0x00229F14 0x80299B14 0x00000000 */ .word 0x00000000 # nop
