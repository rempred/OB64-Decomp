/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201D24..0x00201D50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN: preamble at 0x201D24 (lui $a0,0x801D / lw $a0,0x6AC) loads $a0 used as the jal argument by stack-frame body at 0x201D2C (addiu$sp,-0x18; jal 0x800712C4 reads $a0 before write). Folded forward; own name. Body returns jr@0x00201D48 + delay addiu$sp,0x18@0x00201D4C. */
func_00201D24:
/* 0x00201D24 0x80271924 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x00201D28 0x80271928 0x8C8406AC */ .word 0x8C8406AC # lw $a0, 0x6AC($a0)

/* function boundary candidate: func_00201D2C, size=220, kind=prologue */
func_00201D2C:
/* 0x00201D2C 0x8027192C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00201D30 0x80271930 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00201D34 0x80271934 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00201D38 0x80271938 0x00000000 */ .word 0x00000000 # nop
/* 0x00201D3C 0x8027193C 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x00201D40 0x80271940 0xAC2006AC */ .word 0xAC2006AC # sw $zero, 0x6AC($at)
/* 0x00201D44 0x80271944 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00201D48 0x80271948 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201D4C 0x8027194C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
