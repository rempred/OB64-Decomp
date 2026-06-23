/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00264B1C..0x00264B50 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Leaf; jal 0x8020EE30 then jal 0x8020FBC0, jr$ra@0x00264B48 + delay addiu$sp@0x00264B4C. Slice-start function (no glabel in file). */
/* function boundary candidate: func_00264B1C, size=52, kind=prologue */
func_00264B1C:
/* 0x00264B1C 0x802D471C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00264B20 0x802D4720 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00264B24 0x802D4724 0x24900018 */ .word 0x24900018 # addiu $s0, $a0, 0x18
/* 0x00264B28 0x802D4728 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00264B2C 0x802D472C 0x0C083B8C */ .word 0x0C083B8C # jal 0x8020EE30
/* 0x00264B30 0x802D4730 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00264B34 0x802D4734 0x0C083EF0 */ .word 0x0C083EF0 # jal 0x8020FBC0
/* 0x00264B38 0x802D4738 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00264B3C 0x802D473C 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00264B40 0x802D4740 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00264B44 0x802D4744 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00264B48 0x802D4748 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00264B4C 0x802D474C 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
