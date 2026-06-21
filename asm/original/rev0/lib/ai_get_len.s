/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001C810..0x0001C820 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001C810 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
ai_get_len:
/* function boundary candidate: func_0001C810, size=16, kind=leaf */
func_0001C810:
/* 0x0001C810 0x8008C410 0x3C02A450 */ .word 0x3C02A450 # lui $v0, 0xA450
/* 0x0001C814 0x8008C414 0x34420004 */ .word 0x34420004 # ori $v0, $v0, 0x0004
/* 0x0001C818 0x8008C418 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001C81C 0x8008C41C 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
