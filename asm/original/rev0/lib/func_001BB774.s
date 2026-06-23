/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB774..0x001BB79C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: ori bit0 into 0x8023A254 global; jr $ra(0x1BB794)+delay sw $v1,0x8($a0)(0x1BB798). */
func_001BB774:
/* 0x001BB774 0x8022B374 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x001BB778 0x8022B378 0x9442A254 */ .word 0x9442A254 # lhu $v0, -0x5DAC($v0)
/* 0x001BB77C 0x8022B37C 0x8C830008 */ .word 0x8C830008 # lw $v1, 0x8($a0)
/* 0x001BB780 0x8022B380 0x34420001 */ .word 0x34420001 # ori $v0, $v0, 0x0001
/* 0x001BB784 0x8022B384 0x24630004 */ .word 0x24630004 # addiu $v1, $v1, 0x4
/* 0x001BB788 0x8022B388 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x001BB78C 0x8022B38C 0xA422A254 */ .word 0xA422A254 # sh $v0, -0x5DAC($at)
/* 0x001BB790 0x8022B390 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x001BB794 0x8022B394 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB798 0x8022B398 0xAC830008 */ .word 0xAC830008 # sw $v1, 0x8($a0)
