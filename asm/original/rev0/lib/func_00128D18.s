/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00121000_00131000.s
 * z64 range: 0x00128D18..0x00128D50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed func (addiu $sp,-0x18). jal 0x801B2B78; clears flag bit (and 0x0($s0) with -0x2001). Ends jr $ra @0x00128D44 + delay 0x00128D48; trailing nop 0x00128D4C kept as alignment padding. */
/* function boundary candidate: func_00128D18, size=52, kind=prologue */
func_00128D18:
/* 0x00128D18 0x80198918 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00128D1C 0x8019891C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00128D20 0x80198920 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00128D24 0x80198924 0x0C06CADE */ .word 0x0C06CADE # jal 0x801B2B78
/* 0x00128D28 0x80198928 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00128D2C 0x8019892C 0x8E020000 */ .word 0x8E020000 # lw $v0, 0x0($s0)
/* 0x00128D30 0x80198930 0x2403DFFF */ .word 0x2403DFFF # addiu $v1, $zero, -0x2001
/* 0x00128D34 0x80198934 0x00431024 */ .word 0x00431024 # and $v0, $v0, $v1
/* 0x00128D38 0x80198938 0xAE020000 */ .word 0xAE020000 # sw $v0, 0x0($s0)
/* 0x00128D3C 0x8019893C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00128D40 0x80198940 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00128D44 0x80198944 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00128D48 0x80198948 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
/* 0x00128D4C 0x8019894C 0x00000000 */ .word 0x00000000 # nop
