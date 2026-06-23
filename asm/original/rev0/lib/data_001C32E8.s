/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001C32E8..0x001C3300 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 24-byte tail pad/small-record trailer before code resumes at 0x1C3300.. */
/* 0x001C32E8 0x80232EE8 0x7B63307D */ .word 0x7B63307D # op_0x1E
/* 0x001C32EC 0x80232EEC 0x00000000 */ .word 0x00000000 # nop
/* 0x001C32F0 0x80232EF0 0x00000101 */ .word 0x00000101 # special_0x01
/* 0x001C32F4 0x80232EF4 0x00000000 */ .word 0x00000000 # nop
/* 0x001C32F8 0x80232EF8 0x00000000 */ .word 0x00000000 # nop
/* 0x001C32FC 0x80232EFC 0x00000000 */ .word 0x00000000 # nop
