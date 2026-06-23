/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D200..0x0021D230 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed -0x30 leaf wrapper; jal 0x801D98F4. jr $ra@0x21D228 + delay@0x21D22C. */
/* function boundary candidate: func_0021D200, size=48, kind=prologue */
func_0021D200:
/* 0x0021D200 0x8028CE00 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x0021D204 0x8028CE04 0x00003821 */ .word 0x00003821 # move $a3, $zero
/* 0x0021D208 0x8028CE08 0xAFBF0028 */ .word 0xAFBF0028 # sw $ra, 0x28($sp)
/* 0x0021D20C 0x8028CE0C 0xAFA00010 */ .word 0xAFA00010 # sw $zero, 0x10($sp)
/* 0x0021D210 0x8028CE10 0xAFA00014 */ .word 0xAFA00014 # sw $zero, 0x14($sp)
/* 0x0021D214 0x8028CE14 0xAFA00018 */ .word 0xAFA00018 # sw $zero, 0x18($sp)
/* 0x0021D218 0x8028CE18 0xAFA0001C */ .word 0xAFA0001C # sw $zero, 0x1C($sp)
/* 0x0021D21C 0x8028CE1C 0x0C07663D */ .word 0x0C07663D # jal 0x801D98F4
/* 0x0021D220 0x8028CE20 0xAFA00020 */ .word 0xAFA00020 # sw $zero, 0x20($sp)
/* 0x0021D224 0x8028CE24 0x8FBF0028 */ .word 0x8FBF0028 # lw $ra, 0x28($sp)
/* 0x0021D228 0x8028CE28 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D22C 0x8028CE2C 0x27BD0030 */ .word 0x27BD0030 # addiu $sp, $sp, 0x30
