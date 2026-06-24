/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002B1000_002C1000.s
 * z64 range: 0x002B2174..0x002B21B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Parent func_002B217C with its leading mult $a1,$a2 / mflo $a1 read-before-write preamble (0x002B2174) folded FORWARD: body addiu $sp,-0x8 @0x002B217C reads $a1 via blez $a1 before writing it. Loop OR-ing 0x0001 into halfwords. Ends jr $ra @0x002B21AC + delay nop @0x002B21B0. */
func_002B2174:
/* 0x002B2174 0x80321D74 0x00A60018 */ .word 0x00A60018 # mult $a1, $a2
/* 0x002B2178 0x80321D78 0x00002812 */ .word 0x00002812 # mflo $a1

/* function boundary candidate: func_002B217C, size=56, kind=prologue */
func_002B217C:
/* 0x002B217C 0x80321D7C 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x002B2180 0x80321D80 0x00000000 */ .word 0x00000000 # nop
/* 0x002B2184 0x80321D84 0x18A00008 */ .word 0x18A00008 # blez $a1, 0x80321DA8
/* 0x002B2188 0x80321D88 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x002B218C 0x80321D8C 0x84820000 */ .word 0x84820000 # lh $v0, 0x0($a0)
/* 0x002B2190 0x80321D90 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x002B2194 0x80321D94 0x34420001 */ .word 0x34420001 # ori $v0, $v0, 0x0001
/* 0x002B2198 0x80321D98 0xA4820000 */ .word 0xA4820000 # sh $v0, 0x0($a0)
/* 0x002B219C 0x80321D9C 0x0065102A */ .word 0x0065102A # slt $v0, $v1, $a1
/* 0x002B21A0 0x80321DA0 0x1440FFFA */ .word 0x1440FFFA # bne $v0, $zero, 0x80321D8C
/* 0x002B21A4 0x80321DA4 0x24840002 */ .word 0x24840002 # addiu $a0, $a0, 0x2
/* 0x002B21A8 0x80321DA8 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x002B21AC 0x80321DAC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002B21B0 0x80321DB0 0x00000000 */ .word 0x00000000 # nop
