/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A926C..0x001A9280 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Data region (not executable host code): Small data island: 0x00000000 separator word at 0x1A926C, then four identical packed words 0x817C817C (0x1A9270..0x1A927C) — repeated 0x817C halfword pattern, not a 0x800/0x801/0x802 RAM pointer.. */
/* 0x001A926C 0x80218E6C 0x00000000 */ .word 0x00000000 # nop
/* 0x001A9270 0x80218E70 0x817C817C */ .word 0x817C817C # lb $gp, -0x7E84($t3)
/* 0x001A9274 0x80218E74 0x817C817C */ .word 0x817C817C # lb $gp, -0x7E84($t3)
/* 0x001A9278 0x80218E78 0x817C817C */ .word 0x817C817C # lb $gp, -0x7E84($t3)
/* 0x001A927C 0x80218E7C 0x817C817C */ .word 0x817C817C # lb $gp, -0x7E84($t3)
