/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x0002AB60..0x0002AB70 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry 0x0002AB60 (read-before-write preamble; the parent-DB boundary label appears below inside the body). */
__osSpSetStatus:
/* function boundary candidate: func_0002AB60, size=16, kind=leaf */
func_0002AB60:
/* 0x0002AB60 0x8009A760 0x3C02A404 */ .word 0x3C02A404 # lui $v0, 0xA404
/* 0x0002AB64 0x8009A764 0x34420010 */ .word 0x34420010 # ori $v0, $v0, 0x0010
/* 0x0002AB68 0x8009A768 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0002AB6C 0x8009A76C 0xAC440000 */ .word 0xAC440000 # sw $a0, 0x0($v0)
