/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB79C..0x001BB7C4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: andi clear bit0 of 0x8023A254 global; jr $ra(0x1BB7BC)+delay sw $v1,0x8($a0)(0x1BB7C0). */
func_001BB79C:
/* 0x001BB79C 0x8022B39C 0x3C028023 */ .word 0x3C028023 # lui $v0, 0x8023
/* 0x001BB7A0 0x8022B3A0 0x9442A254 */ .word 0x9442A254 # lhu $v0, -0x5DAC($v0)
/* 0x001BB7A4 0x8022B3A4 0x8C830008 */ .word 0x8C830008 # lw $v1, 0x8($a0)
/* 0x001BB7A8 0x8022B3A8 0x3042FFFE */ .word 0x3042FFFE # andi $v0, $v0, 0xFFFE
/* 0x001BB7AC 0x8022B3AC 0x24630004 */ .word 0x24630004 # addiu $v1, $v1, 0x4
/* 0x001BB7B0 0x8022B3B0 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x001BB7B4 0x8022B3B4 0xA422A254 */ .word 0xA422A254 # sh $v0, -0x5DAC($at)
/* 0x001BB7B8 0x8022B3B8 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x001BB7BC 0x8022B3BC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB7C0 0x8022B3C0 0xAC830008 */ .word 0xAC830008 # sw $v1, 0x8($a0)
