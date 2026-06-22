/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x0006136C..0x000613B0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Glyph/index byte table followed by a small RAM-pointer list and zero pad. 0x6136C..0x6138C = ascending byte triplets (FF 37 3F 47 / 4F 57 5B 00 / FF 39 41 49 / 51 59 5D 00 / FF 3B 43 4B ... / 92 93 94 95 96 97 98 00) resembling font/glyph-width or kerning index bytes. 0x61394..0x613A0 = four RAM pointers 0x8016DF88,0x8016DFDC,0x8016E030,0x8016E084 (stride 0x54). 0x613A4..0x613B0 = 12-byte zero pad before the string pool.. */
/* 0x0006136C 0x800D0F6C 0xFF373F47 */ .word 0xFF373F47 # sd $s7, 0x3F47($t9)
/* 0x00061370 0x800D0F70 0x4F575B00 */ .word 0x4F575B00 # op_0x13
/* 0x00061374 0x800D0F74 0xFF394149 */ .word 0xFF394149 # sd $t9, 0x4149($t9)
/* 0x00061378 0x800D0F78 0x51595D00 */ .word 0x51595D00 # beql $t2, $t9, 0x800E837C
/* 0x0006137C 0x800D0F7C 0xFF3B434B */ .word 0xFF3B434B # sd $k1, 0x434B($t9)
/* 0x00061380 0x800D0F80 0x53575F00 */ .word 0x53575F00 # beql $k0, $s7, 0x800E8B84
/* 0x00061384 0x800D0F84 0xFF3C444C */ .word 0xFF3C444C # sd $gp, 0x444C($t9)
/* 0x00061388 0x800D0F88 0x549A6000 */ .word 0x549A6000 # bnel $a0, $k0, 0x800E8F8C
/* 0x0006138C 0x800D0F8C 0x92939495 */ .word 0x92939495 # lbu $s3, -0x6B6B($s4)
/* 0x00061390 0x800D0F90 0x96979800 */ .word 0x96979800 # lhu $s7, -0x6800($s4)
/* 0x00061394 0x800D0F94 0x8016DF88 */ .word 0x8016DF88 # lb $s6, -0x2078($zero)
/* 0x00061398 0x800D0F98 0x8016DFDC */ .word 0x8016DFDC # lb $s6, -0x2024($zero)
/* 0x0006139C 0x800D0F9C 0x8016E030 */ .word 0x8016E030 # lb $s6, -0x1FD0($zero)
/* 0x000613A0 0x800D0FA0 0x8016E084 */ .word 0x8016E084 # lb $s6, -0x1F7C($zero)
/* 0x000613A4 0x800D0FA4 0x00000000 */ .word 0x00000000 # nop
/* 0x000613A8 0x800D0FA8 0x00000000 */ .word 0x00000000 # nop
/* 0x000613AC 0x800D0FAC 0x00000000 */ .word 0x00000000 # nop
