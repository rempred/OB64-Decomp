/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DE000..0x000DE020 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): 8-word preamble: 0x0000965D, 0xD6D5F7FB, 0x00000000, 0x0000FFFF, 0x00000000 x3, 0x0000000E. Small scalar/header values preceding the packed blob at 0xDE020. Non-executable (coincidental mnemonics). HYPOTHESIS: header/count fields; field names unknown.. */
/* 0x000DE000 0x8014DC00 0x0000965D */ .word 0x0000965D # dmultu $zero, $zero
/* 0x000DE004 0x8014DC04 0xD6D5F7FB */ .word 0xD6D5F7FB # ldc1 $f21, -0x805($s6)
/* 0x000DE008 0x8014DC08 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE00C 0x8014DC0C 0x0000FFFF */ .word 0x0000FFFF # dsra32 $ra, $zero, 31
/* 0x000DE010 0x8014DC10 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE014 0x8014DC14 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE018 0x8014DC18 0x00000000 */ .word 0x00000000 # nop
/* 0x000DE01C 0x8014DC1C 0x0000000E */ .word 0x0000000E # special_0x0E
