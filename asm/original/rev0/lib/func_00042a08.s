/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00042A08..0x00042A44 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* parent prologue fn; jr $ra at 0x42A3C + delay 0x42A40 */
/* function boundary candidate: func_00042A08, size=60, kind=prologue */
func_00042A08:
/* 0x00042A08 0x800B2608 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00042A0C 0x800B260C 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x00042A10 0x800B2610 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x00042A14 0x800B2614 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00042A18 0x800B2618 0x00002821 */ .word 0x00002821 # move $a1, $zero
/* 0x00042A1C 0x800B261C 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x00042A20 0x800B2620 0x0C025348 */ .word 0x0C025348 # jal 0x80094D20
/* 0x00042A24 0x800B2624 0x00000000 */ .word 0x00000000 # nop
/* 0x00042A28 0x800B2628 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x00042A2C 0x800B262C 0x0C024CE0 */ .word 0x0C024CE0 # jal 0x80093380
/* 0x00042A30 0x800B2630 0x24050004 */ .word 0x24050004 # addiu $a1, $zero, 0x4
/* 0x00042A34 0x800B2634 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x00042A38 0x800B2638 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x00042A3C 0x800B263C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00042A40 0x800B2640 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
