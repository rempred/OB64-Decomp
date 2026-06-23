/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BD2C..0x0020BD5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Callback dispatcher (vtable slot 0x4), frame -0x18, jalr $v0. 2-word read-before-write preamble at 0x0020BD2C folded forward into prologue at 0x0020BD34 (reads $v0 via lw $v0,0x4($v0)). Ends jr $ra @0x0020BD54 + delay 0x0020BD58. */
func_0020BD2C:
/* 0x0020BD2C 0x8027B92C 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020BD30 0x8027B930 0x8C420810 */ .word 0x8C420810 # lw $v0, 0x810($v0)

/* function boundary candidate: func_0020BD34, size=40, kind=prologue */
func_0020BD34:
/* 0x0020BD34 0x8027B934 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020BD38 0x8027B938 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020BD3C 0x8027B93C 0x8C420004 */ .word 0x8C420004 # lw $v0, 0x4($v0)
/* 0x0020BD40 0x8027B940 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x8027B950
/* 0x0020BD44 0x8027B944 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BD48 0x8027B948 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x0020BD4C 0x8027B94C 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BD50 0x8027B950 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020BD54 0x8027B954 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BD58 0x8027B958 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
