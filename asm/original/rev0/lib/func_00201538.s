/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201538..0x00201550 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor. andi/sll/lui/addu; jr$ra@0x00201548 + delay lbu@0x0020154C. */
func_00201538:
/* 0x00201538 0x80271138 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x0020153C 0x8027113C 0x00042040 */ .word 0x00042040 # sll $a0, $a0, 1
/* 0x00201540 0x80271140 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00201544 0x80271144 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201548 0x80271148 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x0020154C 0x8027114C 0x9042ECF0 */ .word 0x9042ECF0 # lbu $v0, -0x1310($v0)
