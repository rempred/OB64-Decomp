/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001A1000_001B1000.s
 * z64 range: 0x001A59D8..0x001A59F0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: two stores 'sb $zero,0x4A66($at)'/'sb $zero,0x4A67($at)'. jr $ra @0x1A59E4 + delay 'sb $zero,0x4A67($at)' @0x1A59E8. Trailing 'nop' @0x1A59EC is 1-word alignment padding before the next function's preamble (kept with this part). */
func_001A59D8:
/* 0x001A59D8 0x802155D8 0x3C018021 */ .word 0x3C018021 # lui $at, 0x8021
/* 0x001A59DC 0x802155DC 0xA0204A66 */ .word 0xA0204A66 # sb $zero, 0x4A66($at)
/* 0x001A59E0 0x802155E0 0x3C018021 */ .word 0x3C018021 # lui $at, 0x8021
/* 0x001A59E4 0x802155E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001A59E8 0x802155E8 0xA0204A67 */ .word 0xA0204A67 # sb $zero, 0x4A67($at)
/* 0x001A59EC 0x802155EC 0x00000000 */ .word 0x00000000 # nop
