/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020BD5C..0x0020BD8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Callback dispatcher (vtable slot 0x8), frame -0x18, jalr $v0. 2-word read-before-write preamble at 0x0020BD5C folded forward into prologue at 0x0020BD64 (reads $v0 via lw $v0,0x8($v0)). Ends jr $ra @0x0020BD84 + delay 0x0020BD88. */
func_0020BD5C:
/* 0x0020BD5C 0x8027B95C 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020BD60 0x8027B960 0x8C420810 */ .word 0x8C420810 # lw $v0, 0x810($v0)

/* function boundary candidate: func_0020BD64, size=40, kind=prologue */
func_0020BD64:
/* 0x0020BD64 0x8027B964 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020BD68 0x8027B968 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020BD6C 0x8027B96C 0x8C420008 */ .word 0x8C420008 # lw $v0, 0x8($v0)
/* 0x0020BD70 0x8027B970 0x10400003 */ .word 0x10400003 # beq $v0, $zero, 0x8027B980
/* 0x0020BD74 0x8027B974 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BD78 0x8027B978 0x0040F809 */ .word 0x0040F809 # jalr $v0
/* 0x0020BD7C 0x8027B97C 0x00000000 */ .word 0x00000000 # nop
/* 0x0020BD80 0x8027B980 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020BD84 0x8027B984 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020BD88 0x8027B988 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
