/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001B1000_001C1000.s
 * z64 range: 0x001BA37C..0x001BA3BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan (reconciled cross-slice fold k8->k9): 2-word read-before-write preamble @0x1BA37C precedes body prologue @0x1BA384 (parent boundary 0x1BA384). */
func_001BA37C:
/* 0x001BA37C 0x80229F7C 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x001BA380 0x80229F80 0x8C84A248 */ .word 0x8C84A248 # lw $a0, -0x5DB8($a0)

/* function boundary candidate: func_001BA384, size=96, kind=prologue */
func_001BA384:
/* 0x001BA384 0x80229F84 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x001BA388 0x80229F88 0x10800007 */ .word 0x10800007 # beq $a0, $zero, 0x80229FA8
/* 0x001BA38C 0x80229F8C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001BA390 0x80229F90 0x3C058023 */ .word 0x3C058023 # lui $a1, 0x8023
/* 0x001BA394 0x80229F94 0x8CA5A24C */ .word 0x8CA5A24C # lw $a1, -0x5DB4($a1)
/* 0x001BA398 0x80229F98 0x10A00003 */ .word 0x10A00003 # beq $a1, $zero, 0x80229FA8
/* 0x001BA39C 0x80229F9C 0x00000000 */ .word 0x00000000 # nop
/* 0x001BA3A0 0x80229FA0 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x001BA3A4 0x80229FA4 0x00000000 */ .word 0x00000000 # nop
/* 0x001BA3A8 0x80229FA8 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x001BA3AC 0x80229FAC 0xAC20A250 */ .word 0xAC20A250 # sw $zero, -0x5DB0($at)
/* 0x001BA3B0 0x80229FB0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001BA3B4 0x80229FB4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001BA3B8 0x80229FB8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
