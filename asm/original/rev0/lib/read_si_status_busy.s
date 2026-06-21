/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002C770..0x0002C790 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002C770 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
read_si_status_busy:
/* function boundary candidate: func_0002C770, size=24, kind=leaf */
func_0002C770:
/* 0x0002C770 0x8009C370 0x3C02A480 */ .word 0x3C02A480 # lui $v0, 0xA480
/* 0x0002C774 0x8009C374 0x34420018 */ .word 0x34420018 # ori $v0, $v0, 0x0018
/* 0x0002C778 0x8009C378 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x0002C77C 0x8009C37C 0x30420003 */ .word 0x30420003 # andi $v0, $v0, 0x0003
/* 0x0002C780 0x8009C380 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002C784 0x8009C384 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x0002C788 0x8009C388 0x00000000 */ .word 0x00000000 # nop
/* 0x0002C78C 0x8009C38C 0x00000000 */ .word 0x00000000 # nop
