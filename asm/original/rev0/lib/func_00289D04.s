/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00289D04..0x00289D24 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf un-merged from parent func_00289780. No prologue: lui/lw $v0,-0x21E0 then writes 0x52/0x48/0x3E half-word fields. Ends jr $ra 0x00289D1C + delay 0x00289D20 (sh $v1,0x3E). */
/* 0x00289D04 0x802F9904 0x3C028024 */ .word 0x3C028024 # lui $v0, 0x8024
/* 0x00289D08 0x802F9908 0x8C42DE20 */ .word 0x8C42DE20 # lw $v0, -0x21E0($v0)
/* 0x00289D0C 0x802F990C 0x24030055 */ .word 0x24030055 # addiu $v1, $zero, 0x55
/* 0x00289D10 0x802F9910 0xA4430052 */ .word 0xA4430052 # sh $v1, 0x52($v0)
/* 0x00289D14 0x802F9914 0x24030003 */ .word 0x24030003 # addiu $v1, $zero, 0x3
/* 0x00289D18 0x802F9918 0xA4400048 */ .word 0xA4400048 # sh $zero, 0x48($v0)
/* 0x00289D1C 0x802F991C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00289D20 0x802F9920 0xA443003E */ .word 0xA443003E # sh $v1, 0x3E($v0)
