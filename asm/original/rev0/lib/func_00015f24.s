/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00015F24..0x00015F30 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00015F24 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00015f24:
/* 0x00015F24 0x80085B24 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00015F28 0x80085B28 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00015F2C 0x80085B2C 0x24421A70 */ .word 0x24421A70 # addiu $v0, $v0, 0x1A70
