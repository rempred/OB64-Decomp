/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00261000_00271000.s
 * z64 range: 0x00266DB0..0x00266DD0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Thin wrapper leaf: jal 0x80211E80, addiu $a0,$a0,0x14; returns 0. */
/* function boundary candidate: func_00266DB0, size=32, kind=prologue */
func_00266DB0:
/* 0x00266DB0 0x802D69B0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00266DB4 0x802D69B4 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00266DB8 0x802D69B8 0x0C0847A0 */ .word 0x0C0847A0 # jal 0x80211E80
/* 0x00266DBC 0x802D69BC 0x24840014 */ .word 0x24840014 # addiu $a0, $a0, 0x14
/* 0x00266DC0 0x802D69C0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x00266DC4 0x802D69C4 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00266DC8 0x802D69C8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00266DCC 0x802D69CC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
