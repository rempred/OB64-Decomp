/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00211000_00221000.s
 * z64 range: 0x0021D230..0x0021D25C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed -0x30 leaf wrapper; jal 0x801D98F4. jr $ra@0x21D254 + delay@0x21D258. */
/* function boundary candidate: func_0021D230, size=44, kind=prologue */
func_0021D230:
/* 0x0021D230 0x8028CE30 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x0021D234 0x8028CE34 0xAFBF0028 */ .word 0xAFBF0028 # sw $ra, 0x28($sp)
/* 0x0021D238 0x8028CE38 0xAFA00010 */ .word 0xAFA00010 # sw $zero, 0x10($sp)
/* 0x0021D23C 0x8028CE3C 0xAFA00014 */ .word 0xAFA00014 # sw $zero, 0x14($sp)
/* 0x0021D240 0x8028CE40 0xAFA00018 */ .word 0xAFA00018 # sw $zero, 0x18($sp)
/* 0x0021D244 0x8028CE44 0xAFA0001C */ .word 0xAFA0001C # sw $zero, 0x1C($sp)
/* 0x0021D248 0x8028CE48 0x0C07663D */ .word 0x0C07663D # jal 0x801D98F4
/* 0x0021D24C 0x8028CE4C 0xAFA00020 */ .word 0xAFA00020 # sw $zero, 0x20($sp)
/* 0x0021D250 0x8028CE50 0x8FBF0028 */ .word 0x8FBF0028 # lw $ra, 0x28($sp)
/* 0x0021D254 0x8028CE54 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0021D258 0x8028CE58 0x27BD0030 */ .word 0x27BD0030 # addiu $sp, $sp, 0x30
