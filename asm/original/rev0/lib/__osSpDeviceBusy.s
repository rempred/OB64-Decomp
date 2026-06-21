/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AB40..0x0002AB60 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AB40 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osSpDeviceBusy:
/* function boundary candidate: func_0002AB40, size=24, kind=leaf */
func_0002AB40:
/* 0x0002AB40 0x8009A740 0x3C02A404 */ .word 0x3C02A404 # lui $v0, 0xA404
/* 0x0002AB44 0x8009A744 0x34420010 */ .word 0x34420010 # ori $v0, $v0, 0x0010
/* 0x0002AB48 0x8009A748 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x0002AB4C 0x8009A74C 0x3042001C */ .word 0x3042001C # andi $v0, $v0, 0x001C
/* 0x0002AB50 0x8009A750 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AB54 0x8009A754 0x0002102B */ .word 0x0002102B # sltu $v0, $zero, $v0
/* 0x0002AB58 0x8009A758 0x00000000 */ .word 0x00000000 # nop
/* 0x0002AB5C 0x8009A75C 0x00000000 */ .word 0x00000000 # nop
