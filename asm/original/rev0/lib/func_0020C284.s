/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020C284..0x0020C2C0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Framed routine addiu$sp,-0x18; jal 0x8016DE1C; j 0x801C8E24 tail; jr$ra at C2B8/delay C2BC. */
/* function boundary candidate: func_0020C284, size=304, kind=prologue */
func_0020C284:
/* 0x0020C284 0x8027BE84 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x0020C288 0x8027BE88 0x00801021 */ .word 0x00801021 # move $v0, $a0
/* 0x0020C28C 0x8027BE8C 0x10400008 */ .word 0x10400008 # beq $v0, $zero, 0x8027BEB0
/* 0x0020C290 0x8027BE90 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x0020C294 0x8027BE94 0x9044004B */ .word 0x9044004B # lbu $a0, 0x4B($v0)
/* 0x0020C298 0x8027BE98 0x0C05B787 */ .word 0x0C05B787 # jal 0x8016DE1C
/* 0x0020C29C 0x8027BE9C 0x9045004F */ .word 0x9045004F # lbu $a1, 0x4F($v0)
/* 0x0020C2A0 0x8027BEA0 0x304200FF */ .word 0x304200FF # andi $v0, $v0, 0x00FF
/* 0x0020C2A4 0x8027BEA4 0x38420002 */ .word 0x38420002 # xori $v0, $v0, 0x0002
/* 0x0020C2A8 0x8027BEA8 0x08072389 */ .word 0x08072389 # j 0x801C8E24
/* 0x0020C2AC 0x8027BEAC 0x2C420001 */ .word 0x2C420001 # sltiu $v0, $v0, 0x1
/* 0x0020C2B0 0x8027BEB0 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x0020C2B4 0x8027BEB4 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x0020C2B8 0x8027BEB8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020C2BC 0x8027BEBC 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
