/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_002A1000_002B1000.s
 * z64 range: 0x002AE4DC..0x002AE510 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu$sp,-0x18. jal 0x80243810, stores result + a float to 801D-relative globals. jr $ra @0x002AE508 + delay 0x002AE50C. */
/* function boundary candidate: func_002AE4DC, size=52, kind=prologue */
func_002AE4DC:
/* 0x002AE4DC 0x8031E0DC 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x002AE4E0 0x8031E0E0 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x002AE4E4 0x8031E0E4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x002AE4E8 0x8031E0E8 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x002AE4EC 0x8031E0EC 0x0C090E04 */ .word 0x0C090E04 # jal 0x80243810
/* 0x002AE4F0 0x8031E0F0 0xAC22EAB0 */ .word 0xAC22EAB0 # sw $v0, -0x1550($at)
/* 0x002AE4F4 0x8031E0F4 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x002AE4F8 0x8031E0F8 0xC420E8E4 */ .word 0xC420E8E4 # lwc1 $f0, -0x171C($at)
/* 0x002AE4FC 0x8031E0FC 0x3C01801D */ .word 0x3C01801D # lui $at, 0x801D
/* 0x002AE500 0x8031E100 0xE42006FC */ .word 0xE42006FC # swc1 $f0, 0x6FC($at)
/* 0x002AE504 0x8031E104 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x002AE508 0x8031E108 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x002AE50C 0x8031E10C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
