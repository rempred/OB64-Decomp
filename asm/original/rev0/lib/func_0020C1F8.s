/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C1F8..0x0020C214 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless range predicate (obj+0x4C-2 <0x22); jr$ra at C20C/delay C210. */
/* 0x0020C1F8 0x8027BDF8 0x50800004 */ .word 0x50800004 # beql $a0, $zero, 0x8027BE0C
/* 0x0020C1FC 0x8027BDFC 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C200 0x8027BE00 0x8C82004C */ .word 0x8C82004C # lw $v0, 0x4C($a0)
/* 0x0020C204 0x8027BE04 0x2442FFFE */ .word 0x2442FFFE # addiu $v0, $v0, -0x2
/* 0x0020C208 0x8027BE08 0x2C420022 */ .word 0x2C420022 # sltiu $v0, $v0, 0x22
/* 0x0020C20C 0x8027BE0C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C210 0x8027BE10 0x00000000 */ .word 0x00000000 # nop
