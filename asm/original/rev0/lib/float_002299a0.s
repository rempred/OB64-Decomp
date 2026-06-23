/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x002299A0..0x002299B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Double constant pool: 0x3FE99999_9999999A (=0.8), 0x3FF80000_00000000 (=1.5).. */
/* 0x002299A0 0x802995A0 0x3FE99999 */ .word 0x3FE99999 # lui $t1, 0x9999
/* 0x002299A4 0x802995A4 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
/* 0x002299A8 0x802995A8 0x3FF80000 */ .word 0x3FF80000 # lui $t8, 0x0000
/* 0x002299AC 0x802995AC 0x00000000 */ .word 0x00000000 # nop
