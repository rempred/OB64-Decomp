/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D1CC..0x0021D200 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed -0x30 leaf wrapper; zeroes stack args, jal 0x801D98F4. jr $ra@0x21D1F8 + delay@0x21D1FC. */
/* function boundary candidate: func_0021D1CC, size=52, kind=prologue */
func_0021D1CC:
/* 0x0021D1CC 0x8028CDCC 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x0021D1D0 0x8028CDD0 0x00003021 */ .word 0x00003021 # move $a2, $zero
/* 0x0021D1D4 0x8028CDD4 0x00003821 */ .word 0x00003821 # move $a3, $zero
/* 0x0021D1D8 0x8028CDD8 0xAFBF0028 */ .word 0xAFBF0028 # sw $ra, 0x28($sp)
/* 0x0021D1DC 0x8028CDDC 0xAFA00010 */ .word 0xAFA00010 # sw $zero, 0x10($sp)
/* 0x0021D1E0 0x8028CDE0 0xAFA00014 */ .word 0xAFA00014 # sw $zero, 0x14($sp)
/* 0x0021D1E4 0x8028CDE4 0xAFA00018 */ .word 0xAFA00018 # sw $zero, 0x18($sp)
/* 0x0021D1E8 0x8028CDE8 0xAFA0001C */ .word 0xAFA0001C # sw $zero, 0x1C($sp)
/* 0x0021D1EC 0x8028CDEC 0x0C07663D */ .word 0x0C07663D # jal 0x801D98F4
/* 0x0021D1F0 0x8028CDF0 0xAFA00020 */ .word 0xAFA00020 # sw $zero, 0x20($sp)
/* 0x0021D1F4 0x8028CDF4 0x8FBF0028 */ .word 0x8FBF0028 # lw $ra, 0x28($sp)
/* 0x0021D1F8 0x8028CDF8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D1FC 0x8028CDFC 0x27BD0030 */ .word 0x27BD0030 # addiu $sp, $sp, 0x30
