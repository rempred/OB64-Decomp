/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x002057A0..0x002057DC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18; stores 2 to 0x801CEF00, jal 0x80070F30 alloc 0xDC0, stores ptr to 0x801D0728, jal 0x80093380; ends jr$ra at 0x002057D4 + delay at 0x002057D8. The trailing lui/lw at 0x002057DC belongs to the NEXT function (preamble). */
/* function boundary candidate: func_002057A0, size=60, kind=prologue */
func_002057A0:
/* 0x002057A0 0x802753A0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002057A4 0x802753A4 0x24020002 */ .word 0x24020002 # addiu $v0, $zero, 0x2
/* 0x002057A8 0x802753A8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002057AC 0x802753AC 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x002057B0 0x802753B0 0xA022EF00 */ .word 0xA022EF00 # sb $v0, -0x1100($at)
/* 0x002057B4 0x802753B4 0x0C01C3CC */ .word 0x0C01C3CC # jal 0x80070F30
/* 0x002057B8 0x802753B8 0x24040DC0 */ .word 0x24040DC0 # addiu $a0, $zero, 0xDC0
/* 0x002057BC 0x802753BC 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x002057C0 0x802753C0 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x002057C4 0x802753C4 0xAC240728 */ .word 0xAC240728 # sw $a0, 0x728($at)
/* 0x002057C8 0x802753C8 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x002057CC 0x802753CC 0x24050DC0 */ .word 0x24050DC0 # addiu $a1, $zero, 0xDC0
/* 0x002057D0 0x802753D0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002057D4 0x802753D4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002057D8 0x802753D8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
