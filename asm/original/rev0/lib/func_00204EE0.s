/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00204EE0..0x00204F24 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Prologue addiu $sp,-0x18; jal 0x801C2CE4 lookup. Real return jr$ra at 0x00204F1C + delay addiu $sp,0x18 at 0x00204F20. The j 0x801C1A84 at 0x00204F00 is an overlay tail-jump kept internal. */
/* function boundary candidate: func_00204EE0, size=84, kind=prologue */
func_00204EE0:
/* 0x00204EE0 0x80274AE0 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00204EE4 0x80274AE4 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00204EE8 0x80274AE8 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00204EEC 0x80274AEC 0x0C070B39 */ .word 0x0C070B39 # jal 0x801C2CE4
/* 0x00204EF0 0x80274AF0 0x00A08021 */ .word 0x00A08021 # move $s0, $a1
/* 0x00204EF4 0x80274AF4 0x00401821 */ .word 0x00401821 # move $v1, $v0
/* 0x00204EF8 0x80274AF8 0x14600003 */ .word 0x14600003 # bne $v1, $zero, 0x80274B08
/* 0x00204EFC 0x80274AFC 0x00101080 */ .word 0x00101080 # sll $v0, $s0, 2
/* 0x00204F00 0x80274B00 0x080706A1 */ .word 0x080706A1 # j 0x801C1A84
/* 0x00204F04 0x80274B04 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00204F08 0x80274B08 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00204F0C 0x80274B0C 0x8C420000 */ .word 0x8C420000 # lw $v0, 0x0($v0)
/* 0x00204F10 0x80274B10 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00204F14 0x80274B14 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00204F18 0x80274B18 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00204F1C 0x80274B1C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00204F20 0x80274B20 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
