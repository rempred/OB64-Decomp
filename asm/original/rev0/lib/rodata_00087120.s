/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00081000_00091000.s
 * z64 range: 0x00087120..0x00087134 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Constant float pool: two IEEE-754 doubles — 0x3FE3333333333333 (~0.6) and 0x3FD999999999999A (~0.4) — followed by a single 0x00000000 alignment/terminator word at 0x87130. Value type: 64-bit float constants.. */
/* 0x00087120 0x800F6D20 0x3FE33333 */ .word 0x3FE33333 # lui $v1, 0x3333
/* 0x00087124 0x800F6D24 0x33333333 */ .word 0x33333333 # andi $s3, $t9, 0x3333
/* 0x00087128 0x800F6D28 0x3FD99999 */ .word 0x3FD99999 # lui $t9, 0x9999
/* 0x0008712C 0x800F6D2C 0x9999999A */ .word 0x9999999A # lwr $t9, -0x6666($t4)
/* 0x00087130 0x800F6D30 0x00000000 */ .word 0x00000000 # nop
