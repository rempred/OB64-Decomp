/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201D50..0x00201D8C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf. Two-arg bounds check (sltiu/xori/or/bne) then 2D table lookup lbu; jr$ra@0x00201D84 + delay nop@0x00201D88. */
func_00201D50:
/* 0x00201D50 0x80271950 0x2C830005 */ .word 0x2C830005 # sltiu $v1, $a0, 0x5
/* 0x00201D54 0x80271954 0x38630001 */ .word 0x38630001 # xori $v1, $v1, 0x0001
/* 0x00201D58 0x80271958 0x2CA20004 */ .word 0x2CA20004 # sltiu $v0, $a1, 0x4
/* 0x00201D5C 0x8027195C 0x38420001 */ .word 0x38420001 # xori $v0, $v0, 0x0001
/* 0x00201D60 0x80271960 0x00621825 */ .word 0x00621825 # or $v1, $v1, $v0
/* 0x00201D64 0x80271964 0x14600007 */ .word 0x14600007 # bne $v1, $zero, 0x80271984
/* 0x00201D68 0x80271968 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x00201D6C 0x8027196C 0x3C03801D */ .word 0x3C03801D # lui $v1, 0x801D
/* 0x00201D70 0x80271970 0x2463EEC0 */ .word 0x2463EEC0 # addiu $v1, $v1, -0x1140
/* 0x00201D74 0x80271974 0x00041080 */ .word 0x00041080 # sll $v0, $a0, 2
/* 0x00201D78 0x80271978 0x00431021 */ .word 0x00431021 # addu $v0, $v0, $v1
/* 0x00201D7C 0x8027197C 0x00451021 */ .word 0x00451021 # addu $v0, $v0, $a1
/* 0x00201D80 0x80271980 0x90420000 */ .word 0x90420000 # lbu $v0, 0x0($v0)
/* 0x00201D84 0x80271984 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201D88 0x80271988 0x00000000 */ .word 0x00000000 # nop
