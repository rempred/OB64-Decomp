/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00029FC0..0x00029FE0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00029FC0, size=20, kind=leaf */
func_00029FC0:
/* 0x00029FC0 0x80099BC0 0x3C02A450 */ .word 0x3C02A450 # lui $v0, 0xA450
/* 0x00029FC4 0x80099BC4 0x3442000C */ .word 0x3442000C # ori $v0, $v0, 0x000C
/* 0x00029FC8 0x80099BC8 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x00029FCC 0x80099BCC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00029FD0 0x80099BD0 0x28420000 */ .word 0x28420000 # slti $v0, $v0, 0x0
/* 0x00029FD4 0x80099BD4 0x00000000 */ .word 0x00000000 # nop
/* 0x00029FD8 0x80099BD8 0x00000000 */ .word 0x00000000 # nop
/* 0x00029FDC 0x80099BDC 0x00000000 */ .word 0x00000000 # nop
