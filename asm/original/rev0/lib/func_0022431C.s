/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x0022431C..0x0022434C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small framed leaf, frame 0x30. Same shape as previous (jal 0x801E0D34 wrapper). jr $ra (0x00224344) + addiu $sp,0x30 delay (0x00224348). Next 0x0022434C addiu $sp,-0x58. */
/* function boundary candidate: func_0022431C, size=48, kind=prologue */
func_0022431C:
/* 0x0022431C 0x80293F1C 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x00224320 0x80293F20 0x8FA20040 */ .word 0x8FA20040 # lw $v0, 0x40($sp)
/* 0x00224324 0x80293F24 0xAFBF0028 */ .word 0xAFBF0028 # sw $ra, 0x28($sp)
/* 0x00224328 0x80293F28 0xAFA00014 */ .word 0xAFA00014 # sw $zero, 0x14($sp)
/* 0x0022432C 0x80293F2C 0xAFA00018 */ .word 0xAFA00018 # sw $zero, 0x18($sp)
/* 0x00224330 0x80293F30 0xAFA0001C */ .word 0xAFA0001C # sw $zero, 0x1C($sp)
/* 0x00224334 0x80293F34 0xAFA00020 */ .word 0xAFA00020 # sw $zero, 0x20($sp)
/* 0x00224338 0x80293F38 0x0C07834D */ .word 0x0C07834D # jal 0x801E0D34
/* 0x0022433C 0x80293F3C 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x00224340 0x80293F40 0x8FBF0028 */ .word 0x8FBF0028 # lw $ra, 0x28($sp)
/* 0x00224344 0x80293F44 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00224348 0x80293F48 0x27BD0030 */ .word 0x27BD0030 # addiu $sp, $sp, 0x30
