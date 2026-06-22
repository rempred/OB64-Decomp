/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00061000_00071000.s
 * z64 range: 0x00070864..0x00070890 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x28 at 0x70864; single jal then epilogue jr $ra at 0x70888 + delay addiu $sp,0x28 at 0x7088C. Next prologue at 0x70890. */
func_00070864:
/* 0x00070864 0x800E0464 0x27BDFFD8 */ .word 0x27BDFFD8 # addiu $sp, $sp, -0x28
/* 0x00070868 0x800E0468 0x8FA20038 */ .word 0x8FA20038 # lw $v0, 0x38($sp)
/* 0x0007086C 0x800E046C 0x8FA3003C */ .word 0x8FA3003C # lw $v1, 0x3C($sp)
/* 0x00070870 0x800E0470 0xAFBF0020 */ .word 0xAFBF0020 # sw $ra, 0x20($sp)
/* 0x00070874 0x800E0474 0xAFA00018 */ .word 0xAFA00018 # sw $zero, 0x18($sp)
/* 0x00070878 0x800E0478 0xAFA20010 */ .word 0xAFA20010 # sw $v0, 0x10($sp)
/* 0x0007087C 0x800E047C 0x0C0665F4 */ .word 0x0C0665F4 # jal 0x801997D0
/* 0x00070880 0x800E0480 0xAFA30014 */ .word 0xAFA30014 # sw $v1, 0x14($sp)
/* 0x00070884 0x800E0484 0x8FBF0020 */ .word 0x8FBF0020 # lw $ra, 0x20($sp)
/* 0x00070888 0x800E0488 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0007088C 0x800E048C 0x27BD0028 */ .word 0x27BD0028 # addiu $sp, $sp, 0x28
