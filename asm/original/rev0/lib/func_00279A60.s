/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00271000_00281000.s
 * z64 range: 0x00279A60..0x00279A90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18. jal 0x801C8FE8 / jal 0x801CA100, mtc1 + cvt.s.w to return float in $f0. jr$ra@0x00279A88 + delay addiu$sp@0x00279A8C. */
/* function boundary candidate: func_00279A60, size=48, kind=prologue */
func_00279A60:
/* 0x00279A60 0x802E9660 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00279A64 0x802E9664 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00279A68 0x802E9668 0x0C0723FA */ .word 0x0C0723FA # jal 0x801C8FE8
/* 0x00279A6C 0x802E966C 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00279A70 0x802E9670 0x0C072840 */ .word 0x0C072840 # jal 0x801CA100
/* 0x00279A74 0x802E9674 0x00402021 */ .word 0x00402021 # move $a0, $v0
/* 0x00279A78 0x802E9678 0x44820000 */ .word 0x44820000 # mtc1 $v0, $f0
/* 0x00279A7C 0x802E967C 0x00000000 */ .word 0x00000000 # nop
/* 0x00279A80 0x802E9680 0x46800020 */ .word 0x46800020 # cvt.s.w $f0, $f0
/* 0x00279A84 0x802E9684 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00279A88 0x802E9688 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00279A8C 0x802E968C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
