/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00264F24..0x00264F58 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Leaf; jal 0x8020EE30 then jal 0x80210000, jr$ra@0x00264F50 + delay@0x00264F54. */
/* function boundary candidate: func_00264F24, size=52, kind=prologue */
func_00264F24:
/* 0x00264F24 0x802D4B24 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00264F28 0x802D4B28 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00264F2C 0x802D4B2C 0x24900018 */ .word 0x24900018 # addiu $s0, $a0, 0x18
/* 0x00264F30 0x802D4B30 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00264F34 0x802D4B34 0x0C083B8C */ .word 0x0C083B8C # jal 0x8020EE30
/* 0x00264F38 0x802D4B38 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00264F3C 0x802D4B3C 0x0C084000 */ .word 0x0C084000 # jal 0x80210000
/* 0x00264F40 0x802D4B40 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00264F44 0x802D4B44 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00264F48 0x802D4B48 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00264F4C 0x802D4B4C 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00264F50 0x802D4B50 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00264F54 0x802D4B54 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
