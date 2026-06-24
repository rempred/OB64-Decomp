/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002ADAB4..0x002ADAF4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-folded: lui $v0,0x8023 / lw $v0,-0x568C / beq $v0,$zero,0x002ADAEC at 0x002ADAB4 read before write and branch into body. addiu$sp,-0x8 at 0x002ADAC0. Ends jr $ra 0x002ADAEC + delay. */
func_002ADAB4:
/* 0x002ADAB4 0x8031D6B4 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x002ADAB8 0x8031D6B8 0x8C42A974 */ .word 0x8C42A974 # lw $v0, -0x568C($v0)
/* 0x002ADABC 0x8031D6BC 0x1040000B */ .word 0x1040000B # beq $v0, $zero, 0x8031D6EC

/* function boundary candidate: func_002ADAC0, size=52, kind=prologue */
func_002ADAC0:
/* 0x002ADAC0 0x8031D6C0 0x27BDFFF8 */ .word 0x27BDFFF8 # addiu $sp, $sp, -0x8
/* 0x002ADAC4 0x8031D6C4 0x8C441CAC */ .word 0x8C441CAC # lw $a0, 0x1CAC($v0)
/* 0x002ADAC8 0x8031D6C8 0x10800008 */ .word 0x10800008 # beq $a0, $zero, 0x8031D6EC
/* 0x002ADACC 0x8031D6CC 0x00000000 */ .word 0x00000000 # nop
/* 0x002ADAD0 0x8031D6D0 0x84820002 */ .word 0x84820002 # lh $v0, 0x2($a0)
/* 0x002ADAD4 0x8031D6D4 0x84830000 */ .word 0x84830000 # lh $v1, 0x0($a0)
/* 0x002ADAD8 0x8031D6D8 0x00402821 */ .word 0x00402821 # move $a1, $v0
/* 0x002ADADC 0x8031D6DC 0x0043102A */ .word 0x0043102A # slt $v0, $v0, $v1
/* 0x002ADAE0 0x8031D6E0 0x10400002 */ .word 0x10400002 # beq $v0, $zero, 0x8031D6EC
/* 0x002ADAE4 0x8031D6E4 0x24A20001 */ .word 0x24A20001 # addiu $v0, $a1, 0x1
/* 0x002ADAE8 0x8031D6E8 0xA4820002 */ .word 0xA4820002 # sh $v0, 0x2($a0)
/* 0x002ADAEC 0x8031D6EC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002ADAF0 0x8031D6F0 0x27BD0008 */ .word 0x27BD0008 # addiu $sp, $sp, 0x8
