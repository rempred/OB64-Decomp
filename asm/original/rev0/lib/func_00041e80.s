/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x00041E80..0x00041EC0 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x41C20: frameless leaf, entry move $v1,$zero/move $a0,$zero; jr $ra at 0x41EB8 + delay nop */
func_00041e80:
/* 0x00041E80 0x800B1A80 0x00001821 */ .word 0x00001821 # move $v1, $zero
/* 0x00041E84 0x800B1A84 0x00002021 */ .word 0x00002021 # move $a0, $zero
/* 0x00041E88 0x800B1A88 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x00041E8C 0x800B1A8C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00041E90 0x800B1A90 0x90423BD1 */ .word 0x90423BD1 # lbu $v0, 0x3BD1($v0)
/* 0x00041E94 0x800B1A94 0x2442FFAF */ .word 0x2442FFAF # addiu $v0, $v0, -0x51
/* 0x00041E98 0x800B1A98 0x2C420003 */ .word 0x2C420003 # sltiu $v0, $v0, 0x3
/* 0x00041E9C 0x800B1A9C 0x14400006 */ .word 0x14400006 # bne $v0, $zero, 0x800B1AB8
/* 0x00041EA0 0x800B1AA0 0x306200FF */ .word 0x306200FF # andi $v0, $v1, 0x00FF
/* 0x00041EA4 0x800B1AA4 0x24630001 */ .word 0x24630001 # addiu $v1, $v1, 0x1
/* 0x00041EA8 0x800B1AA8 0x28620064 */ .word 0x28620064 # slti $v0, $v1, 0x64
/* 0x00041EAC 0x800B1AAC 0x1440FFF6 */ .word 0x1440FFF6 # bne $v0, $zero, 0x800B1A88
/* 0x00041EB0 0x800B1AB0 0x24840038 */ .word 0x24840038 # addiu $a0, $a0, 0x38
/* 0x00041EB4 0x800B1AB4 0x240200FF */ .word 0x240200FF # addiu $v0, $zero, 0xFF
/* 0x00041EB8 0x800B1AB8 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00041EBC 0x800B1ABC 0x00000000 */ .word 0x00000000 # nop
