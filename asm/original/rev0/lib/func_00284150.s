/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00284150..0x00284184 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded FORWARD: lui $a0,0x8023; lw $a0,-0x56A8($a0) at 0x00284150 loads $a0 read by the first jal 0x800712C4 (delay nop) inside the addiu $sp,-0x18 body before $a0 is rewritten. True entry = preamble start; parent prologue was func_00284158. Ends jr$ra@0x0028417C + addiu-sp delay. */
func_00284150:
/* 0x00284150 0x802F3D50 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x00284154 0x802F3D54 0x8C84A958 */ .word 0x8C84A958 # lw $a0, -0x56A8($a0)

/* function boundary candidate: func_00284158, size=44, kind=prologue */
func_00284158:
/* 0x00284158 0x802F3D58 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0028415C 0x802F3D5C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00284160 0x802F3D60 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00284164 0x802F3D64 0x00000000 */ .word 0x00000000 # nop
/* 0x00284168 0x802F3D68 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x0028416C 0x802F3D6C 0xAC20A958 */ .word 0xAC20A958 # sw $zero, -0x56A8($at)
/* 0x00284170 0x802F3D70 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x00284174 0x802F3D74 0xAC20A950 */ .word 0xAC20A950 # sw $zero, -0x56B0($at)
/* 0x00284178 0x802F3D78 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0028417C 0x802F3D7C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00284180 0x802F3D80 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
