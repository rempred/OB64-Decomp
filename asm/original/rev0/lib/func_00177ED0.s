/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x00177ED0..0x00177F00 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble lui $a0,0x8022 / lw $a0,-0x7280($a0) @0x177ED0-0x177ED4 (read-before-write) folded forward into addiu $sp,-0x18 prologue @0x177ED8; beq $a0,$zero @0x177EDC reads $a0. Single jr $ra @0x177EF8 + delay @0x177EFC. */
func_00177ED0:
/* 0x00177ED0 0x801E7AD0 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00177ED4 0x801E7AD4 0x8C848D80 */ .word 0x8C848D80 # lw $a0, -0x7280($a0)

/* function boundary candidate: func_00177ED8, size=40, kind=prologue */
func_00177ED8:
/* 0x00177ED8 0x801E7AD8 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00177EDC 0x801E7ADC 0x10800005 */ .word 0x10800005 # beq $a0, $zero, 0x801E7AF4
/* 0x00177EE0 0x801E7AE0 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00177EE4 0x801E7AE4 0x0C05F0E1 */ .word 0x0C05F0E1 # jal 0x8017C384
/* 0x00177EE8 0x801E7AE8 0x00000000 */ .word 0x00000000 # nop
/* 0x00177EEC 0x801E7AEC 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x00177EF0 0x801E7AF0 0xAC208D80 */ .word 0xAC208D80 # sw $zero, -0x7280($at)
/* 0x00177EF4 0x801E7AF4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00177EF8 0x801E7AF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00177EFC 0x801E7AFC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
