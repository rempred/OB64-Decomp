/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x002827AC..0x002827EC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded forward: read-before-write load (lui $a0,0x8019; lw $a0,-0x3F0($a0)) @0x002827AC feeds the body whose prologue addiu $sp,-0x18 @0x002827B4 reads $a0 (beq $a0,$zero) before writing. Ends jr $ra @0x002827E4 + delay @0x002827E8. */
func_002827AC:
/* 0x002827AC 0x802F23AC 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x002827B0 0x802F23B0 0x8C84FC10 */ .word 0x8C84FC10 # lw $a0, -0x3F0($a0)

/* function boundary candidate: func_002827B4, size=56, kind=prologue */
func_002827B4:
/* 0x002827B4 0x802F23B4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002827B8 0x802F23B8 0x10800009 */ .word 0x10800009 # beq $a0, $zero, 0x802F23E0
/* 0x002827BC 0x802F23BC 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002827C0 0x802F23C0 0x90830007 */ .word 0x90830007 # lbu $v1, 0x7($a0)
/* 0x002827C4 0x802F23C4 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x002827C8 0x802F23C8 0x14620005 */ .word 0x14620005 # bne $v1, $v0, 0x802F23E0
/* 0x002827CC 0x802F23CC 0xA4800000 */ .word 0xA4800000 # sh $zero, 0x0($a0)
/* 0x002827D0 0x802F23D0 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002827D4 0x802F23D4 0x00000000 */ .word 0x00000000 # nop
/* 0x002827D8 0x802F23D8 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x002827DC 0x802F23DC 0xAC20FC10 */ .word 0xAC20FC10 # sw $zero, -0x3F0($at)
/* 0x002827E0 0x802F23E0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002827E4 0x802F23E4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002827E8 0x802F23E8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
