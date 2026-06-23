/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C24C..0x0020C284 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless range predicate over obj+0x48 (0x87..,0xA1); jr$ra at C27C/delay C280. */
/* 0x0020C24C 0x8027BE4C 0x1080000B */ .word 0x1080000B # beq $a0, $zero, 0x8027BE7C
/* 0x0020C250 0x8027BE50 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C254 0x8027BE54 0x8C840048 */ .word 0x8C840048 # lw $a0, 0x48($a0)
/* 0x0020C258 0x8027BE58 0x2482FF79 */ .word 0x2482FF79 # addiu $v0, $a0, -0x87
/* 0x0020C25C 0x8027BE5C 0x2C420002 */ .word 0x2C420002 # sltiu $v0, $v0, 0x2
/* 0x0020C260 0x8027BE60 0x14400004 */ .word 0x14400004 # bne $v0, $zero, 0x8027BE74
/* 0x0020C264 0x8027BE64 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x0020C268 0x8027BE68 0x240200A1 */ .word 0x240200A1 # addiu $v0, $zero, 0xA1
/* 0x0020C26C 0x8027BE6C 0x14820003 */ .word 0x14820003 # bne $a0, $v0, 0x8027BE7C
/* 0x0020C270 0x8027BE70 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x0020C274 0x8027BE74 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x0020C278 0x8027BE78 0x00601021 */ .word 0x00601021 # move $v0, $v1
/* 0x0020C27C 0x8027BE7C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C280 0x8027BE80 0x00000000 */ .word 0x00000000 # nop
