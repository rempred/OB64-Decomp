/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00281000_00291000.s
 * z64 range: 0x00284184..0x002841CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan folded FORWARD: lui $a0,0x8023; lw $a0,-0x56A8($a0) at 0x00284184 loads $a0 read by the first jal 0x800712C4 (delay nop) inside the addiu $sp,-0x18 body before $a0 is rewritten. True entry = preamble start; parent prologue was func_0028418C. Ends jr$ra@0x002841C4 + addiu-sp delay = slice end. */
func_00284184:
/* 0x00284184 0x802F3D84 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x00284188 0x802F3D88 0x8C84A958 */ .word 0x8C84A958 # lw $a0, -0x56A8($a0)

/* function boundary candidate: func_0028418C, size=64, kind=prologue */
func_0028418C:
/* 0x0028418C 0x802F3D8C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00284190 0x802F3D90 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00284194 0x802F3D94 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00284198 0x802F3D98 0x00000000 */ .word 0x00000000 # nop
/* 0x0028419C 0x802F3D9C 0x3C048023 */ .word 0x3C048023 # lui $a0, 0x8023
/* 0x002841A0 0x802F3DA0 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x002841A4 0x802F3DA4 0x8C84A95C */ .word 0x8C84A95C # lw $a0, -0x56A4($a0)
/* 0x002841A8 0x802F3DA8 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002841AC 0x802F3DAC 0xAC20A958 */ .word 0xAC20A958 # sw $zero, -0x56A8($at)
/* 0x002841B0 0x802F3DB0 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002841B4 0x802F3DB4 0xAC20A95C */ .word 0xAC20A95C # sw $zero, -0x56A4($at)
/* 0x002841B8 0x802F3DB8 0x3C018023 */ .word 0x3C018023 # lui $at, 0x8023
/* 0x002841BC 0x802F3DBC 0xAC20A950 */ .word 0xAC20A950 # sw $zero, -0x56B0($at)
/* 0x002841C0 0x802F3DC0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002841C4 0x802F3DC4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002841C8 0x802F3DC8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
