/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001F1000_00201000.s
 * z64 range: 0x001F10F0..0x001F114C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Separate frameless FP leaf split out of the over-merged parent: non-prologue fall-through entry after jr$ra@0x1F10E8. Reads incoming $a0/$a1, lwc1/add.s/trunc.w.s/sh, returns jr$ra@0x1F1144 + delay sh@0x1F1148. */
func_001F10F0:
/* 0x001F10F0 0x80260CF0 0xC4A00010 */ .word 0xC4A00010 # lwc1 $f0, 0x10($a1)
/* 0x001F10F4 0x80260CF4 0xC4A20018 */ .word 0xC4A20018 # lwc1 $f2, 0x18($a1)
/* 0x001F10F8 0x80260CF8 0xC4A40014 */ .word 0xC4A40014 # lwc1 $f4, 0x14($a1)
/* 0x001F10FC 0x80260CFC 0x46020000 */ .word 0x46020000 # add.s $f0, $f0, $f2
/* 0x001F1100 0x80260D00 0xC4A6001C */ .word 0xC4A6001C # lwc1 $f6, 0x1C($a1)
/* 0x001F1104 0x80260D04 0xC4A20008 */ .word 0xC4A20008 # lwc1 $f2, 0x8($a1)
/* 0x001F1108 0x80260D08 0x46062100 */ .word 0x46062100 # add.s $f4, $f4, $f6
/* 0x001F110C 0x80260D0C 0xE4A00010 */ .word 0xE4A00010 # swc1 $f0, 0x10($a1)
/* 0x001F1110 0x80260D10 0xC4A00010 */ .word 0xC4A00010 # lwc1 $f0, 0x10($a1)
/* 0x001F1114 0x80260D14 0x46001080 */ .word 0x46001080 # add.s $f2, $f2, $f0
/* 0x001F1118 0x80260D18 0xE4A40014 */ .word 0xE4A40014 # swc1 $f4, 0x14($a1)
/* 0x001F111C 0x80260D1C 0x4600100D */ .word 0x4600100D # trunc.w.s $f0, $f2
/* 0x001F1120 0x80260D20 0x44020000 */ .word 0x44020000 # mfc1 $v0, $f0
/* 0x001F1124 0x80260D24 0x00000000 */ .word 0x00000000 # nop
/* 0x001F1128 0x80260D28 0xA482001C */ .word 0xA482001C # sh $v0, 0x1C($a0)
/* 0x001F112C 0x80260D2C 0xC4A0000C */ .word 0xC4A0000C # lwc1 $f0, 0xC($a1)
/* 0x001F1130 0x80260D30 0xC4A20014 */ .word 0xC4A20014 # lwc1 $f2, 0x14($a1)
/* 0x001F1134 0x80260D34 0x46020000 */ .word 0x46020000 # add.s $f0, $f0, $f2
/* 0x001F1138 0x80260D38 0x4600008D */ .word 0x4600008D # trunc.w.s $f2, $f0
/* 0x001F113C 0x80260D3C 0x44021000 */ .word 0x44021000 # mfc1 $v0, $f2
/* 0x001F1140 0x80260D40 0x00000000 */ .word 0x00000000 # nop
/* 0x001F1144 0x80260D44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001F1148 0x80260D48 0xA4820020 */ .word 0xA4820020 # sh $v0, 0x20($a0)
