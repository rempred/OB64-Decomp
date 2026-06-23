/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00141000_00151000.s
 * z64 range: 0x0014AA40..0x0014AA6C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* True entry: 2-word read-before-write preamble at 0x0014AA40 (lui $a0,0x8020 / lw $a0,-0x25BC($a0)) loading the $a0 argument. Inner prologue addiu $sp,-0x18 at 0x0014AA48; body passes $a0 to jal 0x800712C4 at 0x0014AA50 without writing it first. jr $ra at 0x0014AA64 + delay 0x0014AA68 = slice end. */
func_0014AA40:
/* 0x0014AA40 0x801BA640 0x3C048020 */ .word 0x3C048020 # lui $a0, 0x8020
/* 0x0014AA44 0x801BA644 0x8C84DA44 */ .word 0x8C84DA44 # lw $a0, -0x25BC($a0)

/* function boundary candidate: func_0014AA48, size=36, kind=prologue */
func_0014AA48:
/* 0x0014AA48 0x801BA648 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0014AA4C 0x801BA64C 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0014AA50 0x801BA650 0x0C01C4B1 */ .word 0x0C01C4B1 # jal 0x800712C4
/* 0x0014AA54 0x801BA654 0x00000000 */ .word 0x00000000 # nop
/* 0x0014AA58 0x801BA658 0x3C018020 */ .word 0x3C018020 # lui $at, 0x8020
/* 0x0014AA5C 0x801BA65C 0xAC22DA44 */ .word 0xAC22DA44 # sw $v0, -0x25BC($at)
/* 0x0014AA60 0x801BA660 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0014AA64 0x801BA664 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0014AA68 0x801BA668 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
