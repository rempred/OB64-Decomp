/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00171000_00181000.s
 * z64 range: 0x0017828C..0x001782BC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble lui $a0,0x8022 / lw $a0,-0x727C($a0) @0x17828C-0x178290 (read-before-write) folded forward into addiu $sp,-0x18 prologue @0x178294; beq $a0,$zero @0x178298 reads $a0. jr $ra @0x1782B4 + delay @0x1782B8. */
func_0017828C:
/* 0x0017828C 0x801E7E8C 0x3C048022 */ .word 0x3C048022 # lui $a0, 0x8022
/* 0x00178290 0x801E7E90 0x8C848D84 */ .word 0x8C848D84 # lw $a0, -0x727C($a0)

/* function boundary candidate: func_00178294, size=40, kind=prologue */
func_00178294:
/* 0x00178294 0x801E7E94 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00178298 0x801E7E98 0x10800005 */ .word 0x10800005 # beq $a0, $zero, 0x801E7EB0
/* 0x0017829C 0x801E7E9C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x001782A0 0x801E7EA0 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x001782A4 0x801E7EA4 0x00000000 */ .word 0x00000000 # nop
/* 0x001782A8 0x801E7EA8 0x3C018022 */ .word 0x3C018022 # lui $at, 0x8022
/* 0x001782AC 0x801E7EAC 0xAC208D84 */ .word 0xAC208D84 # sw $zero, -0x727C($at)
/* 0x001782B0 0x801E7EB0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x001782B4 0x801E7EB4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001782B8 0x801E7EB8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
