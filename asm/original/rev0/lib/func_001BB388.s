/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BB388..0x001BB3BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf on $a0: lhu 0x2C($a0) branch; j 0x802222A0 internal tail-jump; jr $ra(0x1BB3B4)+delay move $v0,$zero(0x1BB3B8). */
func_001BB388:
/* 0x001BB388 0x8022AF88 0x9482002C */ .word 0x9482002C # lhu $v0, 0x2C($a0)
/* 0x001BB38C 0x8022AF8C 0x10400006 */ .word 0x10400006 # beq $v0, $zero, 0x8022AFA8
/* 0x001BB390 0x8022AF90 0x00000000 */ .word 0x00000000 # nop
/* 0x001BB394 0x8022AF94 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB398 0x8022AF98 0x8C430004 */ .word 0x8C430004 # lw $v1, 0x4($v0)
/* 0x001BB39C 0x8022AF9C 0x8C820004 */ .word 0x8C820004 # lw $v0, 0x4($a0)
/* 0x001BB3A0 0x8022AFA0 0x080888A8 */ .word 0x080888A8 # j 0x802222A0
/* 0x001BB3A4 0x8022AFA4 0x00621021 */ .word 0x00621021 # addu $v0, $v1, $v0
/* 0x001BB3A8 0x8022AFA8 0x8C820008 */ .word 0x8C820008 # lw $v0, 0x8($a0)
/* 0x001BB3AC 0x8022AFAC 0x24420008 */ .word 0x24420008 # addiu $v0, $v0, 0x8
/* 0x001BB3B0 0x8022AFB0 0xAC820008 */ .word 0xAC820008 # sw $v0, 0x8($a0)
/* 0x001BB3B4 0x8022AFB4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BB3B8 0x8022AFB8 0x00001021 */ .word 0x00001021 # move $v0, $zero
