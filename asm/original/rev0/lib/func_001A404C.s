/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A404C..0x001A4058 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf byte getter (3 words): lui $v0,0x8021 / jr $ra / delay lbu $v0,0x6BE4($v0). Returns the byte at 0x80216BE4. Self-contained jr $ra @0x1A4050 + delay @0x1A4054. */
func_001A404C:
/* 0x001A404C 0x80213C4C 0x3C028021 */ .word 0x3C028021 # lui $v0, 0x8021
/* 0x001A4050 0x80213C50 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001A4054 0x80213C54 0x90426BE4 */ .word 0x90426BE4 # lbu $v0, 0x6BE4($v0)
