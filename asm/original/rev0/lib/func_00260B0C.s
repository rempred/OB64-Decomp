/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00251000_00261000.s
 * z64 range: 0x00260B0C..0x00260B44 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frame addiu$sp,-0x18. jal 0x8020BC78 lookup, returns lw 0xC of result. jr$ra@0x00260B3C + delay addiu$sp,0x18@0x00260B40. */
/* function boundary candidate: func_00260B0C, size=56, kind=prologue */
func_00260B0C:
/* 0x00260B0C 0x802D070C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00260B10 0x802D0710 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00260B14 0x802D0714 0x00008021 */ .word 0x00008021 # move $s0, $zero
/* 0x00260B18 0x802D0718 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00260B1C 0x802D071C 0x0C082F1E */ .word 0x0C082F1E # jal 0x8020BC78
/* 0x00260B20 0x802D0720 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00260B24 0x802D0724 0x50400003 */ .word 0x50400003 # beql $v0, $zero, 0x802D0734
/* 0x00260B28 0x802D0728 0x02001021 */ .word 0x02001021 # move $v0, $s0
/* 0x00260B2C 0x802D072C 0x8C50000C */ .word 0x8C50000C # lw $s0, 0xC($v0)
/* 0x00260B30 0x802D0730 0x02001021 */ .word 0x02001021 # move $v0, $s0
/* 0x00260B34 0x802D0734 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00260B38 0x802D0738 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00260B3C 0x802D073C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00260B40 0x802D0740 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
