/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BF34..0x0020BF50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Un-merged frameless leaf: computes (a0-1)*0x12 style index (sll/addu/subu chain). Ends jr $ra @0x0020BF48 + delay 0x0020BF4C. */
/* 0x0020BF34 0x8027BB34 0x2484FFFF */ .word 0x2484FFFF # addiu $a0, $a0, -0x1
/* 0x0020BF38 0x8027BB38 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x0020BF3C 0x8027BB3C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0020BF40 0x8027BB40 0x00021080 */ .word 0x00021080 # sll $v0, $v0, 2
/* 0x0020BF44 0x8027BB44 0x00441023 */ .word 0x00441023 # subu $v0, $v0, $a0
/* 0x0020BF48 0x8027BB48 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BF4C 0x8027BB4C 0x00021040 */ .word 0x00021040 # sll $v0, $v0, 1
