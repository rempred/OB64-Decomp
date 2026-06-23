/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00231000_00241000.s
 * z64 range: 0x0023B5FC..0x0023B650 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Recovered frameless leaf un-merged from the 0x0023B594 block. Frameless ($a0 param) table-link helper: reads 801F0534/801F0560, computes a reciprocal-style index via shifts (sll 2/4/8/16; subu; sra), jr$ra@0x0023B648 + delay sh$v0,0x534($at)@0x0023B64C. */
/* 0x0023B5FC 0x802AB1FC 0x3C02801F */ .word 0x3C02801F # lui $v0, 0x801F
/* 0x0023B600 0x802AB200 0x94420534 */ .word 0x94420534 # lhu $v0, 0x534($v0)
/* 0x0023B604 0x802AB204 0x3C03801F */ .word 0x3C03801F # lui $v1, 0x801F
/* 0x0023B608 0x802AB208 0x8C630560 */ .word 0x8C630560 # lw $v1, 0x560($v1)
/* 0x0023B60C 0x802AB20C 0xAC800004 */ .word 0xAC800004 # sw $zero, 0x4($a0)
/* 0x0023B610 0x802AB210 0xA480000E */ .word 0xA480000E # sh $zero, 0xE($a0)
/* 0x0023B614 0x802AB214 0xA4820000 */ .word 0xA4820000 # sh $v0, 0x0($a0)
/* 0x0023B618 0x802AB218 0x00832023 */ .word 0x00832023 # subu $a0, $a0, $v1
/* 0x0023B61C 0x802AB21C 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x0023B620 0x802AB220 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0023B624 0x802AB224 0x00021900 */ .word 0x00021900 # sll $v1, $v0, 4
/* 0x0023B628 0x802AB228 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0023B62C 0x802AB22C 0x00021A00 */ .word 0x00021A00 # sll $v1, $v0, 8
/* 0x0023B630 0x802AB230 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0023B634 0x802AB234 0x00021C00 */ .word 0x00021C00 # sll $v1, $v0, 16
/* 0x0023B638 0x802AB238 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x0023B63C 0x802AB23C 0x00021023 */ .word 0x00021023 # subu $v0, $zero, $v0
/* 0x0023B640 0x802AB240 0x00021103 */ .word 0x00021103 # sra $v0, $v0, 4
/* 0x0023B644 0x802AB244 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x0023B648 0x802AB248 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0023B64C 0x802AB24C 0xA4220534 */ .word 0xA4220534 # sh $v0, 0x534($at)
