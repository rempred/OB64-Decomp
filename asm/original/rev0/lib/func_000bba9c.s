/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_000B1000_000C1000.s
 * z64 range: 0x000BBA9C..0x000BBAD0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* RECOVERED frameless leaf; reads $a0, lbu 0x11/0x33/0x18, jr $ra @0xBBAC8. */
func_000bba9c:
/* 0x000BBA9C 0x8012B69C 0x90820011 */ .word 0x90820011 # lbu $v0, 0x11($a0)
/* 0x000BBAA0 0x8012B6A0 0x10400008 */ .word 0x10400008 # beq $v0, $zero, 0x8012B6C4
/* 0x000BBAA4 0x8012B6A4 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x000BBAA8 0x8012B6A8 0x90820033 */ .word 0x90820033 # lbu $v0, 0x33($a0)
/* 0x000BBAAC 0x8012B6AC 0x30420004 */ .word 0x30420004 # andi $v0, $v0, 0x0004
/* 0x000BBAB0 0x8012B6B0 0x54400005 */ .word 0x54400005 # bnel $v0, $zero, 0x8012B6C8
/* 0x000BBAB4 0x8012B6B4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000BBAB8 0x8012B6B8 0x94820018 */ .word 0x94820018 # lhu $v0, 0x18($a0)
/* 0x000BBABC 0x8012B6BC 0x14400002 */ .word 0x14400002 # bne $v0, $zero, 0x8012B6C8
/* 0x000BBAC0 0x8012B6C0 0x00000000 */ .word 0x00000000 # nop
/* 0x000BBAC4 0x8012B6C4 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x000BBAC8 0x8012B6C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000BBACC 0x8012B6CC 0x00601021 */ .word 0x00601021 # move $v0, $v1
