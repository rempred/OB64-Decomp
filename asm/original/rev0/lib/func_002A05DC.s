/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00291000_002A1000.s
 * z64 range: 0x002A05DC..0x002A05EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf getter un-merged from func_002A0548 tail: lui$v0@0x002A05DC / addu@0x002A05E0 / jr$ra@0x002A05E4 / lbu$v0,-0x11C0($v0)@0x002A05E8 (delay). */
/* 0x002A05DC 0x803101DC 0x3C02801A */ .word 0x3C02801A # lui $v0, 0x801A
/* 0x002A05E0 0x803101E0 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x002A05E4 0x803101E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002A05E8 0x803101E8 0x9042EE40 */ .word 0x9042EE40 # lbu $v0, -0x11C0($v0)
