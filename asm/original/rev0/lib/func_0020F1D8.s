/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020F1D8..0x0020F1FC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* PREAMBLE-ORPHAN folded forward: preamble @0x20F1D8 lui $a0,0x801D / lw $a0,0x824($a0) loads $a0 which body @0x20F1E0 passes to jal 0x800712C4 @0x20F1E8 before writing it. True entry = 0x20F1D8. Epilogue jr ra @0x20F1F4 + delay @0x20F1F8 = slice end. */
func_0020F1D8:
/* 0x0020F1D8 0x8027EDD8 0x3C04801D */ .word 0x3C04801D # lui $a0, 0x801D
/* 0x0020F1DC 0x8027EDDC 0x8C840824 */ .word 0x8C840824 # lw $a0, 0x824($a0)

/* function boundary candidate: func_0020F1E0, size=28, kind=prologue */
func_0020F1E0:
/* 0x0020F1E0 0x8027EDE0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020F1E4 0x8027EDE4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020F1E8 0x8027EDE8 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0020F1EC 0x8027EDEC 0x00000000 */ .word 0x00000000 # nop
/* 0x0020F1F0 0x8027EDF0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020F1F4 0x8027EDF4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020F1F8 0x8027EDF8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
