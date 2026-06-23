/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00261D7C..0x00261DA8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf: reads 0x80220D50/D58, indexes via $a0 (-0x4, subu, sra 7), writes 0x80220D50. Returns jr$ra@0x00261DA0 + delay sh@0x00261DA4. Slice end. */
/* 0x00261D7C 0x802D197C 0x3C028022 */ .word 0x3C028022 # lui $v0, 0x8022
/* 0x00261D80 0x802D1980 0x94420D50 */ .word 0x94420D50 # lhu $v0, 0xD50($v0)
/* 0x00261D84 0x802D1984 0x3C038022 */ .word 0x3C038022 # lui $v1, 0x8022
/* 0x00261D88 0x802D1988 0x8C630D58 */ .word 0x8C630D58 # lw $v1, 0xD58($v1)
/* 0x00261D8C 0x802D198C 0xA482FFFC */ .word 0xA482FFFC # sh $v0, -0x4($a0)
/* 0x00261D90 0x802D1990 0x2484FFFC */ .word 0x2484FFFC # addiu $a0, $a0, -0x4
/* 0x00261D94 0x802D1994 0x00832023 */ .word 0x00832023 # subu $a0, $a0, $v1
/* 0x00261D98 0x802D1998 0x000421C3 */ .word 0x000421C3 # sra $a0, $a0, 7
/* 0x00261D9C 0x802D199C 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00261DA0 0x802D19A0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00261DA4 0x802D19A4 0xA4240D50 */ .word 0xA4240D50 # sh $a0, 0xD50($at)
