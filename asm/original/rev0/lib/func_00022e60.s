/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00021000_00031000.s
 * z64 range: 0x00022E60..0x00022E90 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* function boundary candidate: func_00022E60, size=44, kind=leaf */
func_00022E60:
/* 0x00022E60 0x80092A60 0x3C03800B */ .word 0x3C03800B # lui $v1, 0x800B
/* 0x00022E64 0x80092A64 0x8C63A740 */ .word 0x8C63A740 # lw $v1, -0x58C0($v1)
/* 0x00022E68 0x80092A68 0x00031880 */ .word 0x00031880 # sll $v1, $v1, 2
/* 0x00022E6C 0x80092A6C 0x24620002 */ .word 0x24620002 # addiu $v0, $v1, 0x2
/* 0x00022E70 0x80092A70 0x24630003 */ .word 0x24630003 # addiu $v1, $v1, 0x3
/* 0x00022E74 0x80092A74 0x00430018 */ .word 0x00430018 # mult $v0, $v1
/* 0x00022E78 0x80092A78 0x00001012 */ .word 0x00001012 # mflo $v0
/* 0x00022E7C 0x80092A7C 0x00021082 */ .word 0x00021082 # srl $v0, $v0, 2
/* 0x00022E80 0x80092A80 0x3C01800B */ .word 0x3C01800B # lui $at, 0x800B
/* 0x00022E84 0x80092A84 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00022E88 0x80092A88 0xAC22A740 */ .word 0xAC22A740 # sw $v0, -0x58C0($at)
/* 0x00022E8C 0x80092A8C 0x00000000 */ .word 0x00000000 # nop
