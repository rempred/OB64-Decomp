/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00111000_00121000.s
 * z64 range: 0x00113C60..0x00113C8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry is the 2-word read-before-write preamble at 0x113C60 (lui $a0,0x801F; lw $a0,0x801F0CAC) feeding the addiu $sp,-0x18 prologue at 0x113C68 which passes $a0 to jal 0x800712C4 before writing it. jr $ra at 0x113C84 + delay slot addiu $sp,0x18 at 0x113C88; ends 0x113C8C (slice end). */
func_00113C60:
/* 0x00113C60 0x80183860 0x3C04801F */ .word 0x3C04801F # lui $a0, 0x801F
/* 0x00113C64 0x80183864 0x8C840CAC */ .word 0x8C840CAC # lw $a0, 0xCAC($a0)

/* function boundary candidate: func_00113C68, size=36, kind=prologue */
func_00113C68:
/* 0x00113C68 0x80183868 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00113C6C 0x8018386C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00113C70 0x80183870 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x00113C74 0x80183874 0x00000000 */ .word 0x00000000 # nop
/* 0x00113C78 0x80183878 0x3C01801F */ .word 0x3C01801F # lui $at, 0x801F
/* 0x00113C7C 0x8018387C 0xAC200CAC */ .word 0xAC200CAC # sw $zero, 0xCAC($at)
/* 0x00113C80 0x80183880 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00113C84 0x80183884 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00113C88 0x80183888 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
