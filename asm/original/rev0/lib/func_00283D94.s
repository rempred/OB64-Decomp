/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00283D94..0x00283DF0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless signed-division math leaf (SPECIAL gap): subu/mult/mflo/div with break-on-zero/overflow guards; ends jr$ra@0x00283DDC + addu $v0,$v0,$a1 delay. Trailing alignment nops @0x00283DE4-0x00283DEC attach to this returning function's end. */
/* 0x00283D94 0x802F3994 0x00851023 */ .word 0x00851023 # subu $v0, $a0, $a1
/* 0x00283D98 0x802F3998 0x00460018 */ .word 0x00460018 # mult $v0, $a2
/* 0x00283D9C 0x802F399C 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x00283DA0 0x802F39A0 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DA4 0x802F39A4 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DA8 0x802F39A8 0x0047001A */ .word 0x0047001A # div $v0, $a3
/* 0x00283DAC 0x802F39AC 0x14E00002 */ .word 0x14E00002 # bne $a3, $zero, 0x802F39B8
/* 0x00283DB0 0x802F39B0 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DB4 0x802F39B4 0x0007000D */ .word 0x0007000D # break 0x01C00
/* 0x00283DB8 0x802F39B8 0x2401FFFF */ .word 0x2401FFFF # addiu $at, $zero, -0x1
/* 0x00283DBC 0x802F39BC 0x14E10004 */ .word 0x14E10004 # bne $a3, $at, 0x802F39D0
/* 0x00283DC0 0x802F39C0 0x3C018000 */ .word 0x3C018000 # lui $at, 0x8000
/* 0x00283DC4 0x802F39C4 0x14410002 */ .word 0x14410002 # bne $v0, $at, 0x802F39D0
/* 0x00283DC8 0x802F39C8 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DCC 0x802F39CC 0x0006000D */ .word 0x0006000D # break 0x01800
/* 0x00283DD0 0x802F39D0 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x00283DD4 0x802F39D4 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DD8 0x802F39D8 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DDC 0x802F39DC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00283DE0 0x802F39E0 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00283DE4 0x802F39E4 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DE8 0x802F39E8 0x00000000 */ .word 0x00000000 # nop
/* 0x00283DEC 0x802F39EC 0x00000000 */ .word 0x00000000 # nop
