/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x0020156C..0x00201584 exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor: lui/lw 0x680/andi/addu; jr$ra@0x0020157C + delay lbu@0x201580. [adversarial: end corrected from 0x201598; trailing frameless leaf split off]. */
func_0020156C:
/* 0x0020156C 0x8027116C 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x00201570 0x80271170 0x8C420680 */ .word 0x8C420680 # lw $v0, 0x680($v0)
/* 0x00201574 0x80271174 0x3084FFFF */ .word 0x3084FFFF # andi $a0, $a0, 0xFFFF
/* 0x00201578 0x80271178 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x0020157C 0x8027117C 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201580 0x80271180 0x90420000 */ .word 0x90420000 # lbu $v0, 0x0($v0)
