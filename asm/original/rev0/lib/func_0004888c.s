/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004888C..0x000488CC exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* prologue frame 0x18 leaf; single jr $ra at 0x488C4 + delay. */
/* function boundary candidate: func_0004888C, size=64, kind=prologue */
func_0004888C:
/* 0x0004888C 0x800B848C 0x27BDFFE8 */ .word 0x27BDFFE8 # addiu $sp, $sp, -0x18
/* 0x00048890 0x800B8490 0xAFBF0010 */ .word 0xAFBF0010 # sw $ra, 0x10($sp)
/* 0x00048894 0x800B8494 0x0C05ADCE */ .word 0x0C05ADCE # jal 0x8016B738
/* 0x00048898 0x800B8498 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x0004889C 0x800B849C 0x3043FFFF */ .word 0x3043FFFF # andi $v1, $v0, 0xFFFF
/* 0x000488A0 0x800B84A0 0x2C620028 */ .word 0x2C620028 # sltiu $v0, $v1, 0x28
/* 0x000488A4 0x800B84A4 0x14400003 */ .word 0x14400003 # bne $v0, $zero, 0x800B84B4
/* 0x000488A8 0x800B84A8 0x00031080 */ .word 0x00031080 # sll $v0, $v1, 2
/* 0x000488AC 0x800B84AC 0x0805CA70 */ .word 0x0805CA70 # j 0x801729C0
/* 0x000488B0 0x800B84B0 0x00001021 */ .word 0x00001021 # move $v0, $zero
/* 0x000488B4 0x800B84B4 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000488B8 0x800B84B8 0x00220821 */ .word 0x00220821 # addu $at, $at, $v0
/* 0x000488BC 0x800B84BC 0x90223AC3 */ .word 0x90223AC3 # lbu $v0, 0x3AC3($at)
/* 0x000488C0 0x800B84C0 0x8FBF0010 */ .word 0x8FBF0010 # lw $ra, 0x10($sp)
/* 0x000488C4 0x800B84C4 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x000488C8 0x800B84C8 0x27BD0018 */ .word 0x27BD0018 # addiu $sp, $sp, 0x18
