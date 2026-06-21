/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00012420..0x0001242C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00012420 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00012420:
/* 0x00012420 0x80082020 0x3C02800B */ .word 0x3C02800B # lui $v0, 0x800B
/* 0x00012424 0x80082024 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00012428 0x80082028 0x8C421838 */ .word 0x8C421838 # lw $v0, 0x1838($v0)
