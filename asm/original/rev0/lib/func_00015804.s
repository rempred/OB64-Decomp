/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00015804..0x00015810 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00015804 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00015804:
/* 0x00015804 0x80085404 0x3C028008 */ .word 0x3C028008 # lui $v0, 0x8008
/* 0x00015808 0x80085408 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001580C 0x8008540C 0x24425410 */ .word 0x24425410 # addiu $v0, $v0, 0x5410
