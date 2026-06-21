/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x0001C820..0x0001C830 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0001C820 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
ai_get_status:
/* function boundary candidate: func_0001C820, size=16, kind=leaf */
func_0001C820:
/* 0x0001C820 0x8008C420 0x3C02A450 */ .word 0x3C02A450 # lui $v0, 0xA450
/* 0x0001C824 0x8008C424 0x3442000C */ .word 0x3442000C # ori $v0, $v0, 0x000C
/* 0x0001C828 0x8008C428 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001C82C 0x8008C42C 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
