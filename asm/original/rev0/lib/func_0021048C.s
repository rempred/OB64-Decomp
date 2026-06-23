/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0021048C..0x002104AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf (blez-guarded sum loop). jr$ra@0x002104A4 + delay nop@0x002104A8. */
/* 0x0021048C 0x8028008C 0x18800005 */ .word 0x18800005 # blez $a0, 0x802800A4
/* 0x00210490 0x80280090 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00210494 0x80280094 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00210498 0x80280098 0x2484FFFF */ .word 0x2484FFFF # addiu $a0, $a0, -0x1
/* 0x0021049C 0x8028009C 0x5C80FFFE */ .word 0x5C80FFFE # bgtzl $a0, 0x80280098
/* 0x002104A0 0x802800A0 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x002104A4 0x802800A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002104A8 0x802800A8 0x00000000 */ .word 0x00000000 # nop
