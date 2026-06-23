/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000F1000_00101000.s
 * z64 range: 0x001002C8..0x001002F8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* FRAMELESS LEAF recovered. 0x801B3E20-> +0x298 counter clamp at 0x82; j 0x801B32B0 tail-jump internal; jr $ra/move $v0,$a1 at 0x001002F0-0x001002F4. */
/* 0x001002C8 0x8016FEC8 0x3C04801B */ .word 0x3C04801B # lui $a0, 0x801B
/* 0x001002CC 0x8016FECC 0x8C843E20 */ .word 0x8C843E20 # lw $a0, 0x3E20($a0)
/* 0x001002D0 0x8016FED0 0x8C830298 */ .word 0x8C830298 # lw $v1, 0x298($a0)
/* 0x001002D4 0x8016FED4 0x28620082 */ .word 0x28620082 # slti $v0, $v1, 0x82
/* 0x001002D8 0x8016FED8 0x10400004 */ .word 0x10400004 # beq $v0, $zero, 0x8016FEEC
/* 0x001002DC 0x8016FEDC 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x001002E0 0x8016FEE0 0x24620001 */ .word 0x24620001 # addiu $v0, $v1, 0x1
/* 0x001002E4 0x8016FEE4 0x0806CCAC */ .word 0x0806CCAC # j 0x801B32B0
/* 0x001002E8 0x8016FEE8 0xAC820298 */ .word 0xAC820298 # sw $v0, 0x298($a0)
/* 0x001002EC 0x8016FEEC 0x24050001 */ .word 0x24050001 # addiu $a1, $zero, 0x1
/* 0x001002F0 0x8016FEF0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001002F4 0x8016FEF4 0x00A01021 */ .word 0x00A01021 # move $v0, $a1
