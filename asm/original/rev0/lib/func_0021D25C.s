/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D25C..0x0021D28C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed -0x30 leaf wrapper; forwards 0x40($sp); jal 0x801D98F4. jr $ra@0x21D284 + delay@0x21D288. */
/* function boundary candidate: func_0021D25C, size=48, kind=prologue */
func_0021D25C:
/* 0x0021D25C 0x8028CE5C 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x0021D260 0x8028CE60 0x8FA20040 */ .word 0x8FA20040 # lw $v0, 0x40($sp)
/* 0x0021D264 0x8028CE64 0xAFBF0028 */ .word 0xAFBF0028 # sw $ra, 0x28($sp)
/* 0x0021D268 0x8028CE68 0xAFA00014 */ .word 0xAFA00014 # sw $zero, 0x14($sp)
/* 0x0021D26C 0x8028CE6C 0xAFA00018 */ .word 0xAFA00018 # sw $zero, 0x18($sp)
/* 0x0021D270 0x8028CE70 0xAFA0001C */ .word 0xAFA0001C # sw $zero, 0x1C($sp)
/* 0x0021D274 0x8028CE74 0xAFA00020 */ .word 0xAFA00020 # sw $zero, 0x20($sp)
/* 0x0021D278 0x8028CE78 0x0C07663D */ .word 0x0C07663D # jal 0x801D98F4
/* 0x0021D27C 0x8028CE7C 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x0021D280 0x8028CE80 0x8FBF0028 */ .word 0x8FBF0028 # lw $ra, 0x28($sp)
/* 0x0021D284 0x8028CE84 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D288 0x8028CE88 0x27BD0030 */ .word 0x27BD0030 # addiu $sp, $sp, 0x30
