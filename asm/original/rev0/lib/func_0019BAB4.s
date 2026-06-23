/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00191000_001A1000.s
 * z64 range: 0x0019BAB4..0x0019BAE4 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18; jal 0x8017C384 then clears global at 0x8022:-0x60C8. jr $ra@0x19BADC + delay addiu $sp,0x18@0x19BAE0. */
/* function boundary candidate: func_0019BAB4, size=128, kind=prologue */
func_0019BAB4:
/* 0x0019BAB4 0x8020B6B4 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0019BAB8 0x8020B6B8 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0019BABC 0x8020B6BC 0x3C108022 */ .word 0x3C108022 # lui $s0, 0x8022
/* 0x0019BAC0 0x8020B6C0 0x26109F38 */ .word 0x26109F38 # addiu $s0, $s0, -0x60C8
/* 0x0019BAC4 0x8020B6C4 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0019BAC8 0x8020B6C8 0x0C05F0E1 */ .word 0x0C05F0E1 # jal 0x8017C384
/* 0x0019BACC 0x8020B6CC 0x8E040000 */ .word 0x8E040000 # lw $a0, 0x0($s0)
/* 0x0019BAD0 0x8020B6D0 0xAE000000 */ .word 0xAE000000 # sw $zero, 0x0($s0)
/* 0x0019BAD4 0x8020B6D4 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0019BAD8 0x8020B6D8 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0019BADC 0x8020B6DC 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0019BAE0 0x8020B6E0 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
