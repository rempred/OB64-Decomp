/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x000118F0..0x00011920 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_000118F0, size=48, kind=prologue */
func_000118F0:
/* 0x000118F0 0x800814F0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x000118F4 0x800814F4 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x000118F8 0x800814F8 0x0C020F33 */ .word 0x0C020F33 # jal 0x80083CCC
/* 0x000118FC 0x800814FC 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00011900 0x80081500 0x00408021 */ .word 0x00408021 # move $s0, $v0
/* 0x00011904 0x80081504 0x0C0207B2 */ .word 0x0C0207B2 # jal 0x80081EC8
/* 0x00011908 0x80081508 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x0001190C 0x8008150C 0x02001021 */ .word 0x02001021 # move $v0, $s0
/* 0x00011910 0x80081510 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00011914 0x80081514 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00011918 0x80081518 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0001191C 0x8008151C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
