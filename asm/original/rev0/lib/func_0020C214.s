/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C214..0x0020C24C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless range predicate over obj+0x4C (0x38..,0xA4); jr$ra at C244/delay C248. */
/* 0x0020C214 0x8027BE14 0x1080000B */ .word 0x1080000B # beq $a0, $zero, 0x8027BE44
/* 0x0020C218 0x8027BE18 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C21C 0x8027BE1C 0x8C84004C */ .word 0x8C84004C # lw $a0, 0x4C($a0)
/* 0x0020C220 0x8027BE20 0x2482FFC8 */ .word 0x2482FFC8 # addiu $v0, $a0, -0x38
/* 0x0020C224 0x8027BE24 0x2C42000D */ .word 0x2C42000D # sltiu $v0, $v0, 0xD
/* 0x0020C228 0x8027BE28 0x14400004 */ .word 0x14400004 # bne $v0, $zero, 0x8027BE3C
/* 0x0020C22C 0x8027BE2C 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0020C230 0x8027BE30 0x240200A4 */ .word 0x240200A4 # addiu $v0, $zero, 0xA4
/* 0x0020C234 0x8027BE34 0x14820003 */ .word 0x14820003 # bne $a0, $v0, 0x8027BE44
/* 0x0020C238 0x8027BE38 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x0020C23C 0x8027BE3C 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x0020C240 0x8027BE40 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x0020C244 0x8027BE44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C248 0x8027BE48 0x00000000 */ .word 0x00000000 # nop
