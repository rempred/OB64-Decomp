/*
 * Original Rev 0 MIPS reference split.
 * Parent source: asm/original/rev0/code_00201000_00211000.s
 * z64 range: 0x00201550..0x0020156C exclusive
 * Decode comments are aids, not proof of semantic function boundaries.
 */
.set noat
.set noreorder
.text

/* Frameless leaf accessor. andi/sll/lui/addu/lbu; jr$ra@0x00201564 + delay andi@0x00201568. */
func_00201550:
/* 0x00201550 0x80271150 0x308400FF */ .word 0x308400FF # andi $a0, $a0, 0x00FF
/* 0x00201554 0x80271154 0x00042040 */ .word 0x00042040 # sll $a0, $a0, 1
/* 0x00201558 0x80271158 0x3C02801D */ .word 0x3C02801D # lui $v0, 0x801D
/* 0x0020155C 0x8027115C 0x00441021 */ .word 0x00441021 # addu $v0, $v0, $a0
/* 0x00201560 0x80271160 0x9042ECF1 */ .word 0x9042ECF1 # lbu $v0, -0x130F($v0)
/* 0x00201564 0x80271164 0x03E00008 */ .word 0x03E00008 # jr $ra
/* 0x00201568 0x80271168 0x3042000F */ .word 0x3042000F # andi $v0, $v0, 0x000F
