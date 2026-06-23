/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000D1000_000E1000.s
 * z64 range: 0x000DBCD0..0x000DBD30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Dense RAM-pointer table: 24 consecutive big-endian 0x8016xxxx words (0x8016F65C..0x8016F8CC range; spans 0xDBCD0-0xDBD30 = 96 bytes). Tight ~0x50-stride RAM band with some repeats (0x8016F65C/F6AC/F6FC/F74C recur at DBCD0 and DBCF8). This is the pointer table referenced in the prompt (~92 bytes / 23 entries). Overlay RAM target; back-map via overlay map.. */
/* 0x000DBCD0 0x8014B8D0 0x8016F65C */ .word 0x8016F65C # lb $s6, -0x9A4($zero)
/* 0x000DBCD4 0x8014B8D4 0x8016F6AC */ .word 0x8016F6AC # lb $s6, -0x954($zero)
/* 0x000DBCD8 0x8014B8D8 0x8016F6FC */ .word 0x8016F6FC # lb $s6, -0x904($zero)
/* 0x000DBCDC 0x8014B8DC 0x8016F74C */ .word 0x8016F74C # lb $s6, -0x8B4($zero)
/* 0x000DBCE0 0x8014B8E0 0x8016F79C */ .word 0x8016F79C # lb $s6, -0x864($zero)
/* 0x000DBCE4 0x8014B8E4 0x8016F7EC */ .word 0x8016F7EC # lb $s6, -0x814($zero)
/* 0x000DBCE8 0x8014B8E8 0x8016DF88 */ .word 0x8016DF88 # lb $s6, -0x2078($zero)
/* 0x000DBCEC 0x8014B8EC 0x8016DFDC */ .word 0x8016DFDC # lb $s6, -0x2024($zero)
/* 0x000DBCF0 0x8014B8F0 0x8016E030 */ .word 0x8016E030 # lb $s6, -0x1FD0($zero)
/* 0x000DBCF4 0x8014B8F4 0x8016E084 */ .word 0x8016E084 # lb $s6, -0x1F7C($zero)
/* 0x000DBCF8 0x8014B8F8 0x8016F65C */ .word 0x8016F65C # lb $s6, -0x9A4($zero)
/* 0x000DBCFC 0x8014B8FC 0x8016F6AC */ .word 0x8016F6AC # lb $s6, -0x954($zero)
/* 0x000DBD00 0x8014B900 0x8016F6FC */ .word 0x8016F6FC # lb $s6, -0x904($zero)
/* 0x000DBD04 0x8014B904 0x8016F74C */ .word 0x8016F74C # lb $s6, -0x8B4($zero)
/* 0x000DBD08 0x8014B908 0x8016F79C */ .word 0x8016F79C # lb $s6, -0x864($zero)
/* 0x000DBD0C 0x8014B90C 0x8016F7EC */ .word 0x8016F7EC # lb $s6, -0x814($zero)
/* 0x000DBD10 0x8014B910 0x8016F83C */ .word 0x8016F83C # lb $s6, -0x7C4($zero)
/* 0x000DBD14 0x8014B914 0x8016F854 */ .word 0x8016F854 # lb $s6, -0x7AC($zero)
/* 0x000DBD18 0x8014B918 0x8016F86C */ .word 0x8016F86C # lb $s6, -0x794($zero)
/* 0x000DBD1C 0x8014B91C 0x8016F884 */ .word 0x8016F884 # lb $s6, -0x77C($zero)
/* 0x000DBD20 0x8014B920 0x8016F89C */ .word 0x8016F89C # lb $s6, -0x764($zero)
/* 0x000DBD24 0x8014B924 0x8016F8B4 */ .word 0x8016F8B4 # lb $s6, -0x74C($zero)
/* 0x000DBD28 0x8014B928 0x8016F8CC */ .word 0x8016F8CC # lb $s6, -0x734($zero)
/* 0x000DBD2C 0x8014B92C 0x00000000 */ .word 0x00000000 # nop
