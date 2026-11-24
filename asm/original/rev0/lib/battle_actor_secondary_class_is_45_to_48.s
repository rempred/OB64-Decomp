/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C1B4..0x0020C1F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless predicate loading obj+0x4C then same test; jr$ra at C1F0/delay C1F4. */
/* 0x0020C1B4 0x8027BDB4 0x1080000E */ .word 0x1080000E # beq $a0, $zero, 0x8027BDF0
/* 0x0020C1B8 0x8027BDB8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C1BC 0x8027BDBC 0x8C84004C */ .word 0x8C84004C # lw $a0, 0x4C($a0)
/* 0x0020C1C0 0x8027BDC0 0x2483FFD3 */ .word 0x2483FFD3 # addiu $v1, $a0, -0x2D
/* 0x0020C1C4 0x8027BDC4 0x2C630002 */ .word 0x2C630002 # sltiu $v1, $v1, 0x2
/* 0x0020C1C8 0x8027BDC8 0x3882002F */ .word 0x3882002F # xori $v0, $a0, 0x002F
/* 0x0020C1CC 0x8027BDCC 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0020C1D0 0x8027BDD0 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x0020C1D4 0x8027BDD4 0x14600004 */ .word 0x14600004 # bne $v1, $zero, 0x8027BDE8
/* 0x0020C1D8 0x8027BDD8 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0020C1DC 0x8027BDDC 0x24020030 */ .word 0x24020030 # addiu $v0, $zero, 0x30
/* 0x0020C1E0 0x8027BDE0 0x14820003 */ .word 0x14820003 # bne $a0, $v0, 0x8027BDF0
/* 0x0020C1E4 0x8027BDE4 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x0020C1E8 0x8027BDE8 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x0020C1EC 0x8027BDEC 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
/* 0x0020C1F0 0x8027BDF0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C1F4 0x8027BDF4 0x00000000 */ .word 0x00000000 # nop
