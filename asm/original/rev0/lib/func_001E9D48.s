/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_001E1000_001F1000.s
 * z64 range: 0x001E9D48..0x001E9D84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x20; reads lbu 0x14($a0)/lw 0xB4($a0), computes flags and tail-calls 0x801AD6A4, returns v0=1. jr $ra@0x001E9D7C + delay addiu $sp,0x20@0x001E9D80 (end 0x001E9D84). Split from plan idx-40 to separate the following frameless leaf. */
/* function boundary candidate: func_001E9D48, size=60, kind=prologue */
func_001E9D48:
/* 0x001E9D48 0x80259948 0x27BDFFE0 */ .word 0x27BDFFE0 # addiu $sp, $sp, -0x20
/* 0x001E9D4C 0x8025994C 0xAFBF0018 */ .word 0xAFBF0018 # sw $ra, 0x18($sp)
/* 0x001E9D50 0x80259950 0x90850014 */ .word 0x90850014 # lbu $a1, 0x14($a0)
/* 0x001E9D54 0x80259954 0x8C8600B4 */ .word 0x8C8600B4 # lw $a2, 0xB4($a0)
/* 0x001E9D58 0x80259958 0x00003821 */ .word 0x00003821 # move $a3, $zero
/* 0x001E9D5C 0x8025995C 0xAFA00010 */ .word 0xAFA00010 # sw $zero, 0x10($sp)
/* 0x001E9D60 0x80259960 0xAFA00014 */ .word 0xAFA00014 # sw $zero, 0x14($sp)
/* 0x001E9D64 0x80259964 0x38A50003 */ .word 0x38A50003 # xori $a1, $a1, 0x0003
/* 0x001E9D68 0x80259968 0x0005282B */ .word 0x0005282B # sltu $a1, $zero, $a1
/* 0x001E9D6C 0x8025996C 0x0C06B5A9 */ .word 0x0C06B5A9 # jal 0x801AD6A4
/* 0x001E9D70 0x80259970 0x30C60002 */ .word 0x30C60002 # andi $a2, $a2, 0x0002
/* 0x001E9D74 0x80259974 0x8FBF0018 */ .word 0x8FBF0018 # lw $ra, 0x18($sp)
/* 0x001E9D78 0x80259978 0x24020001 */ .word 0x24020001 # addiu $v0, $zero, 0x1
/* 0x001E9D7C 0x8025997C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x001E9D80 0x80259980 0x27BD0020 */ .word 0x27BD0020 # addiu $sp, $sp, 0x20
