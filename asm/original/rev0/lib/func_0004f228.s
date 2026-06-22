/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x0004F228..0x0004F254 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* un-merged from parent 0x0004F1F0: fresh frameless entry (lui/lw read-before-write of 0x800F global), jr $ra at 0x0004F24C + delay 0x0004F250 */
func_0004f228:
/* 0x0004F228 0x800BEE28 0x3C03800F */ .word 0x3C03800F # lui $v1, 0x800F
/* 0x0004F22C 0x800BEE2C 0x8C639BA0 */ .word 0x8C639BA0 # lw $v1, -0x6460($v1)
/* 0x0004F230 0x800BEE30 0x24620008 */ .word 0x24620008 # addiu $v0, $v1, 0x8
/* 0x0004F234 0x800BEE34 0x3C01800F */ .word 0x3C01800F # lui $at, 0x800F
/* 0x0004F238 0x800BEE38 0xAC229BA0 */ .word 0xAC229BA0 # sw $v0, -0x6460($at)
/* 0x0004F23C 0x800BEE3C 0x3C02DE00 */ .word 0x3C02DE00 # lui $v0, 0xDE00
/* 0x0004F240 0x800BEE40 0xAC620000 */ .word 0xAC620000 # sw $v0, 0x0($v1)
/* 0x0004F244 0x800BEE44 0x3C028019 */ .word 0x3C028019 # lui $v0, 0x8019
/* 0x0004F248 0x800BEE48 0x2442FD10 */ .word 0x2442FD10 # addiu $v0, $v0, -0x2F0
/* 0x0004F24C 0x800BEE4C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0004F250 0x800BEE50 0xAC620004 */ .word 0xAC620004 # sw $v0, 0x4($v1)
