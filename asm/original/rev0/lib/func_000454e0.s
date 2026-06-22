/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00041000_00051000.s
 * z64 range: 0x000454E0..0x00045514 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* frameless leaf (branch), jr $ra at 0x4550C */
func_000454e0:
/* 0x000454E0 0x800B50E0 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x000454E4 0x800B50E4 0x00042140 */ .word 0x00042140 # sll $a0, $a0, 5
/* 0x000454E8 0x800B50E8 0x3C018019 */ .word 0x3C018019 # lui $at, 0x8019
/* 0x000454EC 0x800B50EC 0x00240821 */ .word 0x00240821 # addu $at, $at, $a0
/* 0x000454F0 0x800B50F0 0x9024C411 */ .word 0x9024C411 # lbu $a0, -0x3BEF($at)
/* 0x000454F4 0x800B50F4 0x24020010 */ .word 0x24020010 # addiu $v0, $zero, 0x10
/* 0x000454F8 0x800B50F8 0x308300FF */ .word 0x308300FF # andi $v1, $a0, 0x00FF
/* 0x000454FC 0x800B50FC 0x14620003 */ .word 0x14620003 # bne $v1, $v0, 0x800B510C
/* 0x00045500 0x800B5100 0x00000000 */ .word 0x00000000 # nop
/* 0x00045504 0x800B5104 0x3C048019 */ .word 0x3C048019 # lui $a0, 0x8019
/* 0x00045508 0x800B5108 0x90843C12 */ .word 0x90843C12 # lbu $a0, 0x3C12($a0)
/* 0x0004550C 0x800B510C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00045510 0x800B5110 0x00801021 */ .word 0x00801021 # move $v0, $a0
