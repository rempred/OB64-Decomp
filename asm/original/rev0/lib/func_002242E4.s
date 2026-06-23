/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00221000_00231000.s
 * z64 range: 0x002242E4..0x0022431C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Small framed leaf, frame 0x30. Reads stack args (lw 0x40($sp), lbu 0x47($sp)), one jal 0x801E0D34, jr $ra (0x00224314) + addiu $sp,0x30 delay (0x00224318). Next 0x0022431C addiu $sp,-0x30. */
/* function boundary candidate: func_002242E4, size=56, kind=prologue */
func_002242E4:
/* 0x002242E4 0x80293EE4 0x27BDFFD0 */ .word 0x27BDFFD0 # addiu $sp, $sp, -0x30
/* 0x002242E8 0x80293EE8 0x8FA20040 */ .word 0x8FA20040 # lw $v0, 0x40($sp)
/* 0x002242EC 0x80293EEC 0x93A80047 */ .word 0x93A80047 # lbu $t0, 0x47($sp)
/* 0x002242F0 0x80293EF0 0x24030001 */ .word 0x24030001 # addiu $v1, $zero, 0x1
/* 0x002242F4 0x80293EF4 0xAFBF0028 */ .word 0xAFBF0028 # sw $ra, 0x28($sp)
/* 0x002242F8 0x80293EF8 0xAFA30018 */ .word 0xAFA30018 # sw $v1, 0x18($sp)
/* 0x002242FC 0x80293EFC 0xAFA0001C */ .word 0xAFA0001C # sw $zero, 0x1C($sp)
/* 0x00224300 0x80293F00 0xAFA00020 */ .word 0xAFA00020 # sw $zero, 0x20($sp)
/* 0x00224304 0x80293F04 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x00224308 0x80293F08 0x0C07834D */ .word 0x0C07834D # jal 0x801E0D34
/* 0x0022430C 0x80293F0C 0xAFA80014 */ .word 0xAFA80014 # sw $t0, 0x14($sp)
/* 0x00224310 0x80293F10 0x8FBF0028 */ .word 0x8FBF0028 # lw $ra, 0x28($sp)
/* 0x00224314 0x80293F14 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00224318 0x80293F18 0x27BD0030 */ .word 0x27BD0030 # addiu $sp, $sp, 0x30
