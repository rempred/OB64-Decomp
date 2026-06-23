/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x0015DFFC..0x0015E02C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan ending slice: 2-word preamble (lui/lw $a0 from global 0x3EE8) at 0x0015DFFC feeds beq $a0,$zero @0x0015E008 in the addiu $sp,-0x18 body at 0x0015E004, read before write. Folded forward; own entry. jr $ra @0x0015E024 + delay 0x0015E028 = slice end. */
func_0015DFFC:
/* 0x0015DFFC 0x801CDBFC 0x3C048021 */ .word 0x3C048021 # lui $a0, 0x8021
/* 0x0015E000 0x801CDC00 0x8C843EE8 */ .word 0x8C843EE8 # lw $a0, 0x3EE8($a0)

/* function boundary candidate: func_0015E004, size=40, kind=prologue */
func_0015E004:
/* 0x0015E004 0x801CDC04 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0015E008 0x801CDC08 0x10800003 */ .word 0x10800003 # beq $a0, $zero, 0x801CDC18
/* 0x0015E00C 0x801CDC0C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0015E010 0x801CDC10 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0015E014 0x801CDC14 0x00000000 */ .word 0x00000000 # nop
/* 0x0015E018 0x801CDC18 0x3C018021 */ .word 0x3C018021 # lui $at, 0x8021
/* 0x0015E01C 0x801CDC1C 0xAC203EE8 */ .word 0xAC203EE8 # sw $zero, 0x3EE8($at)
/* 0x0015E020 0x801CDC20 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0015E024 0x801CDC24 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0015E028 0x801CDC28 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
