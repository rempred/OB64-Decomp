/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00268478..0x002684AC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf (addiu $sp,-8). Stores $a2 (as $f0) into +0x40 of each 0x44-byte record. Ends jr $ra @0x2684A4 + nop delay @0x2684A8. */
/* function boundary candidate: func_00268478, size=52, kind=prologue */
func_00268478:
/* 0x00268478 0x802D8078 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x0026847C 0x802D807C 0x44860000 */ .word 0x44860000 # mtc1 $a2, $f0
/* 0x00268480 0x802D8080 0x00000000 */ .word 0x00000000 # nop
/* 0x00268484 0x802D8084 0x18800006 */ .word 0x18800006 # blez $a0, 0x802D80A0
/* 0x00268488 0x802D8088 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0026848C 0x802D808C 0xE4A00040 */ .word 0xE4A00040 # swc1 $f0, 0x40($a1)
/* 0x00268490 0x802D8090 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00268494 0x802D8094 0x0064102A */ .word 0x0064102A # slt $v0, $v1, $a0
/* 0x00268498 0x802D8098 0x1440FFFC */ .word 0x1440FFFC # bne $v0, $zero, 0x802D808C
/* 0x0026849C 0x802D809C 0x24A50044 */ .word 0x24A50044 # addiu $a1, $a1, 0x44
/* 0x002684A0 0x802D80A0 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x002684A4 0x802D80A4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002684A8 0x802D80A8 0x00000000 */ .word 0x00000000 # nop
