/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C180..0x0020C1B4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless predicate on $a0 (0x2D/0x2E/0x2F/0x30); jr$ra at C1AC/delay C1B0. */
/* 0x0020C180 0x8027BD80 0x2483FFD3 */ .word 0x2483FFD3 # addiu $v1, $a0, -0x2D
/* 0x0020C184 0x8027BD84 0x2C630002 */ .word 0x2C630002 # sltiu $v1, $v1, 0x2
/* 0x0020C188 0x8027BD88 0x3882002F */ .word 0x3882002F # xori $v0, $a0, 0x002F
/* 0x0020C18C 0x8027BD8C 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0020C190 0x8027BD90 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x0020C194 0x8027BD94 0x14600004 */ .word 0x14600004 # bne $v1, $zero, 0x8027BDA8
/* 0x0020C198 0x8027BD98 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x0020C19C 0x8027BD9C 0x24020030 */ .word 0x24020030 # addiu $v0, $zero, 0x30
/* 0x0020C1A0 0x8027BDA0 0x14820002 */ .word 0x14820002 # bne $a0, $v0, 0x8027BDAC
/* 0x0020C1A4 0x8027BDA4 0x00000000 */ .word 0x00000000 # nop
/* 0x0020C1A8 0x8027BDA8 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x0020C1AC 0x8027BDAC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C1B0 0x8027BDB0 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
