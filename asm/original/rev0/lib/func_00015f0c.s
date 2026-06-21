/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00015F0C..0x00015F24 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00015F0C (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00015f0c:
/* 0x00015F0C 0x80085B0C 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00015F10 0x80085B10 0x8C631A74 */ .word 0x8C631A74 # lw $v1, 0x1A74($v1)
/* 0x00015F14 0x80085B14 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00015F18 0x80085B18 0x8C421A70 */ .word 0x8C421A70 # lw $v0, 0x1A70($v0)
/* 0x00015F1C 0x80085B1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00015F20 0x80085B20 0x00621023 */ .word 0x00621023 # subu $v0, $v1, $v0
