/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001C1000_001D1000.s
 * z64 range: 0x001CE064..0x001CE070 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 12-byte zero-fill pad after the debug/test string; code resumes at recovered frameless helper 0x1CE070.. */
/* 0x001CE064 0x8023DC64 0x00000000 */ .word 0x00000000 # nop
/* 0x001CE068 0x8023DC68 0x00000000 */ .word 0x00000000 # nop
/* 0x001CE06C 0x8023DC6C 0x00000000 */ .word 0x00000000 # nop
