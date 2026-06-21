/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00014790..0x000147A0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x00014790 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_00014790:
/* 0x00014790 0x80084390 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x00014794 0x80084394 0xA08200BA */ .word 0xA08200BA # sb $v0, 0xBA($a0)
/* 0x00014798 0x80084398 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001479C 0x8008439C 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
