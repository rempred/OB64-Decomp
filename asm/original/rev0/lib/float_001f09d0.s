/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001F09D0..0x001F09DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): IEEE-754 double constants: pi 0x400921FB_54442D18 @0x001F09D0, then -90.0 0xC0568000_00000000 @0x001F09D8 (byte-identical to the double -90.0 at float_001F0018).. */
/* 0x001F09D0 0x802605D0 0x400921FB */ .word 0x400921FB # mfc0 $t1, $4
/* 0x001F09D4 0x802605D4 0x54442D18 */ .word 0x54442D18 # bnel $v0, $a0, 0x8026BA38
/* 0x001F09D8 0x802605D8 0xC0568000 */ .word 0xC0568000 # ll $s6, -0x8000($v0)
