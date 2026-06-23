/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D28C..0x0021D2C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed -0x30 leaf wrapper; forwards 0x40/0x44($sp); jal 0x801D98F4. jr $ra@0x21D2B8 + delay@0x21D2BC. */
/* function boundary candidate: func_0021D28C, size=52, kind=prologue */
func_0021D28C:
/* 0x0021D28C 0x8028CE8C 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x0021D290 0x8028CE90 0x8FA20040 */ .word 0x8FA20040 # lw $v0, 0x40($sp)
/* 0x0021D294 0x8028CE94 0x8FA30044 */ .word 0x8FA30044 # lw $v1, 0x44($sp)
/* 0x0021D298 0x8028CE98 0xAFBF0028 */ .word 0xAFBF0028 # sw $ra, 0x28($sp)
/* 0x0021D29C 0x8028CE9C 0xAFA00018 */ .word 0xAFA00018 # sw $zero, 0x18($sp)
/* 0x0021D2A0 0x8028CEA0 0xAFA0001C */ .word 0xAFA0001C # sw $zero, 0x1C($sp)
/* 0x0021D2A4 0x8028CEA4 0xAFA00020 */ .word 0xAFA00020 # sw $zero, 0x20($sp)
/* 0x0021D2A8 0x8028CEA8 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x0021D2AC 0x8028CEAC 0x0C07663D */ .word 0x0C07663D # jal 0x801D98F4
/* 0x0021D2B0 0x8028CEB0 0xAFA30014 */ .word 0xAFA30014 # sw $v1, 0x14($sp)
/* 0x0021D2B4 0x8028CEB4 0x8FBF0028 */ .word 0x8FBF0028 # lw $ra, 0x28($sp)
/* 0x0021D2B8 0x8028CEB8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D2BC 0x8028CEBC 0x27BD0030 */ .word 0x27BD0030 # addiu $sp, $sp, 0x30
