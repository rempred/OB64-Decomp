/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001CE050..0x001CE064 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small debug/test string "tusc_hc_test come" with newline/NUL termination.. */
/* 0x001CE050 0x8023DC50 0x74757363 */ .word 0x74757363 # op_0x1D
/* 0x001CE054 0x8023DC54 0x5F68635F */ .word 0x5F68635F # bgtzl $k1, 0x802569D4
/* 0x001CE058 0x8023DC58 0x74657374 */ .word 0x74657374 # op_0x1D
/* 0x001CE05C 0x8023DC5C 0x20636F6D */ .word 0x20636F6D # addi $v1, $v1, 0x6F6D
/* 0x001CE060 0x8023DC60 0x65200A00 */ .word 0x65200A00 # daddiu $zero, $t1, 0xA00
