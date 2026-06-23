/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F0970..0x001F0978 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 double-precision constant 0x3FF19999_9999999A = 1.1.. */
/* 0x001F0970 0x80260570 0x3FF19999 */ .word 0x3FF19999 # lui $s1, 0x9999
/* 0x001F0974 0x80260574 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
