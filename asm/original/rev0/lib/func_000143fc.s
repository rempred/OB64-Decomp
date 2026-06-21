/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000143FC..0x00014408 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x000143FC (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
func_000143fc:
/* 0x000143FC 0x80083FFC 0xA08000B8 */ .word 0xA08000B8 # sb $zero, 0xB8($a0)
/* 0x00014400 0x80084000 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00014404 0x80084004 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
