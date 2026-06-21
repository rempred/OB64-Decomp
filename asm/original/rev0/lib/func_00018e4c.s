/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00011000_00021000.s
 * z64 range: 0x00018E4C..0x00018E84 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00018E4C, size=220, kind=prologue */
func_00018E4C:
/* 0x00018E4C 0x80088A4C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00018E50 0x80088A50 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00018E54 0x80088A54 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00018E58 0x80088A58 0x0C023E07 */ .word 0x0C023E07 # jal 0x8008F81C
/* 0x00018E5C 0x80088A5C 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00018E60 0x80088A60 0x3C05800B */ .word 0x3C05800B # lui $a1, 0x800B
/* 0x00018E64 0x80088A64 0x8CA59E54 */ .word 0x8CA59E54 # lw $a1, -0x61AC($a1)
/* 0x00018E68 0x80088A68 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00018E6C 0x80088A6C 0x0C023DFF */ .word 0x0C023DFF # jal 0x8008F7FC
/* 0x00018E70 0x80088A70 0x24A50014 */ .word 0x24A50014 # addiu $a1, $a1, 0x14
/* 0x00018E74 0x80088A74 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00018E78 0x80088A78 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00018E7C 0x80088A7C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00018E80 0x80088A80 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
