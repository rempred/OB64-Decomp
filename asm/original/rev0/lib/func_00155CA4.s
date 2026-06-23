/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00151000_00161000.s
 * z64 range: 0x00155CA4..0x00155CC8 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* addiu $sp,-0x18; jr $ra 0x00155CC0 + delay 0x00155CC4. */
/* function boundary candidate: func_00155CA4, size=36, kind=prologue */
func_00155CA4:
/* 0x00155CA4 0x801C58A4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00155CA8 0x801C58A8 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00155CAC 0x801C58AC 0x0C05E406 */ .word 0x0C05E406 # jal 0x80179018
/* 0x00155CB0 0x801C58B0 0x00000000 */ .word 0x00000000 # nop
/* 0x00155CB4 0x801C58B4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x00155CB8 0x801C58B8 0xA020F480 */ .word 0xA020F480 # sb $zero, -0xB80($at)
/* 0x00155CBC 0x801C58BC 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00155CC0 0x801C58C0 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00155CC4 0x801C58C4 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
