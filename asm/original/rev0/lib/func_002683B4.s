/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x002683B4..0x00268400 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed leaf (addiu $sp,-8). FP scale loop using float const 0x41F0 (mtc1 $at,$f2). Ends jr $ra @0x2683F8 + nop delay @0x2683FC. */
/* function boundary candidate: func_002683B4, size=76, kind=prologue */
func_002683B4:
/* 0x002683B4 0x802D7FB4 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x002683B8 0x802D7FB8 0x1880000E */ .word 0x1880000E # blez $a0, 0x802D7FF4
/* 0x002683BC 0x802D7FBC 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x002683C0 0x802D7FC0 0x3C0141F0 */ .word 0x3C0141F0 # lui $at, 0x41F0
/* 0x002683C4 0x802D7FC4 0x44811000 */ .word 0x44811000 # mtc1 $at, $f2
/* 0x002683C8 0x802D7FC8 0x8CC20000 */ .word 0x8CC20000 # lw $v0, 0x0($a2)
/* 0x002683CC 0x802D7FCC 0x50400005 */ .word 0x50400005 # beql $v0, $zero, 0x802D7FE4
/* 0x002683D0 0x802D7FD0 0x24A50044 */ .word 0x24A50044 # addiu $a1, $a1, 0x44
/* 0x002683D4 0x802D7FD4 0xC4A00038 */ .word 0xC4A00038 # lwc1 $f0, 0x38($a1)
/* 0x002683D8 0x802D7FD8 0x46020002 */ .word 0x46020002 # mul.s $f0, $f0, $f2
/* 0x002683DC 0x802D7FDC 0xE4400008 */ .word 0xE4400008 # swc1 $f0, 0x8($v0)
/* 0x002683E0 0x802D7FE0 0x24A50044 */ .word 0x24A50044 # addiu $a1, $a1, 0x44
/* 0x002683E4 0x802D7FE4 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x002683E8 0x802D7FE8 0x0064102A */ .word 0x0064102A # slt $v0, $v1, $a0
/* 0x002683EC 0x802D7FEC 0x1440FFF6 */ .word 0x1440FFF6 # bne $v0, $zero, 0x802D7FC8
/* 0x002683F0 0x802D7FF0 0x24C60004 */ .word 0x24C60004 # addiu $a2, $a2, 0x4
/* 0x002683F4 0x802D7FF4 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
/* 0x002683F8 0x802D7FF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002683FC 0x802D7FFC 0x00000000 */ .word 0x00000000 # nop
