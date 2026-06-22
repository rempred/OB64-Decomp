/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x0006E8A8..0x0006E8D4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Preamble-orphan: true entry at 0x6E8A8 (lui $a0/lw $a0 -0x5868 load arg consumed before any store) folded in ahead of parent label 0x6E8B0. jr $ra at 0x6E8CC + delay 0x6E8D0. Word at 0x6E8D4 is a fresh read-before-write preamble for next, so split there. */
func_0006e8a8:
/* 0x0006E8A8 0x800DE4A8 0x3C04801A */ .word 0x3C04801A # lui $a0, 0x801A
/* 0x0006E8AC 0x800DE4AC 0x8C84A798 */ .word 0x8C84A798 # lw $a0, -0x5868($a0)
/* 0x0006E8B0 0x800DE4B0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0006E8B4 0x800DE4B4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0006E8B8 0x800DE4B8 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0006E8BC 0x800DE4BC 0x00000000 */ .word 0x00000000 # nop
/* 0x0006E8C0 0x800DE4C0 0x3C01801A */ .word 0x3C01801A # lui $at, 0x801A
/* 0x0006E8C4 0x800DE4C4 0xAC20A798 */ .word 0xAC20A798 # sw $zero, -0x5868($at)
/* 0x0006E8C8 0x800DE4C8 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0006E8CC 0x800DE4CC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0006E8D0 0x800DE4D0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
