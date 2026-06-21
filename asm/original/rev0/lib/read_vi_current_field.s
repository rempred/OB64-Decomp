/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002C750..0x0002C770 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002C750 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
read_vi_current_field:
/* 0x0002C750 0x8009C350 0x3C02A410 */ .word 0x3C02A410 # lui $v0, 0xA410
/* 0x0002C754 0x8009C354 0x3442000C */ .word 0x3442000C # ori $v0, $v0, 0x000C
/* 0x0002C758 0x8009C358 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x0002C75C 0x8009C35C 0x30420100 */ .word 0x30420100 # andi $v0, $v0, 0x0100
/* 0x0002C760 0x8009C360 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002C764 0x8009C364 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x0002C768 0x8009C368 0x00000000 */ .word 0x00000000 # nop
/* 0x0002C76C 0x8009C36C 0x00000000 */ .word 0x00000000 # nop
