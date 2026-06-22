/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004EA20..0x0004EA5C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x0004EA20; prologue, jr $ra at 0x0004EA54 + delay 0x0004EA58 */
/* function boundary candidate: func_0004EA20, size=60, kind=prologue */
func_0004EA20:
/* 0x0004EA20 0x800BE620 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0004EA24 0x800BE624 0xAFB00010 */ .word 0xAFB00010 # sw $s0, 0x10($sp)
/* 0x0004EA28 0x800BE628 0xAFBF0014 */ .word 0xAFBF0014 # sw $ra, 0x14($sp)
/* 0x0004EA2C 0x800BE62C 0x0C089DBB */ .word 0x0C089DBB # jal 0x802276EC
/* 0x0004EA30 0x800BE630 0x00808021 */ .word 0x00808021 # move $s0, $a0
/* 0x0004EA34 0x800BE634 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x0004EA38 0x800BE638 0x240300FF */ .word 0x240300FF # addiu $v1, $zero, 0xFF
/* 0x0004EA3C 0x800BE63C 0x14430003 */ .word 0x14430003 # bne $v0, $v1, 0x800BE64C
/* 0x0004EA40 0x800BE640 0x00000000 */ .word 0x00000000 # nop
/* 0x0004EA44 0x800BE644 0x0C072227 */ .word 0x0C072227 # jal 0x801C889C
/* 0x0004EA48 0x800BE648 0x02002021 */ .word 0x02002021 # move $a0, $s0
/* 0x0004EA4C 0x800BE64C 0x8FBF0014 */ .word 0x8FBF0014 # lw $ra, 0x14($sp)
/* 0x0004EA50 0x800BE650 0x8FB00010 */ .word 0x8FB00010 # lw $s0, 0x10($sp)
/* 0x0004EA54 0x800BE654 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004EA58 0x800BE658 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
